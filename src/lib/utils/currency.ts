import Dinero from 'dinero.js';

// Configure Dinero global defaults if needed, but usually per-instance is fine.
// Dinero.js v1 uses objects.

/**
 * Converts a float amount (e.g. 10.50) to cents (1050).
 * Useful for handling user input before storage.
 */
export function toCents(amount: number): number {
    // We use Math.round to avoid floating point artifacts like 10.50 * 100 = 1050.00000000001
    return Math.round(amount * 100);
}

/**
 * Converts cents (1050) to a float (10.50).
 * ONLY used for display purposes or initial form population.
 */
export function fromCents(cents: number): number {
    return cents / 100;
}

/**
 * Formats cents into a currency string.
 * @param cents Integer amount in cents
 * @param currency Currency code (e.g. 'USD')
 */
export function formatCurrency(cents: number, currency: string = 'USD'): string {
    return Dinero({ amount: cents, currency }).toFormat('$0,0.00');
}

/**
 * Adds two monetary values.
 * @param amountA Cents
 * @param amountB Cents
 * @param currency Currency code
 */
export function addMoney(amountA: number, amountB: number, currency: string = 'USD'): number {
    const a = Dinero({ amount: amountA, currency });
    const b = Dinero({ amount: amountB, currency });
    return a.add(b).getAmount();
}

/**
 * Subtracts two monetary values.
 * @param amountA Cents
 * @param amountB Cents
 * @param currency Currency code
 */
export function subtractMoney(amountA: number, amountB: number, currency: string = 'USD'): number {
    const a = Dinero({ amount: amountA, currency });
    const b = Dinero({ amount: amountB, currency });
    return a.subtract(b).getAmount();
}

/**
 * Multiplies a monetary value by a factor.
 * @param amount Cents
 * @param factor Multiplier
 * @param currency Currency code
 */
export function multiplyMoney(amount: number, factor: number, currency: string = 'USD'): number {
    return Dinero({ amount, currency }).multiply(factor).getAmount();
}

/**
 * Allocates money into parts (e.g. for splitting budget).
 */
export function allocateMoney(amount: number, ratios: number[], currency: string = 'USD'): number[] {
    return Dinero({ amount, currency }).allocate(ratios).map((d: Dinero.Dinero) => d.getAmount());
}
