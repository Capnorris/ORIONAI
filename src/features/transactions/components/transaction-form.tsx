'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateTransactionInput, CreateTransactionInputSchema } from '../types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'; // Assuming shadcn form wrapper exists or we use raw
// Actually shadcn form requires a lot of boilerplate. I will use raw react-hook-form for simplicity unless requested otherwise.
// The PRD says "shadcn/ui". I should probably use the components I installed.
// But I didn't install "form". I'll use raw inputs with shadcn styling for now to save time, or install form.
// Let's stick to raw inputs with shadcn classes.

import { toCents, fromCents } from '@/lib/utils/currency';
import { useTransactions } from '../hooks/use-transactions';
import { useEffect, useState } from 'react';

import { createClient } from '@/lib/supabase/client';

export function TransactionForm({ initialData, onSuccess }: { initialData?: import('../types').Transaction, onSuccess?: () => void }) {
    const { addTransaction, updateTransaction } = useTransactions();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        const supabase = createClient();
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) {
                setUserId(session.user.id);
            }
        });
    }, []);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<CreateTransactionInput>({
        resolver: zodResolver(CreateTransactionInputSchema),
        defaultValues: {
            amount: initialData ? fromCents(initialData.amount_cents) : undefined,
            currency: initialData?.currency || 'USD',
            date: initialData ? new Date(initialData.date) : new Date(),
            merchant: initialData?.merchant || undefined,
        }
    });

    const onSubmit = async (data: CreateTransactionInput) => {
        if (!userId) {
            alert("You must be logged in to add transactions.");
            return;
        }
        setIsSubmitting(true);
        try {
            const amountCents = toCents(data.amount);

            if (initialData) {
                await updateTransaction(initialData.id, {
                    amount_cents: amountCents,
                    currency: data.currency,
                    date: data.date.toISOString(),
                    merchant: data.merchant || null,
                });
            } else {
                await addTransaction({
                    user_id: userId,
                    amount_cents: amountCents,
                    currency: data.currency,
                    date: data.date.toISOString(),
                    merchant: data.merchant || null,
                    original_amount_cents: null,
                    original_currency: null,
                    fx_rate_snapshot: null,
                    category_id: null,
                    receipt_url: null,
                });
                reset();
            }

            if (onSuccess) onSuccess();
        } catch (e) {
            console.error(e);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
                <label className="text-sm font-medium text-white">Amount</label>
                <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    className="bg-white/5 border-white/10 text-white placeholder:text-muted-foreground focus:border-primary/50 focus:ring-primary/20"
                    {...register('amount', { valueAsNumber: true })}
                />
                {errors.amount && <p className="text-red-400 text-xs">{errors.amount.message}</p>}
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-white">Merchant</label>
                <Input
                    type="text"
                    placeholder="Starbucks"
                    className="bg-white/5 border-white/10 text-white placeholder:text-muted-foreground focus:border-primary/50 focus:ring-primary/20"
                    {...register('merchant')}
                />
            </div>

            <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary hover:bg-primary/90 text-white shadow-[0_0_20px_rgba(139,92,246,0.2)] transition-all hover:scale-[1.02]"
            >
                {isSubmitting ? 'Saving...' : (initialData ? 'Update Transaction' : 'Add Transaction')}
            </Button>
        </form>
    );
}
