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

  /* ---- Custom cursor (blend-mode blob) ---- */
  const cursorDot = document.querySelector('.cursor-dot');

  if (cursorDot) {
    let tx = 0, ty = 0, cx = 0, cy = 0;

    document.addEventListener('mousemove', (e) => {
      tx = e.clientX;
      ty = e.clientY;
    });

    (function animate() {
      cx += (tx - cx) * 0.18;
      cy += (ty - cy) * 0.18;
      cursorDot.style.left = cx + 'px';
      cursorDot.style.top  = cy + 'px';
      requestAnimationFrame(animate);
    })();

    document.querySelectorAll('a, button, [data-tilt], .faq-question, .product-card, .service-card').forEach((el) => {
      el.addEventListener('mouseenter', () => cursorDot.classList.add('hovering'));
      el.addEventListener('mouseleave', () => cursorDot.classList.remove('hovering'));
    });
  }

  /* ---- Footer social links ---- */
  const footerSocialLinks = [
    {
      label: 'Instagram',
      href: 'https://www.instagram.com/avoriaofficial/',
      icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"></rect><circle cx="12" cy="12" r="4"></circle><circle cx="17.5" cy="6.5" r="1.2"></circle></svg>'
    },
    {
      label: 'Facebook',
      href: 'https://www.facebook.com/Avoria.GmbH/',
      icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 8h3V4h-3a5 5 0 0 0-5 5v3H6v4h3v4h4v-4h3l1-4h-4V9a1 1 0 0 1 1-1z"></path></svg>'
    }
  ];

  document.querySelectorAll('.footer-brand').forEach((brand) => {
    if (brand.querySelector('.footer-social-links')) return;

    const social = document.createElement('div');
    social.className = 'footer-social-links';
    social.setAttribute('aria-label', 'Social Media');
    social.innerHTML = footerSocialLinks.map((item) => `
      <a href="${item.href}" class="footer-social-link" target="_blank" rel="noopener noreferrer" aria-label="${item.label}">
        <span class="footer-social-icon">${item.icon}</span>
        <span>${item.label}</span>
      </a>
    `).join('');

    const anchor = brand.querySelector('.footer-contact-links') || brand.querySelector('.footer-brand-desc');
    if (anchor) {
      anchor.insertAdjacentElement('afterend', social);
    } else {
      brand.appendChild(social);
    }
  });

  const avoriaMapUrl = 'https://maps.google.com/?q=Industriestra%C3%9Fe+90574+Ro%C3%9Ftal+Bayern+Deutschland';
  document.querySelectorAll('.footer-contact-link').forEach((link) => {
    const text = (link.textContent || '').trim();
    if (!text.includes('Avoria GmbH') || !text.includes('Ro')) return;

    link.href = avoriaMapUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.setAttribute('aria-label', 'Avoria GmbH Standort in Google Maps öffnen');
  });

  /* ---- Navigation scroll effect ---- */

  const nav = document.querySelector('.nav');
  if (nav) {
    const navScrollRange = 140;
    let navScrollRaf = null;
    const darkNavSelectors = [
      '.hero',
      '.ph-hero',
      '.service-hero',
      '.section--dark',
      '.ph-section--dark',
      '.cta-section',
      '.contact-panel--form'
    ].join(',');

    const checkScroll = () => {
      const progress = Math.max(0, Math.min(window.scrollY / navScrollRange, 1));
      const eased = progress * progress * (3 - (2 * progress));
      const probeY = Math.min(window.innerHeight - 1, nav.offsetHeight + 8);
      const probeX = Math.floor(window.innerWidth / 2);
      const probeXLogo = Math.floor(window.innerWidth * 0.1);
      const elementBelowNav = document.elementFromPoint(probeX, probeY);
      const elementBelowLogo = document.elementFromPoint(probeXLogo, probeY);
      const isOverDark = Boolean(elementBelowNav && elementBelowNav.closest(darkNavSelectors));
      const isLogoOverDark = Boolean(elementBelowLogo && elementBelowLogo.closest(darkNavSelectors));

      nav.style.setProperty('--nav-scroll-progress', progress.toFixed(4));
      nav.style.setProperty('--nav-scroll-eased', eased.toFixed(4));
      nav.classList.toggle('scrolled', window.scrollY > 40);
      nav.classList.toggle('nav-over-dark', isOverDark);
      nav.classList.toggle('nav-logo-over-dark', isLogoOverDark);

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
    /* === Slide-panel mobile nav === */
    (function() {
      var RIGHT = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:20px;height:20px;flex-shrink:0"><path d="M9 18l6-6-6-6"/></svg>';
      var LEFT  = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:16px;height:16px;flex-shrink:0"><path d="M15 18l-6-6 6-6"/></svg>';

      var ICONS = {
        lab:        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 3h6M10 3v6l-5.5 9.2A2 2 0 0 0 6.2 21h11.6a2 2 0 0 0 1.7-2.8L14 9V3"/><path d="M8.5 14h7"/></svg>',
        droplets:   '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 7.5 7 5c-.29 2.5-1.57 3.89-2.29 4.06C3.57 10 3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z"/><path d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97"/></svg>',
        box:        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5M12 22V12"/></svg>',
        shield:     '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
        microscope: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="18" r="2"/><path d="M9 3 7.5 9M15 3l1.5 6"/><path d="M9 9h6v6H9z"/><path d="M12 15v3"/></svg>',
        truck:      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3"/><rect width="7" height="7" x="14" y="10" rx="1"/><circle cx="7.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg>',
        layers:     '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>'
      };

      function cardHTML(it) {
        var visual = it.icon
          ? '<span class="mnav-ic" style="background:' + it.iconBg + '">' + (ICONS[it.icon] || '') + '</span>'
          : it.image
            ? '<span class="mnav-ic mnav-ic--img"><img src="' + it.image + '" alt="' + it.label + '" loading="lazy"></span>'
            : '';
        return visual +
          '<span class="mnav-ic-body">' +
            (it.num ? '<span class="mnav-ic-num">' + it.num + '</span>' : '') +
            '<span class="mnav-ic-name">' + it.label + '</span>' +
            (it.copy ? '<span class="mnav-ic-copy">' + it.copy + '</span>' : '') +
          '</span>';
      }

      function panel(id, items) {
        var backBtn = id === 'main' ? '' :
          '<button class="mnav-back-btn" type="button">' + LEFT + '<span>Zur\xfcck</span></button>';

        var rows = items.map(function(it) {
          var isCard = it.icon || it.image;
          if (it.type === 'drill') {
            if (isCard) {
              return '<div class="mnav-drill-card-wrap mnav-item-card">' +
                '<a href="' + it.href + '" class="mnav-card-link">' + cardHTML(it) + '</a>' +
                '<button class="mnav-drill" type="button" data-target="' + it.target + '">' + RIGHT + '</button>' +
              '</div>';
            }
            return '<div class="mnav-item-row">' +
              '<a href="' + it.href + '" class="mnav-item-link">' + it.label + '</a>' +
              '<button class="mnav-drill" type="button" data-target="' + it.target + '">' + RIGHT + '</button>' +
            '</div>';
          }
          if (isCard) {
            return '<a href="' + it.href + '" class="mnav-item-card">' + cardHTML(it) + '</a>';
          }
          return '<a href="' + it.href + '" class="mnav-item-link">' + it.label + '</a>';
        }).join('');

        return '<div class="mnav-panel' + (id === 'main' ? ' is-active' : '') + '" data-panel="' + id + '">' +
          backBtn + '<div class="mnav-items">' + rows + '</div>' +
        '</div>';
      }

      mobileNav.innerHTML =
        '<div class="mnav-stage">' +
          panel('main', [
            { type: 'link',  href: 'index.html',      label: 'Start' },
            { type: 'drill', href: 'leistungen.html', label: 'Leistungen', target: 'leistungen' },
            { type: 'drill', href: 'produkte.html',   label: 'Produkte',   target: 'produkte' },
            { type: 'link',  href: 'qualitaet.html',  label: 'Qualit\xe4t' },
            { type: 'link',  href: 'ueber-uns.html',  label: '\xdcber uns' },
            { type: 'link',  href: 'kontakt.html',    label: 'Kontakt' },
          ]) +
          panel('leistungen', [
            { type: 'link',  href: 'leistungen.html', label: 'Alle Leistungen' },
            { type: 'link',  href: 'leistungen-produktentwicklung.html', label: 'Produktentwicklung', num: '01', icon: 'lab',        iconBg: 'radial-gradient(circle at 60% 40%,#008cb4 0%,#041c28 55%,#020e14 100%)', copy: 'Von der Idee zum Produkt' },
            { type: 'link',  href: 'leistungen-lohnabfuellung.html',     label: 'Lohnabf\xfcllung',  num: '02', icon: 'droplets',   iconBg: 'radial-gradient(circle at 60% 40%,#0a783c 0%,#051a0e 55%,#020d07 100%)', copy: 'Pr\xe4zise Abf\xfcllung &amp; Produktion' },
            { type: 'link',  href: 'leistungen-verpackung.html',         label: 'Verpackung &amp; Etikettierung', num: '03', icon: 'box', iconBg: 'radial-gradient(circle at 60% 40%,#a01e3c 0%,#2a0a12 55%,#120407 100%)', copy: 'Design trifft Funktion' },
            { type: 'link',  href: 'leistungen-qualitaet.html',          label: 'Qualit\xe4tsmanagement', num: '04', icon: 'shield',     iconBg: 'radial-gradient(circle at 60% 40%,#0a32a0 0%,#0a1540 55%,#050a1c 100%)', copy: 'ISO 9001 &amp; HACCP zertifiziert' },
            { type: 'link',  href: 'leistungen-analysen.html',           label: 'In-house Analysen', num: '05', icon: 'microscope', iconBg: 'radial-gradient(circle at 60% 40%,#008cb4 0%,#041c28 55%,#020e14 100%)', copy: 'Qualit\xe4t messbar gemacht' },
            { type: 'link',  href: 'leistungen-logistik.html',           label: 'Logistik &amp; Versand', num: '06', icon: 'truck',  iconBg: 'radial-gradient(circle at 60% 40%,#a0640a 0%,#16100a 55%,#080604 100%)', copy: 'P\xfcnktlich ans Ziel' },
            { type: 'drill', href: 'pulver-sachets-abfuellen-lassen.html', label: 'Sachets &amp; Pulver', num: '07', icon: 'layers', iconBg: 'radial-gradient(circle at 60% 40%,#8c32d2 0%,#1e0a3c 55%,#0e0416 100%)', copy: 'Talkum, Granulate &amp; Kleinbeutel', target: 'sachets' },
          ]) +
          panel('produkte', [
            { type: 'link', href: 'produkte.html', label: 'Alle Produkte' },
            { type: 'link', href: 'produkte-kosmetik.html',              label: 'Kosmetik',                   num: '01', image: 'assets/images/Kosmetik.jpg',           copy: 'Beauty, Pflege, Private Label' },
            { type: 'link', href: 'produkte-hygiene.html',               label: 'Hygiene',                    num: '02', image: 'assets/images/Hygiene.webp',            copy: 'Clean-Care und Reinigung' },
            { type: 'link', href: 'produkte-cbd-produkte.html',          label: 'CBD Produkte',               num: '03', image: 'assets/images/CDB.jpg',                 copy: 'Oele, Tinkturen, Topicals' },
            { type: 'link', href: 'produkte-kapseln.html',               label: 'Kapseln',                    num: '04', image: 'assets/images/Kapseln.jpg',             copy: 'Caps und Supplement-Gebinde' },
            { type: 'link', href: 'produkte-pulver.html',                label: 'Pulver',                     num: '05', image: 'assets/images/pulver.webp',             copy: 'Blends, Dosen, Stick Packs' },
            { type: 'link', href: 'produkte-aetherische-oele.html',      label: '\xc4therische \xd6le',       num: '06', image: 'assets/images/\xc4therische \xd6le.jpg', copy: 'Single Oils und Duftmischungen' },
            { type: 'link', href: 'produkte-flavor-drops-aromen.html',   label: 'Flavor Drops &amp; Aromen', num: '07', image: 'assets/images/Flavour Drops.jpg',        copy: 'Drop-genaue Aroma-Systeme' },
            { type: 'link', href: 'produkte-nikotin.html',               label: 'Nikotin',                    num: '08', image: 'assets/images/Nikotin.jpg',             copy: 'TPD-nahe Prozesse und Gebinde' },
            { type: 'link', href: 'produkte-chemikalien.html',           label: 'Chemikalien',                num: '09', image: 'assets/images/Chemikalien.jpg',         copy: 'Technische Fluids und Konzentrate' },
            { type: 'link', href: 'produkte-propylenglykol-glycerin.html', label: 'Propylenglykol &amp; Glycerin', num: '10', image: 'assets/images/PG-VG.webp',      copy: 'PG/VG, Basen und Gebinde' },
          ]) +
          panel('sachets', [
            { type: 'link', href: 'pulver-sachets-abfuellen-lassen.html',     label: 'Alle Sachets &amp; Pulver' },
            { type: 'link', href: 'pulver-abfuellen-lassen-deutschland.html', label: 'Pulver &amp; Granulate',    num: '01', icon: 'layers', iconBg: 'radial-gradient(circle at 60% 40%,#8c32d2 0%,#1e0a3c 55%,#0e0416 100%)', copy: 'Pulvermischungen &amp; Granulate' },
            { type: 'link', href: 'sachets-abfuellen-lassen.html',            label: 'Sachets &amp; Kleinbeutel', num: '02', icon: 'layers', iconBg: 'radial-gradient(circle at 60% 40%,#6020aa 0%,#160830 55%,#080310 100%)', copy: 'Pr\xe4zise Beutelabf\xfcllung' },
            { type: 'link', href: 'talkum-abfuellen-lassen.html',             label: 'Talkum Abf\xfcllung',       num: '03', icon: 'layers', iconBg: 'radial-gradient(circle at 60% 40%,#4010a0 0%,#0a0828 55%,#040214 100%)', copy: 'Talkum &amp; Feinpulver' },
            { type: 'link', href: 'technische-pulver-abfuellen.html',         label: 'Technische Produkte',        num: '04', icon: 'layers', iconBg: 'radial-gradient(circle at 60% 40%,#203080 0%,#0a0818 55%,#040208 100%)', copy: 'Technische Pulver &amp; Spezialprodukte' },
          ]) +
        '</div>';

      /* Panel navigation */
      var stack = ['main'];

      function getPanel(id) { return mobileNav.querySelector('[data-panel="' + id + '"]'); }

      function goTo(targetId) {
        var curId = stack[stack.length - 1];
        var cur = getPanel(curId);
        var next = getPanel(targetId);
        if (!next) return;
        stack.push(targetId);
        cur.classList.add('is-exit');
        cur.classList.remove('is-active');
        next.classList.remove('is-right');
        next.classList.add('is-active');
      }

      function goBack() {
        if (stack.length <= 1) return;
        var curId = stack.pop();
        var prevId = stack[stack.length - 1];
        var cur = getPanel(curId);
        var prev = getPanel(prevId);
        cur.classList.remove('is-active');
        cur.classList.add('is-right');
        prev.classList.remove('is-exit');
        prev.classList.add('is-active');
      }

      function resetPanels() {
        stack = ['main'];
        mobileNav.querySelectorAll('.mnav-panel').forEach(function(p) {
          p.classList.remove('is-active', 'is-exit', 'is-right');
        });
        getPanel('main').classList.add('is-active');
      }

      mobileNav.querySelectorAll('.mnav-drill').forEach(function(btn) {
        btn.addEventListener('click', function(e) {
          e.stopPropagation();
          goTo(btn.dataset.target);
        });
      });

      mobileNav.querySelectorAll('.mnav-back-btn').forEach(function(btn) {
        btn.addEventListener('click', function(e) {
          e.stopPropagation();
          goBack();
        });
      });

      mobileNav._resetPanels = resetPanels;
    })();

    /* Backdrop — injected once, works on all pages */
    const navBd = document.createElement('div');
    navBd.className = 'nav-mobile-bd';
    document.body.appendChild(navBd);

    function closeMobileNav() {
      hamburger.classList.remove('open');
      mobileNav.classList.remove('open');
      navBd.classList.remove('open');
      if (nav) nav.classList.remove('menu-open');
      document.body.style.overflow = '';
      if (mobileNav._resetPanels) mobileNav._resetPanels();
    }

    navBd.addEventListener('click', closeMobileNav);

    hamburger.addEventListener('click', () => {
      const open = hamburger.classList.toggle('open');
      mobileNav.classList.toggle('open', open);
      navBd.classList.toggle('open', open);
      if (nav) nav.classList.toggle('menu-open', open);
      document.body.style.overflow = open ? 'hidden' : '';
      if (!open) closeMobileNav();
    });

    mobileNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => { closeMobileNav(); });
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
    flask: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 3h6"></path><path d="M10 3v6l-5.5 9.2A2 2 0 0 0 6.2 21h11.6a2 2 0 0 0 1.7-2.8L14 9V3"></path><path d="M8.5 14h7"></path></svg>',
    bottle: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 2h4"></path><path d="M10 6h4"></path><path d="M9 6v4L5.6 18a2 2 0 0 0 1.8 3h9.2a2 2 0 0 0 1.8-3L15 10V6"></path></svg>',
    shield: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>',
    lab: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 2v7l-5.5 9.2A2 2 0 0 0 6.2 21h11.6a2 2 0 0 0 1.7-2.8L14 9V2"></path><path d="M8 14h8"></path></svg>'
  };

  const navProductIcon = (name) => navProductIcons[name] || navProductIcons.drop;

  const productsMenuItems = [
    { num: '01', title: 'Kosmetik', href: 'produkte-kosmetik.html', copy: 'Beauty, Pflege, Private Label', icon: 'leaf', image: 'assets/images/Kosmetik.jpg' },
    { num: '02', title: 'Hygiene', href: 'produkte-hygiene.html', copy: 'Clean-Care und Reinigung', icon: 'shield', image: 'assets/images/Hygiene.webp' },
    { num: '03', title: 'CBD Produkte', href: 'produkte-cbd-produkte.html', copy: 'Oele, Tinkturen, Topicals', icon: 'drop', image: 'assets/images/CDB.jpg' },
    { num: '04', title: 'Kapseln', href: 'produkte-kapseln.html', copy: 'Caps und Supplement-Gebinde', icon: 'capsule', image: 'assets/images/Kapseln.jpg' },
    { num: '05', title: 'Pulver', href: 'produkte-pulver.html', copy: 'Blends, Dosen, Stick Packs', icon: 'lab', image: 'assets/images/pulver.webp' },
    { num: '06', title: 'Aetherische Oele', href: 'produkte-aetherische-oele.html', copy: 'Single Oils und Duftmischungen', icon: 'wave', image: 'assets/images/Ätherische Öle.jpg' },
    { num: '07', title: 'Flavor Drops & Aromen', href: 'produkte-flavor-drops-aromen.html', copy: 'Drop-genaue Aroma-Systeme', icon: 'bolt', image: 'assets/images/Flavour Drops.jpg' },
    { num: '08', title: 'Nikotin', href: 'produkte-nikotin.html', copy: 'TPD-nahe Prozesse und Gebinde', icon: 'lock', image: 'assets/images/Nikotin.jpg' },
    { num: '09', title: 'Chemikalien', href: 'produkte-chemikalien.html', copy: 'Technische Fluids und Konzentrate', icon: 'flask', image: 'assets/images/Chemikalien.jpg' },
    { num: '10', title: 'Propylenglykol & Glycerin', href: 'produkte-propylenglykol-glycerin.html', copy: 'PG/VG, Basen und Gebinde', icon: 'bottle', image: 'assets/images/PG-VG.webp' }
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
          <span class="nav-products-sub">Alle 10 Kategorien</span>
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

      if (cursorDot) {
        link.addEventListener('mouseenter', () => cursorDot.classList.add('hovering'));
        link.addEventListener('mouseleave', () => cursorDot.classList.remove('hovering'));
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
    truck:      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3"/><rect width="7" height="7" x="14" y="10" rx="1"/><circle cx="7.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg>',
    layers:     '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>'
  };

  const servicesMenuItems = [
    { num: '01', title: 'Produktentwicklung',       href: 'leistungen-produktentwicklung.html',    copy: 'Von der Idee zum Produkt',        icon: 'lab',        iconBg: 'radial-gradient(circle at 60% 40%, #008cb4 0%, #041c28 55%, #020e14 100%)' },
    { num: '02', title: 'Lohnabfüllung',             href: 'leistungen-lohnabfuellung.html',        copy: 'Präzise Abfüllung & Produktion', icon: 'droplets',   iconBg: 'radial-gradient(circle at 60% 40%, #0a783c 0%, #051a0e 55%, #020d07 100%)' },
    { num: '03', title: 'Verpackung & Etikettierung',href: 'leistungen-verpackung.html',            copy: 'Design trifft Funktion',         icon: 'box',        iconBg: 'radial-gradient(circle at 60% 40%, #a01e3c 0%, #2a0a12 55%, #120407 100%)' },
    { num: '04', title: 'Qualitätsmanagement',       href: 'leistungen-qualitaet.html',             copy: 'ISO 9001 & HACCP zertifiziert',  icon: 'shield',     iconBg: 'radial-gradient(circle at 60% 40%, #0a32a0 0%, #0a1540 55%, #050a1c 100%)' },
    { num: '05', title: 'In-house Analysen',         href: 'leistungen-analysen.html',              copy: 'Qualität messbar gemacht',       icon: 'microscope', iconBg: 'radial-gradient(circle at 60% 40%, #008cb4 0%, #041c28 55%, #020e14 100%)' },
    { num: '06', title: 'Logistik & Versand',        href: 'leistungen-logistik.html',              copy: 'Pünktlich ans Ziel',             icon: 'truck',      iconBg: 'radial-gradient(circle at 60% 40%, #a0640a 0%, #16100a 55%, #080604 100%)' },
    { num: '07', title: 'Sachets & Pulver',          href: 'pulver-sachets-abfuellen-lassen.html',  copy: 'Talkum, Granulate & Kleinbeutel',icon: 'layers',     iconBg: 'radial-gradient(circle at 60% 40%, #8c32d2 0%, #1e0a3c 55%, #0e0416 100%)' }
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
          <span class="nav-services-sub">7 Services</span>
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

    if (cursorDot) {
      menuLinks.forEach((link) => {
        link.addEventListener('mouseenter', () => cursorDot.classList.add('hovering'));
        link.addEventListener('mouseleave', () => cursorDot.classList.remove('hovering'));
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
        '.product-card-bg, .product-card--cta, .product-card[style], ' +
        '.about-video-card, .about-media-tile, .about-media-note, ' +
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

  /* ---- Service stats card deck (mobile only) ---- */
  (function initServiceStatsDecks() {
    var rows = Array.from(document.querySelectorAll('.service-stats-row'));
    if (!rows.length) return;

    var isMobile = function() { return window.innerWidth <= 900; };
    var deRe = /(germany|deutsch|made in|bayern|\bde\b|roßtal|rosstal)/i;

    rows.forEach(function(row) {
      var cards = Array.from(row.querySelectorAll('.service-stat-box'));
      if (cards.length < 2) return;

      // Tag Germany-themed cards for tricolor flag glow + inject idx counter + icon
      var pad = function(n) { return n < 10 ? '0' + n : String(n); };
      var SVG_NS = 'http://www.w3.org/2000/svg';
      var iconPaths = {
        shield:  '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
        users:   '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
        clock:   '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
        droplet: '<path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>',
        cube:    '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/>',
        chart:   '<line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/>'
      };
      function pickIcon(text) {
        var t = text.toLowerCase();
        if (/germany|deutsch|made in|bayern|\bde\b|roßtal|rosstal|iso|haccp|qualität/.test(t)) return 'shield';
        if (/kunden|projekte|kund|partner|\+/.test(t)) return 'users';
        if (/jahre|stunden|tage|woche|wo\.|min|sek|\bh\b|24h|antwort/.test(t)) return 'clock';
        if (/ml|liter|füllmenge|gebinde|abfüll|flüssig|tropfen/.test(t)) return 'droplet';
        if (/kategorie|bereich|option|produkt|sorte|art/.test(t)) return 'cube';
        return 'chart';
      }

      cards.forEach(function(card, i) {
        var text = card.textContent || '';
        if (deRe.test(text)) {
          card.classList.add('service-stat-box--de');
        }
        if (!card.querySelector('.service-stat-idx')) {
          var idx = document.createElement('span');
          idx.className = 'service-stat-idx';
          idx.textContent = pad(i + 1) + ' / ' + pad(cards.length);
          card.insertBefore(idx, card.firstChild);
        }
        if (!card.querySelector('.service-stat-icon')) {
          var iconName = pickIcon(text);
          var svg = '<svg class="service-stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + iconPaths[iconName] + '</svg>';
          var numEl = card.querySelector('.service-stat-num');
          if (numEl) {
            numEl.insertAdjacentHTML('beforebegin', svg);
          }
        }
      });

      var order = cards.map(function(_, i) { return i; });
      var busy = false;
      var autoTimer = null;

      // Inject footer (dots + hint) — matches index stats deck
      var footer = document.createElement('div');
      footer.className = 'service-stats-deck-footer';
      var dotsWrap = document.createElement('div');
      dotsWrap.className = 'service-stats-dots';
      cards.forEach(function(_, i) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'service-stats-dot';
        b.setAttribute('aria-label', 'Karte ' + (i + 1));
        if (i === 0) b.classList.add('active');
        dotsWrap.appendChild(b);
      });
      var hint = document.createElement('p');
      hint.className = 'service-stats-hint';
      hint.textContent = 'Tippen zum Weiterblättern';
      footer.appendChild(dotsWrap);
      footer.appendChild(hint);
      row.insertAdjacentElement('afterend', footer);

      var dots = Array.from(dotsWrap.querySelectorAll('.service-stats-dot'));

      function syncDots() {
        dots.forEach(function(d, i) { d.classList.toggle('active', i === order[0]); });
      }

      function applyPositions() {
        order.forEach(function(cardIdx, pos) {
          cards[cardIdx].dataset.pos = pos;
        });
        syncDots();
      }

      function advance() {
        if (busy || !isMobile()) return;
        busy = true;
        var frontIdx = order[0];
        var frontCard = cards[frontIdx];
        frontCard.classList.add('is-exiting');
        order.slice(1).forEach(function(cardIdx, newPos) {
          cards[cardIdx].dataset.pos = newPos;
        });
        dots.forEach(function(d, i) { d.classList.toggle('active', i === order[1]); });
        setTimeout(function() {
          frontCard.style.transition = 'none';
          frontCard.classList.remove('is-exiting');
          frontCard.dataset.pos = cards.length - 1;
          requestAnimationFrame(function() {
            requestAnimationFrame(function() {
              frontCard.style.transition = '';
              busy = false;
            });
          });
          order = order.slice(1).concat(order[0]);
        }, 290);
      }

      function startTimer() {
        if (autoTimer) clearInterval(autoTimer);
        if (isMobile()) autoTimer = setInterval(advance, 2800);
      }

      function stopTimer() {
        if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
      }

      // Dot click → bring target to front (instant reorder)
      dots.forEach(function(dot, i) {
        dot.addEventListener('click', function(e) {
          e.stopPropagation();
          if (!isMobile() || i === order[0]) return;
          order = [i].concat(order.filter(function(x) { return x !== i; }));
          applyPositions();
          startTimer();
        });
      });

      applyPositions();
      row.addEventListener('click', function() {
        if (isMobile()) { advance(); startTimer(); }
      });
      startTimer();

      window.addEventListener('resize', function() {
        applyPositions();
        if (isMobile()) startTimer(); else stopTimer();
      });
    });
  })();

  /* ---- Services carousel dots (mobile only) ---- */
  (function initServicesDots() {
    var grid = document.querySelector('.services-grid');
    if (!grid) return;
    var cards = Array.from(grid.querySelectorAll('.service-card'));
    if (cards.length < 2) return;

    var dotsWrap = document.createElement('div');
    dotsWrap.className = 'services-dots';
    cards.forEach(function(_, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'services-dot';
      b.setAttribute('aria-label', 'Karte ' + (i + 1));
      dotsWrap.appendChild(b);
    });
    grid.insertAdjacentElement('afterend', dotsWrap);

    var dots = Array.from(dotsWrap.querySelectorAll('.services-dot'));
    dots[0].classList.add('active');

    dots.forEach(function(dot, i) {
      dot.addEventListener('click', function() {
        var card = cards[i];
        var left = card.offsetLeft - (grid.clientWidth - card.clientWidth) / 2;
        grid.scrollTo({ left: left, behavior: 'smooth' });
      });
    });

    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.intersectionRatio >= 0.6) {
            var idx = cards.indexOf(entry.target);
            if (idx >= 0) {
              dots.forEach(function(d, i) { d.classList.toggle('active', i === idx); });
            }
          }
        });
      }, { root: grid, threshold: [0.6, 0.85] });
      cards.forEach(function(c) { io.observe(c); });
    }
  })();

  /* ---- Stats card deck ---- */
  (function initStatsDeck() {
    var deck = document.getElementById('statsDeck');
    if (!deck) return;

    var cards = Array.from(deck.querySelectorAll('.stat-card'));
    var dots  = Array.from(document.querySelectorAll('.deck-dot[data-goto]'));
    if (!cards.length) return;

    var order = cards.map(function(_, i) { return i; });
    var busy  = false;

    function applyPositions() {
      order.forEach(function(cardIdx, pos) {
        cards[cardIdx].dataset.pos = pos;
      });
      dots.forEach(function(dot, i) {
        dot.classList.toggle('active', i === order[0]);
      });
    }

    function advanceDeck() {
      if (busy) return;
      busy = true;

      var frontIdx  = order[0];
      var frontCard = cards[frontIdx];

      frontCard.classList.add('is-exiting');

      order.slice(1).forEach(function(cardIdx, newPos) {
        cards[cardIdx].dataset.pos = newPos;
      });
      dots.forEach(function(dot, i) {
        dot.classList.toggle('active', i === order[1]);
      });

      setTimeout(function() {
        frontCard.style.transition = 'none';
        frontCard.classList.remove('is-exiting');
        frontCard.dataset.pos = cards.length - 1;
        requestAnimationFrame(function() {
          requestAnimationFrame(function() {
            frontCard.style.transition = '';
            busy = false;
          });
        });
        order = order.slice(1).concat(order[0]);
      }, 290);
    }

    applyPositions();

    deck.addEventListener('click', function() {
      advanceDeck();
      resetTimer();
    });

    deck.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        advanceDeck();
        resetTimer();
      }
    });

    dots.forEach(function(dot) {
      dot.addEventListener('click', function(e) {
        e.stopPropagation();
        var target = parseInt(dot.dataset.goto, 10);
        if (target === order[0]) return;
        order = [target].concat(order.filter(function(i) { return i !== target; }));
        applyPositions();
        resetTimer();
      });
    });

    var autoTimer = setInterval(advanceDeck, 2200);
    function resetTimer() {
      clearInterval(autoTimer);
      autoTimer = setInterval(advanceDeck, 2200);
    }
  })();

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

  /* ---- Contact concern picker ---- */
  (function initContactConcernPicker() {
    const select = document.querySelector('#interest');
    if (!select) return;

    const chipItems = [
      ['produktentwicklung', 'Produktentwicklung'],
      ['lohnabfuellung', 'Lohnabf&uuml;llung'],
      ['verpackung', 'Verpackung'],
      ['qualitaet', 'Qualit&auml;t'],
      ['analyse', 'Analysen'],
      ['logistik', 'Logistik'],
      ['pulver', 'Sachets &amp; Pulver']
    ];

    if (!document.querySelector('.contact-form-chips')) {
      const chips = document.createElement('div');
      chips.className = 'contact-form-chips';
      chips.setAttribute('aria-label', 'Anliegen auswaehlen');
      chips.innerHTML = chipItems.map(([value, label]) => (
        `<button class="contact-form-chip" type="button" data-interest="${value}">${label}</button>`
      )).join('');
      select.insertAdjacentElement('beforebegin', chips);
    }

    const cards = Array.from(document.querySelectorAll('.contact-concern-card[data-interest], .contact-form-chip[data-interest]'));
    if (!cards.length) return;

    function setActive(value) {
      cards.forEach((card) => {
        card.classList.toggle('is-active', card.dataset.interest === value);
      });
    }

    cards.forEach((card) => {
      card.addEventListener('click', () => {
        const value = card.dataset.interest || '';
        select.value = value;
        select.dispatchEvent(new Event('change', { bubbles: true }));
        setActive(value);
        if (card.classList.contains('contact-concern-card')) {
          const target = select.closest('.contact-form') || select;
          target.scrollIntoView({ behavior: 'smooth', block: 'center' });
          const firstField = target.querySelector('input, textarea, button, select:not([aria-hidden="true"])');
          if (firstField) setTimeout(() => firstField.focus({ preventScroll: true }), 450);
        }
      });
    });

    select.addEventListener('change', () => setActive(select.value));
    setActive(select.value);
  })();

  /* ---- Contact page helpers ---- */
  (function initContactPageHelpers() {
    document.querySelectorAll('[data-copy]').forEach((button) => {
      button.addEventListener('click', async () => {
        const value = button.getAttribute('data-copy') || '';
        const label = button.querySelector('.contact-action-arrow');
        const original = label ? label.innerHTML : '';

        try {
          if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(value);
          } else {
            const temp = document.createElement('textarea');
            temp.value = value;
            temp.setAttribute('readonly', '');
            temp.style.position = 'fixed';
            temp.style.opacity = '0';
            document.body.appendChild(temp);
            temp.select();
            document.execCommand('copy');
            temp.remove();
          }
          if (label) {
            label.textContent = 'OK';
            setTimeout(() => { label.innerHTML = original; }, 1400);
          }
        } catch (_) {
          window.location.href = `mailto:${value}`;
        }
      });
    });

    document.querySelectorAll('form.contact-form-el').forEach((form) => {
      const fields = Array.from(form.querySelectorAll('input[required], textarea[required], select'));
      const panel = form.closest('.contact-panel--form');
      const progress = panel ? panel.querySelector('.contact-form-progress span') : null;
      const message = form.querySelector('#message');

      if (message && !form.querySelector('.contact-form-char-count')) {
        const count = document.createElement('div');
        count.className = 'contact-form-char-count';
        count.textContent = '0 Zeichen';
        message.insertAdjacentElement('afterend', count);

        message.addEventListener('input', () => {
          count.textContent = `${message.value.length} Zeichen`;
        });
      }

      function updateProgress() {
        if (!panel || !progress || !fields.length) return;
        const completed = fields.filter((field) => {
          if (field.matches('[aria-hidden="true"]') && field.value) return true;
          return (field.value || '').trim().length > 0;
        }).length;
        const percent = Math.round((completed / fields.length) * 100);
        progress.textContent = `${percent}%`;
        panel.style.setProperty('--form-progress', `${percent}%`);
      }

      fields.forEach((field) => {
        field.addEventListener('input', updateProgress);
        field.addEventListener('change', updateProgress);
      });
      form.addEventListener('reset', () => setTimeout(updateProgress, 0));
      updateProgress();
    });
  })();

  /* ---- About media parallax fallback (used if ScrollTrigger is unavailable) ---- */
  (function initAboutMediaFallback() {
    if (typeof ScrollTrigger !== 'undefined') return;

    const media = Array.from(document.querySelectorAll('.about-video-el, .about-media-tile img'));
    if (!media.length) return;

    let raf = 0;
    const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
    const lerp = (start, end, progress) => start + ((end - start) * progress);

    function update() {
      raf = 0;
      const vh = window.innerHeight || document.documentElement.clientHeight || 800;

      media.forEach((item, index) => {
        const frame = item.closest('.about-video-card, .about-media-tile') || item;
        const rect = frame.getBoundingClientRect();
        const progress = clamp((vh - rect.top) / (vh + rect.height), 0, 1);
        const travel = index === 0 ? 54 : 32;
        const y = lerp(-travel, travel, progress);
        const scale = lerp(index === 0 ? 1.075 : 1.065, index === 0 ? 1.035 : 1.03, progress);
        item.style.transform = `translate3d(0, ${y}px, 0) scale(${scale})`;
      });
    }

    function schedule() {
      if (!raf) raf = requestAnimationFrame(update);
    }

    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
  })();

  /* ---- Service cards — whole card clickable ---- */
  document.querySelectorAll('.service-card').forEach((card) => {
    const link = card.querySelector('.service-link');
    if (!link) return;
    card.style.cursor = 'pointer';
    card.addEventListener('click', (e) => {
      if (!e.target.closest('a')) {
        window.location.href = link.getAttribute('href');
      }
    });
  });

  /* ---- Nav morph: full pill ↔ small Menü pill on scroll ---- */
  (function initNavMorph() {
    var navEl = document.getElementById('nav');
    if (!navEl) return;

    var isMobile = function () { return window.innerWidth <= 900; };

    // Hotzone — desktop hover trigger
    var hotzone = document.createElement('div');
    hotzone.id        = 'nav-hotzone';
    hotzone.className = 'nav-hotzone';
    hotzone.setAttribute('aria-hidden', 'true');
    document.body.appendChild(hotzone);

    // Menü indicator — injected inside nav, visible in morphed state
    var indicator = document.createElement('div');
    indicator.className = 'nav-menu-indicator';
    indicator.setAttribute('role', 'button');
    indicator.setAttribute('tabindex', '0');
    indicator.setAttribute('aria-label', 'Navigation öffnen');
    indicator.innerHTML =
      '<div class="nav-menu-indicator-lines"><span></span><span></span><span></span></div>' +
      '<span class="nav-menu-indicator-label">Menü</span>';
    navEl.appendChild(indicator);

    var isScrolled = window.scrollY > 40;
    var isMorphed  = false;
    var closeTimer = null;
    var autoTimer  = null;

    function cancelTimers() {
      if (closeTimer) { clearTimeout(closeTimer); closeTimer = null; }
      if (autoTimer)  { clearTimeout(autoTimer);  autoTimer  = null; }
    }

    /* Shrink to small pill */
    function morphSmall() {
      cancelTimers();
      isMorphed = true;
      navEl.classList.add('nav-morphed');
      hotzone.style.pointerEvents = 'all';
    }

    /* Expand back to full nav */
    function morphFull() {
      cancelTimers();
      isMorphed = false;
      navEl.classList.remove('nav-morphed');
      hotzone.style.pointerEvents = 'none';

      // Mobile/touch: auto-shrink after 3 s (skip if hamburger overlay open)
      if (isMobile()) {
        autoTimer = setTimeout(function () {
          if (isScrolled && !navEl.classList.contains('menu-open')) morphSmall();
        }, 3000);
      }
    }

    function queueMorphSmall() {
      if (closeTimer) clearTimeout(closeTimer);
      closeTimer = setTimeout(morphSmall, 220);
    }

    function cancelClose() {
      if (closeTimer) { clearTimeout(closeTimer); closeTimer = null; }
    }

    /* Fully reset when back at top of page */
    function resetToNormal() {
      cancelTimers();
      isMorphed = false;
      navEl.classList.remove('nav-morphed');
      hotzone.style.pointerEvents = 'none';
    }

    // Initial state
    if (isScrolled) morphSmall();

    // Scroll sync
    window.addEventListener('scroll', function () {
      var nowScrolled = window.scrollY > 40;
      if (nowScrolled === isScrolled) return;
      isScrolled = nowScrolled;
      if (nowScrolled) { morphSmall(); } else { resetToNormal(); }
    }, { passive: true });

    // Indicator tap/click → expand
    indicator.addEventListener('click', function () {
      if (isScrolled) morphFull();
    });
    indicator.addEventListener('keydown', function (e) {
      if ((e.key === 'Enter' || e.key === ' ') && isScrolled) { e.preventDefault(); morphFull(); }
    });

    // Desktop: hover hotzone → expand
    hotzone.addEventListener('mouseenter', function () {
      if (isScrolled && !isMobile()) morphFull();
    });
    hotzone.addEventListener('mouseleave', function () {
      if (isScrolled && !isMobile()) queueMorphSmall();
    });

    // Desktop: hover nav → expand if morphed; keep expanded while inside
    navEl.addEventListener('mouseenter', function () {
      if (!isMobile()) {
        cancelClose();
        if (isScrolled && isMorphed) morphFull();
      }
    });
    navEl.addEventListener('mouseleave', function () {
      if (isScrolled && !isMobile()) queueMorphSmall();
    });

    // Desktop: hover indicator → expand
    indicator.addEventListener('mouseenter', function () {
      if (isScrolled && !isMobile()) morphFull();
    });

    // Mobile: tap anywhere on nav resets 3 s auto-shrink timer
    navEl.addEventListener('touchstart', function () {
      if (isScrolled && !isMorphed && isMobile()) {
        cancelTimers();
        autoTimer = setTimeout(function () {
          if (isScrolled && !navEl.classList.contains('menu-open')) morphSmall();
        }, 3000);
      }
    }, { passive: true });

    // Resize guard
    window.addEventListener('resize', function () {
      if (!isScrolled) resetToNormal();
    });
  })();

  /* ---- Service icon theme colours ---- */
  const serviceIconGradients = {
    '01': 'radial-gradient(circle at 60% 40%, #008cb4 0%, #041c28 55%, #020e14 100%)',
    '02': 'radial-gradient(circle at 60% 40%, #0a783c 0%, #051a0e 55%, #020d07 100%)',
    '03': 'radial-gradient(circle at 60% 40%, #a01e3c 0%, #2a0a12 55%, #120407 100%)',
    '04': 'radial-gradient(circle at 60% 40%, #0a32a0 0%, #0a1540 55%, #050a1c 100%)',
    '05': 'radial-gradient(circle at 60% 40%, #008cb4 0%, #041c28 55%, #020e14 100%)',
    '06': 'radial-gradient(circle at 60% 40%, #a0640a 0%, #16100a 55%, #080604 100%)',
  };
  const serviceGlowColors = {
    '01': 'rgba(0,140,180,0.18)',
    '02': 'rgba(10,120,60,0.18)',
    '03': 'rgba(160,30,60,0.18)',
    '04': 'rgba(10,50,160,0.18)',
    '05': 'rgba(0,140,180,0.18)',
    '06': 'rgba(160,100,10,0.18)',
  };

  // Sub-page "other services" nav cards
  document.querySelectorAll('.other-service-card').forEach((card) => {
    const num  = card.querySelector('.other-service-card-num')?.textContent.trim();
    const icon = card.querySelector('.other-service-card-icon');
    const bg   = serviceIconGradients[num];
    const glow = serviceGlowColors[num];
    if (icon && bg) {
      icon.style.background  = bg;
      icon.style.color       = '#fff';
      icon.style.borderColor = 'transparent';
    }
    if (card && glow) {
      card.style.boxShadow  = `0 4px 28px ${glow}, 0 1px 4px rgba(0,0,0,0.06)`;
      card.style.borderColor = glow.replace('0.18', '0.30');
    }
  });

})();
