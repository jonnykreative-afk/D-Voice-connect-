// js/network/explore.mock.js
import { mockFetch } from './api.js';

// The full catalogue. Home's mock returns *curated subsets* of this;
// Explore returns the whole thing.
const CATALOGUE = [
  { id: 1,  code: 'MTH 101', title: 'Elementary Mathematics',        type: 'past-question', faculty: 'Science',   level: '100', session: '2022/2023' },
  { id: 2,  code: 'CSC 201', title: 'Introduction to Programming',    type: 'lecture-note',  faculty: 'Computing', level: '200', session: '2023/2024' },
  { id: 3,  code: 'PHY 101', title: 'Mechanics',                      type: 'past-question', faculty: 'Science',   level: '100', session: '2021/2022' },
  { id: 4,  code: 'CHM 101', title: 'General Chemistry',              type: 'past-question', faculty: 'Science',   level: '100', session: '2022/2023' },
  { id: 5,  code: 'BIO 101', title: 'General Biology',                type: 'lecture-note',  faculty: 'Science',   level: '100', session: '2022/2023' },
  { id: 6,  code: 'MTH 102', title: 'Elementary Mathematics II',      type: 'past-question', faculty: 'Science',   level: '100', session: '2022/2023' },
  { id: 7,  code: 'CSC 101', title: 'Computer Science I',             type: 'past-question', faculty: 'Computing', level: '100', session: '2022/2023' },
  { id: 8,  code: 'ENG 101', title: 'Engineering Drawing',            type: 'handout',       faculty: 'Engineering', level: '100', session: '2023/2024' },
  { id: 9,  code: 'STA 101', title: 'Descriptive Statistics',         type: 'textbook',      faculty: 'Science',   level: '100', session: '2023/2024' }
];

/**
 * Fetch catalogue with optional query + filters.
 * The orchestrator never passes a "types" array of internal codes —
 * it passes what the UI cares about; this function owns the mapping.
 *
 * @param {{ q?: string, type?: string }} params
 */
export function fetchCatalogue({ q = '', type = 'all' } = {}) {
  return mockFetch(() => {
    const needle = q.trim().toLowerCase();

    return CATALOGUE.filter(item => {
      if (type !== 'all' && item.type !== type) return false;
      if (!needle) return true;
      return (
        item.code.toLowerCase().includes(needle) ||
        item.title.toLowerCase().includes(needle) ||
        item.faculty.toLowerCase().includes(needle)
      );
    });
  }, { latency: 420 });
}

// Exposed so the orchestrator can distinguish "no match" from "empty catalogue".
export function catalogueIsEmpty() {
  return CATALOGUE.length === 0;
}