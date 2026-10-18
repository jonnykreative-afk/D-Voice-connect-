import { initSheet } from './utility/sheet.js';
import { initHome } from './tabs/home.js';
import { initExplore } from './tabs/explore.js';
import { initLibrary } from './tabs/library.js';
import { initProfile } from './tabs/profile.js';

// ========== GLOBAL STATE ==========
export const state = {
  currentView: 'home',
  savedResources: [1, 3, 5, 7, 9, 11, 16, 19, 21, 25], // Mock saved IDs
  initializedTabs: new Set()
};

const scrollPositions = { home: 0, explore: 0, library: 0, profile: 0 };

// ========== ROUTING & SWITCHING ==========
const VALID_ROUTES = ['home', 'explore', 'library', 'profile'];

function getRouteFromHash() {
  const hash = window.location.hash.slice(1);
  return VALID_ROUTES.includes(hash) ? hash : 'home';
}

function switchView(name) {
  // 1. Save scroll position of current view
  scrollPositions[state.currentView] = window.scrollY;
  
  // 2. Update State
  state.currentView = name;
  
  // 3. Update UI (Nav & Views)
  document.querySelectorAll('.nav-item').forEach(n => {
    n.classList.toggle('active', n.dataset.nav === name);
  });
  
  document.querySelectorAll('.view').forEach(v => {
    v.classList.remove('active');
  });
  const target = document.querySelector(`[data-view="${name}"]`);
  if (target) target.classList.add('active');
  
  // 4. Initialize Tab Content (Only once per session)
  if (!state.initializedTabs.has(name)) {
    if (name === 'home') initHome();
    if (name === 'explore') initExplore();
    if (name === 'library') initLibrary();
    if (name === 'profile') initProfile();
    
    state.initializedTabs.add(name);
  }
  
  // 5. Restore scroll position
  window.scrollTo({ top: scrollPositions[name], behavior: 'instant' });
}

// Event Listeners for Navigation
window.addEventListener('hashchange', () => {
  switchView(getRouteFromHash());
});

document.querySelectorAll('.nav-item').forEach(btn => {
  btn.addEventListener('click', () => {
    window.location.hash = btn.dataset.nav;
  });
});

document.querySelectorAll('[data-nav]').forEach(el => {
  if (!el.classList.contains('nav-item')) {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.hash = el.dataset.nav;
    });
  }
});

// ========== INITIALIZATION ==========
function initApp() {
  // Update Greeting
  const h = new Date().getHours();
  const greet = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
  const greetingEl = document.getElementById('greeting');
  if (greetingEl) greetingEl.textContent = greet;

  // Init Global Widgets
  initSheet();

  // Handle Initial Route
  const initialRoute = getRouteFromHash();
  if (!window.location.hash) {
    window.location.hash = 'home';
  } else {
    switchView(initialRoute);
  }
}

initApp();