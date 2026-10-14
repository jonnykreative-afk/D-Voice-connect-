# D'Voice — UI Designer Handoff

## Goal
Design the MVP user experience and responsive interfaces for D'Voice, a student utility platform for FUTA. This is a handoff for UI/UX design, not a request to invent new product scope.

## Read first
1. `PRODUCT_BRIEF.md` — product purpose and boundaries.
2. `PRODUCT_SPEC.md` — expected behaviour, roles, pages, data fields, and constraints.
3. `SUCCESS_CRITERIA.md` — how the finished experience will be judged.

## Design priorities
1. Help students discover and open academic PDFs quickly.
2. Make search, filtering, resource details, and PDF access clear on mobile.
3. Keep Home as a useful overview and Explore as deliberate search/browsing.
4. Make Recent and Saved understandable and distinct.
5. Present announcements and associations clearly without making the platform feel like a political campaign site.
6. Include an optional WhatsApp community invitation with provisional value proposition; do not imply it is required.
7. Include a public Meet the Founder page, using marked placeholders until approved details arrive.
8. Plan admin screens only after the student/public screens and the content each one needs are understood.

## Visual direction
The current product brief calls for a mobile-first, dark interface with blue accents, accessible typography, clear hierarchy, and minimal unnecessary interaction. Treat this as the starting direction; propose a small, coherent design system and explain any meaningful departure.

## Expected design deliverables
Before generating detailed pages, provide:
1. **Page inventory:** the proposed page list grouped into public, student, and admin areas. Identify shared/reused page templates and justify any merged or removed pages.
2. **Navigation map:** how visitors and signed-in students move through the product.
3. **Core journeys:** find a PDF, open it, save it, revisit it, read an announcement, find an association, visit the founder page, and join the optional community.
4. **Design system:** colours, typography, spacing, responsive breakpoints, buttons, inputs, cards, navigation, status labels, and reusable layout rules.
5. **Page guides:** for every page, document purpose, target user, content hierarchy, components, primary/secondary actions, navigation, responsive behaviour, and loading/empty/error/unavailable states.
6. **Admin workflow outline:** identify the content fields/actions each admin screen manages, but defer detailed admin UI until student/public flows are settled.

## Rules for mock content
- Mark invented names, biographies, resource titles, dates, statistics, and invite URLs as placeholders.
- Do not use a real-looking WhatsApp URL. Use a disabled placeholder button or clearly labelled mock link.
- Resource examples should resemble academic PDFs, with optional metadata omitted when not applicable.
- Do not invent indigenous-group options.
- Do not represent the founder's personal position as an official FUTA statement.

## States every relevant page must account for
- Loading
- Populated/success
- Empty initial state
- No search results (where search exists)
- Request/error state with retry or recovery where possible
- Missing/unavailable PDF or expired/missing external link
- Authentication required, where relevant

## Recommended order of design
1. Shared design system and navigation
2. Explore/resource listing and resource details/PDF access
3. Student Home
4. Reading (Recent/Saved) and Profile
5. Public Home/About/Contact/Founder
6. Announcements and associations list/detail
7. Admin screens derived from the completed user-facing requirements

The designer can recommend a different sequence if dependencies justify it. Get approval on the page inventory and shared design system before producing every page in detail.
