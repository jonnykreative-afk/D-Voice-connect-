/* Password field: input + visibility toggle + optional strength meter.
   Replaces the style-injecting passwordInput.js with a theme-aware version. */
export function createPasswordField({ id, name = 'password', placeholder = '', autocomplete = 'current-password', showStrength = false, required = false }) {
  const wrapper = document.createElement('div');
  wrapper.className = 'pw-field';

  const input = document.createElement('input');
  input.type = 'password';
  input.id = id;
  input.name = name;
  input.className = 'form-input';
  input.placeholder = placeholder;
  input.autocomplete = autocomplete;
  if (required) input.required = true;

  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'pw-toggle';
  toggle.setAttribute('aria-label', 'Show password');
  toggle.innerHTML = `<i class="ri-eye-line" aria-hidden="true"></i>`;

  toggle.addEventListener('click', () => {
    const visible = input.type === 'text';
    input.type = visible ? 'password' : 'text';
    toggle.innerHTML = `<i class="ri-${visible ? 'eye-line' : 'eye-off-line'}" aria-hidden="true"></i>`;
    toggle.setAttribute('aria-label', visible ? 'Show password' : 'Hide password');
    input.focus();
  });

  wrapper.appendChild(input);
  wrapper.appendChild(toggle);

  let strengthEl = null;
  if (showStrength) {
    strengthEl = document.createElement('div');
    strengthEl.className = 'pw-strength';
    wrapper.appendChild(strengthEl);

    input.addEventListener('input', () => {
      const val = input.value;
      if (!val) { strengthEl.textContent = ''; return; }
      const checks = [/[a-z]/, /[A-Z]/, /[0-9]/, /[^A-Za-z0-9]/];
      const score = checks.reduce((a, r) => a + r.test(val), 0) + (val.length >= 8 ? 1 : 0);
      const levels = ['Very weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very strong'];
      strengthEl.textContent = levels[score];
      // Use our tokens, not hardcoded hex
      const colors = ['var(--danger)', 'var(--danger)', 'var(--accent)', 'var(--accent)', 'var(--success)', 'var(--success)'];
      strengthEl.style.color = colors[score];
    });
  }

  return { wrapper, input, toggle, strengthEl };
}

/* Inline error helper: sets/clears a field's error and ties it to the input. */
export function setFieldError(input, message) {
  const field = input.closest('.form-field');
  if (!field) return;
  let hint = field.querySelector('.form-hint');
  if (!hint) {
    hint = document.createElement('div');
    hint.className = 'form-hint';
    field.appendChild(hint);
  }
  if (message) {
    hint.textContent = message;
    hint.classList.add('error');
    input.setAttribute('aria-invalid', 'true');
    const id = input.id + '-error';
    hint.id = id;
    input.setAttribute('aria-describedby', id);
  } else {
    hint.textContent = '';
    hint.classList.remove('error');
    input.removeAttribute('aria-invalid');
    input.removeAttribute('aria-describedby');
  }
}