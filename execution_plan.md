# Orion AI - Execution Plan

## Phase 1: Environment & Scaffolding
- [x] **Initialize Project:** Create Next.js 15 app with TypeScript, Tailwind, and ESLint (`npx create-next-app@latest`).
- [x] **Install Core Dependencies:** Install `powersync-sdk`, `@powersync/web`, `kysely` (for type-safe SQL), `zod` (validation), and `dinero.js` (integer math).
- [x] **Install UI Library:** Initialize shadcn/ui (`npx shadcn@latest init`) and add core components (`button`, `input`, `card`, `dialog`, `calendar`).
- [x] **Enforce Directory Structure:** Create the exact folder tree from PRD 4.1 (specifically `src/features`, `src/lib/db`, `src/providers`).
- [x] **Configure Strict TypeScript:** Verify `tsconfig.json` has `"noImplicitAny": true` and `"strict": true`.

## Phase 2: Core Logic (Local-First)
- [x] **Define Local Schema:** Create the SQLite schema definitions in `src/lib/db/schema.ts` matching the PRD tables (`users`, `transactions`, `recurring_rules`).
- [x] **Implement Math Utils:** Create `src/lib/utils/currency.ts` using `dinero.js`. Implement `addMoney(amountA, amountB, currency)` and `formatCurrency(amount)`. **Strict Rule:** No ad-hoc math.
- [x] **Setup PowerSync Provider:** Build `src/providers/powersync-provider.tsx` to initialize the WASM database and expose the context.
- [x] **Feature: Transactions (Types):** Define Zod schemas in `src/features/transactions/types.ts` for `Transaction` and `CreateTransactionInput`.
- [x] **Feature: Transactions (Hooks):** Create `useTransactions` hook in `src/features/transactions/hooks/` to fetch data using `useQuery` from PowerSync.
- [x] **Feature: Transactions (UI):** Build `TransactionForm` (Smart) and `TransactionList` (Dumb). Ensure `amount` input converts float input to integer cents immediately on submit.
- [x] **Feature: Budget Logic:** Implement `src/features/budget/logic/envelope.ts`. Create the "Safe to Spend" calculation: `(Remaining / Days Left)`.

## Phase 3: The Cloud (Supabase & Sync)
- [x] **Supabase Setup:** Initialize remote Supabase project. Run SQL scripts from PRD 3.2 to create `users`, `transactions`, and `recurring_rules` tables.
- [x] **PowerSync Manifest:** Configure the `orion_sync` manifest in the PowerSync dashboard to match the YAML snippet in PRD 3.3.
- [x] **Authentication:** Implement Supabase Auth in `src/app/(auth)`. Create the `users` record trigger on signup.
- [x] **Connect Sync:** Update `powersync-provider.tsx` to handle the authentication token and connect to the PowerSync instance.
- [x] **Verify Sync:** Test creating a transaction offline, then coming online to see it propagate to Supabase.

## Phase 4: Advanced Features & AI
- [x] **Feature: Receipts:** Implement `src/lib/supabase/storage.ts`. Add client-side image compression (WebP, max 1024px) before upload.
- [x] **Feature: Recurring Rules:** Implement the "Update Future Only" logic in `src/features/transactions/actions.ts`. Ensure it caps the old rule and creates a new one.
- [x] **Feature: Privacy Gate:** Build the "Enable AI Coach" modal. Check for sync status before allowing activation.
- [x] **Feature: AI Coach:** Create Server Actions in `src/features/ai-coach/actions.ts`. Implement the logic to fetch *server-side* data from Supabase (not local) to feed the LLM.

## Phase 5: Verification & Polish
- [ ] **Audit: Integer Math:** Grep codebase for any `+` or `-` operators on currency variables. Replace with `dinero` functions.
- [ ] **Audit: Performance:** Run Lighthouse. Verify Time to Interactive is < 1.5s.
- [ ] **Audit: Type Safety:** Run `tsc --noEmit` to ensure zero type errors.
- [ ] **Final Walkthrough:** Verify the "Offline to Online" sync flow works without data loss.
