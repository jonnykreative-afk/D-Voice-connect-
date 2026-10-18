import { state } from '../app.js';
import { StateView } from '../utility/state-view.js';
import { fetchUser, updateUser } from '../network/api.js';

export function initProfile() {
  const container = document.querySelector('[data-state="profile-content"]');
  if (!container) return;

  const stateView = new StateView(container);
  
  async function loadProfile() {
    stateView.setLoading();
    
    try {
      const user = await fetchUser();
      state.user = user;
      
      const dataContainer = stateView.getDataContainer();
      const nameInput = dataContainer.querySelector('#profile-name');
      const emailInput = dataContainer.querySelector('#profile-email');
      const facultySelect = dataContainer.querySelector('#profile-faculty');
      const levelSelect = dataContainer.querySelector('#profile-level');

      if (nameInput) nameInput.value = user.name;
      if (emailInput) emailInput.value = user.email;
      if (facultySelect) facultySelect.value = user.faculty;
      if (levelSelect) levelSelect.value = user.level;
      
      stateView.setData();
    } catch (err) {
      console.error(err);
      stateView.setError();
    }
  }
  
  // Wire auto-save
  let saveTimeout;
  function handleProfileChange() {
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(async () => {
      const dataContainer = stateView.getDataContainer();
      const updates = {
        name: dataContainer.querySelector('#profile-name').value,
        faculty: dataContainer.querySelector('#profile-faculty').value,
        level: dataContainer.querySelector('#profile-level').value
      };
      
      try {
        const updated = await updateUser(updates);
        state.user = updated;
        
        const status = dataContainer.querySelector('#profile-save-status');
        if (status) {
          status.textContent = 'Changes saved';
          status.classList.add('show');
          
          setTimeout(() => {
            status.classList.remove('show');
          }, 2000);
        }
      } catch (err) {
        console.error('Failed to save profile', err);
      }
    }, 500);
  }
  
  const dataContainer = stateView.getDataContainer();
  const nameInput = dataContainer.querySelector('#profile-name');
  const facultySelect = dataContainer.querySelector('#profile-faculty');
  const levelSelect = dataContainer.querySelector('#profile-level');

  if (nameInput) nameInput.addEventListener('input', handleProfileChange);
  if (facultySelect) facultySelect.addEventListener('change', handleProfileChange);
  if (levelSelect) levelSelect.addEventListener('change', handleProfileChange);
  
  // Wire sign out
  const signoutBtn = dataContainer.querySelector('#profile-signout-btn');
  if (signoutBtn) {
    signoutBtn.addEventListener('click', () => {
      console.log('Sign out');
      // TODO: Implement actual sign out
    });
  }
  
  // Wire delete account
  const deleteBtn = dataContainer.querySelector('#profile-delete-btn');
  if (deleteBtn) {
    deleteBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to delete your account? This cannot be undone.')) {
        console.log('Delete account');
      }
    });
  }
  
  // Wire retry
  const retryBtn = container.querySelector('[data-retry]');
  if (retryBtn) retryBtn.addEventListener('click', loadProfile);
  
  loadProfile();
}