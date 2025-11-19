import { z } from 'zod';

export const TransactionSchema = z.object({
    id: z.string().uuid(),
    user_id: z.string().uuid(),
    amount_cents: z.number().int(),
    currency: z.string().length(3),
    original_amount_cents: z.number().int().nullable().optional(),
    original_currency: z.string().length(3).nullable().optional(),
    fx_rate_snapshot: z.number().nullable().optional(),
    date: z.string().datetime(), // ISO string
    merchant: z.string().nullable().optional(),
    category_id: z.string().uuid().nullable().optional(),
    receipt_url: z.string().url().nullable().optional(),
    created_at: z.string(),
    updated_at: z.string(),
});

export type Transaction = z.infer<typeof TransactionSchema>;

export const CreateTransactionInputSchema = z.object({
    amount: z.number().positive(), // Float input from UI (e.g. 10.50)
    currency: z.string().length(3).default('USD'),
    date: z.date(),
    merchant: z.string().optional(),
});

export type CreateTransactionInput = z.infer<typeof CreateTransactionInputSchema>;
