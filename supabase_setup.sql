-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- USERS TABLE
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  license_key TEXT, -- For One-Time Purchase validation
  lifetime_access BOOLEAN DEFAULT FALSE,
  base_currency CHAR(3) DEFAULT 'USD',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- TRANSACTIONS TABLE
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  amount_cents INTEGER NOT NULL, -- $10.00 stored as 1000
  currency CHAR(3) NOT NULL,     -- 'USD'
  
  -- Foreign Exchange Data
  original_amount_cents INTEGER, -- e.g., 900 (9.00 EUR)
  original_currency CHAR(3),     -- 'EUR'
  fx_rate_snapshot NUMERIC(10, 6), -- 1.123456 (Rate at moment of purchase)
  
  date TIMESTAMPTZ NOT NULL,
  merchant TEXT,
  category_id UUID,
  receipt_url TEXT, -- Supabase Storage URL
  
  -- Sync Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RECURRING RULES TABLE
CREATE TABLE recurring_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  rrule_string TEXT NOT NULL, -- RFC 5545
  amount_cents INTEGER NOT NULL,
  active BOOLEAN DEFAULT TRUE,
  start_date DATE NOT NULL,
  end_date DATE -- Used when user "edits future only" to terminate old rule
);

-- RLS POLICIES
-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE recurring_rules ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

-- Transactions
CREATE POLICY "Users can view own transactions" ON transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own transactions" ON transactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own transactions" ON transactions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own transactions" ON transactions FOR DELETE USING (auth.uid() = user_id);

-- Recurring Rules
CREATE POLICY "Users can view own rules" ON recurring_rules FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own rules" ON recurring_rules FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own rules" ON recurring_rules FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own rules" ON recurring_rules FOR DELETE USING (auth.uid() = user_id);

-- PUBLICATION FOR POWERSYNC
-- PowerSync needs to subscribe to these tables
DROP PUBLICATION IF EXISTS powersync;
CREATE PUBLICATION powersync FOR TABLE users, transactions, recurring_rules;
