//components.js - Dynamically load HTML components into elements with id="cmp-<name>"

async function loadComponent(el) {
  const name = el.id.replace('cmp-', '');
  try {
    const res = await fetch(`/components/${name}.html`);
    if (!res.ok) throw new Error(`Failed to load ${name}.html`);
    el.innerHTML = await res.text();
  } catch (e) {
    console.warn('[components]', e.message);
  }
}

async function loadComponents() {
  const slots = [...document.querySelectorAll('[id^="cmp-"]')];
  await Promise.all(slots.map(loadComponent));

  // Mark active nav link
  const path = location.pathname;
  document.querySelectorAll('.site-nav .nav-link').forEach(link => {
    const href = link.getAttribute('href');
    const isHome  = (path === '/' || path === '/index.html') && href === '/';
    const isMatch = href !== '/' && path.startsWith(href.split('#')[0]) && href.split('#')[0] !== '/';
    if (isHome || isMatch) link.classList.add('active');
  });

  // Re-init Bootstrap collapse for dynamically injected navbar
  if (window.bootstrap) {
    document.querySelectorAll('.navbar-toggler').forEach(toggler => {
      const target = document.querySelector(toggler.dataset.bsTarget);
      if (target) new bootstrap.Collapse(target, { toggle: false });
    });
  }

  document.dispatchEvent(new Event('components:ready'));
}

loadComponents();
