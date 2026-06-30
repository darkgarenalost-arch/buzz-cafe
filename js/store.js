// Central state store
export const state = {
  tasks: [],
  history: {},
  stats: {
    totalXP: 0,
    currentStreak: 0,
    longestStreak: 0,
    totalCompletions: 0,
    perfectWeeks: 0,
    highScoreDays: 0,
    earlyBird: false,
    level: 1,
    newBadges: [],
    pomSessions: 0,
    pomLog: [],
  },
  settings: {
    darkMode: false,
    notifications: false,
    sound: false,
    confetti: true,
  },
  lastReset: null,
  editingTaskId: null,
  selectedEmoji: '✅',
  activeFilter: 'all',
  activeSection: 'dashboard',
  activeChartRange: 'week',
};

let saveTimer = null;

// Load state from localStorage
export function initializeState() {
  try {
    const saved = JSON.parse(localStorage.getItem('streakos_v2') || 'null');
    if (saved) {
      Object.assign(state, saved);
      state.settings = { ...state.settings, ...(saved.settings || {}) };
      state.stats = { ...state.stats, ...(saved.stats || {}) };
    }
  } catch (e) {
    console.warn('Failed to load state:', e);
  }
}

// Save state to localStorage
export function saveState() {
  try {
    localStorage.setItem('streakos_v2', JSON.stringify(state));
  } catch (e) {
    console.warn('Failed to save state:', e);
  }

  // Also sync to Firestore if logged in
  const { getCurrentUser } = import('./firebase.js').then(m => m.getCurrentUser());
  const user = getCurrentUser?.();
  if (user) {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      import('./firebase.js').then(({ pushStateToFirestore }) => {
        pushStateToFirestore();
      });
    }, 1200);
  }
}

export function getState() {
  return state;
}

export function updateState(updates) {
  Object.assign(state, updates);
  saveState();
}

export function updateStats(updates) {
  Object.assign(state.stats, updates);
  saveState();
}

export function updateSettings(updates) {
  Object.assign(state.settings, updates);
  saveState();
}

export function resetState() {
  state.tasks = [];
  state.history = {};
  state.stats = {
    totalXP: 0,
    currentStreak: 0,
    longestStreak: 0,
    totalCompletions: 0,
    perfectWeeks: 0,
    highScoreDays: 0,
    earlyBird: false,
    level: 1,
    newBadges: [],
    pomSessions: 0,
    pomLog: [],
  };
  state.lastReset = null;
  saveState();
}

// Subscribe to state changes
const subscribers = [];

export function subscribe(callback) {
  subscribers.push(callback);
  return () => {
    const idx = subscribers.indexOf(callback);
    if (idx > -1) subscribers.splice(idx, 1);
  };
}

export function notifySubscribers() {
  subscribers.forEach(cb => cb(state));
}