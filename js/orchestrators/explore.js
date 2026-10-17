/* =========================================================
   orchestrators/explore.js
   Shared by: dashboard.html (as tab) and explore.html (standalone).
   Owns: data fetch, view-state transitions, event wiring, render order.
   ========================================================= */

import { $, $$ } from '../libs/dom.js';
import { createViewState } from '../libs/view-state.js';
import { renderResourceCard } from '../components/resource-card.js';
import { getResources, setFixture } from '../network/mock.js';

export async function initExplore(rootSelector = '[data-widget="catalogue"]') {
  const root = $(rootSelector);
  if (!root) return;

  const view   = createViewState(root);
  const dataEl = root.querySelector('[data-state="data"]');
  const countEl = root.querySelector('[data-widget="result-summary"]');
  const searchEl = root.querySelector('[data-widget="search-input"]');

  // ?state=empty|error|thin|data — used while designing states.
  const qs = new URLSearchParams(window.location.search);
  const fixture = qs.get('state');
  if (fixture) setFixture(fixture);

  let currentQuery = qs.get('q') || '';
  if (searchEl && currentQuery) searchEl.value = currentQuery;

  function wireCard(card) {
    card.addEventListener('click', () => {
      // Details sheet wiring lands in a later step. For now log.
      console.log('[explore] open resource', card.dataset.resourceId);
    });
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });
  }

  async function load() {
    view.set('loading');
    try {
      const items = await getResources({ query: currentQuery });

      if (items.length === 0) {
        // Distinguish "empty catalogue" vs "no results" later via a flag.
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

  if (searchEl) {
    let t = null;
    searchEl.addEventListener('input', () => {
      clearTimeout(t);
      t = setTimeout(() => {
        currentQuery = searchEl.value.trim();
        load();
      }, 250);
    });
  }

  const retryBtn = root.querySelector('[data-action="retry"]');
  if (retryBtn) retryBtn.addEventListener('click', load);

  await load();
}