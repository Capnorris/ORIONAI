'use server';

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function generateInsight(userQuery: string, userId: string) {
    // 1. Security Check (Mock - in real app use cookies/headers to verify)
    if (!userId) {
        throw new Error('Unauthorized');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // 2. Data Fetch (Server-Side from Supabase)
    // Fetch last 30 days of transactions
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: transactions, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        .gte('date', thirtyDaysAgo.toISOString())
        .order('date', { ascending: false });

    if (error) {
        throw new Error(`Failed to fetch data: ${error.message}`);
    }

    // 3. LLM Simulation
    // In a real implementation, we would send `transactions` and `userQuery` to OpenAI.
    const totalSpentCents = transactions?.reduce((sum, t) => sum + t.amount_cents, 0) || 0;
    const totalSpent = (totalSpentCents / 100).toFixed(2);
    const count = transactions?.length || 0;

    return `[AI Coach Simulation]
  Query: "${userQuery}"
  Analysis: I analyzed your last 30 days of data directly from the secure cloud.
  - Total Transactions: ${count}
  - Total Spent: $${totalSpent}
  
  Insight: It looks like you are spending heavily on... [Placeholder for LLM analysis].
  `;
}
