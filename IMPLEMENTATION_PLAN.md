# D'Voice — Implementation Plan

Work in small, testable stages. Finish and verify a stage before moving on. This is a working checklist, not another full product specification.

## Stage 1 — Confirm the product boundary
- [ ] Read `PRODUCT_BRIEF.md`.
- [ ] Confirm the MVP scope and explicit exclusions.
- [ ] Confirm the single-institution FUTA deployment.
- [ ] Resolve the open decisions at the end of `PRODUCT_SPEC.md` that block implementation.

## Stage 2 — Design the student experience first
- [ ] Map the key journeys: find a resource, open a PDF, save a resource, revisit it, read an update, find an association.
- [ ] Define the public navigation and student navigation.
- [ ] Design the dashboard/Home content hierarchy.
- [ ] Design Explore, resource details, Reading, and Profile.
- [ ] Design empty, loading, error, and unavailable states.
- [ ] Review mobile layouts before detailed implementation.

## Stage 3 — Define data and API contracts
- [ ] Define the resource, reading-history, saved-resource, news, association, examination-date, and quote data shapes.
- [ ] Define the founder-page content shape and publish/visibility behaviour.
- [ ] Define the WhatsApp invitation settings: copy, URL, visibility.
- [ ] Define request/response contracts for the student journeys.
- [ ] Use realistic mock data to test the UI before wiring up a real backend.

## Stage 4 — Implement the student/public MVP
- [ ] Public Home and navigation.
- [ ] Explore search, filters, listing, pagination/incremental loading.
- [ ] Resource details and PDF opening.
- [ ] Student authentication only as required by agreed journeys.
- [ ] Reading: Recent and Saved.
- [ ] News and association discovery.
- [ ] Examination dates and daily quote, with honest empty states.
- [ ] Founder page and optional community invitation.
- [ ] Test the complete journeys on mobile and desktop.

## Stage 5 — Design and implement administration
Design admin screens from the content fields and actions the user-facing product actually needs. Avoid inventing admin controls before the managed content is defined.
- [ ] Define admin roles and permissions.
- [ ] Define create/edit/publish/unpublish/delete flows for MVP content.
- [ ] Implement resource management.
- [ ] Implement news and association management.
- [ ] Implement examination-date and quote management.
- [ ] Implement editing of every founder-page field, image, link, and visibility setting.
- [ ] Implement editing of community invitation text, URL, and visibility.
- [ ] Enforce all permissions in the backend.
- [ ] Test validation, success, failure, and permission-denied states.

## Stage 6 — Integration and security
- [ ] Replace mock data with the agreed API without redesigning the UI.
- [ ] Validate inputs on the server.
- [ ] Check authentication and authorisation for protected actions.
- [ ] Check that unpublished or removed content is not shown as public.
- [ ] Test missing files, expired community links, empty datasets, and failed requests.
- [ ] Review student-data collection and storage.

## Stage 7 — Release readiness
- [ ] Verify all success criteria in `SUCCESS_CRITERIA.md`.
- [ ] Test narrow mobile screens and desktop layouts.
- [ ] Fix critical usability, accessibility, and security issues.
- [ ] Document known limitations and operational responsibilities.
- [ ] Release to a small group of students and gather feedback before expanding scope.

## Working rule
Do not begin a new feature merely because it is mentioned in the specification. Confirm its user journey, data requirements, and acceptance criteria first. Keep the next task small enough to implement and verify in one focused session.
