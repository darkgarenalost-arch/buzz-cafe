import { state, saveState } from './store.js';
import { toast } from './ui.js';

export async function requestNotificationPermission() {
  if (!('Notification' in window)) {
    toast('Notifications not supported in this browser.', 'error');
    return false;
  }

  const perm = await Notification.requestPermission();
  if (perm === 'granted') {
    state.settings.notifications = true;
    saveState();
    toast('Notifications enabled! ✅', 'success');
    return true;
  } else {
    toast('Notification permission denied.', 'error');
    return false;
  }
}

export function sendNotification(title, body, icon = 'logo.png') {
  if (!state.settings.notifications) return;
  if (!('Notification' in window)) return;
  if (Notification.permission !== 'granted') return;

  try {
    new Notification(title, { body, icon });
  } catch (e) {
    console.warn('Notification error:', e);
  }
}

export function scheduleDailyReminders() {
  // Check if notifications are enabled
  if (!state.settings.notifications) return;

  // Morning reminder (9 AM)
  const morningReminder = () => {
    const activeTasks = getTodayActiveTasks();
    if (activeTasks.length > 0) {
      sendNotification(
        '🌅 Good Morning!',
        `You have ${activeTasks.length} tasks to complete today. Let's go!`
      );
    }
  };

  // Evening reminder (8 PM)
  const eveningReminder = () => {
    const activeTasks = getTodayActiveTasks();
    const done = activeTasks.filter(t => t.completedToday).length;
    if (done < activeTasks.length) {
      sendNotification(
        '🌇 Evening Check-in',
        `You've completed ${done}/${activeTasks.length} tasks today. ${activeTasks.length - done} remaining!`
      );
    }
  };

  // Schedule based on current time
  const now = new Date();
  const morningTime = new Date();
  morningTime.setHours(9, 0, 0, 0);
  const eveningTime = new Date();
  eveningTime.setHours(20, 0, 0, 0);

  // If we're past morning time, schedule for tomorrow
  // This is a simplified version - in production you'd use a service worker
}

function getTodayActiveTasks() {
  const dow = new Date().getDay();
  const { state } = require('./store.js');
  return state.tasks.filter(t => {
    if (t.frequency === 'weekdays') return dow >= 1 && dow <= 5;
    if (t.frequency === 'weekends') return dow === 0 || dow === 6;
    return true;
  });
}