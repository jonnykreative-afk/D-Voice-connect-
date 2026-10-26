import { initFaculty, handleFacultyRoute, enterIntentMode } from './faculty.js';
import { initOverview, renderOverview } from './overview.js';
import { initNews } from './news.js';
import { initGroups } from './groups.js';
import { initSheet } from '/js/utility/sheet.js'

// admin-shell.js — D'voice Admin SPA shell
// Persistent frame: sidebar, top bar, hash routing, view management.

const ROUTES = {
  overview: { title: 'Overview' },
  faculty:  { title: 'Faculty' },
  news:     { title: 'News' },
  groups:   { title: 'Groups' },
};

const DEFAULT_ROUTE = 'overview';

// ---------- DOM refs ----------
const sidebar       = document.getElementById('admin-sidebar');
const sidebarOverlay = document.getElementById('sidebar-overlay');
const menuTrigger   = document.getElementById('menu-trigger');
const topbarTitle   = document.getElementById('topbar-title');
const navItems      = document.querySelectorAll('.nav-item');
const views         = document.querySelectorAll('.admin-view');

// ---------- Sidebar (mobile drawer) ----------
function openSidebar() {
  sidebar.classList.add('open');
  sidebarOverlay.classList.add('open');
  menuTrigger.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
}

function closeSidebar() {
  sidebar.classList.remove('open');
  sidebarOverlay.classList.remove('open');
  menuTrigger.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

function toggleSidebar() {
  if (sidebar.classList.contains('open')) {
    closeSidebar();
  } else {
    openSidebar();
  }
}

menuTrigger.addEventListener('click', toggleSidebar);
sidebarOverlay.addEventListener('click', closeSidebar);

// Close sidebar on Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && sidebar.classList.contains('open')) {
    closeSidebar();
    menuTrigger.focus();
  }
});

// Close sidebar when a nav item is tapped (mobile)
navItems.forEach((item) => {
  item.addEventListener('click', () => {
    if (window.innerWidth < 768) {
      closeSidebar();
    }
  });
});

// ---------- Routing ----------
function parseHash() {
  const hash = window.location.hash.replace(/^#\//, '');
  return ROUTES[hash] ? hash : DEFAULT_ROUTE;
}

function setActiveView(route) {
  // Update nav
  navItems.forEach((item) => {
    const isActive = item.dataset.route === route;
    item.classList.toggle('active', isActive);
    if (isActive) {
      item.setAttribute('aria-current', 'page');
    } else {
      item.removeAttribute('aria-current');
    }
  });

  // Update views
  views.forEach((view) => {
    view.classList.toggle('active', view.dataset.view === route);
  });

  // Update topbar title
  topbarTitle.textContent = ROUTES[route].title;

  // Update document title
  document.title = `D'voice Admin — ${ROUTES[route].title}`;
}

function handleRoute() {
  const route = parseHash();
  setActiveView(route);
}

// Listen for hash changes
window.addEventListener('hashchange', () => {
  handleRoute();
  handleFacultyRoute();
  if (parseHash() === 'overview') {
    renderOverview();
  }
});

// ---------- Init ----------
function initShell() {
  // Set initial route
  if (!window.location.hash) {
    window.location.hash = `#/${DEFAULT_ROUTE}`;
  }
  handleRoute();
  handleFacultyRoute();
  if (parseHash() === 'overview') {
    renderOverview();
  }
}

// Initialize all surfaces
initSheet();
initFaculty();
initOverview();
initNews();
initGroups();
initShell();

// Listen for intent mode from Overview
window.addEventListener('admin:enter-intent-mode', enterIntentMode);

// ---------- Public API ----------
// Surfaces register their init functions here; the shell calls them once.
const surfaceInitializers = {};

export function registerSurface(route, initFn) {
  if (typeof initFn === 'function') {
    surfaceInitializers[route] = initFn;
  }
}

export function getCurrentRoute() {
  return parseHash();
}

export { openSidebar, closeSidebar };
