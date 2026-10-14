// home.js — D'Voice app entry
// Mirrors ONTROPP's dashboard-main.js structure.

import { initHomeTab } from './js/orchestrators/tabs/home.js';
import { initExploreTab } from './js/orchestrators/tabs/explore.js';
import { initReadingTab } from './js/orchestrators/tabs/reading.js';
import { initProfileTab } from './js/orchestrators/tabs/profile.js';

const VALID_TABS = ['tab-home', 'tab-explore', 'tab-reading', 'tab-profile'];
const DEFAULT_TAB = 'tab-home';

let currentTab = null;
const loadedTabs = new Set();

/* =========================================================
   BOOT
   ========================================================= */
document.addEventListener('DOMContentLoaded', () => {
  try {
    setupTabNavigation();
    setupDeclarativeTabLinks();
    switchToTab(getInitialTab());
  } catch (err) {
    console.error('Failed to initialize D\'Voice:', err);
  }
});

/* =========================================================
   ROUTING
   ========================================================= */
function getInitialTab() {
  const hash = window.location.hash.replace('#', '');
  return VALID_TABS.includes(hash) ? hash : DEFAULT_TAB;
}

function setupTabNavigation() {
  document.querySelectorAll('.nav-item[data-tab]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      switchToTab(link.getAttribute('data-tab'));
    });
  });
}

// Allows any element anywhere to declare data-switch-tab="tab-x"
function setupDeclarativeTabLinks() {
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-switch-tab]');
    if (!trigger) return;
    e.preventDefault();
    switchToTab(trigger.getAttribute('data-switch-tab'));
  });
}

function switchToTab(tabId) {
  if (!VALID_TABS.includes(tabId)) return;
  if (currentTab === tabId) return;

  currentTab = tabId;
  window.location.hash = tabId;

  // Nav active state
  document.querySelectorAll('.nav-item[data-tab]').forEach(link => {
    link.classList.toggle('active', link.getAttribute('data-tab') === tabId);
  });

  // Panel visibility
  document.querySelectorAll('.tab-content').forEach(panel => {
    panel.classList.toggle('active', panel.id === tabId);
  });

  loadTabContent(tabId);
  window.scrollTo({ top: 0, behavior: 'instant' });
}

async function loadTabContent(tabId) {
  if (loadedTabs.has(tabId)) return;

  try {
    switch (tabId) {
      case 'tab-home':     await initHomeTab();     break;
      case 'tab-explore':  await initExploreTab();  break;
      case 'tab-reading':  await initReadingTab();  break;
      case 'tab-profile':  await initProfileTab();  break;
    }
    loadedTabs.add(tabId);
  } catch (err) {
    console.error(`Failed to load ${tabId}:`, err);
  }
}

// Global imperative API — any module can call:
//   document.dispatchEvent(new CustomEvent('switchTab', { detail: 'tab-explore' }))
document.addEventListener('switchTab', (e) => {
  switchToTab(e.detail);
});

// Keep in sync if user edits the hash directly / presses back
window.addEventListener('hashchange', () => {
  const hash = window.location.hash.replace('#', '');
  if (VALID_TABS.includes(hash) && hash !== currentTab) {
    switchToTab(hash);
  }
});