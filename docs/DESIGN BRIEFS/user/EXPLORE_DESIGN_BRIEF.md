# EXPLORE — Design Brief

**Product:** D'voice
**Page:** Explore
**Platform:** Mobile-first web
**Status:** Ready for design

---

## 1. Purpose

Explore is the complete, searchable catalogue of every resource in D'voice.
It moves a student from an intent — "I need something for MTH 201" or
"what's available for my faculty?" — to a specific resource worth opening.

**Not Explore's job:**
- Curation or editorial selection (that is Home).
- Saved resources (that is My Library).
- Deciding how files open (that is the details sheet, defined separately).

Explore is public. It is usable and fully functional signed out.

---

## 2. What the page must communicate at a glance

1. This is a real, populated catalogue — not a placeholder.
2. I can find something specific quickly (search).
3. I can also just look around (filters).
4. Every card tells me enough to judge relevance before I tap.

---

## 3. Layout, top to bottom

1. **Page title** — "Explore" or "Resources". Short. No marketing copy.
2. **Search field** — the most visually prominent interactive element.
   Matches against title, course code, course title, contributor.
   Placeholder signals scope, e.g. "Search by course code, title, or topic."
3. **Filter row** — horizontally scrollable chips: Faculty, Level,
   Content type, Format. Visually secondary to search. Active filters
   must be visibly active and individually clearable.
4. **Result summary** — small, honest, updates live. E.g. "42 resources"
   or "Past questions · Faculty of Science".
5. **Resource card list** — single column on mobile (see §4).
6. **Load-more affordance** — see §6.

---

## 4. Resource card

One job: let a student decide whether to open the details sheet.

**No download button. No save button. No saved-state indicator.**
Tapping the card opens the resource details bottom sheet.

Content, in hierarchy order:

1. **Title** — largest text. Truncate at two lines.
2. **Course code + course title** — primary relevance anchor. Course code
   visually distinct (it is what students scan for).
3. **Content type badge** + **file format badge** — small, consistent.
4. **Contributor / source** + **date added** — secondary line, lower contrast.
5. **Download count** — only if present. Tertiary.

Cards must degrade gracefully when optional fields are absent. A resource
with no contributor and no download count still looks intentional.

---

## 5. States — all must be designed

- **Loading:** skeleton cards matching real card layout. No spinner-over-blank.
- **Empty catalogue (no resources at all):** honest message. No fake content.
- **No results:** explain which constraint to relax; offer one-tap clear.
  This is the highest-value state on the page — design it well.
- **Error (fetch failed):** clear message + retry. No dead end.
- **Partial data:** graceful degradation per §4.
- **End of list:** explicit. The user must never wonder if more is loading.

---

## 6. Pagination

Infinite scroll on mobile **with a visible "Load more" fallback** so users
can reach the footer and understand the catalogue is finite. Page size ~24.
Designed for 1,000+ resources from day one, not for a small list that
might grow.

---

## 7. Interaction notes

- Tapping a card opens the resource details bottom sheet.
- Filters are chip-style, multi-select where sensible, individually
  dismissible.
- Search and filters compose. Result count reflects both.
- Clearing search does not clear filters; clearing filters does not
  clear search. Each has its own clear affordance.

---

## 8. Accessibility floor

- Tap targets ≥ 44px.
- Search field has a real label, not placeholder-only.
- Badges and chips distinguishable by more than colour.
- Filter state and result count announced to screen readers.

---

## 9. Larger screens

Above a defined breakpoint, cards become a two-column grid. Search and
filters stay in a top bar. Same components, reflowed — not a separate
desktop experience.

---

## 10. Visual direction

- Blueish, modern. **Not** the generic AI-app blue.
- One secondary colour that carries **semantic load** (e.g. content-type
  badges, active state) rather than decorating for its own sake.
- No glow. No glow effects on cards, chips, or borders.
- Restraint over ornament. This page is dense; the palette must not
  compete with the content.

---

## 11. Out of scope

- Full-text search inside files.
- Saved searches, search history, autocomplete.
- Ratings, reviews, comments, tags.
- Recommendations or personalised ordering.
- Popularity as the default sort (recency is default).
- Download, save, or open actions on the card itself.

---

## 12. Decisions already made (do not relitigate)

- Content type is a closed vocabulary of five:
  Past question · Lecture note · Summary / study guide ·
  Textbook / reference · Slide / presentation.
- Faculty is the only location filter. Not department.
- Filters serve broad discovery. Search serves precision.
- Explore is public and fully usable signed out.
- Pagination is infinite scroll + load-more, sized for 1,000+ resources.