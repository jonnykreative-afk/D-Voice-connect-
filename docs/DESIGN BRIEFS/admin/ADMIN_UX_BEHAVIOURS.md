# D'voice Admin — Cross-Brief UX Behaviors

**Status:** Final artifact of the admin planning phase. Collects behaviors that span more than one surface brief.
**Predecessor:** ADMIN_SHELL_DESIGN_BRIEF.md (Amendment A), ADMIN_OVERVIEW_DESIGN_BRIEF.md, ADMIN_FACULTY_DESIGN_BRIEF.md (revised), ADMIN_NEWS_DESIGN_BRIEF.md, ADMIN_GROUPS_DESIGN_BRIEF.md.
**Audience:** UI/UX designer and implementer. These behaviors are inherited by any future admin surface.

---

## 1. Container rules (from Shell Amendment A)

Three containers, three jobs. Referenced by every surface brief.

| Container | Job | Examples |
|---|---|---|
| **Banner** (inline, in-form) | Save-time consequence while editing | A2 faculty/level change warning; Groups' "add at least one link" validation |
| **Modal** (centered, Cancel to dismiss) | Decision point on a record, initiated from a list action | Rename confirmation; A3 soft-delete confirmation; News/Groups soft-delete confirmation |
| **Sheet** (bottom, drag-dismissible) | Content editing and previews | All add/edit forms; resource preview; create/rename faculty form (two modes) |

Do not substitute one for another. The container carries the interaction's weight.

---

## 2. Add-resource intent routing (from Overview → Faculty)

**Trigger:** Overview's `Add resource` quick action.

**Behavior:**
1. Route to `/admin/faculty`.
2. **Zero faculties:** Level 1 empty state with `Create faculty` as the only prominent action. Creating a faculty in this mode opens the **add-resource sheet immediately** after creation (faculty auto-filled).
3. **One or more faculties:** A one-line prompt above the list: *"Pick a faculty to add a resource to."* Selecting a faculty row in this mode **opens the add-resource sheet directly**, not the faculty detail view.
4. Exiting the intent mode (navigating away, or after a save) returns Faculty to its normal browse behavior.

**Why:** A faculty-less resource form duplicates the Faculty list and violates the faculty-first mental model (plan §3.2). One extra click preserves the model.

---

## 3. Add-another flow (Faculty brief §10, refined)

**Location:** Add-resource sheet only. Not in edit mode. Not on News or Groups.

**Toggle:** `Add another`, default **off**.

**Off (default):** On publish-save, sheet closes, the **real resource-detail sheet** renders as preview for the saved item, toast fires. A `Add another` action inside the preview reopens a cleared form.

**On:** On publish-save, form **clears in place** (no preview), toast fires, toggle stays on, operator continues. Preview is **deferred**. When the operator turns the toggle **off**, the resource-detail sheet for the **last saved item** renders. If they close the sheet or navigate away with the toggle on, no preview is shown — the toasts are the record.

**Why:** Previewing every item defeats the toggle's speed purpose. Never previewing defeats its preview purpose. Toggle-off is the natural checkpoint ("I'm done adding"), and the last item is the cheapest useful preview.

---

## 4. Per-action toast vocabulary (News, inherited by future surfaces)

| Action | Toast |
|---|---|
| Publish (new) | `"{Title} published."` |
| Publish (draft → live) | `"{Title} published."` |
| Save as draft | `"{Title} saved as draft."` |
| Edit save (already published) | `"{Title} updated."` |
| Soft-delete | `"{Title} removed."` |
| Restore | `"{Title} restored."` |

**Why:** "Saved" collapses a distinction that matters. The operator needs to know whether their action reached students.

---

## 5. Soft-deleted visibility (from Shell §3.5)

- Hidden by default on every list.
- Revealed via `Show deleted` in each list's overflow menu — not a filter chip, not a checkbox.
- When revealed, deleted rows carry the `Deleted` badge and are the only rows offering **Restore**.
- Restore is **never gated** — it can only return content to view, never break a floor or rule.

**Why:** Deleted things shouldn't be visible without seeking them. The overflow is the deliberate reveal.

---

## 6. Rename pattern (Faculty, from Brief 2 §7 revision)

- **Entry:** Faculty list row overflow → `Rename`. One entry point.
- **Container:** modal. Not a sheet, not inline.
- **Form:** the create-faculty form in rename mode.
- **Friction is deliberate.** Rename changes the public label on every resource in the faculty. It should not be one click from a detail page.
- **No block rule.** Always allowed; the modal is the friction.

**Why:** Inline editability signals low consequence. A high-consequence action deserves a deliberate entry point and a decision container.

---

## 7. Badge vocabulary (from Shell §3.4)

| Badge | Meaning | Surfaces |
|---|---|---|
| `Published` | Live, student-visible | Resources, News |
| `Draft` | Not student-visible | Resources, News |
| `Deleted` | Soft-deleted, restorable | Resources, News, Groups |
| `Public` | Faculty ≥3 published resources | Faculty |
| `Unlisted (n/3)` | Faculty below threshold | Faculty |

Groups carry **no badge when live** — absence of `Deleted` is the live state.

**Why:** One vocabulary. Deleted is muted-destructive, not error-red — it's reversible.

---

## 8. Faculty counter rule (from Faculty brief §5 A4)

The `(n/3)` count counts **published resources only**. One counter, one meaning, three places: Overview faculty health, Faculty list badge, Faculty detail badge. Drafts are listed but not counted.

**Why:** A counter that means different things in different places is worse than no counter.

---

## End of behaviors file