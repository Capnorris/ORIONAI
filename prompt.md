Your Optimized Prompt:

You are Lyndy AI, a senior full-stack product team (product manager + designer + engineer). Build a production-ready personal finance tracker called Lyndy. It must be aesthetically stunning (a true visual masterpiece) and deliver useful AI insights. Ship a complete, runnable project with code, assets, and setup instructions.

PRODUCT SCOPE

Core Jobs:
	1.	Track cashflow: add/edit/delete Expenses and Revenues (one-off + recurring).
	2.	Plan & control: monthly budgets, categories, tags, notes, merchant/payee, accounts/wallets, currencies.
	3.	Savings: goals with target amount/date; progress tracking.
	4.	Wishlist: create items with price, priority, target date; show affordability forecasts; “mark purchased” converts to an expense.
	5.	AI Insights: natural-language coach that explains spending patterns, anomalies, trends, and actionable optimizations (e.g., “Cancel X subscription to hit your savings goal two months earlier.”).
	6.	Reports: income vs. expense, savings progress, burn rate, runway, category breakdowns, month-over-month deltas, forecast next 3 months.
	7.	Privacy/Security: local-first storage by default with optional cloud sync; no third-party trackers; export/import (CSV/JSON).

NON-NEGOTIABLE UX/UI (MAKE IT BEAUTIFUL)
	•	Design language: modern, calm, premium fintech; grid-based; plenty of white space; micro-interactions; smooth motion.
	•	Visual style: soft glassmorphism + subtle neumorphism; rounded-2xl; soft shadows; tasteful blur; responsive mobile-first.
	•	Typography: variable sans (e.g., Inter) with 600/700 for headings; tight leading trims; numeric tabular lining for amounts.
	•	Color: elegant neutral base, one accent (teal or lime), automatic light/dark themes; accessible contrast.
	•	Components: dashboard cards, sparkline charts, pill filters, progress rings, modal editors, floating “+” action.
	•	Delight: confetti/sparkle when a goal is reached; wish-item glow when affordability threshold is close.

TECH SPEC (DEFAULTS; ADAPT IF NEEDED)
	•	Frontend: React + Next.js (App Router) + TypeScript + TailwindCSS + shadcn/ui.
	•	Charts: Recharts (responsive, no hardcoded colors).
	•	State: React Query + Zustand (or server actions).
	•	Backend/DB: Supabase (Postgres + RLS) with row-level security; 
	•	Auth: email + pass, OAuth (Google/Apple); session via JWT/NextAuth.
	•	AI: local server function calling an LLM wrapper for insights & NLQ (no PII leakage).
	•	Testing: Vitest + Playwright e2e for critical flows.
	•	CI/CD: one-command deploy (Vercel).
	•	Analytics: privacy-friendly, optional (self-hosted, toggle off by default).

DATA MODEL
	•	User(id, name, email, currency, locale)
	•	Account(id, user_id, name, type, currency, balance_cached)
	•	Category(id, user_id, name, type: ‘expense’|‘revenue’|‘transfer’, icon)
	•	Transaction(id, user_id, account_id, category_id, type: ‘expense’|‘revenue’|‘transfer’, amount, currency, fx_rate, date, merchant, notes, tags[], is_recurring, recurring_rule, created_at)
	•	SavingGoal(id, user_id, name, target_amount, target_date, current_amount_calculated, priority)
	•	WishlistItem(id, user_id, name, image_url, price, currency, priority:1–5, target_date, notes, status:‘planned’|‘purchased’|‘archived’)
	•	Budget(id, user_id, month, category_id, amount)
	•	Insight(id, user_id, title, body, severity:‘info’|‘tip’|‘warning’, created_at, linked_entities:{…})

FEATURES & LOGIC
	•	Recurring rules: RRULE (e.g., monthly on day 1); auto-instantiate instances; editable series/single occurrence.
	•	FX: store native amount + currency; compute base currency via daily rates; cache rates.
	•	Budgets: category/month envelopes; show utilization (%), projected over/under.
	•	Savings: progress ring; ETA given current monthly surplus; “Boost plan” suggestions.
	•	Wishlist affordability: compute “days to afford” = (price − free_cash) / avg_net_savings; add scenarios (“cut coffee”, “pause subscription”).
	•	Anomaly detection: z-score on category spend vs trailing 3 months; highlight outliers.
	•	Forecasting: simple ARIMA-lite or moving average on expenses & income for 90-day preview.
	•	Search & NLQ: “How much did I spend on groceries in October?” → scoped query + chart.
	•	Exports/Imports: CSV templates; guard against duplicates; undo/redo.

SCREENS
	1.	Onboarding: currency/locale, sample data toggle.
	2.	Dashboard: net worth, this-month summary, trends, goals, wishlist teasers, quick add.
	3.	Transactions: list, filters, powerful add/edit modal (keyboard-first).
	4.	Budgets: per-category envelopes, heatmap calendar.
	5.	Savings: goals list + detail, milestone timeline.
	6.	Wishlist: grid of items, affordability meter, “convert to purchase”.
	7.	Reports: MoM, category breakdown, forecast, subscriptions, merchants.
	8.	AI Coach: chat pane with suggested prompts, one-tap actions (create budget, adjust goal).
	9.	Settings: accounts, categories, auth, theme, export/import, privacy.

AI COACH (IMPLEMENT NOW)
	•	Role: rigorous, actionable, concise, friendly mentor.
	•	Inputs: normalized transactions, budgets, goals, wishlist, trends, user currency.
	•	Tools:
	•	get_metric(period, category)
	•	project_savings(months)
	•	find_anomalies(period)
	•	optimize_budget(target_gap)
	•	affordability(item_id)
	•	Behaviors:
	•	Prioritize specific recommendations with estimated impact and clickable actions.
	•	Avoid generic advice; cite the user’s own data (“Dining +€120 vs avg, +24%”).
	•	Provide 3-step plans max; include “Apply now” action that triggers mutations.

ACCESSIBILITY & QUALITY
	•	WCAG AA contrast; keyboard nav; reduced motion mode.
	•	i18n-ready; currency/locale formatting via Intl APIs.
	•	Empty states with illustrations and CTA.
	•	Performance: LCP < 2.5s; code-split charts; image optimization.
	•	Tests: cover add/edit transaction, recurring, wishlist purchase conversion, budget alerts, export/import.

SAMPLE DATA (SEED)
	•	3 accounts (Cash, Card, Savings), 8 categories (Groceries, Dining, Transport, Rent, Subscriptions, Salary, Freelance, Misc).
	•	90 days of synthetic transactions with realistic seasonality and two anomalies.
	•	2 savings goals (Emergency Fund, New Laptop).
	•	4 wishlist items (Noise-canceling headphones, Weekend trip, Road bike, Coffee machine).

DELIVERABLES
	•	Full codebase with README (setup, .env schema, seed, dev & prod scripts).
	•	ERD diagram + brief architecture notes.
	•	Screenshot/gif demo.
	•	One-click deploy instructions (Vercel + Supabase).
	•	Lint-clean (ESLint/Prettier) and typed (TypeScript strict).

ACCEPTANCE CRITERIA
	•	All screens implemented, responsive, and polished; dark/light theme switch.
	•	Transactions, budgets, savings, wishlist fully functional with persistence.
	•	AI Coach returns at least 5 personalized insights on seed data and supports NLQ.
	•	Wishlist affordability meter and “convert to purchase” create a real expense.
	•	Tests pass; sample data loads; deploy succeeds.

Now generate the entire project accordingly.