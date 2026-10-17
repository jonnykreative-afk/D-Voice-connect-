/* =========================================================
   orchestrators/explore.js
   Shared by dashboard.html tab and explore.html standalone.
   ========================================================= */

import { $, $$, el } from '../libs/dom.js';
import { createViewState } from '../libs/view-state.js';
import { renderResourceCard } from '../components/cards.js';
import { renderChip } from '../components/chip.js';
import { getResources, getFilterOptions, setFixture } from '../network/mock.js';

export async function initExplore(rootSelector = '[data-widget="catalogue"]') {
  const root = $(rootSelector);
  if (!root) return;

  const view      = createViewState(root);
  const dataEl    = root.querySelector('[data-state="data"]');
  const countEl   = root.querySelector('[data-widget="result-summary"]');
  const searchEl  = root.querySelector('[data-widget="search-input"]');
  const filtersEl = $('[data-widget="filters"]');

  const qs      = new URLSearchParams(window.location.search);
  const fixture = qs.get('state');
  if (fixture) setFixture(fixture);

  const state = {
    query:  qs.get('q') || '',
    filters: { faculty: new Set(), level: new Set(), contentType: new Set(), format: new Set() },
  };

  if (searchEl && state.query) searchEl.value = state.query;

  /* ---------- Filters ---------- */

  let filterOptions = null;

  async function loadFilters() {
    try {
      filterOptions = await getFilterOptions();
      renderFilters();
    } catch (err) {
      console.error('[explore] filters failed', err);
      // Filters degrade quietly — search still works.
    }
  }

  function renderFilters() {
    if (!filtersEl || !filterOptions) return;
    filtersEl.replaceChildren(
      ...Object.entries(filterOptions).flatMap(([group, opts]) =>
        opts.map((opt) =>
          renderChip({
            value: opt.value,
            label: opt.label,
            group,
            active: state.filters[group].has(opt.value),
          })
        )
      )
    );
  }

  filtersEl?.addEventListener('click', (e) => {
    const chip = e.target.closest('[data-action="toggle-filter"]');
    if (!chip) return;
    const { group, value } = chip.dataset;
    const bucket = state.filters[group];
    if (!bucket) return;

    if (bucket.has(value)) bucket.delete(value);
    else bucket.add(value);

    renderFilters();
    load();
  });

  /* ---------- Search ---------- */

  if (searchEl) {
    let t = null;
    searchEl.addEventListener('input', () => {
      clearTimeout(t);
      t = setTimeout(() => {
        state.query = searchEl.value.trim();
        load();
      }, 250);
    });
  }

  /* ---------- Cards ---------- */

  function wireCard(card) {
    card.addEventListener('click', () => {
      console.log('[explore] open resource', card.dataset.resourceId);
    });
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });
  }

  /* ---------- Load ---------- */

  async function load() {
    view.set('loading');
    try {
      const items = await getResources({
        query:   state.query,
        filters: state.filters,
      });

      if (items.length === 0) {
        view.set('empty');
        if (countEl) countEl.textContent = '';
        return;
      }

      const cards = items.map(renderResourceCard);
      cards.forEach(wireCard);
      dataEl.replaceChildren(...cards);

      if (countEl) {
        const n = items.length;
        countEl.textContent = `${n} resource${n === 1 ? '' : 's'}`;
      }

      view.set('data');
    } catch (err) {
      console.error('[explore] load failed', err);
      view.set('error');
    }
  }

  const retryBtn = root.querySelector('[data-action="retry"]');
  if (retryBtn) retryBtn.addEventListener('click', load);

  loadFilters();
  await load();
}