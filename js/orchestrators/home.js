import { $ } from '../libs/dom.js';
import { createViewState } from '../libs/view-state.js';
import { renderResourceCard } from '../components/cards.js';
import { renderNewsCard } from '../components/cards.js';
import {
  getFeatured, getRecentlyAdded, getNewsPreview, FACULTIES,
} from '../network/mock.js';

export async function initHome(rootSelector = '[data-tab-panel="tab-home"]') {
  const root = $(rootSelector);
  if (!root) return;

  const qs = new URLSearchParams(window.location.search);
  const showFeatured = qs.get('featured') === '1';
  const CONTEXT = { faculty: 'science', level: '200' };

  // ---- Search launcher ----
  const searchInput = root.querySelector('[data-widget="home-search"]');
  if (searchInput) {
    const go = () => {
      const q = searchInput.value.trim();
      window.location.href = q ? `explore.html?q=${encodeURIComponent(q)}` : 'explore.html';
    };
    searchInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') go(); });
    searchInput.addEventListener('search', go);
  }

  // ---- Featured (off by default) ----
  const featuredSection = root.querySelector('[data-section="featured"]');
  if (featuredSection) {
    if (!showFeatured) {
      featuredSection.remove();
    } else {
      try {
        const items = await getFeatured();
        if (items.length === 0) {
          featuredSection.remove();
        } else {
          const loader = featuredSection.querySelector('.catalogue-skeleton');
          const strip = document.createElement('div');
          strip.className = 'home-strip';
          items.forEach((r) => {
            const c = renderResourceCard(r);
            c.classList.add('resource-card--strip');
            strip.append(c);
          });
          loader.replaceWith(strip);
          featuredSection.hidden = false;
        }
      } catch { featuredSection.remove(); }
    }
  }

  // ---- Recently added ----
  const recentSection = root.querySelector('[data-section="recent"]');
  if (recentSection) {
    const view = createViewState(recentSection);
    try {
      const items = await getRecentlyAdded(CONTEXT);
      if (items.length === 0) {
        recentSection.remove();
      } else {
        const dataEl = recentSection.querySelector('[data-state="data"]');
        const strip = document.createElement('div');
        strip.className = 'home-strip';
        items.forEach((r) => {
          const c = renderResourceCard(r);
          c.classList.add('resource-card--strip');
          strip.append(c);
        });
        dataEl.append(strip);
        view.set('data');
      }
    } catch { recentSection.remove(); }
  }

  // ---- Faculty shortcuts ----
  const facultyRow = root.querySelector('[data-widget="faculties"]');
  if (facultyRow) {
    FACULTIES.forEach((f) => {
      const a = document.createElement('a');
      a.className = 'home-faculty';
      a.href = `explore.html?f=${f.value}`;
      a.textContent = f.label;
      facultyRow.append(a);
    });
  }

  // ---- News ----
  const newsSection = root.querySelector('[data-section="news"]');
  if (newsSection) {
    const view = createViewState(newsSection);
    try {
      const items = await getNewsPreview(3);
      if (items.length === 0) {
        newsSection.remove();
      } else {
        const dataEl = newsSection.querySelector('[data-state="data"]');
        items.forEach((n) => dataEl.append(renderNewsCard(n)));
        view.set('data');
      }
    } catch { newsSection.remove(); }
  }
}