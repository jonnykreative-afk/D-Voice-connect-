// js/orchestrators/home.js
import { createViewState } from '../libs/state/viewState.js';
import { getUserState } from '../libs/state/authState.js';

// Network imports
import { 
    getRecentHistory, getFacultySuggestions, getRecentAnnouncements, 
    getUpcomingDates, getAssociations, getDailyQuote, getWhatsAppInvite 
} from '../network/home.js';

// Component imports (dumb renderers)
import { renderResourceCard } from '../components/resourceCard.js';
import { renderAnnouncementItem } from '../components/announcementItem.js';
import { renderDateItem } from '../components/dateItem.js';
import { renderAssociationCard } from '../components/associationCard.js';

async function initHomePage() {
    const user = getUserState();
    const isSignedIn = user?.isLoggedIn;

    // 1. Handle Auth-dependent sections
    if (isSignedIn) {
        await loadSection('[data-widget="continue-reading"]', getRecentHistory, renderResourceCard);
        
        if (user.faculty) {
            await loadSection('[data-widget="faculty-suggestions"]', () => getFacultySuggestions(user.faculty), renderResourceCard);
        }
    }

    // 2. Handle Public sections
    await loadSection('[data-widget="recent-announcements"]', getRecentAnnouncements, renderAnnouncementItem);
    await loadSection('[data-widget="upcoming-dates"]', getUpcomingDates, renderDateItem);
    await loadSection('[data-widget="browse-associations"]', getAssociations, renderAssociationCard);

    // 3. Handle Optional components
    await loadOptionalComponent('[data-widget="daily-quote"]', getDailyQuote, renderDailyQuote);
    await loadOptionalComponent('[data-widget="whatsapp-invite"]', getWhatsAppInvite, renderWhatsAppInvite);

    // 4. Wire static interactions
    wireSearchForm();
}

// Helper to drive the 4-state view pattern
async function loadSection(selector, fetchFn, renderFn) {
    const root = document.querySelector(selector);
    if (!root) return;

    // Reveal section if it was hidden (e.g., signed-in sections)
    root.hidden = false; 

    const view = createViewState(root);
    view.set('loading');

    try {
        const data = await fetchFn();
        const dataContainer = root.querySelector('[data-state="data"]');

        if (!data || data.length === 0) {
            view.set('empty');
        } else {
            dataContainer.replaceChildren(...data.map(renderFn));
            view.set('data');
        }
    } catch (err) {
        console.error(`Failed to load ${selector}:`, err);
        view.set('error');
    }
}

// Helper for optional components that might return null/empty from the API
async function loadOptionalComponent(selector, fetchFn, renderFn) {
    const root = document.querySelector(selector);
    if (!root) return;

    try {
        const data = await fetchFn();
        if (data && data.isValid) {
            renderFn(root, data);
            root.hidden = false;
        }
    } catch (err) {
        console.error(`Optional component ${selector} failed:`, err);
        // Keep hidden on failure
    }
}

function renderDailyQuote(root, data) {
    root.querySelector('[data-quote-text]').textContent = data.text;
    root.querySelector('[data-quote-author]').textContent = data.author;
}

function renderWhatsAppInvite(root, data) {
    root.querySelector('[data-invite-text]').textContent = data.message;
    root.querySelector('[data-invite-link]').href = data.url;
}

function wireSearchForm() {
    const form = document.querySelector('[data-action="search-resources"]');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const query = form.elements.q.value.trim();
        if (query) {
            // Navigate to explore page with query param
            window.location.href = `explore.html?q=${encodeURIComponent(query)}`;
        }
    });
}

// Initialize
initHomePage();