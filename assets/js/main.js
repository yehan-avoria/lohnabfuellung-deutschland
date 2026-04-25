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
    const checkScroll = () => {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', checkScroll, { passive: true });
    checkScroll();
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
    trigger.setAttribute('aria-haspopup', 'true');
    trigger.setAttribute('aria-expanded', 'false');
    trigger.innerHTML = `
      <span class="nav-products-label">${triggerLabel}</span>
      <span class="nav-products-caret" aria-hidden="true">&#9662;</span>
    `;

    const wrapper = document.createElement('div');
    wrapper.className = 'nav-products';
    trigger.parentNode.insertBefore(wrapper, trigger);
    wrapper.appendChild(trigger);

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
      trigger.setAttribute('aria-expanded', 'false');
    };
    const openMenu = () => {
      wrapper.classList.add('is-open');
      trigger.setAttribute('aria-expanded', 'true');
      setPreview(previewIndex);
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

    wrapper.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeMenu();
        trigger.focus();
      }
    });

    trigger.addEventListener('click', (e) => {
      const touchMode = window.matchMedia('(hover: none), (pointer: coarse)').matches || window.innerWidth <= 1024;
      if (!touchMode) return;
      if (!wrapper.classList.contains('is-open')) {
        e.preventDefault();
        openMenu();
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
