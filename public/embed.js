(function () {
  'use strict';

  var DETT_BASE = 'https://dett.io';
  var MODAL_ID = 'dett-embed-modal';
  var OVERLAY_ID = 'dett-embed-overlay';

  // Compute relative luminance to pick contrasting text color
  function isLightColor(hex) {
    hex = hex.replace('#', '');
    if (hex.length === 3) hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
    var r = parseInt(hex.substr(0, 2), 16) / 255;
    var g = parseInt(hex.substr(2, 2), 16) / 255;
    var b = parseInt(hex.substr(4, 2), 16) / 255;
    r = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
    g = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
    b = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);
    return (0.2126 * r + 0.7152 * g + 0.0722 * b) > 0.4;
  }

  // Find all embed triggers
  function init() {
    // Script tag with data-calculator attribute (auto-render button)
    var scripts = document.querySelectorAll('script[data-calculator]:not([data-dett-init])');
    scripts.forEach(function (script) {
      script.setAttribute('data-dett-init', '1');
      var slug = script.getAttribute('data-calculator');
      var label = script.getAttribute('data-label') || 'Calculate';
      var color = script.getAttribute('data-color') || '#196bc0';
      var textColor = script.getAttribute('data-text-color') || '#ffffff';

      if (!slug) return;

      // Create button next to the script tag
      var btn = document.createElement('button');
      btn.className = 'dett-embed-btn';
      btn.setAttribute('data-calculator', slug);
      btn.style.cssText =
        'display:inline-flex;flex-direction:column;align-items:center;gap:2px;padding:12px 24px;' +
        'background:' + color + ';color:' + textColor + ';border:none;border-radius:8px;' +
        'font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;' +
        'font-size:15px;font-weight:600;cursor:pointer;transition:all 0.2s;' +
        'box-shadow:0 2px 8px rgba(0,0,0,0.15);';

      var labelSpan = document.createElement('span');
      labelSpan.textContent = label;
      btn.appendChild(labelSpan);

      var poweredByColor = isLightColor(color) ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.6)';
      var poweredBy = document.createElement('span');
      poweredBy.textContent = 'powered by dett.io';
      poweredBy.style.cssText =
        'font-size:9px;font-weight:400;letter-spacing:0.3px;color:' + poweredByColor + ';';
      btn.appendChild(poweredBy);

      btn.addEventListener('mouseenter', function () {
        btn.style.transform = 'translateY(-2px)';
        btn.style.boxShadow = '0 4px 16px rgba(0,0,0,0.2)';
      });
      btn.addEventListener('mouseleave', function () {
        btn.style.transform = 'translateY(0)';
        btn.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
      });

      btn.addEventListener('click', function () {
        openModal(slug);
      });

      script.parentNode.insertBefore(btn, script.nextSibling);
    });

    // Anchor/button elements with class="dett-embed"
    var triggers = document.querySelectorAll('.dett-embed[data-calculator]:not([data-dett-init])');
    triggers.forEach(function (el) {
      el.setAttribute('data-dett-init', '1');
      el.addEventListener('click', function (e) {
        e.preventDefault();
        var slug = el.getAttribute('data-calculator');
        if (slug) openModal(slug);
      });
    });
  }

  function openModal(slug) {
    // Prevent duplicate modals
    if (document.getElementById(MODAL_ID)) return;

    // Create overlay
    var overlay = document.createElement('div');
    overlay.id = OVERLAY_ID;
    overlay.style.cssText =
      'position:fixed;top:0;left:0;width:100%;height:100%;' +
      'background:rgba(0,0,0,0.6);backdrop-filter:blur(4px);' +
      'z-index:999999;display:flex;align-items:center;justify-content:center;' +
      'opacity:0;transition:opacity 0.25s ease;';

    // Create modal container
    var modal = document.createElement('div');
    modal.id = MODAL_ID;
    modal.style.cssText =
      'position:relative;display:flex;flex-direction:column;width:92%;max-width:1200px;height:82vh;' +
      'background:#fff;border-radius:8px;overflow:hidden;' +
      'box-shadow:0 25px 60px rgba(0,0,0,0.3);' +
      'transform:scale(0.95);transition:transform 0.25s ease;';

    // Header bar with branding + close button
    var header = document.createElement('div');
    header.style.cssText =
      'display:flex;align-items:center;justify-content:space-between;' +
      'padding:8px 12px;background:#f9fafb;border-bottom:1px solid #e5e7eb;flex-shrink:0;';

    // Powered by badge
    var badge = document.createElement('a');
    badge.href = DETT_BASE;
    badge.target = '_blank';
    badge.rel = 'noopener noreferrer';
    badge.textContent = 'Powered by Dett.io';
    badge.style.cssText =
      'display:inline-flex;align-items:center;gap:6px;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;' +
      'font-size:12px;color:#6b7280;text-decoration:none;padding:4px 10px;' +
      'border:1px solid #e5e7eb;border-radius:20px;background:#fff;transition:color 0.2s;';
    badge.addEventListener('mouseenter', function () { badge.style.color = '#196bc0'; });
    badge.addEventListener('mouseleave', function () { badge.style.color = '#6b7280'; });

    // Close button
    var closeBtn = document.createElement('button');
    closeBtn.innerHTML = '&times;';
    closeBtn.style.cssText =
      'background:rgba(0,0,0,0.08);border:none;border-radius:50%;' +
      'width:32px;height:32px;font-size:20px;line-height:1;' +
      'cursor:pointer;color:#333;display:flex;align-items:center;justify-content:center;' +
      'transition:background 0.2s;flex-shrink:0;';
    closeBtn.addEventListener('mouseenter', function () {
      closeBtn.style.background = 'rgba(0,0,0,0.15)';
    });
    closeBtn.addEventListener('mouseleave', function () {
      closeBtn.style.background = 'rgba(0,0,0,0.08)';
    });

    header.appendChild(badge);
    header.appendChild(closeBtn);

    // Iframe
    var iframe = document.createElement('iframe');
    iframe.src = DETT_BASE + '/embed/' + slug;
    iframe.style.cssText = 'width:100%;flex:1;border:none;';
    iframe.setAttribute('title', 'Dett.io Calculator');
    iframe.setAttribute('loading', 'lazy');

    modal.appendChild(header);
    modal.appendChild(iframe);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // Prevent body scroll
    document.body.style.overflow = 'hidden';

    // Animate in
    requestAnimationFrame(function () {
      overlay.style.opacity = '1';
      modal.style.transform = 'scale(1)';
    });

    // Close handlers
    function close() {
      overlay.style.opacity = '0';
      modal.style.transform = 'scale(0.95)';
      setTimeout(function () {
        if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
        document.body.style.overflow = '';
      }, 250);
    }

    closeBtn.addEventListener('click', close);
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) close();
    });
    document.addEventListener('keydown', function handler(e) {
      if (e.key === 'Escape') {
        close();
        document.removeEventListener('keydown', handler);
      }
    });
  }

  // Auto-init when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose for manual use
  window.DettEmbed = { open: openModal };
})();
