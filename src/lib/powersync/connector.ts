import { PowerSyncBackendConnector } from '@powersync/web';
import { createClient } from '@/lib/supabase/client';

export class SupabaseConnector implements PowerSyncBackendConnector {
    readonly client = createClient();

    async fetchCredentials() {
        const { data: { session }, error } = await this.client.auth.getSession();

        if (!session || error) {
            return null;
        }

        const token = session.access_token;

        return {
            endpoint: process.env.NEXT_PUBLIC_POWERSYNC_URL!,
            token: token,
        };
    }

    async uploadData(database: any) {
        // PowerSync handles the upload automatically via the sync service if configured.
        // However, if we need to manually trigger uploads or handle specific logic, we do it here.
        // For Supabase + PowerSync, usually the client writes to the local DB, 
        // and PowerSync syncs it to the backend.
        // But wait, PowerSync Web SDK writes to the local SQLite. 
        // The sync service reads from the backend (Supabase) and writes to local.
        // WRITES: The PowerSync Web SDK *queues* writes. 
        // We need to tell it how to send those writes to the backend.
        // Typically we implement `uploadData` to send the batch to an API endpoint 
        // OR we use the Supabase client to write directly if we want immediate consistency 
        // but that defeats offline-first.

        // Standard PowerSync pattern:
        // 1. Get batch from `database.getNextCrudTransaction()`
        // 2. Loop through operations
        // 3. Execute them against Supabase (using `client.from(table).insert/update/delete`)
        // 4. `transaction.complete()`

        const transaction = await database.getNextCrudTransaction();

        if (!transaction) {
            return;
        }

        try {
            for (const op of transaction.crud) {
                const table = this.client.from(op.table);
                let result;

                switch (op.op) {
                    case 'PUT':
                        // Upsert
                        result = await table.upsert(op.opData);
                        break;
                    case 'PATCH':
                        // Update
                        result = await table.update(op.opData).eq('id', op.id);
                        break;
                    case 'DELETE':
                        // Delete
                        result = await table.delete().eq('id', op.id);
                        break;
                }

                if (result?.error) {
                    console.error('Sync Error:', result.error);
                    // If error is fatal, throw. If it's conflict, handle it.
                    // For now we throw to retry.
                    throw new Error(result.error.message);
                }
            }

            await transaction.complete();
        } catch (e) {
            console.error(e);
            // Keep the transaction in the queue to retry later
        }
    }
}
