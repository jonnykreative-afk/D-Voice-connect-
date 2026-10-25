# INDIGENOUS GROUPS — Design Brief

**Product:** D'voice
**Surface:** Indigenous groups list page
**Platform:** Mobile-first web
**Status:** Ready for design

---

## 1. Purpose

Help students find and reach indigenous student associations on campus.

Groups exist as a **directory with outbound links**, not as content
hosted inside D'voice.

---

## 2. Structure

**A list only. No detail page.**

A group's payload is a destination — a WhatsApp group, or the group's
own external landing page. A detail page whose only job is one outbound
button is a page in service of a link. The list row does the same work.

Each row contains:
- Group name
- One-line description (if provided)
- A single primary action: **Open group link** (WhatsApp or external)

If a group later has real internal content, it earns a detail page then.
Not now.

---

## 3. States

- Loading: skeleton rows.
- Empty: honest message. No placeholder groups.
- Error: message + retry.
- Missing description: row collapses gracefully; does not look broken.

---

## 4. Relationship to Home

If indigenous groups appear on Home at all in MVP, it is a single quiet
link to this list — not a preview block. Baseline already says assess
this against available content. The list page is the safe home for it.

---

## 5. Visual direction

- Blueish, modern. Not the generic AI-app blue.
- One secondary colour carrying semantic load.
- No glow.
- Utilitarian. This is a directory.

---

## 6. Out of scope

- Group detail pages.
- In-app group feeds or chat.
- Membership management.
- Events.
- Search or filtering.

---

## 7. Decisions already made (do not relitigate)

- List only. No detail page.
- Each group links out (WhatsApp or external).
- A detail page is only justified later if a group hosts real content
  inside D'voice.
- On Home, at most one quiet link.