// admin-faculty.js — D'voice Admin Faculty surface
// Level 1: Faculty list. Level 2: Faculty detail + resource management.
// Enforces the 3-published-resource floor (plan §5).

import { MOCK_RESOURCES, MOCK_GROUPS, MOCK_NEWS, FILTER_OPTIONS } from '/js/network/api.js';
import { openSheet, closeSheet, openForm, openPreview } from '/js/utility/sheet.js';
import { showToast, showToastWithUndo } from '/js/utility/toast.js';
import { Combobox } from '/js/utility/combobox.js';

// ---------- Admin state (extends mock API) ----------
// We wrap the mock data with admin-needed fields: status, updated_at, faculty_id

let faculties = [];
let resources = [];
let showDeleted = false;
let currentFacultyId = null;
let intentMode = false;
let addAnotherToggle = false;
let lastSavedResourceId = null;

// ---------- Init ----------
export function initFaculty() {
  // Seed admin state from mock data
  seedAdminState();

  // Level 1 events
  document.getElementById('create-faculty-btn').addEventListener('click', openCreateFacultySheet);

  // Level 2 events
  document.getElementById('faculty-back-btn').addEventListener('click', () => {
    window.location.hash = '#/faculty';
  });
  document.getElementById('add-resource-btn').addEventListener('click', () => {
    openResourceSheet(null, currentFacultyId);
  });
  document.getElementById('faculty-overflow-btn').addEventListener('click', (e) => {
    openFacultyOverflow(e.currentTarget);
  });

  // Rename: click name → inline edit → save → confirm modal
  document.getElementById('faculty-detail-name').addEventListener('click', startInlineRename);

  // Listen for hash changes to handle :id routing
  window.addEventListener('hashchange', handleFacultyRoute);
}

function seedAdminState() {
  // Derive faculties from MOCK_RESOURCES
  const facultyNames = [...new Set(MOCK_RESOURCES.map(r => r.faculty))];
  faculties = facultyNames.map((name, i) => {
    const facultyResources = MOCK_RESOURCES.filter(r => r.faculty === name);
    const publishedCount = facultyResources.filter(r => !r.unavailable).length;
    return {
      id: i + 1,
      name,
      status: publishedCount >= 3 ? 'public' : 'unlisted',
      publishedCount,
      studentCount: Math.floor(Math.random() * 500) + 50, // mock
      created_at: new Date(Date.now() - Math.random() * 90 * 86400000).toISOString(),
    };
  });

  // Map resources with admin fields
  resources = MOCK_RESOURCES.map(r => ({
    ...r,
    status: 'published', // published | draft | deleted
    updated_at: new Date(r.date).toISOString(),
    faculty_id: faculties.find(f => f.name === r.faculty)?.id,
  }));
}

// ---------- Routing ----------
export function handleFacultyRoute() {
  const hash = window.location.hash;
  const match = hash.match(/^#\/faculty\/(\d+)/);

  if (match) {
    const id = parseInt(match[1]);
    showFacultyDetail(id);
  } else if (hash === '#/faculty') {
    showFacultyList();
  }
}

function showFacultyList() {
  currentFacultyId = null;
  document.getElementById('faculty-list-view').hidden = false;
  document.getElementById('faculty-detail-view').hidden = true;
  renderFacultyList();
}

function showFacultyDetail(id) {
  const faculty = faculties.find(f => f.id === id);
  if (!faculty) {
    window.location.hash = '#/faculty';
    return;
  }

  currentFacultyId = id;
  document.getElementById('faculty-list-view').hidden = true;
  document.getElementById('faculty-detail-view').hidden = false;

  renderFacultyDetail(faculty);
}

// ---------- Level 1: Faculty list ----------
function renderFacultyList() {
  const container = document.getElementById('faculty-list-container');
  container.innerHTML = '';

  // Intent mode prompt
  if (intentMode) {
    const prompt = document.createElement('div');
    prompt.className = 'intent-prompt';
    prompt.textContent = 'Pick a faculty to add a resource to.';
    container.appendChild(prompt);
  }

  if (faculties.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <i>◈</i>
        <h2>No faculties yet</h2>
        <p>Create one to start adding resources.</p>
        <button class="btn btn-primary" onclick="document.getElementById('create-faculty-btn').click()">Create faculty</button>
      </div>
    `;
    return;
  }

  // Sort: unlisted first ascending by n, then public alphabetical
  const sorted = [...faculties].sort((a, b) => {
    if (a.status !== b.status) return a.status === 'unlisted' ? -1 : 1;
    if (a.status === 'unlisted') return a.publishedCount - b.publishedCount;
    return a.name.localeCompare(b.name);
  });

  sorted.forEach(faculty => {
    const row = document.createElement('div');
    row.className = 'faculty-row';
    row.innerHTML = `
      <div class="faculty-row-primary">
        <div class="faculty-row-name">${escapeHtml(faculty.name)}</div>
        <div class="faculty-row-secondary">${faculty.publishedCount} published resource${faculty.publishedCount !== 1 ? 's' : ''}</div>
      </div>
      <span class="badge badge-${faculty.status}">${faculty.status === 'public' ? 'Public' : `Unlisted (${faculty.publishedCount}/3)`}</span>
    `;

    row.addEventListener('click', () => {
      if (intentMode) {
        // Intent mode: open add-resource sheet directly
        intentMode = false;
        openResourceSheet(null, faculty.id);
      } else {
        window.location.hash = `#/faculty/${faculty.id}`;
      }
    });

    container.appendChild(row);
  });
}

// ---------- Level 2: Faculty detail ----------
function renderFacultyDetail(faculty) {
  // Header
  const nameEl = document.getElementById('faculty-detail-name');
  nameEl.textContent = faculty.name;
  nameEl.contentEditable = 'false';
  nameEl.classList.remove('editing');

  updateFacultyBadge(faculty);

  // Meta line
  const metaEl = document.getElementById('faculty-detail-meta');
  metaEl.textContent = `${faculty.publishedCount} published resource${faculty.publishedCount !== 1 ? 's' : ''} · ${faculty.studentCount} students signed up`;

  // Resources list
  renderResourceList(faculty);
}

function updateFacultyBadge(faculty) {
  const badge = document.getElementById('faculty-detail-badge');
  if (faculty.status === 'public') {
    badge.className = 'badge badge-public';
    badge.textContent = 'Public';
  } else {
    badge.className = 'badge badge-unlisted';
    badge.textContent = `Unlisted (${faculty.publishedCount}/3)`;
  }
}

function renderResourceList(faculty) {
  const container = document.getElementById('faculty-resources-container');
  container.innerHTML = '';

  const facultyResources = resources.filter(r => r.faculty_id === faculty.id);
  const visible = showDeleted
    ? facultyResources
    : facultyResources.filter(r => r.status !== 'deleted');

  if (visible.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <i>◈</i>
        <h2>No resources yet</h2>
        <p>Add the first resource to this faculty.</p>
      </div>
    `;
    return;
  }

  // Sort: published first, then draft, then deleted; within group by updated_at desc
  const statusOrder = { published: 0, draft: 1, deleted: 2 };
  const sorted = [...visible].sort((a, b) => {
    if (statusOrder[a.status] !== statusOrder[b.status]) return statusOrder[a.status] - statusOrder[b.status];
    return new Date(b.updated_at) - new Date(a.updated_at);
  });

  sorted.forEach(resource => {
    const row = document.createElement('div');
    row.className = 'resource-row';

    const badgeClass = resource.status === 'published' ? 'badge-published' : resource.status === 'draft' ? 'badge-draft' : 'badge-deleted';
    const badgeText = resource.status === 'published' ? 'Published' : resource.status === 'draft' ? 'Draft' : 'Deleted';

    row.innerHTML = `
      <div class="resource-row-primary" data-action="edit">
        <div class="resource-row-title">${escapeHtml(resource.title)}</div>
        <div class="resource-row-secondary">${escapeHtml(resource.code)} · ${escapeHtml(resource.level)} level · ${escapeHtml(resource.type)}</div>
      </div>
      <span class="badge ${badgeClass}">${badgeText}</span>
      <div class="resource-row-actions"></div>
    `;

    // Click title → edit sheet
    row.querySelector('.resource-row-primary').addEventListener('click', () => {
      openResourceSheet(resource.id, faculty.id);
    });

    // Row actions
    const actionsEl = row.querySelector('.resource-row-actions');

    if (resource.status === 'draft') {
      addRowAction(actionsEl, 'Publish', () => publishResource(resource.id));
    }

    if (resource.status !== 'deleted') {
      addRowAction(actionsEl, 'Edit', () => openResourceSheet(resource.id, faculty.id));
      addRowAction(actionsEl, 'Soft-delete', () => confirmSoftDeleteResource(resource.id), 'danger');
    } else {
      addRowAction(actionsEl, 'Restore', () => restoreResource(resource.id));
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

// ---------- Faculty overflow menu ----------
function openFacultyOverflow(anchor) {
  const menu = document.createElement('div');
  menu.className = 'overflow-menu';
  menu.innerHTML = `<button data-action="toggle-deleted">${showDeleted ? 'Hide deleted' : 'Show deleted'}</button>`;

  positionMenu(menu, anchor);
  document.body.appendChild(menu);

  menu.querySelector('[data-action="toggle-deleted"]').addEventListener('click', () => {
    showDeleted = !showDeleted;
    menu.remove();
    const faculty = faculties.find(f => f.id === currentFacultyId);
    if (faculty) renderResourceList(faculty);
  });
}

function positionMenu(menu, anchor) {
  const rect = anchor.getBoundingClientRect();
  menu.style.top = `${rect.bottom + 4}px`;
  menu.style.right = `${window.innerWidth - rect.right}px`;

  // Close on outside click
  setTimeout(() => {
    document.addEventListener('mousedown', function close(e) {
      if (!menu.contains(e.target)) {
        menu.remove();
        document.removeEventListener('mousedown', close);
      }
    });
  }, 0);
}

// ---------- F1: Create faculty ----------
function openCreateFacultySheet() {
  const content = `
    <div style="padding: 20px;">
      <h3 style="margin-bottom: 16px; font-size: 17px; font-weight: 700;">Create faculty</h3>
      <div class="form-group">
        <label class="form-label" for="new-faculty-name">Faculty name</label>
        <input type="text" class="form-input" id="new-faculty-name" placeholder="e.g. Science" autocomplete="off">
      </div>
    </div>
  `;

  openForm(null, async () => content, [
    { label: 'Cancel', variant: 'secondary', onClick: closeSheet },
    {
      label: 'Create',
      variant: 'primary',
      onClick: () => {
        const name = document.getElementById('new-faculty-name').value.trim();
        if (!name) return;

        const newFaculty = {
          id: Math.max(...faculties.map(f => f.id), 0) + 1,
          name,
          status: 'unlisted',
          publishedCount: 0,
          studentCount: 0,
          created_at: new Date().toISOString(),
        };

        faculties.push(newFaculty);
        closeSheet();
        showToast(`${name} created.`);

        // If in intent mode, open add-resource sheet immediately
        if (intentMode) {
          intentMode = false;
          openResourceSheet(null, newFaculty.id);
        } else {
          renderFacultyList();
        }
      }
    }
  ], 'Create faculty');
}

// ---------- F2: Rename faculty (Option A — inline edit + confirm modal) ----------
function startInlineRename() {
  const nameEl = document.getElementById('faculty-detail-name');
  const faculty = faculties.find(f => f.id === currentFacultyId);
  if (!faculty) return;

  const originalName = faculty.name;
  nameEl.contentEditable = 'true';
  nameEl.classList.add('editing');
  nameEl.focus();

  // Select all text
  const range = document.createRange();
  range.selectNodeContents(nameEl);
  const sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);

  function finishRename() {
    nameEl.contentEditable = 'false';
    nameEl.classList.remove('editing');
    nameEl.removeEventListener('blur', finishRename);
    nameEl.removeEventListener('keydown', handleKey);

    const newName = nameEl.textContent.trim();
    if (!newName || newName === originalName) {
      nameEl.textContent = originalName;
      return;
    }

    // Show confirm modal
    showRenameModal(faculty, originalName, newName);
  }

  function handleKey(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      nameEl.blur();
    } else if (e.key === 'Escape') {
      nameEl.textContent = originalName;
      nameEl.blur();
    }
  }

  nameEl.addEventListener('blur', finishRename);
  nameEl.addEventListener('keydown', handleKey);
}

function showRenameModal(faculty, oldName, newName) {
  const affectedResources = resources.filter(r => r.faculty_id === faculty.id && r.status === 'published').length;

  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `
    <div class="modal" role="dialog" aria-modal="true" aria-label="Rename faculty">
      <h3>Rename faculty?</h3>
      <p>Renaming <strong>${escapeHtml(oldName)}</strong> to <strong>${escapeHtml(newName)}</strong> changes the public label on ${affectedResources} published resource${affectedResources !== 1 ? 's' : ''} and ${faculty.studentCount} student sign-ups.</p>
      <div class="modal-actions">
        <button class="btn btn-secondary" data-action="cancel">Cancel</button>
        <button class="btn btn-primary" data-action="confirm">Rename</button>
      </div>
    </div>
  `;

  overlay.querySelector('[data-action="cancel"]').addEventListener('click', () => {
    overlay.remove();
    document.getElementById('faculty-detail-name').textContent = oldName;
  });

  overlay.querySelector('[data-action="confirm"]').addEventListener('click', () => {
    faculty.name = newName;
    // Update all resources in this faculty
    resources.forEach(r => {
      if (r.faculty_id === faculty.id) r.faculty = newName;
    });

    overlay.remove();
    document.getElementById('faculty-detail-name').textContent = newName;
    showToast(`${oldName} renamed to ${newName}`);

    // Update meta line
    const metaEl = document.getElementById('faculty-detail-meta');
    metaEl.textContent = `${faculty.publishedCount} published resource${faculty.publishedCount !== 1 ? 's' : ''} · ${faculty.studentCount} students signed up`;
  });

  document.body.appendChild(overlay);
}

// ---------- Resource sheet (add/edit) ----------
function openResourceSheet(resourceId, facultyId) {
  const isEdit = resourceId !== null;
  const resource = isEdit ? resources.find(r => r.id === resourceId) : null;
  const faculty = faculties.find(f => f.id === (facultyId || resource?.faculty_id));

  if (!faculty) return;

  const formId = `resource-form-${Date.now()}`;

  const content = `
    <div style="padding: 20px;" id="${formId}">
      <h3 style="margin-bottom: 16px; font-size: 17px; font-weight: 700;">${isEdit ? 'Edit resource' : 'Add resource'}</h3>

      <div class="warning-banner" id="a2-warning" hidden></div>

      <div class="form-group">
        <label class="form-label">Title</label>
        <input type="text" class="form-input" id="res-title" value="${escapeHtml(resource?.title || '')}" placeholder="e.g. Calculus II Past Questions 2024">
      </div>

      <div class="form-group">
        <label class="form-label">Course code</label>
        <input type="text" class="form-input" id="res-code" value="${escapeHtml(resource?.code || '')}" placeholder="e.g. MTH 201">
      </div>

      <div class="form-group">
        <label class="form-label">Course title</label>
        <input type="text" class="form-input" id="res-course-title" value="${escapeHtml(resource?.courseTitle || '')}" placeholder="e.g. Calculus II">
      </div>

      <div class="form-group">
        <label class="form-label">Content type</label>
        <select class="form-select" id="res-type">
          ${FILTER_OPTIONS.type.map(t => `<option value="${escapeHtml(t)}" ${resource?.type === t ? 'selected' : ''}>${escapeHtml(t)}</option>`).join('')}
        </select>
      </div>

      <div class="form-group">
        <label class="form-label">Format</label>
        <select class="form-select" id="res-format">
          ${FILTER_OPTIONS.format.map(f => `<option value="${escapeHtml(f)}" ${resource?.format === f ? 'selected' : ''}>${escapeHtml(f)}</option>`).join('')}
        </select>
      </div>

      <div class="form-group">
        <label class="form-label">Level</label>
        <select class="form-select" id="res-level">
          ${FILTER_OPTIONS.level.map(l => `<option value="${escapeHtml(l)}" ${resource?.level === l ? 'selected' : ''}>${escapeHtml(l)}</option>`).join('')}
        </select>
      </div>

      <div class="form-group">
        <label class="form-label">Faculty</label>
        <div class="combobox-wrapper">
          <input type="text" class="form-input" id="res-faculty-input" value="${escapeHtml(faculty.name)}" placeholder="Select faculty" autocomplete="off">
          <div class="combobox-menu" id="res-faculty-menu"></div>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">Contributor</label>
        <input type="text" class="form-input" id="res-contributor" value="${escapeHtml(resource?.contributor || '')}" placeholder="e.g. Dr. Adebayo">
      </div>

      <div class="form-group">
        <label class="form-label">Description <span style="font-weight: 400; color: var(--text-dim);">(optional)</span></label>
        <textarea class="form-textarea" id="res-description" placeholder="Brief description...">${escapeHtml(resource?.description || '')}</textarea>
      </div>

      <div class="form-group">
        <label class="form-label">File reference</label>
        <input type="text" class="form-input" id="res-file" value="${escapeHtml(resource?.file || '')}" placeholder="mock-file-reference.pdf">
        <p class="form-hint">Mock string in MVP — no upload yet.</p>
      </div>

      ${!isEdit ? `
      <div class="add-another-row">
        <span class="add-another-label">Add another</span>
        <button class="toggle ${addAnotherToggle ? 'on' : ''}" id="add-another-toggle" aria-label="Toggle add another">
          <span class="toggle-knob"></span>
        </button>
      </div>
      ` : ''}
    </div>
  `;

  const actions = [
    { label: 'Cancel', variant: 'secondary', onClick: closeSheet },
    ...(isEdit ? [] : [{ label: 'Save as draft', variant: 'secondary', onClick: () => saveResource(formId, false, true) }]),
    {
      label: isEdit ? 'Save' : 'Publish',
      variant: 'primary',
      onClick: () => saveResource(formId, isEdit, false),
      id: 'save-btn'
    },
  ];

  openForm(null, async () => content, actions, isEdit ? 'Edit resource' : 'Add resource');

  // Initialize combobox after sheet renders
  setTimeout(() => {
    initFacultyCombobox(faculty);

    // Add another toggle
    const toggle = document.getElementById('add-another-toggle');
    if (toggle) {
      toggle.addEventListener('click', () => {
        addAnotherToggle = !addAnotherToggle;
        toggle.classList.toggle('on', addAnotherToggle);

        // If turning off and we have a last saved resource, show preview
        if (!addAnotherToggle && lastSavedResourceId) {
          showDeferredPreview(lastSavedResourceId);
        }
      });
    }

    // A2 warning: watch faculty/level changes in edit mode
    if (isEdit) {
      setupA2Warning(resource, faculty);
    }
  }, 50);
}

function initFacultyCombobox(selectedFaculty) {
  const input = document.getElementById('res-faculty-input');
  const menu = document.getElementById('res-faculty-menu');
  if (!input || !menu) return;

  const combobox = new Combobox({
    inputEl: input,
    menuEl: menu,
    source: faculties.map(f => ({ id: f.id, name: f.name })),
    placeholder: 'Select faculty',
    allowEmpty: true,
    onChange: (picked) => {
      if (picked) {
        input.dataset.facultyId = picked.value;
      }
    }
  });

  // Pre-select
  combobox.setValue(selectedFaculty.id, selectedFaculty.name);
  input.dataset.facultyId = selectedFaculty.id;
}

function setupA2Warning(resource, originFaculty) {
  const warningEl = document.getElementById('a2-warning');
  const facultyInput = document.getElementById('res-faculty-input');
  const levelSelect = document.getElementById('res-level');
  const saveBtn = document.querySelector('#sheet-actions .btn-primary');

  function checkBlock() {
    const newFacultyId = parseInt(facultyInput.dataset.facultyId);
    const newLevel = levelSelect.value;
    const facultyChanged = newFacultyId !== originFaculty.id;
    const levelChanged = newLevel !== resource.level;

    if (!facultyChanged && !levelChanged) {
      warningEl.hidden = true;
      saveBtn.disabled = false;
      return;
    }

    // Show warning
    warningEl.hidden = false;
    warningEl.className = 'warning-banner';

    if (facultyChanged) {
      // Check if origin faculty would drop below 3
      const originPublished = resources.filter(r => r.faculty_id === originFaculty.id && r.status === 'published' && r.id !== resource.id).length;
      const wouldDrop = originPublished < 3;

      if (wouldDrop) {
        warningEl.classList.add('blocking');
        warningEl.textContent = `Saving this would leave ${originFaculty.name} with ${originPublished} published resources. Add another resource to ${originFaculty.name} or change another resource's faculty before moving this one.`;
        saveBtn.disabled = true;
      } else {
        warningEl.textContent = `This changes who sees this under "Recently added."`;
        saveBtn.disabled = false;
      }
    } else {
      warningEl.textContent = `This changes who sees this under "Recently added."`;
      saveBtn.disabled = false;
    }
  }

  facultyInput.addEventListener('change', checkBlock);
  levelSelect.addEventListener('change', checkBlock);

  // Also check on combobox pick
  const observer = new MutationObserver(checkBlock);
  observer.observe(facultyInput, { attributes: true, attributeFilter: ['data-faculty-id'] });
}

function saveResource(formId, isEdit, asDraft) {
  const title = document.getElementById('res-title')?.value.trim();
  const code = document.getElementById('res-code')?.value.trim();
  const courseTitle = document.getElementById('res-course-title')?.value.trim();
  const type = document.getElementById('res-type')?.value;
  const format = document.getElementById('res-format')?.value;
  const level = document.getElementById('res-level')?.value;
  const facultyInput = document.getElementById('res-faculty-input');
  const facultyId = parseInt(facultyInput?.dataset.facultyId);
  const contributor = document.getElementById('res-contributor')?.value.trim();
  const description = document.getElementById('res-description')?.value.trim();
  const file = document.getElementById('res-file')?.value.trim();

  if (!title || !code || !courseTitle || !facultyId) {
    // Basic validation — could show banner
    return;
  }

  const faculty = faculties.find(f => f.id === facultyId);
  if (!faculty) return;

  if (isEdit) {
    // Edit mode
    const resourceId = parseInt(document.querySelector('#sheet-actions .btn-primary').dataset.resourceId);
    const resource = resources.find(r => r.id === resourceId);
    if (!resource) return;

    const originFaculty = faculties.find(f => f.id === resource.faculty_id);
    const facultyChanged = facultyId !== resource.faculty_id;

    // Check block rule
    if (facultyChanged && originFaculty) {
      const originPublishedAfter = resources.filter(r => r.faculty_id === originFaculty.id && r.status === 'published' && r.id !== resourceId).length;
      if (originPublishedAfter < 3) {
        // Blocked — should not reach here because button is disabled
        return;
      }
    }

    // Apply changes
    const wasPublished = resource.status === 'published';
    Object.assign(resource, {
      title, code, courseTitle, type, format, level,
      faculty: faculty.name,
      faculty_id: facultyId,
      contributor, description, file,
      updated_at: new Date().toISOString(),
    });

    closeSheet();

    if (wasPublished) {
      showToast(`${title} updated.`);
    } else if (asDraft) {
      showToast(`${title} saved as draft.`);
    } else {
      // Publishing a draft
      resource.status = 'published';
      showToast(`${title} published.`);
      checkFacultyPublic(faculty);
    }

    // Re-render
    updateFacultyCounts();
    if (currentFacultyId) {
      const currentFaculty = faculties.find(f => f.id === currentFacultyId);
      if (currentFaculty) renderFacultyDetail(currentFaculty);
    }
  } else {
    // Add mode
    const newResource = {
      id: Math.max(...resources.map(r => r.id), 0) + 1,
      title, code, courseTitle, type, format, level,
      faculty: faculty.name,
      faculty_id: facultyId,
      contributor, description, file,
      date: new Date().toISOString().split('T')[0],
      downloads: 0,
      status: asDraft ? 'draft' : 'published',
      updated_at: new Date().toISOString(),
    };

    resources.push(newResource);
    lastSavedResourceId = newResource.id;

    if (asDraft) {
      closeSheet();
      showToast(`${title} saved as draft.`);
    } else {
      // Publish
      if (addAnotherToggle) {
        // Clear form in place, don't preview
        clearResourceForm();
        showToast(`Published to ${faculty.name} · ${level} level`);
        checkFacultyPublic(faculty);
      } else {
        // Close form, show preview
        closeSheet();
        showToast(`Published to ${faculty.name} · ${level} level`);
        checkFacultyPublic(faculty);
        showResourcePreview(newResource.id);
      }
    }

    updateFacultyCounts();
    if (currentFacultyId) {
      const currentFaculty = faculties.find(f => f.id === currentFacultyId);
      if (currentFaculty) renderFacultyDetail(currentFaculty);
    }
  }
}

function clearResourceForm() {
  const fields = ['res-title', 'res-code', 'res-course-title', 'res-contributor', 'res-description', 'res-file'];
  fields.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  // Reset selects to first option
  ['res-type', 'res-format', 'res-level'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.selectedIndex = 0;
  });
}

function checkFacultyPublic(faculty) {
  const publishedCount = resources.filter(r => r.faculty_id === faculty.id && r.status === 'published').length;
  faculty.publishedCount = publishedCount;

  if (publishedCount >= 3 && faculty.status !== 'public') {
    faculty.status = 'public';
    setTimeout(() => {
      showToast(`${faculty.name} is now public`);
    }, 500);
  } else if (publishedCount < 3 && faculty.status === 'public') {
    faculty.status = 'unlisted';
  }
}

function updateFacultyCounts() {
  faculties.forEach(f => {
    f.publishedCount = resources.filter(r => r.faculty_id === f.id && r.status === 'published').length;
    f.status = f.publishedCount >= 3 ? 'public' : 'unlisted';
  });
}

// ---------- Resource preview ----------
function showResourcePreview(resourceId) {
  const resource = resources.find(r => r.id === resourceId);
  if (!resource) return;

  const content = `
    <div style="padding: 20px;">
      <div style="display: flex; gap: 8px; margin-bottom: 12px;">
        <span class="badge badge-${resource.status === 'published' ? 'published' : 'draft'}">${resource.status === 'published' ? 'Published' : 'Draft'}</span>
        <span class="badge badge-draft">${escapeHtml(resource.format)}</span>
      </div>
      <h3 style="font-size: 18px; font-weight: 700; margin-bottom: 8px;">${escapeHtml(resource.title)}</h3>
      <p style="color: var(--text-muted); font-size: 14px; margin-bottom: 4px;">${escapeHtml(resource.code)} · ${escapeHtml(resource.courseTitle)}</p>
      <p style="color: var(--text-muted); font-size: 14px; margin-bottom: 16px;">${escapeHtml(resource.faculty)} · ${escapeHtml(resource.level)} level · ${escapeHtml(resource.type)}</p>
      ${resource.description ? `<p style="font-size: 14px; line-height: 1.6; margin-bottom: 16px;">${escapeHtml(resource.description)}</p>` : ''}
      <p style="font-size: 13px; color: var(--text-dim);">Contributed by ${escapeHtml(resource.contributor || 'Unknown')}</p>
    </div>
  `;

  openPreview(resourceId, null, async () => content, [
    { label: 'Close', variant: 'secondary', onClick: closeSheet },
    {
      label: 'Add another',
      variant: 'primary',
      onClick: () => {
        closeSheet();
        openResourceSheet(null, currentFacultyId);
      }
    }
  ], 'Resource preview');
}

function showDeferredPreview(resourceId) {
  showResourcePreview(resourceId);
  lastSavedResourceId = null;
}

// ---------- Publish draft resource ----------
function publishResource(resourceId) {
  const resource = resources.find(r => r.id === resourceId);
  if (!resource) return;

  resource.status = 'published';
  resource.updated_at = new Date().toISOString();

  const faculty = faculties.find(f => f.id === resource.faculty_id);
  showToast(`${resource.title} published.`);
  checkFacultyPublic(faculty);

  updateFacultyCounts();
  if (currentFacultyId) {
    const currentFaculty = faculties.find(f => f.id === currentFacultyId);
    if (currentFaculty) renderFacultyDetail(currentFaculty);
  }
}

// ---------- A3: Soft-delete resource ----------
function confirmSoftDeleteResource(resourceId) {
  const resource = resources.find(r => r.id === resourceId);
  if (!resource) return;

  const faculty = faculties.find(f => f.id === resource.faculty_id);
  const publishedAfterDelete = resources.filter(r => r.faculty_id === faculty.id && r.status === 'published' && r.id !== resourceId).length;
  const wouldDrop = publishedAfterDelete < 3;

  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `
    <div class="modal" role="dialog" aria-modal="true" aria-label="Soft-delete resource">
      <h3>Remove resource?</h3>
      <p>This removes <strong>${escapeHtml(resource.title)}</strong> from ${escapeHtml(faculty.name)}. ${escapeHtml(faculty.name)} has ${faculty.publishedCount} published resources; deleting this one would leave ${publishedAfterDelete}.</p>
      ${wouldDrop ? `<p style="color: var(--danger); margin-top: 8px;">This would drop ${escapeHtml(faculty.name)} below the 3-resource minimum. Add another published resource first, or edit another resource's faculty.</p>` : '<p style="margin-top: 8px;">It can be restored later.</p>'}
      <div class="modal-actions">
        <button class="btn btn-secondary" data-action="cancel">Cancel</button>
        <button class="btn btn-danger" data-action="confirm" ${wouldDrop ? 'disabled' : ''}>Remove</button>
      </div>
    </div>
  `;

  overlay.querySelector('[data-action="cancel"]').addEventListener('click', () => overlay.remove());

  overlay.querySelector('[data-action="confirm"]').addEventListener('click', () => {
    resource.status = 'deleted';
    resource.updated_at = new Date().toISOString();
    overlay.remove();
    showToast(`${resource.title} removed.`);

    updateFacultyCounts();
    if (currentFacultyId) {
      const currentFaculty = faculties.find(f => f.id === currentFacultyId);
      if (currentFaculty) renderFacultyDetail(currentFaculty);
    }
  });

  document.body.appendChild(overlay);
}

// ---------- Restore resource ----------
function restoreResource(resourceId) {
  const resource = resources.find(r => r.id === resourceId);
  if (!resource) return;

  resource.status = resource.status === 'deleted' ? 'draft' : resource.status; // restored as draft
  resource.updated_at = new Date().toISOString();

  showToast(`${resource.title} restored.`);

  updateFacultyCounts();
  if (currentFacultyId) {
    const currentFaculty = faculties.find(f => f.id === currentFacultyId);
    if (currentFaculty) renderFacultyDetail(currentFaculty);
  }
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

// ---------- Intent mode entry ----------
export function enterIntentMode() {
  intentMode = true;
  window.location.hash = '#/faculty';
  renderFacultyList();
}