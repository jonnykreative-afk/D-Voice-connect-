# HOME — Design Brief

**Product:** D'voice
**Page:** Home (signed-in)
**Platform:** Mobile-first web
**Status:** Ready for design

---

## 1. Scope of this brief

This brief covers the **signed-in Home only**.

The signed-out Home is a separate surface — a public landing page,
planned later. It may be founder-focused in a way this page must not be.
Do not design one Home for both audiences. If the two share a URL, they
are still two different pages.

---

## 2. Purpose

Home orients a signed-in student who has just arrived and routes them
toward the right action: search, browse their faculty, see what's new for
them, or reach a saved resource.

Home is a router, not a catalogue. It does not show the full resource
list — Explore does that. If Home ever reads as "Explore but shorter,"
it has failed.

---

## 3. Sections, in order

### 3.1 Greeting + search entry
The single highest-value element. A search field that routes into Explore
with the query applied. Removes a tap for the most common intent.

### 3.2 Featured / "Start here"
3–5 resources, editorially chosen. Purpose: show the student something
immediately useful and prove the catalogue is real.

- Capped at ~5. Beyond that it becomes a second catalogue.
- If no featured items exist, the section is absent. Home must still
  work and not look broken.
- Editorial only. Not personalised, not algorithmic, in MVP.

### 3.3 Recently added
A horizontal strip of 5–8 resources.

- Under the hood, scoped to the student's faculty and level. The label
  is simply "Recently added." The designer does not need to represent
  the scoping.
- Non-editorial, so it cannot die from lack of curation.
- A strip, not a list. An entry point, not a view.

### 3.4 Faculty shortcuts
A compact row of faculties. Tap → Explore filtered to that faculty.

- **By product rule, this section always has content.** A faculty is
  only selectable once it has at least 3 resources, and no faculty can
  drop below 3. Do not design an empty state for this section — it
  cannot occur.
- Static or lightly ordered in MVP. Personalisation is post-MVP.

### 3.5 Campus news
2–3 items maximum. Below all resource sections. Visually lighter than
anything resource-related.

- No "See all news" link unless a news page exists (not MVP).
- If no news, the section is absent.
- If news ever occupies more vertical space than the resource sections
  combined, it has drifted.

### 3.6 Community / founder touchpoint
At most one small, low-emphasis link (footer entry or a single quiet
card) pointing to the WhatsApp community and/or an About surface.

- Not a section.
- Not above resource content.
- The signed-in student must not see founder promotion in their face.

---

## 4. What Home must NOT do

- Show the full catalogue.
- Resemble a feed.
- Promote the founder or community above resources.
- Require sign-in to be useful (it is signed-in, but should not feel
  like a gate).
- Depend on curation to not look broken.
- Preview My Library. (One small "Go to My Library" affordance for
  signed-in users is enough.)
- Show "newest overall." Freshness is only meaningful scoped to the
  student's context.

---

## 5. States

- **Loading:** section-level skeletons, not a page-level spinner.
- **Catalogue empty:** greeting + search + community link remain.
  No fake resource sections.
- **Individual section empty:** section is omitted, not shown empty.
  (Faculty shortcuts is exempt — it always has content by product rule.)
- **Error:** affected section shows a quiet retry; the rest of Home
  remains usable.

---

## 6. Accessibility floor

- Tap targets ≥ 44px.
- Horizontal strips are keyboard- and screen-reader-navigable.
- Section headings are real headings, in order.
- Search field has a real label.

---

## 7. Larger screens

Sections use the extra width (Featured as a wider grid, Recently added
as a longer strip). Content, order, hierarchy unchanged.

---

## 8. Visual direction

- Blueish, modern. Not the generic AI-app blue.
- One secondary colour carrying semantic load.
- No glow.
- Home is quieter than Explore — an entry point, not a dense list.
- Resource sections outrank news and community visually. Always.

---

## 9. Out of scope

- Reading progress, continue reading.
- Full news feed or news page.
- Indigenous associations directory (post-MVP).
- Examination countdown, daily quotes (excluded from MVP).
- Personalised recommendations.
- My Library preview.
- The signed-out landing page.

---

## 10. Decisions already made (do not relitigate)

- Home is a router, not a catalogue.
- This brief covers signed-in Home only. Signed-out is a separate
  landing page.
- Featured is editorial, capped at ~5, degrades to absent if uncurated.
- Recently added is a capped strip, scoped to faculty+level under the
  hood, labelled simply "Recently added."
- Faculty shortcuts always has content (≥3 resources per selectable
  faculty, and no faculty can drop below 3).
- News is 2–3 items, no "see all," never outranks resources.
- Community/founder presence is at most one quiet link.
- Faculty shortcuts serve broad discovery, consistent with Explore.