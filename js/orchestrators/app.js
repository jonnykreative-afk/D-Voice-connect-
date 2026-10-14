// js/orchestrators/app.js
import { initHomeTab }    from './tabs/home.js';
import { initExploreTab } from './tabs/explore.js';
import { initReadingTab } from './tabs/reading.js';
import { initProfileTab } from './tabs/profile.js';
import { setAuth } from '../libs/state/auth.js';

/* DEV AUTH — remove when real auth lands */
setAuth({ id: 'u1', username: 'Imtiaz', faculty: 'Science' });

const VALID_TABS = ['tab-home', 'tab-explore', 'tab-reading', 'tab-profile'];
const DEFAULT_TAB = 'tab-home';

let currentTab = null;
const loadedTabs = new Set();

document.addEventListener('DOMContentLoaded', () => {
  setupNav();
  setupDeclarativeSwitchers();
  switchToTab(getInitialTab());
});

window.addEventListener('hashchange', () => {
  const hash = window.location.hash.replace('#', '');
  if (VALID_TABS.includes(hash) && hash !== currentTab) switchToTab(hash);
});

document.addEventListener('switchTab', (e) => switchToTab(e.detail));

function getInitialTab() {
  const hash = window.location.hash.replace('#', '');
  return VALID_TABS.includes(hash) ? hash : DEFAULT_TAB;
}

function setupNav() {
  document.querySelectorAll('.nav-item[data-tab]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      switchToTab(link.dataset.tab);
    });
  });
}

function setupDeclarativeSwitchers() {
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-switch-tab]');
    if (!trigger) return;
    e.preventDefault();
    switchToTab(trigger.dataset.switchTab);
  });
}

function switchToTab(tabId) {
  if (!VALID_TABS.includes(tabId) || currentTab === tabId) return;
  currentTab = tabId;
  window.location.hash = tabId;

  document.querySelectorAll('.nav-item[data-tab]').forEach(l =>
    l.classList.toggle('active', l.dataset.tab === tabId)
  );
  document.querySelectorAll('.tab-content').forEach(p =>
    p.classList.toggle('active', p.id === tabId)
  );

  loadTab(tabId);
  window.scrollTo({ top: 0, behavior: 'instant' });
}

async function loadTab(tabId) {
  if (loadedTabs.has(tabId)) return;
  try {
    switch (tabId) {
      case 'tab-home':    await initHomeTab();    break;
      case 'tab-explore': await initExploreTab(); break;
      case 'tab-reading': await initReadingTab(); break;
      case 'tab-profile': await initProfileTab(); break;
    }
    loadedTabs.add(tabId);
  } catch (err) {
    console.error(`Failed to load ${tabId}:`, err);
  }
}