import { state, saveState, resetState } from './store.js';
import { applyTheme, toast } from './ui.js';
import { exportData, importData } from './storage.js';

export function init() {
  renderSettings();

  // Toggle handlers
  document.getElementById('darkModeToggle')?.addEventListener('click', () => {
    state.settings.darkMode = !state.settings.darkMode;
    applyTheme();
    saveState();
    renderSettings();
  });

  document.getElementById('notifToggle')?.addEventListener('click', async () => {
    if (!state.settings.notifications) {
      await requestNotifications();
    } else {
      state.settings.notifications = false;
      saveState();
      renderSettings();
    }
  });

  document.getElementById('soundToggle')?.addEventListener('click', () => {
    state.settings.sound = !state.settings.sound;
    saveState();
    renderSettings();
    toast(`Sound effects ${state.settings.sound ? 'on' : 'off'}`, 'info');
  });

  document.getElementById('confettiToggle')?.addEventListener('click', () => {
    state.settings.confetti = !state.settings.confetti;
    saveState();
    renderSettings();
  });

  // Data management
  document.getElementById('exportBtn')?.addEventListener('click', handleExport);
  document.getElementById('importBtn')?.addEventListener('click', () => {
    document.getElementById('importFile')?.click();
  });
  document.getElementById('importFile')?.addEventListener('change', handleImport);
  document.getElementById('resetBtn')?.addEventListener('click', () => {
    document.getElementById('resetModal')?.classList.add('open');
  });
  document.getElementById('cancelResetBtn')?.addEventListener('click', () => {
    document.getElementById('resetModal')?.classList.remove('open');
  });
  document.getElementById('confirmResetBtn')?.addEventListener('click', () => {
    document.getElementById('resetModal')?.classList.remove('open');
    resetState();
    toast('All data reset!', 'info');
    document.dispatchEvent(new CustomEvent('app:reset'));
  });

  // Theme toggle in sidebar
  document.getElementById('themeToggleNav')?.addEventListener('click', () => {
    state.settings.darkMode = !state.settings.darkMode;
    applyTheme();
    saveState();
    renderSettings();
  });

  document.addEventListener('app:reset', renderSettings);
}

export function renderSettings() {
  const dm = document.getElementById('darkModeToggle');
  const nt = document.getElementById('notifToggle');
  const st = document.getElementById('soundToggle');
  const ct = document.getElementById('confettiToggle');

  if (dm) dm.className = 'toggle-switch' + (state.settings.darkMode ? ' on' : '');
  if (nt) nt.className = 'toggle-switch' + (state.settings.notifications ? ' on' : '');
  if (st) st.className = 'toggle-switch' + (state.settings.sound ? ' on' : '');
  if (ct) ct.className = 'toggle-switch' + (state.settings.confetti ? ' on' : '');
}

async function requestNotifications() {
  if (!('Notification' in window)) {
    toast('Notifications not supported in this browser.', 'error');
    return;
  }
  const perm = await Notification.requestPermission();
  if (perm === 'granted') {
    state.settings.notifications = true;
    toast('Notifications enabled! ✅', 'success');
    saveState();
    renderSettings();
  } else {
    toast('Notification permission denied.', 'error');
  }
}

function handleExport() {
  const json = exportData();
  const blob = new Blob([json], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  const today = new Date().toISOString().slice(0, 10);
  a.download = `tracku-backup-${today}.json`;
  a.click();
  toast('Data exported!', 'success');
}

function handleImport(e) {
  const file = e.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    try {
      const success = importData(ev.target.result);
      if (success) {
        toast('Data imported successfully!', 'success');
        document.dispatchEvent(new CustomEvent('app:reset'));
        document.dispatchEvent(new CustomEvent('state:changed'));
      } else {
        toast('Invalid backup file!', 'error');
      }
    } catch {
      toast('Error importing data!', 'error');
    }
  };
  reader.readAsText(file);
  e.target.value = '';
}