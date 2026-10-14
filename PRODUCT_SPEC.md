# D'Voice — Product Specification (MVP)

This document describes required product behaviour. It is a product guide, not a technical architecture specification or a pixel-perfect design.

## 1. Product boundary
D'Voice initially serves FUTA only. Build a single-institution application. Do not implement tenant switching, institution-level tenant isolation, or cross-institution content ownership. Keep code reasonably modular without engineering for hypothetical deployments.

Academic utility is the primary purpose. The product must remain useful even if the founder loses an election or a student has no interest in politics.

## 2. Roles
### Visitor
Can browse publicly available resources, search, view public announcements and association information, read About/Founder/Contact pages, and see the optional WhatsApp invitation. Registration is required only for actions that need a personal account.

### Student
Can use the student experience, search permitted resources, open available PDFs, save resources, revisit recent reading, and view campus information. Personalisation is based on the student's **faculty only** for the MVP. Personalisation may prioritise relevant material but must not unnecessarily hide other available resources.

### Administrator
Can create, edit, publish/unpublish, and remove supported content through a separate admin experience. Administrators are responsible for publishing announcements. Backend authorisation must protect all administrative actions; hiding a UI control is not security.

## 3. Page and navigation inventory
This is the initial page inventory for UI planning. The designer may recommend combining closely related screens, but must not omit a core user journey without explaining why.

### Public pages
- Public Home / landing page
- Explore Resources
- Resource Details / PDF access
- Announcements list and announcement details (can be one page plus a detail view)
- Associations directory and association details (can be one page plus a detail view)
- About D'Voice
- Meet the Founder
- Contact
- Sign in / Register (only as required by agreed account flows)

### Student pages
- Student Home / dashboard
- Explore Resources (may share the public resource interface with authenticated state)
- Resource Details / PDF access
- Reading: Recent and Saved
- Profile and basic preferences
- Announcement details and association details may reuse public page templates

### Admin pages (design after student/public flows)
- Admin overview, if it provides useful operational value
- Resource management: list, add, edit, publish/unpublish, remove
- Announcement management: list, create, edit, publish/unpublish, remove
- Association management
- Examination-date management
- Quote management
- Founder-page editor
- WhatsApp invitation editor
- Basic platform/contact information

Avoid creating a separate page for every small action if a well-designed list/detail/form flow is clearer.

## 4. Student navigation and Home
Suggested primary student navigation: **Home, Explore, Reading, Profile**.

Home is an overview, not the complete catalogue. Use only sections supported by available content. Suggested order:
1. Continue Reading (only when history exists)
2. Recommended / faculty-relevant resources
3. Announcements and Updates
4. Browse or discover resources
5. Student associations
6. Upcoming examination dates (only when valid dates exist)
7. Daily Quote (only when configured)
8. Optional D'Voice community invitation

The community invitation must not overwhelm the academic content. The founder page should be discoverable but should not dominate the student dashboard.

## 5. Academic resources and PDF metadata
Most resources are expected to be PDFs. The UI should make it easy to identify a resource, understand whether it is relevant, and open the file.

### Proposed resource fields
Use these as a starting model, not a requirement to display every field on every card:
- **Required for a published resource:** title, PDF/file reference, publication status.
- **Useful when applicable:** course code, course title, faculty, department, level, semester/session, resource category/type, short description, academic year/date, tags, source/uploader, and upload date.
- **Optional:** thumbnail/cover image if available; do not require one for a PDF.

For MVP personalisation, faculty is the only confirmed student profile attribute. Resource faculty/department/course metadata may be absent or inapplicable for some materials, so the UI must tolerate missing optional fields.

The product owner should confirm the minimum metadata needed for accurate discovery. The UI designer decides how to present that metadata (card, detail page, filter, or secondary information) and should avoid making irrelevant fields visually prominent. The resource upload form should not force fields that do not apply to the material.

### Explore/search
- Search by title and available fields such as course code/title, topic, faculty, department, or tags.
- Offer only filters supported by real metadata. Faculty and resource type are likely useful starting filters.
- Show active filters and allow clearing them.
- Use pagination or incremental loading; do not require downloading the whole catalogue.
- Distinguish loading, genuinely empty catalogue, no matching results, and request failure.

### Resource details and PDF access
- Present the title and available metadata clearly, with a primary action to open the PDF.
- Prefer native browser PDF viewing for the MVP; do not design a custom reader unless there is a demonstrated need.
- Handle missing, removed, or unavailable files with a clear message and recovery path.
- Do not claim a file opened successfully based solely on the user pressing the button.

### Reading
Provide Recent and Saved views. Reading history can back Recent; do not duplicate stored data without a reason. Saving and removing saved resources must behave predictably and require authentication when associated with a student account.

## 6. Announcements, dates, quotes, and associations
- **Announcements:** Administrators create and publish them. Show title, summary, date, and source/authority where relevant. Distinguish official announcements from general news. Do not add a student publishing flow for announcements in the MVP.
- **Examination dates:** Display only dates supplied and maintained by an authorised administrator. Handle missing dates honestly.
- **Daily quote:** Show only configured content, with accurate attribution when available. Do not fabricate a quote to fill space.
- **Associations:** Explain what each association does and show available contact or membership information. Indigenous groups are deferred until the list and use case are provided.

## 7. Personalisation and profile
Collect only what is needed. For MVP personalisation, use the student's faculty. Do not block access to other resources based on faculty. Do not include indigenous-group selection until the required list is available and its purpose is confirmed. Keep profile and preferences simple.

## 8. Meet the Founder
Create a public page introducing the person who initiated D'Voice. Its purpose is to explain who started the project, why, and what they hope it will contribute. The page should remain appropriate if the founder's political circumstances change.

Suggested editable fields:
- Display name
- Portrait/photo (optional)
- Short introduction
- Motivation for starting D'Voice
- Vision for the project
- Relevant background/experience (verified only)
- Founder message
- Optional public links/contact details
- Visibility/published state

Initial design may use clearly marked placeholder content. Do not invent credentials or imply FUTA endorsement unless confirmed.

### Administrator control
An authorised administrator must be able to edit every displayed field, add/replace/remove the image, update links, and publish/unpublish the page without changing source code or redeploying the app. Keep editable content in data/configuration, not hardcoded into the page. Validate input and enforce permission on the backend.

## 9. WhatsApp community invitation
Design an optional, clear invitation explaining a genuine reason a student might join. For UI design, use this **provisional concept**: a community for relevant D'Voice updates, useful student opportunities, academic discussion/quizzes, and connecting motivated students. This is not a confirmed service commitment; before launch, the founder must confirm which activities will actually be maintained and how the group will be moderated.

Requirements:
- Explain the value before showing the Join WhatsApp Community action.
- Joining is optional and never required to access resources or use D'Voice.
- Make invitation text, approved invite URL, and visibility editable by an authorised administrator.
- If the link is missing or expired, do not show a broken action or invent a link.
- Do not use intrusive prompts or interrupt core academic tasks.
- Keep the community's personal/founder affiliation distinct from official academic announcements where relevant.

## 10. Administration
Design admin screens from the fields and actions required by the public/student experience. The MVP needs management for:
- Academic resources
- Announcements
- Associations
- Examination dates
- Daily quotes
- Founder-page content
- WhatsApp invitation text, URL, and visibility
- Basic platform/contact information

Use clear list, form, and preview/publishing states. Support create/edit/publish/unpublish/remove where appropriate, with validation and success/error feedback. Only authorised administrators may publish announcements or change platform content.

## 11. Interface and quality requirements
- Mobile-first and responsive; desktop should also be usable.
- Clear hierarchy, readable type, accessible labels, and practical touch targets.
- Consistent components for the same content types across pages.
- Clear loading, empty, no-results, error, unavailable, and authentication-required states where relevant.
- UI should work with mock data before backend integration.
- Do not fabricate content, dates, popularity, credentials, or endorsements.
- Protect student information and enforce authorisation on the server.

## 12. Explicit MVP exclusions
- Multi-tenancy and institution switching
- Indigenous-group personalisation until the list/use case is supplied
- Advanced AI recommendations
- Custom PDF reader by default
- Mandatory WhatsApp membership
- Campaign features disguised as academic functionality
- Student-published official announcements
- Features without a defined user need

## 13. Assumptions to validate before public launch (not blockers for UI design)
- Founder biography, image, message, and links must be supplied/approved; use marked placeholders in mockups.
- The WhatsApp group's actual purpose, moderation, and promises must be confirmed; use provisional copy for design only.
- Resource metadata should be adjusted after reviewing actual sample PDFs and how students identify them.
- The approved WhatsApp invite URL must be supplied before the Join action is activated.
