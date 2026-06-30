import { state, saveState } from './store.js';
import { generateId, escHtml, CAT_COLORS } from './utils.js';
import { toast } from './ui.js';
import { todayActiveTasks } from './dashboard.js';
import { awardXP, checkAchievements, recalcStreak } from './progress.js';

let dragId = null;

export function init() {
  // Task filter chips
  document.querySelectorAll('.filter-chip').forEach(c => {
    c.addEventListener('click', () => {
      document.querySelectorAll('.filter-chip').forEach(x => x.classList.remove('active'));
      c.classList.add('active');
      state.activeFilter = c.dataset.filter;
      renderMainTaskList();
    });
  });

  // Task search
  document.getElementById('taskSearch')?.addEventListener('input', () => {
    renderMainTaskList();
  });

  // Add task buttons
  document.getElementById('addTaskBtn')?.addEventListener('click', openAddModal);
  document.getElementById('addTaskBtn2')?.addEventListener('click', openAddModal);

  // Save task
  document.getElementById('saveTaskBtn')?.addEventListener('click', saveModal);

  // Emoji picker
  document.querySelectorAll('.emoji-opt').forEach(el => {
    el.addEventListener('click', () => {
      state.selectedEmoji = el.dataset.emoji;
      updateEmojiPicker();
    });
  });

  // Task name enter key
  document.getElementById('taskNameInput')?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') saveModal();
  });

  // Listen for state changes
  document.addEventListener('state:changed', renderMainTaskList);
  document.addEventListener('app:reset', renderMainTaskList);
}

export function renderMainTaskList() {
  const container = document.getElementById('mainTaskList');
  if (!container) return;

  let tasks = [...state.tasks];
  const filter = state.activeFilter || 'all';
  const search = (document.getElementById('taskSearch') || {}).value || '';

  if (filter !== 'all' && filter !== 'today') {
    tasks = tasks.filter(t => t.category === filter);
  }
  if (filter === 'today') tasks = todayActiveTasks();

  if (search) {
    tasks = tasks.filter(t => t.name.toLowerCase().includes(search.toLowerCase()));
  }

  const empty = document.getElementById('taskEmptyState');
  if (tasks.length === 0) {
    container.innerHTML = '';
    if (empty) empty.style.display = 'block';
    return;
  }
  if (empty) empty.style.display = 'none';

  renderTaskList(container, tasks, false);
}

export function renderTaskList(container, tasks, isDashboard) {
  container.innerHTML = '';
  tasks.forEach((task, idx) => {
    const el = document.createElement('div');
    el.className = 'task-item' + (task.completedToday ? ' done' : '');
    el.dataset.id = task.id;
    el.draggable = !isDashboard;

    const catColor = CAT_COLORS[task.category] || CAT_COLORS[''];

    el.innerHTML = `
      <div class="task-priority-bar ${task.priority || 'medium'}"></div>
      ${!isDashboard ? '<div class="drag-handle" title="Drag to reorder">⋮⋮</div>' : ''}
      <div class="task-checkbox ${task.completedToday ? 'checked' : ''}" data-id="${task.id}"></div>
      <div class="task-emoji">${task.emoji || '✅'}</div>
      <div class="task-content">
        <div class="task-name">${escHtml(task.name)}</div>
        <div class="task-meta">
          ${task.category ? `<span class="task-tag" style="background:${catColor}22;color:${catColor}">${task.category}</span>` : ''}
          <span class="task-freq">${task.frequency || 'daily'}</span>
          <span class="task-xp">+${task.xp || 20} XP</span>
        </div>
      </div>
      <div class="task-actions">
        ${!isDashboard ? `<button class="task-action-btn edit" data-id="${task.id}" title="Edit">✏️</button>` : ''}
        ${!isDashboard ? `<button class="task-action-btn delete" data-id="${task.id}" title="Delete">🗑️</button>` : ''}
      </div>
    `;

    const checkbox = el.querySelector('.task-checkbox');
    checkbox.addEventListener('click', (e) => {
      e.stopPropagation();
      completeTask(task.id);
    });

    const editBtn = el.querySelector('.edit');
    const delBtn = el.querySelector('.delete');

    if (editBtn) {
      editBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        openEditModal(task.id);
      });
    }

    if (delBtn) {
      delBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        deleteTask(task.id);
      });
    }

    // Drag events
    el.addEventListener('dragstart', (e) => {
      dragId = task.id;
      el.classList.add('dragging');
    });

    el.addEventListener('dragend', () => {
      document.querySelectorAll('.task-item').forEach(el => el.classList.remove('dragging', 'drag-over'));
    });

    el.addEventListener('dragover', (e) => {
      e.preventDefault();
      document.querySelectorAll('.task-item').forEach(el => el.classList.remove('drag-over'));
      el.classList.add('drag-over');
    });

    el.addEventListener('drop', (e) => {
      e.preventDefault();
      const targetId = task.id;
      if (!dragId || dragId === targetId) return;
      const from = state.tasks.findIndex(t => t.id === dragId);
      const to = state.tasks.findIndex(t => t.id === targetId);
      const [moved] = state.tasks.splice(from, 1);
      state.tasks.splice(to, 0, moved);
      saveState();
      renderMainTaskList();
      document.dispatchEvent(new CustomEvent('state:changed'));
    });

    container.appendChild(el);
  });
}

export function completeTask(taskId) {
  const task = state.tasks.find(t => t.id === taskId);
  if (!task) return;

  task.completedToday = !task.completedToday;
  const t = today();

  if (!state.history[t]) {
    state.history[t] = { completed: [], total: todayActiveTasks().length, score: 0, xp: 0 };
  }

  const xp = task.xp || 20;

  if (task.completedToday) {
    if (!state.history[t].completed.includes(taskId)) {
      state.history[t].completed.push(taskId);
      state.stats.totalCompletions++;
      awardXP(xp);
      state.history[t].xp = (state.history[t].xp || 0) + xp;
      if (new Date().getHours() < 8) state.stats.earlyBird = true;
      toast(`+${xp} XP — ${task.name} completed! 🎯`, 'xp');
      playSound('complete');

      // Check if all done today
      const active = todayActiveTasks();
      const allDone = active.length > 0 && active.every(t => t.completedToday);
      if (allDone) {
        if (state.settings.confetti) launchConfetti();
        toast('🎉 All tasks completed today! Incredible!', 'success');
      }
    }
  } else {
    const idx = state.history[t].completed.indexOf(taskId);
    if (idx > -1) {
      state.history[t].completed.splice(idx, 1);
      state.stats.totalCompletions = Math.max(0, state.stats.totalCompletions - 1);
      awardXP(-xp);
      state.history[t].xp = Math.max(0, (state.history[t].xp || 0) - xp);
    }
  }

  state.history[t].total = todayActiveTasks().length;
  const pct = state.history[t].total > 0 ? state.history[t].completed.length / state.history[t].total : 0;
  state.history[t].score = Math.round(pct * 100);

  recalcStreak();
  checkAchievements();
  saveState();
  document.dispatchEvent(new CustomEvent('state:changed'));
  document.dispatchEvent(new CustomEvent('task:completed'));
}

export function addTask(data) {
  const task = {
    id: generateId(),
    name: data.name,
    category: data.category || '',
    emoji: data.emoji || '✅',
    frequency: data.frequency || 'daily',
    priority: data.priority || 'medium',
    xp: parseInt(data.xp) || 20,
    note: data.note || '',
    completedToday: false,
    createdAt: new Date().toISOString(),
    order: state.tasks.length,
  };
  state.tasks.push(task);
  saveState();
  document.dispatchEvent(new CustomEvent('state:changed'));
  toast(`Task "${task.name}" added!`, 'success');
}

export function deleteTask(id) {
  state.tasks = state.tasks.filter(t => t.id !== id);
  saveState();
  document.dispatchEvent(new CustomEvent('state:changed'));
  toast('Task deleted', 'info');
}

export function editTask(data) {
  const task = state.tasks.find(t => t.id === data.id);
  if (!task) return;
  Object.assign(task, {
    name: data.name,
    category: data.category,
    emoji: data.emoji,
    frequency: data.frequency,
    priority: data.priority,
    xp: parseInt(data.xp),
    note: data.note,
  });
  saveState();
  document.dispatchEvent(new CustomEvent('state:changed'));
  toast('Task updated!', 'success');
}

// Modal functions
export function openAddModal() {
  state.editingTaskId = null;
  document.getElementById('modalTitle').textContent = '✨ Add New Task';
  document.getElementById('taskNameInput').value = '';
  document.getElementById('taskCategoryInput').value = '';
  document.getElementById('taskPriorityInput').value = 'medium';
  document.getElementById('taskFreqInput').value = 'daily';
  document.getElementById('taskXPInput').value = '20';
  document.getElementById('taskNoteInput').value = '';
  state.selectedEmoji = '✅';
  updateEmojiPicker();
  document.getElementById('taskModal').classList.add('open');
  setTimeout(() => document.getElementById('taskNameInput').focus(), 300);
}

export function openEditModal(id) {
  const task = state.tasks.find(t => t.id === id);
  if (!task) return;
  state.editingTaskId = id;
  document.getElementById('modalTitle').textContent = '✏️ Edit Task';
  document.getElementById('taskNameInput').value = task.name;
  document.getElementById('taskCategoryInput').value = task.category || '';
  document.getElementById('taskPriorityInput').value = task.priority || 'medium';
  document.getElementById('taskFreqInput').value = task.frequency || 'daily';
  document.getElementById('taskXPInput').value = task.xp || '20';
  document.getElementById('taskNoteInput').value = task.note || '';
  state.selectedEmoji = task.emoji || '✅';
  updateEmojiPicker();
  document.getElementById('taskModal').classList.add('open');
}

function saveModal() {
  const name = document.getElementById('taskNameInput').value.trim();
  if (!name) {
    toast('Please enter a task name!', 'error');
    return;
  }

  const data = {
    id: state.editingTaskId,
    name,
    category: document.getElementById('taskCategoryInput').value,
    priority: document.getElementById('taskPriorityInput').value,
    frequency: document.getElementById('taskFreqInput').value,
    xp: document.getElementById('taskXPInput').value,
    note: document.getElementById('taskNoteInput').value,
    emoji: state.selectedEmoji,
  };

  if (state.editingTaskId) editTask(data);
  else addTask(data);

  document.getElementById('taskModal').classList.remove('open');
}

function updateEmojiPicker() {
  document.querySelectorAll('.emoji-opt').forEach(el => {
    el.classList.toggle('selected', el.dataset.emoji === state.selectedEmoji);
  });
}

// Sound
function playSound(type) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'complete') {
      osc.frequency.setValueAtTime(523, ctx.currentTime);
      osc.frequency.setValueAtTime(659, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.3);
    } else if (type === 'levelup') {
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

function launchConfetti() {
  import('./confetti.js').then(({ launchConfetti: lc }) => lc());
}