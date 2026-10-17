/* =========================================================
   D'voice — shell
   Owns: tab routing, hash sync, bottom nav state, lazy tab init.
   Does not own: what lives inside any tab.
   ========================================================= */

const TABS = ['tab-home', 'tab-explore', 'tab-library', 'tab-profile'];
const DEFAULT_TAB = 'tab-home';

/* Registry of tab initialisers, filled by dashboard-main.js */
const tabInitialisers = new Map();

/* Tabs that have been initialised at least once */
const initialisedTabs = new Set();

let currentTab = null;

export function registerTab(tabId, initFn) {
  if (!TABS.includes(tabId)) {
    console.warn(`[shell] registerTab: unknown tab "${tabId}"`);
    return;
  }
  tabInitialisers.set(tabId, initFn);
}

export function initShell() {
  bindNavClicks();
  bindDataSwitchTabClicks();
  bindHashChange();

  const startingTab = readTabFromHash() ?? DEFAULT_TAB;
  activateTab(startingTab, { updateHash: true });
}

/* ---------- Public API ---------- */

export function switchToTab(tabId) {
  if (!TABS.includes(tabId)) {
    console.warn(`[shell] switchToTab: unknown tab "${tabId}"`);
    return;
  }
  activateTab(tabId, { updateHash: true });
}

/* Invalidate a tab so its initialiser runs again on next visit.
   Call this after auth changes, sign-in, sign-out, etc. */
export function resetTab(tabId) {
  initialisedTabs.delete(tabId);
}

/* ---------- Internals ---------- */

function activateTab(tabId, { updateHash }) {
  const changed = currentTab !== tabId;

  if (updateHash && window.location.hash !== `#${tabId}`) {
    /* Setting hash fires hashchange — that will re-enter activateTab.
       Guard with `changed` check above so we don't double-fire. */
    window.location.hash = tabId;
  }

  if (!changed) {
    /* Same tab re-selected. Still ensure DOM is correct (cheap + safe). */
    syncDom(tabId);
    return;
  }

  currentTab = tabId;
  syncDom(tabId);
  ensureTabInitialised(tabId);
}

function syncDom(tabId) {
  document.querySelectorAll('.nav-item[data-tab]').forEach((el) => {
    el.classList.toggle('active', el.dataset.tab === tabId);
    if (el.dataset.tab === tabId) {
      el.setAttribute('aria-current', 'page');
    } else {
      el.removeAttribute('aria-current');
    }
  });

  document.querySelectorAll('.tab-content[data-tab-panel]').forEach((el) => {
    el.classList.toggle('active', el.dataset.tabPanel === tabId);
  });

  window.scrollTo({ top: 0, behavior: 'instant' });
}

function ensureTabInitialised(tabId) {
  if (initialisedTabs.has(tabId)) return;

  const initFn = tabInitialisers.get(tabId);
  if (typeof initFn !== 'function') {
    /* No tab module wired yet — that's fine during shell development. */
    return;
  }

  initialisedTabs.add(tabId);

  Promise.resolve(initFn()).catch((err) => {
    console.error(`[shell] failed to initialise ${tabId}`, err);
    /* Mark as not-initialised so a future switch retries. */
    initialisedTabs.delete(tabId);
  });
}

/* ---------- Bindings ---------- */

function bindNavClicks() {
  document.querySelectorAll('.nav-item[data-tab]').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      switchToTab(el.dataset.tab);
    });
  });
}

function bindDataSwitchTabClicks() {
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-switch-tab]');
    if (!trigger) return;
    e.preventDefault();
    switchToTab(trigger.dataset.switchTab);
  });
}

function bindHashChange() {
  window.addEventListener('hashchange', () => {
    const tabId = readTabFromHash() ?? DEFAULT_TAB;
    /* activateTab will detect no-op if it's already current */
    activateTab(tabId, { updateHash: false });
  });
}

function readTabFromHash() {
  const raw = window.location.hash.replace('#', '');
  return TABS.includes(raw) ? raw : null;
}