import { state, saveState } from './store.js';
import { toast } from './ui.js';
import { awardXP } from './progress.js';

let pomInterval = null;
let pomRunning = false;
let pomSeconds = 25 * 60;
let pomMode = 'focus';
let pomSessions = 0;

export function init() {
  pomSessions = state.stats.pomSessions || 0;
  document.getElementById('pomSessionCount').textContent = pomSessions;

  // Button events
  document.getElementById('pomStart')?.addEventListener('click', startPom);
  document.getElementById('pomReset')?.addEventListener('click', () => {
    const seconds = pomMode === 'focus' ? 25 * 60 : pomMode === 'short' ? 5 * 60 : 15 * 60;
    pomSetMode(pomMode, seconds);
  });
  document.getElementById('pomFocusBtn')?.addEventListener('click', () => pomSetMode('focus', 25 * 60));
  document.getElementById('pomShortBtn')?.addEventListener('click', () => pomSetMode('short', 5 * 60));
  document.getElementById('pomLongBtn')?.addEventListener('click', () => pomSetMode('long', 15 * 60));
  document.getElementById('pomCustomBtn')?.addEventListener('click', () => {
    const mins = parseInt(document.getElementById('pomCustomMin')?.value) || 25;
    pomSetMode('focus', mins * 60);
  });

  updatePomUI();
}

function pomSetMode(mode, seconds) {
  pomMode = mode;
  clearInterval(pomInterval);
  pomRunning = false;
  pomSeconds = seconds;
  updatePomUI();
  document.getElementById('pomStart').textContent = '▶ Start';

  const modeNames = { focus: '🍅 Focus Time', short: '☕ Short Break', long: '🌿 Long Break' };
  document.getElementById('pomMode').textContent = modeNames[mode] || '🍅 Focus Time';
}

function updatePomUI() {
  const m = Math.floor(pomSeconds / 60);
  const s = pomSeconds % 60;
  document.getElementById('pomTime').textContent =
    `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;

  const total = pomMode === 'focus' ? 25 * 60 : pomMode === 'short' ? 5 * 60 : 15 * 60;
  const circ = 2 * Math.PI * 60;
  const offset = circ - (pomSeconds / total) * circ;
  document.getElementById('pomCircle').style.strokeDashoffset = offset;
}

function startPom() {
  if (pomRunning) {
    clearInterval(pomInterval);
    pomRunning = false;
    document.getElementById('pomStart').textContent = '▶ Start';
    return;
  }

  pomRunning = true;
  document.getElementById('pomStart').textContent = '⏸ Pause';

  pomInterval = setInterval(() => {
    if (pomSeconds > 0) {
      pomSeconds--;
      updatePomUI();
    } else {
      clearInterval(pomInterval);
      pomRunning = false;
      document.getElementById('pomStart').textContent = '▶ Start';

      if (pomMode === 'focus') {
        pomSessions++;
        state.stats.pomSessions = pomSessions;
        document.getElementById('pomSessionCount').textContent = pomSessions;
        awardXP(10);
        toast('🍅 Pomodoro session complete! +10 XP', 'xp');

        const log = document.getElementById('pomLog');
        const entry = document.createElement('div');
        entry.style.cssText = 'padding:8px 12px;background:var(--bg-card);border-radius:8px;font-size:12px;border:1px solid var(--border);';
        entry.innerHTML = `<strong>Session ${pomSessions}</strong> — ${new Date().toLocaleTimeString()} <span style="color:var(--accent-4)">+10 XP</span>`;
        if (log.firstElementChild && log.firstElementChild.textContent.includes('No sessions')) log.innerHTML = '';
        log.prepend(entry);
        saveState();

        // Notifications
        if (state.settings.sound) playSound('levelup');
        if (state.settings.notifications && 'Notification' in window) {
          new Notification('Pomodoro Complete!', { body: 'Time for a break 🎉' });
        }
      }
    }
  }, 1000);
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

export function getPomodoroState() {
  return { pomSeconds, pomRunning, pomMode, pomSessions };
}