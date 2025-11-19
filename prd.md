# Product Requirements Document: Orion AI | Personal Finance Tracker

**Version:** 2.0 (Architecture Lock)
**Date:** 2025-11-19
**Status:** **READY FOR DEVELOPMENT**
**Document Owner:** Orion System Architect
**Target Engineering Agents:** Antigravity / Gemini 3.0

-----

## Executive Summary

Orion AI is a local-first, institutional-grade personal finance tracker. It allows users to manage multi-currency finances with absolute precision while leveraging server-side AI for deep insights.

**The Architecture Paradigm:**
Orion utilizes a **Hybrid Privacy Model**.

1.  **Core Finance:** Works 100% offline using **PowerSync** (SQLite) on the client.
2.  **AI Intelligence:** Requires an opt-in "Cloud Sync" to Supabase. AI processing occurs server-side on encrypted data.

**Monetization Model:**
**One-Time Purchase (Lifetime License).** No recurring SaaS subscriptions.

-----

## 1\. Product Vision & Goals

### 1.1 Vision

To build the "Leica of Finance Apps": a tool so precise, beautiful, and fast that it feels like an extension of the user's mind.

### 1.2 Success Metrics

  * **Performance:** Time to Interactive \< 1.5s (Next.js 15 Partial Prerendering).
  * **Sync Latency:** \< 500ms propagation via PowerSync.
  * **Data Integrity:** 0% floating-point errors (Strict Integer Math).

-----

## 2\. Functional Requirements

### 2.1 Core Feature Set

#### 2.1.1 Transaction Management (P0)

**Job to Be Done:** Record financial movements with receipt evidence and zero latency.

**Logic & Constraints:**

  * **Integer Storage:** All monetary values are stored in **cents/smallest unit** (e.g., $10.00 = `1000`).
  * **Receipts:** Uploads via Supabase Storage. Image compression happens client-side before upload.
  * **Offline Support:** Transactions are written to local SQLite (PowerSync) immediately. Sync happens in background.

**Schema Requirements:**

  * `amount`: Integer (Primary currency)
  * `amount_foreign`: Integer (Original currency, if different)
  * `fx_rate`: Float (Precision: 6 decimal places) - *Snapshot at transaction time.*

#### 2.1.2 Budget Management & FX Normalization (P0)

**Job to Be Done:** Track spending against monthly envelopes, regardless of transaction currency.

**FX Conversion Logic:**

  * **Rule:** "Instant Conversion."
  * When a user with a USD budget spends 100 EUR, the system calculates the USD equivalent using the FX rate **at the exact moment of the transaction**.
  * This USD value is deducted from the budget. Historical budget accuracy is preserved even if FX rates fluctuate later.

**Visuals:**

  * Heatmap calendar.
  * "Safe to Spend" daily calculation: $(\text{Remaining Budget} / \text{Days Left})$.

#### 2.1.3 Smart Recurring Transactions (P0)

**Job to Be Done:** Manage rent, subscriptions, and salary.

**Editing Logic (Strict Rule):**
When a user edits a recurring series (e.g., "Rent increased"):

1.  **Default Action:** "Update Future Only."
      * Technically: Cap the `end_date` of the old `recurring_rule`. Create a *new* `recurring_rule` starting today.
2.  **Secondary Option:** "Update All (Retroactive)."
      * Technically: Update the master rule and strictly re-calculate linked transaction amounts in the past. *Warning modal required.*

#### 2.1.4 AI Insights & "Privacy Gate" (P0)

**Job to Be Done:** Server-side analysis of spending patterns.

**The Privacy Gate:**

  * AI features are **disabled** by default.
  * **Trigger:** User clicks "Enable AI Coach."
  * **System Action:**
    1.  Checks if Cloud Sync is active.
    2.  If not, prompts: "AI requires secure cloud processing. Enable Sync?"
    3.  Once synced, data is available to the Server-side LLM.

**Capabilities:**

  * "Why is my savings rate dropping?" (Correlation analysis).
  * "Draft a plan to save $5k by June." (Optimization).

-----

## 3\. Technical Architecture

### 3.1 Technology Stack (Strict)

| Layer | Technology | Justification |
| :--- | :--- | :--- |
| **Framework** | **Next.js 15** | App Router, Server Actions, Partial Prerendering. |
| **Language** | **TypeScript 5+** | Strict mode, no `any`. |
| **Styling** | **TailwindCSS + shadcn/ui** | Rapid, accessible UI development. |
| **Local DB** | **SQLite (via WASM)** | In-browser robust SQL database. |
| **Sync Engine** | **PowerSync** | Handles offline-first, conflict resolution, and Supabase sync automatically. |
| **Cloud DB** | **Supabase (Postgres)** | Auth, Storage, Vector DB (pgvector). |
| **File Storage** | **Supabase Storage** | Receipts and user avatars. |
| **Math** | **Dinero.js** | Handling integer-based currency math on frontend. |

### 3.2 Data Model (Postgres Schema)

*Note: All monetary values are INTEGER.*

**users**

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  license_key TEXT, -- For One-Time Purchase validation
  lifetime_access BOOLEAN DEFAULT FALSE,
  base_currency CHAR(3) DEFAULT 'USD',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**transactions**

```sql
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
```

**recurring\_rules**

```sql
CREATE TABLE recurring_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  rrule_string TEXT NOT NULL, -- RFC 5545
  amount_cents INTEGER NOT NULL,
  active BOOLEAN DEFAULT TRUE,
  start_date DATE NOT NULL,
  end_date DATE -- Used when user "edits future only" to terminate old rule
);
```

### 3.3 PowerSync Integration Strategy

**The Sync Flow:**

1.  **Write:** App writes to local SQLite `transactions` table using Kysely or raw SQL.
2.  **Queue:** PowerSync agent detects change, queues upload.
3.  **Upload:** PowerSync pushes to Supabase.
4.  **Download:** PowerSync subscribes to Supabase changes and keeps local SQLite fresh.

**PowerSync Manifest (yaml snippet):**

```yaml
name: orion_sync
tables:
  transactions:
    columns:
      - id
      - user_id
      - amount_cents
      - currency
      - date
      - merchant
```

-----

## 4\. Implementation Guidelines (For AI Agent)

**Strict Instruction:** The AI Developer must strictly adhere to this file structure and coding standard.

### 4.1 Project Structure (ASCII Tree)

```text
src/
├── app/                      # Next.js 15 App Router
│   ├── (auth)/               # Login/Signup routes
│   ├── (dashboard)/          # Protected routes
│   │   ├── layout.tsx        # Dashboard Shell
│   │   ├── page.tsx          # Main view
│   │   └── transactions/
│   │       └── page.tsx
│   ├── api/                  # Server-side API routes (webhooks)
│   └── globals.css
├── components/
│   ├── ui/                   # shadcn/ui primitives (Button, Input)
│   └── shared/               # Reusable layout components
├── features/                 # FEATURE-BASED ARCHITECTURE
│   ├── transactions/
│   │   ├── components/       # TransactionForm, TransactionList
│   │   ├── hooks/            # useTransactions (PowerSync hooks)
│   │   ├── types.ts          # Zod schemas & Interfaces
│   │   └── utils.ts          # Currency formatting helpers
│   ├── budget/
│   │   ├── components/
│   │   └── logic/            # Envelope calculation logic
│   └── ai-coach/
│       ├── components/       # Chat interface
│       └── actions.ts        # Server Actions for LLM calls
├── lib/
│   ├── db/                   # PowerSync & SQLite setup
│   ├── supabase/             # Supabase Client
│   └── utils.ts              # cn() helper
└── providers/
    ├── powersync-provider.tsx
    └── theme-provider.tsx
```

### 4.2 Coding Standards

**1. Strict Typing & Zod:**

  * **Rule:** No `any` types allowed. `tsconfig.json` must have `"noImplicitAny": true`.
  * **Validation:** All form inputs and API responses must be validated using **Zod**.

**2. Component Composition (Smart vs. Dumb):**

  * **Smart Container:** `TransactionListContainer.tsx` fetches data via PowerSync hooks. It passes data down.
  * **Dumb Component:** `TransactionList.tsx` takes `data[]` as props and renders UI. It contains *no data fetching logic*.

**3. Integer Math Enforcement:**

  * **NEVER** do `amount + amount`.
  * **ALWAYS** use a helper: `addMoney(amountA, amountB, currency)`.
  * **Display:** Convert to float only at the very last step of rendering (in the UI component).

**4. Server Actions:**

  * Use Next.js Server Actions (`'use server'`) for AI processing and secure mutations that bypass the local DB (e.g., Account Deletion).

### 4.3 Image Handling (Receipts)

1.  User selects image.
2.  **Browser:** Resize/Compress to WebP (max 1024px width).
3.  **Upload:** `supabase.storage.from('receipts').upload(...)`.
4.  **Link:** Get public URL, save to `receipt_url` in local SQLite transaction record.

-----

## 5\. Roadmap & Phasing

**Phase 1: The Core (Local First)**

  * Scaffold Next.js 15 + PowerSync.
  * Implement Transaction CRUD (Integers).
  * Budget logic with instant FX conversion.

**Phase 2: The Cloud (Sync & Storage)**

  * Enable Supabase Sync.
  * Implement Receipt Uploads.
  * One-Time Purchase License Verification.

**Phase 3: The Intelligence (AI)**

  * Build Server-side LLM integration.
  * Implement "Privacy Gate" UI.
  * Generate insights based on synced data.

-----

## 6\. End of PRD

**Note to AI Developer:** This document is the absolute source of truth. Do not deviate from the stack (Next.js 15, PowerSync) or the Math Logic (Integers). If ambiguity arises, prioritize **Data Integrity** over features.