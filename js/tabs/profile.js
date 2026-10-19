import { state } from '../app.js';
import { StateView } from '../utility/state-view.js';
import { fetchUser, updateUser } from '../network/api.js';
import { showToast } from '../utility/toast.js';

export function initProfile() {
  const container = document.querySelector('[data-state="profile-content"]');
  if (!container) return;

  const stateView = new StateView(container);

  async function loadProfile() {
    stateView.setLoading();
    try {
      const user = await fetchUser(state.savedResources);
      state.user = user;

      const data = stateView.getDataContainer();
      data.querySelector('#profile-identity-name').textContent = user.name;
      data.querySelector('#profile-identity-meta').textContent =
        `${user.faculty} · Level ${user.level}`;
      data.querySelector('#profile-identity-footprint').textContent =
        formatFootprint(user);

      const nameInput = data.querySelector('#profile-name');
      const emailInput = data.querySelector('#profile-email');
      const facultySelect = data.querySelector('#profile-faculty');
      const levelSelect = data.querySelector('#profile-level');

      if (nameInput) nameInput.value = user.name;
      if (emailInput) emailInput.value = user.email;
      if (facultySelect) facultySelect.value = user.faculty;
      if (levelSelect) levelSelect.value = user.level;

      stateView.setData();
      wireActions(user);
    } catch (err) {
      console.error(err);
      stateView.setError();
    }
  }

  function formatFootprint(user) {
    const count = user.savedCount || 0;
    const joined = user.joinedAt ? formatJoinDate(user.joinedAt) : null;
    const parts = [];
    parts.push(`${count} resource${count === 1 ? '' : 's'} in your library`);
    if (joined) parts.push(`joined ${joined}`);
    return parts.join(' · ');
  }

  function formatJoinDate(iso) {
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  }

  function wireActions(user) {
    const data = stateView.getDataContainer();
    const nameInput = data.querySelector('#profile-name');
    const facultySelect = data.querySelector('#profile-faculty');
    const levelSelect = data.querySelector('#profile-level');
    const consequence = data.querySelector('#profile-consequence');
    const saveStatus = data.querySelector('#profile-save-status');

    let saveTimeout;
    function persist(updates, options = {}) {
      clearTimeout(saveTimeout);
      saveTimeout = setTimeout(async () => {
        try {
          const updated = await updateUser(updates);
          state.user = updated;
          if (saveStatus) {
            saveStatus.textContent = 'Changes saved';
            saveStatus.classList.add('show');
            setTimeout(() => saveStatus.classList.remove('show'), 2000);
          }
          // Consequence line for context changes
          if (options.consequence) {
            consequence.textContent = options.consequence;
            consequence.hidden = false;
            setTimeout(() => { consequence.hidden = true; }, 4000);
          }
          // Live-update identity block
          data.querySelector('#profile-identity-name').textContent = updated.name;
          data.querySelector('#profile-identity-meta').textContent =
            `${updated.faculty} · Level ${updated.level}`;
        } catch (err) {
          console.error('Failed to save profile', err);
          if (saveStatus) {
            saveStatus.textContent = 'Could not save — try again';
            saveStatus.style.color = 'var(--danger)';
            saveStatus.classList.add('show');
            setTimeout(() => {
              saveStatus.classList.remove('show');
              saveStatus.style.color = '';
            }, 3000);
          }
        }
      }, 500);
    }

    if (nameInput) {
      nameInput.addEventListener('input', () => {
        persist({ name: nameInput.value });
      });
    }
    if (facultySelect) {
      facultySelect.addEventListener('change', () => {
        persist(
          { faculty: facultySelect.value },
          { consequence: `Explore will now show more ${facultySelect.value} resources.` }
        );
      });
    }
    if (levelSelect) {
      levelSelect.addEventListener('change', () => {
        persist(
          { level: levelSelect.value },
          { consequence: `Explore will now show more ${levelSelect.value}-level resources.` }
        );
      });
    }

    // Sign out
    const signoutBtn = data.querySelector('#profile-signout-btn');
    if (signoutBtn) {
      signoutBtn.addEventListener('click', () => {
        // TODO: wire to real sign-out; for now route to landing
        window.location.href = 'index.html';
      });
    }

    // Delete flow
    const deleteBtn = data.querySelector('#profile-delete-btn');
    if (deleteBtn) {
      deleteBtn.addEventListener('click', () => openDeleteSheet(user));
    }
  }

  function openDeleteSheet(user) {
    const overlay = document.getElementById('delete-overlay');
    const emailEl = document.getElementById('delete-confirm-email');
    const input = document.getElementById('delete-confirm-input');
    const confirmBtn = document.getElementById('delete-confirm-btn');
    const cancelBtn = document.getElementById('delete-cancel-btn');

    emailEl.textContent = user.email;
    input.value = '';
    confirmBtn.disabled = true;

    function checkMatch() {
      confirmBtn.disabled = input.value.trim().toLowerCase() !== user.email.toLowerCase();
    }
    input.addEventListener('input', checkMatch);

    function close() {
      overlay.classList.remove('open');
      document.body.style.overflow = '';
      input.removeEventListener('input', checkMatch);
    }

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) close();
    }, { once: true });

    cancelBtn.onclick = close;

    confirmBtn.onclick = async () => {
      if (confirmBtn.disabled) return;
      confirmBtn.disabled = true;
      confirmBtn.textContent = 'Deleting…';
      try {
        // TODO: real API call
        await new Promise(r => setTimeout(r, 600));
        close();
        showToast('Account deleted', null, false);
        setTimeout(() => { window.location.href = 'index.html'; }, 800);
      } catch (err) {
        confirmBtn.disabled = false;
        confirmBtn.textContent = 'Delete my account';
        showToast('Could not delete account — try again', null, false);
      }
    };

    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    setTimeout(() => input.focus(), 200);
  }

  const retryBtn = container.querySelector('[data-retry]');
  if (retryBtn) retryBtn.addEventListener('click', loadProfile);

  loadProfile();
}