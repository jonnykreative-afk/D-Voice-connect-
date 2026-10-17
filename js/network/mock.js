/* =========================================================
   network/mock.js — in-memory fake API
   Real network files will replace this module wholesale.
   ========================================================= */

const LATENCY_MS = 500;

function delay(value, ms = LATENCY_MS) {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

const RESOURCES = [
  {
    id: 'r1',
    title: 'MTH 201 Past Questions — 2020 to 2024 compilation',
    courseCode: 'MTH 201',
    courseTitle: 'Mathematical Methods I',
    contentType: 'past-question',
    fileFormat: 'pdf',
    contributor: 'Damilare O.',
    faculty: 'science',
    level: '200',
    dateAdded: new Date(Date.now() - 2 * 86_400_000).toISOString(),
    downloadCount: 412,
  },
  {
    id: 'r2',
    title: 'Linear algebra — full lecture notes',
    courseCode: 'MTH 201',
    courseTitle: 'Mathematical Methods I',
    contentType: 'lecture-note',
    fileFormat: 'pdf',
    contributor: 'Faculty of Science',
    faculty: 'science',
    level: '200',
    dateAdded: new Date(Date.now() - 10 * 86_400_000).toISOString(),
    downloadCount: 87,
  },
  {
    id: 'r3',
    title: 'Vectors and matrices — summary study guide',
    courseCode: 'MTH 201',
    courseTitle: 'Mathematical Methods I',
    contentType: 'summary',
    fileFormat: 'pdf',
    contributor: 'Bisi A.',
    faculty: 'science',
    level: '200',
    dateAdded: new Date(Date.now() - 30 * 86_400_000).toISOString(),
  },
  {
    id: 'r4',
    title: 'Slide deck — eigenvalues and eigenvectors',
    courseCode: 'MTH 201',
    courseTitle: 'Mathematical Methods I',
    contentType: 'slide',
    fileFormat: 'pptx',
    faculty: 'science',
    level: '200',
    dateAdded: new Date(Date.now() - 45 * 86_400_000).toISOString(),
    downloadCount: 12,
  },
];

/* --- fixtures for state testing --- */

export function setFixture(mode) {
  window.__fixture = mode;
}

export async function getResources({ query, filters, page = 1 } = {}) {
  const mode = window.__fixture;

  if (mode === 'loading') return new Promise(() => {});
  if (mode === 'error')   { await delay(null); throw new Error('Network error'); }
  if (mode === 'empty')   return delay([]);

  let items = RESOURCES;
  if (mode === 'thin') items = RESOURCES.slice(0, 2);

  if (query) {
    const q = query.toLowerCase();
    items = items.filter((r) =>
      r.title.toLowerCase().includes(q) ||
      r.courseCode.toLowerCase().includes(q) ||
      r.courseTitle.toLowerCase().includes(q) ||
      (r.contributor || '').toLowerCase().includes(q)
    );
  }

  if (filters) {
    const check = (set, key) =>
      !set || set.size === 0 || set.has(key);

    items = items.filter((r) =>
      check(filters.faculty,     r.faculty) &&
      check(filters.level,       r.level) &&
      check(filters.contentType, r.contentType) &&
      check(filters.format,      r.fileFormat)
    );
  }

  return delay(items);
}
/* ---------- Filter vocabulary ---------- */

export const FILTERS = {
  faculty: [
    { value: 'science',    label: 'Science' },
    { value: 'arts',       label: 'Arts' },
    { value: 'engineering',label: 'Engineering' },
    { value: 'law',        label: 'Law' },
    { value: 'medicine',   label: 'Medicine' },
  ],
  level: [
    { value: '100', label: '100L' },
    { value: '200', label: '200L' },
    { value: '300', label: '300L' },
    { value: '400', label: '400L' },
    { value: '500', label: '500L' },
  ],
  contentType: [
    { value: 'past-question', label: 'Past question' },
    { value: 'lecture-note',  label: 'Lecture note' },
    { value: 'summary',       label: 'Summary' },
    { value: 'textbook',      label: 'Textbook' },
    { value: 'slide',         label: 'Slides' },
  ],
  format: [
    { value: 'pdf',  label: 'PDF' },
    { value: 'docx', label: 'DOCX' },
    { value: 'pptx', label: 'PPTX' },
  ],
};

export function getFilterOptions() {
  return delay(FILTERS, 100);
}

/* ---------- Home ---------- */

export const FEATURED = []; // Empty by design — Home ships with Featured off.

const NEWS = [
  {
    id: 'n1',
    headline: 'Second semester exam timetable released',
    excerpt: 'Exams begin Monday, 3 March. Check your faculty board for the full schedule.',
    date: new Date(Date.now() - 1 * 86_400_000).toISOString(),
    image: null,
  },
  {
    id: 'n2',
    headline: 'MTH 201 lecture moved to LT 4',
    excerpt: 'Wednesday lectures are now in Lecture Theatre 4, effective this week.',
    date: new Date(Date.now() - 4 * 86_400_000).toISOString(),
    image: null,
  },
];

export const FACULTIES = FILTERS.faculty; // [{ value, label }]

export async function getHomeGreeting() {
  return delay({ name: 'Student' }, 50);
}

export async function getFeatured() {
  return delay(FEATURED);
}

export async function getRecentlyAdded({ faculty, level, limit = 8 } = {}) {
  let items = RESOURCES.filter((r) =>
    (!faculty || r.faculty === faculty) &&
    (!level   || r.level === level)
  );
  // Scope-to-context fallback: if nothing matches the student's
  // faculty+level, fall back to faculty-only, then to all. Keeps the
  // strip alive in a thin catalogue.
  if (items.length === 0 && faculty) {
    items = RESOURCES.filter((r) => r.faculty === faculty);
  }
  if (items.length === 0) items = RESOURCES;

  return delay(items.slice(0, limit));
}

export async function getNewsPreview(limit = 3) {
  return delay(NEWS.slice(0, limit));
}

/* ---------- Library ---------- */

let SAVED_IDS = new Set(['r1', 'r3']);

export async function getSavedResources() {
  const items = RESOURCES.filter((r) => SAVED_IDS.has(r.id));
  return delay(items);
}

export async function saveResource(id) {
  SAVED_IDS.add(id);
  return delay({ ok: true });
}

export async function unsaveResource(id) {
  SAVED_IDS.delete(id);
  return delay({ ok: true });
}

/* ---------- Profile ---------- */

let PROFILE = {
  name: 'Student',
  email: 'student@example.com',
  faculty: 'science',
  level: '200',
};

export async function getProfile() {
  return delay(PROFILE);
}

export async function updateProfile(patch) {
  PROFILE = { ...PROFILE, ...patch };
  return delay(PROFILE);
}