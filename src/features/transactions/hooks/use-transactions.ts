import { usePowerSync } from '@/providers/powersync-provider';
import { useEffect, useState } from 'react';
import { Transaction } from '../types';

export function useTransactions() {
    const db = usePowerSync();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const abortController = new AbortController();

        const fetchTransactions = async () => {
            try {
                // Subscribe to changes
                // Note: PowerSync's onChange listener or a watched query is better.
                // For simplicity in this phase, we'll use a watched query pattern if available,
                // or just a simple query + polling/subscription.
                // The standard way is db.watch(...)

                const query = 'SELECT * FROM transactions ORDER BY date DESC';

                // Using watch to get real-time updates
                const result = db.watch(query, [], {
                    signal: abortController.signal
                });

                // result is an AsyncGenerator or similar depending on SDK version.
                // Actually, typically we use hooks provided by @powersync/react if available, 
                // but here we are building a custom hook.

                for await (const resultBatch of result) {
                    setTransactions((resultBatch.rows?._array || []) as Transaction[]);
                    setLoading(false);
                }

            } catch (error) {
                console.error('Error fetching transactions:', error);
                setLoading(false);
            }
        };

        fetchTransactions();

        return () => {
            abortController.abort();
        };
    }, [db]);

    const addTransaction = async (data: Omit<Transaction, 'id' | 'created_at' | 'updated_at'>) => {
        await db.execute(
            `INSERT INTO transactions (id, user_id, amount_cents, currency, date, merchant, created_at, updated_at)
         VALUES (uuid(), ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
            [data.user_id, data.amount_cents, data.currency, data.date, data.merchant]
        );
    };

    return { transactions, loading, addTransaction };
}
