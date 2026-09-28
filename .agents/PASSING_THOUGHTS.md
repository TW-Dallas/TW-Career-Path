# 🔁 PASSING_THOUGHTS.md — Mid-Project IDE Handoff

## What This File Is

This file is a **context bridge** written by the active AI assistant (Nova / Antigravity or Claude Code)
whenever Mike switches IDEs mid-project. It preserves the *why* behind recent decisions so the
incoming assistant doesn't re-litigate settled choices or re-implement intentionally skipped work.

## When To Use It

- **Only mid-project** — completed sessions don't need a handoff (CHANGELOG covers those).
- Mike will say something like *"I'm switching to Claude Code"* or *"picking this up in Antigravity."*
- The outgoing assistant writes this file before Mike leaves.
- The incoming assistant reads this file **before doing anything else**.

## How To Load It (Claude Code)

When loading into Claude Code, tell it:
> "Read `.agents/AGENTS.md` and `.agents/PASSING_THOUGHTS.md` before doing anything."

---

## 🗓️ Handoff — September 23, 2026 (09:10 AM CST)
**From:** Nova (Antigravity IDE)  
**To:** Claude Code / Antigravity  
**Project:** MIT Leadership Classes End-to-End Automated Email Lifecycle

### 🎯 Current State & Accomplishments
0. **Trainer Dashboard Header Parity (`trainer_dashboard.html`):**
   - Removed obsolete local `header { background-color: white; }` style overrides and unwrapped `<div class="header-left">`.
   - Now renders the authentic Domino's Dark Blue header (`var(--dark-blue)`), crisp white crust titles, market pill, and action buttons (`← CLASS SCHEDULE`, `🛠️ REPORT ISSUE`) matching `classes.html`.
1. **Candidate Email Collection & Validation (Option A):**
   - Added standard required Email Address input to `#signupForm` in `LMS_Git/TW-Career-Path/classes.html`, matching Denver parity.
   - Saves to Cloudflare D1 `class_registrations` (`email` column) and GAS fallback.
   - Instant confirmation notice rendered in success modal with candidate's entered email.
2. **Three-Tier Automated Email Lifecycle (Staffing_Git / Apps Script @284):**
   - **Enrollee Instant Confirmation Email**: Dispatched immediately upon signup with full session details, location address, Google Maps link, trainer direct phone, Bobby's contact `(214) 609-4715`, and strict attendance policies.
   - **Enrollee Morning-Of Reminder Email**: Sent morning of class with start time, pen/notepad reminders, Google Maps link, and strict tardy/absence rules.
   - **Trainer Final Roster Email**: Dispatched upon signup cutoff to assigned trainer with complete confirmed attendee table (Name, Store, Position, Phone, Email) with Bobby CC'd.
3. **Canonical Training Center Addresses & Trainer Phones:**
   - **McKinney**: `4550 Eldorado Pkwy, McKinney, TX 75070`
   - **Mesquite**: `519 N Galloway Ave, Mesquite, TX 75149`
   - **Trainer Directory**: Bobby `(214) 609-4715`, Chris `(469) 674-8855`, Paul `(469) 450-9169`, Phu `(214) 404-6535`, Rebecca `(469) 390-8012`, Amanda `(972) 802-4392`, Beans `(214) 244-2599`, Kevin `(469) 515-5957`, Melissa `(972) 246-7668`, Stephanie `(817) 521-1016`.
4. **Attendance Policies Formatted:**
   - **Tardy**: Trainer must be notified before the start of class to be permitted entry.
   - **Absence**: Notify trainer and Bobby before class begins or it is an unexcused absence with a written warning.
5. **Deployments & Verification:**
   - `clasp push` + deployed version 284 to deployment `AKfycbxQVuU0uQ3TdkfsBwJpZ-K1iUDXTuLgvqEayPeqZgSRLDNxHOEUsOrjaSZAujI8p_874g`.
   - Live test email verified: `{"success":true,"message":"MIT confirmation email dispatched."}` to `mjacobs@team-wow.com`.
   - `TW-Career-Path` committed & deployed to Cloudflare Pages (`https://tw-career-path.pages.dev`).
   - `TW-Staffing-Tracker` committed & deployed to Cloudflare Pages (`https://tw-dallas-staffing.pages.dev`).

### 🚀 Next Up / Roadmap for Upcoming Session:
1. **Trainer / DO Dashboard Redesign (`trainer_dashboard.html`):**
   - Replace the clunky `<select>` dropdown with an interactive, searchable session list where DOs and Trainers can easily filter and search by store, class name, trainer, date, or market.
   - Clean, friendly card or table view displaying upcoming sessions with live seat counts, trainer info, and one-tap roster inspection.
2. **Attendance Truth: Dedicated MIT Completion Form (like NTO `/completion.html`):**
   - Just like NTO, online class signups (`class_registrations`) are only the **expected roster**.
   - Ground-truth attendance will be captured via a branded **MIT Completion Form** filled out by attendees at the end of class.
   - Writes directly to Cloudflare D1 (`mit_attendance_records` / `class_registrations` status `Completed`) for permanent corporate tracking and promotion verification.
3. **Clean Up Trainer Action Buttons:**
   - Redesign or retire the legacy binary `✓ PRESENT` / `✕ NO-SHOW` buttons in favor of the formal completion submission workflow.

---

## 🗓️ Handoff — September 23, 2026 (08:45 AM CST)
**From:** Nova (Antigravity IDE)  
**To:** Claude Code / Antigravity  
**Project:** Career Path & Driver Rewards Global Button & Market Pill Parity

### 🎯 Current State & Accomplishments
1. **Canonical Header Action & Market Pill Typography System Synchronized:**
   - **Height & Padding**: Both `.market-pill` and `.header-action-btn` are locked to `min-height: 32px !important; padding: 5px 12px !important; box-sizing: border-box !important;`.
   - **Font**: `'Subhead1', 'OneDotCd-Bold', sans-serif !important; font-size: 0.82rem !important; font-weight: normal !important; text-transform: uppercase !important; letter-spacing: 0.5px !important; line-height: 1 !important;`.
   - **Visual Appearance**:
     - `.market-pill`: Solid Domino's Red (`var(--brand-red)`), crisp white uppercase text.
     - `.header-action-btn`: Glassmorphic crust tint (`rgba(254, 250, 246, 0.12)`), crisp 1.5px white crust border (`rgba(254, 250, 246, 0.85)`), hovering to solid red (`var(--brand-red)`).
   - **Icon Standardization**:
     - Stripped out bloated circular custom emoji PNG badges (`manager_lock.png` and `support_gear.png`) with red/tan circles.
     - Standardized on clean inline emojis matching the main page: `🔒 TRAINER PORTAL`, `🔒 MANAGER / DO`, `← CLASS SCHEDULE`, `🛠️ REPORT ISSUE`, and `🎓 WOW WAY HUB`.
2. **Files Updated**:
   - `LMS_Git/TW-Career-Path/classes.html`
   - `LMS_Git/TW-Career-Path/trainer_dashboard.html`
   - `Driver_Rewards/public/index.html`
   - `Driver_Rewards/public/LMS_Global_Styles.css`
   - `Team_Wow_Assets/public/brand_master.css` & `Staffing_Git/TW-Staffing-Tracker/brand_master.css`
3. **Deployments & Git:**
   - Pushed commit to `TW-Dallas/TW-Career-Path` (`main`).
   - Deployed live:
     - `https://tw-career-path.pages.dev` (`classes.html`, `trainer_dashboard.html`)
     - `https://driver-rewards.pages.dev` (`public/index.html`)

---
**From:** Nova (Antigravity IDE)  
**To:** Claude Code / Antigravity  
**Project:** Team Wow Ecosystem Unification & Career Path Cloudflare Migration

### 🎯 Current State & Accomplishments
1. **Team Wow Career Path Migrated to Cloudflare Pages:**
   - **Production URL**: `https://tw-career-path.pages.dev`
   - **Auto-Redirect**: All `tw-dallas.github.io/TW-Career-Path` visits 301-redirect to `https://tw-career-path.pages.dev`.
   - **Header & Actions**: Domino's brand blue with 4px red stripe, tagline in Domino's Sans Subhead 1, and top action cluster with `[🎓 Learning Hub]` and `[🛠️ Report Issue]`.
   - **Class Signups**: Kept Dallas (`classes.html`) and Denver (`denver_classes.html`), removed El Paso and Los Angeles, kept Virtual as non-clickable coming-soon.
2. **Global Mobile Header Centering Standardized:**
   - Standardized flat direct-child `<header>` structure (`logo`, `header-text`, `market-pill`) across `orientation.html`, `denver_orientation.html`, `completion.html`, and `index.html`.
   - Purged buggy `display: contents` dependency on mobile wrappers.
   - Deployed to both `tw-staffing.pages.dev` and `tw-dallas-staffing.pages.dev`.
3. **NTO Completion (`/completion`) Standardized:**
   - Header brought into parity with market pill and dynamic candidate detection.
   - Initial URL query param `?market=denver` supported.
4. **All Changes Pushed & Deployed:**
   - `teamwow-assets`: Deployed to `https://teamwow-assets.pages.dev`
   - `tw-staffing` & `tw-dallas-staffing`: Deployed to Cloudflare Pages
   - `tw-career-path`: Deployed to `https://tw-career-path.pages.dev`

---

## 🗓️ Handoff — September 23, 2026 (03:25 AM CST)
**From:** Nova (Antigravity IDE)  
**To:** Claude Code / Antigravity  
**Project:** Team Wow Global Brand Master & Footer Standardization

### 🎯 Current State & Accomplishments
1. **Global Brand Master Architecture Launched:**
   - Authoritative stylesheet published to CDN: `https://teamwow-assets.pages.dev/brand_master.css`.
   - Contains: Core 6 Domino's fonts (all registered `font-weight: normal; font-style: normal;` with aliases), full Crust tokens, authentic pill buttons (`.btn-pill-red`, `.btn-pill-crust`, `.btn-pill-blue`, `.btn-pill-outline`), inputs, badges, branded modals (`.modal-overlay`, `.modal-card`), and `.portal-header` / `.portal-footer`.
2. **Unified 2-Line Symmetrical Footer Standard Deployed Across 4 Pages:**
   - Left side: Title + Subtitle (Left-justified on desktop).
   - Right side: Copyright + `Powered by Crust & Code` (Right-justified on desktop).
   - Mobile view (≤ 760px): Centered and stacked.
   - Deployed live to:
     - `https://tw-dallas-staffing.pages.dev/completion`
     - `https://tw-dallas-staffing.pages.dev/orientation` (Dallas)
     - `https://tw-dallas-staffing.pages.dev/denver_orientation` (Denver)
     - `https://driver-rewards.pages.dev/` (Driver Rewards, zero-scroll strictly protected)
3. **Next Up:** Ready for the next target site to connect to the Global Brand Master.

---

## 🗓️ Handoff — September 22, 2026 (07:54 AM CST)
**From:** Nova (Antigravity IDE)  
**To:** Claude Code / Antigravity  
**Project:** Driver Rewards Portal (`driver-rewards.pages.dev` / Cloudflare Pages + D1 SQLite)

---

### 🎯 Current State & Accomplishments
1. **Multi-Market Ingestion Complete:**
   - Denver (788 active drivers) and LA (214 active drivers) fully ingested into `active_roster` alongside Dallas and El Paso (total 1,921 active drivers).
   - Ingest script `sync_active_roster.py` supports both `.xls` and `.xlsx` corporate roster exports and automatically excludes terminated drivers.
2. **2026 Ledger Deduplication & Split-Shift Aggregation Complete:**
   - Fixed Drivosity casing fragmentation where uppercase shifts were split into separate rows.
   - Aggregated trips and weighted scores across **660 driver-period groups** in 2026 and pruned **787 fragmented duplicate rows**.
   - Verified remaining 2026 multi-trip groups: **0**.
   - Ines Serrao's P2 2026 verified live: **199 trips** (184 + 15 combined) @ **100.0 DriveScore**, +100 points, verified total balance = **1,186 points**.
   - Negative prize redemptions protected and 100% intact.
3. **Database Infrastructure:**
   - Upgraded to Cloudflare Workers Paid ($5/mo), providing 25 Billion D1 database row reads / month and 50M writes / month. No more daily 5M free-tier quota limits.
4. **Huddle, Changelog & Asset Studio Architecture:**
   - Routing text in email blast & preview updated to **Mike Jacobs (Team Wow Site Support)**.
   - Portal header button cleaned from "2026 Prize Catalog (PDF)" to "2026 Prize Catalog".
   - Edition 6 draft in `TW-Career-Path/CHANGELOG.md` updated with full Driver Rewards release highlights for Thursday's regular weekly send (Sept 24, 2026).
   - `Driver_Rewards/CHANGELOG.md` updated with Version 1.5 release log.
   - Banished rogue pizza emoji (`🍕`) from report submission modal in `public/lms_feedback.js`, replacing it with `image/received.png`.
   - Launched standalone **Team Wow Design System & Global Asset Hub** (`Team_Wow_Assets`) deployed to Cloudflare Pages (`teamwow-assets.pages.dev`).
   - Cleaned `Driver_Rewards`: removed `asset_library.html` and `asset_manifest.json` now that the asset library has its own dedicated home.

---

### 🎯 What We Were About to Work on (Before the CSS Deep-Dive)

Before we paused to polish the Manager Dashboard layout and typography, Mike raised three critical architectural/data topics that are queued up for Claude Code:

#### 1. Active Roster vs. Terminated Employees (The "Aaron Arnold" Problem)
* **The Problem:** Drivers who have quit or been terminated (e.g., Aaron Arnold) still appear in search results because their historical 2026/backfill points exist in the ledger. DOs specifically asked for terminated employees to be removed from view.
* **The Constraint:** We **cannot** delete their ledger rows because former drivers frequently get re-hired, and their historical earned balance must be preserved.
* **Proposed Architecture:** 
  - Maintain an `active_roster` table or an `is_active` status flag in Cloudflare D1.
  - Weekly update flow: Mike receives an active employee status report each week.
  - Need an efficient way to sync this list into D1 (e.g., via Python script `import_active_roster.py` or D1 batch query) without adding thousands of bloated rows to the public JSON payload.
  - When querying drivers for the frontend, filter for active employees only, while keeping historical ledger entries safely stored.

#### 2. Prize Redemptions Tracking & DO Fulfillment Workflow
* **The Goal:** Managers and DOs need to see redemptions for their drivers and track fulfillment (e.g. check off when they purchase a prize or order gear).
* **Proposed Architecture:**
  - Create a `prize_redemptions` table in D1:
    ```sql
    CREATE TABLE IF NOT EXISTS prize_redemptions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        driver_key TEXT NOT NULL,
        store TEXT NOT NULL,
        market TEXT NOT NULL,
        do_name TEXT NOT NULL,
        item_name TEXT NOT NULL,
        points_spent INTEGER NOT NULL,
        status TEXT DEFAULT 'Pending', -- 'Pending', 'Ordered', 'Purchased Locally', 'Delivered'
        redemption_date TEXT NOT NULL,
        fulfilled_date TEXT,
        notes TEXT
    );
    ```
  - Display a dedicated "Redemptions" tab or toggle in the Manager Dashboard so DOs only see redemptions for their stores.
  - Let DOs check off items when bought (with a lightweight API endpoint in `functions/api/rewards.js`).
  - Need a clear, simple workflow for how Mike inputs redemptions each period and deducts points from the ledger (`points_earned < 0`).

#### 3. Multi-Market Ingestion & Period Update Workflow
* **Denver & LA Access:** Mike was awaiting access to raw Drivosity data for Denver and LA.
* **Filtering CSRs:** Mike filtered out CSRs from the source data (~200 rows removed), keeping Drivers, Assistant Managers, and GMs (since they all drive deliveries).
* **Ingestion Pipeline:** Establish a standardized, repeatable Python script (`update_period.py`) that Mike can run each period to ingest the Excel data directly into D1 via Wrangler CLI without manual SQL edits.

#### 4. Header Buttons Aesthetic Refinement
* Mike noted: *"Well, we didn't fix the buttons, I am going to think about some way to make that not look... not good."*
* When returning to UI polish, rethink the top header buttons (`← Back to Driver View` & `🛠️ Report Issue`) to look cleaner, more cohesive, and less like generic pill tags.

---

### ✅ Completed & Deployed in This Session

1. **Cloudflare D1 & Pages Architecture**:
   - Production URL: `https://driver-rewards.pages.dev`
   - Bound Cloudflare D1 SQLite database (`driver_rewards_d1`) to Cloudflare Pages Functions (`/api/rewards`).
   - Replaced Google Apps Script endpoint with low-latency D1 queries.
2. **Manager Dashboard Layout**:
   - Integrated dropdowns (`Market`, `DO`, `Store`, `Search Driver`) into the blue top bar.
   - Table columns tightened (`40% Name / 18% Store / 24% DO / 18% Points`) to eliminate the middle dead space.
   - Default market state set to `Select Market...` (or inherited from driver search) to prevent Dallas bias.
3. **Typography Standard**:
   - Solved the font fallback bug where table headers and Points fell back to Arial Bold. Explicitly mapped `Dominos Sans Subhead 1` (`OneDotCd-Bold`) with `font-weight: normal !important;` so the browser renders authentic Domino's numerals and letters across all columns.
   - Changed first column header from `Driver` to `Name`.
4. **Prize Catalog**:
   - 2-column compact grid fitting all 10 prizes with zero internal scroll and clean `Order ↗` / `LOCAL BUY` indicators.
5. **Documentation**:
   - Created `DATA_CONTRACTS.md` with the full Cloudflare D1 SQLite table schemas (`driver_ledger`, `fiscal_periods`, `do_lookup`, `prize_links`) and Pages Function API contracts.

---

### ⚠️ Watch Out For (Gotchas & Constraints)

* **Dominos Typography (`OneDotCd-Bold`)**: Never apply `font-weight: bold;` or `700` to elements using Domino's custom fonts without testing. The font files are already bold cuts natively, but registered as `font-weight: normal` in `@font-face`. Bolding them causes the browser to reject the font and drop back to generic Arial.
* **Desktop Zero-Scroll Target**: The layout is engineered so `document.documentElement.scrollHeight <= 729px` on a standard 1536x729 laptop viewport. Keep container heights constrained with `calc(100vh - ...)` rules.
* **Deployment**: Deploy frontend and functions from `C:\Users\micha\OneDrive - Casey Professional Consulting, Inc\Driver_Rewards` using:
  ```bash
  npx wrangler pages deploy public --project-name driver-rewards
  ```

---

### 📂 Files Touched This Session

- `Driver_Rewards/public/index.html` (UI redesign, typography fix, removed asset_library footer link)
- `Driver_Rewards/public/LMS_Global_Styles.css` (Font-face bold alias update)
- `Driver_Rewards/functions/api/rewards.js` (Pages Function D1 API)
- `Driver_Rewards/DATA_CONTRACTS.md` (Cloudflare D1 SQLite schemas & API spec)
- `Driver_Rewards/public/lms_feedback.js` (Replaced 🍕 with received.png + dynamic imageBaseUrl)
- `Driver_Rewards/CHANGELOG.md` (Documented Version 1.5 asset & emoji updates)
- `Team_Wow_Assets/` (New dedicated global repo hosting master fonts, images, CSS, and Asset Hub app)
- `Driver_Rewards/.agents/PASSING_THOUGHTS.md` (This handoff file)
