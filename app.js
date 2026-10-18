import { MOCK_RESOURCES, MOCK_USER, fetchResourceById, updateUser } from './api.js';
import { renderExplore, renderLibrary, renderProfile, renderResourcePage, renderDetailContent, renderSkeleton } from './render.js';

// ========== STATE ==========
export const state = {
  currentView: 'home',
  searchQuery: '',
  filters: {
    faculty: [],
    level: [],
    type: [],
    format: []
  },
  loadedCount: 12,
  pageSize: 12,
  savedResources: [1, 3, 5, 7, 9, 11, 16, 19, 21, 25],
  librarySearch: '',
  librarySort: 'recent',
  user: { ...MOCK_USER },
  currentResourceId: null,
  sheetOriginCard: null
};

const scrollPositions = { home: 0, explore: 0, library: 0, profile: 0, resource: 0 };
let previousBodyOverflow = '';
let sheetDragStartY = null;
let sheetDragOffset = 0;

// ========== HELPERS ==========
export function formatDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function showToast(message, onUndo, showUndo = true) {
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toast-message');
  const toastAction = document.getElementById('toast-action');
  
  toastMessage.textContent = message;
  toastAction.style.display = showUndo ? 'inline-block' : 'none';
  toast.classList.add('show');
  
  if (showUndo && onUndo) {
    toastAction.onclick = () => {
      onUndo();
      toast.classList.remove('show');
    };
  }
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}

// ========== HASH ROUTING ==========
const VALID_ROUTES = ['home', 'explore', 'library', 'profile', 'resource'];

function getRouteFromHash() {
  const hash = window.location.hash.slice(1);
  if (hash.startsWith('resource/')) {
    const id = parseInt(hash.split('/')[1]);
    if (!isNaN(id)) {
      state.currentResourceId = id;
      return 'resource';
    }
  }
  return VALID_ROUTES.includes(hash) ? hash : 'home';
}

function navigateTo(name) {
  if (window.location.hash === `#${name}`) {
    switchView(name);
  } else {
    window.location.hash = name;
  }
}

window.addEventListener('hashchange', () => {
  switchView(getRouteFromHash());
});

// ========== VIEW SWITCHING ==========
const navItems = document.querySelectorAll('.nav-item');
const views = document.querySelectorAll('.view');
const viewMap = { home: 'view-home', explore: 'view-explore', library: 'view-library', profile: 'view-profile', resource: 'view-resource-page' };

function switchView(name) {
  scrollPositions[state.currentView] = window.scrollY;
  
  state.currentView = name;
  
  navItems.forEach(n => n.classList.toggle('active', n.dataset.nav === name));
  
  views.forEach(v => v.classList.remove('active'));
  const target = document.querySelector('.' + viewMap[name]);
  if (target) target.classList.add('active');
  
  if (name === 'explore') {
    renderExplore();
  } else if (name === 'library') {
    renderLibrary();
  } else if (name === 'profile') {
    renderProfile();
  } else if (name === 'resource') {
    loadResourcePage();
  }
  
  window.scrollTo({ top: scrollPositions[name], behavior: 'instant' });
}

navItems.forEach(btn => {
  btn.addEventListener('click', () => navigateTo(btn.dataset.nav));
});

document.querySelectorAll('[data-nav]').forEach(el => {
  if (!el.classList.contains('nav-item')) {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      navigateTo(el.dataset.nav);
    });
  }
});

// ========== RESOURCE DETAIL ==========
async function loadResourcePage() {
  const content = document.getElementById('resource-page-content');
  content.innerHTML = renderSkeleton();
  
  try {
    const resource = await fetchResourceById(state.currentResourceId);
    renderResourcePage(resource);
    attachDetailHandlers(resource);
  } catch (err) {
    renderResourcePage(null);
  }
}

export function openResourceSheet(resourceId, originCard) {
  const resource = MOCK_RESOURCES.find(r => r.id === resourceId);
  if (!resource) return;
  
  state.currentResourceId = resourceId;
  state.sheetOriginCard = originCard;
  
  const sheetContent = document.getElementById('sheet-content');
  sheetContent.innerHTML = renderSkeleton();
  
  const overlay = document.getElementById('sheet-overlay');
  previousBodyOverflow = document.body.style.overflow;
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  const sheet = document.getElementById('resource-sheet');
  sheet.style.transform = '';
  sheet.style.transition = ''; 
  
  setTimeout(() => {
    sheetContent.innerHTML = renderDetailContent(resource) + `
      <a href="#resource/${resource.id}" class="detail-open-page" id="detail-open-page">
        <i class="ri-external-link-line"></i>
        <span>Open full page</span>
      </a>
    `;
    attachDetailHandlers(resource);
  }, 300);
}

export function closeResourceSheet() {
  const overlay = document.getElementById('sheet-overlay');
  overlay.classList.remove('open');
  document.body.style.overflow = previousBodyOverflow;
  const sheet = document.getElementById('resource-sheet');
  sheet.style.transform = '';
  sheet.style.transition = '';
  sheetDragStartY = null;
  sheetDragOffset = 0;
  
  if (state.sheetOriginCard) {
    state.sheetOriginCard.focus();
    state.sheetOriginCard = null;
  }
}

function attachDetailHandlers(resource) {
  document.getElementById('detail-download').addEventListener('click', () => {
    showToast('Download started', null, false);
  });
  
  const saveBtn = document.getElementById('detail-save');
  saveBtn.addEventListener('click', () => {
    const index = state.savedResources.indexOf(resource.id);
    if (index > -1) {
      state.savedResources.splice(index, 1);
      showToast('Removed from library', () => {
        state.savedResources.push(resource.id);
        updateSaveButton(resource);
      });
    } else {
      state.savedResources.push(resource.id);
      showToast('Saved to library', () => {
        const i = state.savedResources.indexOf(resource.id);
        if (i > -1) state.savedResources.splice(i, 1);
        updateSaveButton(resource);
      });
    }
    updateSaveButton(resource);
  });
  
  document.getElementById('detail-share').addEventListener('click', async () => {
    const url = `${window.location.origin}${window.location.pathname}#resource/${resource.id}`;
    try {
      await navigator.clipboard.writeText(url);
      showToast('Link copied', null, false);
    } catch (err) {
      showToast('Could not copy link', null, false);
    }
  });
  
  const openPageLink = document.getElementById('detail-open-page');
  if (openPageLink) {
    openPageLink.addEventListener('click', () => {
      closeResourceSheet();
    });
  }
}

function updateSaveButton(resource) {
  const isSaved = state.savedResources.includes(resource.id);
  const saveBtn = document.getElementById('detail-save');
  if (saveBtn) {
    saveBtn.className = `detail-action ${isSaved ? 'saved' : ''}`;
    saveBtn.innerHTML = `
      <i class="ri-${isSaved ? 'bookmark-fill' : 'bookmark-line'}"></i>
      <span>${isSaved ? 'Saved' : 'Save'}</span>
    `;
  }
}

// ========== SHEET INTERACTIONS ==========
const sheetOverlay = document.getElementById('sheet-overlay');
sheetOverlay.addEventListener('click', (e) => {
  if (e.target === sheetOverlay) closeResourceSheet();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && sheetOverlay.classList.contains('open')) {
    closeResourceSheet();
  }
});

// Drag the sheet down from its handle to dismiss it.
const sheetHandle = document.querySelector('.sheet-handle');
const resourceSheet = document.getElementById('resource-sheet');
if (sheetHandle && resourceSheet) {
  sheetHandle.style.touchAction = 'none';
  sheetHandle.addEventListener('pointerdown', (e) => {
    if (!sheetOverlay.classList.contains('open')) return;
    sheetDragStartY = e.clientY;
    sheetDragOffset = 0;
    resourceSheet.style.transition = 'none';
    sheetHandle.setPointerCapture?.(e.pointerId);
  });

  sheetHandle.addEventListener('pointermove', (e) => {
    if (sheetDragStartY === null) return;
    sheetDragOffset = Math.max(0, e.clientY - sheetDragStartY);
    resourceSheet.style.transform = `translateY(${sheetDragOffset}px)`;
  });

  const finishSheetDrag = () => {
    if (sheetDragStartY === null) return;
    const shouldClose = sheetDragOffset > 110;
    sheetDragStartY = null;
    if (shouldClose) {
      resourceSheet.style.transition = '';
      closeResourceSheet();
    } else {
      resourceSheet.style.transition = 'transform 0.25s cubic-bezier(0.32, 0.72, 0, 1)';
      resourceSheet.style.transform = '';
      sheetDragOffset = 0;
    }
  };

  sheetHandle.addEventListener('pointerup', finishSheetDrag);
  sheetHandle.addEventListener('pointercancel', finishSheetDrag);
}

// ========== CARD CLICK DELEGATION ==========
document.addEventListener('click', (e) => {
  const homeResourceCard = e.target.closest('.featured-card[data-resource-id], .resource-card[data-resource-id]');
  if (homeResourceCard) {
    const resourceId = Number(homeResourceCard.dataset.resourceId);
    if (Number.isInteger(resourceId)) openResourceSheet(resourceId, homeResourceCard);
    return;
  }

  const exploreCard = e.target.closest('.explore-card');
  if (exploreCard) {
    const index = Array.from(exploreCard.parentElement.children).indexOf(exploreCard);
    const filtered = getFilteredResources();
    const resource = filtered[index];
    if (resource) {
      openResourceSheet(resource.id, exploreCard);
    }
  }
  
  const libraryCard = e.target.closest('.library-card');
  if (libraryCard && !e.target.closest('.library-card-save')) {
    const index = Array.from(libraryCard.parentElement.children).indexOf(libraryCard);
    const savedResources = MOCK_RESOURCES.filter(r => state.savedResources.includes(r.id));
    let filtered = savedResources;
    if (state.librarySearch) {
      const query = state.librarySearch.toLowerCase();
      filtered = filtered.filter(r => 
        r.title.toLowerCase().includes(query) ||
        r.code.toLowerCase().includes(query) ||
        r.courseTitle.toLowerCase().includes(query)
      );
    }
    if (state.librarySort === 'title') {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      filtered.sort((a, b) => b.id - a.id);
    }
    const resource = filtered[index];
    if (resource) {
      openResourceSheet(resource.id, libraryCard);
    }
  }
  
  const saveBtn = e.target.closest('.library-card-save');
  if (saveBtn) {
    e.stopPropagation();
    const id = parseInt(saveBtn.dataset.id);
    const index = state.savedResources.indexOf(id);
    if (index > -1) {
      state.savedResources.splice(index, 1);
      renderLibrary();
      showToast('Removed from library', () => {
        state.savedResources.push(id);
        renderLibrary();
      });
    }
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    const card = e.target.closest('.explore-card, .library-card, .featured-card[data-resource-id], .resource-card[data-resource-id]');
    if (card) {
      e.preventDefault();
      card.click();
    }
  }
});

// ========== SEARCH ==========
const searchInput = document.getElementById('explore-search-input');
let searchTimeout;
searchInput.addEventListener('input', (e) => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    state.searchQuery = e.target.value;
    state.loadedCount = state.pageSize;
    renderExplore();
  }, 300);
});

const librarySearchInput = document.getElementById('library-search-input');
let librarySearchTimeout;
librarySearchInput.addEventListener('input', (e) => {
  clearTimeout(librarySearchTimeout);
  librarySearchTimeout = setTimeout(() => {
    state.librarySearch = e.target.value;
    renderLibrary();
  }, 300);
});

// ========== SORT ==========
const sortBtn = document.getElementById('sort-btn');
const sortMenu = document.getElementById('sort-menu');
const sortLabel = document.getElementById('sort-label');

sortBtn.addEventListener('click', () => {
  sortMenu.classList.toggle('show');
});

document.querySelectorAll('.sort-option').forEach(option => {
  option.addEventListener('click', () => {
    state.librarySort = option.dataset.sort;
    sortLabel.textContent = option.textContent;
    document.querySelectorAll('.sort-option').forEach(o => o.classList.remove('active'));
    option.classList.add('active');
    sortMenu.classList.remove('show');
    renderLibrary();
  });
});

document.addEventListener('click', (e) => {
  if (!sortBtn.contains(e.target) && !sortMenu.contains(e.target)) {
    sortMenu.classList.remove('show');
  }
});

// ========== LOAD MORE ==========
document.getElementById('load-more-btn').addEventListener('click', () => {
  state.loadedCount += state.pageSize;
  renderResourceList();
});

// ========== INFINITE SCROLL ==========
window.addEventListener('scroll', () => {
  if (state.currentView !== 'explore') return;
  
  const scrollHeight = document.documentElement.scrollHeight;
  const scrollTop = window.scrollY;
  const clientHeight = window.innerHeight;
  
  if (scrollTop + clientHeight >= scrollHeight - 200) {
    const filtered = getFilteredResources();
    if (state.loadedCount < filtered.length) {
      state.loadedCount += state.pageSize;
      renderResourceList();
    }
  }
});

// ========== PROFILE HANDLERS ==========
let profileSaveTimeout;
function handleProfileChange() {
  clearTimeout(profileSaveTimeout);
  profileSaveTimeout = setTimeout(async () => {
    const updates = {
      name: document.getElementById('profile-name').value,
      faculty: document.getElementById('profile-faculty').value,
      level: document.getElementById('profile-level').value
    };
    
    const updated = await updateUser(updates);
    state.user = updated;
    
    const status = document.getElementById('profile-save-status');
    status.textContent = 'Changes saved';
    status.classList.add('show');
    
    setTimeout(() => {
      status.classList.remove('show');
    }, 2000);
  }, 500);
}

document.getElementById('profile-name').addEventListener('input', handleProfileChange);
document.getElementById('profile-faculty').addEventListener('change', handleProfileChange);
document.getElementById('profile-level').addEventListener('change', handleProfileChange);

document.getElementById('profile-signout-btn').addEventListener('click', () => {
  console.log('Sign out');
});

document.getElementById('profile-delete-btn').addEventListener('click', () => {
  if (confirm('Are you sure you want to delete your account? This cannot be undone.')) {
    console.log('Delete account');
  }
});

// ========== GREETING ==========
const h = new Date().getHours();
const greet = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
document.getElementById('greeting').textContent = greet;

// ========== INIT ==========
function init() {
  const initialRoute = getRouteFromHash();
  if (!window.location.hash) {
    window.location.hash = 'home';
  } else {
    switchView(initialRoute);
  }
}

init();

// ========== HELPER (needed by render.js) ==========
function getFilteredResources() {
  return MOCK_RESOURCES.filter(resource => {
    if (state.searchQuery) {
      const query = state.searchQuery.toLowerCase();
      const matchesSearch = 
        resource.title.toLowerCase().includes(query) ||
        resource.code.toLowerCase().includes(query) ||
        resource.courseTitle.toLowerCase().includes(query) ||
        resource.contributor.toLowerCase().includes(query);
      if (!matchesSearch) return false;
    }
    
    if (state.filters.faculty.length > 0 && !state.filters.faculty.includes(resource.faculty)) return false;
    if (state.filters.level.length > 0 && !state.filters.level.includes(resource.level)) return false;
    if (state.filters.type.length > 0 && !state.filters.type.includes(resource.type)) return false;
    if (state.filters.format.length > 0 && !state.filters.format.includes(resource.format)) return false;
    
    return true;
  });
}