// ========== MOCK DATA ==========
export const MOCK_RESOURCES = [
  { id: 1, title: 'Calculus II Past Questions 2024', code: 'MTH 201', courseTitle: 'Calculus II', type: 'Past question', format: 'PDF', faculty: 'Science', level: '200', contributor: 'Dr. Adebayo', date: '2024-10-15', downloads: 342, description: 'Comprehensive past questions from 2019-2024 with detailed solutions.', contributorNote: 'Compiled by the Mathematics Department.' },
  { id: 2, title: 'Data Structures — Week 4 Notes', code: 'CSC 205', courseTitle: 'Data Structures', type: 'Lecture note', format: 'PDF', faculty: 'Science', level: '200', contributor: 'Prof. Okafor', date: '2024-10-14', downloads: 189 },
  { id: 3, title: 'General Chemistry Summary', code: 'CHM 101', courseTitle: 'General Chemistry', type: 'Summary / study guide', format: 'PDF', faculty: 'Science', level: '100', contributor: 'Student Union', date: '2024-10-13', downloads: 567 },
  { id: 4, title: 'Mechanics — Lecture 7 Slides', code: 'PHY 111', courseTitle: 'Mechanics', type: 'Slide / presentation', format: 'PPTX', faculty: 'Science', level: '100', contributor: 'Dr. Ibrahim', date: '2024-10-12', downloads: 98 },
  { id: 5, title: 'Programming Fundamentals Past Questions', code: 'CSC 101', courseTitle: 'Intro to Programming', type: 'Past question', format: 'PDF', faculty: 'Science', level: '100', contributor: 'Dept. of CS', date: '2024-10-11', downloads: 723 },
  { id: 6, title: 'Organic Chemistry Lecture Notes', code: 'CHM 201', courseTitle: 'Organic Chemistry', type: 'Lecture note', format: 'PDF', faculty: 'Science', level: '200', contributor: 'Dr. Adeyemi', date: '2024-10-10', downloads: 234 },
  { id: 7, title: 'Linear Algebra Study Guide', code: 'MTH 102', courseTitle: 'Linear Algebra', type: 'Summary / study guide', format: 'PDF', faculty: 'Science', level: '100', contributor: 'Math Society', date: '2024-10-09', downloads: 412 },
  { id: 8, title: 'Thermodynamics Past Questions 2023', code: 'PHY 201', courseTitle: 'Thermodynamics', type: 'Past question', format: 'PDF', faculty: 'Science', level: '200', contributor: 'Physics Dept', date: '2024-10-08', downloads: 287 },
  { id: 9, title: 'Cell Biology Textbook Chapter 5', code: 'BIO 111', courseTitle: 'Cell Biology', type: 'Textbook / reference', format: 'PDF', faculty: 'Science', level: '100', contributor: 'Library', date: '2024-10-07', downloads: 156 },
  { id: 10, title: 'Circuit Analysis Lecture Slides', code: 'ENG 201', courseTitle: 'Circuit Analysis', type: 'Slide / presentation', format: 'PPTX', faculty: 'Engineering', level: '200', contributor: 'Prof. Balogun', date: '2024-10-06', downloads: 134 },
  { id: 11, title: 'Engineering Mathematics Past Questions', code: 'MTH 301', courseTitle: 'Engineering Mathematics', type: 'Past question', format: 'PDF', faculty: 'Engineering', level: '300', contributor: 'Eng. Society', date: '2024-10-05', downloads: 198 },
  { id: 12, title: 'Fluid Mechanics Notes', code: 'ENG 205', courseTitle: 'Fluid Mechanics', type: 'Lecture note', format: 'PDF', faculty: 'Engineering', level: '200', contributor: 'Dr. Ogunleye', date: '2024-10-04', downloads: 167 },
  { id: 13, title: 'Introduction to Philosophy Study Guide', code: 'PHI 101', courseTitle: 'Intro to Philosophy', type: 'Summary / study guide', format: 'PDF', faculty: 'Arts', level: '100', contributor: 'Philosophy Dept', date: '2024-10-03', downloads: 89 },
  { id: 14, title: 'Nigerian History Past Questions', code: 'HIS 201', courseTitle: 'Nigerian History', type: 'Past question', format: 'PDF', faculty: 'Arts', level: '200', contributor: 'History Union', date: '2024-10-02', downloads: 234 },
  { id: 15, title: 'English Literature Lecture Notes', code: 'ENG 102', courseTitle: 'English Literature', type: 'Lecture note', format: 'PDF', faculty: 'Arts', level: '100', contributor: 'Dr. Akinwale', date: '2024-10-01', downloads: 145 },
  { id: 16, title: 'Principles of Economics Summary', code: 'ECO 101', courseTitle: 'Principles of Economics', type: 'Summary / study guide', format: 'PDF', faculty: 'Social Sciences', level: '100', contributor: 'Econ Society', date: '2024-09-30', downloads: 378 },
  { id: 17, title: 'Microeconomics Past Questions 2024', code: 'ECO 201', courseTitle: 'Microeconomics', type: 'Past question', format: 'PDF', faculty: 'Social Sciences', level: '200', contributor: 'Dept. of Economics', date: '2024-09-29', downloads: 267 },
  { id: 18, title: 'Introduction to Psychology Lecture Slides', code: 'PSY 101', courseTitle: 'Intro to Psychology', type: 'Slide / presentation', format: 'PPTX', faculty: 'Social Sciences', level: '100', contributor: 'Dr. Nwosu', date: '2024-09-28', downloads: 189 },
  { id: 19, title: 'Anatomy Textbook Chapter 3', code: 'ANA 101', courseTitle: 'Human Anatomy', type: 'Textbook / reference', format: 'PDF', faculty: 'Health Sciences', level: '100', contributor: 'Medical Library', date: '2024-09-27', downloads: 456 },
  { id: 20, title: 'Physiology Past Questions', code: 'PHY 102', courseTitle: 'Human Physiology', type: 'Past question', format: 'PDF', faculty: 'Health Sciences', level: '100', contributor: 'Med Society', date: '2024-09-26', downloads: 312 },
  { id: 21, title: 'Constitutional Law Lecture Notes', code: 'LAW 201', courseTitle: 'Constitutional Law', type: 'Lecture note', format: 'PDF', faculty: 'Law', level: '200', contributor: 'Prof. Adekunle', date: '2024-09-25', downloads: 234 },
  { id: 22, title: 'Criminal Law Past Questions 2023', code: 'LAW 301', courseTitle: 'Criminal Law', type: 'Past question', format: 'PDF', faculty: 'Law', level: '300', contributor: 'Law Union', date: '2024-09-24', downloads: 289 },
  { id: 23, title: 'Legal Methods Study Guide', code: 'LAW 101', courseTitle: 'Legal Methods', type: 'Summary / study guide', format: 'PDF', faculty: 'Law', level: '100', contributor: 'Law Society', date: '2024-09-23', downloads: 178 },
  { id: 24, title: 'Biochemistry Lecture Slides', code: 'BCH 201', courseTitle: 'Biochemistry', type: 'Slide / presentation', format: 'PPTX', faculty: 'Science', level: '200', contributor: 'Dr. Olayinka', date: '2024-09-22', downloads: 145 },
  { id: 25, title: 'Computer Networks Past Questions', code: 'CSC 305', courseTitle: 'Computer Networks', type: 'Past question', format: 'PDF', faculty: 'Science', level: '300', contributor: 'CS Dept', date: '2024-09-21', downloads: 267 },
  { id: 26, title: 'Database Systems Lecture Notes', code: 'CSC 301', courseTitle: 'Database Systems', type: 'Lecture note', format: 'PDF', faculty: 'Science', level: '300', contributor: 'Prof. Adeyemo', date: '2024-09-20', downloads: 198 },
  { id: 27, title: 'Software Engineering Summary', code: 'CSC 401', courseTitle: 'Software Engineering', type: 'Summary / study guide', format: 'PDF', faculty: 'Science', level: '400', contributor: 'SE Society', date: '2024-09-19', downloads: 156 },
  { id: 28, title: 'Digital Electronics Textbook', code: 'ENG 105', courseTitle: 'Digital Electronics', type: 'Textbook / reference', format: 'PDF', faculty: 'Engineering', level: '100', contributor: 'Eng Library', date: '2024-09-18', downloads: 234 },
  { id: 29, title: 'Structural Analysis Past Questions', code: 'ENG 301', courseTitle: 'Structural Analysis', type: 'Past question', format: 'PDF', faculty: 'Engineering', level: '300', contributor: 'Civil Eng Dept', date: '2024-09-17', downloads: 189 },
  { id: 30, title: 'Political Science Lecture Slides', code: 'POL 101', courseTitle: 'Intro to Political Science', type: 'Slide / presentation', format: 'PPTX', faculty: 'Social Sciences', level: '100', contributor: 'Dr. Bello', date: '2024-09-16', downloads: 123 }
];

export const FILTER_OPTIONS = {
  faculty: ['Science', 'Engineering', 'Arts', 'Social Sciences', 'Health Sciences', 'Law'],
  level: ['100', '200', '300', '400'],
  type: ['Past question', 'Lecture note', 'Summary / study guide', 'Textbook / reference', 'Slide / presentation'],
  format: ['PDF', 'PPTX', 'DOCX']
};

export const MOCK_USER = {
  name: 'Imtiaz',
  email: 'imtiaz@student.edu.ng',
  faculty: 'Science',
  level: '200'
};

// ========== API FUNCTIONS ==========
export async function fetchResources() {
  return new Promise(resolve => {
    setTimeout(() => resolve(MOCK_RESOURCES), 300);
  });
}

export async function fetchResourceById(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const resource = MOCK_RESOURCES.find(r => r.id === id);
      if (resource) {
        resolve(resource);
      } else {
        reject(new Error('Resource not found'));
      }
    }, 300);
  });
}

export async function fetchUser() {
  return new Promise(resolve => {
    setTimeout(() => resolve(MOCK_USER), 200);
  });
}

export async function updateUser(updates) {
  return new Promise(resolve => {
    setTimeout(() => {
      Object.assign(MOCK_USER, updates);
      resolve(MOCK_USER);
    }, 300);
  });
}

export function generateFileSize(id) {
  const sizes = ['1.2 MB', '2.4 MB', '856 KB', '3.1 MB', '1.8 MB', '945 KB'];
  return sizes[id % sizes.length];
}