import { state } from './store.js';
import { today, subtractDays, dateKey } from './utils.js';

export function init() {
  renderHeatmap();
  document.addEventListener('state:changed', renderHeatmap);
  document.addEventListener('app:reset', renderHeatmap);
}

export function renderHeatmap() {
  const grid = document.getElementById('heatmapGrid');
  const months = document.getElementById('heatmapMonths');
  if (!grid) return;

  grid.innerHTML = '';
  months.innerHTML = '';

  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - 364);
  while (start.getDay() !== 0) start.setDate(start.getDate() - 1);

  let cur = new Date(start);
  let weekCol = null;
  let lastMonth = -1;

  while (cur <= end) {
    if (cur.getDay() === 0) {
      weekCol = document.createElement('div');
      weekCol.className = 'heatmap-col';
      grid.appendChild(weekCol);

      if (cur.getMonth() !== lastMonth) {
        const span = document.createElement('span');
        span.textContent = cur.toLocaleString('en-US', { month: 'short' });
        span.style.minWidth = '36px';
        months.appendChild(span);
        lastMonth = cur.getMonth();
      }
    }

    const k = dateKey(cur);
    const h = state.history[k];
    let level = 0;

    if (h && h.total > 0) {
      const pct = h.completed.length / h.total;
      if (pct > 0 && pct <= 0.25) level = 1;
      else if (pct <= 0.5) level = 2;
      else if (pct <= 0.75) level = 3;
      else if (pct > 0.75) level = 4;
    }

    const cell = document.createElement('div');
    cell.className = 'heatmap-cell';
    if (level > 0) cell.dataset.level = level;
    cell.title = `${k}: ${h ? h.completed.length + '/' + h.total + ' tasks' : 'No data'}`;

    if (weekCol) weekCol.appendChild(cell);
    cur.setDate(cur.getDate() + 1);
  }
}

export function getHeatmapData() {
  const data = [];
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - 364);

  let cur = new Date(start);
  while (cur <= end) {
    const k = dateKey(cur);
    const h = state.history[k];
    data.push({
      date: k,
      completed: h ? h.completed.length : 0,
      total: h ? h.total : 0,
      score: h ? h.score : 0,
    });
    cur.setDate(cur.getDate() + 1);
  }
  return data;
}