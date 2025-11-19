import { usePowerSync } from '@/providers/powersync-provider';
import { useEffect, useState } from 'react';
import { Transaction } from '../types';
import { createClient } from '@/lib/supabase/client';

export function useTransactions() {
    const db = usePowerSync();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState<string | null>(null);

    // Get current user
    useEffect(() => {
        const supabase = createClient();
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUserId(session?.user?.id ?? null);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUserId(session?.user?.id ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    useEffect(() => {
        // Don't fetch if no user is logged in
        if (!userId) {
            setTransactions([]);
            setLoading(false);
            return;
        }

        const abortController = new AbortController();

        const fetchTransactions = async () => {
            try {
                // Filter by user_id to only show current user's transactions
                const query = 'SELECT * FROM transactions WHERE user_id = ? ORDER BY date DESC';

                // Using watch to get real-time updates
                const result = db.watch(query, [userId], {
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
    }, [db, userId]);

    const addTransaction = async (data: Omit<Transaction, 'id' | 'created_at' | 'updated_at'>) => {
        await db.execute(
            `INSERT INTO transactions (id, user_id, amount_cents, currency, date, merchant, created_at, updated_at)
         VALUES (uuid(), ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
            [data.user_id, data.amount_cents, data.currency, data.date, data.merchant]
        );
    };

    const updateTransaction = async (id: string, data: Partial<Omit<Transaction, 'id' | 'created_at' | 'updated_at'>>) => {
        const keys = Object.keys(data).filter(k => k !== 'user_id'); // Don't allow changing user_id typically
        if (keys.length === 0) return;

        const setClause = keys.map(key => `${key} = ?`).join(', ');
        const values = keys.map(key => (data as any)[key]);

        await db.execute(
            `UPDATE transactions SET ${setClause}, updated_at = datetime('now') WHERE id = ?`,
            [...values, id]
        );
    };

    const deleteTransaction = async (id: string) => {
        await db.execute('DELETE FROM transactions WHERE id = ?', [id]);
    };

    return { transactions, loading, addTransaction, updateTransaction, deleteTransaction };
}
