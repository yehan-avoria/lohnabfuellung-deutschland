/* ============================================================
   GSAP ANIMATIONS - Avoria GmbH
   ScrollTrigger-based reveal animations
   ============================================================ */

(function () {
  // Only run if GSAP is loaded
  if (typeof gsap === 'undefined') return;

  // Register plugins
  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  // ---- Hero entrance animation ----
  function initHero() {
    const heroLabel   = document.querySelector('.hero-label');
    const heroTitle   = document.querySelector('.hero-title');
    const heroPara    = document.querySelector('.hero-para');
    const heroActions = document.querySelector('.hero-actions');
    const heroScroll  = document.querySelector('.hero-scroll');

    const tl = gsap.timeline({ delay: 0.2 });

    if (heroLabel) {
      tl.to(heroLabel, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' });
    }

    if (heroTitle) {
      const words = heroTitle.querySelectorAll('.word-inner');
      if (words.length) {
        tl.to(words, {
          y: 0,
          duration: 1,
          stagger: 0.08,
          ease: 'power4.out',
        }, '-=0.3');
        tl.to(heroTitle, { opacity: 1, duration: 0.01 }, 0.3);
      } else {
        tl.to(heroTitle, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' }, '-=0.3');
      }
    }

    if (heroPara) {
      tl.to(heroPara, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, '-=0.4');
    }

    if (heroActions) {
      tl.to(heroActions, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, '-=0.4');
    }

    if (heroScroll) {
      tl.to(heroScroll, { opacity: 1, duration: 0.5, ease: 'power2.out' }, '-=0.2');
    }
  }

  // ---- Stats counter ----
  function initCounters() {
    const counters = document.querySelectorAll('.counter');
    counters.forEach((el) => {
      const target = parseFloat(el.dataset.target || el.textContent.replace(/[^0-9.]/g, ''));
      const isDecimal = String(target).includes('.');
      const suffix = el.dataset.suffix || '';

      if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.create({
          trigger: el,
          start: 'top 85%',
          once: true,
          onEnter: () => {
            gsap.fromTo(
              { val: 0 },
              { val: target, duration: 2, ease: 'power2.out',
                onUpdate: function () {
                  el.textContent = (isDecimal ? this.targets()[0].val.toFixed(1) : Math.round(this.targets()[0].val)) + suffix;
                }
              }
            );
          },
        });
      } else {
        el.textContent = target + suffix;
      }
    });
  }

  // ---- Generic scroll reveals ----
  function initReveal() {
    if (typeof ScrollTrigger === 'undefined') {
      document.querySelectorAll('[data-animate]').forEach(el => {
        el.classList.add('in-view');
      });
      return;
    }

    // Fade-up elements
    gsap.utils.toArray('[data-animate]').forEach((el, i) => {
      const delay = parseFloat(el.dataset.delay || 0);
      gsap.fromTo(el,
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0,
          duration: 0.85,
          ease: 'power3.out',
          delay,
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            once: true,
          },
        }
      );
    });

    // Stagger children
    gsap.utils.toArray('[data-stagger]').forEach((parent) => {
      const children = parent.querySelectorAll('[data-stagger-item]');
      if (!children.length) return;

      gsap.fromTo(children,
        { opacity: 0, y: 35 },
        {
          opacity: 1, y: 0,
          duration: 0.75,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: parent,
            start: 'top 85%',
            once: true,
          },
        }
      );
    });

    // Horizontal reveals
    gsap.utils.toArray('[data-animate-left]').forEach((el) => {
      gsap.fromTo(el,
        { opacity: 0, x: -40 },
        {
          opacity: 1, x: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        }
      );
    });

    gsap.utils.toArray('[data-animate-right]').forEach((el) => {
      gsap.fromTo(el,
        { opacity: 0, x: 40 },
        {
          opacity: 1, x: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        }
      );
    });

    // Scale reveals
    gsap.utils.toArray('[data-animate-scale]').forEach((el) => {
      gsap.fromTo(el,
        { opacity: 0, scale: 0.88 },
        {
          opacity: 1, scale: 1,
          duration: 0.85,
          ease: 'back.out(1.4)',
          scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        }
      );
    });
  }

  // ---- Parallax elements ----
  function initParallax() {
    if (typeof ScrollTrigger === 'undefined') return;

    gsap.utils.toArray('[data-parallax]').forEach((el) => {
      const speed = parseFloat(el.dataset.parallax || 0.3);
      gsap.to(el, {
        y: () => -window.innerHeight * speed,
        ease: 'none',
        scrollTrigger: {
          trigger: el.parentElement,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    });
  }

  // ---- Section heading split text effect ----
  function initHeadingSplits() {
    if (typeof ScrollTrigger === 'undefined') return;

    document.querySelectorAll('.split-title').forEach((el) => {
      const text = el.textContent;
      el.innerHTML = text.split('').map((char) =>
        char === ' '
          ? '<span style="display:inline-block;width:0.3em;"> </span>'
          : `<span style="display:inline-block;overflow:hidden;"><span style="display:inline-block;transform:translateY(110%)">${char}</span></span>`
      ).join('');

      const chars = el.querySelectorAll('span span');

      gsap.to(chars, {
        y: 0,
        duration: 0.75,
        stagger: 0.025,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      });
    });
  }

  // ---- Card 3D tilt effect ----
  function initTilt() {
    document.querySelectorAll('[data-tilt]').forEach((el) => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width  / 2;
        const cy = rect.top  + rect.height / 2;
        const dx = (e.clientX - cx) / (rect.width  / 2);
        const dy = (e.clientY - cy) / (rect.height / 2);
        const intensity = parseFloat(el.dataset.tilt || 6);

        gsap.to(el, {
          rotationX: -dy * intensity,
          rotationY:  dx * intensity,
          transformPerspective: 800,
          duration: 0.3,
          ease: 'power2.out',
        });
      });

      el.addEventListener('mouseleave', () => {
        gsap.to(el, {
          rotationX: 0,
          rotationY: 0,
          duration: 0.5,
          ease: 'power3.out',
        });
      });
    });
  }

  // ---- FAQ accordion ----
  function initFAQ() {
    document.querySelectorAll('.faq-question').forEach((btn) => {
      btn.addEventListener('click', () => {
        const item   = btn.closest('.faq-item');
        const answer = item.querySelector('.faq-answer');
        const isOpen = item.classList.contains('open');

        // Close all
        document.querySelectorAll('.faq-item.open').forEach((o) => {
          o.classList.remove('open');
          gsap.to(o.querySelector('.faq-answer'), { maxHeight: 0, duration: 0.4, ease: 'power2.inOut' });
        });

        if (!isOpen) {
          item.classList.add('open');
          gsap.fromTo(answer,
            { maxHeight: 0 },
            { maxHeight: answer.scrollHeight + 40, duration: 0.5, ease: 'power2.out' }
          );
        }
      });
    });
  }

  // ---- Smooth scroll for anchor links ----
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener('click', (e) => {
        const id = a.getAttribute('href');
        if (id === '#') return;
        const target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        gsap.to(window, {
          duration: 1.2,
          scrollTo: { y: target, offsetY: 80 },
          ease: 'power3.inOut',
        });
      });
    });
  }

  // ---- CTA water-fill reveal ----
  function initCtaFill() {
    if (typeof ScrollTrigger === 'undefined') {
      document.querySelectorAll('.cta-section:not(.cta-section--card)').forEach(el => {
        el.classList.add('fill-active');
      });
      return;
    }

    gsap.utils.toArray('.cta-section:not(.cta-section--card)').forEach((section) => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top 82%',
        once: true,
        onEnter: () => section.classList.add('fill-active'),
      });
    });
  }

  // ---- Init all ----
  document.addEventListener('DOMContentLoaded', () => {
    initHero();
    initCounters();
    initReveal();
    initParallax();
    initHeadingSplits();
    initTilt();
    initFAQ();
    initCtaFill();
    // initSmoothScroll(); // only if ScrollTo plugin loaded
  });
})();
