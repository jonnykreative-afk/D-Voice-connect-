// js/network/home.mock.js
import { mockFetch } from './api.js';

const RECENT_HISTORY = [
  { id: 1, title: 'MTH 101 Elementary Mathematics', type: 'Past Question', meta: 'Science • 2023' },
  { id: 2, title: 'CSC 201 Introduction to Programming', type: 'Lecture Note', meta: 'Computing • 2023' },
  { id: 3, title: 'PHY 101 Mechanics', type: 'Past Question', meta: 'Science • 2022' }
];

const FACULTY_SUGGESTIONS = {
  Science: [
    { id: 4, title: 'CHM 101 General Chemistry', type: 'Past Question', meta: 'Science • 2023' },
    { id: 5, title: 'BIO 101 General Biology', type: 'Lecture Note', meta: 'Science • 2023' },
    { id: 6, title: 'MTH 102 Elementary Mathematics II', type: 'Past Question', meta: 'Science • 2023' }
  ]
};

const ANNOUNCEMENTS = [
  { id: 101, title: 'Registration for 2nd Semester Opens', desc: 'All students are advised to complete their course registration before the deadline.', date: 'Oct 12, 2026', source: 'University Management' },
  { id: 102, title: 'Library Hours Extended for Exams', desc: 'The main library will now be open until 10 PM on weekdays.', date: 'Oct 10, 2026', source: 'University Library' }
];

const UPCOMING_DATES = [
  { id: 201, title: 'MTH 101 Final Exam', context: 'Main Auditorium • 10:00 AM', month: 'Nov', day: '15' },
  { id: 202, title: 'CSC 201 Practical', context: 'Computer Lab 3 • 09:00 AM', month: 'Nov', day: '18' },
  { id: 203, title: 'PHY 101 Theory', context: 'Senate Building • 02:00 PM', month: 'Nov', day: '22' }
];

const ASSOCIATIONS = [
  { id: 301, name: 'Science Students Assoc.', desc: 'Representing science students', initial: 'SSA' },
  { id: 302, name: 'Computing Society', desc: 'For all computing students', initial: 'FCS' },
  { id: 303, name: 'Engineering Union', desc: 'FUTA Engineering students', initial: 'FEU' }
];

const QUOTE = {
  text: 'Education is the most powerful weapon which you can use to change the world.',
  author: 'Nelson Mandela'
};

const WHATSAPP = { url: '#' };

// ---- public network functions (async, mock-backed) ----

export const fetchRecentHistory   = () => mockFetch(() => RECENT_HISTORY,   { latency: 350 });
export const fetchFacultySuggestions = (faculty) =>
  mockFetch(() => FACULTY_SUGGESTIONS[faculty] ?? [], { latency: 450 });
export const fetchAnnouncements   = () => mockFetch(() => ANNOUNCEMENTS,   { latency: 400 });
export const fetchUpcomingDates   = () => mockFetch(() => UPCOMING_DATES,  { latency: 500 });
export const fetchAssociations    = () => mockFetch(() => ASSOCIATIONS,    { latency: 380 });
export const fetchDailyQuote      = () => mockFetch(() => QUOTE,           { latency: 200 });
export const fetchWhatsappInvite  = () => mockFetch(() => WHATSAPP,        { latency: 200 });