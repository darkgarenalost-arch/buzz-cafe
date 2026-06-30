import { state, saveState } from './store.js';
import { today, getGreeting, formatDate, getLevel, getLevelXPRange } from './utils.js';
import { toast } from './ui.js';
import { drawMeter, calcConsistencyScore, getHealthStatus } from './charts.js';
import { renderTaskList } from './tasks.js';
import { renderHeatmap } from './heatmap.js';
import { renderBadges } from './achievements.js';
import { renderStats } from './statistics.js';
import { renderWeekly } from './weekly.js';
import { renderProgressCharts } from './progress.js';

let renderTimeout = null;

export function init() {
  renderDashboard();
  // Set up interval for real-time updates
  if (renderTimeout) clearInterval(renderTimeout);
  renderTimeout = setInterval(renderDashboard, 60000);

  // Listen for state changes
  document.addEventListener('state:changed', renderDashboard);
  document.addEventListener('route:changed', (e) => {
    if (e.detail.route === 'dashboard') renderDashboard();
  });
}

export function renderDashboard() {
  const container = document.getElementById('appShell');
  if (!container) return;

  // The template is already rendered by router, now update dynamic content
  updateHeader();
  updateStats();
  updateRing();
  updateXP();
  updateMeter();
  updateTaskList();
}

function updateHeader() {
  const greeting = document.getElementById('greeting');
  const date = document.getElementById('currentDate');
  if (greeting) greeting.textContent = `${getGreeting()}! `;
  if (date) date.textContent = formatDate();
}

function updateStats() {
  const streak = state.stats.currentStreak;
  document.getElementById('currentStreak').textContent = streak;
  document.getElementById('longestStreak').textContent = state.stats.longestStreak;
  document.getElementById('dashXP').textContent = state.stats.totalXP;
  document.getElementById('dashLevel').textContent = `Level ${getLevel(state.stats.totalXP)}`;

  const active = todayActiveTasks();
  const done = active.filter(t => t.completedToday).length;
  const pct = active.length > 0 ? Math.round(done / active.length * 100) : 0;
  document.getElementById('todayDone').textContent = `${done}/${active.length}`;
  document.getElementById('todayPct').textContent = `${pct}% complete`;
}

function updateRing() {
  const active = todayActiveTasks();
  const done = active.filter(t => t.completedToday).length;
  const pct = active.length > 0 ? Math.round(done / active.length * 100) : 0;

  const circ = 2 * Math.PI * 42;
  const offset = circ - (pct / 100) * circ;
  const ring = document.getElementById('todayRing');
  if (ring) ring.style.strokeDashoffset = offset;

  document.getElementById('ringPctText').textContent = pct + '%';
  document.getElementById('ringCompleted').textContent = `${done} completed`;
  document.getElementById('ringRemaining').textContent = `${active.length - done} remaining`;

  const todayXP = (state.history[today()] || {}).xp || 0;
  document.getElementById('ringXpToday').textContent = `+${todayXP} XP today`;
}

function updateXP() {
  const xp = state.stats.totalXP;
  const lvl = getLevel(xp);
  state.stats.level = lvl;
  const { curXP, nextXP } = getLevelXPRange(lvl);
  const pct = nextXP > curXP ? ((xp - curXP) / (nextXP - curXP) * 100) : 100;

  document.getElementById('xpValue').textContent = xp;
  document.getElementById('levelBadge').textContent = `⭐ Level ${lvl}`;
  document.getElementById('xpCurrent').textContent = `${xp} XP`;
  document.getElementById('xpNext').textContent = nextXP > curXP ? `${nextXP - xp} XP to next level` : 'Max level!';
  document.getElementById('xpBarFill').style.width = `${Math.min(pct, 100)}%`;
}

function updateMeter() {
  const score = calcConsistencyScore();
  const { label, color } = getHealthStatus(score);
  document.getElementById('meterScore').textContent = score;
  document.getElementById('meterStatus').textContent = label;
  document.getElementById('meterStatus').style.color = color;
  drawMeter(score, color);
}

function updateTaskList() {
  const list = document.getElementById('dashboardTaskList');
  if (!list) return;
  // Use the tasks module to render
  const tasks = todayActiveTasks();
  renderTaskList(list, tasks, true);
}

function todayActiveTasks() {
  const dow = new Date().getDay();
  return state.tasks.filter(t => {
    if (t.frequency === 'weekdays') return dow >= 1 && dow <= 5;
    if (t.frequency === 'weekends') return dow === 0 || dow === 6;
    return true;
  });
}

// Export for use in other modules
export { todayActiveTasks };