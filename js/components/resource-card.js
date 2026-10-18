import { formatDate } from '../utility/format.js';

export function renderResourceCard(resource, options = {}) {
  const { showSaveButton = false, isSaved = false } = options;
  
  const card = document.createElement('article');
  card.className = 'list-card';
  card.setAttribute('tabindex', '0');
  card.dataset.resourceId = resource.id;
  
  card.innerHTML = `
    <div class="card-header">
      <span class="card-type">${resource.type}</span>
      <span class="card-format">${resource.format}</span>
      ${showSaveButton ? `
        <button class="card-save" data-action="save" data-id="${resource.id}" aria-label="${isSaved ? 'Unsave' : 'Save'} resource">
          <i class="ri-${isSaved ? 'bookmark-fill' : 'bookmark-line'}"></i>
        </button>
      ` : ''}
    </div>
    <div class="card-title">${resource.title}</div>
    <div class="card-course">
      <span class="card-code">${resource.code}</span>
      <span class="card-course-title">${resource.courseTitle}</span>
    </div>
    <div class="card-meta">
      <span>${resource.contributor}</span>
      ${resource.contributor && resource.date ? '<span class="dot"></span>' : ''}
      ${resource.date ? `<span>${formatDate(resource.date)}</span>` : ''}
      ${resource.downloads ? `<span class="dot"></span><span>${resource.downloads} downloads</span>` : ''}
    </div>
  `;
  
  return card;
}

export function renderFeaturedCard(resource) {
  const card = document.createElement('article');
  card.className = 'featured-card';
  card.setAttribute('tabindex', '0');
  card.dataset.resourceId = resource.id;
  
  card.innerHTML = `
    <span class="card-badge"><i class="ri-star-fill" style="font-size:10px"></i> Featured</span>
    <div class="card-title">${resource.title}</div>
    <div class="card-meta">
      <span>${resource.type}</span>
      <span class="dot"></span>
      <span>Faculty of ${resource.faculty}</span>
    </div>
  `;
  
  return card;
}

export function renderFilterChip(label, value, isActive, filterKey) {
  const chip = document.createElement('button');
  chip.className = `chip filter ${isActive ? 'active' : ''}`;
  chip.dataset.filterKey = filterKey;
  chip.dataset.filterValue = value;
  chip.innerHTML = label;
  
  if (isActive) {
    chip.innerHTML += ' <i class="ri-close-line clear"></i>';
  }
  
  return chip;
}