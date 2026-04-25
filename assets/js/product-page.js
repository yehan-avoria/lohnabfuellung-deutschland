(function () {
  "use strict";

  const config = window.productPageConfig;
  const mount = document.getElementById("productPage");

  if (!config || !mount) return;

  const ICONS = {
    shield: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>',
    drop: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3c3.5 4.2 7 8.3 7 12a7 7 0 0 1-14 0c0-3.7 3.5-7.8 7-12z"></path></svg>',
    flask: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 3h6"></path><path d="M10 3v6l-5.5 9.2A2 2 0 0 0 6.2 21h11.6a2 2 0 0 0 1.7-2.8L14 9V3"></path><path d="M8.5 14h7"></path></svg>',
    package: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 7.5 12 3l9 4.5-9 4.5-9-4.5z"></path><path d="M3 7.5V16.5L12 21l9-4.5V7.5"></path><path d="M12 12v9"></path></svg>',
    lab: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 2v7l-5.5 9.2A2 2 0 0 0 6.2 21h11.6a2 2 0 0 0 1.7-2.8L14 9V2"></path><path d="M8 14h8"></path></svg>',
    check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m20 6-11 11-5-5"></path></svg>',
    leaf: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 20A7 7 0 0 1 4 13C4 7 9 4 20 4c0 11-3 16-9 16z"></path><path d="M12 12 4 20"></path></svg>',
    layers: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 9 5-9 5-9-5 9-5z"></path><path d="m3 13 9 5 9-5"></path><path d="m3 18 9 5 9-5"></path></svg>',
    bolt: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z"></path></svg>',
    capsule: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 14 4.7 8.7a4.2 4.2 0 0 1 0-5.9 4.2 4.2 0 0 1 5.9 0L16 8.2"></path><path d="m14 10 5.3 5.3a4.2 4.2 0 0 1 0 5.9 4.2 4.2 0 0 1-5.9 0L8 16"></path><path d="m7 7 10 10"></path></svg>',
    chart: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 3v18h18"></path><path d="m7 14 4-4 3 3 5-7"></path></svg>',
    target: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8"></circle><circle cx="12" cy="12" r="3"></circle><path d="M12 2v3"></path><path d="M12 19v3"></path><path d="M2 12h3"></path><path d="M19 12h3"></path></svg>',
    lock: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="11" width="16" height="10" rx="2"></rect><path d="M8 11V8a4 4 0 1 1 8 0v3"></path></svg>',
    document: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><path d="M14 2v6h6"></path><path d="M8 13h8"></path><path d="M8 17h6"></path></svg>',
    bottle: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 2h4"></path><path d="M10 6h4"></path><path d="M9 6v4L5.6 18a2 2 0 0 0 1.8 3h9.2a2 2 0 0 0 1.8-3L15 10V6"></path></svg>',
    gear: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3h.1a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5h.1a1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8v.1a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"></path></svg>',
    wave: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12c2.5 0 2.5-4 5-4s2.5 4 5 4 2.5-4 5-4 2.5 4 5 4"></path><path d="M2 18c2.5 0 2.5-4 5-4s2.5 4 5 4 2.5-4 5-4 2.5 4 5 4"></path></svg>',
    star: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.2 6.4 20.2l1.1-6.2L3 9.6l6.2-.9L12 3z"></path></svg>'
  };

  const TICKER_ITEMS = [
    "Lohnabf&uuml;llung",
    "Verpackung &amp; Etikettierung",
    "Qualit&auml;tsmanagement",
    "In-house Analysen",
    "Logistik &amp; Versand",
    "Produktentwicklung"
  ];

  const CATEGORY_LINKS = [
    {
      id: "hygiene-kosmetik",
      num: "01",
      title: "Hygiene &amp; Kosmetik",
      file: "produkte-hygiene-kosmetik.html",
      copy: "Pflege, Reinigung und markenreife Kosmetikprodukte.",
      icon: "leaf",
      image: "assets/images/Kosmetik.jpg",
      glow: "rgba(196, 122, 138, 0.34)"
    },
    {
      id: "cbd-produkte",
      num: "02",
      title: "CBD Produkte",
      file: "produkte-cbd-produkte.html",
      copy: "Kontrollierte Abf&uuml;llung f&uuml;r &Ouml;le, Tinkturen und Topicals.",
      icon: "drop",
      image: "assets/images/CDB.jpg",
      glow: "rgba(90, 154, 112, 0.34)"
    },
    {
      id: "aetherische-oele",
      num: "03",
      title: "&Auml;therische &Ouml;le",
      file: "produkte-aetherische-oele.html",
      copy: "Single Oils, Duftmischungen und saubere Blend-Prozesse.",
      icon: "wave",
      image: "assets/images/Ätherische Öle.jpg",
      glow: "rgba(112, 96, 176, 0.34)"
    },
    {
      id: "kapseln-pulver",
      num: "04",
      title: "Kapseln &amp; Pulver",
      file: "produkte-kapseln-pulver.html",
      copy: "F&uuml;llung, Mischung und Verpackung f&uuml;r Supplements.",
      icon: "capsule",
      image: "assets/images/Kapseln.jpg",
      glow: "rgba(176, 128, 48, 0.34)"
    },
    {
      id: "flavor-drops-aromen",
      num: "05",
      title: "Flavor Drops &amp; Aromen",
      file: "produkte-flavor-drops-aromen.html",
      copy: "Tropfengenau dosierte Aroma- und Flavor-Systeme.",
      icon: "bolt",
      image: "assets/images/Flavour Drops.jpg",
      glow: "rgba(208, 120, 48, 0.34)"
    },
    {
      id: "nikotin",
      num: "06",
      title: "Nikotin",
      file: "produkte-nikotin.html",
      copy: "TPD-nahe Prozesse, sichere Gebinde und dokumentierte Chargen.",
      icon: "lock",
      image: "assets/images/Nikotin.jpg",
      glow: "rgba(64, 112, 160, 0.34)"
    },
    {
      id: "chemikalien",
      num: "07",
      title: "Chemikalien",
      file: "produkte-chemikalien.html",
      copy: "Technische Fl&uuml;ssigkeiten und industrielle Konzentrate.",
      icon: "flask",
      image: "assets/images/Chemikalien.jpg",
      glow: "rgba(80, 96, 112, 0.34)"
    }
  ];

  const icon = (name) => ICONS[name] || ICONS.check;
  const sectionHeader = (eyebrow, title, desc) => `
    <div class="section-header" data-product-reveal>
      <p class="eyebrow">${eyebrow}</p>
      <h2 class="section-title">${title}</h2>
      <p class="section-desc">${desc}</p>
    </div>
  `;

  function applyTheme() {
    const root = document.documentElement;
    const theme = config.theme || {};

    if (theme.accent) root.style.setProperty("--ph-accent", theme.accent);
    if (theme.accentDark) root.style.setProperty("--ph-accent-dark", theme.accentDark);
    if (theme.accentSoft) root.style.setProperty("--ph-accent-soft", theme.accentSoft);
    if (theme.accentFade) root.style.setProperty("--ph-accent-fade", theme.accentFade);
    if (theme.gradient) root.style.setProperty("--ph-gradient", theme.gradient);
    if (theme.gradientSoft) root.style.setProperty("--ph-gradient-soft", theme.gradientSoft);
  }

  function renderHero() {
    const hero = config.hero;
    const visual = config.visual;

    return `
      <section class="ph-hero">
        <div class="ph-hero-bg">
          <div class="ph-grid"></div>
          <div class="ph-orb ph-orb-1"></div>
          <div class="ph-orb ph-orb-2"></div>
          <div class="ph-orb ph-orb-3"></div>
        </div>
        <div class="ph-bg-num">${config.number}</div>
        <div class="container ph-hero-inner">
          <div class="ph-copy" data-product-reveal>
            <a href="produkte.html" class="ph-hero-back-link">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5"></path><path d="M12 19l-7-7 7-7"></path></svg>
              <span>Zur&uuml;ck zur Produkt&uuml;bersicht</span>
            </a>
            <h1 class="ph-hero-title">${hero.title}</h1>
            <p class="ph-hero-desc">${hero.description}</p>
            <div class="ph-spec-pills">
              ${hero.pills.map((item) => `<span class="ph-spec-pill">${item}</span>`).join("")}
            </div>
            <div class="ph-hero-ctas">
              <a href="${hero.primaryCta.href}" class="btn btn-light btn-lg">${hero.primaryCta.label}</a>
              <a href="${hero.secondaryCta.href}" class="btn btn-ghost-light btn-lg">${hero.secondaryCta.label}</a>
            </div>
          </div>
          <div class="ph-visual" data-product-reveal>
            <div class="ph-stage" id="productHeroStage">
              <div class="ph-3d-card" id="ph3d" data-tilt>
                <div class="ph-card-image-wrap">
                  <img src="${visual.image}" alt="${visual.alt}" class="ph-card-image" loading="eager">
                </div>
                <div class="ph-card-body">
                  <span class="ph-card-label">${visual.label}</span>
                  <div class="ph-card-name">${visual.name}</div>
                </div>
                <div class="ph-card-shine"></div>
              </div>
              ${visual.badges.map((item, index) => `
                <div class="ph-badge ph-badge-${index + 1}">
                  <span class="ph-badge-icon">${icon(item.icon)}</span>
                  <span>${item.text}</span>
                </div>
              `).join("")}
              ${visual.chips.map((item, index) => `
                <div class="ph-orbit-chip ph-orbit-chip-${index + 1}">${item}</div>
              `).join("")}
            </div>
          </div>
        </div>
        <div class="ph-breadcrumb">
          <div class="container ph-breadcrumb-inner">
            <a href="index.html">Start</a>
            <span>/</span>
            <a href="produkte.html">Produkte</a>
            <span>/</span>
            <span>${hero.eyebrow}</span>
          </div>
        </div>
      </section>
    `;
  }

  function renderTicker() {
    const items = TICKER_ITEMS.concat(TICKER_ITEMS);
    return `
      <div class="marquee-section" aria-label="Leistungsslider">
        <div class="marquee-track">
          ${items.map((item) => `
            <div class="marquee-item">
              <span class="dot"></span>
              <span>${item}</span>
            </div>
          `).join("")}
        </div>
      </div>
    `;
  }

  function renderMetrics() {
    return `
      <section class="ph-section">
        <div class="container">
          <div class="ph-metric-grid">
            ${config.metrics.map((item) => `
              <article class="ph-metric-card ph-panel-tilt" data-product-reveal data-tilt>
                <span class="ph-metric-icon">${icon(item.icon)}</span>
                <strong class="ph-metric-value">${item.value}</strong>
                <p class="ph-metric-label">${item.label}</p>
              </article>
            `).join("")}
          </div>
        </div>
      </section>
    `;
  }

  function renderFeatures() {
    const section = config.features;
    return `
      <section class="ph-section ph-section--soft">
        <div class="container">
          ${sectionHeader(section.eyebrow, section.title, section.description)}
          <div class="ph-features-grid">
            ${section.items.map((item) => `
              <article class="ph-feature-card ph-panel-tilt" data-product-reveal data-tilt>
                <span class="ph-feature-icon">${icon(item.icon)}</span>
                <h3 class="ph-feature-title">${item.title}</h3>
                <p class="ph-feature-desc">${item.description}</p>
              </article>
            `).join("")}
          </div>
        </div>
      </section>
    `;
  }

  function renderSpecs() {
    const section = config.specs;
    return `
      <section class="ph-section ph-section--white">
        <div class="container">
          ${sectionHeader(section.eyebrow, section.title, section.description)}
          <div class="ph-specs-layout">
            <article class="ph-spec-panel ph-panel-tilt" data-product-reveal data-tilt>
              <p class="ph-spec-kicker">${section.kicker}</p>
              <div class="ph-spec-rows">
                ${section.rows.map((row) => `
                  <div class="ph-spec-row">
                    <span class="ph-spec-key">${row.label}</span>
                    <span class="ph-spec-val">${row.value}</span>
                  </div>
                `).join("")}
              </div>
              <div class="ph-spec-chip-list">
                ${section.packages.map((item) => `
                  <span class="ph-spec-chip">
                    <span class="ph-spec-chip-icon">${icon(item.icon)}</span>
                    <span>${item.text}</span>
                  </span>
                `).join("")}
              </div>
            </article>
            <article class="ph-spec-visual ph-panel-tilt" data-product-reveal data-tilt>
              <img src="${section.visual.image}" alt="${section.visual.alt}" loading="lazy">
              <div class="ph-spec-visual-overlay">
                <h3 class="ph-spec-visual-title">${section.visual.title}</h3>
                <p class="ph-spec-visual-copy">${section.visual.copy}</p>
                <div class="ph-callout-list">
                  ${section.visual.callouts.map((item) => `<span class="ph-callout">${item}</span>`).join("")}
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>
    `;
  }

  function renderApplications() {
    const section = config.applications;
    return `
      <section class="ph-section">
        <div class="container">
          ${sectionHeader(section.eyebrow, section.title, section.description)}
          <div class="ph-app-grid">
            ${section.items.map((item, index) => `
              <article class="ph-application-card ph-panel-tilt" data-product-reveal data-tilt>
                <span class="ph-application-index">${String(index + 1).padStart(2, "0")}</span>
                <h3 class="ph-application-title">${item.title}</h3>
                <p class="ph-application-copy">${item.copy}</p>
              </article>
            `).join("")}
          </div>
        </div>
      </section>
    `;
  }

  function renderProcess() {
    const section = config.process;
    return `
      <section class="ph-section ph-section--soft">
        <div class="container">
          ${sectionHeader(section.eyebrow, section.title, section.description)}
          <div class="ph-process-grid">
            ${section.items.map((item, index) => `
              <article class="ph-process-card ph-panel-tilt" data-product-reveal data-tilt>
                <span class="ph-process-number">${String(index + 1).padStart(2, "0")}</span>
                <h3 class="ph-process-title">${item.title}</h3>
                <p class="ph-process-desc">${item.copy}</p>
              </article>
            `).join("")}
          </div>
        </div>
      </section>
    `;
  }

  function renderCompliance() {
    const section = config.compliance;
    return `
      <section class="ph-section ph-section--dark">
        <div class="container">
          ${sectionHeader(section.eyebrow, section.title, section.description)}
          <div class="ph-compliance-grid">
            ${section.items.map((item) => `
              <article class="ph-compliance-card" data-product-reveal>
                <span class="ph-compliance-icon">${icon(item.icon)}</span>
                <h3 class="ph-compliance-name">${item.name}</h3>
                <p class="ph-compliance-copy">${item.copy}</p>
              </article>
            `).join("")}
          </div>
        </div>
      </section>
    `;
  }

  function renderCategoryNav() {
    return `
      <section class="ph-section ph-section--footer-blend">
        <div class="container">
          ${sectionHeader("Weitere Kategorien", "Alle sieben <em>Produktbereiche</em>", "Die Produktseiten sind jetzt als zusammenh&auml;ngendes System aufgebaut. So kann man schnell zwischen Kategorien wechseln, ohne den visuellen Stil zu verlieren.")}
          <div class="ph-category-grid">
            ${CATEGORY_LINKS.map((item) => `
              <a href="${item.file}" class="ph-category-card ph-panel-tilt ${item.id === config.id ? "is-active" : ""}" data-product-reveal data-tilt style="--cat-glow:${item.glow};">
                <span class="ph-category-accent"></span>
                <div class="ph-category-top">
                  <span class="ph-category-num">${item.num}</span>
                  <div class="ph-category-media">
                    <img src="${item.image}" alt="${item.title}" class="ph-category-thumb" loading="lazy">
                    <span class="ph-category-icon" aria-hidden="true">${icon(item.icon)}</span>
                  </div>
                </div>
                <h3 class="ph-category-name">${item.title}</h3>
                <p class="ph-category-copy">${item.copy}</p>
              </a>
            `).join("")}
          </div>
        </div>
      </section>
    `;
  }

  function renderFinalCta() {
    const section = config.cta;
    return `
      <section class="pre-footer-zone ph-pre-footer-zone" data-product-reveal>
        <section class="cta-section cta-section--innerpage ph-final-cta-banner">
          <div class="cta-noise"></div>
          <div class="container">
            <div class="cta-inner">
              <p class="eyebrow">${section.eyebrow}</p>
              <h2 class="cta-title">${section.title}</h2>
              <p class="cta-subtitle">${section.copy}</p>
              <a href="${section.href}" class="btn btn-dark btn-lg">${section.label}</a>
            </div>
          </div>
        </section>
      </section>
    `;
  }

  function renderPage() {
    mount.innerHTML = [
      renderHero(),
      renderTicker(),
      renderMetrics(),
      renderFeatures(),
      renderSpecs(),
      renderApplications(),
      renderProcess(),
      renderCompliance(),
      renderFinalCta(),
      renderCategoryNav()
    ].join("");
  }

  function initReveal() {
    const items = Array.from(document.querySelectorAll("[data-product-reveal]"));
    if (!items.length) return;

    if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);

      const heroItems = items.filter((item) => item.closest(".ph-hero"));
      if (heroItems.length) {
        gsap.fromTo(
          heroItems,
          { opacity: 0, y: 36 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            stagger: 0.12,
            ease: "power3.out"
          }
        );
      }

      items
        .filter((item) => !item.closest(".ph-hero"))
        .forEach((item) => {
          gsap.fromTo(
            item,
            { opacity: 0, y: 42 },
            {
              opacity: 1,
              y: 0,
              duration: 0.85,
              ease: "power3.out",
              scrollTrigger: {
                trigger: item,
                start: "top 88%",
                once: true
              }
            }
          );
        });
      return;
    }

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });

      items.forEach((item) => observer.observe(item));
      return;
    }

    items.forEach((item) => item.classList.add("is-visible"));
  }

  function initHeroStage() {
    const stage = document.getElementById("productHeroStage");
    const card = document.getElementById("ph3d");
    const badges = Array.from(document.querySelectorAll(".ph-badge"));
    const chips = Array.from(document.querySelectorAll(".ph-orbit-chip"));

    if (!stage || !card) return;

    stage.addEventListener("mousemove", (event) => {
      const rect = stage.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;

      card.style.transform =
        `translateX(-50%) rotateY(${x * 18}deg) rotateX(${y * -14}deg) translateY(-10px)`;

      badges.forEach((badge, index) => {
        const strength = 12 + (index * 3);
        badge.style.transform = `translate3d(${x * strength}px, ${y * -strength}px, 0)`;
      });

      chips.forEach((chip, index) => {
        const strength = 10 + (index * 2);
        chip.style.transform = `translate3d(${x * -strength}px, ${y * strength}px, 0)`;
      });
    });

    stage.addEventListener("mouseleave", () => {
      card.style.transform = "";
      badges.forEach((badge) => { badge.style.transform = ""; });
      chips.forEach((chip) => { chip.style.transform = ""; });
    });
  }

  function initTiltPanels() {
    const panels = document.querySelectorAll("[data-tilt]");

    panels.forEach((panel) => {
      panel.addEventListener("mousemove", (event) => {
        if (panel.id === "ph3d") return;

        const rect = panel.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;

        const isSpecVisual = panel.classList.contains("ph-spec-visual");
        const perspective = isSpecVisual ? 920 : 1200;
        const tiltStrength = isSpecVisual ? 10 : 8;
        const lift = isSpecVisual ? -6 : -4;

        panel.style.transform = `perspective(${perspective}px) rotateY(${x * tiltStrength}deg) rotateX(${y * -tiltStrength}deg) translateY(${lift}px)`;
      });

      panel.addEventListener("mouseleave", () => {
        if (panel.id !== "ph3d") panel.style.transform = "";
      });
    });
  }

  applyTheme();
  renderPage();
  initReveal();
  initHeroStage();
  initTiltPanels();
})();
