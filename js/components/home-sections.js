export function renderFacultyChips(faculties) {
  const container = document.createElement('div');
  container.className = 'scroll-row';
  container.style.gap = '8px';
  
  const icons = {
    'Science': 'ri-flask-line',
    'Engineering': 'ri-settings-3-line',
    'Arts': 'ri-book-2-line',
    'Social Sciences': 'ri-line-chart-line',
    'Health Sciences': 'ri-heart-pulse-line',
    'Law': 'ri-law-line'
  };
  
  faculties.forEach(faculty => {
    const chip = document.createElement('button');
    chip.className = 'chip';
    chip.dataset.faculty = faculty;
    chip.innerHTML = `<i class="${icons[faculty] || 'ri-folder-line'}"></i> ${faculty}`;
    container.appendChild(chip);
  });
  
  return container;
}

export function renderNewsList(newsItems) {
  const container = document.createElement('div');
  container.className = 'news-list';
  
  newsItems.forEach(item => {
    const newsItem = document.createElement('a');
    newsItem.href = '#';
    newsItem.className = 'news-item';
    newsItem.innerHTML = `
      <div class="news-icon"><i class="${item.icon}"></i></div>
      <div class="news-body">
        <div class="news-title">${item.title}</div>
        <div class="news-time">${item.time}</div>
      </div>
    `;
    container.appendChild(newsItem);
  });
  
  return container;
}

export function renderGroupsLink() {
  const link = document.createElement('a');
  link.href = 'groups.html';
  link.className = 'community-link';
  link.innerHTML = `
    <i class="ri-group-line"></i>
    <div class="community-text">
      <div class="community-title">Indigenous student groups</div>
      <div class="community-sub">Find your association</div>
    </div>
    <i class="ri-arrow-right-s-line"></i>
  `;
  return link;
}