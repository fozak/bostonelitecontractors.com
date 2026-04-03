// Runs after components are ready (lightbox injected by then)
document.addEventListener('components:ready', initGallery);

function initGallery() {
  // Filter
  const filterBtns = document.querySelectorAll('.filter-btn');
  const items = document.querySelectorAll('.gallery-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      items.forEach(item => {
        item.classList.toggle('hidden', filter !== 'all' && item.dataset.category !== filter);
      });
    });
  });

  // Lightbox
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return;

  const lbImg     = document.getElementById('lbImg');
  const lbCaption = document.getElementById('lbCaption');
  let visibleItems = [], currentIndex = 0;

  function getVisible() {
    return [...document.querySelectorAll('.gallery-item:not(.hidden)')];
  }

  items.forEach(item => {
    item.addEventListener('click', () => {
      visibleItems  = getVisible();
      currentIndex  = visibleItems.indexOf(item);
      openLightbox(currentIndex);
    });
  });

  function openLightbox(idx) {
    const item    = visibleItems[idx];
    const img     = item.querySelector('img');
    lbImg.src     = img.src;
    lbImg.alt     = img.alt;
    const badge   = item.querySelector('.cat-badge');
    const title   = item.querySelector('.img-title');
    lbCaption.textContent = (badge ? badge.textContent : '') + (title ? ' — ' + title.textContent : '');
    lightbox.classList.add('open');
  }

  document.getElementById('lbClose').addEventListener('click', () => lightbox.classList.remove('open'));
  lightbox.addEventListener('click', e => { if (e.target === lightbox) lightbox.classList.remove('open'); });

  document.getElementById('lbPrev').addEventListener('click', e => {
    e.stopPropagation();
    currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length;
    openLightbox(currentIndex);
  });

  document.getElementById('lbNext').addEventListener('click', e => {
    e.stopPropagation();
    currentIndex = (currentIndex + 1) % visibleItems.length;
    openLightbox(currentIndex);
  });

  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'ArrowLeft')  { currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length; openLightbox(currentIndex); }
    if (e.key === 'ArrowRight') { currentIndex = (currentIndex + 1) % visibleItems.length; openLightbox(currentIndex); }
    if (e.key === 'Escape')     { lightbox.classList.remove('open'); }
  });
}
