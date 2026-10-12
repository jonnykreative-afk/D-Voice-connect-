# D'Voice — Product Brief

## Purpose
D'Voice is a student-focused platform that brings academic resources, relevant campus updates, examination information, and student communities into one organised, mobile-friendly experience.

## Problem
Students often have to search across disconnected sources to find useful academic materials and reliable campus information. D'Voice makes available information easier to discover and revisit.

## Primary users
- **Visitors:** Explore public resources and understand the platform before creating an account.
- **Students:** Discover resources, save materials, revisit reading history, and find relevant updates and associations.
- **Administrators:** Maintain platform content and public-facing information without changing application code.

## Initial scope
The first deployment is for **FUTA only**. D'Voice is not being designed as a multi-tenant platform for the MVP. Keep the code organised and configurable, but do not build institution switching, cross-institution content ownership, or tenant-isolation infrastructure.

### MVP capabilities
1. Browse and search academic resources.
2. View resource details and open available PDFs.
3. Save resources and revisit recent reading.
4. Discover relevant news and announcements.
5. View examination dates and daily quotes when configured.
6. Discover student associations and their available contact information.
7. Learn about D'Voice and its founder.
8. Find an optional invitation to the founder's WhatsApp community, with a clear explanation of its purpose.
9. Let authorised administrators manage the content included in the MVP, including all editable founder-page fields and the WhatsApp community invitation/link.

## Product principles
- Academic utility comes first; the platform must remain useful regardless of the founder's election outcome or a student's political interests.
- Joining a WhatsApp group is optional and must never gate access to academic features.
- Explain the community's real value—such as useful updates, student discussion, resource notices, or opportunities—only where the founder can genuinely provide it. Do not promise benefits the group cannot deliver.
- Separate platform information from the founder's personal profile and political messaging. Do not imply institutional endorsement without permission.
- Make search and browsing straightforward on mobile devices.
- Never fabricate resources, dates, quotes, popularity, credentials, or official announcements.
- Build only what is needed to validate the MVP; record future ideas rather than implementing them prematurely.

## Success signals
- Students can find and open relevant materials.
- Students can return to saved and recently opened resources.
- Campus updates and association information are understandable and current.
- Students can use core academic features without joining a community.
- Administrators can update content and founder information without a code change or deployment.
- The application behaves clearly when content is empty, unavailable, or a request fails.

## Out of scope for the MVP
- Multi-tenancy or institution switching.
- Sophisticated AI recommendations or analytics.
- A custom PDF reader unless native browser viewing proves inadequate.
- Mandatory WhatsApp membership.
- Campaign functionality disguised as academic functionality.
- Any feature without a clear user need and testable outcome.
