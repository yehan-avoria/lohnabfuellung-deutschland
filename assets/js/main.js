/* ============================================================
   MAIN JS - Avoria GmbH
   Navigation, cursor, utilities
   ============================================================ */

if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);
window.addEventListener('load', function () {
  window.scrollTo(0, 0);
  if (typeof ScrollTrigger !== 'undefined') { ScrollTrigger.refresh(); }
});

(function () {
  'use strict';

  /* ---- Custom cursor ---- */
  const cursorDot  = document.querySelector('.cursor-dot');
  const cursorRing = document.querySelector('.cursor-ring');

  if (cursorDot && cursorRing) {
    let cx = 0, cy = 0;
    let rx = 0, ry = 0;

    document.addEventListener('mousemove', (e) => {
      cx = e.clientX;
      cy = e.clientY;
      cursorDot.style.left  = cx + 'px';
      cursorDot.style.top   = cy + 'px';
    });

    function animateRing() {
      rx += (cx - rx) * 0.12;
      ry += (cy - ry) * 0.12;
      cursorRing.style.left = rx + 'px';
      cursorRing.style.top  = ry + 'px';
      requestAnimationFrame(animateRing);
    }
    animateRing();

    // Hover detection
    document.querySelectorAll('a, button, [data-tilt], .faq-question, .product-card, .service-card').forEach((el) => {
      el.addEventListener('mouseenter', () => {
        cursorDot.classList.add('hovering');
        cursorRing.classList.add('hovering');
      });
      el.addEventListener('mouseleave', () => {
        cursorDot.classList.remove('hovering');
        cursorRing.classList.remove('hovering');
      });
    });
  }

  /* ---- Navigation scroll effect ---- */

  const nav = document.querySelector('.nav');
  if (nav) {
    const navScrollRange = 140;
    let navScrollRaf = null;

    const checkScroll = () => {
      const progress = Math.max(0, Math.min(window.scrollY / navScrollRange, 1));
      const eased = progress * progress * (3 - (2 * progress));

      nav.style.setProperty('--nav-scroll-progress', progress.toFixed(4));
      nav.style.setProperty('--nav-scroll-eased', eased.toFixed(4));
      nav.classList.toggle('scrolled', window.scrollY > 40);

      navScrollRaf = null;
    };

    const queueScrollCheck = () => {
      if (navScrollRaf !== null) return;
      navScrollRaf = requestAnimationFrame(checkScroll);
    };

    window.addEventListener('scroll', queueScrollCheck, { passive: true });
    window.addEventListener('resize', queueScrollCheck, { passive: true });
    queueScrollCheck();
  }

  /* ---- Mobile navigation ---- */
  const hamburger = document.querySelector('.nav-hamburger');
  const mobileNav = document.querySelector('.nav-mobile');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      const open = hamburger.classList.toggle('open');
      mobileNav.classList.toggle('open', open);
      if (nav) nav.classList.toggle('menu-open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });

    mobileNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
        if (nav) nav.classList.remove('menu-open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ---- Products dropdown (desktop nav) ---- */
  const navProductIcons = {
    leaf: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 20A7 7 0 0 1 4 13C4 7 9 4 20 4c0 11-3 16-9 16z"></path><path d="M12 12 4 20"></path></svg>',
    drop: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3c3.5 4.2 7 8.3 7 12a7 7 0 0 1-14 0c0-3.7 3.5-7.8 7-12z"></path></svg>',
    wave: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12c2.5 0 2.5-4 5-4s2.5 4 5 4 2.5-4 5-4 2.5 4 5 4"></path><path d="M2 18c2.5 0 2.5-4 5-4s2.5 4 5 4 2.5-4 5-4 2.5 4 5 4"></path></svg>',
    capsule: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 14 4.7 8.7a4.2 4.2 0 0 1 0-5.9 4.2 4.2 0 0 1 5.9 0L16 8.2"></path><path d="m14 10 5.3 5.3a4.2 4.2 0 0 1 0 5.9 4.2 4.2 0 0 1-5.9 0L8 16"></path><path d="m7 7 10 10"></path></svg>',
    bolt: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z"></path></svg>',
    lock: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="11" width="16" height="10" rx="2"></rect><path d="M8 11V8a4 4 0 1 1 8 0v3"></path></svg>',
    flask: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 3h6"></path><path d="M10 3v6l-5.5 9.2A2 2 0 0 0 6.2 21h11.6a2 2 0 0 0 1.7-2.8L14 9V3"></path><path d="M8.5 14h7"></path></svg>'
  };

  const navProductIcon = (name) => navProductIcons[name] || navProductIcons.drop;

  const productsMenuItems = [
    { num: '01', title: 'Hygiene & Kosmetik', href: 'produkte-hygiene-kosmetik.html', copy: 'Pflege- und Kosmetiklinien', icon: 'leaf', image: 'assets/images/Kosmetik.jpg' },
    { num: '02', title: 'CBD Produkte', href: 'produkte-cbd-produkte.html', copy: 'Oele, Tinkturen, Topicals', icon: 'drop', image: 'assets/images/CDB.jpg' },
    { num: '03', title: 'Aetherische Oele', href: 'produkte-aetherische-oele.html', copy: 'Single Oils und Duftmischungen', icon: 'wave', image: 'assets/images/Ätherische Öle.jpg' },
    { num: '04', title: 'Kapseln & Pulver', href: 'produkte-kapseln-pulver.html', copy: 'Caps, Stick Packs, Mischungen', icon: 'capsule', image: 'assets/images/Kapseln.jpg' },
    { num: '05', title: 'Flavor Drops & Aromen', href: 'produkte-flavor-drops-aromen.html', copy: 'Drop-genaue Aroma-Systeme', icon: 'bolt', image: 'assets/images/Flavour Drops.jpg' },
    { num: '06', title: 'Nikotin', href: 'produkte-nikotin.html', copy: 'TPD-nahe Prozesse und Gebinde', icon: 'lock', image: 'assets/images/Nikotin.jpg' },
    { num: '07', title: 'Chemikalien', href: 'produkte-chemikalien.html', copy: 'Technische Fluids und Konzentrate', icon: 'flask', image: 'assets/images/Chemikalien.jpg' }
  ];

  function initProductsDropdown() {
    const navLinks = document.querySelector('.nav .nav-links');
    if (!navLinks) return;

    const trigger = navLinks.querySelector('a[href="produkte.html"]');
    if (!trigger || trigger.closest('.nav-products')) return;

    const triggerLabel = (trigger.textContent || 'Produkte').trim();
    trigger.classList.add('nav-products-trigger');
    trigger.textContent = triggerLabel;

    const wrapper = document.createElement('div');
    wrapper.className = 'nav-products';
    trigger.parentNode.insertBefore(wrapper, trigger);
    wrapper.appendChild(trigger);

    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'nav-products-toggle';
    toggle.setAttribute('aria-label', 'Produktmenü anzeigen');
    toggle.setAttribute('aria-haspopup', 'true');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.innerHTML = '<span class="nav-products-caret" aria-hidden="true">&#9662;</span>';
    wrapper.appendChild(toggle);

    const dropdown = document.createElement('div');
    dropdown.className = 'nav-products-dropdown';
    dropdown.innerHTML = `
      <div class="nav-products-panel">
        <div class="nav-products-head">
          <span class="nav-products-kicker">Produktbereiche</span>
          <span class="nav-products-sub">Alle 7 Kategorien</span>
        </div>
        <div class="nav-products-grid">
          ${productsMenuItems.map((item, index) => `
            <a href="${item.href}" class="nav-product-item" style="--i:${index};" data-preview-index="${index}">
              <span class="nav-product-top">
                <span class="nav-product-num">${item.num}</span>
                <span class="nav-product-media">
                  <img src="${item.image}" alt="${item.title}" class="nav-product-thumb" loading="lazy">
                  <span class="nav-product-icon" aria-hidden="true">${navProductIcon(item.icon)}</span>
                </span>
              </span>
              <span class="nav-product-title">${item.title}</span>
              <span class="nav-product-copy">${item.copy}</span>
            </a>
          `).join('')}
        </div>
      </div>
    `;
    wrapper.appendChild(dropdown);

    const previewMarkup = `
      <div class="nav-products-preview" aria-hidden="true">
        <article class="nav-products-preview-card">
          <div class="nav-products-preview-media">
            <img src="${productsMenuItems[0].image}" alt="${productsMenuItems[0].title}" class="nav-products-preview-image" loading="lazy">
            <span class="nav-products-preview-icon" aria-hidden="true">${navProductIcon(productsMenuItems[0].icon)}</span>
          </div>
          <div class="nav-products-preview-body">
            <span class="nav-products-preview-num">${productsMenuItems[0].num}</span>
            <h4 class="nav-products-preview-title">${productsMenuItems[0].title}</h4>
            <p class="nav-products-preview-copy">${productsMenuItems[0].copy}</p>
          </div>
        </article>
      </div>
    `;
    dropdown.insertAdjacentHTML('afterbegin', previewMarkup);

    const previewCard = dropdown.querySelector('.nav-products-preview-card');
    const previewImage = dropdown.querySelector('.nav-products-preview-image');
    const previewIcon = dropdown.querySelector('.nav-products-preview-icon');
    const previewNum = dropdown.querySelector('.nav-products-preview-num');
    const previewTitle = dropdown.querySelector('.nav-products-preview-title');
    const previewCopy = dropdown.querySelector('.nav-products-preview-copy');

    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const matchedIndex = productsMenuItems.findIndex((item) => item.href === currentPath);
    let previewIndex = matchedIndex >= 0 ? matchedIndex : 0;

    const setPreview = (index) => {
      const item = productsMenuItems[index];
      if (!item || !previewImage || !previewIcon || !previewNum || !previewTitle || !previewCopy) return;
      previewIndex = index;
      previewImage.src = item.image;
      previewImage.alt = item.title;
      previewIcon.innerHTML = navProductIcon(item.icon);
      previewNum.textContent = item.num;
      previewTitle.textContent = item.title;
      previewCopy.textContent = item.copy;
    };

    setPreview(previewIndex);

    const menuLinks = Array.from(dropdown.querySelectorAll('.nav-product-item'));
    const closeMenu = () => {
      wrapper.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    };
    const openMenu = () => {
      wrapper.classList.add('is-open');
      toggle.setAttribute('aria-expanded', 'true');
      setPreview(previewIndex);
    };
    const toggleMenu = () => {
      if (wrapper.classList.contains('is-open')) closeMenu();
      else openMenu();
    };

    let closeTimer = null;
    const cancelClose = () => {
      if (closeTimer) {
        clearTimeout(closeTimer);
        closeTimer = null;
      }
    };
    const queueClose = () => {
      cancelClose();
      closeTimer = setTimeout(closeMenu, 140);
    };

    wrapper.addEventListener('mouseenter', () => {
      cancelClose();
      openMenu();
    });
    wrapper.addEventListener('mouseleave', queueClose);
    wrapper.addEventListener('focusin', () => {
      cancelClose();
      openMenu();
    });
    wrapper.addEventListener('focusout', () => {
      if (!wrapper.contains(document.activeElement)) queueClose();
    });

    trigger.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        openMenu();
        if (menuLinks[0]) menuLinks[0].focus();
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        closeMenu();
        trigger.focus();
      }
    });

    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      cancelClose();
      toggleMenu();
    });

    toggle.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openMenu();
        if (menuLinks[0] && e.key === 'ArrowDown') menuLinks[0].focus();
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        closeMenu();
        toggle.focus();
      }
    });

    wrapper.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeMenu();
        trigger.focus();
      }
    });

    document.addEventListener('click', (e) => {
      if (!wrapper.contains(e.target)) closeMenu();
    });

    if (previewCard) {
      dropdown.addEventListener('mousemove', (e) => {
        const rect = dropdown.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) - 0.5;
        const y = ((e.clientY - rect.top) / rect.height) - 0.5;
        previewCard.style.setProperty('--rx', (-y * 8).toFixed(2) + 'deg');
        previewCard.style.setProperty('--ry', (x * 9).toFixed(2) + 'deg');
      });
      dropdown.addEventListener('mouseleave', () => {
        previewCard.style.setProperty('--rx', '0deg');
        previewCard.style.setProperty('--ry', '0deg');
      });
    }

    menuLinks.forEach((link) => {
      const itemIndex = parseInt(link.dataset.previewIndex || '0', 10);
      link.addEventListener('mouseenter', () => setPreview(itemIndex));
      link.addEventListener('focus', () => setPreview(itemIndex));

      if (cursorDot && cursorRing) {
        link.addEventListener('mouseenter', () => {
          cursorDot.classList.add('hovering');
          cursorRing.classList.add('hovering');
        });
        link.addEventListener('mouseleave', () => {
          cursorDot.classList.remove('hovering');
          cursorRing.classList.remove('hovering');
        });
      }
      link.addEventListener('click', closeMenu);
    });
  }

  initProductsDropdown();

  /* ---- Services (Leistungen) dropdown (desktop nav) ---- */
  const navServiceIcons = {
    lab:        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 3h6M10 3v6l-5.5 9.2A2 2 0 0 0 6.2 21h11.6a2 2 0 0 0 1.7-2.8L14 9V3"/><path d="M8.5 14h7"/></svg>',
    droplets:   '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 7.5 7 5c-.29 2.5-1.57 3.89-2.29 4.06C3.57 10 3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z"/><path d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97"/></svg>',
    box:        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5M12 22V12"/></svg>',
    shield:     '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
    microscope: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="18" r="2"/><path d="M9 3 7.5 9M15 3l1.5 6"/><path d="M9 9h6v6H9z"/><path d="M12 15v3"/></svg>',
    truck:      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3"/><rect width="7" height="7" x="14" y="10" rx="1"/><circle cx="7.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg>'
  };

  const servicesMenuItems = [
    { num: '01', title: 'Produktentwicklung',       href: 'leistungen-produktentwicklung.html', copy: 'Von der Idee zum Produkt',        icon: 'lab',        iconBg: 'radial-gradient(circle at 60% 40%, #008cb4 0%, #041c28 55%, #020e14 100%)' },
    { num: '02', title: 'Lohnabfüllung',             href: 'leistungen-lohnabfuellung.html',     copy: 'Präzise Abfüllung & Produktion', icon: 'droplets',   iconBg: 'radial-gradient(circle at 60% 40%, #0a783c 0%, #051a0e 55%, #020d07 100%)' },
    { num: '03', title: 'Verpackung & Etikettierung',href: 'leistungen-verpackung.html',         copy: 'Design trifft Funktion',         icon: 'box',        iconBg: 'radial-gradient(circle at 60% 40%, #a01e3c 0%, #2a0a12 55%, #120407 100%)' },
    { num: '04', title: 'Qualitätsmanagement',       href: 'leistungen-qualitaet.html',          copy: 'ISO 9001 & HACCP zertifiziert',  icon: 'shield',     iconBg: 'radial-gradient(circle at 60% 40%, #0a32a0 0%, #0a1540 55%, #050a1c 100%)' },
    { num: '05', title: 'In-house Analysen',         href: 'leistungen-analysen.html',           copy: 'Qualität messbar gemacht',       icon: 'microscope', iconBg: 'radial-gradient(circle at 60% 40%, #008cb4 0%, #041c28 55%, #020e14 100%)' },
    { num: '06', title: 'Logistik & Versand',        href: 'leistungen-logistik.html',           copy: 'Pünktlich ans Ziel',             icon: 'truck',      iconBg: 'radial-gradient(circle at 60% 40%, #a0640a 0%, #16100a 55%, #080604 100%)' }
  ];

  function initServicesDropdown() {
    const navLinks = document.querySelector('.nav .nav-links');
    if (!navLinks) return;

    const trigger = navLinks.querySelector('a[href="leistungen.html"]');
    if (!trigger || trigger.closest('.nav-services')) return;

    const triggerLabel = (trigger.textContent || 'Leistungen').trim();
    trigger.classList.add('nav-services-trigger');
    trigger.textContent = triggerLabel;

    const wrapper = document.createElement('div');
    wrapper.className = 'nav-services';
    trigger.parentNode.insertBefore(wrapper, trigger);
    wrapper.appendChild(trigger);

    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'nav-services-toggle';
    toggle.setAttribute('aria-label', 'Leistungsmenü anzeigen');
    toggle.setAttribute('aria-haspopup', 'true');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.innerHTML = '<span class="nav-services-caret" aria-hidden="true">&#9662;</span>';
    wrapper.appendChild(toggle);

    const dropdown = document.createElement('div');
    dropdown.className = 'nav-services-dropdown';
    dropdown.innerHTML = `
      <div class="nav-services-panel">
        <div class="nav-services-head">
          <span class="nav-services-kicker">Unsere Leistungen</span>
          <span class="nav-services-sub">6 Services</span>
        </div>
        <div class="nav-services-grid">
          ${servicesMenuItems.map((item, index) => `
            <a href="${item.href}" class="nav-service-item" style="--i:${index};">
              <span class="nav-service-icon" aria-hidden="true" style="background:${item.iconBg};">${navServiceIcons[item.icon] || ''}</span>
              <span class="nav-service-body">
                <span class="nav-service-num">${item.num}</span>
                <span class="nav-service-title">${item.title}</span>
                <span class="nav-service-copy">${item.copy}</span>
              </span>
            </a>
          `).join('')}
        </div>
      </div>
    `;
    wrapper.appendChild(dropdown);

    const menuLinks = Array.from(dropdown.querySelectorAll('.nav-service-item'));

    const closeMenu = () => {
      wrapper.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    };
    const openMenu = () => {
      wrapper.classList.add('is-open');
      toggle.setAttribute('aria-expanded', 'true');
    };
    const toggleMenu = () => {
      if (wrapper.classList.contains('is-open')) closeMenu(); else openMenu();
    };

    let closeTimer = null;
    const cancelClose = () => { if (closeTimer) { clearTimeout(closeTimer); closeTimer = null; } };
    const queueClose = () => { cancelClose(); closeTimer = setTimeout(closeMenu, 140); };

    wrapper.addEventListener('mouseenter', () => { cancelClose(); openMenu(); });
    wrapper.addEventListener('mouseleave', queueClose);
    wrapper.addEventListener('focusin', () => { cancelClose(); openMenu(); });
    wrapper.addEventListener('focusout', () => { if (!wrapper.contains(document.activeElement)) queueClose(); });

    trigger.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') { e.preventDefault(); openMenu(); if (menuLinks[0]) menuLinks[0].focus(); }
      if (e.key === 'Escape') { e.preventDefault(); closeMenu(); trigger.focus(); }
    });

    toggle.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); cancelClose(); toggleMenu(); });
    toggle.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault(); openMenu(); if (menuLinks[0] && e.key === 'ArrowDown') menuLinks[0].focus();
      }
      if (e.key === 'Escape') { e.preventDefault(); closeMenu(); toggle.focus(); }
    });
    wrapper.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') { e.preventDefault(); closeMenu(); trigger.focus(); }
    });

    document.addEventListener('click', (e) => { if (!wrapper.contains(e.target)) closeMenu(); });

    if (cursorDot && cursorRing) {
      menuLinks.forEach((link) => {
        link.addEventListener('mouseenter', () => { cursorDot.classList.add('hovering'); cursorRing.classList.add('hovering'); });
        link.addEventListener('mouseleave', () => { cursorDot.classList.remove('hovering'); cursorRing.classList.remove('hovering'); });
        link.addEventListener('click', closeMenu);
      });
    }
  }

  initServicesDropdown();

  /* ---- Nav text colour — luminance-based section detection ----
     Reads the visual background of whichever page section sits under
     the nav centre. Sections can declare --nav-bg-hint to override
     the CSS background-color (needed when a video/canvas/gradient
     pseudo-element is the real visual, not the element's own bg).

     Palette:  dark bg → white  ·  mid → brand blue  ·  light bg → black  */
  function initNavColorDetect() {
    var navEl = document.querySelector('.nav');
    if (!navEl) return;

    var LINK_SEL =
      '.nav-links > a:not(.nav-cta),' +
      '.nav-links .nav-products-trigger,' +
      '.nav-links .nav-products-toggle,' +
      '.nav-links .nav-services-trigger,' +
      '.nav-links .nav-services-toggle';

    var WHITE = [255, 255, 255];
    var BLUE  = [9, 103, 180];
    var BLACK = [0, 0, 0];
    var current = '';
    var rafId = null;

    function hexToRGB(h) {
      h = h.replace('#', '');
      if (h.length === 3) h = h[0]+h[0]+h[1]+h[1]+h[2]+h[2];
      return [parseInt(h.slice(0,2),16), parseInt(h.slice(2,4),16), parseInt(h.slice(4,6),16)];
    }

    function parseRGB(str) {
      if (!str) return null;
      var m = str.match(/rgba?\((\d+)[,\s]+(\d+)[,\s]+(\d+)/);
      if (!m) return null;
      var a = str.match(/rgba\([^,]+,[^,]+,[^,]+,\s*([0-9.]+)\)/);
      if (a && parseFloat(a[1]) < 0.05) return null;
      return [+m[1], +m[2], +m[3]];
    }

    function lin(c) { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); }
    function luma(rgb) { return 0.2126 * lin(rgb[0]) + 0.7152 * lin(rgb[1]) + 0.0722 * lin(rgb[2]); }

    function lerp3(a, b, t) {
      return 'rgb(' +
        Math.round(a[0] + (b[0]-a[0]) * t) + ',' +
        Math.round(a[1] + (b[1]-a[1]) * t) + ',' +
        Math.round(a[2] + (b[2]-a[2]) * t) + ')';
    }

    function lumaToColor(L) {
      if (L < 0.14)      return 'rgb(255,255,255)';
      if (L < 0.30)      return lerp3(WHITE, BLUE,  (L - 0.14) / 0.16);
      if (L < 0.50)      return lerp3(BLUE,  BLACK, (L - 0.30) / 0.20);
      return 'rgb(0,0,0)';
    }

    /* Extract the first OPAQUE colour from a CSS gradient string.
       Skips rgba() stops with alpha < 0.5 (decorative radial-overlay
       highlights like rgba(255,255,255,0.06) that sit in front of the
       real gradient and would give a falsely-bright luminance reading). */
    function firstGradientColor(bgImage) {
      if (!bgImage || bgImage === 'none') return null;
      var hexM = bgImage.match(/#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b/);
      if (hexM) return hexToRGB('#' + hexM[1]);
      var re = /rgba?\((\d+)[,\s]+(\d+)[,\s]+(\d+)(?:[,\s/]+([0-9.]+))?\)/g;
      var m;
      while ((m = re.exec(bgImage)) !== null) {
        var alpha = m[4] !== undefined ? parseFloat(m[4]) : 1;
        if (alpha >= 0.5) return [+m[1], +m[2], +m[3]];
      }
      return null;
    }

    /* Return the best RGB for an element: hint → ph-accent-dark (hero) → bg-color → gradient */
    function elBgRGB(el) {
      var cs = window.getComputedStyle(el);
      var hint = cs.getPropertyValue('--nav-bg-hint').trim();
      if (hint) return hexToRGB(hint);
      /* Product-page hero: its gradient is built from --ph-accent-dark;
         using that directly avoids the translucent radial overlay problem */
      if (el.classList && el.classList.contains('ph-hero')) {
        var phDark = cs.getPropertyValue('--ph-accent-dark').trim();
        if (phDark) return hexToRGB(phDark);
      }
      var solid = parseRGB(cs.backgroundColor);
      if (solid) return solid;
      return firstGradientColor(cs.backgroundImage);
    }

    function getBgRGB() {
      var navH = navEl.offsetHeight || 70;
      var cy   = navH / 2;
      /* Sample at the horizontal centre of the nav-links area (≈65% from left) */
      var cx = window.innerWidth * 0.65;

      /* Query sections (broad containers) and card-level bg elements */
      var els = document.querySelectorAll(
        'section, .marquee-section, footer, ' +
        '.product-card-bg, .product-card[style], ' +
        '[class$="-section-bg"], [class$="-bg"]'
      );

      var sectionRGB = null;   /* fallback: the owning section's colour */
      var cardRGB    = null;   /* preferred: more specific card element */
      var cardArea   = Infinity;

      for (var i = 0; i < els.length; i++) {
        var el = els[i];
        if (el === navEl || navEl.contains(el)) continue;
        var r = el.getBoundingClientRect();
        if (r.top > cy || r.bottom <= cy) continue;
        if (r.left > cx || r.right  <= cx) continue;

        var rgb = elBgRGB(el);
        if (!rgb) continue;

        var area = r.width * r.height;
        var isSection = el.tagName === 'SECTION' || el.classList.contains('marquee-section') || el.tagName === 'FOOTER';

        if (isSection) {
          sectionRGB = rgb; /* keep as fallback */
        } else if (area < cardArea) {
          cardArea = area;
          cardRGB  = rgb;   /* most specific card-level bg wins */
        }
      }

      /* Prefer card-level if found, else section, else body */
      if (cardRGB) return cardRGB;
      if (sectionRGB) return sectionRGB;
      var bodyRGB = parseRGB(window.getComputedStyle(document.body).backgroundColor);
      return bodyRGB || [20, 20, 40];
    }

    function applyColor(color) {
      if (color === current) return;
      current = color;
      navEl.querySelectorAll(LINK_SEL).forEach(function(el) {
        el.style.color = color;
      });
      navEl.querySelectorAll('.nav-hamburger span').forEach(function(s) {
        s.style.background = color;
      });
    }

    function update() {
      applyColor(lumaToColor(luma(getBgRGB())));
      rafId = null;
    }

    function schedule() {
      if (!rafId) rafId = requestAnimationFrame(update);
    }

    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    schedule();
  }

  initNavColorDetect();

  /* ---- Active nav link based on current page ---- */
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .nav-mobile a').forEach((a) => {
    const href = a.getAttribute('href');
    if (href && (href === path || (path === '' && href === 'index.html'))) {
      a.classList.add('active');
    }
  });

  /* ---- Intersection Observer for [data-animate] fallback ---- */
  if (!('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll('[data-animate]').forEach((el) => observer.observe(el));

  /* ---- Contact form submission ---- */
  document.querySelectorAll('form.contact-form-el').forEach((form) => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn  = form.querySelector('.form-submit');
      const msg  = form.querySelector('.form-message');
      const originalHTML = btn.innerHTML;

      btn.innerHTML = 'Wird gesendet...';
      btn.disabled = true;
      if (msg) { msg.className = 'form-message'; msg.textContent = ''; }

      try {
        if (typeof avoria_ajax !== 'undefined') {
          // WordPress AJAX path
          const data = new FormData(form);
          data.set('nonce', avoria_ajax.nonce);
          const res  = await fetch(avoria_ajax.ajax_url, { method: 'POST', body: data });
          const json = await res.json();
          if (msg) {
            msg.className = 'form-message ' + (json.success ? 'success' : 'error');
            msg.textContent = json.data && json.data.message
              ? json.data.message
              : (json.success ? 'Vielen Dank! Ihre Nachricht wurde gesendet.' : 'Ein Fehler ist aufgetreten.');
          }
          if (json.success) form.reset();
        } else {
          // Standalone HTML simulation
          await new Promise(r => setTimeout(r, 1400));
          if (msg) {
            msg.className = 'form-message success';
            msg.textContent = 'Vielen Dank! Ihre Nachricht wurde erfolgreich gesendet. Wir melden uns in Kürze.';
          }
          form.reset();
        }
      } catch (_) {
        if (msg) { msg.className = 'form-message error'; msg.textContent = 'Sendefehler. Bitte versuchen Sie es erneut.'; }
      }

      btn.innerHTML = originalHTML;
      btn.disabled = false;
    });
  });

  /* ---- Hero word split prep (runs before GSAP) ---- */
  const heroTitle = document.querySelector('.hero-title');
  if (heroTitle && !heroTitle.querySelector('.word')) {
    // Already split via HTML – skip
  }

  /* ---- Marquee pause on hover ---- */
  document.querySelectorAll('.marquee-track').forEach((track) => {
    track.addEventListener('mouseenter', () => track.style.animationPlayState = 'paused');
    track.addEventListener('mouseleave', () => track.style.animationPlayState = 'running');
  });

  /* ---- Lazy image loading ---- */
  document.querySelectorAll('img[data-src]').forEach((img) => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          img.src = img.dataset.src;
          io.disconnect();
        }
      });
    });
    io.observe(img);
  });

  /* ---- Smooth reveal for [data-reveal] (CSS-based fallback) ---- */
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('revealed');
        revealObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('[data-reveal]').forEach((el) => revealObs.observe(el));

})();
