# D'voice — Product Baseline & Planning Guide

**Status:** Working baseline. Explore, resource details, Home, My Library, Profile, public landing, auth, news, and indigenous groups have been planned. Reading experience and content administration are deferred to later planning windows.
**Purpose:** Preserve product decisions and guide page-by-page planning without needing earlier conversations.
**Rule:** Treat confirmed decisions as constraints. Treat explicitly provisional items as assumptions that may be challenged with a clear reason. Do not silently invent new scope.

---

## 1. Product purpose

D'voice is primarily an **educational resource discovery and access platform for students**.

Its core promise is to help students find useful learning materials, understand what a resource contains, access or download it, and optionally save it for later.

Campus information can complement this purpose, but must not overwhelm or replace it. D'voice is associated with its founder's public/political identity, but the signed-in student experience must focus on students and their academic needs — not on promoting the founder.

### Primary users

- Students looking for a particular learning resource.
- Students browsing to discover useful resources they did not know about.
- Students who want to save useful materials and return to them later.
- Public visitors evaluating D'voice before deciding whether to use it.

Design for mobile use first, while avoiding decisions that unnecessarily prevent a good larger-screen experience.

## 2. Product principles

1. **Resources first.** Educational-resource discovery and access are the product's primary purpose.
2. **Public access by default.** Anyone must be able to download publicly available resources without signing in.
3. **Do not force registration without a product reason.** Accounts are for genuinely personal features, such as maintaining a saved library or retaining preferences.
4. **Saving is intentional.** Opening or downloading a resource must not automatically save it to My Library.
5. **Every page needs a distinct job.** Avoid duplicating the same catalogue or content across Home, Explore, and My Library.
6. **Keep the MVP focused.** Do not add a feature merely because it is easy, attractive, or typical of student platforms.
7. **Make reasonable product decisions.** Do not repeatedly defer to the founder for routine product-design choices. Use informed assumptions, mark important uncertainties, and keep moving.
8. **Separate product design from visual design and implementation.** First decide what a page must accomplish and why. Then create a design brief. Then design the UI. Plan architecture and implement separately.
9. **Do not over-specify prematurely.** Decide what is necessary at the current stage; leave technical details and lower-priority interactions for the appropriate phase.
10. **Keep founder promotion out of the signed-in product's centre.** Ownership and community information should be discoverable, not the dashboard's primary purpose.
11. **Collect only what a feature reads.** If no feature reads a piece of data, do not ask for it.
12. **Freshness is only meaningful scoped.** "Newest overall" is noise. New content is only surfaced relative to the student's own context.

## 3. Navigation baseline

| Destination | Responsibility |
|---|---|
| **Home** | Signed-in routing surface. Directs students toward useful resources and relevant campus information. |
| **Explore** | Search and browse the full resource catalogue. Public. |
| **My Library** | Display resources the student explicitly saved. |
| **Profile** | Edit context (faculty, level), account basics, and links to community/founder info. |

The resource details experience (sheet + page) is reached from a resource; it is not a primary navigation destination.

## 4. Core resource behaviour

- Publicly available resources can be downloaded without signing in.
- Opening a resource does not automatically save it.
- Downloading a resource does not automatically save it.
- **My Library contains explicitly saved resources only.**
- Removing from My Library is the same operation as unsaving from the details sheet. One action, one truth.
- Resource discovery and details must make it possible for students to judge relevance before committing to a download or opening action.
- The exact supported formats and opening behaviour are **not decided yet**. PDF-only support, browser-based viewing, reading progress, time-spent tracking, and similar behaviours remain open questions for the reading-experience discussion. Do not silently add them to scope.

## 5. Resource model

**Content type** is a closed vocabulary of five:

- Past question
- Lecture note
- Summary / study guide
- Textbook / reference
- Slide / presentation

**Required metadata:** title, course code + course title, content type, file format, date added, contributor/source.

**Optional metadata:** description, level, faculty, file size, download count.

Course code is metadata, not a content type.

## 6. Resource details presentation

Both surfaces exist. **The page is canonical; the sheet is a convenience view.**

- **Page** — `/resources/:id`. Direct links, shares, and search-engine entries land here. Full navigation, browser back works. Source of truth.
- **Sheet** — opened by tapping a resource card in a catalogue. Slides up, occupies ~85% of viewport height, drag-to-dismiss. Preserves catalogue context (scroll, filters, search) on close. Includes an "Open full page" action.

**Critical constraint:** the sheet and page render the **same content, in the same order, with the same actions.** The sheet is not a shortened version. Design once, render in two containers.

**Primary action slot:** today holds Download. If in-browser opening is later approved, Open becomes primary and Download secondary. Design must accept this change without rework.

**Actions:** Download (signed-out allowed, never auto-saves), Save (requires sign-in, reversible), Share (copies canonical URL, signed-out allowed).

## 7. MVP scope

### Core MVP priorities

- Resource discovery and catalogue.
- Search and useful filtering.
- Clear resource cards and resource metadata.
- Resource details (page + sheet).
- Public downloading without mandatory sign-in.
- Explicitly saving resources and viewing them in My Library.
- Home that routes students toward useful resources.
- Profile/account basics and context editing.
- A public-facing landing page, founder-framed.
- News list and detail pages.
- Indigenous groups directory (list only, outbound links).

### Explicitly excluded from MVP

- Campus map / navigation map.
- Daily quotes.
- Examination countdown.
- Reading progress, time-spent tracking.
- Profile photos.
- Phone number collection.
- Email editing.
- Social login, 2FA, email verification.
- Ratings, reviews, comments.
- Folders, tags, collections in My Library.
- In-app group feeds or chat.
- News categories, tags, filters, search.
- Personalised recommendations.
- Uploader upgrade flow.

## 8. Public and signed-in experiences

### Public / signed out

- **Landing page** (signed-out Home) is founder-framed. It is the one surface where the founder is central. Primary CTA is browsing resources; sign-up is secondary. Resources are never gated.
- **Explore** is the same for signed-out and signed-in users. Minor differences only. No separate catalogue, no gated preview.
- Download works signed out.

### Signed in

- Home is a routing surface, not a catalogue.
- Founder presence is at most one quiet link, never above resources.

## 9. Theme and visual direction

**Palette:** blueish, modern. **Not** the generic AI-app blue. One secondary colour that carries semantic load (content-type badges, saved state, active controls) rather than decorating.

**No glow.** No glow effects on cards, chips, or borders.

**Restraint over ornament.** Surfaces are dense; the palette must not compete with content.

### Colour variables

```css
:root {
  /* Primary — blue, modern, not generic AI blue */
  --color-primary-900: #0B1F3A;
  --color-primary-700: #123A6B;
  --color-primary-500: #1E5AA8;
  --color-primary-300: #4A87D6;
  --color-primary-100: #D6E4F7;

  /* Secondary — semantic load */
  --color-secondary-700: #0F5C4E;
  --color-secondary-500: #1A8C77;
  --color-secondary-100: #D3EFE8;

  /* Neutrals */
  --color-ink-900: #0E1116;
  --color-ink-700: #2A313B;
  --color-ink-500: #5A6472;
  --color-ink-300: #98A2B3;
  --color-surface-0: #FFFFFF;
  --color-surface-50: #F6F8FB;
  --color-surface-100: #EDF1F6;
  --color-border: #DDE3EC;

  /* Semantic states */
  --color-success: #1A8C77;
  --color-warning: #B7791F;
  --color-danger: #B42318;
  --color-danger-100: #FDE7E5;

  /* Typography */
  --font-sans: "Inter", system-ui, -apple-system, "Segoe UI", sans-serif;
  --text-xs: 12px;
  --text-sm: 14px;
  --text-md: 16px;
  --text-lg: 20px;
  --text-xl: 24px;
  --text-2xl: 30px;

  /* Spacing */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 24px;
  --space-6: 32px;
  --space-7: 48px;

  /* Radius */
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;
  --radius-full: 999px;

  /* Elevation — no glow */
  --shadow-1: 0 1px 2px rgba(14, 17, 22, 0.06);
  --shadow-2: 0 4px 12px rgba(14, 17, 22, 0.08);
}

```

Designers may adjust values but must not change the intent: blueish, modern, semantically-loaded secondary, no glow, restraint.

## 10. Constraints affecting backend

These are rules with implementation weight. They are not design preferences.

1. **Faculty minimum.** A faculty is only selectable/visible if it has at least 3 resources. No faculty may drop below 3. Deleting the last resources of a faculty must be blocked, force reassignment, or soft-delete. This guarantees the Home faculty-shortcuts section always has content and prevents any faculty from looking abandoned.
2. **Save = unsave.** Saving and removing from My Library are the same toggle. One endpoint, one truth.
3. **Download never saves.** Downloading is not a save signal. It must not write to My Library.
4. **Public download.** GET of a resource file must work without authentication for publicly available resources.
5. **Collect only what features read.** Name, email, faculty, level. Nothing else in MVP.
6. **Freshness scoped.** "Recently added" on Home is scoped server-side to the student's faculty and level. The label shown is just "Recently added."
7. **Post-auth intent preservation.** After sign-in, redirect to the intended destination (My Library, Profile, or the pending save action), not Home.
8. **Canonical resource route.** GET /resources/:id returns one resource, independent of catalogue state. Deep-linkable, shareable, indexable.
9. **Sheet and page share content.** One content model, two containers. Do not maintain divergent copies.
10. **News supports optional images.** Article schema must allow an item with or without an image without breaking layout.

---

## 11. Planning order (updated)

Completed:

1. ✅ Explore
2. ✅ Resource details (page + sheet)
3. ✅ Home (signed-in)
4. ✅ My Library
5. ✅ Profile
6. ✅ Public landing & auth
7. ✅ News list & detail
8. ✅ Indigenous groups

Deferred to separate windows:

9. **Resource opening / reading experience.** Decide whether the site opens files at all in MVP, which types open in-browser, whether PDF-only is enough, whether download should be the only action, whether reading progress has value. Do not track reading time without a clear product need.
10. **Content administration.** Minimum way authorised people can add/update resources and supporting content. Avoid elaborate admin design before content workflows are known.

Then: architecture, implementation planning, testing, release.

---

## 12. Standard workflow for each page

1. Discuss the product problem.
2. Challenge the proposed content.
3. Set boundaries.
4. Resolve important interactions.
5. Record assumptions and open questions.
6. Create the design brief only after discussion.
7. Review the generated design against the brief.

**Working distinction:** mechanical pages (catalogue, list, form) may be planned discussion + brief in one pass. Judgment pages (Home, landing) get discussion first, brief after. Either way, the brief is the final artifact and the discussion must remain visible above it.

---

## 13. Completed design briefs

· EXPLORE_DESIGN_BRIEF.md
· RESOURCE_DETAILS_DESIGN_BRIEF.md
· HOME_DESIGN_BRIEF.md
· MY_LIBRARY_DESIGN_BRIEF.md
· PROFILE_DESIGN_BRIEF.md
· PUBLIC_LANDING_DESIGN_BRIEF.md
· AUTH_DESIGN_BRIEF.md
· NEWS_DESIGN_BRIEF.md
· INDIGENOUS_GROUPS_DESIGN_BRIEF.md

---

## 14. Success: initial signals to evaluate

· **Discovery:** Are students finding and opening or downloading useful resources?
· **Access:** Can they successfully access/download the resources they choose?
· **Retention of value:** Do students save resources and return to them when needed?

These are initial evaluation signals, not a demand for sophisticated analytics before launch.

---

## Immediate next action

Start a new conversation with this file, the relevant page brief if one exists, and the instruction:

We are planning D'voice. Read the product baseline and the attached brief. Focus only on content administration. Help me decide and defend the minimum way authorised people add, update, and remove resources and supporting content (news, indigenous groups), consistent with the backend constraints in §10 — especially the faculty minimum rule. Challenge unnecessary complexity. Do not write the final designer brief yet; discuss first.