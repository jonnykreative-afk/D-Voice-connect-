import { state } from '../app.js';
import { StateView } from '../utility/state-view.js';
import { MOCK_RESOURCES } from '../network/api.js';
import { renderResourceCard } from '../components/resource-card.js';
import { openSheet } from '../utility/sheet.js';
import { renderResourceDetail } from '../components/resource-detail.js';
import { fetchResourceById } from '../network/api.js';
import { showToast } from '../utility/toast.js';

// Local state for Library
const libraryState = {
  searchQuery: '',
  sortBy: 'recent'
};

export function initLibrary() {
  const container = document.querySelector('[data-state="library-content"]');
  if (!container) return;

  const stateView = new StateView(container);
  const countEl = document.getElementById('library-count');
  const sortBtn = document.getElementById('sort-btn');
  const sortMenu = document.getElementById('sort-menu');
  const sortLabel = document.getElementById('sort-label');

  function getSavedResources() {
    let resources = MOCK_RESOURCES.filter(r => state.savedResources.includes(r.id));
    
    if (libraryState.searchQuery) {
      const query = libraryState.searchQuery.toLowerCase();
      resources = resources.filter(r => 
        r.title.toLowerCase().includes(query) ||
        r.code.toLowerCase().includes(query) ||
        r.courseTitle.toLowerCase().includes(query)
      );
    }
    
    if (libraryState.sortBy === 'title') {
      resources.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      resources.sort((a, b) => b.id - a.id);
    }
    
    return resources;
  }

  function renderLibrary() {
    const resources = getSavedResources();
    const dataContainer = stateView.getDataContainer();
    const list = dataContainer.querySelector('#library-list');
    const emptyState = container.querySelector('.state-empty');
    
    if (countEl) countEl.textContent = `${resources.length} saved resource${resources.length !== 1 ? 's' : ''}`;
    
    if (resources.length === 0) {
      stateView.setEmpty();
      
      const emptyDiv = emptyState.querySelector('#library-empty-state');
      if (emptyDiv) {
        if (libraryState.searchQuery) {
          emptyDiv.querySelector('h2').textContent = 'No results';
          emptyDiv.querySelector('p').textContent = 'Try a different search term';
          emptyDiv.querySelector('.btn-primary').style.display = 'none';
        } else {
          emptyDiv.querySelector('h2').textContent = 'Your library is empty';
          emptyDiv.querySelector('p').textContent = 'Save resources from Explore to find them here later.';
          emptyDiv.querySelector('.btn-primary').style.display = 'flex';
        }
      }
      return;
    }
    
    stateView.setData();
    list.innerHTML = '';
    
    resources.forEach(resource => {
      const card = renderResourceCard(resource, { showSaveButton: true, isSaved: true });
      
      const saveBtn = card.querySelector('[data-action="save"]');
      if (saveBtn) {
        saveBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          const index = state.savedResources.indexOf(resource.id);
          if (index > -1) {
            state.savedResources.splice(index, 1);
            showToast('Removed from library', () => {
              state.savedResources.push(resource.id);
              renderLibrary();
            });
            renderLibrary();
          }
        });
      }
      
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
  }

  async function loadLibrary() {
    stateView.setLoading();
    // Simulate load delay for skeleton visibility
    setTimeout(() => {
      renderLibrary();
    }, 300);
  }

  // Wire Search
  const searchInput = document.getElementById('library-search');
  if (searchInput) {
    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        libraryState.searchQuery = e.target.value;
        renderLibrary();
      }, 300);
    });
  }

  // Wire Sort
  if (sortBtn) {
    sortBtn.addEventListener('click', () => {
      sortMenu.classList.toggle('show');
    });
  }

  document.querySelectorAll('.sort-option').forEach(option => {
    option.addEventListener('click', () => {
      libraryState.sortBy = option.dataset.sort;
      if (sortLabel) sortLabel.textContent = option.textContent;
      document.querySelectorAll('.sort-option').forEach(o => o.classList.remove('active'));
      option.classList.add('active');
      if (sortMenu) sortMenu.classList.remove('show');
      renderLibrary();
    });
  });

  document.addEventListener('click', (e) => {
    if (sortBtn && sortMenu && !sortBtn.contains(e.target) && !sortMenu.contains(e.target)) {
      sortMenu.classList.remove('show');
    }
  });

  // Wire Retry
  const retryBtn = container.querySelector('[data-retry]');
  if (retryBtn) retryBtn.addEventListener('click', loadLibrary);

  loadLibrary();
}