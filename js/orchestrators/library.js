import { $, el } from '../libs/dom.js';
import { createViewState } from '../libs/view-state.js';
import { renderResourceCard } from '../components/cards.js';
import { showToast } from '../widgets/toast.js';
import { getSavedResources, unsaveResource, saveResource } from '../network/mock.js';

export async function initLibrary(rootSelector = '[data-tab-panel="tab-library"]') {
  const root = $(rootSelector);
  if (!root) return;

  const section = root.querySelector('[data-widget="saved-list"]');
  if (!section) return;

  const view    = createViewState(section);
  const dataEl  = section.querySelector('[data-state="data"]');
  const emptyEl = section.querySelector('[data-state="empty"]');
  const searchEl = root.querySelector('[data-widget="library-search"]');
  const sortBtns = root.querySelectorAll('[data-sort]');

  const state = { query: '', sort: 'recent' };

  async function load() {
    view.set('loading');
    try {
      let items = await getSavedResources();
      const hadAny = items.length > 0;

      if (state.sort === 'title') {
        items = [...items].sort((a, b) => a.title.localeCompare(b.title));
      }

      if (state.query) {
        const q = state.query.toLowerCase();
        items = items.filter((r) =>
          r.title.toLowerCase().includes(q) ||
          r.courseCode.toLowerCase().includes(q) ||
          r.courseTitle.toLowerCase().includes(q)
        );
      }

      if (items.length === 0) {
        renderEmpty(hadAny && state.query ? 'search' : 'never');
        view.set('empty');
        return;
      }

      dataEl.replaceChildren(...items.map(buildItem));
      view.set('data');
    } catch (err) {
      console.error('[library] load', err);
      view.set('error');
    }
  }

  function buildItem(r) {
    const wrap = el('div', { class: 'library-item' });
    wrap.append(renderResourceCard(r));
    wrap.append(el('button', {
      type: 'button',
      class: 'library-unsave',
      'aria-label': `Remove ${r.title} from library`,
      html: '&#x2715;',
      dataset: { action: 'unsave', id: r.id },
    }));
    return wrap;
  }

  function renderEmpty(variant) {
    emptyEl.replaceChildren();
    const box = el('div', { class: 'state-empty' });

    if (variant === 'search') {
      box.append(el('p', { class: 'state-empty__title', text: 'No matches in your library.' }));
      box.append(el('p', { class: 'state-empty__body', text: 'Try a different search or clear the field.' }));
      box.append(el('button', {
        type: 'button', class: 'btn btn--primary',
        text: 'Clear search', dataset: { action: 'clear-search' },
      }));
    } else {
      box.append(el('p', { class: 'state-empty__title', text: 'Your library is empty.' }));
      box.append(el('p', { class: 'state-empty__body',
        text: 'Save resources you want to come back to. Tap a resource in Explore and hit Save.' }));
      box.append(el('a', {
        class: 'btn btn--primary',
        href: '#tab-explore',
        text: 'Browse resources',
        dataset: { switchTab: 'tab-explore' },
      }));
    }

    emptyEl.append(box);
  }

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

  sortBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      state.sort = btn.dataset.sort;
      sortBtns.forEach((b) => {
        const on = b.dataset.sort === state.sort;
        b.classList.toggle('is-active', on);
        b.setAttribute('aria-pressed', String(on));
      });
      load();
    });
  });

  dataEl.addEventListener('click', async (e) => {
    const btn = e.target.closest('[data-action="unsave"]');
    if (!btn) return;
    const id = btn.dataset.id;
    const wrap = btn.closest('.library-item');
    wrap?.remove();

    try {
      await unsaveResource(id);
      showToast('Removed from library', {
        actionLabel: 'Undo',
        onAction: async () => {
          await saveResource(id);
          load();
        },
      });
      if (dataEl.children.length === 0) {
        renderEmpty('never');
        view.set('empty');
      }
    } catch (err) {
      console.error('[library] unsave', err);
      load();
    }
  });

  section.querySelector('[data-action="retry"]')?.addEventListener('click', load);

  emptyEl.addEventListener('click', (e) => {
    if (e.target.closest('[data-action="clear-search"]')) {
      if (searchEl) searchEl.value = '';
      state.query = '';
      load();
    }
  });

  await load();
}