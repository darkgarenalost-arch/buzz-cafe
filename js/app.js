import { initRouter, navigateTo } from './router.js';
import { loadState, saveState, initializeState } from './store.js';
import { initFirebase, getCurrentUser, onAuthStateChanged } from './firebase.js';
import { applyTheme, renderSidebarProfile } from './ui.js';
import { setupEventDelegation } from './utils.js';

// App initialization
async function initApp() {
  // Initialize Firebase
  await initFirebase();

  // Load state from localStorage
  initializeState();

  // Apply theme
  applyTheme();

  // Setup router
  initRouter();

  // Setup event delegation
  setupEventDelegation();

  // Setup auth state listener
  onAuthStateChanged(async (user) => {
    renderSidebarProfile(user);
    if (user) {
      // User logged in - load data from Firestore
      const { loadUserData } = await import('./firebase.js');
      await loadUserData();
      // Re-render current view
      const currentRoute = window.location.hash.replace('#', '') || 'dashboard';
      navigateTo(currentRoute);
    } else {
      // Guest mode
      const { applyGuards } = await import('./auth.js');
      applyGuards();
    }
  });

  // Handle mobile sidebar
  document.getElementById('mobileMenuBtn')?.addEventListener('click', () => {
    document.getElementById('sidebar')?.classList.toggle('open');
    document.getElementById('sidebarBackdrop')?.classList.toggle('show');
  });

  document.getElementById('sidebarBackdrop')?.addEventListener('click', () => {
    document.getElementById('sidebar')?.classList.remove('open');
    document.getElementById('sidebarBackdrop')?.classList.remove('show');
  });

  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if (e.key === 'n' && !e.ctrlKey && !e.metaKey &&
        !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName || '')) {
      const { openAddModal } = await import('./tasks.js');
      openAddModal();
    }
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.open').forEach(m => m.classList.remove('open'));
    }
  });

  // Handle window resize for responsive charts
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      const event = new CustomEvent('app:resize');
      document.dispatchEvent(event);
    }, 250);
  });

  // Initial navigation
  const initialRoute = window.location.hash.replace('#', '') || 'dashboard';
  navigateTo(initialRoute);

  // Save state periodically
  setInterval(saveState, 30000);

  console.log('🚀 Track U app initialized');
}

// Start the app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

// Expose for debugging
window.__app = { navigateTo };