# MY LIBRARY — Design Brief

**Product:** D'voice
**Page:** My Library
**Platform:** Mobile-first web
**Status:** Ready for design

---

## 1. Purpose

My Library shows the resources a student has **explicitly saved**, so they
can find them again.

It is not a history. It is not "recently viewed." It is not a reading
list with progress. Nothing appears here that the student did not
deliberately save.

---

## 2. Page contents

### 2.1 Saved-resource list
Cards in the same visual language as Explore's cards, so a resource is
instantly recognisable. But sorted and annotated by **saved context**:
the student thinks in terms of "when I saved it," so recency of saving is
the default ordering.

### 2.2 Search within My Library
A search field scoped to the student's saved items only.

- Same input behaviour as Explore's search.
- **No filters.** A saved list is personal and small; search alone is
  sufficient. Filters imply a catalogue to browse, which this is not.
- This is deliberate: without it, a semester's worth of saved items
  becomes an unscrollable graveyard.

### 2.3 Sort
Exactly two options:
- **Recently saved** (default)
- **Title A–Z**

No other sort options. Course code, faculty, and file type are catalogue
concerns, not personal-list concerns.

### 2.4 Remove
Each card has an unsave affordance. Immediate, with an **undo toast** —
not a confirm dialog. Confirming a low-stakes removal is friction.

---

## 3. What My Library must NOT contain

- Reading progress, "continue reading," last-opened.
- Recommendations or "you might also like."
- Folders, tags, or collections.
- Previews of Home or Explore content.
- Any resource the student did not explicitly save.

---

## 4. States

- **Empty (never saved anything):** the most important state. Explain
  what saving is and how to do it. Route toward Explore. Not a dead end.
- **Empty after search:** explain, offer one-tap clear.
- **Has items:** the list.
- **Loading:** skeleton cards.
- **Error:** clear message + retry. No dead end.
- **Signed-out access:** sign-in prompt; after signing in, land on My
  Library — not Home. Preserve intent.

---

## 5. Interaction notes

- Removing from My Library is **the same operation** as unsaving from
  the resource details sheet. One action, one truth. Not a separate
  "delete" concept.
- Tapping a card opens the resource details (sheet or page, consistent
  with how it opens from Explore).

---

## 6. Accessibility floor

- Tap targets ≥ 44px.
- Undo toast is announced to screen readers.
- Search field has a real label.
- List is navigable by keyboard and screen reader.

---

## 7. Larger screens

List may become a two-column grid above a defined breakpoint. Content,
order, actions unchanged.

---

## 8. Visual direction

- Blueish, modern. Not the generic AI-app blue.
- One secondary colour carrying semantic load.
- No glow.
- Quieter than Explore. This is a personal list, not a catalogue.

---

## 9. Out of scope

- Reading history.
- Folders, tags, collections.
- Recommendations.
- Reading progress.
- Sharing a saved list.

---

## 10. Decisions already made (do not relitigate)

- My Library contains **only** explicitly saved resources.
- Search is scoped to saved items; there are no filters.
- Sort is limited to Recently saved / Title A–Z.
- Remove = unsave. Same operation as the details sheet's Save toggle.
- Undo toast, not confirm dialog.
- Signed-out users are prompted to sign in and land on My Library after.