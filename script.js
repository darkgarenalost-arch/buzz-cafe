/* ================================================================
   Buzz Cafe — Main JavaScript
   Version: 1.0 | Production Ready
   ================================================================ */

'use strict';

/* ── DOM Ready ─────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initNavbar();
  initScrollProgress();
  initScrollReveal();
  initMenuFilter();
  initGallery();
  initLightbox();
  initReservationForm();
  initContactForm();
  initBackToTop();
  initActiveNav();
  initDatePicker();
});

/* ── Loader ────────────────────────────────────────────────────── */
function initLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
      document.body.style.overflow = '';
    }, 1800);
  });
  document.body.style.overflow = 'hidden';
}

/* ── Navbar ────────────────────────────────────────────────────── */
function initNavbar() {
  const nav    = document.getElementById('navbar');
  const toggle = document.getElementById('nav-toggle');
  const mobile = document.getElementById('nav-mobile');
  const links  = document.querySelectorAll('.nav-mobile a');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  toggle?.addEventListener('click', () => {
    toggle.classList.toggle('open');
    mobile.classList.toggle('open');
    document.body.style.overflow = mobile.classList.contains('open') ? 'hidden' : '';
  });

  links.forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('open');
      mobile.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

/* ── Active Nav Link on Scroll ─────────────────────────────────── */
function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-links a[href^="#"]');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => observer.observe(s));
}

/* ── Scroll Progress ───────────────────────────────────────────── */
function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const scrollTop   = window.scrollY;
    const docHeight   = document.documentElement.scrollHeight - window.innerHeight;
    const pct         = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width   = pct + '%';
  }, { passive: true });
}

/* ── Scroll Reveal ─────────────────────────────────────────────── */
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  elements.forEach(el => observer.observe(el));
}

/* ── Menu Filter ───────────────────────────────────────────────── */
function initMenuFilter() {
  const filterBtns  = document.querySelectorAll('.filter-btn[data-filter]');
  const categories  = document.querySelectorAll('.menu-category[data-category]');
  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      categories.forEach(cat => {
        if (filter === 'all' || cat.dataset.category === filter) {
          cat.removeAttribute('data-hidden');
          cat.style.display = '';
        } else {
          cat.setAttribute('data-hidden', 'true');
          cat.style.display = 'none';
        }
      });
    });
  });
}

/* ── Gallery Filter ────────────────────────────────────────────── */
function initGallery() {
  const filterBtns = document.querySelectorAll('.gallery-filter-btn[data-filter]');
  const items      = document.querySelectorAll('.gallery-item[data-category]');
  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      items.forEach(item => {
        const show = filter === 'all' || item.dataset.category === filter;
        item.style.display = show ? '' : 'none';
      });
    });
  });
}

/* ── Lightbox ──────────────────────────────────────────────────── */
function initLightbox() {
  const lb      = document.getElementById('lightbox');
  const lbImg   = document.getElementById('lb-img');
  const lbClose = document.getElementById('lb-close');
  const lbPrev  = document.getElementById('lb-prev');
  const lbNext  = document.getElementById('lb-next');
  const items   = document.querySelectorAll('.gallery-item');

  if (!lb || !items.length) return;

  let current = 0;
  const images = Array.from(items).map(item => ({
    src:   item.querySelector('img')?.src || '',
    title: item.dataset.title || '',
  }));

  function openLb(index) {
    current = index;
    lbImg.src = images[current].src;
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeLb() {
    lb.classList.remove('open');
    document.body.style.overflow = '';
  }
  function showNext() { current = (current + 1) % images.length; lbImg.src = images[current].src; }
  function showPrev() { current = (current - 1 + images.length) % images.length; lbImg.src = images[current].src; }

  items.forEach((item, i) => item.addEventListener('click', () => openLb(i)));
  lbClose?.addEventListener('click', closeLb);
  lbPrev?.addEventListener('click', showPrev);
  lbNext?.addEventListener('click', showNext);
  lb.addEventListener('click', e => { if (e.target === lb) closeLb(); });

  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape')     closeLb();
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'ArrowLeft')  showPrev();
  });
}

/* ── Date Picker min date ──────────────────────────────────────── */
function initDatePicker() {
  const dateInput = document.getElementById('res-date');
  if (!dateInput) return;
  const today = new Date();
  const dd  = String(today.getDate()).padStart(2,'0');
  const mm  = String(today.getMonth()+1).padStart(2,'0');
  const yyyy = today.getFullYear();
  dateInput.min = `${yyyy}-${mm}-${dd}`;
}

/* ── Reservation Form ──────────────────────────────────────────── */
function initReservationForm() {
  const form = document.getElementById('reservation-form');
  if (!form) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (!validateForm(form)) return;

    const btn = form.querySelector('[type="submit"]');
    setLoading(btn, true);

    try {
      const data = new FormData(form);
      const res  = await fetch('api/reserve.php', { method: 'POST', body: data });
      const json = await res.json();

      if (json.success) {
        showToast('success', 'Reservation Confirmed!', json.message);
        form.reset();
      } else {
        showToast('error', 'Booking Failed', json.message);
      }
    } catch {
      showToast('error', 'Connection Error', 'Please try again or call us directly.');
    } finally {
      setLoading(btn, false);
    }
  });
}

/* ── Contact Form ──────────────────────────────────────────────── */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (!validateForm(form)) return;

    const btn = form.querySelector('[type="submit"]');
    setLoading(btn, true);

    try {
      const data = new FormData(form);
      const res  = await fetch('api/contact.php', { method: 'POST', body: data });
      const json = await res.json();

      if (json.success) {
        showToast('success', 'Message Sent!', json.message);
        form.reset();
      } else {
        showToast('error', 'Failed to Send', json.message);
      }
    } catch {
      showToast('error', 'Connection Error', 'Please try again.');
    } finally {
      setLoading(btn, false);
    }
  });
}

/* ── Form Validation ───────────────────────────────────────────── */
function validateForm(form) {
  let valid = true;
  const required = form.querySelectorAll('[required]');

  required.forEach(field => {
    const group = field.closest('.form-group');
    if (!field.value.trim()) {
      group?.classList.add('has-error');
      if (group) {
        let err = group.querySelector('.form-error');
        if (!err) {
          err = document.createElement('div');
          err.className = 'form-error';
          err.textContent = 'This field is required.';
          group.appendChild(err);
        }
        err.style.display = 'block';
      }
      valid = false;
    } else if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
      group?.classList.add('has-error');
      if (group) {
        let err = group.querySelector('.form-error');
        if (!err) {
          err = document.createElement('div');
          err.className = 'form-error';
          group.appendChild(err);
        }
        err.textContent = 'Please enter a valid email address.';
        err.style.display = 'block';
      }
      valid = false;
    } else {
      group?.classList.remove('has-error');
      const err = group?.querySelector('.form-error');
      if (err) err.style.display = 'none';
    }
  });

  return valid;
}

/* ── Loading State ─────────────────────────────────────────────── */
function setLoading(btn, state) {
  if (!btn) return;
  if (state) {
    btn.dataset.origText = btn.innerHTML;
    btn.innerHTML = '<span class="spinner"></span>Processing...';
    btn.disabled = true;
  } else {
    btn.innerHTML = btn.dataset.origText || 'Submit';
    btn.disabled = false;
  }
}

/* ── Toast Notifications ───────────────────────────────────────── */
function showToast(type, title, message, duration = 5000) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const icons = { success: '✅', error: '❌', info: 'ℹ️' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${icons[type] || 'ℹ️'}</span>
    <div class="toast-body">
      <div class="toast-title">${title}</div>
      <div class="toast-msg">${message}</div>
    </div>
    <span class="toast-close" aria-label="Close">×</span>
  `;

  container.appendChild(toast);

  toast.querySelector('.toast-close').addEventListener('click', () => removeToast(toast));
  setTimeout(() => removeToast(toast), duration);
}

function removeToast(toast) {
  toast.classList.add('removing');
  setTimeout(() => toast.remove(), 300);
}

/* ── Back to Top ───────────────────────────────────────────────── */
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ── Smooth Anchor ─────────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ── Lazy Loading ──────────────────────────────────────────────── */
if ('IntersectionObserver' in window) {
  const lazyImgs = document.querySelectorAll('img[data-src]');
  const lazyObs  = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img   = entry.target;
        img.src     = img.dataset.src;
        img.removeAttribute('data-src');
        lazyObs.unobserve(img);
      }
    });
  }, { rootMargin: '200px' });
  lazyImgs.forEach(img => lazyObs.observe(img));
}
