// home.js

// Mock Data
const recentHistory = [
    { id: 1, title: 'MTH 101 Elementary Mathematics', type: 'Past Question', meta: 'Science • 2023' },
    { id: 2, title: 'CSC 201 Introduction to Programming', type: 'Lecture Note', meta: 'Computing • 2023' },
    { id: 3, title: 'PHY 101 Mechanics', type: 'Past Question', meta: 'Science • 2022' }
];

const facultySuggestions = [
    { id: 4, title: 'CHM 101 General Chemistry', type: 'Past Question', meta: 'Science • 2023' },
    { id: 5, title: 'BIO 101 General Biology', type: 'Lecture Note', meta: 'Science • 2023' },
    { id: 6, title: 'MTH 102 Elementary Mathematics II', type: 'Past Question', meta: 'Science • 2023' },
    { id: 7, title: 'CSC 101 Computer Science I', type: 'Past Question', meta: 'Computing • 2023' }
];

const announcements = [
    { id: 101, title: 'Registration for 2nd Semester Opens', desc: 'All students are advised to complete their course registration before the deadline.', date: 'Oct 12, 2026', source: 'University Management' },
    { id: 102, title: 'Library Hours Extended for Exams', desc: 'The main library will now be open until 10 PM on weekdays to support exam preparations.', date: 'Oct 10, 2026', source: 'University Library' }
];

const upcomingDates = [
    { id: 201, title: 'MTH 101 Final Exam', context: 'Main Auditorium • 10:00 AM', month: 'Nov', day: '15' },
    { id: 202, title: 'CSC 201 Practical', context: 'Computer Lab 3 • 09:00 AM', month: 'Nov', day: '18' },
    { id: 203, title: 'PHY 101 Theory', context: 'Senate Building • 02:00 PM', month: 'Nov', day: '22' }
];

const associations = [
    { id: 301, name: 'Science Students Assoc.', desc: 'Representing science students', initial: 'SSA' },
    { id: 302, name: 'Computing Society', desc: 'For all computing students', initial: 'FCS' },
    { id: 303, name: 'Engineering Union', desc: 'FUTA Engineering students', initial: 'FEU' }
];

// Render Functions
function renderResourceCard(item) {
    return `
        <a href="resource.html?id=${item.id}" class="card resource-card">
            <span class="resource-card__type">${item.type}</span>
            <h3 class="resource-card__title">${item.title}</h3>
            <p class="resource-card__meta">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                ${item.meta}
            </p>
        </a>
    `;
}

function renderAnnouncement(item) {
    return `
        <a href="announcement.html?id=${item.id}" class="announcement-card">
            <div class="announcement-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 11 18-5v12L3 14v-3z"></path><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"></path></svg>
            </div>
            <div class="announcement-content">
                <div class="announcement-title">
                    ${item.title}
                    <span class="badge badge-primary">Official</span>
                </div>
                <p class="announcement-desc">${item.desc}</p>
                <p class="announcement-date">${item.source} • ${item.date}</p>
            </div>
        </a>
    `;
}

function renderDateItem(item) {
    return `
        <div class="date-card">
            <div class="date-badge">
                <span class="date-badge__month">${item.month}</span>
                <span class="date-badge__day">${item.day}</span>
            </div>
            <div class="date-info">
                <div class="date-info__title">${item.title}</div>
                <div class="date-info__meta">${item.context}</div>
            </div>
        </div>
    `;
}

function renderAssociationCard(item) {
    return `
        <a href="association.html?id=${item.id}" class="card assoc-card">
            <div class="assoc-logo">${item.initial}</div>
            <h3 class="assoc-name">${item.name}</h3>
            <p class="assoc-desc">${item.desc}</p>
        </a>
    `;
}

// Initialization Logic
function initHomePage() {
    // 1. Populate Lists
    const recentList = document.getElementById('recent-list');
    if (recentList) recentList.innerHTML = recentHistory.map(renderResourceCard).join('');

    const suggestionsList = document.getElementById('suggestions-list');
    if (suggestionsList) suggestionsList.innerHTML = facultySuggestions.map(renderResourceCard).join('');

    const announcementsList = document.getElementById('announcements-list');
    if (announcementsList) announcementsList.innerHTML = announcements.map(renderAnnouncement).join('');

    const datesList = document.getElementById('dates-list');
    if (datesList) datesList.innerHTML = upcomingDates.map(renderDateItem).join('');

    const associationsList = document.getElementById('associations-list');
    if (associationsList) associationsList.innerHTML = associations.map(renderAssociationCard).join('');

    // 2. Handle Auth/State Visibility (Mocked)
    const isSignedIn = true; // Change to false to test visitor state
    const userFaculty = 'Science';

    if (isSignedIn) {
        const continueReading = document.querySelector('[data-widget="continue-reading"]');
        if (continueReading && recentHistory.length > 0) continueReading.hidden = false;

        if (userFaculty) {
            const suggestions = document.querySelector('[data-widget="faculty-suggestions"]');
            if (suggestions) {
                suggestions.querySelector('.section-title').textContent = `For ${userFaculty} Faculty`;
                suggestions.hidden = false;
            }
        }
    }

    // 3. Handle Optional Components
    const quoteData = { text: 'Education is the most powerful weapon which you can use to change the world.', author: 'Nelson Mandela' };
    if (quoteData) {
        const quoteSection = document.querySelector('[data-widget="daily-quote"]');
        if (quoteSection) {
            quoteSection.querySelector('[data-quote-text]').textContent = quoteData.text;
            quoteSection.querySelector('[data-quote-author]').textContent = `— ${quoteData.author}`;
            quoteSection.hidden = false;
        }
    }

    const whatsappData = { url: '#' };
    if (whatsappData) {
        const waSection = document.querySelector('[data-widget="whatsapp-invite"]');
        if (waSection) {
            waSection.querySelector('[data-invite-link]').href = whatsappData.url;
            waSection.hidden = false;
        }
    }

    // 4. Wire Search Form
    const searchForm = document.querySelector('[data-action="search-resources"]');
    if (searchForm) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const query = searchForm.elements.q.value.trim();
            if (query) {
                window.location.href = `explore.html?q=${encodeURIComponent(query)}`;
            }
        });
    }
}

// Run on load
initHomePage();