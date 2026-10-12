D'VOICE

Product Specification and MVP Design Brief

Document purpose: Establish the product vision, functional requirements, information architecture, user journeys, interface requirements, and implementation boundaries for the first version of D'Voice.

Primary audience: Students.

Initial institutional context: FUTA, with an architecture that can support additional institutions and independently managed deployments.

Initial product scope: Academic resource discovery, reading access, student information, campus communities, and relevant updates.

Design direction: Mobile-first, dark interface, blue accent palette, accessible typography, clear information hierarchy, and minimal unnecessary interaction.

---

1. Product Definition

1.1 Product vision

D'Voice is a student-focused digital platform that brings academic resources, relevant news, campus information, and student communities into one accessible experience.

It helps students find educational materials, return to previously opened resources, discover relevant organisations, and stay informed about information that matters to them.

The first version should deliver these functions without requiring students to navigate multiple disconnected websites or communities.

1.2 Core problem

Students often need to find academic materials, course resources, examination information, and relevant campus updates from different sources.

The availability, organisation, and discoverability of these resources may vary.

D'Voice aims to provide a more organised experience by bringing available resources together and presenting relevant information according to the student's institution, faculty, and interests.

The product must not assume that every desired resource or information source will be available at launch.

Its usefulness should improve as the quality and quantity of its content increase.

1.3 Product objectives

The MVP should:

1. Make academic materials easy to discover.
2. Reduce the effort required to locate relevant resources.
3. Allow students to revisit materials they have opened.
4. Personalise selected content using institutional and academic context.
5. Provide a central place for relevant news and announcements.
6. Help students discover relevant campus associations and communities.
7. Give administrators a practical way to manage the platform's content.
8. Support future expansion to additional institutions without requiring a complete redesign.

1.4 Product success principles

The product should be evaluated by whether students can successfully use it, not by how many sections appear on the Home page.

Important indicators include:

- Time and effort required to find a relevant resource.
- Percentage of searches that lead to a useful resource.
- Successful PDF openings.
- Repeat use of recently opened materials.
- Return visits.
- Engagement with relevant news and associations.
- Content freshness and availability.
- Administrative effort required to maintain accurate content.

These indicators should inform later measurement. The MVP does not need an elaborate analytics platform.

---

2. Product Principles

All product and interface decisions should follow these principles.

2.1 Utility before decoration

Every major component should serve a defined student need.

Avoid adding sections simply to make the interface look full.

2.2 Discovery and search are different experiences

Home should surface selected, potentially useful content.

Explore should help students deliberately find something.

Do not make Home a complete catalogue or turn Explore into another recommendation feed.

2.3 Personalisation without unnecessary restrictions

A student's faculty and activity can influence recommendations.

They should not prevent the student from accessing otherwise available resources.

2.4 Progressive disclosure

Present essential information first.

Detailed information, secondary actions, and complete listings should be available when needed without overwhelming the main interface.

2.5 Functional consistency

The same material, association, or news item should retain a recognisable visual structure wherever it appears.

A resource card on Home and a resource card on Explore may have different layouts or information density, but they should feel like representations of the same underlying content.

2.6 Honest interface states

The interface must distinguish between:

- Content that is loading.
- Content that is available.
- A genuinely empty collection.
- A failed request.
- Unavailable or removed content.
- Content that requires authentication.

Never display an empty page when the actual problem is a failed request.

2.7 Institutional identity without institutional dependence

D'Voice should remain recognisable as a product while allowing the institution or administrator responsible for a particular deployment to be identified.

The platform should not require a redesign whenever another institution adopts it.

---

3. Users and Permissions

The MVP has three principal user roles.

3.1 Visitor

A visitor has not signed in.

Visitors should be able to understand what D'Voice offers and explore the publicly available content.

Depending on the content and administrator's configuration, visitors may be able to:

- Browse public academic resources.
- Search available materials.
- Read public news.
- View public association information.
- Read About and Contact information.
- Open publicly accessible PDFs.
- Access the official community link.

Do not require registration merely to generate account numbers or increase signups.

Registration should be requested when an action genuinely requires an account.

3.2 Student

A student has an authenticated account associated with an institution.

Students can:

- Access the student dashboard.
- Receive faculty-relevant recommendations.
- Search all resources they are permitted to access.
- Open PDFs.
- View recently opened resources.
- Save resources for later.
- View their profile.
- Manage basic preferences.
- Access relevant institutional information.

The initial account model should remain simple.

Avoid adding unnecessary student verification, complicated onboarding, or elaborate permission systems until a concrete requirement justifies them.

3.3 Administrator

An administrator manages content for an institution or a configured D'Voice deployment.

Administrators need to manage:

- Academic materials.
- News and announcements.
- Quotes.
- Associations.
- Examination dates.
- Institutional information.
- Relevant external links.

The administrative interface should be designed for efficient content management rather than student-facing visual presentation.

It may use a different navigation structure from the student dashboard.

Administrative permissions must be enforced by the backend in the production implementation. Hiding an administrative button in the frontend is not access control.

---

4. Multi-Institution Architecture

D'Voice must support the possibility of serving multiple institutions.

This requirement affects onboarding, content organisation, permissions, configuration, and future infrastructure.

4.1 Institutional context

Every account must be associated with an institution or a clearly defined deployment context.

The interface should identify the institution the student is using.

The student's faculty selection belongs to that institutional context.

A faculty from one institution must not automatically be treated as equivalent to a similarly named faculty at another institution.

4.2 Content ownership

Institution-specific content should be associated with its owning institution.

Examples include:

- Academic materials.
- Examination dates.
- Campus announcements.
- Association listings.
- Institutional contact details.
- Campus maps and relevant links.

Where appropriate, administrators may also publish content that is available across multiple institutions.

The data model must distinguish institution-specific content from genuinely shared content.

4.3 Administrator isolation

Administrators should manage only the institutions and content they are authorised to manage.

The product architecture must not assume that every administrator is entitled to access every student's information or modify every institution's content.

4.4 Deployment configuration

Institution-specific differences should be handled through configuration and data wherever practical.

Potential configuration fields include:

- Institution name.
- Logo.
- Brand accent settings.
- Available faculties.
- Campus information.
- Community links.
- Examination calendar settings.
- Enabled content sections.

Do not create separate copies of the application for different institutions unless a genuine deployment requirement makes that necessary.

MVP boundary: The product should be designed around institutional separation, but the initial implementation only needs the institution-management functionality required for the first deployment and a credible expansion path.

---

5. Information Architecture

5.1 Public-facing structure

The public experience should contain:

1. Public Home.
2. Explore.
3. Resource details or PDF access.
4. News details.
5. Association listings and details.
6. About D'Voice.
7. Contact information.
8. Sign-in and registration.

These pages do not all need equal prominence.

The public Home page introduces the platform and provides useful entry points into the available content.

5.2 Student dashboard

The primary dashboard contains four main navigation tabs:

1. Home.
2. Explore.
3. Reading.
4. Profile.

Use a mobile-first navigation system with clear active states.

On larger screens, the same information architecture may be adapted to a sidebar or wider navigation layout, but do not create a fundamentally different product for desktop.

5.3 Administrative area

The administrator needs a separate management experience.

Proposed sections:

- Overview.
- Academic Materials.
- News.
- Associations.
- Daily Quotes.
- Examination Dates.
- Institution Settings.

These can be grouped or simplified depending on the actual number of administrative tasks.

Do not force administrators to use the student dashboard to perform management operations.

---

6. Student Dashboard: Home

6.1 Purpose

Home is a personalised overview of the most useful content available to the student.

It should help the student decide what to read, what to revisit, and what deserves attention.

It must not attempt to display the entire platform.

6.2 Header

The header should contain:

- D'Voice identity or logo.
- A greeting or compact contextual introduction.
- A profile or account shortcut.
- Access to the main navigation where appropriate.

A secondary navigation menu may provide access to:

- About D'Voice.
- Campus information.
- Campus map.
- Official WhatsApp community.
- Contact and support.

Do not put every secondary destination directly into the main dashboard navigation.

The header must remain usable on narrow mobile screens.

6.3 Proposed content sections

A. Continue Reading

Purpose: Help students return to recently opened materials.

Display a small selection of recent resources.

Each item should provide enough information to identify the material and reopen it.

Include an appropriate empty state for students who have not opened any materials.

Do not display this section as though reading history exists when it does not.

B. Recommended for You

Purpose: Surface potentially relevant academic resources.

Recommendations may use:

- Faculty.
- Explicit interests, if collected.
- Reading history.
- Saved resources.
- Resource freshness.
- Availability and relevance.

The initial recommendation system can use simple deterministic rules.

Do not claim that recommendations are personalised using sophisticated intelligence when the system is only matching faculty and recent activity.

Provide a path to the full resource listing.

C. News and Updates

Purpose: Make relevant information visible without requiring students to search for it.

Show a limited number of recent items.

Each item should communicate:

- Headline.
- Brief summary.
- Publication date.
- Source or publisher where relevant.
- A clear action to read more.

Distinguish news from official announcements when their source or authority differs.

Do not present unverified user submissions as official institutional announcements.

D. Explore Your Faculty

Purpose: Provide a convenient entry point to academic resources relevant to the student's faculty.

This section should help students discover available material, not merely display the faculty name.

Where useful, show the number or type of resources available.

If a faculty has no relevant resources yet, provide a useful alternative instead of an empty decorative card.

E. Indigenous Associations

Purpose: Help students discover relevant organisations.

Display a small selection of associations.

Each preview should include:

- Association name.
- Logo or appropriate fallback.
- Brief description.
- Category, where useful.
- A way to view details.

Provide a route to the complete association directory.

The term "indigenous associations" must be defined with the project owner before finalising categories.

F. Exam Countdown

Purpose: Make an upcoming examination date easy to notice.

Display the next relevant examination date and the remaining time.

The countdown must be calculated from a real, configured date.

If no examination date is available, hide the countdown or provide an honest empty state.

Never invent a date simply to fill the component.

G. Daily Quote

Purpose: Provide a small daily engagement feature.

Display a selected quote and its attribution where available.

The selected quote should remain stable for the intended daily period.

If no quote has been configured, do not display fabricated content.

H. D'Voice Community

Purpose: Help interested students discover the official WhatsApp community.

Use a compact invitation explaining its purpose.

Provide a direct link to join.

Joining must remain optional and must not be a prerequisite for using academic features.

6.4 Home prioritisation

The final section order should depend on content availability and observed usefulness.

For the initial design, use this hierarchy:

1. Continue Reading, when reading history exists.
2. Recommended academic resources.
3. News and Updates.
4. Faculty-specific discovery.
5. Indigenous Associations.
6. Exam Countdown.
7. Daily Quote.
8. D'Voice Community.

The first two sections should not become large if the student has no reading history or relevant recommendations.

The page should gracefully accommodate new accounts and institutions with limited content.

Do not treat this initial order as permanently fixed.

---

7. Explore

7.1 Purpose

Explore is the primary destination for deliberate academic resource discovery.

It should answer:

"What material am I looking for, and how can I find it?"

7.2 Search

Provide a clearly visible search field.

Search should support the fields available in the resource catalogue, such as:

- Material title.
- Course code.
- Course title.
- Topic.
- Faculty.
- Department, when recorded.

Search should tolerate ordinary differences in capitalisation and surrounding whitespace.

The interface should communicate what users can search for.

Typing should not trigger an unnecessarily expensive request on every keystroke.

The frontend should be designed to support debounced search and a future paginated API.

7.3 Filters

Initial filters should include:

- Faculty.
- Resource type.
- Course or department, where relevant metadata exists.

Additional filters may be introduced when there is sufficient content to make them useful.

Filters must not imply that all resources are restricted to the student's selected faculty.

Provide a clear way to remove individual filters and reset the active filter set.

On mobile, filters may appear in a collapsible panel or bottom sheet.

The chosen design must preserve a clear relationship between active filters and displayed results.

7.4 Resource listings

Display a browsable collection of available resources.

Resource cards should prioritise identification and selection over decorative information.

Possible card content:

- Material title.
- Course code or subject.
- Faculty or department.
- Resource type.
- File format.
- Relevant date or author, where available.

Avoid adding multiple metadata lines when they do not help students decide what to open.

Use a consistent visual system across the application.

7.5 Sorting

Provide a sensible default ordering, such as recently added resources.

If resource quality, popularity, or verified status can be established reliably, additional sorting may be considered.

Do not invent download counts, ratings, or popularity scores.

7.6 Pagination and loading

The interface must support a growing resource catalogue.

Use pagination or another deliberate incremental-loading strategy.

Avoid downloading the entire resource database just because the student can keep scrolling.

The design must include a loading state and a way to access additional results.

If more results are unavailable, communicate that clearly without leaving a broken loading indicator.

7.7 Empty and error states

Distinguish between:

- No resources exist yet.
- No results match the search.
- Active filters are too restrictive.
- The resource request failed.
- Results are still loading.

For an unsuccessful search, offer a practical recovery action, such as clearing filters or adjusting the query.

---

8. Resource Details and PDF Access

8.1 Purpose

The resource-details experience helps a student understand what they are opening and access the material.

8.2 Resource information

Display available information such as:

- Title.
- Course or subject.
- Faculty.
- Department, where relevant.
- Description.
- Resource type.
- Author or uploader, where appropriate.
- Date added.
- File type.

Only display information that exists and is meaningful.

8.3 Primary actions

Provide clear actions to:

- Open the PDF.
- Save the resource.
- Return to the resource listing.

The save action should require authentication if saved resources are associated with a student account.

8.4 PDF viewing strategy

For the MVP, prefer native browser PDF viewing where practical.

The implementation must account for:

- Whether the file is accessible.
- Whether the browser can open it.
- Loading and error handling.
- Mobile usability.
- Whether the file opens in the same tab or a separate tab.
- Whether the student can return to D'Voice easily.

If the PDF is hosted on another domain, confirm the hosting and browser behaviour before assuming that D'Voice can inspect the document's current page.

A custom embedded PDF reader is outside the initial scope unless a specific requirement makes it necessary.

8.5 Resource availability

A missing file must not leave the student on a blank page.

Display a useful error message and a route back to the resource details or listing.

The application should not mark a resource as successfully opened merely because the user clicked a button.

The exact event used to record reading history should be established during implementation.

---

9. Reading

9.1 Purpose

Reading is the student's personal resource library.

It should make previously accessed and deliberately saved materials easy to retrieve.

9.2 Views

Recent

Contains materials the student has opened recently.

Each record should identify the resource and indicate when it was last opened.

Saved

Contains resources the student has explicitly bookmarked.

Saving and removing a bookmark must have clear, consistent behaviour.

History

Provides access to previously opened materials.

The implementation may reuse reading-history records rather than maintaining a separate duplicate dataset.

The distinction between Recent and History should be driven by a