(function () {
  function collapseElement(el) {
    if (!el) return;
    el.style.cssText += ';height:0!important;min-height:0!important;max-height:0!important;overflow:hidden!important;padding:0!important;margin:0!important;';
  }

  function hideImg(img) {
    img.style.cssText += ';display:none!important;';
  }

  function fixBrokenImages() {
    var imgs = document.querySelectorAll('img[src*="imgs/image"]');

    imgs.forEach(function (img) {
      if (img.complete && img.naturalWidth > 0) return; // loaded fine

      function applyFix() {
        if (img.naturalWidth > 0) return;

        var cls = img.className || '';
        var w = parseInt(img.getAttribute('width') || 0);
        var parent = img.parentElement;
        var grandparent = parent ? parent.parentElement : null;

        // ── Large platform / diagram image (very wide) ─────────────────
        if (w > 500) {
          hideImg(img);
          collapseElement(parent);
          return;
        }

        // ── News / event card images (min-h-[200px]) ────────────────────
        if (cls.indexOf('min-h-') !== -1) {
          hideImg(img);
          return;
        }

        // ── Customer success story full-bleed images (h-full object-cover)
        if (cls.indexOf('object-cover') !== -1 && cls.indexOf('h-full') !== -1) {
          hideImg(img);
          // Collapse the immediate card container too
          if (parent) collapseElement(parent);
          return;
        }

        // ── Customer success logo overlay images ─────────────────────────
        if (cls.indexOf('max-h-') !== -1 && cls.indexOf('w-auto') !== -1) {
          hideImg(img);
          return;
        }

        // ── Trust badge / award images (max-h-full max-w-full) ──────────
        if (cls.indexOf('max-h-full') !== -1) {
          hideImg(img);
          if (parent && grandparent) {
            // Keep the card but remove the image height
            parent.style.minHeight = '0';
            parent.style.height = 'auto';
          }
          return;
        }

        // ── AI section icon images (100×100) ────────────────────────────
        if (w <= 100 && parseInt(img.getAttribute('height') || 0) <= 100) {
          hideImg(img);
          collapseElement(parent);
          return;
        }

        // ── Partner logos (my-0 mx-auto) ─────────────────────────────────
        if (cls.indexOf('mx-auto') !== -1) {
          hideImg(img);
          return;
        }

        // ── Default: just hide broken icon ───────────────────────────────
        img.style.opacity = '0';
        img.style.minHeight = '0';
        img.style.maxHeight = '0';
      }

      if (img.complete) {
        applyFix();
      } else {
        img.addEventListener('error', applyFix);
      }
    });
  }

  // Run on load and after a delay for lazy-loaded images
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fixBrokenImages);
  } else {
    fixBrokenImages();
  }
  setTimeout(fixBrokenImages, 800);
  setTimeout(fixBrokenImages, 2000);
})();
