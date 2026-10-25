# RESOURCE DETAILS — Design Brief

**Product:** D'voice
**Surface:** Resource details, rendered in two containers:
  1. Bottom sheet, opened from a resource card in a catalogue.
  2. Full page at /resources/:id, canonical and shareable.
**Platform:** Mobile-first web
**Status:** Ready for design

---

## 1. Purpose

Present one resource so a student can judge its relevance and act on it:
download, save, or share.

**Not its job:** previewing file contents, recommending other resources,
hosting discussion, or tracking reading.

---

## 2. The two containers

**Sheet** — opened by tapping a resource card in Explore (and later Home,
My Library). Slides up, occupies ~85% of viewport height, drag-to-dismiss.
Closes back to the catalogue with scroll position and filters intact.
Includes an "Open full page" action.

**Page** — the canonical surface at /resources/:id. Direct links, shares,
and search-engine entries land here. Full navigation, browser back works,
header shows a back affordance. No "Open full page" action.

**Critical constraint:** the two containers render the **same content, in
the same order, with the same actions.** The sheet is not a shortened or
different version. Design it once, render it in two containers.

---

## 3. Content, in order

Identical on both containers:

1. **Title** — largest text. Full, not truncated.
2. **Course code + course title** — primary relevance anchor, visually distinct.
3. **Content type badge** + **file format badge** + **file size**.
4. **Primary action slot** — one slot. Today: Download. If in-browser
   opening is later approved, Open becomes primary and Download becomes
   secondary. Design must accept this change without rework.
5. **Save action** — secondary to download visually, but obvious.
6. **Share action** — copies the canonical /resources/:id URL. Present on
   both sheet and page.
7. **Description** — if present. If absent, the section collapses entirely.
   No empty label, no placeholder text.
8. **Metadata block** — contributor/source, date added, level, faculty,
   download count (if present). Compact, low contrast. Reference info,
   not the selling point.
9. **Contributor note / source line** — optional. Absent if not provided.

---

## 4. Actions and rules

- **Download** — works signed-out. Does NOT save to My Library.
- **Save** — requires sign-in. If signed out, tapping prompts sign-in;
  it does not hide or silently fail. Reversible: tapping Saved unsaves.
- **Share** — copies the URL. Works signed-out. Copy-to-clipboard with a
  confirmation toast. No native-share dependency.
- **Open full page** — visible on the sheet only.

---

## 5. States

- **Loading:** skeleton matching the real layout.
- **Error:** clear message + retry. No dead end.
- **Not found** (page only, bad or deleted id): honest message + link to Explore.
- **Partial data:** collapse absent sections. Never show empty labels.
- **Signed-out save attempt:** prompt to sign in, preserving intent.
- **Saved / unsaved:** visible, reversible, confirmed.

---

## 6. Accessibility floor

- Tap targets ≥ 44px.
- Sheet: keyboard-dismissible (Esc), focus-trapped while open, focus
  returns to the originating card on close.
- Page: real headings, real document title, back affordance.
- Actions are buttons, not divs.

---

## 7. Larger screens

Sheet becomes a centred modal or side panel above a defined breakpoint.
Page uses the extra width for a two-column metadata layout — content and
order unchanged.

---

## 8. Visual direction

- Blueish, modern. Not the generic AI-app blue.
- One secondary colour carrying semantic load (content-type badges,
  saved state, active controls).
- No glow.
- The primary action is the visual anchor of the surface. Everything else
  is quieter than it.

---

## 9. Out of scope

- In-browser reading, reading progress, time tracking.
- Ratings, reviews, comments.
- Related resources, recommendations.
- Version history, offline access.
- Download or save actions *inside* the catalogue card (those live here).

---

## 10. Decisions already made (do not relitigate)

- Both sheet and page exist. Page is canonical. Sheet links to page.
- Save requires sign-in. Download does not.
- Download never auto-saves.
- Share is URL copy.
- The primary action slot must accommodate Download→Open later without
  rework.