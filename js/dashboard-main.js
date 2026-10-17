import { initShell, registerTab } from './widgets/tab-shell.js';
import { mountToast } from './widgets/toast.js';
import { initHome } from './orchestrators/home.js';
import { initExplore } from './orchestrators/explore.js';
import { initLibrary } from './orchestrators/library.js';
import { initProfile } from './orchestrators/profile.js';

document.addEventListener('DOMContentLoaded', () => {
  registerTab('tab-home',    () => initHome());
  registerTab('tab-explore', () => initExplore());
  registerTab('tab-library', () => initLibrary());
  registerTab('tab-profile', () => initProfile());

  mountToast();
  initShell();
});