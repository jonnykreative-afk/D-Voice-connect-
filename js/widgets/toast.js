/* =========================================================
   widgets/toast.js — self-contained toast island
   Mounts to [data-widget="toast"] (one per page).
   ========================================================= */

const DURATION_MS = 3200;

let rootEl = null;
let queue = [];
let showing = false;

export function mountToast(root = document.querySelector('[data-widget="toast"]')) {
  if (!root) return;
  rootEl = root;
  rootEl.setAttribute('role', 'status');
  rootEl.setAttribute('aria-live', 'polite');
  rootEl.setAttribute('aria-atomic', 'true');

  // Drain anything queued before mount.
  const pending = queue;
  queue = [];
  pending.forEach(showToast);
}

export function showToast(message, { actionLabel, onAction, duration = DURATION_MS } = {}) {
  if (!rootEl) { queue.push([message, { actionLabel, onAction, duration }]); return; }
  if (showing) queue.push([message, { actionLabel, onAction, duration }]);
  if (showing) return;

  showing = true;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.setAttribute('role', 'status');

  const msg = document.createElement('span');
  msg.className = 'toast__message';
  msg.textContent = message;
  toast.append(msg);

  let timer = null;
  const dismiss = () => {
    clearTimeout(timer);
    toast.classList.add('toast--leaving');
    toast.addEventListener('animationend', () => {
      toast.remove();
      showing = false;
      const next = queue.shift();
      if (next) showToast(...next);
    }, { once: true });
  };

  if (actionLabel && typeof onAction === 'function') {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'toast__action';
    btn.textContent = actionLabel;
    btn.addEventListener('click', () => { onAction(); dismiss(); });
    toast.append(btn);
  }

  rootEl.append(toast);
  requestAnimationFrame(() => toast.classList.add('toast--visible'));

  timer = setTimeout(dismiss, duration);
}