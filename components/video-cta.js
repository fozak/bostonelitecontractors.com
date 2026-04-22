/**
 * video-cta.js
 * Initializes video CTA overlays loaded via components.js
 * Reads variant from data-variant attribute on #cmp-video-cta
 * Config driven by /components/video-cta-config.json
 */

(function () {

  // ── Show a timed overlay element ──────────────────────────────────────────
  function showEl(el) {
    if (el && !el.classList.contains('vcta-visible')) {
      el.classList.add('vcta-visible');
    }
  }

  // ── Populate DOM from config ───────────────────────────────────────────────
  function applyConfig(root, cfg) {
    // Video src
    const video = root.querySelector('#vcta-video');
    if (video && cfg.video) video.src = cfg.video;

    // Badge text
    const badge = root.querySelector('.video-cta-badge .badge');
    if (badge && cfg.badge) badge.textContent = cfg.badge;

    // Headline
    const headline = root.querySelector('.video-cta-headline h2');
    if (headline && cfg.headline) headline.textContent = cfg.headline;

    // Subline
    const subline = root.querySelector('.vcta-subline');
    if (subline && cfg.subline) subline.textContent = cfg.subline;

    // CTA button
    const btnText = root.querySelector('.vcta-btn-text');
    if (btnText && cfg.cta) btnText.textContent = cfg.cta;

    const btn = root.querySelector('.vcta-btn');
    if (btn && cfg.link) btn.href = cfg.link;
  }

  // ── Bind video timing events ───────────────────────────────────────────────
  function bindTimings(root, timings) {
    const video   = root.querySelector('#vcta-video');
    const badge   = root.querySelector('#vcta-badge');
    const headline= root.querySelector('#vcta-headline');
    const cta     = root.querySelector('#vcta-cta');
    const bar     = root.querySelector('#vcta-progress');

    if (!video) return;

    video.addEventListener('timeupdate', () => {
      const t = video.currentTime;
      const dur = video.duration || 1;

      // Progress bar
      if (bar) bar.style.width = ((t / dur) * 100) + '%';

      // Timed reveals
      if (timings.badge    && t >= timings.badge)    showEl(badge);
      if (timings.headline && t >= timings.headline) showEl(headline);
      if (timings.cta      && t >= timings.cta)      showEl(cta);
    });

    // If video fails to load (e.g. local dev), show all elements immediately
    video.addEventListener('error', () => {
      [badge, headline, cta].forEach(showEl);
    });
  }

  // ── Main init ──────────────────────────────────────────────────────────────
  async function initVideoCta() {
    const slots = document.querySelectorAll('[id^="cmp-video-cta"]');
    if (!slots.length) return;

    let configs = {};
    try {
      const res = await fetch('/components/video-cta-config.json');
      if (res.ok) configs = await res.json();
    } catch (e) {
      console.warn('[video-cta] Could not load config:', e.message);
    }

    slots.forEach(slot => {
      const variant = slot.dataset.variant || 'drone';
      const cfg     = configs[variant];

      if (!cfg) {
        console.warn(`[video-cta] No config found for variant: "${variant}"`);
        return;
      }

      // The component HTML was already injected by components.js
      applyConfig(slot, cfg);
      bindTimings(slot, cfg.timings || {});
    });
  }

  // ── Wait for components:ready before initializing ─────────────────────────
  document.addEventListener('components:ready', initVideoCta);

})();
