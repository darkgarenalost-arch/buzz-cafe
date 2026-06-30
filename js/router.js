import { getComponent, cacheComponent } from './ui.js';

const routes = {
  dashboard: { title: 'Dashboard', icon: '🏠' },
  tasks: { title: 'My Tasks', icon: '✅' },
  progress: { title: 'Progress Graph', icon: '📈' },
  heatmap: { title: 'Habit Heatmap', icon: '🗓️' },
  achievements: { title: 'Achievements', icon: '🏆' },
  statistics: { title: 'Statistics', icon: '📊' },
  pomodoro: { title: 'Pomodoro Timer', icon: '🍅' },
  weekly: { title: 'Weekly Review', icon: '📅' },
  settings: { title: 'Settings', icon: '⚙️' },
};

let currentRoute = null;
let routeCallbacks = {};

export function initRouter() {
  // Handle hash changes
  window.addEventListener('hashchange', () => {
    const route = window.location.hash.replace('#', '') || 'dashboard';
    navigateTo(route);
  });

  // Handle nav clicks
  document.querySelectorAll('.nav-item[data-route]').forEach(el => {
    el.addEventListener('click', (e) => {
      const route = el.dataset.route;
      window.location.hash = route;
      navigateTo(route);
    });
  });

  // Theme toggle
  document.getElementById('themeToggleNav')?.addEventListener('click', () => {
    import('./ui.js').then(({ toggleTheme }) => toggleTheme());
  });

  // "See All" tasks button
  document.addEventListener('click', (e) => {
    if (e.target.closest('[data-route]')) {
      const route = e.target.closest('[data-route]').dataset.route;
      window.location.hash = route;
      navigateTo(route);
    }
  });
}

export async function navigateTo(route) {
  if (!routes[route]) {
    route = 'dashboard';
    window.location.hash = 'dashboard';
  }

  if (currentRoute === route) {
    // Still re-render if needed
    await renderRoute(route);
    return;
  }

  currentRoute = route;
  await renderRoute(route);

  // Update active nav
  document.querySelectorAll('.nav-item[data-route]').forEach(el => {
    el.classList.toggle('active', el.dataset.route === route);
  });

  // Update page title
  document.title = `${routes[route].title} — Track U`;

  // Dispatch route change event
  document.dispatchEvent(new CustomEvent('route:changed', { detail: { route } }));
}

async function renderRoute(route) {
  const container = document.getElementById('appShell');
  if (!container) return;

  // Show loading state (optional, but we want it instant)
  // Get component
  const component = await getComponent(route);

  if (!component) {
    container.innerHTML = `<div class="card"><p>Component not found: ${route}</p></div>`;
    return;
  }

  // Render template
  container.innerHTML = component.template;

  // Initialize component
  if (typeof component.init === 'function') {
    await component.init();
  }

  // Cache for future
  cacheComponent(route, component);
}

export function getCurrentRoute() {
  return currentRoute;
}

export function registerRouteCallback(route, callback) {
  if (!routeCallbacks[route]) routeCallbacks[route] = [];
  routeCallbacks[route].push(callback);
}

export function getRoutes() {
  return routes;
}