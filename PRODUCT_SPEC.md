# D'Voice — Product Specification (MVP)

**Purpose:** Define the required user-facing behaviour and boundaries for the first release. Detailed implementation choices belong in the system design and code, not in this document.

## 1. Product boundary
D'Voice is a student utility platform initially serving FUTA. The MVP is a **single-institution application**, not a multi-tenant product. Do not implement tenant switching, institution-level data isolation, or cross-institution content sharing. Keep ordinary configuration and reusable code where useful, without building speculative expansion infrastructure.

## 2. Roles and permissions
### Visitor
Can browse publicly available resources, search, view public news and association information, read About/Founder/Contact pages, and see the optional WhatsApp community invitation. Authentication should only be required for actions that genuinely need a personal account.

### Student
Can use the dashboard, search permitted resources, open available PDFs, save resources, revisit recent reading, and view relevant campus information. Personalisation may prioritise faculty-relevant content but must not unnecessarily hide other available resources.

### Administrator
Can create, edit, publish/unpublish, and remove supported content through a separate management interface. The backend must enforce permissions; hiding controls in the frontend is not security.

## 3. Public information architecture
- Public Home
- Explore/resources
- Resource details and PDF access
- News and announcement details
- Association directory and details
- About D'Voice
- Meet the Founder
- Contact
- Sign in/register

Keep the founder page accessible, but do not make it dominate the academic experience.

## 4. Student dashboard
Primary navigation: **Home, Explore, Reading, Profile**.

### Home
Purpose: a compact overview, not a complete catalogue. Potential sections, ordered by usefulness and content availability:
1. Continue Reading (only when history exists)
2. Recommended academic resources
3. News and Updates
4. Faculty/resource discovery
5. Student associations
6. Upcoming examination information (only with a valid date)
7. Daily Quote (only with configured content)
8. D'Voice community invitation

The page must remain useful when some sections have no content. Avoid oversized or decorative empty sections.

### Explore
- Search by available metadata such as title, course code/title, topic, faculty, or department.
- Support useful filters such as faculty and resource type where the metadata exists.
- Show clear active filters and allow individual removal/reset.
- Use pagination or deliberate incremental loading rather than downloading the entire catalogue.
- Distinguish loading, no content, no matching results, and request failure.

### Resource details and PDF access
Show available identifying metadata and a clear action to open the file. Prefer native browser PDF viewing for the MVP. Handle missing/unavailable files clearly and provide a way back. Do not claim that a file opened successfully based only on a button click.

### Reading
Provide Recent and Saved views. Reading history may back the recent list; do not duplicate data without a reason. Saving/removing a saved resource must have predictable behaviour and require authentication where tied to a student account.

### Profile
Keep account details and basic preferences simple. Do not collect profile data without a defined use.

## 5. News, dates, quotes, and associations
- News/announcements show a headline, summary, date, source/authority where relevant, and a details action.
- Clearly distinguish official announcements from general or unverified news.
- Examination information must use real configured dates; hide or explain the absence of dates rather than inventing one.
- Quotes must have accurate attribution where available; do not fabricate content to fill a slot.
- Association listings should explain each association's purpose and show available contact or membership information.

## 6. Meet the Founder
This is a public-facing page introducing the person who initiated D'Voice. It should support the project's continuity beyond any election or political outcome.

Suggested content fields:
- Display name
- Portrait/photo (optional)
- Short introduction
- Motivation for starting D'Voice
- Vision for the project
- Relevant background/experience (only verified information)
- Founder message
- Optional public links/contact details
- Visibility/published state

The page should explain the founder's relationship to the project without implying that D'Voice is officially endorsed by FUTA or another body unless that endorsement is confirmed. Personal or political messaging must remain distinguishable from academic resources and official institutional information.

### Administrator control
Authorised administrators must be able to edit every displayed founder-page field, replace/remove the image, change links, and publish/unpublish the page without editing source code or redeploying the application. Validate input and restrict editing to authorised administrators. Keep the founder's editable content in data/configuration, not hardcoded into the page.

## 7. WhatsApp community invitation
Provide a clear, optional section or call-to-action on the public site and/or student Home. Its copy must give students a genuine reason to join, such as receiving relevant D'Voice updates, discovering useful student opportunities, or participating in a well-moderated student community—**but only promise benefits the group actually provides**.

Requirements:
- Explain what the group is for before asking users to join.
- Include a clear Join WhatsApp Community action linking to the current approved invite URL.
- State that joining is optional and is not required to use D'Voice.
- Do not imply that membership is required for academic resources or privileged platform access.
- Make the invitation text, destination URL, and visibility editable by an authorised administrator.
- If the invite URL is missing or expired, hide the broken action or show a clear fallback; never invent a link.
- Avoid repeated intrusive prompts or obstructing core tasks.

## 8. Administration
The admin area is a separate management experience. For the MVP, include only the content-management screens needed by the student/public journeys:
- Academic resources
- News and announcements
- Associations
- Examination dates
- Daily quotes
- Founder page
- WhatsApp community invitation/settings
- Basic platform/contact information

Prioritise management functions after the corresponding user-facing experience and data requirements are understood. Admin functionality must support create/edit/publish/unpublish/delete where appropriate and provide validation and clear success/error feedback.

## 9. Interface and quality requirements
- Mobile-first and responsive.
- Consistent navigation and reusable visual patterns.
- Clear loading, success, empty, error, unavailable, and authentication-required states where applicable.
- Accessible labels, readable typography, and usable touch targets.
- No fake data presented as real.
- Keep frontend data access behind defined API contracts so mock data can later be replaced without rebuilding the interface.
- Protect student information and enforce authorisation on the server.

## 10. MVP exclusions
- Multi-tenancy and institution switching.
- Advanced AI recommendations.
- Custom PDF reader by default.
- Mandatory community membership.
- Political campaign tools or claims of institutional endorsement without authorisation.
- Features that do not support a defined user need.

## 11. Decisions to confirm before implementation
- Which resource types and metadata will be available at launch?
- Who is authorised to publish official announcements?
- What is the actual purpose and moderation plan for the WhatsApp group?
- Which founder details and external links has the founder approved for publication?
- What student data is truly required for accounts and personalisation?
