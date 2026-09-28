# 📊 DATA_CONTRACTS.md — Driver Rewards & Drivosity Performance System

> **Purpose:** Authoritative reference for the Driver Rewards portal (`driver-rewards.pages.dev`), Cloudflare D1 SQLite database, and Pages Functions backend.

## Production Architecture & Cloudflare Deployment

- **Production URL:** `https://driver-rewards.pages.dev`
- **Frontend / Cloudflare Project:** `driver-rewards` (`Driver_Rewards/public/`)
- **Backend API:** Cloudflare Pages Functions (`Driver_Rewards/functions/api/rewards.js`)
- **Database:** Cloudflare D1 SQLite (`driver_rewards_d1`)
- **Deployment Command:** `npx wrangler pages deploy public --project-name driver-rewards`
- **Master CSS:** `public/LMS_Global_Styles.css`
- **Unified Support Desk:** `public/lms_feedback.js` routing issues directly to the central `Beta_Feedback` Google Sheet.

---

## Cloudflare D1 Database Schema (`driver_rewards_d1`)

The active production database is hosted on Cloudflare D1 SQLite, bound to Pages Functions under `env.DB`.

### 1. `driver_ledger` (Master Point Transactions)
Stores all periodic safety earnings, delivery performance, and redemption events.
```sql
CREATE TABLE IF NOT EXISTS driver_ledger (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    driver_key TEXT NOT NULL,       -- Normalized 'first_name last_name' in lowercase
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    store TEXT,
    market TEXT NOT NULL,           -- 'Dallas', 'Denver', 'El Paso', 'LA'
    do_name TEXT,
    trips INTEGER DEFAULT 0,        -- Total completed deliveries in period
    score REAL DEFAULT 0,           -- Period average Drivosity safety score
    points_earned INTEGER DEFAULT 0,-- Added points (negative for prize redemptions)
    period TEXT NOT NULL,           -- e.g. 'P9 2026', 'P10 2022'
    period_year INTEGER DEFAULT 2026,
    period_number INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,    -- 1 if active, 0 if terminated/CSR
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_driver_market ON driver_ledger(market);
CREATE INDEX IF NOT EXISTS idx_driver_key ON driver_ledger(driver_key);
```

### 2. `fiscal_periods` (Calendar Schedule)
```sql
CREATE TABLE IF NOT EXISTS fiscal_periods (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    period_name TEXT NOT NULL,      -- e.g. '10', 'P10'
    start_date TEXT NOT NULL,       -- YYYY-MM-DD
    end_date TEXT NOT NULL,         -- YYYY-MM-DD
    next_period TEXT,               -- e.g. '11'
    is_current INTEGER DEFAULT 0
);
```

### 3. `do_lookup` (Store to Market & DO Mapping)
```sql
CREATE TABLE IF NOT EXISTS do_lookup (
    store TEXT PRIMARY KEY,
    market TEXT NOT NULL,
    do_name TEXT NOT NULL
);
```

### 4. `prize_links` (Manager Catalog Ordering URLs)
```sql
CREATE TABLE IF NOT EXISTS prize_links (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tier_name TEXT NOT NULL,        -- e.g. 'Top Driver Pin (60 pts)'
    order_url TEXT NOT NULL         -- Vendor purchasing URL or local buy indicator
);
```

### 5. `active_roster` (Weekly Active Driver Sync)
Stores currently employed staff synced weekly from payroll/HR to filter out terminated employees from public views while preserving ledger history.
```sql
CREATE TABLE IF NOT EXISTS active_roster (
    driver_key TEXT PRIMARY KEY,       -- Normalized 'first_name last_name' in lowercase
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    employee_id TEXT,                  -- Corporate Payroll / Pulse ID
    store INTEGER NOT NULL,
    market TEXT,                       -- Resolved via do_lookup
    position TEXT,                     -- 'Driver', 'Shift Leader', etc.
    updated_at TEXT NOT NULL           -- YYYY-MM-DD sync timestamp
);
CREATE INDEX IF NOT EXISTS idx_active_roster_market ON active_roster(market);
CREATE INDEX IF NOT EXISTS idx_active_roster_store ON active_roster(store);
```

### 6. `prize_redemptions` (Live Schema for Fulfillment Tracking)
```sql
CREATE TABLE IF NOT EXISTS prize_redemptions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    submission_id TEXT UNIQUE,        -- Crunchtime/Zenput submission ID (prevents duplicates)
    driver_key TEXT NOT NULL,         -- 'first_name last_name' in lowercase
    driver_name TEXT NOT NULL,        -- 'First Last'
    store INTEGER NOT NULL,
    market TEXT NOT NULL,
    do_name TEXT,
    item_name TEXT NOT NULL,          -- e.g. "Pizza Blanket", "Domino's Shoes"
    points_spent INTEGER NOT NULL,    -- Informational/audit (not shown in simple list)
    details TEXT,                     -- Sizing, shoe color, gift card type, etc.
    status TEXT DEFAULT 'Pending',    -- 'Pending', 'Purchased'
    redemption_date TEXT NOT NULL,    -- Date submitted (YYYY-MM-DD)
    purchased_date TEXT,              -- When marked purchased (YYYY-MM-DD)
    purchased_by TEXT,                -- Name or DO who marked it
    submission_link TEXT,             -- Link to Crunchtime audit/PDF
    notes TEXT
);

CREATE INDEX IF NOT EXISTS idx_redemptions_market ON prize_redemptions(market);
CREATE INDEX IF NOT EXISTS idx_redemptions_store ON prize_redemptions(store);
CREATE INDEX IF NOT EXISTS idx_redemptions_do ON prize_redemptions(do_name);
CREATE INDEX IF NOT EXISTS idx_redemptions_status ON prize_redemptions(status);
```

---

## Pages Function API Contract (`/api/rewards`)

- **Base URL:** `https://driver-rewards.pages.dev/api/rewards`
- **File:** `functions/api/rewards.js`
- **D1 Database ID:** `db836fe7-2ecc-40b6-97b8-5d006e0e19bc` (binding: `env.DB`)

| Method | Action | Query / Body Params | Output | Description |
|---|---|---|---|---|
| `GET` | `getPoints` | `market=<Market>` | `{ status: "success", count: N, data: [...] }` | Returns aggregated drivers for the market. Automatically filters for active employees if `active_roster` is populated. |
| `GET` | `getPeriodOnly` | *(none)* | `{ name: "10", dateRange: "...", nextName: "11" }` | Returns active fiscal period date range. |
| `GET` | `getAdminLinks` | *(none)* | `[ { name: "...", url: "..." }, ... ]` | Returns prize vendor URLs for manager ordering. |
| `GET` | `getActiveRosterStatus` | *(none)* | `[ { market: "Dallas", count: N, last_updated: "..." } ]` | Returns active roster sync counts and dates by market. |
| `GET` | `getRedemptions` | `market=<Market>&do=<DO>&store=<Store>&status=<Status>` | `{ status: "success", count: N, summary: { pending, purchased }, data: [...] }` | Returns filtered prize redemptions and pending/purchased summary counts. |
| `POST` | `syncActiveRoster` | Body: `{ drivers: [ { first_name, last_name, store, employee_id, position } ] }` | `{ status: "success", count: N, markets: [...] }` | Replaces active roster for provided markets in D1. Invoked by `sync_active_roster.bat`. |
| `POST` | `updateRedemptionStatus` | Body: `{ id, status, purchased_by }` | `{ status: "success", data: { ...updatedRecord } }` | Updates status (`Pending` or `Purchased`), setting/clearing `purchased_date` and `purchased_by`. |
| `POST` | `importRedemptions` | Body: `{ submissions: [ { submission_id, first_name, last_name, store, item_name, points_spent, details, status, redemption_date, submission_link } ] }` | `{ status: "success", processed: N, inserted: M }` | Batch imports redemptions with deduplication. Invoked by `sync_redemptions.bat`. |

---

## Qualification Rules & Point Ledger Logic

1. **Qualification Thresholds:**
   - Deliveries: $\ge 100$ deliveries in a single fiscal period.
   - Safety Score: $\ge 96.0$ average Drivosity score in that period.
2. **Points Calculation:**
   - If qualified: `Points Earned` = Drivosity Score (e.g. `97` score &rarr; `97` points earned).
   - If unqualified: `Points Earned` = `0`.
3. **Ledger Immutability:**
   - Points are additive (`SUM(points_earned)`).
   - Historical records are never deleted; terminated employees are suppressed via active roster filtering rather than deleting ledger history.
