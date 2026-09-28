# 📄 Data Contracts & System Architecture

## 1. Cloudflare Ecosystem & Deployment Contracts

All Team Wow frontend web applications are hosted on **Cloudflare Pages** under the same standard deployment pattern:

| Project Name | Production URL | Local Repository Path | Deploy Command |
| :--- | :--- | :--- | :--- |
| **driver-rewards** | `https://driver-rewards.pages.dev` | `...\Driver_Rewards` | `npx wrangler pages deploy public --project-name driver-rewards` |
| **teamwow-assets** | `https://teamwow-assets.pages.dev` | `...\Team_Wow_Assets` | `npx wrangler pages deploy public --project-name teamwow-assets` |
| **tw-career-path** | `https://tw-career-path.pages.dev` | `...\LMS_Git\TW-Career-Path` | `npx wrangler pages deploy . --project-name tw-career-path` |
| **tw-dallas-staffing**| `https://tw-dallas-staffing.pages.dev` | `...\Staffing_Git\TW-Staffing-Tracker` | `npx wrangler pages deploy . --project-name tw-dallas-staffing` |
| **tw-catering-hub** | `https://tw-catering-hub.pages.dev` | `...\tw-catering-hub` | `npx wrangler pages deploy public --project-name tw-catering-hub` |

### What is a "Deployment"?
A **deployment** takes your local source files (HTML, CSS, JavaScript, images, and fonts from the project's build directory) and uploads them to Cloudflare's global content delivery network (CDN). Once uploaded:
1. Cloudflare distributes copies to edge data centers worldwide.
2. The site is immediately accessible at its `*.pages.dev` address.
3. Every project follows standard Wrangler CLI deployment patterns.

---

## 2. Global Asset Hub (`teamwow-assets`)

The central repository for shared design tokens, Domino's fonts, and brand assets:
- **Base CDN URL:** `https://teamwow-assets.pages.dev`
- **Master CSS:** `https://teamwow-assets.pages.dev/brand_master.css` (Canonical styles, headers, typography, buttons, modals, footers)
- **Legacy LMS CSS:** `https://teamwow-assets.pages.dev/LMS_Global_Styles.css`
- **Images:** `https://teamwow-assets.pages.dev/image/<filename>.png`
- **Fonts:** `https://teamwow-assets.pages.dev/fonts/<fontname>.ttf`

---

## 3. Driver Rewards D1 Database Schemas (`driver_rewards_d1`)

### Table: `active_roster`
Stores verified active employees from weekly roster syncs.
```sql
CREATE TABLE IF NOT EXISTS active_roster (
    driver_key TEXT PRIMARY KEY,       -- Format: FIRSTNAME_LASTNAME (uppercase, e.g. INES_SERRAO)
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    store TEXT NOT NULL,              -- 4-digit store number (e.g. 6784)
    market TEXT NOT NULL,             -- Dallas, Denver, El Paso, LA
    role TEXT NOT NULL,               -- Driver, Assistant Manager, General Manager
    status TEXT DEFAULT 'ACTIVE',     -- ACTIVE or TERMINATED
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

### Table: `driver_ledger`
Stores historical points transactions, split-shift aggregates, and prize redemptions.
```sql
CREATE TABLE IF NOT EXISTS driver_ledger (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    driver_key TEXT NOT NULL,
    driver_name TEXT NOT NULL,
    store TEXT NOT NULL,
    market TEXT NOT NULL,
    period TEXT NOT NULL,             -- e.g. P2_2026, P13_2025
    trips INTEGER DEFAULT 0,
    drivescore REAL DEFAULT 0.0,
    points_earned INTEGER NOT NULL,   -- Positive for rewards, negative for redemptions
    description TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

### Table: `prize_redemptions` (Planned)
Tracks prize redemption orders and DO fulfillment status.
```sql
CREATE TABLE IF NOT EXISTS prize_redemptions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    driver_key TEXT NOT NULL,
    store TEXT NOT NULL,
    market TEXT NOT NULL,
    do_name TEXT NOT NULL,
    item_name TEXT NOT NULL,
    points_spent INTEGER NOT NULL,
    status TEXT DEFAULT 'Pending',    -- 'Pending', 'Ordered', 'Purchased Locally', 'Delivered'
    redemption_date TEXT NOT NULL,
    fulfilled_date TEXT,
    notes TEXT
);
```

---

## 4. Team Wow Staffing & Career Path D1 Database (`tw-team-data`)

Database backing `tw-dallas-staffing.pages.dev` and `tw-career-path.pages.dev`:

### Table: `training_classes`
Stores upcoming and historical training class sessions (NTO and MIT).
```sql
CREATE TABLE IF NOT EXISTS training_classes (
    id TEXT PRIMARY KEY,                       -- e.g. '20261006-11-Lea'
    market TEXT NOT NULL DEFAULT 'Dallas',     -- 'Dallas', 'Denver', 'Virtual'
    program TEXT NOT NULL DEFAULT 'MIT',       -- 'MIT' | 'NTO'
    name TEXT NOT NULL,                        -- Course Name (e.g. 'Leading the Shift')
    level INTEGER DEFAULT 1,                   -- 1, 2, 3
    class_date TEXT NOT NULL,                  -- 'M/D/YYYY'
    start_time TEXT NOT NULL,                  -- e.g. '11:00 AM'
    end_time TEXT NOT NULL,                    -- e.g. '1:00 PM'
    trainer TEXT DEFAULT '',                   -- Trainer Name (Amanda, Chris, Kevin, etc.)
    location TEXT DEFAULT 'McKinney',          -- 'McKinney', 'Mesquite', 'Virtual'
    meet_link TEXT DEFAULT '',                 -- Virtual class link if applicable
    spots_total INTEGER DEFAULT 15,
    spots_taken INTEGER DEFAULT 0,
    open_date TEXT DEFAULT '',                 -- Enrollment window start
    close_date TEXT DEFAULT '',                -- Cutoff date for enrollees
    is_active INTEGER DEFAULT 1,               -- 1 = Open, 0 = Concluded/Cancelled
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

### Table: `class_registrations`
Stores expected roster / candidates registered online for class sessions.
```sql
CREATE TABLE IF NOT EXISTS class_registrations (
    id TEXT PRIMARY KEY,                       -- UUID
    class_id TEXT NOT NULL,                    -- Foreign key to training_classes.id
    candidate_id TEXT DEFAULT '',              -- Optional link to onboarding / employee ID
    candidate_name TEXT NOT NULL,
    store_num TEXT NOT NULL,
    position TEXT DEFAULT '',
    phone TEXT DEFAULT '',
    email TEXT DEFAULT '',                     -- Candidate email for confirmation & reminders
    status TEXT DEFAULT 'Confirmed',           -- 'Confirmed', 'Attended', 'Absent', 'Completed'
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(class_id) REFERENCES training_classes(id) ON DELETE CASCADE
);
```

### Table: `mit_attendance_records`
Ground-truth attendance log populated when attendees submit completion forms or check in.
```sql
CREATE TABLE IF NOT EXISTS mit_attendance_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
    candidate_name TEXT NOT NULL,
    candidate_id TEXT DEFAULT '',
    do_name TEXT DEFAULT '',
    store_num TEXT NOT NULL,
    attendance_date TEXT NOT NULL,
    class_name TEXT NOT NULL,
    level INTEGER DEFAULT 1,
    market TEXT NOT NULL DEFAULT 'Dallas',
    delivery_mode TEXT DEFAULT 'In-Person',
    trainer_name TEXT DEFAULT '',
    source_tab TEXT DEFAULT 'Form Responses', -- 'Form Responses', 'D1_Live', 'Old Roster'
    is_active_employee INTEGER DEFAULT 1,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

---

## 5. API Endpoints Reference

### Driver Rewards API (`Driver_Rewards/functions/api/rewards.js`)
- `GET /api/rewards?action=search&q=<name>`: Searches active drivers and returns total points.
- `GET /api/rewards?action=driver_detail&key=<driver_key>`: Returns full ledger history for a specific driver.
- `GET /api/rewards?action=manager_summary&market=<market>&store=<store>`: Returns store/market leaderboard for active employees.

### Staffing & Training API (`Staffing_Git/TW-Staffing-Tracker/functions/api/staffing.js`)
- `GET /api/staffing?action=getMitClasses&market=<market>`: Fetches active classes with live spot counts.
- `POST /api/staffing` (`action: "registerMitCandidate"`): Registers candidate, increments spots taken, and triggers confirmation email.
- `POST /api/staffing` (`action: "saveMitClass"`): Creates or updates class sessions (from Admin Hub).
- `POST /api/staffing` (`action: "saveMitAttendance"`): Updates registration status (`Attended`, `Absent`, `Completed`).
- `GET /api/staffing?action=getMitAttendanceHistory&q=<query>`: Queries completed training records for candidates/stores.
- `POST /api/staffing` (`action: "sendMitMorningReminders"`): Dispatches morning reminder emails for today's classes.
- `POST /api/staffing` (`action: "sendMitTrainerRosters"`): Dispatches finalized attendee roster to assigned trainer after signups close.

