let toastTimeout;

export function showToast(message, onUndo, showUndo = true) {
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toast-message');
  const toastAction = document.getElementById('toast-action');
  
  clearTimeout(toastTimeout);
  
  toastMessage.textContent = message;
  toastAction.style.display = showUndo ? 'inline-block' : 'none';
  
  if (showUndo && onUndo) {
    toastAction.onclick = () => {
      onUndo();
      toast.classList.remove('show');
    };
  }
  
  toast.classList.add('show');
  
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}