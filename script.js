/* ===== Elemen utama ===== */
const nav = document.querySelector('.nav');
const toggle = document.querySelector('.menu-toggle');
const pages = document.querySelectorAll('.page');
const navLinks = document.querySelectorAll('.nav a[data-page]');
const mobileQuery = window.matchMedia('(max-width:860px)');
const EASE = 'cubic-bezier(.22,.8,.25,1)';
const OFFSCREEN = 'translate3d(calc(100% + 24px),0,0)';

/* ===== Pindah halaman ===== */
function showPage(id) {
  const target = document.getElementById(id);
  if (!target || !target.classList.contains('page')) id = 'beranda';
  pages.forEach(p => p.classList.toggle('active', p.id === id));
  navLinks.forEach(a => a.classList.toggle('active', a.dataset.page === id));
  if (location.hash.slice(1) !== id) {
    try { history.replaceState(null, '', '#' + id); } catch (e) { location.hash = id; }
  }
  window.scrollTo({ top: 0, behavior: 'instant' });
}

/* ===== Menu mobile ===== */
let closeTimer = null;

function resetNavStyles() {
  nav.style.transition = '';
  nav.style.transform = '';
  nav.style.opacity = '';
}

function openMenu() {
  if (closeTimer) { clearTimeout(closeTimer); closeTimer = null; }
  const r = toggle.getBoundingClientRect();
  nav.style.setProperty('--menu-top', Math.round(r.bottom + 8) + 'px');
  resetNavStyles();
  nav.classList.add('open');
  toggle.setAttribute('aria-expanded', 'true');
}

function closeMenu(duration) {
  if (!nav.classList.contains('open')) return;
  const d = duration || 0.4;
  if (closeTimer) clearTimeout(closeTimer);
  nav.style.transition = 'transform ' + d + 's ' + EASE + ',opacity ' + (d * 0.8) + 's ease ' + (d * 0.25) + 's';
  nav.style.transform = OFFSCREEN;
  nav.style.opacity = '0';
  toggle.setAttribute('aria-expanded', 'false');
  closeTimer = setTimeout(() => {
    nav.classList.remove('open');
    resetNavStyles();
    closeTimer = null;
  }, d * 1000 + 40);
}

toggle.addEventListener('click', () => {
  if (nav.classList.contains('open') && !closeTimer) closeMenu();
  else openMenu();
});

/* Geser ke kanan untuk menutup: mengikuti jari, lalu meluncur sampai penuh keluar layar */
let startX = 0, startY = 0, dragX = 0, lastX = 0, lastT = 0, velocity = 0;
let dragging = false, raf = 0;

function paintDrag() {
  raf = 0;
  nav.style.transform = 'translate3d(' + dragX + 'px,0,0)';
}

nav.addEventListener('touchstart', e => {
  if (!nav.classList.contains('open')) return;
  if (closeTimer) { clearTimeout(closeTimer); closeTimer = null; }
  const t = e.touches[0];
  startX = lastX = t.clientX;
  startY = t.clientY;
  lastT = e.timeStamp;
  dragX = 0;
  velocity = 0;
  dragging = true;
  nav.style.transition = 'none';
}, { passive: true });

nav.addEventListener('touchmove', e => {
  if (!dragging) return;
  const t = e.touches[0];
  const dx = t.clientX - startX;
  const dy = t.clientY - startY;
  if (dragX === 0 && Math.abs(dy) > Math.abs(dx) * 1.15) { // gerakan vertikal = scroll menu
    dragging = false;
    nav.style.transition = '';
    return;
  }
  const dt = e.timeStamp - lastT;
  if (dt > 0) velocity = (t.clientX - lastX) / dt; // px per ms
  lastX = t.clientX;
  lastT = e.timeStamp;
  dragX = Math.max(0, dx);
  if (!raf) raf = requestAnimationFrame(paintDrag);
}, { passive: true });

nav.addEventListener('touchend', () => {
  if (!dragging) return;
  dragging = false;
  if (raf) { cancelAnimationFrame(raf); raf = 0; }
  const w = nav.offsetWidth || 1;
  const shouldClose = dragX > w * 0.22 || (velocity > 0.5 && dragX > 12);
  if (shouldClose) {
    const remaining = 1 - dragX / (w + 24);
    closeMenu(Math.min(0.42, Math.max(0.2, 0.42 * remaining + 0.1)));
  } else {
    nav.style.transition = 'transform .36s ' + EASE;
    nav.style.transform = 'translate3d(0,0,0)';
    setTimeout(() => { if (nav.classList.contains('open')) resetNavStyles(); }, 380);
  }
});

nav.addEventListener('touchcancel', () => {
  if (!dragging) return;
  dragging = false;
  nav.style.transition = 'transform .3s ' + EASE;
  nav.style.transform = 'translate3d(0,0,0)';
  setTimeout(resetNavStyles, 320);
});

/* Tutup menu saat menyentuh di luar menu */
document.addEventListener('touchstart', e => {
  if (nav.classList.contains('open') && !nav.contains(e.target) && !toggle.contains(e.target)) closeMenu();
}, { passive: true });

/* Kembali ke tampilan desktop: bersihkan sisa status menu */
mobileQuery.addEventListener('change', () => {
  if (closeTimer) { clearTimeout(closeTimer); closeTimer = null; }
  nav.classList.remove('open');
  resetNavStyles();
  toggle.setAttribute('aria-expanded', 'false');
});

/* ===== Kalkulator dosis ===== */
const variant = document.getElementById('variant');
const water = document.getElementById('water');
const mainResult = document.getElementById('result-main');
const detail = document.getElementById('result-detail');
const resultBox = document.getElementById('result-box');

function fmt(n) {
  return new Intl.NumberFormat('id-ID', { maximumFractionDigits: 2 }).format(n);
}

function calculate() {
  const w = Number(water.value);
  resultBox.classList.remove('hidden');
  if (!Number.isFinite(w) || w <= 0) {
    mainResult.textContent = 'Masukkan jumlah air yang valid';
    detail.textContent = 'Jumlah air harus lebih besar dari 0 liter.';
    return;
  }
  const rate = { semprot: 143, kocor: 330, muda: 230, dewasa: 600 }[variant.value];
  const desc = {
    semprot: 'Hortikultura — sprayer (143 ml per liter air).',
    kocor: 'Hortikultura — kocor tanah (330 ml per liter air).',
    muda: 'Perkebunan — pohon muda (230 ml per liter air).',
    dewasa: 'Perkebunan — pohon dewasa (600 ml per liter air).'
  };
  mainResult.textContent = fmt(rate * w) + ' ml BIOBOOST';
  detail.textContent = 'Campurkan ' + fmt(rate * w) + ' ml BIOBOOST ke dalam ' + fmt(w) + ' liter air. ' + desc[variant.value];
}

function resetResult() {
  resultBox.classList.add('hidden');
  mainResult.textContent = '';
  detail.textContent = '';
}

variant.addEventListener('change', resetResult);
water.addEventListener('input', resetResult);
document.getElementById('calculate').addEventListener('click', calculate);
resetResult();

/* ===== Klik: tautan menu, tombol "data-go", dan tutup menu di luar ===== */
document.addEventListener('click', e => {
  const link = e.target.closest('a[data-page]');
  if (link) {
    e.preventDefault();
    showPage(link.dataset.page);
    closeMenu();
    return;
  }
  const go = e.target.closest('[data-go]');
  if (go) {
    if (go.dataset.variant === 'horti') variant.value = 'semprot';
    if (go.dataset.variant === 'kebun') variant.value = 'muda';
    resetResult();
    showPage(go.dataset.go);
    return;
  }
  if (nav.classList.contains('open') && !nav.contains(e.target) && !toggle.contains(e.target)) closeMenu();
});

window.addEventListener('hashchange', () => showPage(location.hash.slice(1) || 'beranda'));

/* ===== Footer & tombol ke atas ===== */
document.getElementById('year').textContent = new Date().getFullYear();
const topButton = document.getElementById('toTop');
window.addEventListener('scroll', () => topButton.classList.toggle('show', window.scrollY > 300));
topButton.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ===== Halaman awal ===== */
showPage(location.hash.slice(1) || 'beranda');
