// Replace the mock with a real fetch when the API exists.
// Contract shape must stay stable — orchestrator and components depend on it.

const MOCK = [
  { id:"r1", title:"MTH 201 Past Questions (2019–2023)", courseCode:"MTH 201",
    courseTitle:"Mathematical Methods I", contentType:"Past question", format:"PDF",
    faculty:"Science", level:"200", contributor:"Dept. of Mathematics",
    dateAdded:"2026-09-12", downloads:412 },
  { id:"r2", title:"Thermodynamics — Full Lecture Notes", courseCode:"PHY 203",
    courseTitle:"Thermodynamics", contentType:"Lecture note", format:"PDF",
    faculty:"Science", level:"200", contributor:"Dr. A. Bello",
    dateAdded:"2026-09-04", downloads:208 },
  { id:"r3", title:"Organic Chemistry Reaction Map", courseCode:"CHM 202",
    courseTitle:"Organic Chemistry", contentType:"Summary / study guide", format:"PDF",
    faculty:"Science", level:"200", contributor:"Student contributor",
    dateAdded:"2026-08-28", downloads:97 },
  { id:"r4", title:"ECO 101 — Principles of Economics Slides", courseCode:"ECO 101",
    courseTitle:"Principles of Economics", contentType:"Slide / presentation", format:"PPTX",
    faculty:"Social Sciences", level:"100", contributor:"Dr. O. Ijeoma",
    dateAdded:"2026-09-18", downloads:53 },
  { id:"r5", title:"CSC 301 Algorithms — Compiled Reference", courseCode:"CSC 301",
    courseTitle:"Algorithms & Data Structures", contentType:"Textbook / reference", format:"PDF",
    faculty:"Science", level:"300", contributor:"Student contributor",
    dateAdded:"2026-09-22", downloads:301 },
  { id:"r6", title:"GST 101 Communication Skills — Past Questions", courseCode:"GST 101",
    courseTitle:"Communication in English", contentType:"Past question", format:"PDF",
    faculty:"General Studies", level:"100", contributor:"D'voice Team",
    dateAdded:"2026-10-01", downloads:722 },
  { id:"r7", title:"BIO 105 Cell Biology — Lecture Notes", courseCode:"BIO 105",
    courseTitle:"Cell Biology", contentType:"Lecture note", format:"DOCX",
    faculty:"Science", level:"100", contributor:"Dr. F. Okoro",
    dateAdded:"2026-07-30", downloads:141 },
  { id:"r8", title:"LAW 201 Contract Law — Case Summary", courseCode:"LAW 201",
    courseTitle:"Law of Contract", contentType:"Summary / study guide", format:"PDF",
    faculty:"Law", level:"200", contributor:"Student contributor",
    dateAdded:"2026-09-30", downloads:88 },
  { id:"r9", title:"ACC 201 Financial Accounting — Slides", courseCode:"ACC 201",
    courseTitle:"Financial Accounting I", contentType:"Slide / presentation", format:"PPTX",
    faculty:"Management Sciences", level:"200", contributor:"Dr. K. Adeyemi",
    dateAdded:"2026-09-08", downloads:76 },
  { id:"r10", title:"PHY 101 Mechanics — Past Questions", courseCode:"PHY 101",
    courseTitle:"General Physics I", contentType:"Past question", format:"PDF",
    faculty:"Science", level:"100", contributor:"D'voice Team",
    dateAdded:"2026-10-05", downloads:509 },
  { id:"r11", title:"ENG 201 African Literature — Reading List",
    courseCode:"ENG 201", courseTitle:"African Literature",
    contentType:"Textbook / reference", format:"PDF",
    faculty:"Arts", level:"200", contributor:"Dr. N. Eze",
    dateAdded:"2026-08-15", downloads:34 },
  { id:"r12", title:"STA 111 Descriptive Statistics — Notes",
    courseCode:"STA 111", courseTitle:"Descriptive Statistics",
    contentType:"Lecture note", format:"PDF",
    faculty:"Science", level:"100", contributor:"Student contributor",
    dateAdded:"2026-09-19", downloads:212 }
];

export const FACULTIES     = ["Science","Arts","Social Sciences","Law","Management Sciences","General Studies"];
export const LEVELS        = ["100","200","300","400","500"];
export const CONTENT_TYPES = ["Past question","Lecture note","Summary / study guide","Textbook / reference","Slide / presentation"];
export const FORMATS       = ["PDF","DOCX","PPTX"];

export async function getResources() {
  // Simulated latency. Swap for fetch("/api/resources").
  return new Promise(resolve => setTimeout(() => resolve(MOCK.slice()), 350));
}