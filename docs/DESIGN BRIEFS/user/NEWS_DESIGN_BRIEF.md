# NEWS — Design Brief

**Product:** D'voice
**Surfaces:**
  1. News list page
  2. News detail page
**Platform:** Mobile-first web
**Status:** Ready for design

---

## 1. Purpose

News is supporting content. It keeps students informed about campus
matters relevant to them and gives them a reason to return beyond
resource discovery.

It must never outrank resources in prominence, anywhere.

---

## 2. News list page

- Full archive of news items, newest first.
- Each item is a card, same visual family as the news cards on Home.
- Card content: **image (if present)**, headline, short excerpt, date.
- Tapping a card opens the news detail page.
- No filters, no search in MVP — news volume does not justify them yet.
- Pagination: same pattern as Explore (infinite scroll with a visible
  load-more fallback).

### States
- Loading: skeleton cards.
- Empty: honest message. No fake items.
- Error: message + retry.

---

## 3. News detail page

- Full article.
- **Some items have an image; some do not.** Layout must work both
  ways without looking broken when the image is absent.
- Content order: headline → date → image (if present) → body.
- Back affordance to the list.
- No comments, no reactions, no sharing controls in MVP.

### States
- Loading: skeleton.
- Not found: honest message + link to the news list.
- Error: message + retry.

---

## 4. Relationship to Home

Home shows 2–3 news items and a link to the news list. Home's news block
is a preview, never the archive. The list page is what "see all" points
to.

---

## 5. Visual direction

- Blueish, modern. Not the generic AI-app blue.
- One secondary colour carrying semantic load.
- No glow.
- Lighter and less dense than resource surfaces. News is secondary and
  should look it.

---

## 6. Out of scope

- Comments, reactions, sharing.
- Categories, tags, filtering.
- Author pages.
- Related-article recommendations.
- Search within news.

---

## 7. Decisions already made (do not relitigate)

- News has a list page and a detail page.
- Cards reuse Home's news card visual language.
- Some items have images, some do not. Layout handles both.
- News never outranks resources.
- No filters, search, or social features in MVP.