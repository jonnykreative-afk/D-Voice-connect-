# D'voice — Product Baseline & Planning Guide

**Status:** Working baseline. Explore is planned and implemented; remaining pages are not.
**Purpose:** Preserve product decisions and guide page-by-page planning without needing the original planning conversation.
**Rule:** Treat confirmed decisions as constraints. Treat explicitly provisional items as assumptions that may be challenged with a clear reason. Do not silently invent new scope.

---

## 1. Product purpose

D'voice is primarily an **educational resource discovery and access platform for students**.

Its core promise is to help students find useful learning materials, understand what a resource contains, access or download it, and optionally save it for later.

Campus information can complement this purpose, but must not overwhelm or replace it. D'voice is associated with its founder's public/political identity, but the signed-in student experience must focus on students and their academic needs—not on promoting the founder.

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

## 3. Navigation baseline

| Destination | Responsibility |
|---|---|
| **Home** | Guide students towards useful educational resources and selected relevant campus information. |
| **Explore** | Search and browse the available resource catalogue. |
| **My Library** | Display resources the student explicitly saved. |
| **Profile** | Manage account information and preferences; provide access to relevant account and public-identity information. |

The resource reader/opening experience is an interface reached from a resource; it is not automatically a primary navigation destination.

## 4. Core resource behaviour

- Publicly available resources can be downloaded without signing in.
- Opening a resource does not automatically save it.
- Downloading a resource does not automatically save it.
- **My Library contains explicitly saved resources only.**
- Resource discovery and resource details must make it possible for students to judge relevance before committing to a download or opening action.
- A resource's exact supported formats and opening behaviour are **not decided yet**. Do not assume that the MVP must open files inside the website.
- PDF-only support, browser-based viewing, reading progress, time-spent tracking, and similar behaviours remain open questions for a later, focused discussion. Do not silently add them to the scope.

## 5. Resource model (settled during Explore planning)

### Resource definition (MVP)

> A **resource** is a downloadable file (or small set of files) that a student can use for study, contributed by D'voice admins/contributors.

For MVP, resources are **document-type** files: PDFs primarily, with DOCX/PPTX tolerated as downloads even if they cannot be previewed. Video, external links, and third-party course links are **out of MVP scope**.

### Content type (closed vocabulary)

Resources are tagged with one **content type** from a fixed set — never free text:

- **Past question**
- **Lecture note**
- **Summary / study guide**
- **Textbook / reference**
- **Slide / presentation**
- **Other** (last resort, not designed around)

### Metadata

**Required:**
- Title
- Course code + course title
- Content type
- File format
- Date added
- Contributor / source

**Optional:**
- Description / summary
- Level (100–500)
- File size
- Download count

Resisted for MVP: ratings, reviews, comments, reading progress, difficulty, tags.

### Course granularity

**Faculty only** for MVP. Department is not modelled at the resource level because admins would have to identify departments on every upload. Specificity is handled by search, not filters.

## 6. Explore — settled

Explore is the complete, searchable catalogue of every resource in D'voice. It is public and usable signed-out. It enumerates; Home curates.

- **Search** is the precision tool. Matches title, course code, course title, contributor. Whole-catalogue scope.
- **Filters** are the broad-discovery tool. Coarse and few: **Faculty, Level, Content type, Format.** Multi-select, individually dismissible. Search and filters compose.
- **Default sort:** newest first.
- **Pagination:** infinite scroll with a visible "Load more" fallback, page size ~24. Designed for 1,000+ resources from day one.
- **Resource cards** let a student judge relevance and open the details bottom sheet. Cards do **not** carry download or save actions. Saved state is **not** shown on cards.
- **States required:** loading (skeletons), empty catalogue, no-results, error, partial data, end-of-list.

## 7. Resource details presentation

The current design direction is a **bottom sheet that slides up and occupies most of the available vertical screen space**, opened from a resource in the catalogue.

Treat this as the working interaction direction, not a reason to decide every detail before discussing it. The sheet's content, actions, dismissal behaviour, and responsive treatment will be decided during its own page/interaction discussion.

## 8. MVP scope

### Core MVP priorities

- Resource discovery and catalogue. **(Explore: done.)**
- Search and useful filtering. **(Explore: done.)**
- Clear resource cards and resource metadata. **(Explore: done.)**
- Resource details bottom sheet. **(next)**
- Public downloading without mandatory sign-in.
- Explicitly saving resources and viewing them in My Library.
- Home that directs students towards useful resources.
- Profile/account basics and appropriate preferences.
- A public-facing introduction to D'voice, with founder identity and WhatsApp community access available without making either the main student experience.

### Campus information

News may appear on Home as supporting content. Keep its presentation proportionate to the primary educational purpose. A full news section/article experience should only be introduced if needed for the actual content and user flow.

Indigenous associations may be considered as a supporting campus-information feature, but their initial scope and presentation should be assessed against available, maintainable content.

### Explicitly excluded from MVP

- Campus map / navigation map.
- Daily quotes (possible small post-MVP addition).
- Examination countdown (possible small post-MVP addition).

## 9. Public and signed-in experiences

### Public / signed out

Visitors should be able to understand what D'voice offers and discover its value without first registering. They must be able to download publicly available resources without signing in.

The public-facing experience should make D'voice's identity, founder connection, and official WhatsApp community discoverable. Community membership is optional and must not be a condition for accessing resources.

### Signed in

The signed-in experience should prioritise students' resource-related tasks: discovering, accessing, downloading, and explicitly saving resources, plus managing preferences where useful.

Do not add recurring founder promotion to Home or make the founder's political identity the organising principle of the dashboard.

## 10. Visual direction (client constraint)

- Blueish, **not** the generic "AI app" blue.
- Modern; blue mixed with a second colour.
- **No glowing borders.** (Client asked; product owner removed before handoff.)
- The second colour should carry semantic load (badges, active states), not just decorate.
- Dense catalogue pages must stay readable; avoid high-attention treatments applied to every card.

## 11. Planning order

### 1. Explore — done
Implemented. See Section 6 for settled decisions.

### 2. Resource details bottom sheet — next
Define its purpose, content, available actions, relationship to the catalogue, and mobile/large-screen behaviour. Keep file-opening and reader implementation questions separate unless they are necessary to decide the sheet's immediate actions.

**Output:** a self-contained design brief for the details sheet.

### 3. Home
Use the established resource model to decide which sections help students discover useful resources. Distinguish Home's guidance/curation role from Explore's complete catalogue. Decide how much space supporting news or campus information deserves.

### 4. My Library
Define how explicitly saved resources are displayed, found, removed, and revisited. Do not add reading history unless a later decision justifies it.

### 5. Profile and preferences
Define account information, useful preferences (faculty is a candidate), account actions, and links to founder/community information.

### 6. Public landing and authentication
Plan the public introduction, sign-in, and registration experience. Decide whether signed-out users share the same Home/Explore surfaces or need a distinct landing page.

### 7. Resource opening / reading experience
Discuss after discovery and details flows are clear. Explicitly evaluate: whether the site opens files in MVP, which file types open in-browser, whether PDF-only is sufficient, when download is preferred/only, whether reading progress has value, and whether time-spent tracking is necessary (default: no).

### 8. Supporting campus information
Decide MVP treatment of news and whether indigenous associations merit a directory or a smaller Home section.

### 9. Content administration and implementation planning
Identify the minimum way authorised people can add/update resources. Then move into architecture, implementation planning, testing, and release.

## 12. Standard workflow for each page

1. Discuss the product problem.
2. Challenge the proposed content.
3. Set boundaries.
4. Resolve important interactions.
5. Record assumptions and open questions.
6. Create the design brief only after discussion.
7. Review the generated design against the brief.

## 13. Working rules for future AI conversations

When starting a new conversation:
- Provide this baseline and name the target page or experience.
- Treat the baseline as the source of truth for confirmed decisions.
- Do not re-plan the entire product unless a genuine contradiction or important new insight appears.
- Do not silently expand MVP scope.
- Make reasonable assumptions rather than sending routine decisions back to the founder.
- Clearly label any new proposal that would change a baseline decision, explain the trade-off, and wait for the product owner to decide if the change is significant.
- Keep responses practical and focused.
- Do not generate the target page's final designer brief until the page-planning discussion is complete.

## 14. Success: initial signals to evaluate

- **Discovery:** Are students finding and opening or downloading useful resources?
- **Access:** Can they successfully access/download the resources they choose?
- **Retention of value:** Do students save resources and return to them when needed?

---

## Immediate next action

Start a new conversation with this file and the instruction:

> We are planning D'voice. Read the product baseline. Explore is planned and implemented — do not re-open it. Focus only on the **resource details bottom sheet** that opens from an Explore resource card. Help me decide and defend its purpose, content, available actions (download, save, share, open), relationship to the catalogue, dismissal behaviour, and mobile/large-screen treatment. Keep file-opening/reader implementation questions separate unless the sheet's immediate actions require them. Challenge unnecessary complexity and make reasonable assumptions without asking me to consult the founder for routine decisions. Do not write the final designer brief yet; we will do that only after the discussion is settled.