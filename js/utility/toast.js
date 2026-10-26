// toast.js — D'voice Admin toast notifications
// Supports an optional action button (Undo, View, Restore, etc.)

let toastTimeout;

/**
 * Show a toast notification.
 *
 * @param {string} message — the message to display
 * @param {Object} [options]
 * @param {string} [options.actionLabel] — label for the action button (e.g. "Undo", "View")
 * @param {Function} [options.onAction] — callback when action button is tapped
 * @param {number} [options.duration] — auto-dismiss duration in ms (default 4000)
 */
export function showToast(message, options = {}) {
  const {
    actionLabel = null,
    onAction = null,
    duration = 4000,
  } = options;

  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toast-message');
  const toastAction = document.getElementById('toast-action');

  clearTimeout(toastTimeout);

  toastMessage.textContent = message;

  // Action button
  if (actionLabel && onAction) {
    toastAction.textContent = actionLabel;
    toastAction.hidden = false;
    toastAction.onclick = () => {
      onAction();
      toast.classList.remove('show');
      clearTimeout(toastTimeout);
    };
  } else {
    toastAction.hidden = true;
    toastAction.onclick = null;
  }

  // Show
  toast.classList.add('show');

  // Auto-dismiss
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, duration);
}

/**
 * Convenience: toast with Undo action.
 */
export function showToastWithUndo(message, onUndo) {
  showToast(message, { actionLabel: 'Undo', onAction: onUndo });
}

/**
 * Convenience: toast with View action.
 */
export function showToastWithView(message, onView) {
  showToast(message, { actionLabel: 'View', onAction: onView });
}

/**
 * Dismiss the toast immediately.
 */
export function dismissToast() {
  const toast = document.getElementById('toast');
  toast.classList.remove('show');
  clearTimeout(toastTimeout);
}
