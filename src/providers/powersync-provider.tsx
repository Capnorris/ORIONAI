'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { PowerSyncDatabase, Schema, Table, Column, ColumnType } from '@powersync/web';

import { SupabaseConnector } from '@/lib/powersync/connector';

// Define the PowerSync AppSchema
// This must match the server-side manifest and local usage.
const schema = new Schema({
    transactions: new Table({
        name: 'transactions',
        columns: [
            new Column({ name: 'user_id', type: ColumnType.TEXT }),
            new Column({ name: 'amount_cents', type: ColumnType.INTEGER }),
            new Column({ name: 'currency', type: ColumnType.TEXT }),
            new Column({ name: 'original_amount_cents', type: ColumnType.INTEGER }),
            new Column({ name: 'original_currency', type: ColumnType.TEXT }),
            new Column({ name: 'fx_rate_snapshot', type: ColumnType.REAL }),
            new Column({ name: 'date', type: ColumnType.TEXT }),
            new Column({ name: 'merchant', type: ColumnType.TEXT }),
            new Column({ name: 'category_id', type: ColumnType.TEXT }),
            new Column({ name: 'receipt_url', type: ColumnType.TEXT }),
            new Column({ name: 'created_at', type: ColumnType.TEXT }),
            new Column({ name: 'updated_at', type: ColumnType.TEXT })
        ]
    }),
    users: new Table({
        name: 'users',
        columns: [
            new Column({ name: 'email', type: ColumnType.TEXT }),
            new Column({ name: 'license_key', type: ColumnType.TEXT }),
            new Column({ name: 'lifetime_access', type: ColumnType.INTEGER }),
            new Column({ name: 'base_currency', type: ColumnType.TEXT }),
            new Column({ name: 'created_at', type: ColumnType.TEXT })
        ]
    }),
    recurring_rules: new Table({
        name: 'recurring_rules',
        columns: [
            new Column({ name: 'user_id', type: ColumnType.TEXT }),
            new Column({ name: 'rrule_string', type: ColumnType.TEXT }),
            new Column({ name: 'amount_cents', type: ColumnType.INTEGER }),
            new Column({ name: 'active', type: ColumnType.INTEGER }),
            new Column({ name: 'start_date', type: ColumnType.TEXT }),
            new Column({ name: 'end_date', type: ColumnType.TEXT })
        ]
    })
});

const PowerSyncContext = createContext<PowerSyncDatabase | null>(null);

export const usePowerSync = () => {
    const context = useContext(PowerSyncContext);
    if (!context) {
        // It's okay to return null during initialization, but ideally we handle loading state
        // For strictness, we can throw or return null and handle in UI
        throw new Error('usePowerSync must be used within a PowerSyncProvider');
    }
    return context;
};

export const PowerSyncProvider = ({ children }: { children: React.ReactNode }) => {
    const [db, setDb] = useState<PowerSyncDatabase | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let powerSync: PowerSyncDatabase;

        const init = async () => {
            try {
                console.log('Initializing PowerSync...');

                // Initialize PowerSync
                powerSync = new PowerSyncDatabase({
                    schema,
                    database: {
                        dbFilename: 'orion_db_v1.db',
                    },
                });

                await powerSync.init();
                console.log('PowerSync initialized successfully');

                // Try to connect if we have credentials
                const connector = new SupabaseConnector();
                try {
                    const credentials = await connector.fetchCredentials();
                    if (credentials) {
                        console.log('Connecting to PowerSync backend...');
                        await powerSync.connect(connector);
                        console.log('Connected to PowerSync backend');
                    } else {
                        console.log('No user session - running in local-only mode');
                    }
                } catch (connectError) {
                    console.warn('Failed to connect to backend, running local-only:', connectError);
                }

                setDb(powerSync);
            } catch (err) {
                console.error('PowerSync initialization failed:', err);
                setError(err instanceof Error ? err.message : 'Unknown error');
            }
        };

        init();

        return () => {
            if (powerSync) {
                powerSync.disconnectAndClear().catch(console.error);
            }
        };
    }, []);

    if (error) {
        return (
            <div className="flex items-center justify-center h-screen flex-col gap-4">
                <div className="text-red-500">Database Error: {error}</div>
                <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                    Retry
                </button>
            </div>
        );
    }

    if (!db) {
        return <div className="flex items-center justify-center h-screen">Initializing Database...</div>;
    }

    return (
        <PowerSyncContext.Provider value={db}>
            {children}
        </PowerSyncContext.Provider>
    );
};
