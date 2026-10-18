import { state } from '../app.js';
import { StateView } from '../utility/state-view.js';
import { fetchResources, FILTER_OPTIONS } from '../network/api.js';
import { renderResourceCard, renderFilterChip } from '../components/resource-card.js';
import { openSheet } from '../utility/sheet.js';
import { renderResourceDetail } from '../components/resource-detail.js';
import { fetchResourceById } from '../network/api.js';

// Local state for Explore
const exploreState = {
  searchQuery: '',
  filters: { faculty: [], level: [], type: [], format: [] },
  loadedCount: 12,
  pageSize: 12,
  allResources: []
};

export function initExplore() {
  const container = document.querySelector('[data-state="explore-content"]');
  if (!container) return;

  const stateView = new StateView(container);
  const filterRow = document.getElementById('filter-row');
  const resultSummary = document.getElementById('result-summary');
  const loadMoreContainer = document.getElementById('load-more-container');
  const loadMoreBtn = document.getElementById('load-more-btn');
  const endOfList = document.getElementById('end-of-list');

  // Parse URL params for initial state
  const params = new URLSearchParams(window.location.hash.split('?')[1] || '');
  if (params.get('q')) {
    exploreState.searchQuery = params.get('q');
    document.getElementById('explore-search').value = exploreState.searchQuery;
  }
  if (params.get('faculty')) {
    exploreState.filters.faculty.push(params.get('faculty'));
  }

  function getFilteredResources() {
    return exploreState.allResources.filter(resource => {
      if (exploreState.searchQuery) {
        const query = exploreState.searchQuery.toLowerCase();
        const matchesSearch = 
          resource.title.toLowerCase().includes(query) ||
          resource.code.toLowerCase().includes(query) ||
          resource.courseTitle.toLowerCase().includes(query) ||
          resource.contributor.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }
      
      if (exploreState.filters.faculty.length > 0 && !exploreState.filters.faculty.includes(resource.faculty)) return false;
      if (exploreState.filters.level.length > 0 && !exploreState.filters.level.includes(resource.level)) return false;
      if (exploreState.filters.type.length > 0 && !exploreState.filters.type.includes(resource.type)) return false;
      if (exploreState.filters.format.length > 0 && !exploreState.filters.format.includes(resource.format)) return false;
      
      return true;
    });
  }

  function renderFilters() {
    filterRow.innerHTML = '';
    
    ['faculty', 'level', 'type', 'format'].forEach(filterKey => {
      const activeValues = exploreState.filters[filterKey];
      
      if (activeValues.length === 0) {
        const chip = document.createElement('button');
        chip.className = 'chip filter active';
        chip.textContent = `All ${filterKey === 'type' ? 'types' : filterKey === 'format' ? 'formats' : filterKey}`;
        filterRow.appendChild(chip);
      }
      
      FILTER_OPTIONS[filterKey].forEach(value => {
        const isActive = activeValues.includes(value);
        const chip = renderFilterChip(value, value, isActive, filterKey);
        chip.addEventListener('click', () => {
          const index = exploreState.filters[filterKey].indexOf(value);
          if (index > -1) {
            exploreState.filters[filterKey].splice(index, 1);
          } else {
            exploreState.filters[filterKey].push(value);
          }
          exploreState.loadedCount = exploreState.pageSize;
          renderResourceList();
          renderFilters();
        });
        filterRow.appendChild(chip);
      });
    });
  }

  function renderResultSummary() {
    const filtered = getFilteredResources();
    const count = filtered.length;
    
    let text = `${count} resource${count !== 1 ? 's' : ''}`;
    
    const activeFilters = [];
    if (exploreState.filters.faculty.length > 0) activeFilters.push(exploreState.filters.faculty.join(', '));
    if (exploreState.filters.level.length > 0) activeFilters.push(`Level ${exploreState.filters.level.join(', ')}`);
    if (exploreState.filters.type.length > 0) activeFilters.push(exploreState.filters.type.join(', '));
    if (exploreState.filters.format.length > 0) activeFilters.push(exploreState.filters.format.join(', '));
    
    if (activeFilters.length > 0) {
      text += ` · ${activeFilters.join(' · ')}`;
    }
    
    resultSummary.textContent = text;
  }

  function renderResourceList() {
    const filtered = getFilteredResources();
    const toShow = filtered.slice(0, exploreState.loadedCount);
    const dataContainer = stateView.getDataContainer();
    const list = dataContainer.querySelector('#resource-list');
    
    renderResultSummary();
    
    if (filtered.length === 0) {
      stateView.setEmpty();
      loadMoreContainer.hidden = true;
      endOfList.hidden = true;
      return;
    }
    
    stateView.setData();
    list.innerHTML = '';
    
    toShow.forEach(resource => {
      const card = renderResourceCard(resource);
      card.addEventListener('click', () => {
        openSheet(resource.id, card, async (resourceId) => {
          const r = await fetchResourceById(resourceId);
          return renderResourceDetail(r, { 
            isSaved: state.savedResources.includes(r.id), 
            showOpenPageLink: true 
          });
        });
      });
      list.appendChild(card);
    });
    
    if (exploreState.loadedCount >= filtered.length) {
      loadMoreContainer.hidden = true;
      endOfList.hidden = false;
    } else {
      loadMoreContainer.hidden = false;
      endOfList.hidden = true;
    }
  }

  async function loadExplore() {
    stateView.setLoading();
    try {
      exploreState.allResources = await fetchResources();
      renderFilters();
      renderResourceList();
    } catch (err) {
      console.error(err);
      stateView.setError();
    }
  }

  // Wire Search
  const searchInput = document.getElementById('explore-search');
  if (searchInput) {
    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        exploreState.searchQuery = e.target.value;
        exploreState.loadedCount = exploreState.pageSize;
        renderResourceList();
      }, 300);
    });
  }

  // Wire Load More
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
      exploreState.loadedCount += exploreState.pageSize;
      renderResourceList();
    });
  }

  // Wire Infinite Scroll
  window.addEventListener('scroll', () => {
    if (state.currentView !== 'explore') return;
    
    const scrollHeight = document.documentElement.scrollHeight;
    const scrollTop = window.scrollY;
    const clientHeight = window.innerHeight;
    
    if (scrollTop + clientHeight >= scrollHeight - 200) {
      const filtered = getFilteredResources();
      if (exploreState.loadedCount < filtered.length) {
        exploreState.loadedCount += exploreState.pageSize;
        renderResourceList();
      }
    }
  });

  // Wire Retry
  const retryBtn = container.querySelector('[data-retry]');
  if (retryBtn) retryBtn.addEventListener('click', loadExplore);

  // Wire Clear Filters
  const clearBtn = container.querySelector('[data-clear-filters]');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      exploreState.filters = { faculty: [], level: [], type: [], format: [] };
      exploreState.searchQuery = '';
      if (searchInput) searchInput.value = '';
      exploreState.loadedCount = exploreState.pageSize;
      renderFilters();
      renderResourceList();
    });
  }

  loadExplore();
}