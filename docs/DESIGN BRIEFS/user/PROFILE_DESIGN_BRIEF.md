# PROFILE — Design Brief

**Product:** D'voice
**Page:** Profile
**Platform:** Mobile-first web
**Status:** Ready for design

---

## 1. Purpose

Profile is where a signed-in student **edits the context that drives their
experience**: their faculty and level. Everything else on the page is
secondary to that.

The label is "Profile" because that is what students recognise as "the
place I change things about my account." The page is structured around
**editing context**, not displaying identity.

---

## 2. Structure

One page, inline-editable. No separate preferences sub-page.

**Editing happens on this tab.** The fields here are few enough that a
second page would be ceremony. Anything destructive may sit behind a
tap, but does not need its own page.

Sections in priority order:

### 2.1 Your context (the reason students come here)
- **Faculty** — inline editable.
- **Level** — inline editable.

These are the most important fields on the page. Level especially must be
easy to change, because it rolls over every academic session, and if
changing it is buried, students will tolerate wrong recommendations
rather than fix them.

Present these first, above everything else.

### 2.2 Account basics
- **Name** — editable.
- **Email** — read-only in MVP.
- **Sign out.**

### 2.3 Community
- WhatsApp community link and/or an About page.
- Low emphasis. At the bottom.
- Discoverable, never central. Consistent with Home's rule.

### 2.4 Destructive
- Delete account. Behind a confirmation flow. Not prominent.

---

## 3. What Profile must NOT contain

- A preview of saved resources (that is My Library).
- Activity history, stats, download counts.
- Social features, following, profile sharing.
- Profile photo (post-MVP).
- Phone number (post-MVP; collected only when an uploader-upgrade flow
  exists).
- A separate preferences page.

---

## 4. What we collect, and why

**Required at signup:**
- Name
- Email
- Faculty
- Level

**Editable after signup:** all four. (Email read-only in MVP.)

**Not collected in MVP:**
- Department
- WhatsApp number
- Profile photo
- Matric number, date of birth, gender
- Anything no feature reads

**Rule:** collect only what a feature reads. If nothing reads it, it
is not asked for.

---

## 5. States

- **Loading:** skeleton.
- **Error:** message + retry.
- **Saved confirmation:** inline, quiet, non-blocking.
- **Signed-out access:** sign-in prompt. After signing in, land on
  Profile.
- **Destructive confirmation:** for delete account only.

---

## 6. Accessibility floor

- Tap targets ≥ 44px.
- Form fields have real labels.
- Inline edit is keyboard- and screen-reader-operable.
- Saved/error states announced to screen readers.

---

## 7. Larger screens

Single column, constrained width. Form does not stretch to fill wide
screens.

---

## 8. Visual direction

- Blueish, modern. Not the generic AI-app blue.
- One secondary colour carrying semantic load.
- No glow.
- Calm and quiet. This is a utility page, not a showcase.

---

## 9. Out of scope

- Profile photo.
- Phone number collection.
- Email editing.
- Uploader upgrade flow.
- Preference toggles (notifications, theme, etc.) — none exist in MVP.
- Activity history.

---

## 10. Decisions already made (do not relitigate)

- Tab label is "Profile."
- One page, inline editing. No separate preferences page.
- Faculty and level are the priority fields, presented first.
- Email is read-only in MVP.
- Name, email, faculty, level are collected at signup.
- WhatsApp number and profile photo are not collected in MVP.
- Collect only what a feature reads.
- Signed-out users are prompted to sign in and land on Profile after.