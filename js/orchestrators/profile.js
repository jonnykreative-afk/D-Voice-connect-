import { $, el } from '../libs/dom.js';
import { getProfile, updateProfile } from '../network/mock.js';
import { showToast } from '../widgets/toast.js';

const FACULTY_LABELS = {
  science: 'Science', arts: 'Arts', engineering: 'Engineering',
  law: 'Law', medicine: 'Medicine',
};
const LEVELS = ['100', '200', '300', '400', '500'];

export async function initProfile(rootSelector = '[data-tab-panel="tab-profile"]') {
  const root = $(rootSelector);
  if (!root) return;

  let profile;
  try { profile = await getProfile(); }
  catch (err) { console.error('[profile] load', err); return; }

  renderAll(root, profile);

  root.addEventListener('click', (e) => {
    const editBtn = e.target.closest('[data-action="edit-field"]');
    if (editBtn) { enterEditMode(root, editBtn.dataset.field, profile, (next) => {
      profile = next;
      renderAll(root, profile);
    }); return; }

    if (e.target.closest('[data-action="sign-out"]')) {
      showToast('Sign out is not wired yet');
      return;
    }
    if (e.target.closest('[data-action="delete-account"]')) {
      if (confirm('Delete your account? This cannot be undone.')) {
        showToast('Delete account is not wired yet');
      }
    }
  });
}

function renderAll(root, profile) {
  setField(root, 'name', profile.name);
  setField(root, 'email', profile.email);
  setField(root, 'faculty', FACULTY_LABELS[profile.faculty] || profile.faculty);
  setField(root, 'level', profile.level ? `${profile.level}L` : '—');
}

function setField(root, name, value) {
  const wrap = root.querySelector(`[data-field="${name}"]`);
  const span = wrap?.querySelector('[data-value]');
  if (span) span.textContent = value;
}

function enterEditMode(root, field, profile, onSaved) {
  const wrap = root.querySelector(`[data-field="${field}"]`);
  const control = wrap?.querySelector('.profile-field__control');
  if (!control || control.querySelector('input, select')) return;

  const current = profile[field];
  let input;

  if (field === 'faculty') {
    input = el('select', { class: 'profile-field__input' });
    Object.entries(FACULTY_LABELS).forEach(([v, label]) => {
      const opt = el('option', { value: v, text: label });
      if (v === current) opt.selected = true;
      input.append(opt);
    });
  } else if (field === 'level') {
    input = el('select', { class: 'profile-field__input' });
    LEVELS.forEach((v) => {
      const opt = el('option', { value: v, text: `${v}L` });
      if (v === current) opt.selected = true;
      input.append(opt);
    });
  } else {
    input = el('input', {
      class: 'profile-field__input', type: 'text', value: current || '',
    });
  }

  const save   = el('button', { type: 'button', class: 'btn btn--primary profile-field__save', text: 'Save' });
  const cancel = el('button', { type: 'button', class: 'btn btn--ghost profile-field__cancel', text: 'Cancel' });

  const original = control.innerHTML;
  control.replaceChildren(input, save, cancel);

  cancel.addEventListener('click', () => { control.innerHTML = original; });

  save.addEventListener('click', async () => {
    const next = input.value;
    if (!next) return;
    try {
      const updated = await updateProfile({ [field]: next });
      onSaved(updated);
      showToast('Saved');
    } catch (err) {
      console.error('[profile] save', err);
      showToast('Could not save');
    }
  });

  input.focus();
}