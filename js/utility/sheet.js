import { StateView } from './state-view.js';
import { showToast } from './toast.js';

let sheetStateView;
let currentResourceId = null;
let originCard = null;

export function initSheet() {
  const container = document.querySelector('[data-state="sheet-content"]');
  if (!container) return;
  
  sheetStateView = new StateView(container);
  
  const overlay = document.getElementById('sheet-overlay');
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeSheet();
  });
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('open')) {
      closeSheet();
    }
  });
}

export async function openSheet(resourceId, card, renderFunction) {
  currentResourceId = resourceId;
  originCard = card;
  
  const overlay = document.getElementById('sheet-overlay');
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  
  sheetStateView.setLoading();
  
  try {
    const html = await renderFunction(resourceId);
    sheetStateView.setData();
    sheetStateView.getDataContainer().innerHTML = html;
  } catch (err) {
    sheetStateView.setError();
  }
}

export function closeSheet() {
  const overlay = document.getElementById('sheet-overlay');
  overlay.classList.remove('open');
  document.body.style.overflow = '';
  
  if (originCard) {
    originCard.focus();
    originCard = null;
  }
}

export function getSheetStateView() {
  return sheetStateView;
}

export function getCurrentResourceId() {
  return currentResourceId;
}