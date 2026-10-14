# D'Voice — Product Brief

## What it is
D'Voice is a mobile-first student utility platform for FUTA. It brings academic PDFs, useful campus updates, examination information, and student associations into one place so students can find and revisit information more easily.

## Primary users
- **Visitors:** Explore public resources and information without being forced to register.
- **Students:** Search resources, open PDFs, save materials, revisit recent reading, and find relevant updates.
- **Administrators:** Maintain published content and public-facing information.

## MVP priorities
1. Discover and search academic resources, mostly PDFs.
2. View a resource's details and open its PDF when available.
3. Save resources and revisit recent reading.
4. Read announcements and relevant news.
5. Browse associations and available contact information.
6. Show examination dates and a daily quote when valid content exists.
7. Explain D'Voice and introduce its founder.
8. Offer an optional WhatsApp community invitation with a clear, honest reason to join.
9. Let authorised administrators manage all MVP content, including every displayed founder detail and the community invitation.

## Product boundaries
- Initial deployment: **FUTA only**. Do not build multi-tenancy, institution switching, or cross-institution data isolation.
- Academic utility is the primary purpose and must remain useful regardless of election outcomes or a student's political interests.
- WhatsApp membership is optional and never gates access to academic features.
- Student personalisation for the MVP uses **faculty only**. Do not add indigenous groups until the required list and use cases are provided.
- Administrators publish announcements. The interface should clearly identify official announcements and their publication date/source where appropriate.
- The product/UI designer determines how information is presented. The product owner confirms what information is needed; metadata should help students identify and choose useful resources, not become a long mandatory form.
- Never invent resources, dates, quotes, credentials, official endorsements, or benefits that the community does not actually provide.

## WhatsApp community — working assumption
For initial design only, treat it as an optional community for D'Voice updates, useful student opportunities, academic discussion, quizzes, and connecting motivated students. This is a **proposed value proposition**, not a confirmed promise. Make the invitation copy, link, and visibility editable by an administrator; confirm the actual purpose and moderation arrangements before launch.

## Founder information — working assumption
Design a public “Meet the Founder” page using placeholder/example content clearly marked for replacement. An authorised administrator must be able to edit every displayed field and publish/unpublish the page without code changes. Do not imply FUTA endorsement unless confirmed.

## Success signals
- Students can find relevant resources and open available PDFs.
- Students can save and revisit resources.
- Students can understand and find current announcements and association information.
- Core academic functions work without joining WhatsApp or engaging with the founder.
- Administrators can maintain the content without changing application code.
- Empty, loading, failed, and unavailable states are understandable.

## Not in the MVP
Multi-tenancy, institution switching, advanced AI recommendations, mandatory community membership, campaign functionality disguised as academic functionality, and features without a clear student need.
