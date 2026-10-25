# D'voice — Admin Dashboard Plan

**Status:** Working plan. Discussion complete; artifact for review and replanning.
**Predecessor:** DVOICE_PRODUCT_BASELINE.md (§7, §10, §11, §12 govern this document).
**Successor:** DVOICE_ADMIN_*_DESIGN_BRIEF.md (one per surface — not yet written).
**Purpose:** Define what the admin dashboard is, what it does, what it explicitly does not do, and what constraints it must honor. Written *before* any design brief, per §12 workflow.

---

## 1. Purpose

The admin dashboard exists so an **authorised operator** can add, edit, retire, and restore **resources**, **news items**, and **groups** — the three content types the public app renders — **without violating the constraints in the product baseline §10** (faculty minimum, save/unsave symmetry, download-never-saves, public download, collect-only-what's-read, freshness scoping, canonical route, sheet/page share, news-image-optional).

The dashboard is **content administration**. It is not user administration, not moderation, not analytics. Traffic monitoring is deferred (see §7 and §8) but its backend dependency is named here (§6.4) so the backend engineer knows it is coming.

The dashboard is **not** the signed-in student product. The founder-promotion constraint in §2.10 applies to the student experience; the admin dashboard may carry founder-branded news sources and founder-framed context without violating it.

---

## 2. Operator jobs

Each job is a sentence a real operator would say. Jobs listed here are **in scope**. Jobs considered and excluded are in §7.

### Content — Resources

- **A1.** "I need to add a resource for a course."
- **A2.** "I need to fix a mistake in an existing resource."
- **A3.** "I need to remove a resource that should not be public."
- **A4.** "I need to see which faculties are ready to be public and which are not." *(a view, not a page — lives inside the Faculty surface)*

### Content — Faculties

- **F1.** "I need to create a faculty before I can add resources to it."
- **F2.** "I need to rename a faculty."

### Content — News

- **B1.** "I need to publish a news item."
- **B2.** "I need to edit a published news item."
- **B3.** "I need to remove a news item."

### Content — Groups

- **B4.** "I need to add an indigenous group with at least one link."
- **B5.** "I need to edit or remove a group."

---

## 3. Surfaces

Four sidebar entries. The sidebar **is** the shape of the plan; four entries is the shape.

Four sidebar entries. The sidebar is the shape of the plan; four entries is the shape.

```
┌─────────────────────┐
│  D'voice Admin      │
│                     │
│  ▸ Overview         │
│  ▸ Faculty          │
│  ▸ News             │
│  ▸ Groups           │
└─────────────────────┘
```

### 3.1 Overview

Landing surface. Not a chart dashboard. Contains:

- **Faculty health** — every faculty with `public` / `unlisted (n/3)` status, `n` counting **published** resources only (see §5.4). This is the A4 view.
- **Recently changed** — last N records (resources, news, groups) sorted by `updated_at`, with name, action, timestamp. Reads existing data; no new table. Lightweight audit substitute (see §7, "Audit log").
- **Quick actions** — "Add resource", "Add news item", "Add group".

**No traffic numbers here.** Deferred; lands here post-MVP (§8).

### 3.2 Faculty — the primary workspace

Two levels inside one sidebar entry.

**Level 1 — Faculty list**
- Every faculty, public or unlisted, with published-resource count and status badge.
- "Create faculty" action.
- Click → Level 2.

**Level 2 — Faculty detail**
- Header: name (inline-editable with rename warning, see §5.6), status badge, published-resource count.
- Resource list scoped to this faculty: title, course code, level, type, status (published / draft / soft-deleted).
- Per-resource actions: **Edit** (opens form + preview), **Soft-delete**, **Restore** (if soft-deleted), **Publish** (if draft).
- **"Add resource"** button, scoped to this faculty (faculty auto-filled in the form).
- **No "Delete faculty" button.**
- **No "Move faculty" button.**

Resource add/edit form (a panel inside faculty detail, not a page):
- Fields per §5 of the baseline: title, course code, course title, content type, format, contributor, description (optional), level, faculty (pre-filled), file reference.
- **Preview toggle** ("Preview as student") — renders the **real resource-detail sheet** in admin context. Same component as the public app (§10.9). No new preview component.
- Save action: direct publish, or save-as-draft (see §5.1).
- Cancel.

This one workspace hosts A1, A2, A3, A4, F1, F2. **Not four pages.** Faculty-first organisation is the operator's mental model and the UI reflects it.

### 3.3 News

- **List:** headline, date, has-image indicator, source, status (draft / published / soft-deleted).
- **Add/edit form:** §10.10 fields. Image optional. `source` free text, default `"Office of the Founder"`.
- **Actions:** Save, Save as draft, Publish, Soft-delete, Restore.

### 3.4 Groups

- **List:** name, which links present (WhatsApp / external / both), status.
- **Add/edit form:** name, description (optional), `whatsapp` (optional), `external` (optional). **Validation: at least one of `whatsapp` / `external` must be non-empty.**
- **Actions:** Save, Soft-delete, Restore.
- **No draft state for groups.** (Groups are too small to need one; see §5.3.)

---

## 4. Navigation and routing

- Single admin SPA, sidebar persistent, `max-width` matching the student app's shell unless the design brief decides otherwise.
- Routes (proposed, subject to design brief):
  - `/admin` → Overview
  - `/admin/faculty` → Faculty list
  - `/admin/faculty/:id` → Faculty detail
  - `/admin/news` → News list
  - `/admin/groups` → Groups list
- The admin is **a separate shell from the student app**, with its own header and sidebar. It does not reuse the student bottom-nav.

---

## 5. Safety rules per action

| Action | Rule | Constraint |
|---|---|---|
| **A1 Add resource** | Direct publish by default. Save-as-draft allowed. After save: toast `"Published to {Faculty} · {Level}"`. If this is the 3rd **published** resource, second toast `"{Faculty} is now public"`. Preview available before save. | §10.1, §10.6, §10.9 |
| **A2 Edit resource** | Direct save. Faculty/level change shows warning banner: *"This changes who sees this under 'Recently added'."* If the change would drop the origin faculty below 3 published resources, save is **blocked** with message. Preview available before save. | §10.1, §10.6, §10.9 |
| **A3 Delete resource** | **Soft delete** (flag `unavailable`; hidden from public; restorable). **Blocked** if the faculty would drop below 3 **published** resources after the operation. | §10.1 |
| **A4 Faculty health view** | Read-only. Displays `(n/3)` where `n` = published resources only. | §10.1 |
| **F1 Create faculty** | Name only. State = `unlisted`. Becomes `public` automatically when 3 published resources exist. | §10.1 |
| **F2 Rename faculty** | Allowed. Warning: *"This changes the public label on every resource in this faculty."* | — |
| **Delete faculty** | **Not offered.** No button, no modal, no flow. | §10.1 |
| **B1 / B2 News add/edit** | Direct publish or save-as-draft. `source` free text, default `"Office of the Founder"`. Image optional. | §10.10 |
| **B3 News delete** | **Soft delete + restore.** | Safe default |
| **B4 / B5 Group add/edit** | Direct save. **Validation: ≥1 of `whatsapp` / `external` must be non-empty.** | Operator rule |
| **Group delete** | **Soft delete + restore.** | Safe default |
| **Traffic monitoring** | **Not in MVP.** Deferred (§8). | §7 MVP focus |

### 5.1 Draft state (resources, news)

- **Draft resources do not count toward the 3-resource faculty minimum.** Otherwise a faculty could auto-publish on 3 drafts and the public would see an empty faculty.
- Draft resources are visible in the faculty detail view with a `Draft` badge; they are **not** visible to students.
- A draft resource can be **published** or **soft-deleted** from the faculty detail view.
- News items share the same draft/public distinction.
- **Groups have no draft state** (see §5.3).

### 5.2 Delete rules, simplified

- Floor is 3 **published** resources **after** the operation. `4→3` allowed. `3→2` blocked.
- No clever reading. No reassignment flow. The two escapes for a blocked delete are the ones already in the product: (a) add another published resource to the faculty, (b) edit an existing resource's faculty away to another faculty — subject to A2's own block rule.
- Soft delete means "tag as unavailable, keep the record, restorable by admin." Not a hard delete.

### 5.3 Groups have no draft

Groups are small (name + description + up to two links). A draft state adds a status to track for no benefit. Groups are direct-publish.

### 5.4 Faculty publication counts published resources only

Restates §5.1: the `(n/3)` counter and the auto-publication trigger both count **published** resources. Drafts are listed but not counted.

### 5.5 Rename faculty warning

Renaming is allowed. The warning text is specified in §5 table (F2). No confirmation modal — a warning banner in the form is sufficient.

### 5.6 No faculty delete

The absence of the operation is the enforcement of §10.1. Not a disabled button, not a modal that says "you can't," — the button does not exist.

---

## 6. Constraint traces (which §10 rules each surface touches)

### 6.1 Resources

- **§10.1 faculty minimum** — enforced on add (auto-publish on 3rd published), edit (block if would drop below 3), delete (block if would drop below 3), and displayed in the health view.
- **§10.6 freshness scoping** — add/edit form captures faculty and level; the edit form warns on faculty/level change because freshness is scoped to the student's faculty and level.
- **§10.9 sheet/page share** — the preview in add/edit is the **real resource-detail sheet**, rendered in admin. No new preview component.
- **§10.4 public download** — not touched by admin; admin does not download (see §7).
- **§10.2 save/unsave** — not touched; admin has no access to saved libraries (see §7).

### 6.2 Faculties

- **§10.1** — creation, rename, and publication state are all expressions of the 3-minimum rule.

### 6.3 News

- **§10.10 image optional** — form accepts image or no image; list view renders both without layout break.

### 6.4 Groups

- No §10 constraint touches groups directly. The operator rule "≥1 link" is a product decision recorded here.

### 6.5 Deferred — traffic monitoring backend dependency (named, not planned)

Traffic monitoring is deferred (§8), but its backend dependency is recorded here so the backend engineer knows it is coming:

- **Event log** — one row per `download` and one per `open`. Columns: `event_type`, `resource_id`, `occurred_at`, optional `session_hash`.
- **Read-only.** No writes from the admin dashboard.
- **Aggregate reads only** — counts per day, per faculty, per resource. No per-user trail (consistent with §10.5).
- **Not personalised** — no per-student attribution, so §7's exclusion of personalised recommendations does not apply.

Naming it here is deliberate. It is not a commitment to build it in this window; it is a commitment to *shape the backend so it can exist*.

---

## 7. Exclusions with reasons

Each entry: **item — reason — when it might return.** "Later" is not a reason.

| Item | Reason | Returns |
|---|---|---|
| **Traffic monitoring** | No event source exists today; a page without it would show static mock numbers. | Post-MVP, own window. Lands as a section on Overview (§3.1), not a new page. Backend dependency named in §6.5. |
| **Contributor management** | Contributor is free text (§5); no contributor identity exists in the product. | With the contributor-flow planning window (post-MVP). |
| **User management** | §7 excludes phone / email editing / social login; §10.5 says collect only what features read. Users are readers. | Post-MVP as a customer-service lookup surface. |
| **Saved-library access** | §10.2 — save/unsave is user-owned. | Never as management. At most a count in the post-MVP traffic view. |
| **Download-for-admin** | §10.4's public path already exists; duplication. | Never as admin-only. |
| **Reassignment flow** | Delete is blocked at the floor of 3; the two existing escapes cover the need. | If faculty restructures become common post-launch. |
| **Audit log** | Single-operator MVP. "Recently changed" on Overview is the lightweight substitute. | With the second-operator / roles window. |
| **Roles / permissions** | Role Trap. One operator. | Same window as audit log. |
| **Bulk import** | Single-record add is the actual job today. | Post-MVP, when there is a real backlog. |
| **Faculty delete** | §10.1, enforced by not offering the operation. | Only in a window that also plans reassignment. |
| **Faculty merge** | A data operation touching every resource's faculty field — not a UI feature. | Never as UI; possibly a one-off maintenance task. |
| **Contributor self-service / upload flow** | §7 post-MVP. | Own window. |
| **Settings page** | Nothing to configure in MVP. | When there is a real setting. |
| **Reading-progress / time-on-resource admin views** | Reading experience itself is deferred (§11). | With the reading-experience window. |
| **Groups draft state** | Groups are too small; draft adds status tracking for no benefit. | If group records grow significantly. |

**In the plan, not excluded:** draft state for resources and news (your overrule), "Recently changed" on Overview (your adoption), faculty rename (your call).

---

## 8. Post-MVP checklist

The "returns" column of §7, collected. This is the checklist for future windows.

- [ ] **Traffic monitoring** — needs event log (§6.5); lands on Overview.
- [ ] **Contributor management** — with contributor-flow window.
- [ ] **User management (customer-service lookup)** — read-only at most.
- [ ] **Saved-library count in traffic view** — aggregate only.
- [ ] **Reassignment flow** — only if restructures become common.
- [ ] **Audit log** — with second operator.
- [ ] **Roles / permissions** — with second operator.
- [ ] **Bulk import** — when migration backlog exists.
- [ ] **Faculty delete** — paired with reassignment flow.
- [ ] **Faculty merge** — as maintenance task, never UI.
- [ ] **Contributor self-service / upload flow** — own window.
- [ ] **Settings page** — when a real setting exists.
- [ ] **Reading-progress admin views** — with reading-experience window.
- [ ] **Groups draft state** — if groups grow.

---

## 9. Assumptions and open questions

Assumptions the plan rests on, and open questions deferred to the design brief phase.

### 9.1 Assumptions

- **Single operator.** One authorised admin in MVP. No roles, no permissions.
- **The design brief decides the shell.** The plan proposes a sidebar; the brief may specify something different (top bar, tabs) if the reasoning holds. The *shape* — four surfaces, faculty-first — is fixed here; the *chrome* is the brief's call.
- **The design brief decides the resource form's preview interaction.** Toggle, side-panel, or modal — the plan says "preview uses the real resource-detail sheet," the brief says how it is invoked.
- **The design brief decides list row density and inline-edit vs panel-edit.** The plan says what is editable; the brief says how.
- **Reuses `form.css`, `combobox.js`, `state-view.js`, `toast.js`, and `core.css` tokens.** The admin shell is a new shell, but the primitives are shared. New components are minimized.

### 9.2 Open questions

- **Q1.** Should the resource form live in a right-hand panel, a modal, or a full page? (Plan says "panel inside faculty detail"; the brief should test this.)
- **Q2.** Should "Recently changed" be capped at N items, and what N? (Plan suggests N = 20; the brief decides.)
- **Q3.** Does the faculty rename warning belong in the form (inline banner) or a confirmation modal? (Plan suggests inline banner; the brief decides.)
- **Q4.** Should draft items appear on Overview's "Recently changed"? (Plan suggests yes, marked `Draft`; the brief decides.)
- **Q5.** Is the file-upload control for resources in MVP, or is the file reference still a mock string? (Plan assumes mock string for now, matching `MOCK_RESOURCES`; real upload is a backend dependency.)

---

## 10. Next planning step

Write the design briefs. One per surface — **four briefs**:

1. `ADMIN_OVERVIEW_DESIGN_BRIEF.md`
2. `ADMIN_FACULTY_DESIGN_BRIEF.md`
3. `ADMIN_NEWS_DESIGN_BRIEF.md`
4. `ADMIN_GROUPS_DESIGN_BRIEF.md`

Each brief follows the structure of the existing briefs in §13 of the baseline (the nine that already exist). The briefs are written **from this plan**, not alongside it. Each brief should answer, at minimum:

- What the surface's job is, in one sentence.
- What the operator sees on arrival.
- What the operator can do.
- What the operator cannot do (the exclusions local to this surface).
- Which shared components (`form.css`, `combobox.js`, `state-view.js`, `toast.js`) it uses.
- Which of the five open questions (§9.2) are decided by this surface, and which are decided elsewhere.

The briefs are the last planning artifacts before implementation. The admin shell (header, sidebar) is described once, in the Faculty brief or a shared `ADMIN_SHELL_DESIGN_BRIEF.md` — the design brief phase decides which.

---

## End of plan