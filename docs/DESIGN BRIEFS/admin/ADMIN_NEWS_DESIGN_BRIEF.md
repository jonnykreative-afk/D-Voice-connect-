# D'voice Admin — News Design Brief

**Status:** Brief 3 of 5. Inherits ADMIN_SHELL_DESIGN_BRIEF.md (S1–S5, row, sheet, modal, banner, toast) and the container rules in Amendment A.
**Predecessor:** DVOICE-ADMIN_DASHBOARD_PLAN.md §3.3, §5 (B1–B3), §5.1.
**Successor:** ADMIN_GROUPS_DESIGN_BRIEF.md.
**Audience:** UI/UX designer. Decisions are final unless the "Why" reveals a flaw.

---

## 1. Job of this surface

Let the operator **publish, edit, and soft-delete news items** — nothing else. No floor rule, no faculty scoping, no contributor management. B1, B2, B3 from the plan.

---

## 2. List (`/admin/news`)

- One row per news item (shell row primitive): **headline** primary; **date · source · has-image indicator** secondary; trailing badge `Published` / `Draft` / `Deleted`.
- **`Add news item`** action, top-right (desktop) / above list (mobile).
- Overflow per row: `Edit`, `Publish` (if Draft), `Soft-delete` (if not Deleted), `Restore` (if Deleted), `Show deleted`.
- **Soft-deleted hidden by default** (shell §3.5). `Show deleted` reveals them; only deleted rows carry Restore.
- **Sort:** `updated_at` desc. No sort control — one order, matching Overview's recently-changed order. The operator's mental model is "what changed last is on top."
- **Empty state:** `state-view` message, "No news yet. Publish the first item." with `Add news item` as the only button.

> **Why one sort:** This list is short by nature (news is slow-moving) and the operator's most common arrival is "what's the latest?" — newest-first is that answer. A sort control is a control the operator would use once, ever.

> **Why no faculty scoping:** News is app-wide (plan §3.3). Faculty scoping would make news behave like resources, which it isn't.

---

## 3. Add/edit sheet (B1, B2)

Bottom sheet (shell §3.1), same form in add and edit modes. Fields per plan §10.10:

- **headline** (required)
- **body** (required — text; rich text is post-MVP)
- **source** — free text, default `"Office of the Founder"`. Placeholder shows the default so the operator knows what ships if untouched.
- **image** — optional. **Image indicator** in the list is present/absent, not a thumbnail in the list. Inside the sheet, the field shows the current image or a `Choose image` control. **In MVP, the image control is a mock reference**, same as resources' file field — no upload, no backend (Brief 2 §10 F1 assumption carries).
- **date** — defaults to now; editable (news can be backdated or scheduled? **No scheduling in MVP** — the plan doesn't list it and it's a post-MVP concern. Date is "publish date," defaults to now.)

**Actions (footer):**
- **`Publish`** → publishes if draft/new, saves edits if already published. Primary.
- **`Save as draft`** → secondary.
- **`Preview as student`** → toggle. **Off by default.** When on, the **real student news-card / news-detail component** renders in admin context (whichever the student app uses for a single news item — reuse, do not rebuild; shell §3.2 extends to news).

> **Why Publish, not Save, is primary:** News has no floor rule and no draft default; the job is publication. `Save as draft` is the exception. This mirrors A1's publish-default but without the count-toast (news doesn't affect the floor).

**Toast on publish:** `"{Headline} published."` **On draft-save:** `"{Headline} saved as draft."` **On edit-save:** `"{Headline} updated."`

> **Why different toasts per action:** The operator needs to know whether their action reached students. "Updated" on a draft is not "Updated" on a published item — the toast is the confirmation, and confirmation that lies is worse than none.

---

## 4. B3 — Soft-delete news

- **Entry:** row overflow → `Soft-delete`.
- **Container:** **modal** (Amendment A — decision point, not content edit).
- **Copy:** *"Remove {Headline} from the app? It can be restored later."*
- **Actions:** `Remove` (primary, destructive tone), `Cancel`.
- **On confirm:** soft-delete; toast `"{Headline} removed."` Row disappears (unless `Show deleted` is on).
- **Restore** (from row overflow when revealed): immediate, no modal. Toast `"{Headline} restored."` Restore is never gated — it can only bring content back into view, never break a rule.

> **Why confirm on delete but not on restore:** Delete removes content from students; restore returns it. The asymmetry is the consequence. A confirm on restore would be friction on a safe action.

---

## 5. What the operator can do

- Add a news item (publish or draft, with preview).
- Edit a news item (direct save; no faculty/level-style block rules — none apply).
- Publish a draft.
- Soft-delete (confirmed, modal).
- Restore (immediate).
- Reveal deleted items via overflow.

## 6. What the operator cannot do

- Schedule a news item (no scheduling in MVP).
- Rich-text edit (plain body in MVP).
- Upload a real image (mock reference — Brief 2 §10 assumption carries).
- Delete a news item hard (soft-delete only).
- Scope news to a faculty (app-wide, plan §3.3).
- Access user management, contributor management, analytics from this surface.

> **Why list the post-MVP exclusions explicitly:** "Not in MVP" written on the surface brief is how the designer knows not to design the scheduling control that the plan mentions nowhere but everyone assumes exists.

---

## 7. Components used

Shell primitives (row, badge, sheet, modal, toast), `form.css`, `state-view.js`. **Preview reuses the student news component — not rebuilt.**

## 8. Decisions made by this brief

- Sort: `updated_at` desc, no sort control (§2).
- Image indicator is presence/absence in the list; no thumbnail (§3).
- Date defaults to now; **no scheduling** (§3, §6).
- Publish primary; Save as draft secondary; per-action toasts (§3).
- Soft-delete confirm = **modal**; Restore = immediate (§4).
- Preview toggle off by default; reuses student news component (§3).

## 9. Assumptions

- The student app has a single-news-item component (card or detail) that can be rendered in admin context; if only a card exists, the preview renders the card — reusing the real thing, not a mock.
- Image and date fields persist as frontend-only mock values in MVP, matching Brief 2 §10.
- `updated_at` exists on news records (for sorting and Overview).

## 10. Left to other briefs

- Nothing. News has no cross-surface rules beyond shell inheritance.
- The shared `ADMIN_UX_BEHAVIORS.md` (after Brief 4) will note News's per-action toast vocabulary as a cross-brief convention (Publish / Draft / Update / Remove / Restore), in case Groups or later surfaces reuse it.

---

## End of Brief 3