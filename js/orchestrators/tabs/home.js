// js/orchestrators/tabs/home.js
import { StateView } from '../../widgets/state-view.js';
import { svRoot, qs } from '../../libs/utility/dom.js';

import { ResourceCard, 
         AnnouncementCard, 
         DateCard, 
         AssociationCard 
       }  from '../../components/cards/card.js';

import {
  fetchRecentHistory,
  fetchFacultySuggestions,
  fetchAnnouncements,
  fetchUpcomingDates,
  fetchAssociations,
  fetchDailyQuote,
  fetchWhatsappInvite
} from '../../network/home.mock.js';
import { getAuth } from '../../libs/state/auth.js';

/**
 * Initialize the Home tab. Idempotent — called once by the router.
 */
export async function initHomeTab() {
  const auth = getAuth();

  // Fire independent sections in parallel — each one controls its own
  // StateView lifecycle.
  await Promise.all([
    sectionRecentHistory(auth),
    sectionFacultySuggestions(auth),
    sectionAnnouncements(),
    sectionUpcomingDates(),
    sectionAssociations(),
    sectionQuote(),
    sectionWhatsapp()
  ]);

  wireSearch();
}

/* =========================================================
   SECTION ORCHESTRATORS
   Each one: StateView → fetch → render cards → resolve state
   ========================================================= */

async function sectionRecentHistory(auth) {
  if (!auth) return; // signed-out: keep hidden
  const section = qs('[data-widget="continue-reading"]');
  section.hidden = false;

  const sv = new StateView(svRoot('continue-reading'));

  try {
    const items = await fetchRecentHistory();
    if (items.length) sv.render(items, ResourceCard);
    sv.resolve(items);
  } catch {
    sv.show('error');
  }
}

async function sectionFacultySuggestions(auth) {
  if (!auth || !auth.faculty) return;
  const section = qs('[data-widget="faculty-suggestions"]');
  section.hidden = false;
  qs('[data-faculty-title]', section).textContent = `For ${auth.faculty} Faculty`;

  const sv = new StateView(svRoot('faculty-suggestions'));

  try {
    const items = await fetchFacultySuggestions(auth.faculty);
    if (items.length) sv.render(items, ResourceCard);
    sv.resolve(items);
  } catch {
    sv.show('error');
  }
}

async function sectionAnnouncements() {
  const sv = new StateView(svRoot('announcements'));

  try {
    const items = await fetchAnnouncements();
    if (items.length) sv.render(items, AnnouncementCard);
    sv.resolve(items);
  } catch {
    sv.show('error');
  }
}

async function sectionUpcomingDates() {
  const sv = new StateView(svRoot('upcoming-dates'));

  try {
    const items = await fetchUpcomingDates();
    if (items.length) sv.render(items, DateCard);
    sv.resolve(items);
  } catch {
    sv.show('error');
  }
}

async function sectionAssociations() {
  const sv = new StateView(svRoot('associations'));

  try {
    const items = await fetchAssociations();
    if (items.length) sv.render(items, AssociationCard);
    sv.resolve(items);
  } catch {
    sv.show('error');
  }
}

async function sectionQuote() {
  const section = qs('[data-widget="daily-quote"]');
  try {
    const quote = await fetchDailyQuote();
    if (!quote) return;
    qs('[data-quote-text]', section).textContent = quote.text;
    qs('[data-quote-author]', section).textContent = `— ${quote.author}`;
    section.hidden = false;
  } catch { /* silent */ }
}

async function sectionWhatsapp() {
  const section = qs('[data-widget="whatsapp-invite"]');
  try {
    const data = await fetchWhatsappInvite();
    if (!data) return;
    qs('[data-invite-link]', section).href = data.url;
    section.hidden = false;
  } catch { /* silent */ }
}

/* =========================================================
   MISC
   ========================================================= */

function wireSearch() {
  const form = qs('[data-action="search-resources"]');
  if (!form || form.dataset.bound) return;
  form.dataset.bound = '1';

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const q = form.elements.q.value.trim();
    if (!q) return;
    document.dispatchEvent(new CustomEvent('switchTab', { detail: 'tab-explore' }));
    // Later: explore orchestrator reads the query.
  });
}