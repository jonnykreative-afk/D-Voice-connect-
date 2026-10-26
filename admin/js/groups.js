// admin-groups.js — D'voice Admin Groups surface
// List, add/edit sheet, validation, soft-delete modal, restore.

import { MOCK_GROUPS } from '/js/network/api.js';
import { openForm, closeSheet } from '/js/utility/sheet.js';
import { showToast } from '/js/utility/toast.js';

let groups = [];
let showDeleted = false;

export function initGroups() {
  seedGroupsState();

  document.getElementById('add-group-btn')?.addEventListener('click', () => {
    openGroupSheet(null);
  });

  // Listen for quick action from Overview
  window.addEventListener('admin:add-group', () => {
    openGroupSheet(null);
  });

  renderGroupsList();
}

function seedGroupsState() {
  groups = MOCK_GROUPS.map(g => ({
    ...g,
    status: 'live', // live | deleted (no draft state for groups)
    updated_at: new Date(Date.now() - Math.random() * 30 * 86400000).toISOString(),
  }));
}

function renderGroupsList() {
  const container = document.getElementById('groups-list-container');
  if (!container) return;
  container.innerHTML = '';

  const visible = showDeleted
    ? groups
    : groups.filter(g => g.status !== 'deleted');

  if (visible.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <i>◈</i>
        <h2>No groups yet</h2>
        <p>Add the first indigenous group.</p>
        <button class="btn btn-primary" onclick="document.getElementById('add-group-btn').click()">Add group</button>
      </div>
    `;
    return;
  }

  // Sort: alphabetical by name
  const sorted = [...visible].sort((a, b) => a.name.localeCompare(b.name));

  sorted.forEach(group => {
    const row = document.createElement('div');
    row.className = 'resource-row';

    const badgeHtml = group.status === 'deleted'
      ? '<span class="badge badge-deleted">Deleted</span>'
      : '';

    const linksText = [
      group.whatsapp ? 'WhatsApp' : null,
      group.external ? 'External' : null,
    ].filter(Boolean).join(' · ') || 'No links';

    row.innerHTML = `
      <div class="resource-row-primary" data-action="edit">
        <div class="resource-row-title">${escapeHtml(group.name)}</div>
        <div class="resource-row-secondary">${linksText}</div>
      </div>
      ${badgeHtml}
      <div class="resource-row-actions"></div>
    `;

    row.querySelector('.resource-row-primary').addEventListener('click', () => {
      openGroupSheet(group.id);
    });

    const actionsEl = row.querySelector('.resource-row-actions');

    if (group.status !== 'deleted') {
      addRowAction(actionsEl, 'Edit', () => openGroupSheet(group.id));
      addRowAction(actionsEl, 'Soft-delete', () => confirmSoftDeleteGroup(group.id), 'danger');
    } else {
      addRowAction(actionsEl, 'Restore', () => restoreGroup(group.id));
    }

    // Show deleted toggle on first row
    if (group === sorted[0]) {
      addRowAction(actionsEl, showDeleted ? 'Hide deleted' : 'Show deleted', () => {
        showDeleted = !showDeleted;
        renderGroupsList();
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
function openGroupSheet(groupId) {
  const isEdit = groupId !== null;
  const group = isEdit ? groups.find(g => g.id === groupId) : null;

  const content = `
    <div style="padding: 20px;">
      <h3 style="margin-bottom: 16px; font-size: 17px; font-weight: 700;">${isEdit ? 'Edit group' : 'Add group'}</h3>

      <div class="warning-banner" id="group-validation-banner" hidden>Add at least one link — WhatsApp or external.</div>

      <div class="form-group">
        <label class="form-label">Group name</label>
        <input type="text" class="form-input" id="group-name" value="${escapeHtml(group?.name || '')}" placeholder="e.g. Igbo Students Association">
      </div>

      <div class="form-group">
        <label class="form-label">Description <span style="font-weight: 400; color: var(--text-dim);">(optional)</span></label>
        <textarea class="form-textarea" id="group-description" placeholder="Brief description...">${escapeHtml(group?.description || '')}</textarea>
      </div>

      <div class="form-group">
        <label class="form-label">WhatsApp link <span style="font-weight: 400; color: var(--text-dim);">(optional)</span></label>
        <input type="url" class="form-input" id="group-whatsapp" value="${escapeHtml(group?.whatsapp || '')}" placeholder="https://chat.whatsapp.com/...">
      </div>

      <div class="form-group">
        <label class="form-label">External link <span style="font-weight: 400; color: var(--text-dim);">(optional)</span></label>
        <input type="url" class="form-input" id="group-external" value="${escapeHtml(group?.external || '')}" placeholder="https://...">
      </div>
    </div>
  `;

  const actions = [
    { label: 'Cancel', variant: 'secondary', onClick: closeSheet },
    {
      label: 'Save',
      variant: 'primary',
      onClick: () => saveGroup(isEdit, groupId),
      id: 'group-save-btn'
    },
  ];

  openForm(null, async () => content, actions, isEdit ? 'Edit group' : 'Add group');

  // Set up validation after render
  setTimeout(() => {
    setupGroupValidation();
  }, 50);
}

function setupGroupValidation() {
  const whatsappInput = document.getElementById('group-whatsapp');
  const externalInput = document.getElementById('group-external');
  const banner = document.getElementById('group-validation-banner');
  const saveBtn = document.querySelector('#sheet-actions .btn-primary');

  if (!whatsappInput || !externalInput || !banner || !saveBtn) return;

  function checkValidation() {
    const hasWhatsapp = whatsappInput.value.trim().length > 0;
    const hasExternal = externalInput.value.trim().length > 0;
    const hasAtLeastOne = hasWhatsapp || hasExternal;

    banner.hidden = hasAtLeastOne;
    saveBtn.disabled = !hasAtLeastOne;
  }

  whatsappInput.addEventListener('input', checkValidation);
  externalInput.addEventListener('input', checkValidation);

  // Initial check
  checkValidation();
}

function saveGroup(isEdit, groupId) {
  const name = document.getElementById('group-name')?.value.trim();
  const description = document.getElementById('group-description')?.value.trim() || null;
  const whatsapp = document.getElementById('group-whatsapp')?.value.trim() || null;
  const external = document.getElementById('group-external')?.value.trim() || null;

  if (!name) return;

  // Validation: at least one link
  if (!whatsapp && !external) return;

  if (isEdit) {
    const group = groups.find(g => g.id === groupId);
    if (!group) return;

    Object.assign(group, {
      name, description, whatsapp, external,
      updated_at: new Date().toISOString(),
    });

    closeSheet();
    showToast(`${name} updated.`);
  } else {
    const newGroup = {
      id: Math.max(...groups.map(g => g.id), 0) + 1,
      name, description, whatsapp, external,
      status: 'live',
      updated_at: new Date().toISOString(),
    };

    groups.push(newGroup);
    closeSheet();
    showToast(`${name} added.`);
  }

  renderGroupsList();
}

// ---------- Soft-delete ----------
function confirmSoftDeleteGroup(groupId) {
  const group = groups.find(g => g.id === groupId);
  if (!group) return;

  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `
    <div class="modal" role="dialog" aria-modal="true" aria-label="Soft-delete group">
      <h3>Remove group?</h3>
      <p>Remove <strong>${escapeHtml(group.name)}</strong> from the app? It can be restored later.</p>
      <div class="modal-actions">
        <button class="btn btn-secondary" data-action="cancel">Cancel</button>
        <button class="btn btn-danger" data-action="confirm">Remove</button>
      </div>
    </div>
  `;

  overlay.querySelector('[data-action="cancel"]').addEventListener('click', () => overlay.remove());

  overlay.querySelector('[data-action="confirm"]').addEventListener('click', () => {
    group.status = 'deleted';
    group.updated_at = new Date().toISOString();
    overlay.remove();
    showToast(`${group.name} removed.`);
    renderGroupsList();
  });

  document.body.appendChild(overlay);
}

// ---------- Restore ----------
function restoreGroup(groupId) {
  const group = groups.find(g => g.id === groupId);
  if (!group) return;

  group.status = 'live';
  group.updated_at = new Date().toISOString();
  showToast(`${group.name} restored.`);
  renderGroupsList();
}

// ---------- Utility ----------
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}