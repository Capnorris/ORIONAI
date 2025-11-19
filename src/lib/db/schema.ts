import { Generated, ColumnType } from 'kysely';

export interface Database {
    users: UsersTable;
    transactions: TransactionsTable;
    recurring_rules: RecurringRulesTable;
}

export interface UsersTable {
    id: Generated<string>;
    email: string;
    license_key: string | null;
    lifetime_access: number; // SQLite uses 0/1 for boolean
    base_currency: string;
    created_at: string;
}

export interface TransactionsTable {
    id: Generated<string>;
    user_id: string;
    amount_cents: number; // Integer
    currency: string;

    // Foreign Exchange Data
    original_amount_cents: number | null; // Integer
    original_currency: string | null;
    fx_rate_snapshot: number | null; // Stored as REAL/NUMERIC in SQLite, handled as number in JS

    date: string;
    merchant: string | null;
    category_id: string | null;
    receipt_url: string | null;

    // Sync Metadata
    created_at: string;
    updated_at: string;
}

export interface RecurringRulesTable {
    id: Generated<string>;
    user_id: string;
    rrule_string: string;
    amount_cents: number;
    active: number; // SQLite uses 0/1 for boolean
    start_date: string;
    end_date: string | null;
}
