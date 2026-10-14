# D'Voice — Implementation Plan

Use this as the working sequence. Complete and review one stage before expanding scope.

## Stage 1 — Product boundary (nearly complete)
- [x] Define the student utility purpose and FUTA-only MVP.
- [x] Exclude multi-tenancy and institution switching.
- [x] Set faculty as the only confirmed personalisation attribute.
- [x] Define admin-published announcements.
- [x] Treat founder content and WhatsApp purpose as editable/provisional for design.

## Stage 2 — UI/UX handoff
- [ ] Give `PRODUCT_BRIEF.md`, `PRODUCT_SPEC.md`, `SUCCESS_CRITERIA.md`, `UI_HANDOFF.md`, and `PAGE_GUIDE_TEMPLATE.md` to the UI designer/model.
- [ ] Ask for a proposed page inventory, navigation map, core journeys, and design system first; do not generate all pages immediately.
- [ ] Review and approve the page inventory and shared design system.
- [ ] Complete page guides, then design/build pages one at a time.
- [ ] Validate mobile and desktop layouts and all relevant UI states.

## Stage 3 — Data and API contracts
- [ ] Review a few actual sample PDFs and confirm the minimum useful metadata.
- [ ] Define resource, reading-history, saved-resource, announcement, association, examination-date, quote, founder-content, and community-invitation data shapes.
- [ ] Define request/response contracts for the agreed user journeys.
- [ ] Prepare realistic mock data and error/empty responses.

## Stage 4 — Student/public implementation
- [ ] Resource discovery/search and filters.
- [ ] Resource details and PDF access.
- [ ] Student Home.
- [ ] Reading: Recent and Saved.
- [ ] Profile with faculty preference only, if needed for the agreed flow.
- [ ] Announcements and association discovery.
- [ ] Examination dates and quotes when content exists.
- [ ] Public About, Contact, and Meet the Founder.
- [ ] Optional WhatsApp invitation.
- [ ] Test complete journeys before expanding.

## Stage 5 — Admin design and implementation
Plan admin screens from the user-facing content fields/actions, not in isolation.
- [ ] Resource management.
- [ ] Announcement management (admins publish).
- [ ] Association management.
- [ ] Examination-date and quote management.
- [ ] Founder-page editor for every displayed field, image, link, and visibility setting.
- [ ] WhatsApp invitation editor for copy, URL, and visibility.
- [ ] Basic platform/contact information.
- [ ] Backend authorisation, validation, and success/error states.

## Stage 6 — Integration and verification
- [ ] Replace mock data with real API responses without redesigning pages.
- [ ] Validate all inputs on the server.
- [ ] Verify authentication and admin permissions at the backend.
- [ ] Test missing/unavailable PDFs, missing/expired community links, empty results, and failed requests.
- [ ] Review privacy and stored student data.

## Stage 7 — Release readiness
- [ ] Verify `SUCCESS_CRITERIA.md`.
- [ ] Test mobile and desktop layouts.
- [ ] Fix critical usability, accessibility, and security issues.
- [ ] Confirm founder details and WhatsApp purpose/moderation before public launch.
- [ ] Document known limitations and operational responsibilities.
- [ ] Pilot with a small group of students and gather feedback.

## Working rule
A specification describes the product; it does not mean every feature should be built at once. Work from the approved page inventory and user journeys, and keep each implementation task small enough to verify.
