// js/orchestrators/tabs/reading.js
import { StateView } from '../../widgets/state-view.js';
import { ResourceTile } from '../../components/cards/card.js';
import { fetchRecent, fetchSaved } from '../../network/reading.mock.js';
import { getAuth } from '../../libs/state/auth.js';

const VIEWS = ['recent', 'saved'];
let state = { view: 'recent' };
let sv = null;
let bound = false;

export async function initReadingTab() {
  if (!sv) {
    sv = new StateView(document.querySelector('.sv[data-sv="reading-results"]'));
  }
  if (!bound) {
    bindViewSwitch();
    bound = true;
  }
  await refresh();
}

/* =========================================================
   BINDINGS
   ========================================================= */

function bindViewSwitch() {
  document.querySelector('.reading-switch').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-reading-view]');
    if (!btn) return;
    const view = btn.dataset.readingView;
    if (view === state.view) return;

    state.view = view;
    document.querySelectorAll('.reading-tab').forEach(el => {
      el.classList.toggle('is-active', el.dataset.readingView === view);
    });
    refresh();
  });
}

/* =========================================================
   REFRESH
   ========================================================= */

async function refresh() {
  // Auth gate — plan says Reading requires sign-in.
  const auth = getAuth();
  if (!auth) {
    renderEmpty('auth');
    sv.show('empty');
    return;
  }

  sv.show('loading');

  try {
    const items = state.view === 'recent'
      ? await fetchRecent()
      : await fetchSaved();

    if (items.length === 0) {
      renderEmpty(state.view);
      sv.show('empty');
      return;
    }

    sv.render(items, item => ResourceTile(item, { hideSave: true }));
  } catch (err) {
    console.error('Reading refresh failed:', err);
    renderEmpty('error');
    sv.show('empty');
  }
}

/* =========================================================
   EMPTY STATES — one per reason
   ========================================================= */

function renderEmpty(reason) {
  const slot = sv.root.querySelector('[data-empty-slot]');
  if (!slot) return;

  const content = {
    auth: `
      <i class="fas fa-lock"></i>
      <p>Sign in to see what you've read and saved.</p>
      <span class="sv__empty-hint">Your history syncs across devices.</span>
    `,
    recent: `
      <i class="fas fa-book"></i>
      <p>Nothing read yet.</p>
      <span class="sv__empty-hint">Resources you open will appear here.</span>
    `,
    saved: `
      <i class="fas fa-bookmark"></i>
      <p>Nothing saved yet.</p>
      <span class="sv__empty-hint">Bookmark a resource to keep it here.</span>
    `,
    error: `
      <i class="fas fa-triangle-exclamation"></i>
      <p>Couldn't load this view.</p>
      <span class="sv__empty-hint">Try switching views or reloading.</span>
    `
  };

  slot.innerHTML = content[reason] ?? content.error;
}