# 🍕 The Wow Way Huddle — Newsletter & Changelog Hub

This hub tracks all new store features, system upgrades, bug fixes, and upcoming rollouts. Every Thursday morning, these updates are compiled into **The Wow Way Huddle** email blast sent company-wide to Franchise Leadership, GMs, Shift Runners, and Trainers. Date new entries to help track progression.

---

## 📌 [Draft: The Wow Way Huddle — Edition 6]
*Scheduled: Thursday, September 24, 2026 @ 9:00 AM CST/CDT (Compiled @ 5:00 AM CST/CDT)*

### 🍕 Fresh Out of the Oven (New Features & Content)
* **Driver Rewards Portal Multi-Market Expansion (Denver & LA Live!):** Expanded the live [Driver Rewards Portal](https://driver-rewards.pages.dev) to fully support **Denver** (788 active drivers) and **Los Angeles** (214 active drivers) alongside Dallas and El Paso. Over 1,900 active delivery drivers across all four markets can now look up their real-time safety scores, period delivery trip counts, and redeem accumulated points.
* **Trainer Dashboard & MIT Leadership Hub Overhaul:** Rebuilt the Dallas Trainer Dashboard with an instant type-to-filter class search bar and quick center/level filter pills, replacing the legacy dropdown with interactive session cards. Pre-registered candidates are now explicitly categorized as an Expected Roster, removing ambiguous check-in buttons in favor of an official, scannable **In-Class MIT Completion QR Code** and online completion portal (`mit_completion.html`) logging verified attendance directly to Cloudflare D1.
* **Driver Rewards 2026 Prize Catalog Quick Access:** Streamlined header navigation with 1-tap access to the complete 2026 Prize Catalog, detailing reward tiers from swag and car wash cards up to $150 Tire Gift Cards.

### 🛠️ Fixed & Polished (Solved Issues)
* **Driver Rewards Ledger Period Deduplication & Balance Audit:** Discovered and resolved a telematics casing mismatch that had introduced duplicate period records across 2026 data. Safely deduplicated 184 period rows across 2026 (P1–P9) in Cloudflare D1 and verified past redemptions, restoring 100% mathematical balance integrity.
* **Automated Weekly Active Roster Ingestion:** Updated the weekly roster sync pipeline to ingest comprehensive store listings directly from corporate reports, automatically filtering out inactive drivers and accurately mapping multi-store delivery runs to primary stores.
* **Driver Rewards Portal Support Routing:** Streamlined the in-portal "Report Issue" button to route driver inquiries and balance audits directly to **Mike Jacobs (Team Wow Site Support)** for fast turnaround.
* **Pizza Matcher (Module 3 Game 1) Laptop Optimization:** Added dual-mode controls to Game 1 so trainees on store laptops can now either drag recipe ingredients OR simply click an ingredient to select it, then click the matching pizza! Added an organic smooth-snap animation on ingredient placement, tightened layout dimensions to completely eliminate vertical micro-scroll on standard store laptops (1366x768), and added a reminder that completing any 3 of the 4 games unlocks Module 4.
* **Phone Hardware Practice (Full Practice Orders):** Fine-tuned the Park and Mute button target areas on the store phone hardware screen. Restored dedicated bouncing guide badges ("👈 PARK" and "👈 MUTE") and introduced gentle hardware key backlights so team members clearly learn where each feature lives without guesswork.
* **Driver Rewards Search Placeholder:** Updated the name search placeholder from an active team member's name to the classic Domino's dummy name *"Pete Zah"*, preventing unintended employee record lookups during demonstration.

### ⚠️ On Our Radar (Known Issues & Interim Fixes)
* **POS Simulator Background Graphic Typo (Practice Tutorial Screens):** A small grammar typo (*"We hiring delivery drivers"* instead of *"We're hiring delivery drivers"*) was identified on the background POS station screenshots across introductory tutorial steps. Because this text is baked directly into the original station screen captures taken from a store terminal, a visual touch-up is queued for an upcoming training asset refresh.

### 🔜 On the Horizon (Upcoming Content & Rollouts)
* **The Wow Way Trainer Class (~50% Complete!):** Development of the brand-new Trainer Coaching Class is well underway! We are putting the finishing touches on the presentation deck and preparing to film video footage.
* **Day 2 Curriculum (Customer Recovery & Sanitation):** Day 2 modules are completely built and polished; rollout is queued to launch right alongside the Trainer Class so trainers can guide their new hires with confidence.
* **Virtual MIT Program & Scheduling Hub:** Active architecture and development continues on our centralized multi-market Virtual MIT portal connecting online class schedules, automated rosters, and verified attendance.

### 💡 Store Pro-Tip of the Week
* **Module 3 Practice Arcade — Complete Any 3 of 4 to Unlock!**
  In the Day 3 Menu Overview Game Lobby, trainees only need to complete **any 3 of the 4 practice games** to unlock Module 4! If a new hire is practicing on a trackpad, they can choose the three challenges they enjoy most to earn their checkmark and move forward into the register simulator.

---

## 📦 Archive / Past Editions

Looking for older updates or foundational release notes? Check out our complete historical log:
* 📄 **[The Wow Way Huddle — Editions 1–4 Archive (Through September 10, 2026)](CHANGELOG_ARCHIVE.md)**
