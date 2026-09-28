# Workspace Rules & Preferences — Driver Rewards

- **User Name**: Mike
- **Assistant Persona**: Pair programming with Mike as Nova (Antigravity) or Claude.
- Mike is the sole developer, designer, and architect behind the platform (Talent Acquisition & Training Design).

## 🚗 Project Reference Directory: Driver Rewards Portal (`Driver_Rewards`)
* **Local Path**: `C:\Users\micha\OneDrive - Casey Professional Consulting, Inc\Driver_Rewards`
* **Cloudflare Pages Project**: `driver-rewards`
* **Cloudflare Pages URL**: `https://driver-rewards.pages.dev`
* **Database**: Cloudflare D1 SQLite (`driver_rewards_d1`)
* **Deployment Command**: `npx wrangler pages deploy public --project-name driver-rewards`
* **Master CSS**: `public/LMS_Global_Styles.css`
* **Unified Support Desk**: `public/lms_feedback.js` routing issues directly to the central `Beta_Feedback` Google Sheet.

## 🔁 Mid-Project IDE Handoff Protocol
When Mike switches between **Antigravity IDE (Nova)** and **Claude Code** mid-project:
- Read `.agents/PASSING_THOUGHTS.md` **before doing anything else.**
- Outgoing assistant overwrites `.agents/PASSING_THOUGHTS.md` fresh each time.

## 🍕 The Master Domino's Typography System
```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 1. DISPLAY / HERO    │ Dominos Sans ExtraBlack Regular (Header 1)           │
│ 2. PRIMARY HEADERS   │ Dominos Sans ExtraBold Regular (Header 2)            │
│ 3. ACTION & BANNERS  │ Dominos Sans Subhead 1 Regular                       │
│ 4. LABELS & BADGES   │ Dominos Sans Subhead 2 Regular                       │
│ 5. BODY & READING    │ Dominos Sans Body Compact Regular                    │
│ 6. DATA TABLES / NUM │ Dominos Sans Body Condensed Regular                  │
└─────────────────────────────────────────────────────────────────────────────┘
```

> **CRITICAL FONT GOTCHA**: Custom font `@font-face` rules are registered as `font-weight: normal`. Applying `font-weight: bold;` or `700` causes browser font fallback to Arial Bold. To use bold Domino's Sans, map the native bold font file (`OneDotCd-Bold`) and keep `font-weight: normal !important;`.

## 🎨 Global CSS & Styling Architecture
- **Single Source of Truth**: All CSS styles belong in `public/LMS_Global_Styles.css` or the base scoped styles in `public/index.html`.
- **Zero-Scroll Constraint**: On desktop (1536x729), the page must not scroll (`scrollHeight <= 729px`).
- **Brand Colors (Canonical Source of Truth: LMS_Global_Styles.css)**:
  - Brand Red: `#ff0000` (`--brand-red`)
  - Med Red: `#e70000` (`--med-red`)
  - Dark Red: `#910000` (`--dark-red`)
  - Brand Blue: `#0090e2` (`--brand-blue`)
  - Med Blue: `#0077bd` (`--med-blue`)
  - Dark Blue: `#005c91` (`--dark-blue`)
  - Crust Spectrum:
    - Base: `#fefaf6` (`--crust-base`)
    - Light: `#faf2e9` (`--crust-light`)
    - Med: `#f0decc` (`--crust-med`)
    - Dark: `#c0a588` (`--crust-dark`)
    - Deep: `#603913` (`--crust-deep`)
    - Burnt: `#472b10` (`--crust-burnt`)
