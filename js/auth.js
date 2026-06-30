import { getCurrentUser, signInWithGoogle, signOut } from './firebase.js';
import { toast } from './ui.js';

export function applyGuards() {
  // This function is called when in guest mode
  // It wraps restricted actions to show the auth gate

  const restrictedActions = ['openAddModal', 'openEditModal', 'deleteTask', 'completeTask', 'exportData', 'importData'];

  restrictedActions.forEach(action => {
    const original = window[action];
    if (original && typeof original === 'function') {
      window[action] = function(...args) {
        if (!getCurrentUser()) {
          document.getElementById('authGateOverlay')?.classList.add('open');
          return;
        }
        return original.apply(this, args);
      };
    }
  });
}

export function removeGuards() {
  // Restore original functions when user logs in
  // The app will re-import modules, so this is handled naturally
}

export function showAuthGate() {
  document.getElementById('authGateOverlay')?.classList.add('open');
}

export function hideAuthGate() {
  document.getElementById('authGateOverlay')?.classList.remove('open');
}

export async function handleGoogleSignIn() {
  try {
    await signInWithGoogle();
    toast('Signed in with Google! 🎉', 'success');
    hideAuthGate();
  } catch (e) {
    if (e.code !== 'auth/popup-closed-by-user' && e.code !== 'auth/cancelled-popup-request') {
      toast('Could not sign in with Google.', 'error');
    }
  }
}

export async function handleLogout() {
  try {
    await signOut();
    toast('Logged out successfully.', 'info');
  } catch (e) {
    toast('Error logging out.', 'error');
  }
}