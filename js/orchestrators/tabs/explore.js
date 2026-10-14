// js/orchestrators/tabs/explore.js
import { StateView } from '../../widgets/state-view.js';
import { svRoot, qs } from '../../libs/utility/dom.js';

import { ResourceTile } from '../../components/cards/card.js';
import { FilterChip }   from '../../components/chips/chip.js';

import { fetchCatalogue, catalogueIsEmpty } from '../../network/explore.mock.js';

// UI-facing filter model. The orchestrator owns this; the network layer
// just receives `{ q, type }`.
const FILTERS = [
  { value: 'all',           label: 'All' },
  { value: 'past-question', label: 'Past Question' },
  { value: 'lecture-note',  label: 'Lecture Note' },
  { value: 'handout',       label: 'Handout' },
  { value: 'textbook',      label: 'Textbook' }
];

// Local state — this tab is self-contained.
const state = {
  q: '',
  type: 'all'
};

let sv = null;
let chipsBound = false;

export async function initExploreTab() {
  // Idempotent: StateView and DOM bindings are created once.
  if (!sv) {
    sv = new StateView(svRoot('explore-results'));
  }
  if (!chipsBound) {
    renderChips();
    bindChipClicks();
    bindSearch();
    chipsBound = true;
  }

  await refresh();
}

/* =========================================================
   RENDERING
   ========================================================= */

function renderChips() {
  const container = qs('#explore-chips');
  container.innerHTML = FILTERS
    .map(f => FilterChip({ ...f, active: f.value === state.type }))
    .join('');
}

function renderEcho(count) {
  const echo = qs('#explore-echo');
  if (state.type === 'all' && !state.q) {
    echo.hidden = true;
    return;
  }
  const bits = [];
  if (state.q) bits.push(`“${state.q}”`);
  if (state.type !== 'all') {
    bits.push(FILTERS.find(f => f.value === state.type)?.label ?? state.type);
  }
  echo.textContent = `${count} result${count === 1 ? '' : 's'} · ${bits.join(' · ')}`;
  echo.hidden = false;
}

/* =========================================================
   BINDINGS
   ========================================================= */

function bindChipClicks() {
  qs('#explore-chips').addEventListener('click', (e) => {
    const btn = e.target.closest('.filter-chip');
    if (!btn) return;
    const value = btn.dataset.filterValue;
    if (value === state.type) return;

    state.type = value;
    // Cheap re-render: only the chip states changed.
    qs('#explore-chips').querySelectorAll('.filter-chip').forEach(el => {
      const active = el.dataset.filterValue === value;
      el.classList.toggle('is-active', active);
      el.setAttribute('aria-pressed', String(active));
    });

    refresh();
  });
}

function bindSearch() {
  const form = qs('[data-action="explore-search"]');
  const input = form.elements.q;
  let timer = null;

  // Debounced live search; submit also works (for no-JS fallback / Enter key).
  input.addEventListener('input', () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      state.q = input.value;
      refresh();
    }, 250);
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    state.q = input.value;
    refresh();
  });
}

/* =========================================================
   REFRESH (the orchestrator's core loop)
   ========================================================= */

async function refresh() {
  sv.show('loading');

  try {
    const items = await fetchCatalogue({ q: state.q, type: state.type });

    if (items.length === 0) {
      // Two flavours of empty. Same widget, different message.
      renderEmpty(items);
      sv.show('empty');
      renderEcho(0);
      return;
    }

    // The tile needs to know if each item is already saved.
    // Saved IDs come from a real store later; for now, empty set.
    const savedIds = new Set();
    sv.render(items, (item) => ResourceTile(item, { saved: savedIds.has(item.id) }));

    bindTileActions();
    renderEcho(items.length);
  } catch (err) {
    console.error('Explore refresh failed:', err);
    sv.show('empty'); // TODO: swap for 'error' when StateView supports it cleanly
  }
}

function renderEmpty(items) {
  const slot = sv.root.querySelector('[data-empty-slot]');
  if (!slot) return;

  // catalogueIsEmpty() is checked here, not inside the renderer, because
  // this is the layer that knows *why* we're empty.
  if (catalogueIsEmpty()) {
    slot.innerHTML = `
      <i class="fas fa-inbox"></i>
      <p>Nothing has been published yet.</p>
      <span class="sv__empty-hint">Check back soon.</span>
    `;
  } else {
    slot.innerHTML = `
      <i class="fas fa-search"></i>
      <p>No resources match your filters.</p>
      <span class="sv__empty-hint">Try clearing the search or picking All.</span>
    `;
  }
}

/* =========================================================
   TILE ACTIONS (event delegation, bound once per render)
   ========================================================= */

function bindTileActions() {
  // Delegate on the mount node so re-renders don't leak listeners.
  const mount = sv.mount;
  if (mount.dataset.bound) return;
  mount.dataset.bound = '1';

  mount.addEventListener('click', (e) => {
    const save = e.target.closest('[data-save-toggle]');
    if (!save) return;
    e.preventDefault();
    e.stopPropagation();

    const tile = save.closest('.resource-tile');
    const id = Number(tile.dataset.id);

    // Optimistic UI. Real implementation calls network → Save store.
    const isSaved = save.classList.toggle('is-saved');
    const icon = save.querySelector('i');
    icon.className = isSaved ? 'fas fa-bookmark' : 'far fa-bookmark';
    save.setAttribute('aria-label', isSaved ? 'Remove from saved' : 'Save');

    // Later: dispatch a real save/unsave here, keyed by `id`.
    void id;
  });
}