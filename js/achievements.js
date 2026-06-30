import { state } from './store.js';
import { toast } from './ui.js';

export const BADGES = [
  { id: 'first_task', icon: '🌟', name: 'First Step', desc: 'Complete your first task', condition: s => s.totalCompletions >= 1 },
  { id: 'streak_3', icon: '🔥', name: '3 Day Streak', desc: 'Streak of 3 days', condition: s => s.currentStreak >= 3 },
  { id: 'streak_7', icon: '🏅', name: 'Week Warrior', desc: 'Streak of 7 days', condition: s => s.currentStreak >= 7 },
  { id: 'streak_14', icon: '💎', name: 'Fortnight Force', desc: 'Streak of 14 days', condition: s => s.currentStreak >= 14 },
  { id: 'streak_30', icon: '👑', name: 'Monthly Master', desc: 'Streak of 30 days', condition: s => s.currentStreak >= 30 },
  { id: 'tasks_10', icon: '💪', name: 'Getting Started', desc: '10 tasks completed', condition: s => s.totalCompletions >= 10 },
  { id: 'tasks_50', icon: '🚀', name: 'On Fire', desc: '50 tasks completed', condition: s => s.totalCompletions >= 50 },
  { id: 'tasks_100', icon: '⚡', name: 'Century Club', desc: '100 tasks completed', condition: s => s.totalCompletions >= 100 },
  { id: 'perfect_week', icon: '🎯', name: 'Perfect Week', desc: '100% completion for 7 days', condition: s => s.perfectWeeks >= 1 },
  { id: 'consistency_master', icon: '🧠', name: 'Consistency Master', desc: 'Score over 80 for 30 days', condition: s => s.highScoreDays >= 30 },
  { id: 'early_bird', icon: '🐦', name: 'Early Bird', desc: 'Task completed before 8am', condition: s => s.earlyBird },
  { id: 'level_5', icon: '🌈', name: 'Level 5 Legend', desc: 'Reach level 5', condition: s => s.level >= 5 },
];

export function init() {
  renderBadges();
  document.addEventListener('state:changed', renderBadges);
  document.addEventListener('app:reset', renderBadges);
}

export function renderBadges() {
  const grid = document.getElementById('badgesGrid');
  if (!grid) return;

  grid.innerHTML = '';

  // Ensure all badges have state
  BADGES.forEach(b => {
    if (!state.stats['badge_' + b.id]) state.stats['badge_' + b.id] = false;
  });

  BADGES.forEach(b => {
    const unlocked = !!state.stats['badge_' + b.id];
    const isNew = (state.stats.newBadges || []).includes(b.id);

    const card = document.createElement('div');
    card.className = 'badge-card ' + (unlocked ? 'unlocked' : 'locked');
    card.innerHTML = `
      ${isNew && unlocked ? '<div class="badge-new">NEW</div>' : ''}
      <div class="badge-icon">${b.icon}</div>
      <div class="badge-name">${b.name}</div>
      <div class="badge-desc">${b.desc}</div>
    `;
    grid.appendChild(card);
  });

  // Clear new badges after showing
  if (state.stats.newBadges && state.stats.newBadges.length > 0) {
    state.stats.newBadges = [];
    // Save state without triggering a full re-render loop
    import('./store.js').then(({ saveState }) => saveState());
  }
}

export function checkAchievements() {
  const s = {
    currentStreak: state.stats.currentStreak,
    longestStreak: state.stats.longestStreak,
    totalCompletions: state.stats.totalCompletions,
    perfectWeeks: state.stats.perfectWeeks || 0,
    highScoreDays: state.stats.highScoreDays || 0,
    earlyBird: state.stats.earlyBird || false,
    level: state.stats.level || 1,
  };

  BADGES.forEach(b => {
    const key = 'badge_' + b.id;
    if (!state.stats[key] && b.condition(s)) {
      state.stats[key] = true;
      if (!state.stats.newBadges) state.stats.newBadges = [];
      if (!state.stats.newBadges.includes(b.id)) {
        state.stats.newBadges.push(b.id);
        toast(`🏆 Achievement unlocked: ${b.name}!`, 'success');
      }
    }
  });

  import('./store.js').then(({ saveState }) => saveState());
}