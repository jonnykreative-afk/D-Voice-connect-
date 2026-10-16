# AUTH — Design Brief

**Product:** D'voice
**Surface:** Sign-in / sign-up
**Platform:** Mobile-first web
**Status:** Ready for design

---

## 1. Purpose

Get the student in with the least friction, and land them where they
intended to go.

Auth exists to enable genuinely personal features — saving resources,
My Library, faculty/level scoping. It is not a gate in front of the
product.

---

## 2. Structure

**One page, with a sign-in / sign-up toggle.**

The fields overlap heavily, and students often do not know which one
they need. Splitting into two pages doubles the surface for no gain.

---

## 3. Sign-up fields

Only what Profile already declared:
- Name
- Email
- Password
- Faculty
- Level

Nothing else. No phone number, no department, no matric number, no
photo. Collect only what a feature reads.

---

## 4. Sign-in fields

- Email
- Password

Plus a password-reset path.

---

## 5. Post-auth landing

**Land on the destination the student was trying to reach** — My
Library, Profile, or the save action that triggered the prompt.

Only land on Home if there was no prior intent.

Preserve intent. Do not dump every student on Home.

---

## 6. States

- **Loading:** submit button shows progress; form stays visible.
- **Validation errors:** inline, per field, clear.
- **Wrong credentials:** clear message, no blame, retry easy.
- **Account exists on sign-up:** route to sign-in with email preserved.
- **Network error:** message + retry. No dead end.
- **Password reset:** request + confirmation states.

---

## 7. Accessibility floor

- Real form labels, not placeholder-only.
- Errors announced to screen readers and tied to their fields.
- Tap targets ≥ 44px.
- Keyboard-submittable.
- Password visibility toggle.

---

## 8. Larger screens

Constrained-width single column, centred. Does not stretch.

---

## 9. Visual direction

- Blueish, modern. Not the generic AI-app blue.
- One secondary colour carrying semantic load.
- No glow.
- Quiet and unfussy. Auth is not a showcase.

---

## 10. Out of scope

- Social login (post-MVP unless you decide otherwise).
- Two-factor authentication.
- Email verification flow.
- Phone number collection.
- Profile photo.

---

## 11. Decisions already made (do not relitigate)

- One page with a sign-in / sign-up toggle.
- Sign-up collects name, email, password, faculty, level only.
- Post-auth lands on intended destination, not Home.
- Auth is not a gate in front of browsing or downloading.
- Collect only what a feature reads.