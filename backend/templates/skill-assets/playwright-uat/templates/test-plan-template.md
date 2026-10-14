# [FEATURE NAME] — Manual Test Plan (Automation-Ready)

> **Purpose:** Step-by-step click and interaction instructions for QA, stakeholders, and browser automation agents (e.g. Playwright).
>
> **Base URL:** `http://localhost:<port>` (or target environment URL)
>
> **Prerequisites:**
> - Application stack running locally or in target test environment
> - Authenticated session with required user role/permissions
> - Required seeded database records / fixtures loaded
> - Backend API, database, or cache access available for persistence verification queries

---

## User Personas & Scenarios Overview

| Persona | Role / Permission Context | Primary Goal |
|:---|:---|:---|
| **Standard / Restricted User** | User with feature flag disabled or standard permissions | Verify isolation: no unreleased controls or broken layouts appear |
| **Authorized / Flag-Enabled User** | User with feature flag enabled and write permissions | Complete core creation, update, and validation workflows |
| **Admin / Auditor** | Administrative or read-only oversight role | Verify listing views, status badges, and downstream data integrity |

---

## Test Suite 1: Feature Flag OFF / Unauthorized — Isolation

### Test 1.1: Verify UI elements are hidden when feature flag is OFF

**Pre-condition:** Ensure feature flag is disabled for the current user/environment.

| Step | Action | Selector / Target | Expected Result |
|:---:|---|---|---|
| 1 | Navigate to target feature view | `/<feature-route>` | Page loads standard layout |
| 2 | Open primary action modal/form | `[data-testid="open-form-btn"]` | Modal/form opens |
| 3 | Verify new controls are NOT visible | `[data-testid="<feature-control>"]` | Element does NOT exist in DOM |
| 4 | Verify layout integrity | Visual check: headers, borders, columns | No empty gaps, misalignments, or errors |

---

## Test Suite 2: Feature Flag ON — Element Availability & Validation

### Test 2.1: Verify new controls appear and enforce mandatory validation

**Pre-condition:** Enable feature flag for the target user/environment.

| Step | Action | Selector / Target | Expected Result |
|:---:|---|---|---|
| 1 | Navigate to target feature view | `/<feature-route>` | Page loads with feature active |
| 2 | Open primary action modal/form | `[data-testid="open-form-btn"]` | Modal/form opens with new controls visible |
| 3 | Fill required fields except the new control | Populate standard inputs; leave new control blank | Inputs populated |
| 4 | Submit or advance form | `[data-testid="submit-btn"]` | Form validation blocks submission with inline error message |

---

## Test Suite 3: Contextual Guidance & Dynamic Behavior

### Test 3.1: Contextual feedback and real-time switching

| Step | Action | Selector / Target | Expected Result |
|:---:|---|---|---|
| 1 | Select Option A | `[data-testid="<select-control>"]` -> Option A | Contextual banner/state A appears immediately |
| 2 | Select Option B | `[data-testid="<select-control>"]` -> Option B | Contextual banner/state B updates instantly without reload |

---

## Test Suite 4: Listing Views, Badges, and Details Inspection

### Test 4.1: Status badges in tables and details view

| Step | Action | Selector / Target | Expected Result |
|:---:|---|---|---|
| 1 | View entity listing table | `/<feature-route>` | Table displays expected status/category badge |
| 2 | Open entity details inspection view | Row click or direct URL | Details panel renders with expected metadata |
| 3 | View record with null/unmapped optional field | Table row with unmapped data | Column displays fallback indicator (e.g. `-`) cleanly |

---

## Test Suite 5: Downstream Data & Persistence Assurance

### Test 5.1: Verify backend persistence and cache synchronization

| Step | Action | Selector / Target | Expected Result |
|:---:|---|---|---|
| 1 | Query backend API, database, or cache for created entity | Backend read-back / DB query / cache key lookup | Stored fields match expected values from specification truth table |
