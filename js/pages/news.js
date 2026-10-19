import { StateView } from '../utility/state-view.js';
import { fetchNews, fetchNewsById } from '../network/api.js';
import { renderNewsCard } from '../components/news-card.js';
import { formatDate } from '../utility/format.js';

const PAGE_SIZE = 10;

function initNewsPage() {
  const container = document.querySelector('[data-state="news-page-content"]');
  const stateView = new StateView(container);
  const titleEl = document.getElementById('news-page-title');

  const params = new URLSearchParams(window.location.search);
  const idParam = params.get('id');

  document.getElementById('news-back').addEventListener('click', () => {
    window.history.back();
  });

  // Mode router
  if (idParam !== null) {
    const id = parseInt(idParam, 10);
    if (!Number.isFinite(id)) { stateView.setNotFound(); return; }
    titleEl.textContent = 'Article';
    loadDetail(id);
  } else {
    titleEl.textContent = 'News';
    loadList();
  }

  // ---------- LIST MODE ----------
  async function loadList() {
    stateView.setLoading();
    try {
      const items = await fetchNews();
      if (!items.length) { stateView.setEmpty(); return; }
      renderListData(items);
      stateView.setData();
    } catch (err) {
      bindRetry(loadList);
      stateView.setError();
    }
  }

  function renderListData(items) {
    const data = stateView.getDataContainer();
    data.innerHTML = '';
  
    const list = document.createElement('div');
    list.className = 'news-list-page';
    list.setAttribute('aria-live', 'polite');   // announces new batches
  
    let shown = 0;
    let loading = false;
  
    const endNote = document.createElement('div');
    endNote.className = 'news-end-note';
    endNote.textContent = "You're all caught up";
    endNote.hidden = true;
  
    function appendBatch() {
      if (loading) return;
      const next = items.slice(shown, shown + PAGE_SIZE);
      if (!next.length) return;
      loading = true;
      next.forEach(item => list.appendChild(renderNewsCard(item)));
      shown += next.length;
      if (shown >= items.length) {
        endNote.hidden = false;
        observer.disconnect();
      }
      loading = false;
    }
  
    const sentinel = document.createElement('div');
    sentinel.className = 'news-scroll-sentinel';
    sentinel.setAttribute('aria-hidden', 'true');
  
    const observer = new IntersectionObserver(
      (entries) => { if (entries.some(e => e.isIntersecting)) appendBatch(); },
      { rootMargin: '200px 0px' }
    );
  
    data.appendChild(list);
    data.appendChild(sentinel);
    data.appendChild(endNote);
  
    appendBatch();          // first batch before observing — works even if IO unsupported
    observer.observe(sentinel);
  }

  // ---------- DETAIL MODE ----------
  async function loadDetail(id) {
    stateView.setLoading();
    try {
      const item = await fetchNewsById(id);
      renderDetailData(item);
      stateView.setData();
    } catch (err) {
      // Distinguish not-found from fetch error
      if (err && err.message === 'Not found') {
        stateView.setNotFound();
      } else {
        bindRetry(() => loadDetail(id));
        stateView.setError();
      }
    }
  }

  function renderDetailData(item) {
    const data = stateView.getDataContainer();
    const article = document.createElement('article');
    article.className = 'news-article';
  
    article.innerHTML = `
      ${item.source ? `<div class="news-article-source">${item.source}</div>` : ''}
      <h1 class="news-article-headline">${item.headline}</h1>
      <div class="news-article-date">${formatDate(item.date)}</div>
      ${item.image ? `
        <div class="news-article-media">
          <img src="${item.image}" alt="${item.imageAlt ?? ''}" />
        </div>
      ` : ''}
      <div class="news-article-body">
        ${item.body.map(p => `<p>${p}</p>`).join('')}
      </div>
    `;
    data.innerHTML = '';
    data.appendChild(article);
  }

  function bindRetry(fn) {
    const retry = document.getElementById('news-retry');
    if (retry) retry.onclick = fn;
  }
}

initNewsPage();