// admin-news.js — D'voice Admin News surface
// List, add/edit sheet, soft-delete modal, restore.

import { MOCK_NEWS } from '/js/network/api.js';
import { openForm, closeSheet, openPreview } from '/js/utility/sheet.js';
import { showToast } from '/js/utility/toast.js';

let news = [];
let showDeleted = false;

export function initNews() {
  seedNewsState();

  document.getElementById('add-news-btn')?.addEventListener('click', () => {
    openNewsSheet(null);
  });

  // Listen for quick action from Overview
  window.addEventListener('admin:add-news', () => {
    openNewsSheet(null);
  });

  renderNewsList();
}

function seedNewsState() {
  news = MOCK_NEWS.map(n => ({
    ...n,
    status: 'published',
    updated_at: new Date(n.date).toISOString(),
  }));
}

function renderNewsList() {
  const container = document.getElementById('news-list-container');
  if (!container) return;
  container.innerHTML = '';

  const visible = showDeleted
    ? news
    : news.filter(n => n.status !== 'deleted');

  if (visible.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <i>◈</i>
        <h2>No news yet</h2>
        <p>Publish the first item.</p>
        <button class="btn btn-primary" onclick="document.getElementById('add-news-btn').click()">Add news item</button>
      </div>
    `;
    return;
  }

  // Sort: updated_at desc
  const sorted = [...visible].sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

  sorted.forEach(item => {
    const row = document.createElement('div');
    row.className = 'resource-row';

    const badgeClass = item.status === 'published' ? 'badge-published' : item.status === 'draft' ? 'badge-draft' : 'badge-deleted';
    const badgeText = item.status === 'published' ? 'Published' : item.status === 'draft' ? 'Draft' : 'Deleted';

    const hasImage = item.image ? ' · 📷' : '';
    const sourceText = item.source || 'Office of the Founder';

    row.innerHTML = `
      <div class="resource-row-primary" data-action="edit">
        <div class="resource-row-title">${escapeHtml(item.headline)}</div>
        <div class="resource-row-secondary">${formatDate(item.date)} · ${escapeHtml(sourceText)}${hasImage}</div>
      </div>
      <span class="badge ${badgeClass}">${badgeText}</span>
      <div class="resource-row-actions"></div>
    `;

    row.querySelector('.resource-row-primary').addEventListener('click', () => {
      openNewsSheet(item.id);
    });

    const actionsEl = row.querySelector('.resource-row-actions');

    if (item.status === 'draft') {
      addRowAction(actionsEl, 'Publish', () => publishNews(item.id));
    }

    if (item.status !== 'deleted') {
      addRowAction(actionsEl, 'Edit', () => openNewsSheet(item.id));
      addRowAction(actionsEl, 'Soft-delete', () => confirmSoftDeleteNews(item.id), 'danger');
    } else {
      addRowAction(actionsEl, 'Restore', () => restoreNews(item.id));
    }

    // Overflow for show deleted
    if (item === sorted[0]) {
      addRowAction(actionsEl, showDeleted ? 'Hide deleted' : 'Show deleted', () => {
        showDeleted = !showDeleted;
        renderNewsList();
      });
    }

    container.appendChild(row);
  });
}

function addRowAction(container, label, onClick, variant = '') {
  const btn = document.createElement('button');
  btn.className = `row-action-btn ${variant}`;
  btn.textContent = label;
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    onClick();
  });
  container.appendChild(btn);
}

// ---------- Add/edit sheet ----------
function openNewsSheet(newsId) {
  const isEdit = newsId !== null;
  const item = isEdit ? news.find(n => n.id === newsId) : null;

  const content = `
    <div style="padding: 20px;">
      <h3 style="margin-bottom: 16px; font-size: 17px; font-weight: 700;">${isEdit ? 'Edit news item' : 'Add news item'}</h3>

      <div class="form-group">
        <label class="form-label">Headline</label>
        <input type="text" class="form-input" id="news-headline" value="${escapeHtml(item?.headline || '')}" placeholder="e.g. Faculty of Science opens new computer lab">
      </div>

      <div class="form-group">
        <label class="form-label">Body</label>
        <textarea class="form-textarea" id="news-body" style="min-height: 120px;" placeholder="News body text...">${escapeHtml(item?.body?.join('\n\n') || '')}</textarea>
      </div>

      <div class="form-group">
        <label class="form-label">Source</label>
        <input type="text" class="form-input" id="news-source" value="${escapeHtml(item?.source || '')}" placeholder="Office of the Founder">
        <p class="form-hint">Defaults to "Office of the Founder" if left empty.</p>
      </div>

      <div class="form-group">
        <label class="form-label">Image <span style="font-weight: 400; color: var(--text-dim);">(optional)</span></label>
        <input type="text" class="form-input" id="news-image" value="${escapeHtml(item?.image || '')}" placeholder="https://... or leave empty">
        <p class="form-hint">Mock reference in MVP — no upload yet.</p>
      </div>

      <div class="form-group">
        <label class="form-label">Date</label>
        <input type="date" class="form-input" id="news-date" value="${item?.date || new Date().toISOString().split('T')[0]}">
      </div>
    </div>
  `;

  const actions = [
    { label: 'Cancel', variant: 'secondary', onClick: closeSheet },
    ...(isEdit && item?.status === 'draft' ? [] : [{ label: 'Save as draft', variant: 'secondary', onClick: () => saveNews(isEdit, newsId, true) }]),
    {
      label: isEdit ? 'Save' : 'Publish',
      variant: 'primary',
      onClick: () => saveNews(isEdit, newsId, false)
    },
  ];

  openForm(null, async () => content, actions, isEdit ? 'Edit news item' : 'Add news item');
}

function saveNews(isEdit, newsId, asDraft) {
  const headline = document.getElementById('news-headline')?.value.trim();
  const bodyText = document.getElementById('news-body')?.value.trim();
  const source = document.getElementById('news-source')?.value.trim() || 'Office of the Founder';
  const image = document.getElementById('news-image')?.value.trim() || null;
  const date = document.getElementById('news-date')?.value || new Date().toISOString().split('T')[0];

  if (!headline || !bodyText) return;

  const body = bodyText.split('\n\n').filter(p => p.trim());

  if (isEdit) {
    const item = news.find(n => n.id === newsId);
    if (!item) return;

    const wasPublished = item.status === 'published';
    Object.assign(item, {
      headline, body, source, image, date,
      updated_at: new Date().toISOString(),
    });

    closeSheet();

    if (wasPublished && !asDraft) {
      showToast(`${headline} updated.`);
    } else if (asDraft) {
      item.status = 'draft';
      showToast(`${headline} saved as draft.`);
    } else {
      item.status = 'published';
      showToast(`${headline} published.`);
    }
  } else {
    const newItem = {
      id: Math.max(...news.map(n => n.id), 0) + 1,
      headline, body, source, image, date,
      excerpt: body[0]?.slice(0, 100) + '...' || '',
      imageAlt: '',
      status: asDraft ? 'draft' : 'published',
      updated_at: new Date().toISOString(),
    };

    news.push(newItem);
    closeSheet();

    if (asDraft) {
      showToast(`${headline} saved as draft.`);
    } else {
      showToast(`${headline} published.`);
    }
  }

  renderNewsList();
}

// ---------- Publish draft ----------
function publishNews(newsId) {
  const item = news.find(n => n.id === newsId);
  if (!item) return;

  item.status = 'published';
  item.updated_at = new Date().toISOString();
  showToast(`${item.headline} published.`);
  renderNewsList();
}

// ---------- Soft-delete ----------
function confirmSoftDeleteNews(newsId) {
  const item = news.find(n => n.id === newsId);
  if (!item) return;

  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `
    <div class="modal" role="dialog" aria-modal="true" aria-label="Soft-delete news">
      <h3>Remove news item?</h3>
      <p>Remove <strong>${escapeHtml(item.headline)}</strong> from the app? It can be restored later.</p>
      <div class="modal-actions">
        <button class="btn btn-secondary" data-action="cancel">Cancel</button>
        <button class="btn btn-danger" data-action="confirm">Remove</button>
      </div>
    </div>
  `;

  overlay.querySelector('[data-action="cancel"]').addEventListener('click', () => overlay.remove());

  overlay.querySelector('[data-action="confirm"]').addEventListener('click', () => {
    item.status = 'deleted';
    item.updated_at = new Date().toISOString();
    overlay.remove();
    showToast(`${item.headline} removed.`);
    renderNewsList();
  });

  document.body.appendChild(overlay);
}

// ---------- Restore ----------
function restoreNews(newsId) {
  const item = news.find(n => n.id === newsId);
  if (!item) return;

  item.status = 'draft'; // restored as draft
  item.updated_at = new Date().toISOString();
  showToast(`${item.headline} restored.`);
  renderNewsList();
}

// ---------- Utility ----------
function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}