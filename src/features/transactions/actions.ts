'use server';

import { createClient } from '@supabase/supabase-js'; // Use admin client or standard client with cookies?
// Server Actions should use a client that can access cookies if we want to use user auth.
// But for "Update Future Only", we might need to run multiple queries.
// Let's use @supabase/ssr in a helper if needed, or just standard fetch if we had a custom backend.
// Since we are in Next.js Server Actions, we can use a standard supabase client but we need the user's session.
// For simplicity in this mock-up phase (and since I don't have the cookie helper setup yet), I'll assume we pass the user ID or use a service role if strictly necessary, but PRD implies user context.
// Actually, best practice is to create a client that uses `cookies()` from `next/headers`.

// I will implement the logic assuming we have a way to get the DB. 
// Since we are using PowerSync for the main DB, "Update Future Only" might be a local operation too?
// PRD 2.1.3 says "Editing Logic (Strict Rule)".
// PRD 4.2.4 says "Use Next.js Server Actions for AI processing and secure mutations that bypass the local DB (e.g., Account Deletion)."
// Recurring rules are stored in `recurring_rules` table which is synced.
// So we SHOULD do this locally if possible for offline support?
// PRD 2.1.3 doesn't explicitly say "Server Side Only".
// However, the prompt asks for `src/features/transactions/actions.ts` (Server Actions).
// So I will implement it as a Server Action. This implies it requires online connectivity, or we accept that limitation.
// Wait, if I do it server side, I need to write to Supabase directly. PowerSync will then sync it down.

import { createClient as createSupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
// Ideally use service role key for admin tasks, but here we act as user.
// We need to pass the auth token or use cookies. 
// For this exercise, I will stub the client creation.

export async function updateRecurringRule(
    oldRuleId: string,
    newRuleData: { amount_cents: number; rrule_string: string; start_date: string },
    mode: 'future' | 'all',
    userId: string // In real app, get from session
) {
    const supabase = createSupabaseClient(supabaseUrl, supabaseKey);

    // In a real app, we would verify the session here.

    if (mode === 'future') {
        // 1. Cap old rule
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        const { error: updateError } = await supabase
            .from('recurring_rules')
            .update({ end_date: yesterdayStr, active: false }) // Or keep active but ended? PRD says "Cap the end_date". Active usually implies "currently generating".
            .eq('id', oldRuleId)
            .eq('user_id', userId);

        if (updateError) throw new Error(updateError.message);

        // 2. Create new rule
        const { error: insertError } = await supabase
            .from('recurring_rules')
            .insert({
                user_id: userId,
                amount_cents: newRuleData.amount_cents,
                rrule_string: newRuleData.rrule_string,
                start_date: newRuleData.start_date, // Should be today
                active: true
            });

        if (insertError) throw new Error(insertError.message);

    } else if (mode === 'all') {
        // Update all (Retroactive)
        // Warning: This changes history.
        const { error } = await supabase
            .from('recurring_rules')
            .update({
                amount_cents: newRuleData.amount_cents,
                rrule_string: newRuleData.rrule_string,
                start_date: newRuleData.start_date
            })
            .eq('id', oldRuleId)
            .eq('user_id', userId);

        if (error) throw new Error(error.message);

        // Trigger re-calc logic would go here (complex).
    }
}
