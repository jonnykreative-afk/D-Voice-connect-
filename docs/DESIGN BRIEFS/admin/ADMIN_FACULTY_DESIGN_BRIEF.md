# D'voice Admin — Faculty Design Brief

**Status:** Brief 2 of 5. Inherits ADMIN_SHELL_DESIGN_BRIEF.md (S1–S5, row primitive, sheet, toasts) and ADMIN_OVERVIEW_DESIGN_BRIEF.md (routing context).
**Predecessor:** DVOICE-ADMIN_DASHBOARD_PLAN.md §3.2, §5 (A1–A4, F1–F2, rename warning), §5.1–§5.6.
**Successor:** ADMIN_NEWS_DESIGN_BRIEF.md, ADMIN_GROUPS_DESIGN_BRIEF.md (smaller; inherit everything here).
**Audience:** UI/UX designer. Decisions are final unless the "Why" note reveals a flaw.

---

## 1. Job of this surface

Let the operator **create faculties and manage their resources** — add, edit, publish, soft-delete, restore, rename — while enforcing the 3-published-resource floor (plan §5) and never offering faculty delete (§5.6).

Faculty is the **primary workspace**. Four of the plan's operator jobs (A1, A2, A3, A4) and both faculty jobs (F1, F2) live here, in **two levels inside one sidebar entry**.

---

## 2. Level 1 — Faculty list

Reached at `/admin/faculty`.

**Contents:**
- One row per faculty (shell row primitive, shell §3.7): name as primary label, trailing badge `Public` or `Unlisted (n/3)`.
- **`Create faculty`** action, top-right (desktop) / above the list (mobile). Opens the create-faculty sheet.
- Clicking a faculty row → Level 2 (`/admin/faculty/:id`).
- Overflow menu per row: **`Show deleted`** only. **No rename here, no delete here** — rename lives in Level 2's header (F2), and delete does not exist anywhere (§5.6).

**Sorting:** same rule as Overview — unlisted first ascending by n, then public alphabetical. **One sort rule for faculties, reused.** The operator should never see faculties in two different orders on two surfaces.

**Empty state (zero faculties):** `state-view` empty message, "No faculties yet. Create one to start adding resources." with the create action as the only prominent button.

**Routing from Overview's `Add resource` (cross-brief behavior, §11):** if the list arrives with the add-resource intent, the surface shows a one-line prompt above the list — *"Pick a faculty to add a resource to."* Selecting a faculty in this intent mode **opens the add-resource sheet directly** instead of navigating to Level 2. If zero faculties, the empty state's create button is the only path, and creating a faculty in this intent mode opens the add-resource sheet immediately after creation.

> **Why no rename/delete in the list overflow:** Rename is a faculty-level identity action; identity actions live next to the identity, which is the Level 2 header. Delete does not exist (§5.6 — absence is the enforcement). The overflow is only for view-level state ("show deleted"), per shell §3.5.

---

## 3. Level 2 — Faculty detail

Reached at `/admin/faculty/:id`.

**Header (not a sheet — part of the page):**
- Faculty name, **inline-editable** (click the name → it becomes a text input in place, with Save/Cancel).
- Trailing badge: `Public` or `Unlisted (n/3)`, n = published only (plan §5.4).
- Below the name, when editing: **inline warning banner** (shell §3.3) — *"This changes the public label on every resource in this faculty."* Save is **not** blocked (rename is always allowed, F2). Banner disappears on save or cancel.

> **Why inline-editable name and not a sheet:** The name is a single field and the warning is about the field itself. A sheet for one field, whose only consequence is a banner, is ceremony. The shell's "no inline row editing" rule (§3.1) is about *content records* — it does not forbid inline-editing a page-level title. I am treating the name as chrome, not a record.
> **Why rename warning is a banner, not a block:** F2 says rename is always allowed. The banner informs; it does not gate. Contrast A2 (below), where the change *can* be blocked and Save is disabled with the banner explaining.

- **Resource list, scoped to this faculty.** Row primitive (shell §3.7): title primary, course code + level + type secondary, trailing badge `Published` / `Draft` / `Deleted`.
  - Overflow per row: **Edit**, **Publish** (if Draft), **Soft-delete** (if not Deleted), **Restore** (if Deleted).
  - Clicking the row title → opens the **edit sheet** for that resource (same sheet as add, prefilled). Not inline edit.
  - **Soft-deleted rows hidden by default**; revealed by `Show deleted` in the header's overflow (shell §3.5). Deleted rows carry the `Deleted` badge; only they offer Restore.
- **`Add resource`** button, prominent, above the resource list. Opens the add-resource sheet with faculty auto-filled.

**No `Delete faculty` button. No `Move faculty` button. No faculty merge.** Absence, not disabled controls (plan §5.6, §7).

> **Why edit opens the same sheet as add:** One form, two entry points (empty vs. prefilled). Two forms is two maintenance surfaces and two chances to drift from the student-facing fields.

---

## 4. The resource sheet (add and edit)

This is the core of the surface. One sheet, two modes. Fields per plan §5: title, course code, course title, content type, format, contributor, description (optional), level, faculty, file reference.

**Layout:** bottom sheet (shell §3.1), scrollable, grouped top-to-bottom: identity (title, course code, course title) → classification (type, format, level, faculty) → attribution (contributor, description) → file (mock string — see §10 F1).

**Faculty field:** pre-filled in Level 2 add mode. In edit mode, prefilled with current faculty and **changeable** — changing it (or changing level) triggers the **A2 warning banner** (shell §3.3): *"This changes who sees this under 'Recently added'."* Save is **not** blocked by the banner alone — but see §5.

**Actions (sheet footer):**
- **Save** → publishes if the resource is a draft or new; or saves edits. Default action.
- **Save as draft** → for new resources and for edits (secondary action, less prominent).
- **Preview as student** → toggle (shell §3.2). Off by default. When on, the **real resource-detail sheet** renders over the form in admin context. Dismissing returns to the form with fields intact.
- **Cancel** → dismiss, discard unsaved changes (no confirm — this is a form, and the operator can see what they typed; a confirm here is the ceremony the shell warned against).

> **Why Save defaults to publish and draft is secondary:** The operator's job is adding public content. Draft is the exception (§5.1 of the plan — drafts don't count toward the floor, so drafts are a holding state, not the norm). Making publish the default and draft the deliberate secondary matches that.

---

## 5. Safety rules (A1–A3, plan §5)

These are the plan's rules, restated as UI behavior the designer must implement. **Do not soften them.**

### A1 — Add resource
- Direct publish by default; draft allowed.
- On save (publish): toast **`"Published to {Faculty} · {Level}"`**.
- If this save makes the faculty's **published** count go 2→3: second toast **`"{Faculty} is now public"`**.
- Preview available before save (toggle).
- **Drafts do not count toward the floor** (§5.1). The (n/3) badge and the auto-publication toast count published only.

### A2 — Edit resource
- Direct save; no confirmation.
- Changing **faculty or level** shows the A2 banner (§4). The banner itself does not block.
- **Block rule:** if the change would drop the **origin** faculty below 3 published resources, **Save is disabled** and the banner explains why — e.g. *"Saving this would leave {Origin faculty} with {n} published resources. Add another resource to {Origin faculty} or change another resource's faculty before moving this one."* The banner names the two escapes (plan §5.2).
- Blocking is evaluated at save-button state, i.e. recomputed as the operator edits, not only on click.

> **Why banner + disabled Save rather than a modal:** Shell §3.3. Even here — the one genuinely blocking case — the operator needs to see the field that caused it and the escape routes while reading, not behind a modal.

### A3 — Soft-delete resource
- **Soft delete**: set unavailable flag; hidden from students; restorable. Not a hard delete.
- **Blocked** if the faculty would drop below 3 **published** resources after the operation. Same banner pattern, same Save-disabled treatment on the (here, a confirm step) — except A3 is initiated from a row action, not a form. **Decision:** A3 uses a small **confirm sheet** (shell bottom sheet) with the rule, not a modal: *"This removes {Title} from {Faculty}. {Faculty} has {n} published resources; deleting this one would leave {n-1}."* Delete enabled only if n-1 ≥ 3; otherwise disabled with the two escapes named, same as A2.
- Restoring a deleted resource can only raise the count, never lower it — **Restore is never blocked.**

> **Why a confirm sheet and not a toast-undone:** A toast-undo pattern assumes the action lands immediately and is reversible in a few seconds. Here the block is a *rule*, not a mistake — the operator may *want* to delete and need to be told they can't until the faculty has a replacement. A confirm sheet carries that reasoning; a toast cannot.

### A4 — Faculty health view
- Read-only; already lives on Overview (Brief 1 §3) and is mirrored in each faculty's badge here. **No separate A4 page** (plan §3.2).
- The `(n/3)` count is **published only** everywhere it appears. One counter, one meaning, three places (badge on list, badge on detail, badge on Overview).

> **Why published-only in all three:** A counter that means different things in different places is worse than no counter. If a future need exists for "including drafts," it's a post-MVP add — not a second meaning of the same badge.

---

## 6. F1 — Create faculty

- **Create faculty sheet:** a **name field only.** Nothing else.
- On save: faculty created with state `Unlisted`; toast **`"{Name} created"`**.
- Becomes `Public` automatically when it reaches 3 published resources (toast per A1).
- Created from Level 1's `Create faculty` action, from Level 1's empty state, and (in intent mode) automatically before the add-resource sheet opens.
- **No validation beyond non-empty name.** Uniqueness? **Not enforced in MVP** — one operator, and a duplicate faculty is a rename-away problem, not a data-integrity problem. Flagged as assumption (§11).

> **Why name-only and no uniqueness:** Faculty creation's job is to unblock resource entry (plan F1: "I need to create a faculty before I can add resources"). Any field beyond the name is a field the operator has to think about before doing the actual job. Duplicate prevention belongs with the second-operator / audit window if it ever does.

## 7. F2 — Rename faculty

- Inline-editable name in Level 2 header (§3).
- Warning banner as above; **always allowed**; no confirmation modal; banner clears on save.
- Toast on save: **`"{Old name} renamed to {New name}"`**.

---

## 8. What the operator can do

- Create a faculty (name only).
- Rename a faculty (inline, warned, always allowed).
- Add a resource (publish or draft, with preview).
- Edit a resource (including faculty/level, warned, possibly blocked).
- Publish a draft resource.
- Soft-delete a resource (blocked at the floor).
- Restore a deleted resource (never blocked).
- Reveal deleted resources via the header overflow.

## 9. What the operator cannot do

- **Delete a faculty** — no button, no flow (§5.6).
- **Move a faculty** or merge faculties (plan §7).
- Inline-edit a resource in the list (shell §3.1).
- See soft-deleted resources by default (shell §3.5).
- Exceed or bypass the 3-published floor (A2, A3).
- Add or edit a resource without a faculty context (faculty-scoped, §2 routing note).
- See or edit resource drafts as if they counted toward the floor (§5, A1).

> **Why no faculty delete even as a disabled control:** Plan §5.6 says the absence is the enforcement. A disabled button teaches "this exists but is locked," inviting a search for the unlock. No button teaches "this doesn't exist."

---

## 10. Components used

Shell primitives (row, badges, sheet, banner, toast), `form.css`, `combobox.js` (level and faculty selectors), `state-view.js` (empty/loading), `toast.js`. The resource sheet's **preview is the student resource-detail sheet — reused, not rebuilt** (shell §3.2, plan §10.9).

**F1 note (file reference):** The file field is a **mock string** in MVP — no upload control, no backend. It is prefilled/editable as text only, matching `MOCK_RESOURCES`. Recorded as an assumption here, not a design choice. (Plan Q5; your instruction: frontend-only, non-persistent acceptable.)

**Add-another flow (adopted from discussion, refined):** the add-resource sheet carries an **`Add another` toggle** (shell §3.2), default **off**.
- **Toggle off (default):** on publish-save, the form closes, the **real resource-detail sheet** renders as preview, toast fires. A `Add another` action inside the preview reopens a cleared form.
- **Toggle on:** on publish-save, the form **does not preview** — it clears in place, a toast fires, the toggle stays on, and the operator continues in the cleared form. The preview is **deferred**: when the operator turns the toggle **off**, the resource-detail sheet for the **last saved resource** renders. If they close the sheet or navigate away with the toggle on, no preview is shown — the toasts are the record.

> **Why the deferred-preview rule:** Previewing every item defeats the toggle's purpose (speed). Not previewing at all defeats the reason the toggle exists (a preview mode). The toggle-off moment is the natural checkpoint: it's the operator saying "I'm done adding for now," and showing the last item is the cheapest useful preview. Your "list of just-listed resources" alternative is a new component that previews worse than the real sheet — rejected.

---

## 11. Assumptions and inherited behaviors

- **Cross-brief behavior (to be written into `ADMIN_UX_BEHAVIORS.md` after Brief 4):** Overview's `Add resource` routes to Level 1 in an *add-resource intent mode* — prompt line above the list, zero-faculty empty state with create, and selecting a faculty (or creating one) opens the add-resource sheet directly rather than the faculty detail view. This brief implements the behavior at Level 1; the cross-brief file will document it as shared.
- Faculty names are **not enforced unique** in MVP (single operator; §6).
- `updated_at` exists on resources (for Overview); faculty records need at least `name` and `status` (derived from published count).
- Rename is always allowed; the banner is informational; no confirmation modal.
- Soft-delete is a flag (plan: "tag as unavailable"), reversible; no hard-delete path in MVP.
- Preview reuses the student resource-detail sheet verbatim; no admin-only variant.

## 12. Left to other briefs

- Nothing structural. News and Groups briefs inherit shell + this brief's sheet/banner/safety-rule patterns; they have **no** 3-resource floor and **no** draft state for groups (plan §5.3) — so they do **not** inherit A1–A3's block rules, only the sheet, banner, badge, and toast patterns.

---

## End of Brief 2