import { state, saveState } from './store.js';

const STORAGE_KEY = 'streakos_v2';

export function loadFromStorage() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    return data;
  } catch {
    return null;
  }
}

export function saveToStorage() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('Storage save error:', e);
  }
}

export function clearStorage() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.warn('Storage clear error:', e);
  }
}

export function exportData() {
  return JSON.stringify(state, null, 2);
}

export function importData(json) {
  try {
    const data = JSON.parse(json);
    if (data && typeof data === 'object') {
      Object.assign(state, data);
      saveState();
      return true;
    }
    return false;
  } catch {
    return false;
  }
}