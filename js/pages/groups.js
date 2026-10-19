import { StateView } from '../utility/state-view.js';
import { fetchGroups } from '../network/api.js';
import { renderGroupRow } from '../components/group-row.js';

function initGroupsPage() {
  const container = document.querySelector('[data-state="groups-page-content"]');
  const stateView = new StateView(container);

  async function loadGroups() {
    stateView.setLoading();
    try {
      const groups = await fetchGroups();
      if (!groups.length) { stateView.setEmpty(); return; }
      const data = stateView.getDataContainer();
      data.innerHTML = '';
      const list = document.createElement('div');
      list.className = 'groups-list';
      groups.forEach(g => list.appendChild(renderGroupRow(g)));
      data.appendChild(list);
      stateView.setData();
    } catch (err) {
      stateView.setError();
    }
  }

  document.getElementById('groups-back').addEventListener('click', () => window.history.back());
  document.getElementById('groups-retry').addEventListener('click', loadGroups);

  loadGroups();
}

initGroupsPage();