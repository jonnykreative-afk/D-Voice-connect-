import { formatDate } from '../utility/format.js';

export function renderNewsCard(item) {
  const card = document.createElement('button');
  card.className = 'news-card';
  card.type = 'button';
  card.dataset.newsId = item.id;

  card.innerHTML = `
    ${item.image ? `
      <div class="news-card-media">
        <img src="${item.image}" alt="${item.imageAlt ?? ''}" loading="lazy" />
      </div>
    ` : ''}
    <div class="news-card-body">
      ${item.source ? `<div class="news-card-source">${item.source}</div>` : ''}
      <div class="news-card-headline">${item.headline}</div>
      ${item.excerpt ? `<div class="news-card-excerpt">${item.excerpt}</div>` : ''}
      <div class="news-card-date">${formatDate(item.date)}</div>
    </div>
  `;

  card.addEventListener('click', () => {
    window.location.href = `news.html?id=${item.id}`;
  });

  return card;
}