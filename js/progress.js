import { state } from './store.js';
import { today, subtractDays, getLevel, getLevelXPRange, LEVELS } from './utils.js';
import { toast } from './ui.js';
import { todayActiveTasks } from './dashboard.js';

let progressChart = null;
let streakChart = null;
let completionChart = null;

export function init() {
  renderProgressCharts();

  // Chart range tabs
  document.querySelectorAll('[data-chart-range]').forEach(t => {
    t.addEventListener('click', () => {
      document.querySelectorAll('[data-chart-range]').forEach(x => x.classList.remove('active'));
      t.classList.add('active');
      state.activeChartRange = t.dataset.chartRange;
      renderProgressCharts();
    });
  });

  document.addEventListener('state:changed', renderProgressCharts);
  document.addEventListener('app:reset', renderProgressCharts);
  document.addEventListener('app:resize', () => {
    // Re-render charts on resize with debounce
    clearTimeout(window._chartResize);
    window._chartResize = setTimeout(renderProgressCharts, 300);
  });
}

export function renderProgressCharts() {
  const range = state.activeChartRange || 'week';
  let days = range === 'week' ? 7 : range === 'month' ? 30 : 90;

  const labels = [];
  const scores = [];

  for (let i = days - 1; i >= 0; i--) {
    const k = subtractDays(i);
    const h = state.history[k];
    const d = new Date();
    d.setDate(d.getDate() - i);
    labels.push(d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
    const pct = h && h.total > 0 ? Math.round(h.completed.length / h.total * 100) : 0;
    scores.push(pct);
  }

  const chartDefaults = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(18,18,26,0.95)',
        borderColor: 'rgba(124,92,252,0.3)',
        borderWidth: 1,
        titleColor: '#f0f0ff',
        bodyColor: 'rgba(240,240,255,0.7)',
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(255,255,255,0.04)' },
        ticks: { color: 'rgba(240,240,255,0.4)', font: { size: 11 }, maxRotation: 0 }
      },
      y: {
        grid: { color: 'rgba(255,255,255,0.04)' },
        ticks: { color: 'rgba(240,240,255,0.4)', font: { size: 11 } }
      }
    }
  };

  // Main progress chart
  const pCtx = document.getElementById('progressChart');
  if (pCtx) {
    if (progressChart) progressChart.destroy();
    progressChart = new Chart(pCtx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Completion %',
          data: scores,
          borderColor: '#7c5cfc',
          backgroundColor: 'rgba(124,92,252,0.1)',
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: '#7c5cfc',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
        }]
      },
      options: {
        ...chartDefaults,
        scales: {
          ...chartDefaults.scales,
          y: {
            ...chartDefaults.scales.y,
            min: 0,
            max: 100,
          }
        }
      }
    });
  }

  // Streak chart
  const sCtx = document.getElementById('streakChart');
  if (sCtx) {
    if (streakChart) streakChart.destroy();
    const runStreak = [];
    let s = 0;
    scores.forEach(v => { s = v > 0 ? s + 1 : 0; runStreak.push(s); });
    streakChart = new Chart(sCtx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Streak Growth',
          data: runStreak,
          backgroundColor: 'rgba(67,233,123,0.4)',
          borderColor: '#43e97b',
          borderWidth: 2,
          borderRadius: 4,
        }]
      },
      options: { ...chartDefaults }
    });
  }

  // Completion chart
  const cCtx = document.getElementById('completionChart');
  if (cCtx) {
    if (completionChart) completionChart.destroy();
    const totalTasks = scores.reduce((a, b) => a + b, 0);
    const avgScore = scores.length > 0 ? Math.round(totalTasks / scores.length) : 0;
    completionChart = new Chart(cCtx, {
      type: 'doughnut',
      data: {
        labels: ['Completed', 'Missed'],
        datasets: [{
          data: [avgScore, 100 - avgScore],
          backgroundColor: ['rgba(124,92,252,0.8)', 'rgba(255,255,255,0.06)'],
          borderColor: ['#7c5cfc', 'transparent'],
          borderWidth: 2,
          borderRadius: 4,
        }]
      },
      options: {
        responsive: true,
        cutout: '72%',
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: ctx => ` ${ctx.parsed}%` } }
        }
      }
    });
  }
}

// XP & Level
export function awardXP(amount) {
  state.stats.totalXP += amount;
  if (state.stats.totalXP < 0) state.stats.totalXP = 0;

  const newLvl = getLevel(state.stats.totalXP);
  if (newLvl > state.stats.level) {
    state.stats.level = newLvl;
    toast(`🎉 Level Up! You're now Level ${newLvl}!`, 'xp');
    playSound('levelup');
  } else if (newLvl < state.stats.level) {
    state.stats.level = newLvl;
  }
}

export function recalcStreak() {
  let streak = 0;
  const todayStr = today();
  let check = new Date();
  check.setDate(check.getDate() - 1);

  while (true) {
    const k = dateKey(check);
    if (k === todayStr) break;
    const h = state.history[k];
    if (h && h.total > 0 && h.completed.length >= Math.ceil(h.total * 0.5)) {
      streak++;
    } else if (h) {
      break;
    } else {
      break;
    }
    check.setDate(check.getDate() - 1);
  }

  const todayH = state.history[todayStr];
  if (todayH && todayH.total > 0 && todayH.completed.length > 0) streak++;

  state.stats.currentStreak = streak;
  state.stats.longestStreak = Math.max(state.stats.longestStreak, streak);
}

export function calcConsistencyScore() {
  let total = 0, completed = 0;
  for (let i = 0; i < 30; i++) {
    const k = subtractDays(i);
    const h = state.history[k];
    if (h && h.total > 0) {
      total += h.total;
      completed += h.completed.length;
    }
  }
  const rate = total > 0 ? completed / total : 0;
  const streakBonus = Math.min(state.stats.currentStreak * 1.5, 20);
  return Math.min(100, Math.round(rate * 80 + streakBonus));
}

export function getHealthStatus(score) {
  if (score >= 85) return { label: 'Excellent', color: '#43e97b' };
  if (score >= 65) return { label: 'Good', color: '#4facfe' };
  if (score >= 45) return { label: 'Average', color: '#f9a825' };
  if (score >= 25) return { label: 'Falling Behind', color: '#fc9a25' };
  return { label: 'Critical', color: '#fc5c7d' };
}

function playSound(type) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'levelup') {
      osc.frequency.setValueAtTime(392, ctx.currentTime);
      osc.frequency.setValueAtTime(523, ctx.currentTime + 0.1);
      osc.frequency.setValueAtTime(659, ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.5);
    }
  } catch (e) { /* silently fail */ }
}

function dateKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

// Export chart instances for cleanup
export function destroyCharts() {
  if (progressChart) { progressChart.destroy(); progressChart = null; }
  if (streakChart) { streakChart.destroy(); streakChart = null; }
  if (completionChart) { completionChart.destroy(); completionChart = null; }
}