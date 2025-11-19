# Product Requirements Document: Lyndy AI Personal Finance Tracker

**Version:** 1.0
**Date:** 2025-11-12
**Status:** Initial Architecture & Planning
**Document Owner:** Orion System Orchestrator

---

## Executive Summary

Lyndy AI is a production-ready, aesthetically stunning personal finance tracker that combines comprehensive financial management with actionable AI-powered insights. The product emphasizes privacy-first architecture, local-first data storage with optional cloud sync, and delivers a premium fintech experience through modern design principles and intelligent coaching.

**Core Value Proposition:**
Empower users to understand, control, and optimize their financial life through beautiful interfaces and personalized AI guidance—without compromising privacy.

---

## 1. Product Vision & Goals

### 1.1 Vision Statement
To create the most beautiful and intelligent personal finance tracker that respects user privacy while delivering institutional-grade insights and actionable financial optimization.

### 1.2 Success Metrics
- **User Engagement:** Daily active usage > 60% of registered users
- **AI Utility:** Users act on at least 2 AI recommendations per month
- **Visual Excellence:** Design satisfaction score > 4.5/5.0
- **Privacy Trust:** 100% local-first operation with opt-in sync
- **Performance:** LCP < 2.5s, Time to Interactive < 3.5s

### 1.3 Target Audience
- **Primary:** Tech-savvy millennials and Gen Z (25-40) who value design and privacy
- **Secondary:** Financial optimization enthusiasts seeking actionable insights
- **Tertiary:** Small business owners managing personal + business finances

---

## 2. Functional Requirements

### 2.1 Core Feature Set

#### 2.1.1 Transaction Management (P0 - Critical)
**Job to Be Done:** Track all financial inflows and outflows with context

**Capabilities:**
- **CRUD Operations:** Add, edit, delete, duplicate transactions
- **Transaction Types:** Expense, Revenue, Transfer
- **Rich Metadata:**
  - Amount with multi-currency support
  - Date/time with timezone awareness
  - Merchant/payee with autocomplete
  - Category (system + custom)
  - Tags (multi-select, filterable)
  - Account/wallet assignment
  - Attached receipts/notes
  - Recurring schedule (RRULE-based)

**Recurring Transactions:**
- Define rules: daily, weekly, monthly, yearly patterns
- Auto-instantiate instances ahead of schedule (30-day horizon)
- Edit series vs. single occurrence
- Pause/resume series
- Smart detection: suggest recurring pattern after 3 manual entries

**UX Requirements:**
- Keyboard-first modal editor (Tab navigation, Enter to save, Esc to cancel)
- Quick-add floating action button (FAB) with smart defaults
- Bulk import from CSV/OFX with duplicate detection
- Inline edit in transaction list
- Advanced filters: date range, category, account, amount range, tags, search

#### 2.1.2 Budget Management (P0 - Critical)
**Job to Be Done:** Plan and control spending across categories and time periods

**Capabilities:**
- **Monthly Envelopes:** Per-category budget allocation
- **Budget Templates:** Seasonal, zero-based, percentage-based
- **Utilization Tracking:**
  - Real-time progress bars (%)
  - Projected over/under spend based on daily burn rate
  - Mid-month alerts when 80% consumed
- **Rollover Logic:** Unspent funds optionally carry to next month
- **Budget vs. Actual Reports:** Variance analysis with drill-down

**UX Requirements:**
- Visual heatmap calendar showing budget health
- Drag-to-allocate interface for setting amounts
- Color-coded status: green (under), yellow (approaching), red (exceeded)
- Mobile-optimized budget cards with swipe actions

#### 2.1.3 Savings Goals (P0 - Critical)
**Job to Be Done:** Define financial targets and track progress toward milestones

**Capabilities:**
- **Goal Definition:**
  - Name, description, icon/emoji
  - Target amount and target date
  - Priority ranking (1-5)
  - Manual or auto-contribution rules
- **Progress Tracking:**
  - Current amount (calculated from linked account or manual)
  - Completion percentage
  - ETA based on current savings rate
  - Milestone timeline (25%, 50%, 75%, 100%)
- **Boost Plans:**
  - AI-suggested actions to accelerate goal
  - Scenario modeling: "What if I cut subscription X?"
  - Visual comparison of different contribution rates

**UX Requirements:**
- Progress rings with animated transitions
- Confetti animation on goal completion
- Timeline view with milestone markers
- "Quick contribute" action from transaction entry

#### 2.1.4 Wishlist & Affordability (P0 - Critical)
**Job to Be Done:** Plan future purchases and understand affordability impact

**Capabilities:**
- **Wishlist Item Schema:**
  - Name, description, image URL
  - Price and currency
  - Priority (1-5 scale)
  - Target date (optional)
  - Status: planned | purchased | archived
- **Affordability Engine:**
  - "Days to afford" calculation: `(price - available_cash) / avg_monthly_surplus`
  - Traffic light indicator: green (affordable now), yellow (< 30 days), red (> 30 days)
  - Scenario comparisons: impact of cutting specific categories
- **Purchase Conversion:**
  - "Mark as purchased" creates expense transaction
  - Links to original wishlist item
  - Archives item with purchase date

**UX Requirements:**
- Grid layout with card-based items
- Glow effect when affordability threshold is near
- Drag-to-prioritize reordering
- One-tap scenario evaluation

#### 2.1.5 AI Insights & Coach (P0 - Critical)
**Job to Be Done:** Receive personalized, actionable financial guidance

**AI Persona:**
- **Tone:** Rigorous, concise, friendly mentor
- **Approach:** Data-driven, specific, action-oriented
- **Privacy:** All processing local or on-prem; no PII to third parties

**Core Capabilities:**
- **Pattern Analysis:**
  - Spending trends by category, merchant, time-of-day, day-of-week
  - Anomaly detection (z-score > 2σ from trailing 90-day mean)
  - Seasonal patterns and predictive warnings
- **Natural Language Query (NLQ):**
  - "How much did I spend on groceries in October?"
  - "Show me my largest expenses this quarter"
  - "Am I on track for my laptop goal?"
- **Actionable Recommendations:**
  - Cite user's own data: "Dining +€120 vs avg (+24%)"
  - Provide 3-step max action plans
  - Estimate financial impact: "Cancel Spotify Premium → save €120/year → reach goal 2 months earlier"
  - Include "Apply now" buttons that trigger mutations (create budget rule, adjust goal, etc.)

**AI Tool Functions:**
```typescript
get_metric(period: string, category?: string): MetricSummary
project_savings(months: number): ForecastResult
find_anomalies(period: string): Anomaly[]
optimize_budget(target_gap: number): OptimizationPlan
affordability(item_id: string): AffordabilityAnalysis
```

**Insight Types:**
- **Info:** General trends, milestones reached
- **Tip:** Optimization opportunities, efficiency gains
- **Warning:** Budget overruns, goal delays, unusual spending

**UX Requirements:**
- Persistent chat pane (collapsible on mobile)
- Suggested prompts/"Ask me about..." cards
- Inline charts and data visualizations in responses
- One-tap action execution from insights
- History of past insights and actions taken

#### 2.1.6 Reports & Analytics (P1 - High Priority)
**Job to Be Done:** Understand financial health through visualizations and trends

**Report Types:**
- **Income vs. Expense:** Monthly comparison with trendline
- **Net Worth Tracker:** Asset sum - liability sum over time
- **Category Breakdown:** Pie chart with drill-down
- **Burn Rate & Runway:** Daily/monthly spend rate; months until zero
- **Savings Progress:** Multi-goal dashboard with ETA projections
- **Month-over-Month Delta:** Variance report with highlights
- **90-Day Forecast:** Projected income/expense using moving average or ARIMA-lite
- **Subscription Audit:** Recurring charges with cancel-impact analysis
- **Merchant Analysis:** Top vendors by spend; loyalty program ROI

**Chart Components:**
- Responsive Recharts with theme-aware colors
- Sparklines for compact trend indicators
- Heatmap calendars for spending patterns
- Donut charts for category composition
- Line/area charts for temporal trends

**UX Requirements:**
- Filter controls: date range, account, category, tags
- Export to PNG/PDF
- Share-friendly public links (opt-in, anonymized)
- Customizable dashboard widgets

#### 2.1.7 Multi-Account & Multi-Currency (P1 - High Priority)
**Job to Be Done:** Manage complex financial structures across accounts and currencies

**Account Management:**
- **Account Types:** Checking, Savings, Credit Card, Cash, Investment, Loan
- **Properties:** Name, currency, institution, balance (cached, refreshed)
- **Account Transfers:** Special transaction type with from/to accounts
- **Balance Reconciliation:** Compare actual vs. calculated balance

**Currency Handling:**
- **Native Storage:** Store amount + original currency on every transaction
- **Base Currency Conversion:** User selects primary currency for reporting
- **FX Rates:** Daily rates cached from reliable API (e.g., exchangerate-api.io)
- **Historical Accuracy:** Use rate as-of transaction date for conversions
- **Multi-Currency Reports:** Option to view in original currencies or base

**UX Requirements:**
- Account switcher in transaction entry
- Visual account cards with balance and recent activity
- Currency selector with flag icons
- FX disclaimer on converted amounts

#### 2.1.8 Privacy, Security & Data Portability (P0 - Critical)
**Job to Be Done:** Ensure user data is secure, private, and portable

**Privacy Architecture:**
- **Local-First:** All data stored client-side (IndexedDB or local SQLite)
- **Optional Cloud Sync:** Opt-in Supabase sync with end-to-end encryption
- **No Third-Party Trackers:** Zero analytics by default; privacy-friendly self-hosted option
- **Audit Log:** User-visible log of all data access and sync events

**Security Measures:**
- **Authentication:** Email/password + OAuth (Google, Apple)
- **Session Management:** JWT with refresh tokens, 7-day expiry
- **Row-Level Security (RLS):** Supabase policies enforce user isolation
- **Encryption at Rest:** AES-256 for local storage, TLS 1.3 in transit
- **2FA Support:** TOTP-based optional second factor

**Data Portability:**
- **Export Formats:** CSV, JSON, OFX
- **Import Formats:** CSV with template, JSON schema
- **Bulk Operations:** Undo/redo stack for mass imports
- **Duplicate Detection:** Hash-based (date + amount + merchant) with manual review

**UX Requirements:**
- Settings panel for sync toggle, export/import
- Data usage transparency dashboard
- One-click anonymized data export for support

---

## 3. Non-Functional Requirements

### 3.1 Design & UX Excellence (P0 - Critical)

#### 3.1.1 Design Language
**Visual Style:**
- **Aesthetic:** Modern, calm, premium fintech with personality
- **Layout:** Grid-based, generous white space (24px min margins)
- **Surfaces:** Soft glassmorphism + subtle neumorphism
- **Corners:** Rounded-2xl (border-radius: 1rem)
- **Shadows:** Soft, layered shadows; avoid harsh blacks
- **Blur Effects:** Tasteful backdrop-blur for overlays

**Typography:**
- **Font Family:** Inter Variable (Google Fonts)
- **Weights:** 400 (regular), 600 (semibold headings), 700 (bold emphasis)
- **Leading:** Tight leading with trim for headlines
- **Numeric:** Tabular lining for amounts; monospace for account numbers

**Color System:**
- **Base:** Elegant neutral scale (gray-50 to gray-950)
- **Accent:** Single primary (teal-500 or lime-500)
- **Semantic:** Success (green), Warning (amber), Error (red)
- **Themes:** Automatic light/dark with smooth transitions
- **Contrast:** WCAG AA minimum; AAA target for critical UI

**Component Library:**
- **Foundation:** shadcn/ui with Radix primitives + TailwindCSS
- **Custom Components:**
  - Dashboard cards with hover lift effect
  - Sparkline charts (Recharts micro)
  - Pill-style filter chips with count badges
  - Progress rings (SVG circle with animated stroke)
  - Modal editors with keyboard shortcuts
  - Floating "+" action button (FAB) with radial menu
  - Toasts with action buttons

#### 3.1.2 Micro-Interactions & Animation
**Motion Principles:**
- **Duration:** 200-300ms for UI feedback; 400-600ms for transitions
- **Easing:** Ease-out for entrances, ease-in for exits; spring physics for playful moments
- **Purposeful:** Motion should clarify hierarchy and relationships
- **Reduced Motion:** Respect prefers-reduced-motion media query

**Signature Interactions:**
- **Goal Completion:** Confetti burst with sound (optional)
- **Wishlist Affordability:** Pulsing glow when within 10% of target
- **Budget Overage:** Subtle shake on exceeded warning
- **Add Transaction:** FAB morphs into form with radial menu for quick type selection
- **Swipe Actions:** Left (edit), right (delete) on mobile lists
- **Drag-to-Reorder:** Visual lift and snap-back on priority lists

#### 3.1.3 Responsive Design
**Breakpoints:**
- **Mobile:** 320px - 639px (sm)
- **Tablet:** 640px - 1023px (md)
- **Desktop:** 1024px+ (lg, xl, 2xl)

**Mobile-First Approach:**
- Touch targets ≥ 44px × 44px
- Bottom navigation for primary actions
- Swipe gestures for common operations
- Single-column layouts with progressive disclosure

**Desktop Enhancements:**
- Multi-column dashboards
- Hover states and tooltips
- Keyboard shortcuts (Cmd/Ctrl+K for command palette)
- Sidebar navigation

### 3.2 Performance Requirements (P0 - Critical)

**Core Web Vitals Targets:**
- **LCP (Largest Contentful Paint):** < 2.5s
- **FID (First Input Delay):** < 100ms
- **CLS (Cumulative Layout Shift):** < 0.1
- **Time to Interactive:** < 3.5s on 4G connection

**Optimization Strategies:**
- **Code Splitting:** Route-based + component-based lazy loading
- **Image Optimization:** Next.js Image with WebP/AVIF formats
- **Chart Lazy Loading:** Load Recharts only when scrolled into view
- **Database Indexing:** Composite indexes on (user_id, date) for transactions
- **Query Optimization:** React Query with stale-while-revalidate
- **Bundle Size:** < 200KB initial JS (gzipped); < 500KB total

### 3.3 Accessibility (P0 - Critical)

**WCAG 2.1 Level AA Compliance:**
- **Perceivable:**
  - Text contrast ratio ≥ 4.5:1 (7:1 for AA)
  - Alt text for all images and icons
  - Captions for video content (if added)
- **Operable:**
  - Full keyboard navigation (Tab, Shift+Tab, Arrow keys, Enter, Esc)
  - Focus indicators with 3px outline
  - No keyboard traps
- **Understandable:**
  - Consistent navigation patterns
  - Error messages with recovery suggestions
  - Clear labels for form inputs
- **Robust:**
  - Semantic HTML (nav, main, article, section, aside)
  - ARIA labels and roles where necessary
  - Screen reader testing with NVDA/VoiceOver

**Additional Features:**
- **Skip Links:** Jump to main content
- **Focus Management:** Return focus after modals close
- **Live Regions:** Announce dynamic content updates
- **Reduced Motion Mode:** Static alternatives for animations

### 3.4 Internationalization (P1 - High Priority)

**Locale Support:**
- **Currency Formatting:** Intl.NumberFormat with user's locale
- **Date Formatting:** Intl.DateTimeFormat with timezone awareness
- **Number Formatting:** Respect decimal separators (comma vs. period)
- **Language:** English (en-US) as primary; i18n-ready architecture for future expansion

**i18n Architecture:**
- **Library:** next-intl or react-i18next
- **Translation Keys:** Namespaced by feature (e.g., `transactions.add.title`)
- **Pluralization:** Support plural rules per language
- **RTL Preparation:** CSS logical properties (margin-inline-start vs. margin-left)

### 3.5 Testing Requirements (P1 - High Priority)

**Test Coverage Targets:**
- **Unit Tests:** 80% coverage for business logic (Vitest)
- **Integration Tests:** Critical flows (add/edit transaction, recurring, budget alerts)
- **E2E Tests:** User journeys (Playwright):
  - Onboarding → Add transaction → View dashboard
  - Create savings goal → Simulate contributions → Reach milestone
  - Add wishlist item → Check affordability → Convert to purchase
  - Export data → Import data → Verify integrity

**Testing Strategy:**
- **Component Tests:** shadcn/ui component behavior
- **Hook Tests:** Custom React hooks for state management
- **API Tests:** Supabase RLS policies and edge functions
- **Visual Regression:** Percy or Chromatic for UI changes
- **Accessibility Tests:** axe-core integration in CI

### 3.6 DevOps & Deployment (P1 - High Priority)

**CI/CD Pipeline:**
- **Platform:** GitHub Actions or Vercel native
- **Steps:**
  1. Lint (ESLint + Prettier)
  2. Type-check (TypeScript strict mode)
  3. Unit tests (Vitest)
  4. Build (Next.js)
  5. E2E tests (Playwright)
  6. Deploy (Vercel preview + production)

**Environment Management:**
- **Local:** `.env.local` with Supabase local dev server
- **Staging:** `.env.staging` with preview database
- **Production:** `.env.production` with production database

**One-Click Deploy:**
- **Vercel Button:** Automated project setup with env prompts
- **Supabase Setup Script:** Create tables, enable RLS, seed data

**Monitoring:**
- **Error Tracking:** Sentry (opt-in)
- **Performance:** Vercel Analytics (privacy-friendly)
- **Logs:** Supabase logs + Vercel function logs

---

## 4. Technical Architecture

### 4.1 Technology Stack

#### 4.1.1 Frontend
- **Framework:** Next.js 14+ (App Router, React Server Components)
- **Language:** TypeScript 5+ (strict mode)
- **Styling:** TailwindCSS 3+ with custom design tokens
- **Component Library:** shadcn/ui (Radix UI primitives)
- **Charts:** Recharts 2+ (responsive, theme-aware)
- **State Management:**
  - **Server State:** TanStack React Query (cache, sync, mutations)
  - **Client State:** Zustand (global UI state, preferences)
- **Forms:** React Hook Form + Zod validation
- **Date Handling:** date-fns (lightweight alternative to moment)
- **Currency:** dinero.js or custom Intl.NumberFormat wrapper

#### 4.1.2 Backend & Database
- **Platform:** Supabase (PostgreSQL + Realtime + Auth + Storage)
- **Database:** PostgreSQL 15+ with Row-Level Security (RLS)
- **Migrations:** Supabase CLI with versioned SQL scripts
- **API Layer:**
  - Supabase auto-generated REST API (PostgREST)
  - Supabase Edge Functions (Deno) for complex logic
  - Next.js API Routes for server-side operations
- **File Storage:** Supabase Storage for receipts/images (optional)

#### 4.1.3 AI & Insights
- **LLM Integration:**
  - Local LLM wrapper (Ollama) or cloud API (OpenAI, Anthropic)
  - Function calling with structured outputs
- **Privacy:** All PII anonymized/aggregated before LLM calls
- **Caching:** Redis or Supabase cache for repeated queries
- **Processing:** Server-side Python/Node.js for statistical analysis

#### 4.1.4 DevOps
- **Hosting:** Vercel (frontend + serverless functions)
- **Database Hosting:** Supabase Cloud or self-hosted
- **CI/CD:** GitHub Actions + Vercel preview deployments
- **Monitoring:** Vercel Analytics + Sentry (opt-in)
- **Testing:** Vitest (unit) + Playwright (e2e)

### 4.2 Data Model

#### 4.2.1 Core Entities

**users**
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  default_currency CHAR(3) DEFAULT 'USD',
  locale TEXT DEFAULT 'en-US',
  timezone TEXT DEFAULT 'UTC',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**accounts**
```sql
CREATE TABLE accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('checking', 'savings', 'credit_card', 'cash', 'investment', 'loan')),
  currency CHAR(3) NOT NULL,
  balance_cached NUMERIC(15, 2) DEFAULT 0,
  institution TEXT,
  last_synced_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, name)
);
CREATE INDEX idx_accounts_user_id ON accounts(user_id);
```

**categories**
```sql
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('expense', 'revenue', 'transfer')),
  icon TEXT,
  color TEXT,
  is_system BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, name)
);
CREATE INDEX idx_categories_user_id ON categories(user_id);
```

**transactions**
```sql
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  account_id UUID REFERENCES accounts(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  type TEXT NOT NULL CHECK (type IN ('expense', 'revenue', 'transfer')),
  amount NUMERIC(15, 2) NOT NULL,
  currency CHAR(3) NOT NULL,
  fx_rate NUMERIC(15, 6),
  amount_base_currency NUMERIC(15, 2),
  date DATE NOT NULL,
  merchant TEXT,
  notes TEXT,
  tags TEXT[],
  is_recurring BOOLEAN DEFAULT FALSE,
  recurring_rule TEXT, -- RRULE string
  recurring_parent_id UUID REFERENCES transactions(id) ON DELETE CASCADE,
  transfer_account_id UUID REFERENCES accounts(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_transactions_user_date ON transactions(user_id, date DESC);
CREATE INDEX idx_transactions_user_category ON transactions(user_id, category_id);
CREATE INDEX idx_transactions_user_account ON transactions(user_id, account_id);
CREATE INDEX idx_transactions_merchant ON transactions(user_id, merchant);
CREATE INDEX idx_transactions_tags ON transactions USING GIN(tags);
```

**budgets**
```sql
CREATE TABLE budgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  month DATE NOT NULL, -- First day of month
  amount NUMERIC(15, 2) NOT NULL,
  rollover_enabled BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, category_id, month)
);
CREATE INDEX idx_budgets_user_month ON budgets(user_id, month DESC);
```

**saving_goals**
```sql
CREATE TABLE saving_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  target_amount NUMERIC(15, 2) NOT NULL,
  target_date DATE,
  current_amount NUMERIC(15, 2) DEFAULT 0,
  priority INTEGER DEFAULT 3 CHECK (priority BETWEEN 1 AND 5),
  icon TEXT,
  linked_account_id UUID REFERENCES accounts(id) ON DELETE SET NULL,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_saving_goals_user_id ON saving_goals(user_id);
```

**wishlist_items**
```sql
CREATE TABLE wishlist_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  price NUMERIC(15, 2) NOT NULL,
  currency CHAR(3) NOT NULL,
  priority INTEGER DEFAULT 3 CHECK (priority BETWEEN 1 AND 5),
  target_date DATE,
  status TEXT DEFAULT 'planned' CHECK (status IN ('planned', 'purchased', 'archived')),
  purchased_transaction_id UUID REFERENCES transactions(id) ON DELETE SET NULL,
  purchased_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_wishlist_user_status ON wishlist_items(user_id, status);
```

**insights**
```sql
CREATE TABLE insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  severity TEXT DEFAULT 'info' CHECK (severity IN ('info', 'tip', 'warning')),
  linked_entities JSONB, -- {transaction_ids: [], category_ids: [], goal_ids: []}
  action_taken BOOLEAN DEFAULT FALSE,
  action_taken_at TIMESTAMPTZ,
  dismissed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_insights_user_created ON insights(user_id, created_at DESC);
```

#### 4.2.2 Row-Level Security (RLS) Policies

**Enable RLS on all tables:**
```sql
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE saving_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE insights ENABLE ROW LEVEL SECURITY;
```

**Example Policy (transactions):**
```sql
CREATE POLICY "Users can only access their own transactions"
  ON transactions
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
```

### 4.3 System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                          │
│  ┌─────────────────────────────────────────────────────┐   │
│  │         Next.js App Router (React 18+)              │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │   │
│  │  │Dashboard │  │Transactions│  │ AI Coach Chat   │  │   │
│  │  │  Page    │  │   Page   │  │     Pane        │  │   │
│  │  └──────────┘  └──────────┘  └──────────────────┘  │   │
│  │                                                       │   │
│  │  ┌─────────────────────────────────────────────┐    │   │
│  │  │  shadcn/ui Components + TailwindCSS        │    │   │
│  │  └─────────────────────────────────────────────┘    │   │
│  │                                                       │   │
│  │  ┌──────────────┐         ┌──────────────────┐     │   │
│  │  │ React Query  │◄────────┤   Zustand Store  │     │   │
│  │  │ (Server State)│         │  (Client State)  │     │   │
│  │  └──────────────┘         └──────────────────┘     │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────┬───────────────────────────────────┘
                          │ HTTPS/WSS
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                      API & Logic Layer                       │
│  ┌─────────────────────────────────────────────────────┐   │
│  │            Supabase Client (JS SDK)                 │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────┐  │   │
│  │  │ PostgREST   │  │  Realtime    │  │   Auth   │  │   │
│  │  │     API      │  │  Subscriptions│  │   JWT    │  │   │
│  │  └──────────────┘  └──────────────┘  └──────────┘  │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │      Next.js API Routes / Edge Functions            │   │
│  │  ┌──────────────────┐  ┌────────────────────────┐  │   │
│  │  │  AI Insights     │  │   Recurring Tx         │  │   │
│  │  │  Generation      │  │   Scheduler            │  │   │
│  │  └──────────────────┘  └────────────────────────┘  │   │
│  │  ┌──────────────────┐  ┌────────────────────────┐  │   │
│  │  │  FX Rate Sync    │  │   Export/Import        │  │   │
│  │  └──────────────────┘  └────────────────────────┘  │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────┬───────────────────────────────────┘
                          │ PostgreSQL Protocol
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                      Data Layer                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │           Supabase PostgreSQL 15+                   │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │   │
│  │  │  Tables  │  │   RLS    │  │     Indexes      │  │   │
│  │  │ (Schema) │  │ Policies │  │   (Performance)  │  │   │
│  │  └──────────┘  └──────────┘  └──────────────────┘  │   │
│  │                                                       │   │
│  │  ┌─────────────────────────────────────────────┐    │   │
│  │  │        Backup & Replication                 │    │   │
│  │  └─────────────────────────────────────────────┘    │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                   External Services                          │
│  ┌──────────────────┐  ┌────────────────────────────────┐  │
│  │  LLM Provider    │  │  FX Rate API                   │  │
│  │  (OpenAI/Local)  │  │  (exchangerate-api.io)         │  │
│  └──────────────────┘  └────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### 4.4 API Contracts

#### 4.4.1 Key API Endpoints (Supabase PostgREST)

**GET /transactions**
```typescript
interface TransactionQueryParams {
  user_id: string;
  date_from?: string; // ISO date
  date_to?: string;
  category_id?: string;
  account_id?: string;
  type?: 'expense' | 'revenue' | 'transfer';
  tags?: string[]; // cs={"tag1","tag2"}
  limit?: number;
  offset?: number;
  order?: 'date.desc' | 'amount.desc';
}

interface TransactionResponse {
  data: Transaction[];
  count: number;
}
```

**POST /transactions**
```typescript
interface CreateTransactionPayload {
  account_id: string;
  category_id?: string;
  type: 'expense' | 'revenue' | 'transfer';
  amount: number;
  currency: string;
  date: string; // ISO date
  merchant?: string;
  notes?: string;
  tags?: string[];
  is_recurring?: boolean;
  recurring_rule?: string; // RRULE
  transfer_account_id?: string; // For transfers
}
```

**GET /ai/insights**
```typescript
interface InsightsQueryParams {
  user_id: string;
  severity?: 'info' | 'tip' | 'warning';
  dismissed?: boolean;
  limit?: number;
}
```

**POST /ai/query**
```typescript
interface AIQueryPayload {
  user_id: string;
  query: string; // Natural language query
  context?: {
    date_range?: { from: string; to: string };
    category_ids?: string[];
  };
}

interface AIQueryResponse {
  answer: string;
  data?: any; // Structured data if applicable
  chart?: ChartConfig; // Chart spec if visualizable
  actions?: Action[]; // Suggested actions
}
```

#### 4.4.2 AI Function Calling Schema

```typescript
interface AIFunction {
  name: string;
  description: string;
  parameters: JSONSchema;
}

const AI_FUNCTIONS: AIFunction[] = [
  {
    name: 'get_metric',
    description: 'Get financial metrics for a period and optional category',
    parameters: {
      type: 'object',
      properties: {
        period: { type: 'string', enum: ['7d', '30d', '90d', '12m', 'ytd'] },
        category_id: { type: 'string', format: 'uuid' }
      },
      required: ['period']
    }
  },
  {
    name: 'project_savings',
    description: 'Forecast savings for N months ahead',
    parameters: {
      type: 'object',
      properties: {
        months: { type: 'integer', minimum: 1, maximum: 36 }
      },
      required: ['months']
    }
  },
  {
    name: 'find_anomalies',
    description: 'Detect unusual spending in a period',
    parameters: {
      type: 'object',
      properties: {
        period: { type: 'string', enum: ['30d', '90d', '12m'] }
      },
      required: ['period']
    }
  },
  {
    name: 'optimize_budget',
    description: 'Suggest budget optimizations to close a financial gap',
    parameters: {
      type: 'object',
      properties: {
        target_gap: { type: 'number', description: 'Amount to save per month' }
      },
      required: ['target_gap']
    }
  },
  {
    name: 'affordability',
    description: 'Calculate affordability timeline for a wishlist item',
    parameters: {
      type: 'object',
      properties: {
        item_id: { type: 'string', format: 'uuid' }
      },
      required: ['item_id']
    }
  }
];
```

---

## 5. User Experience Flows

### 5.1 Onboarding Flow
1. **Welcome Screen:** Logo, tagline, "Get Started" CTA
2. **Account Creation:** Email/password or OAuth
3. **Currency & Locale:** Select default currency and region
4. **Sample Data Prompt:** "Load example data to explore?" (Toggle)
5. **First Account Setup:** Add primary checking account
6. **Quick Tour:** 4-step interactive tutorial (skippable)
7. **Dashboard:** Land on empty state or sample data dashboard

### 5.2 Add Transaction Flow
1. **Trigger:** FAB (floating action button) in bottom-right
2. **Type Selection:** Radial menu (Expense, Revenue, Transfer)
3. **Quick Form:**
   - Amount (large input, autofocus)
   - Account (dropdown with balance preview)
   - Category (icon grid or dropdown)
   - Merchant (autocomplete from history)
   - Date (date picker, defaults to today)
   - Advanced (expandable: tags, notes, recurring)
4. **Save:** Enter key or "Add Transaction" button
5. **Confirmation:** Toast with undo option (5s timeout)

### 5.3 AI Coaching Interaction
1. **Entry Point:** "Ask AI Coach" button on dashboard or dedicated page
2. **Suggested Prompts:** Cards with common queries
3. **User Query:** Type natural language question
4. **Processing:** Loading state with animated thinking indicator
5. **Response:**
   - Text explanation with cited data
   - Inline chart or table (if applicable)
   - Action buttons: "Apply Suggestion," "Tell Me More," "Dismiss"
6. **Action Execution:** Confirm → Mutation → Success toast → Refresh data

### 5.4 Wishlist Purchase Conversion
1. **Wishlist Item Card:** Shows price, priority, affordability meter
2. **Hover/Tap:** Reveals "Mark as Purchased" button
3. **Confirmation Modal:**
   - "Confirm purchase date" (defaults to today)
   - "Which account?" (dropdown)
   - "Add notes?" (optional text field)
4. **Submit:** Creates expense transaction, archives wishlist item
5. **Celebration:** Confetti animation + success message

---

## 6. Screens & UI Components

### 6.1 Screen Inventory

1. **Onboarding:**
   - Welcome
   - Sign Up/Sign In
   - Currency/Locale Setup
   - Sample Data Prompt
   - Quick Tour Overlay

2. **Dashboard (Home):**
   - Net Worth Card
   - This Month Summary (Income, Expenses, Net)
   - Trend Charts (Last 30 days)
   - Savings Goals Preview (Top 3)
   - Wishlist Teasers (Affordable items)
   - Recent Transactions (Last 5)
   - AI Insight Cards (Dismissable)
   - Quick Add FAB

3. **Transactions:**
   - Filter Bar (Date, Category, Account, Tags, Type)
   - Transaction List (Grouped by date)
   - Swipe Actions (Edit, Delete)
   - Add Transaction Modal
   - Bulk Import Flow

4. **Budgets:**
   - Monthly Budget Dashboard
   - Category Envelopes (Progress bars)
   - Heatmap Calendar View
   - Budget Editor Modal
   - Rollover Settings

5. **Savings:**
   - Goals List (Cards with progress rings)
   - Goal Detail Page:
     - Milestone timeline
     - Contribution history chart
     - "Boost Plan" suggestions from AI
     - Manual contribution button

6. **Wishlist:**
   - Grid of wishlist items (masonry layout)
   - Affordability indicators (traffic light)
   - Priority sorting
   - Add Item Modal
   - Scenario Comparison Drawer

7. **Reports:**
   - Report Type Selector (Tabs or dropdown)
   - Income vs. Expense Chart
   - Category Breakdown (Donut chart)
   - Net Worth Trend (Line chart)
   - Burn Rate & Runway Metrics
   - 90-Day Forecast
   - Merchant Analysis
   - Subscription Audit
   - Export Options (PNG, PDF, CSV)

8. **AI Coach:**
   - Chat Interface (persistent pane or full-screen)
   - Suggested Prompts
   - Message History
   - Inline Charts/Tables
   - Action Buttons (Apply, Dismiss)
   - Context Selector (Date range, categories)

9. **Settings:**
   - **Profile:** Name, email, currency, locale
   - **Accounts:** List, add, edit, delete accounts
   - **Categories:** Manage custom categories
   - **Appearance:** Theme toggle (light/dark/auto)
   - **Privacy:** Data sync toggle, export/import
   - **Security:** Change password, 2FA setup
   - **Notifications:** Email preferences, push (future)
   - **About:** Version, credits, privacy policy

### 6.2 Component Specifications

#### Dashboard Card
```tsx
<Card className="rounded-2xl shadow-lg backdrop-blur-sm bg-white/80 dark:bg-gray-900/80">
  <CardHeader>
    <CardTitle className="text-lg font-semibold">Net Worth</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="text-3xl font-bold tabular-nums">$12,450.00</div>
    <Sparkline data={monthlyTrend} className="mt-4" />
  </CardContent>
</Card>
```

#### Progress Ring
```tsx
<ProgressRing
  value={65}
  max={100}
  size={120}
  strokeWidth={12}
  color="teal"
  label="Emergency Fund"
  sublabel="$6,500 / $10,000"
/>
```

#### Transaction List Item
```tsx
<TransactionItem
  merchant="Whole Foods"
  category="Groceries"
  amount={-87.43}
  date="2025-11-10"
  account="Chase Checking"
  onSwipeLeft={handleEdit}
  onSwipeRight={handleDelete}
/>
```

#### AI Insight Card
```tsx
<InsightCard
  severity="tip"
  title="Dining spending up 24%"
  body="You've spent €420 on dining this month, €120 more than usual. Consider meal prepping to save €80/month."
  actions={[
    { label: "Set Dining Budget", onClick: handleSetBudget },
    { label: "View Details", onClick: handleViewDetails }
  ]}
  onDismiss={handleDismiss}
/>
```

---

## 7. Sample Data Specification

### 7.1 Seed Data Requirements

**Accounts (3):**
1. Chase Checking (USD, $3,200)
2. Amex Blue Card (USD, -$1,450 balance)
3. Ally Savings (USD, $10,700)

**Categories (8 system + user can add custom):**
- **Expenses:** Groceries, Dining, Transport, Rent, Subscriptions, Utilities, Entertainment, Misc
- **Revenue:** Salary, Freelance, Investment, Gift

**Transactions (90 days, ~120 transactions):**
- **Recurring (monthly):**
  - Rent: $1,500 on 1st of each month
  - Salary: $5,000 on 15th of each month
  - Subscriptions: Netflix $15.99, Spotify $9.99, Gym $45
- **Regular (weekly/random):**
  - Groceries: $80-150, 1-2x/week
  - Dining: $30-80, 2-4x/week
  - Transport: $5-25, 3-5x/week
  - Coffee: $5-8, 5-7x/week
- **Anomalies (2 intentional outliers):**
  - Emergency car repair: $850 (2 months ago)
  - Expensive dinner: $220 (last month)

**Savings Goals (2):**
1. **Emergency Fund:** $10,000 target, $6,500 current, Dec 2026 target
2. **New Laptop:** $2,500 target, $800 current, March 2026 target

**Wishlist Items (4):**
1. **Sony WH-1000XM5 Headphones:** $399, Priority 4, Target: Jan 2026
2. **Weekend Trip to Portland:** $650, Priority 3, Target: April 2026
3. **Gravel Bike:** $1,200, Priority 2, Target: June 2026
4. **Espresso Machine:** $800, Priority 3, Target: Aug 2026

**Budgets (sample for current month):**
- Groceries: $600
- Dining: $400
- Transport: $200
- Subscriptions: $80
- Entertainment: $150

---

## 8. Acceptance Criteria

### 8.1 Functional Completeness

**P0 (Must-Have for Launch):**
- [ ] All 9 screens implemented and navigable
- [ ] Add/edit/delete transactions with full metadata
- [ ] Recurring transactions auto-instantiate correctly
- [ ] Budgets calculate utilization and show warnings
- [ ] Savings goals track progress and calculate ETA
- [ ] Wishlist affordability meter works; purchase conversion creates transaction
- [ ] AI Coach responds to at least 5 test queries with personalized insights
- [ ] Multi-currency support with FX conversion
- [ ] Light/dark theme toggle with persistent preference
- [ ] Export to CSV and JSON; import CSV with duplicate detection
- [ ] Sample data loads correctly and demonstrates all features

**P1 (Should-Have for Quality):**
- [ ] NLQ returns accurate answers with charts
- [ ] AI provides actionable recommendations with "Apply" buttons
- [ ] Reports page shows 6+ chart types
- [ ] Keyboard shortcuts (Cmd+K for search, etc.)
- [ ] Swipe gestures on mobile for list actions
- [ ] Animations and micro-interactions polished
- [ ] Empty states with illustrations

### 8.2 Non-Functional Criteria

**Design:**
- [ ] WCAG AA contrast ratios pass audit
- [ ] Mobile responsive (320px - 2560px)
- [ ] Typography uses Inter Variable with correct weights
- [ ] Color system consistent across all components
- [ ] No layout shifts (CLS < 0.1)

**Performance:**
- [ ] Lighthouse score ≥ 90 (Performance, Accessibility, Best Practices)
- [ ] LCP < 2.5s on 4G connection
- [ ] Initial bundle < 200KB gzipped
- [ ] Charts lazy-load on scroll

**Security:**
- [ ] RLS policies enforce user isolation
- [ ] Auth session expires after 7 days
- [ ] No PII in logs or error messages
- [ ] Supabase connection uses TLS 1.3

**Testing:**
- [ ] 80%+ unit test coverage
- [ ] All critical E2E flows pass (onboarding, add transaction, goal completion, wishlist purchase)
- [ ] axe-core accessibility scan passes with 0 violations

**DevOps:**
- [ ] One-click Vercel deploy works with .env template
- [ ] Supabase setup script creates all tables and policies
- [ ] Seed data script populates sample transactions
- [ ] CI pipeline runs lint, tests, build successfully

---

## 9. Open Questions & Risks

### 9.1 Open Questions
1. **LLM Provider:** OpenAI GPT-4 vs. Anthropic Claude vs. local Ollama? (Impact: cost, latency, privacy)
2. **Receipts/Attachments:** Do we support image uploads for receipts in MVP? (Scope decision)
3. **Bank Integrations:** Future roadmap for Plaid/Teller integration? (Not MVP, but affects data model)
4. **Collaborative Features:** Multi-user accounts (couples, families)? (Post-MVP)
5. **Mobile Apps:** Native iOS/Android or PWA only? (Platform decision)

### 9.2 Technical Risks
| Risk | Impact | Mitigation |
|------|--------|------------|
| LLM API rate limits / costs | High | Implement aggressive caching; local LLM fallback |
| Supabase RLS complexity | Medium | Thorough testing; simplified policies; audit trail |
| FX rate API downtime | Medium | Cache rates for 24h; graceful fallback to static rates |
| Large transaction datasets (>10k rows) | Medium | Pagination, virtual scrolling, indexed queries |
| Chart rendering performance | Low | Lazy load, throttle updates, use canvas-based charts |

### 9.3 UX Risks
| Risk | Impact | Mitigation |
|------|--------|------------|
| AI hallucinations/incorrect advice | High | Disclaimer on AI responses; user feedback mechanism |
| Onboarding friction | Medium | Sample data option; progressive disclosure |
| Mobile keyboard obscuring inputs | Low | Adjust viewport on focus; sticky FAB |
| Too much visual complexity | Medium | User testing; settings to simplify UI |

---

## 10. Success Metrics & KPIs

### 10.1 Engagement Metrics
- **Daily Active Users (DAU):** Target 60% of registered users
- **Weekly Active Users (WAU):** Target 80% of registered users
- **Avg. Session Duration:** > 3 minutes
- **Transactions per User per Week:** > 5
- **AI Queries per User per Month:** > 3

### 10.2 Feature Adoption
- **Recurring Transactions:** Used by 40% of users
- **Savings Goals:** Created by 50% of users; 20% reach a milestone
- **Wishlist:** 30% of users add items; 10% convert to purchase
- **Budgets:** Set by 60% of users; 40% check weekly
- **AI Actions:** 20% of AI recommendations result in action taken

### 10.3 Quality Metrics
- **Crash-Free Rate:** > 99.5%
- **Performance (Lighthouse):** > 90 across all categories
- **Accessibility Violations:** 0 critical violations
- **User-Reported Bugs:** < 5 per 1,000 users per month

### 10.4 Privacy & Trust
- **Data Exports:** Available to 100% of users
- **Sync Opt-In Rate:** < 50% (local-first validation)
- **Support Tickets on Privacy:** < 1% of user base

---

## 11. Roadmap & Future Enhancements

### 11.1 Post-MVP Features (3-6 months)
1. **Bank Integrations:** Plaid/Teller for automatic transaction sync
2. **Mobile Apps:** React Native iOS/Android apps
3. **Shared Accounts:** Invite family/partner to shared view
4. **Receipt Scanning:** OCR for automatic transaction creation
5. **Advanced Forecasting:** ML-based spending predictions
6. **Investment Tracking:** Portfolio integration with real-time prices
7. **Bill Reminders:** Push notifications for upcoming recurring charges
8. **Custom Reports:** User-defined chart builder
9. **Multi-Language Support:** Localization for top 5 languages

### 11.2 Long-Term Vision (6-12 months)
- **Tax Optimization:** Year-end tax preparation assistance
- **Debt Payoff Planner:** Avalanche/snowball method recommendations
- **Net Worth Timeline:** Historical tracking with annotations
- **Financial Education:** Integrated learning modules
- **Social Features:** Anonymous spending comparisons (opt-in)
- **Voice Input:** Siri/Google Assistant for quick transaction entry
- **Wearable Support:** Apple Watch/Wear OS companion app

---

## 12. Appendices

### 12.1 Glossary
- **RLS (Row-Level Security):** Database policy that restricts access to rows based on user context
- **RRULE:** RFC 5545 recurrence rule format for recurring events
- **LCP (Largest Contentful Paint):** Core Web Vital measuring load performance
- **NLQ (Natural Language Query):** User queries in conversational English
- **FX (Foreign Exchange):** Currency conversion rates
- **ETA (Estimated Time of Arrival):** Projected date for goal completion

### 12.2 References
- [Supabase Documentation](https://supabase.com/docs)
- [Next.js 14 App Router](https://nextjs.org/docs/app)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [RRULE Specification](https://icalendar.org/iCalendar-RFC-5545/3-8-5-3-recurrence-rule.html)

### 12.3 Architectural Decision Records (ADRs)

**ADR-001: Local-First Architecture**
- **Context:** Users need privacy and offline capability
- **Decision:** Store all data in IndexedDB/local storage by default; optional Supabase sync
- **Consequences:** Increased complexity in sync logic; enhanced privacy trust

**ADR-002: Supabase for Backend**
- **Context:** Need rapid development with auth, database, and realtime
- **Decision:** Use Supabase (PostgreSQL + RLS + Auth)
- **Consequences:** Vendor lock-in mitigated by open-source nature; excellent DX

**ADR-003: shadcn/ui Component Library**
- **Context:** Need customizable, accessible components without bloat
- **Decision:** shadcn/ui (Radix primitives + TailwindCSS)
- **Consequences:** Copy-paste approach; full control; steeper learning curve

**ADR-004: AI Processing Location**
- **Context:** Balance between performance and privacy
- **Decision:** Server-side AI processing with anonymized/aggregated data
- **Consequences:** Better model quality; requires careful PII handling

---

## 13. Delivery Checklist

### 13.1 Code Deliverables
- [ ] Full Next.js codebase with App Router structure
- [ ] TypeScript strict mode enabled; 0 type errors
- [ ] ESLint + Prettier configured; 0 lint errors
- [ ] All shadcn/ui components installed and themed
- [ ] Supabase schema SQL files (migrations)
- [ ] Seed data script (TypeScript or SQL)
- [ ] Environment variable template (.env.example)
- [ ] README.md with setup instructions
- [ ] package.json with all dependencies

### 13.2 Documentation
- [ ] This PRD (prd.md)
- [ ] ERD diagram (Markdown or image)
- [ ] Architecture notes (system boundaries, integration patterns)
- [ ] API contract documentation (TypeScript interfaces)
- [ ] Deployment guide (Vercel + Supabase one-click)

### 13.3 Assets
- [ ] Logo (SVG)
- [ ] Favicon (ICO + PNG)
- [ ] Empty state illustrations
- [ ] Sample screenshots (3-5 key screens)
- [ ] Demo GIF or video (< 30s)

### 13.4 Testing
- [ ] Vitest unit tests (80%+ coverage)
- [ ] Playwright E2E tests (critical flows)
- [ ] Accessibility audit report (axe-core)
- [ ] Lighthouse performance report

### 13.5 Deployment
- [ ] Vercel project created
- [ ] Supabase project created
- [ ] Environment variables configured
- [ ] Domain connected (optional)
- [ ] CI/CD pipeline functional
- [ ] Production deploy successful

---

## 14. Approval & Sign-Off

**Product Requirements Approved By:**
- [ ] Product Owner / Stakeholder
- [ ] Engineering Lead (Orion System Orchestrator)
- [ ] Design Lead
- [ ] QA Lead

**Date Approved:** ___________

**Next Steps:**
1. Kickoff meeting with development team
2. Sprint planning (break PRD into user stories)
3. Design mockups and prototypes
4. Development begins on core infrastructure
5. Weekly check-ins on progress vs. acceptance criteria

---

**End of Product Requirements Document**
