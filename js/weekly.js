import { state } from './store.js';
import { today, dateKey, subtractDays } from './utils.js';

export function init() {
  renderWeekly();
  document.addEventListener('state:changed', renderWeekly);
  document.addEventListener('app:reset', renderWeekly);
}

export function renderWeekly() {
  const container = document.getElementById('weeklyDays');
  if (!container) return;

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const now = new Date();
  const dow = now.getDay();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - dow + (dow === 0 ? -6 : 1));

  container.innerHTML = '';
  let wTotal = 0, wDone = 0;
  let bestDay = '', bestPct = 0;

  for (let i = 0; i < 7; i++) {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    const k = dateKey(d);
    const h = state.history[k];
    const pct = h && h.total > 0 ? Math.round(h.completed.length / h.total * 100) : 0;
    const isToday = k === today();

    if (h) {
      wTotal += h.total;
      wDone += h.completed.length;
      if (pct > bestPct) {
        bestPct = pct;
        bestDay = days[d.getDay()];
      }
    }

    const div = document.createElement('div');
    div.className = 'wday';
    if (isToday) div.style.borderColor = 'var(--accent)';
    div.innerHTML = `
      <div class="wday-name">${days[d.getDay()]}</div>
      <div class="wday-bar-wrap"><div class="wday-bar" style="height:${Math.min(pct * 0.4, 40)}px;"></div></div>
      <div class="wday-pct" style="color:${pct >= 80 ? '#43e97b' : pct >= 50 ? '#f9a825' : 'var(--text-muted)'}">${pct}%</div>
    `;
    container.appendChild(div);
  }

  // Highlights
  const hl = document.getElementById('weeklyHighlights');
  const wPct = wTotal > 0 ? Math.round(wDone / wTotal * 100) : 0;
  if (hl) {
    hl.innerHTML = `
      ✅ Completed ${wDone} of ${wTotal} tasks this week<br>
      📊 Weekly completion rate: <strong>${wPct}%</strong><br>
      🔥 Current streak: <strong>${state.stats.currentStreak} days</strong><br>
      🌟 Best day this week: <strong>${bestDay || '—'}</strong> (${Math.round(bestPct)}%)
    `;
  }

  // Goals
  const goals = document.getElementById('weeklyGoals');
  const needed = Math.max(0, 80 - wPct);
  if (goals) {
    goals.innerHTML = `
      🎯 Target completion rate: <strong>80%+</strong><br>
      📈 You're at <strong>${wPct}%</strong> — ${wPct >= 80 ? '🎉 Goal achieved!' : `${needed}% more needed`}<br>
      🔥 Streak goal: <strong>${state.stats.currentStreak + 3} days</strong><br>
      ⚡ XP goal: <strong>${state.stats.totalXP + 100} XP</strong>
    `;
  }
}