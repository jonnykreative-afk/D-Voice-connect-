import { MOCK_RESOURCES, FILTER_OPTIONS, generateFileSize } from './api.js';
import { formatDate, state } from './app.js';

// ========== EXPLORE ==========
export function renderFilters() {
  const filterRow = document.getElementById('filter-row');
  filterRow.innerHTML = '';

  ['faculty', 'level', 'type', 'format'].forEach(filterKey => {
    const activeValues = state.filters[filterKey];
    
    if (activeValues.length === 0) {
      const chip = document.createElement('button');
      chip.className = 'filter-chip active';
      chip.innerHTML = `All ${filterKey === 'type' ? 'types' : filterKey === 'format' ? 'formats' : filterKey}`;
      filterRow.appendChild(chip);
    }

    FILTER_OPTIONS[filterKey].forEach(value => {
      const isActive = activeValues.includes(value);
      const chip = document.createElement('button');
      chip.className = `filter-chip ${isActive ? 'active' : ''}`;
      chip.innerHTML = value;
      if (isActive) {
        chip.innerHTML += ' <i class="ri-close-line clear"></i>';
      }
      chip.addEventListener('click', () => {
        const index = state.filters[filterKey].indexOf(value);
        if (index > -1) {
          state.filters[filterKey].splice(index, 1);
        } else {
          state.filters[filterKey].push(value);
        }
        state.loadedCount = state.pageSize;
        renderExplore();
      });
      filterRow.appendChild(chip);
    });
  });
}

export function renderResultSummary() {
  const summary = document.getElementById('result-summary');
  const filtered = getFilteredResources();
  const count = filtered.length;
  
  let text = `${count} resource${count !== 1 ? 's' : ''}`;
  
  const activeFilters = [];
  if (state.filters.faculty.length > 0) activeFilters.push(state.filters.faculty.join(', '));
  if (state.filters.level.length > 0) activeFilters.push(`Level ${state.filters.level.join(', ')}`);
  if (state.filters.type.length > 0) activeFilters.push(state.filters.type.join(', '));
  if (state.filters.format.length > 0) activeFilters.push(state.filters.format.join(', '));
  
  if (activeFilters.length > 0) {
    text += ` · ${activeFilters.join(' · ')}`;
  }
  
  summary.textContent = text;
}

export function renderResourceList() {
  const list = document.getElementById('resource-list');
  const filtered = getFilteredResources();
  const toShow = filtered.slice(0, state.loadedCount);
  
  list.innerHTML = '';
  
  if (toShow.length === 0) {
    list.innerHTML = `
      <div class="placeholder">
        <i class="ri-search-line"></i>
        <h2>No resources found</h2>
        <p>Try adjusting your search or filters</p>
      </div>
    `;
    return;
  }
  
  toShow.forEach(resource => {
    const card = document.createElement('article');
    card.className = 'explore-card';
    card.setAttribute('tabindex', '0');
    card.innerHTML = `
      <div class="explore-card-header">
        <span class="explore-card-type">${resource.type}</span>
        <span class="explore-card-format">${resource.format}</span>
      </div>
      <div class="explore-card-title">${resource.title}</div>
      <div class="explore-card-course">
        <span class="explore-card-code">${resource.code}</span>
        <span class="explore-card-course-title">${resource.courseTitle}</span>
      </div>
      <div class="explore-card-meta">
        <span>${resource.contributor}</span>
        <span class="dot"></span>
        <span>${formatDate(resource.date)}</span>
        ${resource.downloads ? `<span class="dot"></span><span>${resource.downloads} downloads</span>` : ''}
      </div>
    `;
    list.appendChild(card);
  });
  
  const loadMoreContainer = document.getElementById('load-more-container');
  const endOfList = document.getElementById('end-of-list');
  
  if (state.loadedCount >= filtered.length) {
    loadMoreContainer.style.display = 'none';
    endOfList.style.display = 'block';
  } else {
    loadMoreContainer.style.display = 'flex';
    endOfList.style.display = 'none';
  }
}

export function renderExplore() {
  renderFilters();
  renderResultSummary();
  renderResourceList();
}

// ========== LIBRARY ==========
export function renderLibrary() {
  const list = document.getElementById('library-list');
  const empty = document.getElementById('library-empty');
  const count = document.getElementById('library-count');
  
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
  
  count.textContent = `${filtered.length} saved resource${filtered.length !== 1 ? 's' : ''}`;
  
  if (filtered.length === 0) {
    list.style.display = 'none';
    empty.style.display = 'block';
    if (state.librarySearch) {
      empty.querySelector('h2').textContent = 'No results';
      empty.querySelector('p').textContent = 'Try a different search term';
      empty.querySelector('.explore-btn').style.display = 'none';
    } else {
      empty.querySelector('h2').textContent = 'Your library is empty';
      empty.querySelector('p').textContent = 'Save resources from Explore to find them here later';
      empty.querySelector('.explore-btn').style.display = 'inline-block';
    }
    return;
  }
  
  list.style.display = 'flex';
  empty.style.display = 'none';
  list.innerHTML = '';
  
  filtered.forEach(resource => {
    const card = document.createElement('article');
    card.className = 'library-card';
    card.setAttribute('tabindex', '0');
    card.innerHTML = `
      <div class="library-card-header">
        <span class="library-card-type">${resource.type}</span>
        <span class="library-card-format">${resource.format}</span>
        <button class="library-card-save" data-id="${resource.id}" aria-label="Unsave resource">
          <i class="ri-bookmark-fill"></i>
        </button>
      </div>
      <div class="library-card-title">${resource.title}</div>
      <div class="library-card-course">
        <span class="library-card-code">${resource.code}</span>
        <span class="library-card-course-title">${resource.courseTitle}</span>
      </div>
      <div class="library-card-meta">
        <span>${resource.contributor}</span>
        <span class="dot"></span>
        <span>Saved ${formatDate(resource.date)}</span>
      </div>
    `;
    list.appendChild(card);
  });
}

// ========== PROFILE ==========
export function renderProfile() {
  document.getElementById('profile-name').value = state.user.name;
  document.getElementById('profile-email').value = state.user.email;
  document.getElementById('profile-faculty').value = state.user.faculty;
  document.getElementById('profile-level').value = state.user.level;
}

// ========== RESOURCE DETAIL ==========
export function renderDetailContent(resource) {
  const isSaved = state.savedResources.includes(resource.id);
  const size = generateFileSize(resource.id);
  
  return `
    <div class="detail">
      <h1 class="detail-title" id="sheet-title">${resource.title}</h1>
      
      <div class="detail-course">
        <span class="detail-code">${resource.code}</span>
        <span class="detail-course-title">${resource.courseTitle}</span>
      </div>

      <div class="detail-badges">
        <span class="detail-badge detail-badge-type">${resource.type}</span>
        <span class="detail-badge detail-badge-format">${resource.format}</span>
        <span class="detail-badge detail-badge-size">${size}</span>
      </div>

      <button class="detail-primary" id="detail-download">
        <i class="ri-download-2-line"></i>
        <span>Download</span>
      </button>

      <div class="detail-secondary">
        <button class="detail-action ${isSaved ? 'saved' : ''}" id="detail-save">
          <i class="ri-${isSaved ? 'bookmark-fill' : 'bookmark-line'}"></i>
          <span>${isSaved ? 'Saved' : 'Save'}</span>
        </button>
        <button class="detail-action" id="detail-share">
          <i class="ri-link"></i>
          <span>Copy link</span>
        </button>
      </div>

      ${resource.description ? `
        <div class="detail-description-label">Description</div>
        <div class="detail-description">${resource.description}</div>
      ` : ''}

      <div class="detail-meta">
        <div class="detail-meta-row">
          <span class="detail-meta-label">Contributor</span>
          <span class="detail-meta-value">${resource.contributor}</span>
        </div>
        <div class="detail-meta-row">
          <span class="detail-meta-label">Added</span>
          <span class="detail-meta-value">${formatDate(resource.date)}</span>
        </div>
        <div class="detail-meta-row">
          <span class="detail-meta-label">Level</span>
          <span class="detail-meta-value">${resource.level}</span>
        </div>
        <div class="detail-meta-row">
          <span class="detail-meta-label">Faculty</span>
          <span class="detail-meta-value">${resource.faculty}</span>
        </div>
        ${resource.downloads ? `
          <div class="detail-meta-row">
            <span class="detail-meta-label">Downloads</span>
            <span class="detail-meta-value">${resource.downloads}</span>
          </div>
        ` : ''}
      </div>

      ${resource.contributorNote ? `
        <div class="detail-contributor-note">${resource.contributorNote}</div>
      ` : ''}
    </div>
  `;
}

export function renderSkeleton() {
  return `
    <div class="detail">
      <div class="skeleton skeleton-title"></div>
      <div class="skeleton skeleton-course"></div>
      <div style="margin-bottom:20px">
        <span class="skeleton skeleton-badge"></span>
        <span class="skeleton skeleton-badge"></span>
      </div>
      <div class="skeleton skeleton-primary"></div>
      <div style="display:flex;gap:8px;margin-bottom:24px">
        <div class="skeleton skeleton-action"></div>
        <div class="skeleton skeleton-action"></div>
      </div>
      <div class="skeleton skeleton-line"></div>
      <div class="skeleton skeleton-line short"></div>
    </div>
  `;
}

export function renderResourcePage(resource) {
  const content = document.getElementById('resource-page-content');
  
  if (!resource) {
    content.innerHTML = `
      <div class="placeholder">
        <i class="ri-error-warning-line"></i>
        <h2>Resource not found</h2>
        <p>This resource may have been removed or the link is invalid.</p>
        <button class="explore-btn" data-nav="explore" style="margin-top:16px">Browse Explore</button>
      </div>
    `;
    return;
  }
  
  content.innerHTML = renderSkeleton();
  setTimeout(() => {
    content.innerHTML = renderDetailContent(resource);
  }, 300);
}

// ========== HELPERS ==========
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