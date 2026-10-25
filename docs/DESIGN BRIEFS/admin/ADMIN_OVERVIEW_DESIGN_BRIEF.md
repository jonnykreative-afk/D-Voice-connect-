# D'voice Admin — Overview Design Brief

**Status:** Brief 1 of 5. Inherits ADMIN_SHELL_DESIGN_BRIEF.md (S1–S5, row primitive, sheet, toasts).
**Predecessor:** DVOICE-ADMIN_DASHBOARD_PLAN.md §3.1, §5.4.
**Successor:** ADMIN_FACULTY_DESIGN_BRIEF.md (Faculty is where work happens; Overview is where work is checked).
**Audience:** UI/UX designer. Decisions are final unless the "Why" note reveals a flaw.

---

## 1. Job of this surface

Answer, at a glance, **"is the content healthy, and what changed recently?"** — nothing else. Overview is a check-in surface, not a log and not a chart dashboard.

---

## 2. What the operator sees on arrival

Three sections, in this order, single column, mobile-first:

1. **Quick actions** — three buttons: `Add resource`, `Add news item`, `Add group`. Always at the top.
2. **Faculty health** — every faculty, each with its status badge (`Public` or `Unlisted (n/3)`, n = published resources only, per plan §5.4).
3. **Recently changed** — the last **8** records across resources, news, and groups, sorted by `updated_at` descending. Each row: name/title, action (Added / Edited / Published / Soft-deleted / Restored), timestamp, and a `Draft` badge if the record is a draft.

No traffic numbers. No charts. No "Welcome, Admin." No greeting block.

> **Why quick actions first:** The operator's most common arrival is "I came to add/fix something." Putting the three add actions above the fold means the check-in sections are what you scroll to, not what you scroll past.
> **Why no charts:** Traffic monitoring is deferred (plan §8). A page with mock numbers is worse than a page with none — it teaches the operator to distrust the surface.

---

## 3. Faculty health (the A4 view)

- One row per faculty, using the shell's row primitive.
- Trailing badge: `Public` or `Unlisted (n/3)`.
- No actions on these rows beyond navigation to `/admin/faculty/:id` (clicking the primary label).
- Sorted: `Unlisted` first (ascending by n — closest-to-public at top), then `Public` alphabetical.

> **Why unlisted-first:** The operator's job on Overview is "what needs attention." A faculty at 2/3 needs one more resource; a public faculty needs nothing. Sorting by need matches the surface's job.
> **Why ascending n:** A faculty at 2/3 is more actionable than one at 0/3. Closest-to-threshold first means the top of the list is the work.

---

## 4. Recently changed (the lightweight audit substitute)

- **Cap N = 8.** One mobile scroll. No "see all" link — if the operator wants history, that's the audit log (post-MVP, plan §7).
- Sorted by `updated_at` desc.
- **Drafts included**, marked `Draft` (see O2).
- **Soft-deleted excluded** (see O2).
- Reads existing data; no new table.

> **O1 — Why N = 8:** This is a check-in surface. 8 fits one mobile scroll without pagination, matches "did the last thing I did land," and is small enough that the operator actually reads it. 20 turns a check-in into a log; logs are §7-excluded until the audit-log window. If the operator needs more, the Faculty/News/Groups lists are one click away — that's their real history.
> **O2 — Why drafts yes, deleted no:** Drafts are the operator's own unfinished work; hiding them from the only landing surface means they forget what they were doing. Deleted records are *removed from view* by definition — surfacing them here would contradict §3.5 of the shell brief (deleted is hidden by default). "Recently changed" answers "what's live or in-progress," not "what did I delete."

---

## 5. What the operator can do

- Click a quick action → opens the relevant add sheet (resource add opens Faculty list first? **No** — see §6).
- Click a faculty row → navigate to Faculty detail.
- Click a recently-changed row → navigate to the record's surface (resource → its faculty detail; news → News list scrolled to item; group → Groups list scrolled to item).
- Nothing else. Overview has no edit actions, no delete actions, no toggles.

> **Why no inline actions here:** Overview is read-only by design. Every action lives on the surface that owns the content. A quick action is a *shortcut to that surface's add flow*, not a new flow.

---

## 6. Quick-action behavior (the one ambiguity to resolve)

`Add resource` from Overview: resources are faculty-scoped (plan §3.2 — faculty auto-filled, form lives inside faculty detail). From Overview, there is no faculty context. **Decision:** `Add resource` navigates to `/admin/faculty` (the list), not to a faculty-less form. The operator picks a faculty, then adds. `Add news item` and `Add group` open their sheets directly — those aren't scoped.

> **Why:** A faculty-less resource form would need a faculty picker, which duplicates the Faculty list and violates "faculty-first organisation is the operator's mental model" (plan §3.2). Navigating to the list is one extra click that keeps the model intact.

---

## 7. What the operator cannot do

- No traffic numbers, no analytics, no charts.
- No edit/delete/restore actions on any row.
- No "see all" for recently changed.
- No settings, no user management, no audit log.
- No "Add faculty" quick action — faculty creation lives on the Faculty surface (F1, plan §3.2).

> **Why no "Add faculty" quick action:** Three quick actions match the three content types the plan names (§1: resources, news, groups). Faculty is a precondition, not a content type — and creating a faculty without immediately adding resources is an edge case, not a common arrival.

---

## 8. Components used

Shell primitives only: row primitive (shell §3.7), status badges (shell §3.4), toasts (shell §3.6 — Overview fires none itself, but quick actions may route to surfaces that do), `state-view.js` for empty/loading states.

**Empty states:** (a) zero faculties → faculty-health section shows a `state-view` empty message with a link to Faculty list ("No faculties yet — create one on the Faculty surface"). (b) zero recent changes → single line, no illustration ("Nothing changed yet."). Keep both terse; this is an admin surface, not a marketing page.

---

## 9. Decisions made by this brief

- **O1** Cap N = 8 for Recently changed (§4).
- **O2** Drafts included and marked `Draft`; soft-deleted excluded (§4).
- Quick-action order: resource, news, group (§2).
- Faculty-health sort: unlisted-first, ascending n (§3).
- `Add resource` routes to Faculty list, not a faculty-less form (§6).
- No "Add faculty" quick action (§7).

## 10. Left to other briefs

- Nothing. Overview inherits shell patterns and decides everything else locally.
- The Overview's recently-changed click-through behavior depends on News and Groups lists existing (briefs 3–4); until then, navigate to the surface root.

## 11. Assumptions

- `updated_at` exists on resources, news, and groups records (needed for sorting).
- Action vocabulary (Added / Edited / Published / Soft-deleted / Restored) maps to what the surfaces will actually record; if a surface has no notion of "Restored" events yet, the row simply won't appear until it does.
- No persistence concern: this is a read-only view over existing data.

---

## End of Brief 1
