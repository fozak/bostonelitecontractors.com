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

  // Mark active nav link based on current path
  const path = location.pathname;
  document.querySelectorAll('.site-nav .nav-link').forEach(link => {
    const href = link.getAttribute('href');
    const isHome  = (path === '/' || path === '/index.html') && href === '/';
    const isMatch = href !== '/' && path.startsWith(href.split('#')[0]) && href.split('#')[0] !== '/';
    if (isHome || isMatch) link.classList.add('active');
  });

  document.dispatchEvent(new Event('components:ready'));
}

loadComponents();
