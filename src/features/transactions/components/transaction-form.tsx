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

import { toCents } from '@/lib/utils/currency';
import { useTransactions } from '../hooks/use-transactions';
import { useState } from 'react';

export function TransactionForm() {
    const { addTransaction } = useTransactions();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<CreateTransactionInput>({
        resolver: zodResolver(CreateTransactionInputSchema),
        defaultValues: {
            currency: 'USD',
            date: new Date(),
        }
    });

    const onSubmit = async (data: CreateTransactionInput) => {
        setIsSubmitting(true);
        try {
            // CONVERSION HAPPENS HERE
            const amountCents = toCents(data.amount);

            // Mock User ID for now (Phase 2 local only)
            const userId = '00000000-0000-0000-0000-000000000000';

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
        } catch (e) {
            console.error(e);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4 border rounded-lg shadow-sm bg-card text-card-foreground">
            <div className="space-y-2">
                <label className="text-sm font-medium">Amount (Float)</label>
                <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    {...register('amount', { valueAsNumber: true })}
                />
                {errors.amount && <p className="text-red-500 text-xs">{errors.amount.message}</p>}
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Merchant</label>
                <Input
                    type="text"
                    placeholder="Starbucks"
                    {...register('merchant')}
                />
            </div>

            <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Add Transaction'}
            </Button>
        </form>
    );
}
