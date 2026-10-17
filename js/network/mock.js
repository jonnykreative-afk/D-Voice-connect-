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
    dateAdded: new Date(Date.now() - 30 * 86_400_000).toISOString(),
  },
  {
    id: 'r4',
    title: 'Slide deck — eigenvalues and eigenvectors',
    courseCode: 'MTH 201',
    courseTitle: 'Mathematical Methods I',
    contentType: 'slide',
    fileFormat: 'pptx',
    dateAdded: new Date(Date.now() - 45 * 86_400_000).toISOString(),
    downloadCount: 12,
  },
];

/* --- fixtures for state testing --- */

export function setFixture(mode) {
  window.__fixture = mode;
}

export async function getResources({ query, page = 1 } = {}) {
  const mode = window.__fixture;

  if (mode === 'loading') return new Promise(() => {}); // never resolves
  if (mode === 'error')   { await delay(null); throw new Error('Network error'); }
  if (mode === 'empty')   return delay([]);

  let items = RESOURCES;
  if (mode === 'thin') items = RESOURCES.slice(0, 2);

  if (query) {
    const q = query.toLowerCase();
    items = items.filter((r) =>
      r.title.toLowerCase().includes(q) ||
      r.courseCode.toLowerCase().includes(q) ||
      r.courseTitle.toLowerCase().includes(q)
    );
  }

  return delay(items);
}