import { state } from './store.js';
import { today, subtractDays } from './utils.js';

export function init() {
  renderStats();
  document.addEventListener('state:changed', renderStats);
  document.addEventListener('app:reset', renderStats);
}

export function renderStats() {
  const grid = document.getElementById('statsGrid');
  if (!grid) return;

  const active = todayActiveTasks();
  const done = active.filter(t => t.completedToday).length;

  let wTotal = 0, wDone = 0;
  for (let i = 0; i < 7; i++) {
    const k = subtractDays(i);
    const h = state.history[k];
    if (h) { wTotal += h.total; wDone += h.completed.length; }
  }

  let mTotal = 0, mDone = 0;
  for (let i = 0; i < 30; i++) {
    const k = subtractDays(i);
    const h = state.history[k];
    if (h) { mTotal += h.total; mDone += h.completed.length; }
  }

  const taskCounts = {};
  Object.values(state.history).forEach(h => {
    (h.completed || []).forEach(id => {
      taskCounts[id] = (taskCounts[id] || 0) + 1;
    });
  });

  let mostConsistent = '', leastConsistent = '';
  let maxC = -1, minC = Infinity;

  state.tasks.forEach(t => {
    const c = taskCounts[t.id] || 0;
    if (c > maxC) { maxC = c; mostConsistent = t.name; }
    if (c < minC) { minC = c; leastConsistent = t.name; }
  });

  if (minC === Infinity) { minC = 0; leastConsistent = '—'; }

  const avgPerDay = mTotal > 0 ? (mDone / 30).toFixed(1) : '0';

  const statsData = [
    { icon: '📋', label: 'Total Tasks Created', value: state.tasks.length },
    { icon: '✅', label: 'Total Completions', value: state.stats.totalCompletions },
    { icon: '🔥', label: 'Current Streak', value: `${state.stats.currentStreak} days` },
    { icon: '👑', label: 'Longest Streak', value: `${state.stats.longestStreak} days` },
    { icon: '📅', label: 'Weekly Completion', value: wTotal > 0 ? `${Math.round(wDone / wTotal * 100)}%` : '—' },
    { icon: '🗓️', label: 'Monthly Completion', value: mTotal > 0 ? `${Math.round(mDone / mTotal * 100)}%` : '—' },
    { icon: '📊', label: 'Avg Tasks/Day', value: avgPerDay },
    { icon: '⭐', label: 'Most Consistent', value: mostConsistent || '—', small: true },
    { icon: '😴', label: 'Needs Attention', value: leastConsistent || '—', small: true },
  ];

  grid.innerHTML = statsData.map(s => `
    <div class="card">
      <div style="font-size:24px;margin-bottom:8px;">${s.icon}</div>
      <div class="stat-label">${s.label}</div>
      <div class="stat-value" style="font-size:${s.small ? '18px' : '26px'};background:var(--gradient-1);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">${s.value}</div>
    </div>
  `).join('');
}

function todayActiveTasks() {
  const dow = new Date().getDay();
  return state.tasks.filter(t => {
    if (t.frequency === 'weekdays') return dow >= 1 && dow <= 5;
    if (t.frequency === 'weekends') return dow === 0 || dow === 6;
    return true;
  });
}