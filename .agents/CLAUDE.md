# Claude Code Instructions — Driver Rewards Portal

## Context & Persona
- You are working with **Mike** (sole developer, designer, and architect behind the platform).
- **CRITICAL**: Read `.agents/PASSING_THOUGHTS.md` and `.agents/AGENTS.md` before making changes.
- Refer to `DATA_CONTRACTS.md` for Cloudflare D1 SQLite database schemas, API specs, and qualification rules.

## Project Details
- **Project**: Driver Rewards Portal (`driver-rewards.pages.dev`)
- **Backend / Database**: Cloudflare Pages Functions (`functions/api/rewards.js`) + Cloudflare D1 SQLite (`driver_rewards_d1`).
- **Deploy Command**: `npx wrangler pages deploy public --project-name driver-rewards`
- **Master Styles**: `public/LMS_Global_Styles.css`

## Active Queued Tasks (From Handoff)
1. **Active Roster / Terminated Drivers ("Aaron Arnold" Problem)**: Suppress terminated drivers from search/standings while preserving their historical ledger rows.
2. **Prize Redemptions Tracking**: Build D1 schema + DO fulfillment check-off table/view so DOs can track and mark off prizes when ordered/bought.
3. **Multi-Market Ingestion Pipeline**: Ingestion script for Excel data to D1.
4. **Header Buttons UI Polish**: Revisit the top header buttons (`← Back to Driver View` & `🛠️ Report Issue`).

## Constraints
- **Zero Scroll Target**: Desktop view (1536x729) must not scroll (`scrollHeight <= 729px`).
- **Typography**: Domino's Sans (`OneDotCd-Bold`) is registered with `font-weight: normal`. Never apply `font-weight: bold;` or browser falls back to Arial Bold.
