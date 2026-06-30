import { state } from './store.js';
import { subtractDays } from './utils.js';

// Re-export chart rendering functions from progress.js
export { renderProgressCharts } from './progress.js';

// Meter drawing
export function drawMeter(score, color) {
  const canvas = document.getElementById('meterCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;

  ctx.clearRect(0, 0, w, h);

  const cx = w / 2;
  const cy = h - 10;
  const r = 75;

  // Background arc
  ctx.beginPath();
  ctx.arc(cx, cy, r, Math.PI, 0, false);
  ctx.lineWidth = 12;
  ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--border').trim() || '#222';
  ctx.lineCap = 'round';
  ctx.stroke();

  // Foreground arc
  const pct = Math.min(score / 100, 1);
  ctx.beginPath();
  ctx.arc(cx, cy, r, Math.PI, Math.PI + pct * Math.PI, false);
  ctx.lineWidth = 12;
  ctx.strokeStyle = color;
  ctx.lineCap = 'round';
  ctx.stroke();

  // Tick marks
  for (let i = 0; i <= 10; i++) {
    const angle = Math.PI + (i / 10) * Math.PI;
    const x1 = cx + (r - 16) * Math.cos(angle);
    const y1 = cy + (r - 16) * Math.sin(angle);
    const x2 = cx + (r - 8) * Math.cos(angle);
    const y2 = cy + (r - 8) * Math.sin(angle);
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineWidth = i % 5 === 0 ? 2 : 1;
    ctx.strokeStyle = 'rgba(240,240,255,0.15)';
    ctx.stroke();
  }
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