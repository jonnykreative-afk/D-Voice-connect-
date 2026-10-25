# D'voice Admin — Shell Design Brief

**Status:** Brief 0 of 5. Inherited by ADMIN_OVERVIEW, ADMIN_FACULTY, ADMIN_NEWS, ADMIN_GROUPS.
**Predecessor:** DVOICE-ADMIN_DASHBOARD_PLAN.md (§3, §4, §9.1).
**Successor:** the four surface briefs.
**Audience:** UI/UX designer. Decisions are final unless the "Why" note reveals a flaw in the reasoning.

---

## 1. Job of this surface

Provide the persistent frame — header, sidebar, routing chrome — and the **house patterns** the four admin surfaces inherit, so the operator learns one interaction model, not four.

This is not a page. It is the container every page lives in, plus the shared decisions the surface briefs must not re-litigate.

---

## 2. What the operator sees on arrival

A single admin SPA. Persistent left sidebar (desktop) collapsing to a top bar with a menu trigger (mobile). The sidebar has exactly four entries:

```text
D'voice Admin
▸ Overview
▸ Faculty
▸ News
▸ Groups
```

No fifth entry. The word "Dashboard" appears nowhere. The shell is titled `D'voice Admin`.

The content area is `max-width`-constrained to the student app's shell. The admin is visually a separate product from the student app — own header, own sidebar, no student bottom-nav. It shares tokens and primitives (`core.css`, `form.css`, `combobox.js`, `state-view.js`, `toast.js`), not layout.

> **Why:** Four surfaces that each invent their own form container, warning style, and badge vocabulary are four surfaces the operator re-learns daily. The shell brief exists so five decisions are made once and inherited everywhere.

---

## 3. House patterns (inherited by every surface brief)

### 3.1 Form container — bottom sheet, always

Every add/edit form is a **bottom sheet**, mobile-first, using the same primitive as the student resource-detail sheet (§10.9) in a *form* variant rather than a *viewer* variant.

- Mobile: sheet rises from bottom, drag handle, dismissible by drag-down or Cancel.
- Desktop: same sheet, bottom-anchored, constrained to content `max-width`. **It does not become a side panel or center modal at larger widths.**
- **No inline row editing anywhere in the admin.** Edit is always: open sheet → edit → save.

> **Why:** Inline editing on mobile forces row density that fights scannability. The bottom sheet also preserves the student-app mental model ("content lives in a sheet that rises"). The operator learns the sheet once.

### 3.2 Preview-on-save and "Add another" flow

The add-resource sheet carries an **"Add another" toggle** (default off).

- Toggle off → Save publishes/drafts, sheet closes, toast fires.
- Toggle on → Save publishes/drafts, **form fields clear**, the **real resource-detail sheet** renders in preview (student component, admin context), toast fires. The operator is positioned to fill the empty form behind the preview; the preview is dismissible.

Edits show preview only on explicit request ("Preview as student" toggle, per plan §3.2). **Do not build a preview component.** Reuse the student resource-detail sheet. §10.9 is non-negotiable.

> **Why:** A preview that isn't the real component is a lie the operator discovers in production. The add-another flow is the operator's actual job (bulk-ish entry); closing the sheet after every save makes them re-open it every time.

### 3.3 Consequence patterns — sheet, modal, or banner (by decision type)

Three containers, three jobs. Do not use one where another belongs.

- **Banner (inline, in-form):** *save-time consequences while editing.* A2's faculty/level change warning, and any future field-change warning inside a sheet. The operator reads it while looking at the field that caused it. Blocking rules disable Save; the banner explains why.
- **Modal (centered, dismissible by Cancel only):** *decision points on a record, initiated from a list action.* Rename confirmation, A3 soft-delete confirmation, any "you cannot proceed" gate. The consequence copy is read before the confirm button; it is not a persistent banner polluting the page.
- **Sheet (bottom, drag-dismissible):** *content editing and previews.* Every add/edit form, the resource preview, the create/rename faculty form (in its two modes).

> **Why three and not one:** The container carries the interaction's weight. A banner is ambient — right for "here is what will happen as you type," wrong for "confirm this destructive/identity action." A modal is a stop — right for a decision, wrong for scrolling through ten form fields. A sheet is a workspace — right for content, wrong for a one-field confirmation. Collapsing them into one container means the wrong weight is carried by the wrong interaction.

### 3.4 Status badge vocabulary

One vocabulary, used identically on all four surfaces. Reuse `core.css` tokens; if a token is missing, add **one**, not five.

| Badge | Meaning | Used on |
|---|---|---|
| `Published` | Live, visible to students | Resources, News |
| `Draft` | Not visible to students | Resources, News |
| `Deleted` | Soft-deleted, restorable, hidden from students | Resources, News, Groups |
| `Public` | Faculty has ≥3 published resources | Faculty |
| `Unlisted (n/3)` | Faculty below threshold | Faculty |

Tone: Published/Public positive; Draft/Unlisted neutral; Deleted **muted-destructive, not error-red** — soft-delete is reversible.

> **Why:** The operator never needs status and publication-state simultaneously, so one table, one thing to learn. Deleted is muted not red because it isn't an error state — red implies "something broke."

### 3.5 Soft-deleted visibility — hidden by default, deliberate reveal

Soft-deleted records are **never shown by default** in any list. They are revealed via a **"Show deleted" item behind each list's overflow menu** — not a filter chip, not a checkbox beside search. When revealed, deleted rows carry the `Deleted` badge and are the only rows offering **Restore**.

> **Why:** Deleted things shouldn't be showing, and the reveal should be harder to hit than a toggle. An overflow-menu item is invisible until sought and isn't positioned as a normal view mode. Per-list menu wording and placement are the surface brief's call; the pattern is fixed here.

### 3.6 Toast house style

Use the existing `toast.js`. Do not restyle. Do not build a second toast. Per-action messages are specified per surface. Placement and animation are `toast.js`'s current behavior.

**Pre-implementation flag:** the toast is untested. Smoke-test it before the Faculty brief is implemented. This is a build check, not a design change.

### 3.7 List row primitive

All lists share one row primitive:

- Primary label (name / title / headline)
- Secondary line (surface-specific metadata)
- Trailing status badge
- Trailing **overflow menu** (row actions: Edit, Soft-delete, Restore, Publish — surface-specific; "Show deleted" also lives here per 3.5)
- **Not inline-editable.** Clicking the primary label opens the relevant sheet (edit) or navigates (Faculty list → Faculty detail).

Row *density* is each list surface's call; the primitive is fixed.

> **Why:** One row, many surfaces. Overflow is also where "Show deleted" lives (3.5), so all secondary actions have one consistent home.

---

## 4. What the operator can do in the shell

- Navigate among the four surfaces via the sidebar.
- Open, dismiss, and resize the bottom sheet.
- Toggle "Add another"; dismiss previews; read toasts.
- Reveal deleted records via list overflow menus.

## 5. What the operator cannot do in the shell

- No fifth sidebar entry. No Settings. No Users. No Analytics. **Absence is the enforcement.**
- No traffic numbers anywhere in the shell (deferred, plan §8).
- No student-app chrome (bottom-nav, etc.).

---

## 6. Shared components used

`core.css` (tokens, layout, max-width), `form.css` (sheet form styling), `combobox.js` (faculty/level selectors), `state-view.js` (empty/loading/error), `toast.js` (notifications).

**No new components.** If a bottom-sheet-form variant doesn't exist, it is the existing sheet primitive with `form.css` applied — not a new sheet.

---

## 7. F2 — Rename faculty

- **Entry:** Faculty list row overflow → `Rename`. One entry point. Level 2 header has no rename affordance.
- **Container:** modal (Amendment A). Not a sheet.
- **Form:** the create-faculty form in rename mode — title "Rename faculty," name prefilled, primary action labeled "Rename."
- **Copy in the modal, above the action:** *"Renaming changes the public label on every resource in this faculty."*
- **Actions:** `Rename` (primary), `Cancel` (secondary). Cancel dismisses; no state change.
- **On confirm:** toast `"{Old name} renamed to {New name}"`. Modal closes. List updates.
- **Always allowed** (F2 — no block rule). The friction is the modal, not a gate.

> **Why a modal and not the sheet:** Rename is a decision about identity, not a content-editing pass. It has one field and one consequence, and the consequence must be read before the confirm. A sheet invites scrolling and editing; a modal asks "do you want this?" and waits. The create form is reused so the designer maintains one form, two modes — not because sheets belong here.

> **Why the Level 2 header stays read-only:** Inline editability signals low consequence and invites the action. Rename is high-consequence (it changes every resource's public label). An operator who lands on a faculty detail page to add a resource should never be one click away from renaming the faculty by accident. The list overflow is one deliberate click away, and the modal is a second deliberate click — that's the right amount of friction.

## 8. Left to surface briefs

- Per-list row density.
- Per-list overflow-menu wording and placement of "Show deleted."
- Which Faculty surface level (list vs. detail) hosts its reveal.
- Overview: cap N and draft inclusion in "Recently changed" (decided by product designer in Overview brief).
- Faculty: rename-warning instance copy; mock-file assumption.

## 9. Assumptions

- The existing sheet primitive + `form.css` carry the form variant without a new component. If not, that's a build-time discovery to flag before building, not a design re-litigation.
- `toast.js` is untested but functional (§3.6 flag).
- Single operator, no roles, no permissions. No admin-user menu decisions beyond wherever the existing header puts them — **reuse, don't redesign.**

---

## End of Brief 0
