import { StateView } from '../utility/state-view.js'; // not used here; kept for consistency if later needed
import { Combobox } from '../utility/combobox.js';
import { createPasswordField, setFieldError } from '../components/form.js';
import { fetchUser } from '../network/api.js';
import { showToast } from '../utility/toast.js';

const FACULTIES = [
  { id: 'science', name: 'Science' },
  { id: 'engineering', name: 'Engineering' },
  { id: 'arts', name: 'Arts' },
  { id: 'social-sciences', name: 'Social Sciences' },
  { id: 'health-sciences', name: 'Health Sciences' },
  { id: 'law', name: 'Law' },
];

const LEVELS = [
  { id: '100', name: '100 level' },
  { id: '200', name: '200 level' },
  { id: '300', name: '300 level' },
  { id: '400', name: '400 level' },
  { id: '500', name: '500 level' },
];

function initAuth() {
  const formSignin = document.getElementById('form-signin');
  const formSignup = document.getElementById('form-signup');
  const tabSignin = document.getElementById('tab-signin');
  const tabSignup = document.getElementById('tab-signup');
  const switchLink = document.getElementById('switch-link');
  const titleEl = document.getElementById('auth-title');
  const headingEl = document.getElementById('auth-heading');
  const subEl = document.getElementById('auth-sub');
  const banner = document.getElementById('auth-banner');

  // Determine initial mode from hash
  const initialMode = window.location.hash === '#signup' ? 'signup' : 'signin';
  setMode(initialMode);

  // Password fields
  const signinPassword = createPasswordField({
    id: 'signin-password', autocomplete: 'current-password', required: true,
  });
  document.getElementById('signin-password-slot').appendChild(signinPassword.wrapper);

  const signupPassword = createPasswordField({
    id: 'signup-password', autocomplete: 'new-password', required: true, showStrength: true,
  });
  document.getElementById('signup-password-slot').appendChild(signupPassword.wrapper);

  // Comboboxes
  new Combobox({
    inputEl: document.getElementById('signup-faculty'),
    menuEl: document.getElementById('faculty-menu'),
    hiddenEl: document.getElementById('signup-faculty-value'),
    source: FACULTIES,
    minChars: 0,
    allowEmpty: true,
    placeholder: 'Start typing your faculty…',
    onChange: () => setFieldError(document.getElementById('signup-faculty'), ''),
  });

  new Combobox({
    inputEl: document.getElementById('signup-level'),
    menuEl: document.getElementById('level-menu'),
    hiddenEl: document.getElementById('signup-level-value'),
    source: LEVELS,
    minChars: 0,
    allowEmpty: true,
    placeholder: 'Start typing your level…',
    onChange: () => setFieldError(document.getElementById('signup-level'), ''),
  });

  // Toggle
  tabSignin.addEventListener('click', () => setMode('signin'));
  tabSignup.addEventListener('click', () => setMode('signup'));
  switchLink.addEventListener('click', (e) => {
    e.preventDefault();
    setMode(document.getElementById('form-signup').hidden ? 'signup' : 'signin');
  });

  document.getElementById('auth-back').addEventListener('click', () => window.history.back());

  // Submit handlers
  formSignin.addEventListener('submit', handleSignin);
  formSignup.addEventListener('submit', handleSignup);

  // Forgot password (placeholder — brief says reset path exists)
  document.getElementById('forgot-link').addEventListener('click', (e) => {
    e.preventDefault();
    showToast('Password reset will be available soon', null, false);
  });

  /* ---------- mode ---------- */
  function setMode(mode) {
    const isSignup = mode === 'signup';
    formSignin.hidden = isSignup;
    formSignup.hidden = !isSignup;
    tabSignin.classList.toggle('active', !isSignup);
    tabSignup.classList.toggle('active', isSignup);
    tabSignin.setAttribute('aria-selected', String(!isSignup));
    tabSignup.setAttribute('aria-selected', String(isSignup));
    titleEl.textContent = isSignup ? 'Sign up' : 'Sign in';
    headingEl.textContent = isSignup ? 'Create your account' : 'Welcome back';
    subEl.textContent = isSignup
      ? 'Save resources and open your library. Browsing stays free without an account.'
      : 'Sign in to save resources and open your library.';
    switchLink.textContent = isSignup
      ? 'Already have an account? Sign in'
      : 'New here? Create an account';
    hideBanner();
    window.history.replaceState(null, '', `#${isSignup ? 'signup' : 'signin'}`);
    (isSignup ? formSignup : formSignin).querySelector('.form-input')?.focus();
  }

  /* ---------- validation ---------- */
  function validateSignin() {
    let ok = true;
    const email = document.getElementById('signin-email');
    if (!email.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
      setFieldError(email, 'Enter a valid email address');
      ok = false;
    } else setFieldError(email, '');
    if (!signinPassword.input.value) {
      setFieldError(signinPassword.input, 'Enter your password');
      ok = false;
    } else setFieldError(signinPassword.input, '');
    return ok;
  }

  function validateSignup() {
    let ok = true;
    const name = document.getElementById('signup-name');
    const email = document.getElementById('signup-email');
    const faculty = document.getElementById('signup-faculty');
    const level = document.getElementById('signup-level');

    if (!name.value.trim()) { setFieldError(name, 'Enter your name'); ok = false; }
    else setFieldError(name, '');

    if (!email.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
      setFieldError(email, 'Enter a valid email address'); ok = false;
    } else setFieldError(email, '');

    if (!signupPassword.input.value || signupPassword.input.value.length < 8) {
      setFieldError(signupPassword.input, 'Use at least 8 characters'); ok = false;
    } else setFieldError(signupPassword.input, '');

    if (!faculty.value.trim()) { setFieldError(faculty, 'Choose your faculty'); ok = false; }
    else setFieldError(faculty, '');

    if (!level.value.trim()) { setFieldError(level, 'Choose your level'); ok = false; }
    else setFieldError(level, '');

    return ok;
  }

  /* ---------- banner ---------- */
  function showBanner(message, type = 'error') {
    banner.className = `form-banner ${type}`;
    banner.innerHTML = `<i class="ri-${type === 'error' ? 'error-warning' : 'information'}-line" aria-hidden="true"></i><span>${message}</span>`;
    banner.hidden = false;
  }
  function hideBanner() { banner.hidden = true; }

  /* ---------- submit ---------- */
  async function handleSignin(e) {
    e.preventDefault();
    hideBanner();
    if (!validateSignin()) return;

    const btn = document.getElementById('signin-submit');
    btn.disabled = true;
    btn.textContent = 'Signing in…';

    try {
      // MOCK — replace with real auth call
      await new Promise(r => setTimeout(r, 600));
      // For now: fetch the mock user and proceed
      const user = await fetchUser();
      showToast(`Signed in as ${user.name}`, null, false);
      redirectAfterAuth();
    } catch (err) {
      showBanner('Wrong email or password. Try again.', 'error');
      btn.disabled = false;
      btn.textContent = 'Sign in';
    }
  }

  async function handleSignup(e) {
    e.preventDefault();
    hideBanner();
    if (!validateSignup()) return;

    const btn = document.getElementById('signup-submit');
    btn.disabled = true;
    btn.textContent = 'Creating account…';

    try {
      // MOCK — replace with real sign-up call
      await new Promise(r => setTimeout(r, 800));
      // Simulate "account exists"
      if (Math.random() < 0.15) {
        // Brief §6: route to sign-in with email preserved
        const email = document.getElementById('signup-email').value;
        setMode('signin');
        document.getElementById('signin-email').value = email;
        showBanner('An account with this email already exists. Sign in instead.', 'info');
        btn.disabled = false;
        btn.textContent = 'Create account';
        return;
      }
      showToast('Account created', null, false);
      redirectAfterAuth();
    } catch (err) {
      showBanner('Couldn\'t create your account. Try again.', 'error');
      btn.disabled = false;
      btn.textContent = 'Create account';
    }
  }

  /* ---------- post-auth landing (brief §5) ---------- */
  function redirectAfterAuth() {
    // Intent preservation: if the user came here from a save/bookmark
    // action, the originating page should set ?next= or sessionStorage.
    const params = new URLSearchParams(window.location.search);
    const next = params.get('next');
    if (next) {
      window.location.href = next;
      return;
    }
    // Default: library is the personal surface auth unlocks.
    // Home only if there was truly no intent — but we can't tell,
    // so library is the honest default.
    window.location.href = 'dashboard.html#library';
  }
}

initAuth();