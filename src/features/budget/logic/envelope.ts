import { differenceInDays, endOfMonth } from 'date-fns';

/**
 * Calculates the "Safe to Spend" daily amount.
 * Formula: (Remaining Budget / Days Left in Month)
 * 
 * @param remainingBudgetCents The amount of budget left in cents.
 * @param currentDate The current date (usually today).
 * @returns The daily safe spend amount in cents.
 */
export function calculateSafeToSpend(remainingBudgetCents: number, currentDate: Date = new Date()): number {
    const lastDayOfMonth = endOfMonth(currentDate);

    // Days left includes today? Usually yes.
    // differenceInDays(end, start) returns integer days.
    // If today is Jan 31, end is Jan 31, diff is 0. We want 1 day left.
    // So we add 1.
    const daysLeft = differenceInDays(lastDayOfMonth, currentDate) + 1;

    if (daysLeft <= 0) return 0; // Should not happen if currentDate <= endOfMonth

    // Integer division. We floor it to be safe.
    return Math.floor(remainingBudgetCents / daysLeft);
}
