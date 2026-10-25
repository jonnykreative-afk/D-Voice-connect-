# D'voice Admin — Groups Design Brief

**Status:** Brief 4 of 5. Inherits ADMIN_SHELL_DESIGN_BRIEF.md and Amendment A (containers).
**Predecessor:** DVOICE-ADMIN_DASHBOARD_PLAN.md §3.4, §5 (B4, B5), §5.3.
**Successor:** ADMIN_UX_BEHAVIORS.md (cross-brief behaviors file).
**Audience:** UI/UX designer. Decisions are final unless the "Why" reveals a flaw.

---

## 1. Job of this surface

Let the operator **add, edit, and soft-delete indigenous groups** — nothing else. B4, B5. One rule governs it: **at least one of `whatsapp` / `external` must be non-empty** (operator rule, plan §6.4).

---

## 2. List (`/admin/groups`)

- One row per group (shell row primitive): **name** primary; **which links are present** secondary (e.g. `WhatsApp`, `External`, `WhatsApp · External`); trailing badge `Deleted` only when deleted (groups have **no draft state** — plan §5.3 — so no Published/Draft badges; a live group carries no badge).
- **`Add group`** action, top-right / above list.
- Overflow per row: `Edit`, `Soft-delete`, `Restore` (if Deleted), `Show deleted`.
- **Soft-deleted hidden by default** (shell §3.5).
- **Sort:** alphabetical by name. No sort control.

> **Why alphabetical and not updated_at:** Groups are a directory, not a stream. The operator's job is "find the group and fix it" or "does this group exist?" — alphabet is how you find a name. News sorts by recency because news is chronological; groups aren't.

> **Why no badge for live groups:** The absence of a badge *is* "live." Published/Draft don't exist here (no draft state, plan §5.3), so the only status worth marking is `Deleted`. A `Published` badge on every row is visual noise that carries no information.

---

## 3. Add/edit sheet (B4, B5)

Bottom sheet (shell §3.1), same form in add and edit modes. Fields per plan §3.4:

- **name** (required)
- **description** (optional)
- **whatsapp** (optional)
- **external** (optional)

**Validation rule — the one rule this surface has:** at least one of `whatsapp` / `external` must be non-empty. Enforced on save:
- If both are empty: Save is **disabled**, with an inline banner (shell §3.3 — save-time consequence while editing, correct container) reading *"Add at least one link — WhatsApp or external."*
- When either is filled, the banner clears and Save enables.

> **Why a banner and not a modal:** This is a field-level rule inside a form the operator is editing — exactly the banner's job (Amendment A). The operator sees the empty link fields and the banner together. A modal here would interrupt a form the operator is mid-way through filling.

**Actions (footer):**
- **`Save`** — primary. Direct save; groups have no draft state (plan §5.3), so "Save" means "live."
- **`Cancel`** — secondary.

**No `Save as draft`, no `Publish`.** Groups are small; a status to track is a status to forget (plan §5.3).

> **Why no draft despite the plan letting resources/news have one:** §5.3 of the plan is explicit and the reasoning holds: name + description + up to two links is not content that benefits from a holding state. Draft adds a column, a badge, and a filter to a record with four fields.

**Toast on save:** add mode `"{Name} added."`; edit mode `"{Name} updated."`

> **Why different add vs edit toasts:** The operator needs to know whether they created or changed. "Saved" collapses a distinction that matters when adding a group that may already exist under a near-identical name.

---

## 4. Soft-delete group

- **Entry:** row overflow → `Soft-delete`.
- **Container:** **modal** (Amendment A — decision point).
- **Copy:** *"Remove {Name} from the app? It can be restored later."*
- **Actions:** `Remove` (primary, destructive tone), `Cancel`.
- **On confirm:** soft-delete; toast `"{Name} removed."` Row disappears (unless `Show deleted` is on).
- **Restore** (revealed rows only): immediate, no modal. Toast `"{Name} restored."`

> **Why the same delete/restore pattern as News:** The same action with the same consequence gets the same container and copy shape. Consistency is how the operator learns once instead of three times.

---

## 5. What the operator can do

- Add a group (name, optional description, ≥1 link).
- Edit a group (direct save).
- Soft-delete (confirmed, modal).
- Restore (immediate).
- Reveal deleted groups via overflow.

## 6. What the operator cannot do

- Create a group with zero links (validation blocks it — §3).
- Draft a group (no draft state, plan §5.3).
- Hard-delete a group.
- Move a group between categories, merge groups, or reorder them (not in plan).
- Access analytics, user management, contributor management.

---

## 7. Components used

Shell primitives (row, badge, sheet, modal, banner, toast), `form.css`, `state-view.js`. **No preview** — groups have no student-facing detail component the admin needs to preview; the group row is what the student sees (name + links). If that's wrong at implementation time, the fix is reuse, not a new component. Flagged as assumption (§9).

## 8. Decisions made by this brief

- Sort: alphabetical by name, no sort control (§2).
- No badge on live groups; `Deleted` badge only (§2).
- Validation as an inline banner; Save disabled when both links empty (§3).
- No draft state — "Save" means live (§3).
- Delete = modal confirm; Restore = immediate (§4).
- Add vs edit toasts differ (§3).
- No preview surface (§7).

## 9. Assumptions

- Groups have no student-facing detail view that differs from the group row — so no admin preview is needed. If one exists, preview reuses it rather than adding a new component.
- `whatsapp` and `external` are free-text URL strings in MVP (no URL validation beyond non-empty — a malformed URL is a content problem, not an admin-UI problem).
- Group records persist as frontend-only in MVP, matching Briefs 2–3.

## 10. Left to the cross-brief file

- `ADMIN_UX_BEHAVIORS.md` will collect: the add-resource intent routing (Brief 2 §2/§11), the add-another deferred-preview rule (Brief 2 §10), the per-action toast vocabulary (Publish/Draft/Update/Remove/Restore/Add), and the container rules from Amendment A. Nothing here is new.

---

## End of Brief 4