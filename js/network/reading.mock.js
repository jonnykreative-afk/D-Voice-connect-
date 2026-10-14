// js/network/reading.mock.js
import { mockFetch } from './api.js';

const RECENT = [
  { id: 1, code: 'MTH 101', title: 'Elementary Mathematics',    type: 'past-question', faculty: 'Science',   level: '100', openedAt: '2 hours ago' },
  { id: 3, code: 'PHY 101', title: 'Mechanics',                 type: 'past-question', faculty: 'Science',   level: '100', openedAt: 'Yesterday' },
  { id: 7, code: 'CSC 101', title: 'Computer Science I',        type: 'past-question', faculty: 'Computing', level: '100', openedAt: '3 days ago' }
];

const SAVED = [
  { id: 2, code: 'CSC 201', title: 'Introduction to Programming', type: 'lecture-note', faculty: 'Computing', level: '200', savedAt: '1 day ago' },
  { id: 9, code: 'STA 101', title: 'Descriptive Statistics',      type: 'textbook',     faculty: 'Science',   level: '100', savedAt: '5 days ago' }
];

export const fetchRecent = () => mockFetch(() => RECENT, { latency: 400 });
export const fetchSaved  = () => mockFetch(() => SAVED,  { latency: 400 });