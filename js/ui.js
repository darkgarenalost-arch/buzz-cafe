import { state, saveState } from './store.js';
import { getCurrentUser } from './firebase.js';

const componentCache = new Map();

export async function getComponent(name) {
  if (componentCache.has(name)) {
    return componentCache.get(name);
  }

  try {
    // Load template
    const templateRes = await fetch(`/components/${name}.html`);
    const template = await templateRes.text();

    // Load controller
    let controller = null;
    try {
      const module = await import(`./${name}.js`);
      controller = module.default || module;
    } catch (e) {
      // Component might not have a controller
      console.debug(`No controller for ${name}`);
    }

    const component = {
      template,
      init: controller?.init || (() => {}),
      controller,
    };

    return component;
  } catch (e) {
    console.error(`Failed to load component ${name}:`, e);
    return null;
  }
}

export function cacheComponent(name, component) {
  componentCache.set(name, component);
}

export function clearComponentCache() {
  componentCache.clear();
}

export function getCachedComponent(name) {
  return componentCache.get(name) || null;
}

// Theme
export function applyTheme() {
  const darkMode = state.settings.darkMode;
  document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');

  const icon = document.getElementById('themeIcon');
  const label = document.getElementById('themeLabel');
  if (icon) icon.textContent = darkMode ? '🌙' : '☀️';
  if (label) label.textContent = darkMode ? 'Light Mode' : 'Dark Mode';
}

export function toggleTheme() {
  state.settings.darkMode = !state.settings.darkMode;
  applyTheme();
  saveState();
  document.dispatchEvent(new CustomEvent('theme:changed', { detail: { darkMode: state.settings.darkMode } }));
}

// Toast
export function toast(msg, type = 'info') {
  const icons = { success: '✅', error: '❌', info: 'ℹ️', xp: '⚡' };
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.innerHTML = `<span class="toast-icon">${icons[type] || 'ℹ️'}</span><span>${msg}</span>`;
  container.appendChild(t);

  requestAnimationFrame(() => t.classList.add('show'));
  setTimeout(() => {
    t.classList.remove('show');
    setTimeout(() => t.remove(), 400);
  }, 3500);
}

// Tooltip
export function showTooltip(el, text) {
  const tooltip = document.getElementById('tooltip');
  if (!tooltip) return;
  const rect = el.getBoundingClientRect();
  tooltip.textContent = text;
  tooltip.style.left = rect.left + rect.width / 2 + 'px';
  tooltip.style.top = rect.top - 10 + 'px';
  tooltip.style.transform = 'translateX(-50%) translateY(-100%)';
  tooltip.classList.add('show');
}

export function hideTooltip() {
  const tooltip = document.getElementById('tooltip');
  if (tooltip) tooltip.classList.remove('show');
}

// Sidebar profile
export function renderSidebarProfile(user) {
  const container = document.getElementById('sidebarProfile');
  if (!container) return;

  if (user) {
    const displayName = user.displayName || user.email || 'User';
    const initial = displayName.charAt(0).toUpperCase();
    const photoURL = user.photoURL;

    container.innerHTML = `
      <div class="profile-card" id="profileCardBtn">
        <div class="profile-avatar">
          ${photoURL ? `<img src="${photoURL}" alt="avatar">` : initial}
        </div>
        <div class="profile-info">
          <div class="profile-name">${displayName}</div>
          <div class="profile-email">${user.email || ''}</div>
        </div>
        <span class="profile-chevron">▲</span>
      </div>
    `;

    const modalAvatar = document.getElementById('profileModalAvatar');
    const modalName = document.getElementById('profileModalName');
    const modalEmail = document.getElementById('profileModalEmail');
    if (modalAvatar) modalAvatar.innerHTML = photoURL ? `<img src="${photoURL}" alt="avatar">` : initial;
    if (modalName) modalName.textContent = displayName;
    if (modalEmail) modalEmail.textContent = user.email || '';

    container.querySelector('#profileCardBtn')?.addEventListener('click', () => {
      document.getElementById('profileModalOverlay')?.classList.add('open');
    });
  } else {
    container.innerHTML = `
      <div class="guest-badge" id="guestSignInBtn">
        <div class="guest-badge-icon">👤</div>
        <div class="guest-badge-text">
          <div class="guest-badge-label">Guest Mode</div>
          <div class="guest-badge-sub">Tap to sign in →</div>
        </div>
      </div>
    `;
    container.querySelector('#guestSignInBtn')?.addEventListener('click', () => {
      document.getElementById('authGateOverlay')?.classList.add('open');
    });
  }
}

// Modal helpers
export function openModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.add('open');
}

export function closeModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.remove('open');
}

export function closeAllModals() {
  document.querySelectorAll('.modal-overlay.open, .auth-gate-overlay.open, .logout-overlay.open, .profile-modal-overlay.open')
    .forEach(el => el.classList.remove('open'));
}