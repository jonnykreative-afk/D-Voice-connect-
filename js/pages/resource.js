import { StateView } from '../utility/state-view.js';
import { showToast } from '../utility/toast.js';
import { fetchResourceById } from '../network/api.js';
import { renderResourceDetail } from '../components/resource-detail.js';

const state = {
  savedResources: [1, 3, 5, 7, 9, 11, 16, 19, 21, 25]
};

function initResourcePage() {
  const container = document.querySelector('[data-state="resource-page-content"]');
  const stateView = new StateView(container);
  
  const params = new URLSearchParams(window.location.search);
  const resourceId = params.get('id');
  
  if (!resourceId || isNaN(parseInt(resourceId))) {
    stateView.setEmpty();
    return;
  }
  
  async function loadResource() {
    stateView.setLoading();
    
    try {
      const resource = await fetchResourceById(parseInt(resourceId));
      const dataContainer = stateView.getDataContainer();
      dataContainer.innerHTML = renderResourceDetail(resource, { 
        isSaved: state.savedResources.includes(resource.id),
        showOpenPageLink: false
      });
      stateView.setData();
      
      // Wire actions
      dataContainer.querySelector('[data-action="download"]').addEventListener('click', () => {
        showToast('Download started', null, false);
      });
      
      dataContainer.querySelector('[data-action="save"]').addEventListener('click', () => {
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
      
      dataContainer.querySelector('[data-action="share"]').addEventListener('click', async () => {
        const url = window.location.href;
        try {
          await navigator.clipboard.writeText(url);
          showToast('Link copied', null, false);
        } catch (err) {
          showToast('Could not copy link', null, false);
        }
      });
      
    } catch (err) {
      stateView.setError();
    }
  }
  
  function updateSaveButton(resource) {
    const isSaved = state.savedResources.includes(resource.id);
    const saveBtn = document.querySelector('[data-action="save"]');
    if (saveBtn) {
      saveBtn.className = `btn-secondary ${isSaved ? 'saved' : ''}`;
      saveBtn.innerHTML = `
        <i class="ri-${isSaved ? 'bookmark-fill' : 'bookmark-line'}"></i>
        <span>${isSaved ? 'Saved' : 'Save'}</span>
      `;
    }
  }
  
  // Wire back button
  document.getElementById('resource-back').addEventListener('click', () => {
    window.history.back();
  });
  
  loadResource();
}

initResourcePage();