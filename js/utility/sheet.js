// sheet.js — D'voice Admin bottom sheet with caller-context modes
// Modes: viewer | form | preview
// The sheet adjusts its chrome based on who called it.

import { StateView } from './state-view.js';

let sheetStateView;
let currentMode = null;
let currentResourceId = null;
let originElement = null;
let actionBarEl = null;
let handleEl = null;

// Mode configurations
const MODES = {
  viewer: {
    showHandle: true,
    showActionBar: false,
    dismissOnOverlay: true,
    dismissOnEscape: true,
  },
  form: {
    showHandle: true,
    showActionBar: true,
    dismissOnOverlay: false, // prevent accidental data loss
    dismissOnEscape: true,
  },
  preview: {
    showHandle: true,
    showActionBar: true,
    dismissOnOverlay: true,
    dismissOnEscape: true,
  },
};

export function initSheet() {
  const container = document.querySelector('[data-state="sheet-content"]');
  if (!container) return;

  sheetStateView = new StateView(container);
  actionBarEl = document.getElementById('sheet-actions');
  handleEl = document.getElementById('sheet-handle');

  const overlay = document.getElementById('sheet-overlay');

  // Overlay click — mode-dependent dismiss
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay && MODES[currentMode]?.dismissOnOverlay) {
      closeSheet();
    }
  });

  // Escape — mode-dependent dismiss
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('open')) {
      if (MODES[currentMode]?.dismissOnEscape) {
        closeSheet();
      }
    }
  });
}

/**
 * Open the sheet in a specific mode.
 *
 * @param {Object} options
 * @param {string} options.mode — 'viewer' | 'form' | 'preview'
 * @param {string|number} [options.resourceId] — resource identifier (viewer/preview)
 * @param {HTMLElement} [options.origin] — element to return focus to on close
 * @param {Function} [options.render] — async fn that returns HTML string for content
 * @param {Array} [options.actions] — [{ label, variant, onClick, disabled }] for form/preview modes
 * @param {string} [options.title] — accessible title for the sheet dialog
 */
export async function openSheet(options) {
  const {
    mode = 'viewer',
    resourceId = null,
    origin = null,
    render = null,
    actions = [],
    title = 'Sheet',
  } = options;

  if (!MODES[mode]) {
    console.warn(`sheet.js: unknown mode "${mode}", falling back to viewer`);
  }

  currentMode = MODES[mode] ? mode : 'viewer';
  currentResourceId = resourceId;
  originElement = origin;

  const overlay = document.getElementById('sheet-overlay');
  const sheet = overlay.querySelector('.sheet');
  const config = MODES[currentMode];

  // Apply mode chrome
  sheet.setAttribute('aria-label', title);
  handleEl.style.display = config.showHandle ? '' : 'none';
  actionBarEl.hidden = !config.showActionBar;

  // Build action bar
  if (config.showActionBar && actions.length) {
    actionBarEl.innerHTML = '';
    actions.forEach((action) => {
      const btn = document.createElement('button');
      btn.className = `btn btn-${action.variant || 'secondary'}`;
      btn.textContent = action.label;
      btn.disabled = !!action.disabled;
      if (action.onClick) {
        btn.addEventListener('click', action.onClick);
      }
      actionBarEl.appendChild(btn);
    });
  }

  // Show overlay
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';

  // Render content
  if (render && typeof render === 'function') {
    sheetStateView.setLoading();
    try {
      const html = await render(resourceId);
      sheetStateView.setData();
      sheetStateView.getDataContainer().innerHTML = html;
    } catch (err) {
      console.error('sheet.js render error:', err);
      sheetStateView.setError();
    }
  } else {
    // No render fn — just show empty state
    sheetStateView.setEmpty();
  }
}

export function closeSheet() {
  const overlay = document.getElementById('sheet-overlay');
  overlay.classList.remove('open');
  document.body.style.overflow = '';
  currentMode = null;
  currentResourceId = null;

  // Return focus to origin
  if (originElement) {
    originElement.focus();
    originElement = null;
  }
}

// ---------- Convenience wrappers ----------
export function openViewer(resourceId, origin, renderFn, title = 'Resource detail') {
  return openSheet({ mode: 'viewer', resourceId, origin, render: renderFn, title });
}

export function openForm(origin, renderFn, actions, title = 'Edit') {
  return openSheet({ mode: 'form', origin, render: renderFn, actions, title });
}

export function openPreview(resourceId, origin, renderFn, actions, title = 'Preview') {
  return openSheet({ mode: 'preview', resourceId, origin, render: renderFn, actions, title });
}

// ---------- Getters ----------
export function getSheetStateView() {
  return sheetStateView;
}

export function getCurrentResourceId() {
  return currentResourceId;
}

export function getCurrentMode() {
  return currentMode;
}

export function isSheetOpen() {
  return document.getElementById('sheet-overlay')?.classList.contains('open') || false;
}
