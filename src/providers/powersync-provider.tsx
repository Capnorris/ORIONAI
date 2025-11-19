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

    useEffect(() => {
        // Initialize PowerSync
        const powerSync = new PowerSyncDatabase({
            schema,
            database: {
                name: 'orion_db_v1',
            } as any,
        });

        const connector = new SupabaseConnector();

        const init = async () => {
            await powerSync.init();
            await powerSync.connect(connector);
            setDb(powerSync);
        };

        init();
    }, []);

    if (!db) {
        return <div className="flex items-center justify-center h-screen">Initializing Database...</div>;
    }

    return (
        <PowerSyncContext.Provider value={db}>
            {children}
        </PowerSyncContext.Provider>
    );
};
