import { formatDate, generateFileSize } from '../utility/format.js';

export function renderResourceDetail(resource, options = {}) {
  const { isSaved = false, showOpenPageLink = false } = options;
  const size = generateFileSize(resource.id);
  
  let html = `
    <div class="detail">
      <h1 class="detail-title" id="sheet-title">${resource.title}</h1>
      
      <div class="detail-course">
        <span class="detail-code">${resource.code}</span>
        <span class="detail-course-title">${resource.courseTitle}</span>
      </div>

      <div class="detail-badges">
        <span class="detail-badge detail-badge-type">${resource.type}</span>
        <span class="detail-badge detail-badge-format">${resource.format}</span>
        <span class="detail-badge detail-badge-size">${size}</span>
      </div>

      <button class="btn-primary" data-action="download">
        <i class="ri-download-2-line"></i>
        <span>Download</span>
      </button>

      <div class="detail-secondary">
        <button class="btn-secondary ${isSaved ? 'saved' : ''}" data-action="save">
          <i class="ri-${isSaved ? 'bookmark-fill' : 'bookmark-line'}"></i>
          <span>${isSaved ? 'Saved' : 'Save'}</span>
        </button>
        <button class="btn-secondary" data-action="share">
          <i class="ri-link"></i>
          <span>Copy link</span>
        </button>
      </div>
  `;
  
  if (resource.description) {
    html += `
      <div class="detail-description-label">Description</div>
      <div class="detail-description">${resource.description}</div>
    `;
  }
  
  html += `
      <div class="detail-meta">
        <div class="detail-meta-row">
          <span class="detail-meta-label">Contributor</span>
          <span class="detail-meta-value">${resource.contributor}</span>
        </div>
        <div class="detail-meta-row">
          <span class="detail-meta-label">Added</span>
          <span class="detail-meta-value">${formatDate(resource.date)}</span>
        </div>
        <div class="detail-meta-row">
          <span class="detail-meta-label">Level</span>
          <span class="detail-meta-value">${resource.level}</span>
        </div>
        <div class="detail-meta-row">
          <span class="detail-meta-label">Faculty</span>
          <span class="detail-meta-value">${resource.faculty}</span>
        </div>
        ${resource.downloads ? `
          <div class="detail-meta-row">
            <span class="detail-meta-label">Downloads</span>
            <span class="detail-meta-value">${resource.downloads}</span>
          </div>
        ` : ''}
      </div>
  `;
  
  if (resource.contributorNote) {
    html += `<div class="detail-contributor-note">${resource.contributorNote}</div>`;
  }
  
  html += `</div>`;
  
  if (showOpenPageLink) {
    html += `
      <a href="resource.html?id=${resource.id}" class="detail-open-page">
        <i class="ri-external-link-line"></i>
        <span>Open full page</span>
      </a>
    `;
  }
  
  return html;
}