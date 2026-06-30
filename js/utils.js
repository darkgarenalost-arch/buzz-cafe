import { state, saveState } from './store.js';

// Date helpers
export function today() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function dateKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export function addDays(dateStr, n) {
  const d = new Date(dateStr + 'T00:00:00');
  d.setDate(d.getDate() + n);
  return dateKey(d);
}

export function subtractDays(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return dateKey(d);
}

export function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning';
  if (h < 17) return 'Good Afternoon';
  return 'Good Evening';
}

export function formatDate(d = new Date()) {
  return d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

// Escaping
export function escHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// Debounce
export function debounce(fn, delay = 300) {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

// Throttle
export function throttle(fn, limit = 300) {
  let inThrottle = false;
  return function(...args) {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Random ID
export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

// Color helpers
export const CAT_COLORS = {
  work: '#4facfe',
  health: '#43e97b',
  study: '#7c5cfc',
  fitness: '#fc5c7d',
  personal: '#f9a825',
  business: '#00f2fe',
  creative: '#fc5c7d',
  '': '#7c5cfc',
};

export const CATEGORIES = ['work', 'health', 'study', 'fitness', 'personal', 'business', 'creative'];

// Level system
export const LEVELS = [
  { level: 1, xp: 0 },
  { level: 2, xp: 100 },
  { level: 3, xp: 250 },
  { level: 4, xp: 500 },
  { level: 5, xp: 900 },
  { level: 6, xp: 1500 },
  { level: 7, xp: 2300 },
  { level: 8, xp: 3500 },
  { level: 9, xp: 5000 },
  { level: 10, xp: 7000 },
  { level: 11, xp: 9500 },
  { level: 12, xp: 13000 },
];

export function getLevel(xp) {
  let lvl = 1;
  for (const l of LEVELS) {
    if (xp >= l.xp) lvl = l.level;
    else break;
  }
  return lvl;
}

export function getLevelXPRange(lvl) {
  const cur = LEVELS.find(l => l.level === lvl) || LEVELS[0];
  const nxt = LEVELS.find(l => l.level === lvl + 1);
  return { curXP: cur.xp, nextXP: nxt ? nxt.xp : cur.xp + 5000 };
}

// Event delegation setup
export function setupEventDelegation() {
  // Auth gate buttons
  document.getElementById('authGateGoogleBtn')?.addEventListener('click', async () => {
    document.getElementById('authGateOverlay')?.classList.remove('open');
    try {
      const { signInWithGoogle } = await import('./firebase.js');
      await signInWithGoogle();
      const { toast } = await import('./ui.js');
      toast('Signed in with Google! 🎉', 'success');
    } catch (e) {
      if (e.code !== 'auth/popup-closed-by-user' && e.code !== 'auth/cancelled-popup-request') {
        const { toast } = await import('./ui.js');
        toast('Could not sign in with Google.', 'error');
      }
    }
  });

  document.getElementById('authGateLoginBtn')?.addEventListener('click', () => {
    document.getElementById('authGateOverlay')?.classList.remove('open');
    window.location.href = 'login.html?return=index.html';
  });

  document.getElementById('authGateLaterBtn')?.addEventListener('click', () => {
    document.getElementById('authGateOverlay')?.classList.remove('open');
  });

  document.getElementById('authGateOverlay')?.addEventListener('click', (e) => {
    if (e.target === e.currentTarget) {
      e.target.classList.remove('open');
    }
  });

  // Logout modal
  document.getElementById('logoutCancelBtn')?.addEventListener('click', () => {
    document.getElementById('logoutOverlay')?.classList.remove('open');
  });

  document.getElementById('logoutConfirmBtn')?.addEventListener('click', async () => {
    document.getElementById('logoutOverlay')?.classList.remove('open');
    try {
      const { signOut } = await import('./firebase.js');
      await signOut();
      const { toast } = await import('./ui.js');
      toast('Logged out successfully.', 'info');
    } catch (e) {
      const { toast } = await import('./ui.js');
      toast('Error logging out.', 'error');
    }
  });

  document.getElementById('logoutOverlay')?.addEventListener('click', (e) => {
    if (e.target === e.currentTarget) e.target.classList.remove('open');
  });

  // Profile modal
  document.getElementById('profileModalOverlay')?.addEventListener('click', (e) => {
    if (e.target === e.currentTarget) e.target.classList.remove('open');
  });

  document.getElementById('profileModalLogoutBtn')?.addEventListener('click', () => {
    document.getElementById('profileModalOverlay')?.classList.remove('open');
    document.getElementById('logoutOverlay')?.classList.add('open');
  });

  // Task modal
  document.getElementById('cancelTaskBtn')?.addEventListener('click', () => {
    document.getElementById('taskModal')?.classList.remove('open');
  });

  document.getElementById('taskModal')?.addEventListener('click', (e) => {
    if (e.target === e.currentTarget) e.target.classList.remove('open');
  });

  // Reset modal
  document.getElementById('cancelResetBtn')?.addEventListener('click', () => {
    document.getElementById('resetModal')?.classList.remove('open');
  });

  document.getElementById('resetModal')?.addEventListener('click', (e) => {
    if (e.target === e.currentTarget) e.target.classList.remove('open');
  });

  document.getElementById('confirmResetBtn')?.addEventListener('click', async () => {
    document.getElementById('resetModal')?.classList.remove('open');
    const { resetState } = await import('./store.js');
    resetState();
    const { toast } = await import('./ui.js');
    toast('All data reset!', 'info');
    document.dispatchEvent(new CustomEvent('app:reset'));
  });

  // Dark mode toggle in sidebar is handled in router.js
}