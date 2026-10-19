import { StateView } from '../utility/state-view.js';
import { fetchResources, FILTER_OPTIONS } from '../network/api.js';
import { renderResourceCard, renderFilterChip } from '../components/resource-card.js';

const exploreState = {
  searchQuery: '',
  filters: { faculty: [], level: [], type: [], format: [] },
  loadedCount: 12,
  pageSize: 12,
  allResources: []
};

function initPublicExplore() {
  const container = document.querySelector('[data-state="explore-content"]');
  if (!container) return;

  const stateView = new StateView(container);
  const filterRow = document.getElementById('filter-row');
  const resultSummary = document.getElementById('result-summary');
  const loadMoreContainer = document.getElementById('load-more-container');
  const loadMoreBtn = document.getElementById('load-more-btn');
  const endOfList = document.getElementById('end-of-list');
  const searchInput = document.getElementById('explore-search');

  const params = new URLSearchParams(window.location.search);
  if (params.get('q')) {
    exploreState.searchQuery = params.get('q');
    searchInput.value = exploreState.searchQuery;
  }
  if (params.get('faculty')) {
    exploreState.filters.faculty.push(params.get('faculty'));
  }

  function getFilteredResources() {
    return exploreState.allResources.filter(resource => {
      if (exploreState.searchQuery) {
        const q = exploreState.searchQuery.toLowerCase();
        const match =
          resource.title.toLowerCase().includes(q) ||
          resource.code.toLowerCase().includes(q) ||
          resource.courseTitle.toLowerCase().includes(q) ||
          resource.contributor.toLowerCase().includes(q);
        if (!match) return false;
      }
      if (exploreState.filters.faculty.length && !exploreState.filters.faculty.includes(resource.faculty)) return false;
      if (exploreState.filters.level.length && !exploreState.filters.level.includes(resource.level)) return false;
      if (exploreState.filters.type.length && !exploreState.filters.type.includes(resource.type)) return false;
      if (exploreState.filters.format.length && !exploreState.filters.format.includes(resource.format)) return false;
      return true;
    });
  }

  function renderFilters() {
    filterRow.innerHTML = '';
    ['faculty', 'level', 'type', 'format'].forEach(key => {
      const active = exploreState.filters[key];
      if (active.length === 0) {
        const chip = document.createElement('button');
        chip.className = 'chip filter active';
        chip.textContent = `All ${key === 'type' ? 'types' : key === 'format' ? 'formats' : key}`;
        filterRow.appendChild(chip);
      }
      FILTER_OPTIONS[key].forEach(value => {
        const isActive = active.includes(value);
        const chip = renderFilterChip(value, value, isActive, key);
        chip.addEventListener('click', () => {
          const i = exploreState.filters[key].indexOf(value);
          if (i > -1) exploreState.filters[key].splice(i, 1);
          else exploreState.filters[key].push(value);
          exploreState.loadedCount = exploreState.pageSize;
          renderResourceList();
          renderFilters();
        });
        filterRow.appendChild(chip);
      });
    });
  }

  function renderResultSummary() {
    const count = getFilteredResources().length;
    let text = `${count} resource${count !== 1 ? 's' : ''}`;
    const active = [];
    if (exploreState.filters.faculty.length) active.push(exploreState.filters.faculty.join(', '));
    if (exploreState.filters.level.length) active.push(`Level ${exploreState.filters.level.join(', ')}`);
    if (exploreState.filters.type.length) active.push(exploreState.filters.type.join(', '));
    if (exploreState.filters.format.length) active.push(exploreState.filters.format.join(', '));
    if (active.length) text += ` · ${active.join(' · ')}`;
    resultSummary.textContent = text;
  }

  function renderResourceList() {
    const filtered = getFilteredResources();
    const toShow = filtered.slice(0, exploreState.loadedCount);
    const list = stateView.getDataContainer().querySelector('#resource-list');

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
        window.location.href = `resource.html?id=${resource.id}`;
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
      stateView.setError();
    }
  }

  let searchTimeout;
  searchInput.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      exploreState.searchQuery = e.target.value;
      exploreState.loadedCount = exploreState.pageSize;
      renderResourceList();
    }, 300);
  });

  loadMoreBtn.addEventListener('click', () => {
    exploreState.loadedCount += exploreState.pageSize;
    renderResourceList();
  });

  const retryBtn = container.querySelector('[data-retry]');
  if (retryBtn) retryBtn.addEventListener('click', loadExplore);

  const clearBtn = container.querySelector('[data-clear-filters]');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      exploreState.filters = { faculty: [], level: [], type: [], format: [] };
      exploreState.searchQuery = '';
      searchInput.value = '';
      exploreState.loadedCount = exploreState.pageSize;
      renderFilters();
      renderResourceList();
    });
  }

  loadExplore();
}

initPublicExplore();