// js/lightbox.js
(function () {
  // Only run on pages that actually have gallery images
  const thumbs = Array.from(document.querySelectorAll('.media-grid img'));
  if (!thumbs.length) return;

  // Ensure the lightbox overlay exists (auto-inject if needed)
  let overlay = document.getElementById('lightbox');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'lightbox';
    overlay.id = 'lightbox';
    overlay.setAttribute('aria-hidden', 'true');
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-label', 'Image viewer');
    overlay.innerHTML = `
      <div class="lightbox__content">
        <button class="lightbox__close" aria-label="Close (Esc)">✕</button>
        <img class="lightbox__img" alt="">
        <div class="lightbox__caption"></div>
        <button class="lightbox__prev" aria-label="Previous image">‹</button>
        <button class="lightbox__next" aria-label="Next image">›</button>
      </div>
    `;
    document.body.appendChild(overlay);
  }

  const imgEl    = overlay.querySelector('.lightbox__img');
  const capEl    = overlay.querySelector('.lightbox__caption');
  const btnClose = overlay.querySelector('.lightbox__close');
  const btnPrev  = overlay.querySelector('.lightbox__prev');
  const btnNext  = overlay.querySelector('.lightbox__next');

  // Build list of items (full image + caption)
  const items = thumbs.map(img => ({
    full: img.dataset.full || img.src,
    caption: (img.closest('figure')?.querySelector('figcaption')?.textContent || '').trim()
  }));

  // Make thumbnails focusable/clickable
  thumbs.forEach((img, idx) => {
    img.style.cursor = 'zoom-in';
    img.setAttribute('tabindex', '0');
    img.addEventListener('click', () => open(idx));
    img.addEventListener('keydown', e => { if (e.key === 'Enter') open(idx); });
  });

  let index = 0;
  function show(i) {
    index = (i + items.length) % items.length;
    const { full, caption } = items[index];
    imgEl.src = full;
    imgEl.alt = caption || 'Image';
    capEl.textContent = caption;
  }

  function open(i) {
    show(i);
    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    btnClose.focus();
  }

  function close() {
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    imgEl.src = '';
  }

  // Controls
  btnClose.addEventListener('click', close);
  btnPrev.addEventListener('click', () => show(index - 1));
  btnNext.addEventListener('click', () => show(index + 1));

  // Click outside image to close
  overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });

  // Keyboard controls
  window.addEventListener('keydown', (e) => {
    if (!overlay.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft')  show(index - 1);
    if (e.key === 'ArrowRight') show(index + 1);
  });
})();