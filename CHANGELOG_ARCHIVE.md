# 🍕 The Wow Way Huddle — Changelog & Edition Archive

This archive preserves past editions, foundational releases, and architectural upgrade logs from **The Wow Way Huddle**.

---

## 📮 Editions 1–3: Launch & Foundations Archive (August – September 3, 2026)

### 🍕 Fresh Out of the Oven (Initial Releases)
* **Team Wow Career Path & Learning Hub Launch:** Unveiled the public-access Career Path portal (`index.html`) and Learning Hub (`learning_hub.html`) connecting team members to position roadmaps, store job aids, and self-service training tools.
* **3-Day Training Program Architecture (Day 1 Launch):** Rolled out Day 1 universal foundational onboarding for CSRs and Delivery Drivers across 5 structured modules (Welcome, Service Basics, Menu Overview, POS Simulator, and Final Sign-Off).
* **Interactive POS Simulator (Stages 0–4):** Built full in-browser interactive Pulse terminal simulation covering carryout, delivery, order modifications, pizza sizing, specialty crusts, coupon attachments, and live customer phone drills.
* **Interactive Arcade Games (Module 3):** Deployed 4 interactive menu memory games (Pizza Matcher, POS Tab Finder, Menu Jeopardy, and Perfect Pairs) to reinforce product builds without store food waste.
* **Resource Library & Managers Library:** Cataloged foundational store resources including OA standards, pizza grading scales, product guides, and Pulse new employee setup guides.
* **Trainer Portal & PIN Security:** Established secure 4-digit Trainer PIN registration and verification system authorizing on-duty store trainers to certify completing new hires.
* **Branded Support & Feedback Engine (`lms_feedback.js`):** Built-in "Report Issue" tool allowing team members to report glitches or typos directly from any page with automated logging to Google Sheets (`Beta_Feedback`).

---

### 🛠️ Solved Issues & Technical Polish (Foundation Phase)
* **Backend Stability & Pre-Deploy Mechanical Syntax Gate:** Enforced mandatory automated syntax checking (`node --check`) prior to any Apps Script deployment or push. Retired 5 legacy fallback sheet lookups across PIN verification and standardized strictly on the `"Trainer Credentials"` sheet.
* **Cloud Tracking Database & High-Water Mark Protection:** Upgraded tracking logs with dedicated fields for `Score`, `Grade`, `Mistakes`, and `Trainer PIN`. Added server-side validation ensuring `"Completed"` status can never be overwritten or downgraded by subsequent session pings, and deployed `migrateHistoricalTrackingData` to backfill past data without loss.
* **Module 2 Video & Activity Progress Persistence:** Assigned learner-isolated completion states for all video lessons, enabled free review scrubbing upon completion, and added completion detection within 1.5s/98.5% duration.
* **Dashboard Prerequisite Locks & Session Restore:** Hardened sequential module locking (Mod 1 ➔ Mod 2 ➔ Mod 3 ➔ Mod 4) and multi-device session restores from cloud databases.
* **POS Simulator Engine Hardening:**
  * Added indestructible step-level auto-resume isolated to employee IDs.
  * Resolved image vs hitbox asynchronous loading race conditions.
  * Corrected Stage 3 Bread Tab hitbox to `#hb-bread-tab-6386`.
  * Added 150ms event debounce on phone/customer field transitions to eliminate false-positive error clicks.
  * Isolated Stage 1 customer address tab hitbox (`#hb-cust-add`).
  * Upgraded Stage 0–2 audio gating with friendly listening prompts.
  * Implemented Levenshtein typo tolerance and dynamic street address dropdown matching.
  * Handled Step 50 delivery instructions keyboard Enter submission.
* **Lobby & UI Polish:**
  * Re-architected Resource Library category cards into a responsive 3x2 photographic desktop grid.
  * Slimmed oversized headers and footers across Learning Hub, Career Path, and DO Dashboard.
  * Replaced blank black video boxes with animated Team WOW breathing-glow loaders and connection watchdogs.
  * Scoped mobile device blockers strictly to structured LMS training terminals while keeping landing pages 100% mobile-friendly.
  * Standardized typography to the Domino's Master Typography hierarchy.
* **Catering Portal Upgrades:**
  * Replaced full-screen beige loading overlay with non-blocking floating status pills and dancing dots.
  * Added 1-click instant-save toggle button (`🍕 Mark Entered in Pulse` ➔ `✅ Entered in Pulse (POS)`).
  * Cleaned up stray asterisks in automated email reply templates.

---

## 🔒 Internal Design Archive: Day 2 Curriculum Development Notes
*(Preserved for Internal Training Design & Trainer Class Development)*

### Day 2 Module 1: The Art of Customer Recovery & The Q-TIP Game Plan
* **Philosophy:** Coach Mike's Pre-Game Huddle teaching **Q-TIP** (*Quit Taking It Personally!*) and the "Hungry + Angry = Hangry" customer recovery formula.
* **Film Studies:** Trainees listen to real Winning Plays vs. Defensive Fumbles side-by-side (handling wrong toppings and late deliveries).
* **Live Call Deconstructions (Angel & Jonathan):** Auto-scrolling synchronized live audio transcripts with progressive **LEADS** checkpoints (*Listen, Empathize, Apologize, Do what it takes, Stand by our promise*).
* **Call the Shot Simulator (Liz & Aiden):** Interactive 3-decision branch where trainees pause live audio to choose Liz's recovery response.
* **Store Decision Guide:** Clear rules of thumb on priority rush remakes vs. proactive store credits.

### Day 2 Module 2: Cleaning, Chemical Safety & Sanitation
* **Handwashing Standard:** Coach Bobby's audio coaching, visual step ladder (Wet, Soap & Scrub 20s, Rinse, Dry, Paper Towel Faucet Shutoff), and strict OA guidelines.
* **Glove Standards & RTE Boundaries:** Rules on no-bare-hand contact for prepped bagging ingredients and cut-table items.
* **3-Compartment Sink & Interactive PPM Test Strip Lab:** Water temperatures (**110°F–120°F Wash/Rinse** vs **75°F Sanitize**), 60s contact time, air-dry only, and 10-second virtual test strip simulator (200 PPM target).
* **Chemical Safety & SDS:** Coach Mike audio on the #1 Chemical Law (*NEVER mix chemicals / toxic chloramine gas prevention*), 15-minute eyewash flush, and SDS binder locations.
* **Store Chore Board:** Coach Bobby's accountability breakdown with the official Team WOW daily station chore chart.
* **Sanitation Mastery Knowledge Check:** 6-question randomized OA mastery check authorizing trainees for Experience 1.
