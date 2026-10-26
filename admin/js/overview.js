// admin-overview.js — D'voice Admin Overview surface
// Quick actions, faculty health, recently changed.

import { MOCK_RESOURCES, MOCK_GROUPS, MOCK_NEWS } from '/js/network/api.js';

// We import shared admin state from faculty (single source of truth)
// For now, Overview reads from the same mock-derived state

let faculties = [];
let resources = [];
let news = [];
let groups = [];

export function initOverview(getAdminState) {
  // getAdminState is a function passed from shell that returns { faculties, resources, news, groups }
  // For now, we'll seed locally to keep surfaces decoupled
  seedOverviewState();

  // Quick action buttons
  document.getElementById('overview-container')?.addEventListener('click', (e) => {
    const action = e.target.closest('[data-quick-action]')?.dataset.quickAction;
    if (!action) return;

    if (action === 'add-resource') {
      // Route to faculty list in intent mode
      window.location.hash = '#/faculty';
      // Faculty surface picks up intent via hash or we can dispatch an event
      window.dispatchEvent(new CustomEvent('admin:enter-intent-mode'));
    } else if (action === 'add-news') {
      window.location.hash = '#/news';
      window.dispatchEvent(new CustomEvent('admin:add-news'));
    } else if (action === 'add-group') {
      window.location.hash = '#/groups';
      window.dispatchEvent(new CustomEvent('admin:add-group'));
    }
  });

  // Listen for state updates from other surfaces
  window.addEventListener('admin:state-changed', () => {
    seedOverviewState();
    renderOverview();
  });
}

function seedOverviewState() {
  // Derive from mock data — same logic as faculty
  const facultyNames = [...new Set(MOCK_RESOURCES.map(r => r.faculty))];
  faculties = facultyNames.map((name, i) => {
    const facultyResources = MOCK_RESOURCES.filter(r => r.faculty === name);
    const publishedCount = facultyResources.filter(r => !r.unavailable).length;
    return {
      id: i + 1,
      name,
      status: publishedCount >= 3 ? 'public' : 'unlisted',
      publishedCount,
    };
  });

  resources = MOCK_RESOURCES.map(r => ({
    ...r,
    status: 'published',
    updated_at: new Date(r.date).toISOString(),
    faculty_id: faculties.find(f => f.name === r.faculty)?.id,
    recordType: 'resource',
  }));

  news = MOCK_NEWS.map(n => ({
    ...n,
    status: 'published',
    updated_at: new Date(n.date).toISOString(),
    recordType: 'news',
  }));

  groups = MOCK_GROUPS.map(g => ({
    ...g,
    status: 'live',
    updated_at: new Date(Date.now() - Math.random() * 30 * 86400000).toISOString(),
    recordType: 'group',
  }));
}

export function renderOverview() {
  const container = document.getElementById('overview-container');
  if (!container) return;

  container.innerHTML = '';

  // --- Quick actions ---
  const quickActions = document.createElement('div');
  quickActions.className = 'quick-actions';
  quickActions.innerHTML = `
    <button class="quick-action-btn" data-quick-action="add-resource">
      <span class="quick-action-icon">+</span>
      <span>Add resource</span>
    </button>
    <button class="quick-action-btn" data-quick-action="add-news">
      <span class="quick-action-icon">+</span>
      <span>Add news item</span>
    </button>
    <button class="quick-action-btn" data-quick-action="add-group">
      <span class="quick-action-icon">+</span>
      <span>Add group</span>
    </button>
  `;
  container.appendChild(quickActions);

  // --- Faculty health ---
  const healthSection = document.createElement('div');
  healthSection.className = 'overview-section';
  healthSection.innerHTML = `<h3 class="section-title">Faculty health</h3>`;

  const sorted = [...faculties].sort((a, b) => {
    if (a.status !== b.status) return a.status === 'unlisted' ? -1 : 1;
    if (a.status === 'unlisted') return a.publishedCount - b.publishedCount;
    return a.name.localeCompare(b.name);
  });

  if (sorted.length === 0) {
    healthSection.innerHTML += `
      <div class="empty-state" style="padding: 32px 16px;">
        <p style="color: var(--text-muted); font-size: 14px;">No faculties yet — <a href="#/faculty" style="color: var(--primary);">create one on the Faculty surface</a>.</p>
      </div>
    `;
  } else {
    sorted.forEach(f => {
      const row = document.createElement('div');
      row.className = 'faculty-row';
      row.innerHTML = `
        <div class="faculty-row-primary">
          <div class="faculty-row-name">${escapeHtml(f.name)}</div>
        </div>
        <span class="badge badge-${f.status}">${f.status === 'public' ? 'Public' : `Unlisted (${f.publishedCount}/3)`}</span>
      `;
      row.addEventListener('click', () => {
        window.location.hash = `#/faculty/${f.id}`;
      });
      healthSection.appendChild(row);
    });
  }

  container.appendChild(healthSection);

  // --- Recently changed ---
  const recentSection = document.createElement('div');
  recentSection.className = 'overview-section';
  recentSection.innerHTML = `<h3 class="section-title">Recently changed</h3>`;

  // Combine all records, exclude deleted, sort by updated_at desc, cap at 8
  const allRecords = [
    ...resources.map(r => ({ ...r, name: r.title, action: deriveAction(r) })),
    ...news.map(n => ({ ...n, name: n.headline, action: deriveAction(n) })),
    ...groups.map(g => ({ ...g, name: g.name, action: deriveAction(g) })),
  ]
    .filter(r => r.status !== 'deleted')
    .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
    .slice(0, 8);

  if (allRecords.length === 0) {
    recentSection.innerHTML += `<p style="color: var(--text-muted); font-size: 14px; padding: 16px 0;">Nothing changed yet.</p>`;
  } else {
    allRecords.forEach(record => {
      const row = document.createElement('div');
      row.className = 'recent-row';
      const isDraft = record.status === 'draft';
      row.innerHTML = `
        <div class="recent-row-primary">
          <div class="recent-row-name">${escapeHtml(record.name)}</div>
          <div class="recent-row-meta">${record.action} · ${formatRelativeTime(record.updated_at)}</div>
        </div>
        ${isDraft ? '<span class="badge badge-draft">Draft</span>' : ''}
      `;
      row.addEventListener('click', () => {
        navigateToRecord(record);
      });
      recentSection.appendChild(row);
    });
  }

  container.appendChild(recentSection);
}

function deriveAction(record) {
  // Simple heuristic: if updated_at is close to created date, it's "Added"
  // In real implementation, surfaces would log explicit actions
  if (record.status === 'draft') return 'Saved as draft';
  return 'Edited'; // Default; real implementation would track state transitions
}

function navigateToRecord(record) {
  if (record.recordType === 'resource') {
    window.location.hash = `#/faculty/${record.faculty_id}`;
  } else if (record.recordType === 'news') {
    window.location.hash = '#/news';
  } else if (record.recordType === 'group') {
    window.location.hash = '#/groups';
  }
}

function formatRelativeTime(isoString) {
  const now = new Date();
  const then = new Date(isoString);
  const diffMs = now - then;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return then.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
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