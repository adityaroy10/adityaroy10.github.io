(function () {
  var galleryEl = document.getElementById('gallery');
  var overlayEl = document.getElementById('galleryOverlay');
  var overlayImg = document.getElementById('galleryOverlayImg');
  if (!galleryEl) return;

  var imagesPath = 'images/';
  var jsonPath = 'images.json';

  function openOverlay(src) {
    if (!overlayEl || !overlayImg) return;
    overlayEl.classList.remove('gallery-overlay--closing');
    overlayImg.src = src;
    overlayEl.classList.add('is-open');
    overlayEl.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeOverlay() {
    if (!overlayEl) return;
    overlayEl.classList.add('gallery-overlay--closing');
    overlayEl.classList.remove('is-open');
    overlayEl.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    window.setTimeout(function () {
      overlayEl.classList.remove('gallery-overlay--closing');
    }, 350);
  }

  if (overlayEl) {
    overlayEl.querySelector('.gallery-overlay__backdrop').addEventListener('click', closeOverlay);
    overlayEl.querySelector('.gallery-overlay__inner').addEventListener('click', function (e) {
      e.stopPropagation();
    });
  }

  fetch(jsonPath)
    .then(function (res) { return res.ok ? res.json() : Promise.reject(res); })
    .then(function (filenames) {
      galleryEl.removeAttribute('aria-busy');
      if (!Array.isArray(filenames) || filenames.length === 0) {
        galleryEl.innerHTML = '<p class="gallery-empty">No photos yet. Add image filenames to <code>photography/images.json</code> and put the files in <code>photography/images/</code>.</p>';
        return;
      }
      galleryEl.innerHTML = filenames.map(function (filename) {
        var src = imagesPath + filename;
        return '<div class="gallery__item" tabindex="0" role="button" data-src="' + src + '"><img src="' + src + '" alt="" loading="lazy" decoding="async" /></div>';
      }).join('');

      galleryEl.addEventListener('click', function (e) {
        var item = e.target.closest('.gallery__item');
        if (item) openOverlay(item.getAttribute('data-src'));
      });
      galleryEl.addEventListener('keydown', function (e) {
        var item = e.target.closest('.gallery__item');
        if (item && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          openOverlay(item.getAttribute('data-src'));
        }
      });
    })
    .catch(function () {
      galleryEl.removeAttribute('aria-busy');
      galleryEl.innerHTML = '<p class="gallery-empty">Could not load gallery. Check that <code>photography/images.json</code> exists.</p>';
    });
})();
