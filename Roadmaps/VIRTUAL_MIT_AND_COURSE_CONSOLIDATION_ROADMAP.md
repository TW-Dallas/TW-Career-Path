# 🎓 Virtual MIT Classes & Course Consolidation Roadmap

**Document Created:** September 3, 2026  
**Project Lead:** Mike Jacobs  
**Workspace:** `LMS_Git` / `TW-Career-Path`  
**Target Systems:** Career Path Hub, Virtual MIT Signup Portal, Multi-Market Course Backend

---

## 🎯 Executive Summary & Context

Currently, Manager In Training (MIT) course signups are fragmented across separate regional portals:
* **Dallas Market:** Managed via `classes.html` and dedicated Dallas backend spreadsheet/script.
* **Denver Market:** Managed via `denver_classes.html` and dedicated Denver backend spreadsheet/script.
* **Virtual MIT Classes:** Currently awkwardly mixed inside the Denver signup tab, causing cross-market confusion and manual roster overhead for trainers.

This roadmap outlines the phased plan to:
1. **Launch a Dedicated Virtual MIT Hub:** Give online classes a clean, standalone home on Career Path with automated links, rosters, and verified attendance.
2. **Establish Single Source of Truth Attendance:** Implement end-of-class QR code verification to guarantee training credit integrity (matching the Dallas standard).
3. **Consolidate Multi-Market Course Architecture:** Long-term unification of Dallas, Denver, and Virtual backends into a single, scalable scheduling engine.

---

## 🗺️ System Architecture

```mermaid
flowchart TD
    subgraph Frontend Entry Points (Career Path Hub)
        A["Career Path Hub (learning_hub.html)"]
        A --> B["📍 Dallas In-Person (classes.html)"]
        A --> C["📍 Denver In-Person (denver_classes.html)"]
        A --> D["💻 Virtual MIT Portal (virtual_mit.html)"]
    end

    subgraph Virtual MIT Automation Pipeline
        D -->|Student Sign-Up| E["Virtual MIT Backend (Apps Script)"]
        E -->|Auto-Reply| F["Immediate Confirmation Email (with Join Link)"]
        E -->|Morning Of Class| G["Automated Reminder Email"]
        E -->|1-Hour Cutoff| H["Trainer Final Roster Email"]
    end

    subgraph Class Delivery & Verified Attendance
        I["Trainer Hosts Class via Recurring Link"]
        I -->|Final Slide| J["QR Code Scan / Attendance Form"]
        J --> K[("Verified Attendance Roster (Single Source of Truth)")]
        K --> L["Trainer Real-Time Verification View"]
    end

    subgraph Future Consolidation Phase
        B -.-> M[("Unified Master MIT Scheduling Engine")]
        C -.-> M
        D -.-> M
    end
```

---

## 📅 Phased Execution Plan

### Phase 1: Leadership Alignment & Proposal (In Progress)
* [x] Draft collaborative proposal memo for Directors of Operations (DOs), with Executive & Admin teams CC'd.
* [x] Synthesize key decision points:
  * **Enrollment Access:** Option A (1-Hour Cutoff) vs. Option B (Open Access) vs. Hybrid (Open for All vs. Gated/Prerequisite).
  * **Curriculum Stability:** Keep market-specific MIT class requirements as-is for now (revisit standardization post-Wow Way rollout).
  * **Attendance Policy:** Align on QR-code verified attendance and retake protocol for unverified attendees.
* [x] Provide 1-click rich HTML email copy tool (`virtual_mit_proposal.html`).

### Phase 2: Frontend Separation & Virtual MIT Hub
* **Remove Virtual from Denver:** Cleanly strip online/virtual offerings out of `denver_classes.html` so it reflects strictly Denver in-person classes.
* **Build `virtual_mit.html`:**
  * Clean, Domino's-branded layout (OneDot fonts, `#006491` Deep Blue, `#E31837` Red accents).
  * Clear course descriptions, prerequisites, schedules, and instructor info.
  * Adaptive registration form capturing Name, Store #, Market, Employee ID, and Email.
* **Update Career Path Navigation:** Add a primary tile on `learning_hub.html` and `index.html` linking directly to Virtual MIT.

### Phase 3: Backend Automation & Communications Engine
* **Standalone Virtual Backend:**
  * Dedicated Google Sheet database: `Virtual_MIT_Rosters` and `Virtual_Class_Schedule`.
  * Dedicated Apps Script project to avoid cross-contaminating the new-hire LMS database.
* **Automated Notification Triggers:**
  * **Immediate Confirmation:** Auto-email with recurring session link and calendar file (.ics).
  * **Day-Of Reminder:** Automated morning email to all enrolled students.
  * **Roster Cutoff & Trainer Dispatch:** At cutoff (e.g. 60 minutes prior to session), lock the class roster and email a formatted attendee list to the scheduled trainer.

### Phase 4: Attendance Verification & Credit Integrity
* **Attendance Google Form:** Quick, mobile-friendly check-in form collecting Trainee Name, Store #, and Time.
* **Slide Deck QR Asset:** High-contrast QR graphic and clean shortlink provided to trainers for insertion into the final slide.
* **Trainer Live Verification Dashboard:** Real-time web view or live sheet enabling trainers to see who has submitted before dismissing class.
* **Retake Policy Integration:** Establish clear automated flag for unverified attendees requiring re-enrollment.

### Phase 5: Long-Term Multi-Market MIT Consolidation
* **Consolidated Course Engine:**
  * Merge Dallas, Denver, and Virtual into a single unified front-end interface with seamless market/modality switching (Tabs: *Dallas In-Person* | *Denver In-Person* | *Virtual*).
  * Consolidate backend spreadsheets into a unified multi-tenant schema with `Market` and `Modality` tags.
* **Workforce Intelligence Integration:**
  * Pipe completed MIT class credits directly into the Master Employee Database (`trainer_portal_v1.html`) for promotion readiness and raise auditing.

---

## 📋 Action Item Checklist

| Task | Owner | Target Delivery | Status |
| :--- | :---: | :---: | :---: |
| Send Leadership Alignment Email to DOs / Execs | Mike | Week 1 | ⏳ Ready to Send |
| Finalize Cutoff & Open Access Decisions | DOs / Mike | Week 1 | ⏳ Pending Feedback |
| Build `virtual_mit.html` UI | Nova & Mike | Week 2 | 📋 Queued |
| Configure Virtual MIT Apps Script & Sheet | Nova & Mike | Week 2 | 📋 Queued |
| Generate Final Slide QR Asset for Trainers | Nova | Week 2 | 📋 Queued |
| Strip Virtual Classes from `denver_classes.html` | Nova & Mike | Week 3 | 📋 Queued |
| End-to-End Pilot Test Session | Mike & Trainers | Week 3 | 📋 Queued |
| MIT Course Backend Consolidation (Dallas + Denver) | Nova & Mike | Post-Wow Way | 📋 Planned |
