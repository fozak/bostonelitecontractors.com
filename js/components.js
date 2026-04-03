async function loadComponent(selector, url) {
  const el = document.querySelector(selector);
  if (!el) return;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to load ${url}`);
    el.innerHTML = await res.text();
  } catch (e) {
    console.warn('[components]', e.message);
  }
}

async function loadComponents() {
  await Promise.all([
    loadComponent('#cmp-topbar',   '/components/topbar.html'),
    loadComponent('#cmp-navbar',   '/components/navbar.html'),
    loadComponent('#cmp-stats',    '/components/stats-bar.html'),
    loadComponent('#cmp-lightbox', '/components/lightbox.html'),
    loadComponent('#cmp-footer',   '/components/footer.html'),
  ]);

  // Mark active nav link based on current path
  const path = location.pathname;
  document.querySelectorAll('.site-nav .nav-link').forEach(link => {
    const href = link.getAttribute('href');
    const isHome = (path === '/' || path === '/index.html') && href === '/';
    const isMatch = href !== '/' && path.startsWith(href.split('#')[0]) && href.split('#')[0] !== '/';
    if (isHome || isMatch) link.classList.add('active');
  });

  document.dispatchEvent(new Event('components:ready'));
}

loadComponents();
