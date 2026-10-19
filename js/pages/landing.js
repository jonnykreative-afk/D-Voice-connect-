import { StateView } from '../utility/state-view.js';
import { fetchResources, FILTER_OPTIONS } from '../network/api.js';

const PROOF_COUNT = 5;

function initLanding() {
  loadCatalogue();
}

async function loadCatalogue() {
  const container = document.querySelector('[data-state="landing-proof"]');
  const stateView = new StateView(container);
  const statsEl = document.getElementById('landing-stats');
  const facultiesEl = document.getElementById('landing-faculties');

  try {
    const all = await fetchResources();

    // Stats — real counts, never invented
    if (statsEl) {
      if (!all.length) {
        statsEl.textContent = '';
      } else {
        const types = new Set(all.map(r => r.type)).size;
        statsEl.textContent =
          `${all.length} resource${all.length === 1 ? '' : 's'} across ${types} material types.`;
      }
    }

    // Faculty chips — from the catalogue, not from a hardcoded list
    if (facultiesEl) {
      facultiesEl.innerHTML = '';
      const faculties = FILTER_OPTIONS.faculty.filter(f =>
        all.some(r => r.faculty === f)
      );
      faculties.forEach(name => {
        const chip = document.createElement('span');
        chip.className = 'landing-faculty-chip';
        chip.textContent = name;
        facultiesEl.appendChild(chip);
      });
    }

    // Proof strip
    if (!all.length) {
      stateView.setEmpty();
      return;
    }
    const proof = all.slice(0, PROOF_COUNT);
    const data = stateView.getDataContainer();
    const row = document.createElement('div');
    row.className = 'landing-proof-row';
    proof.forEach(resource => row.appendChild(renderProofCard(resource)));
    data.innerHTML = '';
    data.appendChild(row);
    stateView.setData();
  } catch (err) {
    stateView.setError();
    if (statsEl) statsEl.textContent = '';
  }
}

function renderProofCard(resource) {
  const card = document.createElement('button');
  card.className = 'proof-card';
  card.type = 'button';
  card.innerHTML = `
    <span class="card-type">${resource.type}</span>
    <span class="card-title">${resource.title}</span>
    <span class="card-code">${resource.code}</span>
  `;
  card.addEventListener('click', () => {
    window.location.href = `resource.html?id=${resource.id}`;
  });
  return card;
}

initLanding();