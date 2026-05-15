(function () {
  const canvas = document.querySelector('.hero-3d-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const sceneName = canvas.dataset.scene || '';

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  renderer.shadowMap.enabled = true;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
  camera.position.set(0, 0, 9);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.55);
  scene.add(ambientLight);
  const dirLight = new THREE.DirectionalLight(0xffffff, 1.1);
  dirLight.position.set(5, 8, 6);
  scene.add(dirLight);
  const fillLight = new THREE.DirectionalLight(0x88aaff, 0.4);
  fillLight.position.set(-4, -2, 4);
  scene.add(fillLight);

  function resize() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (canvas.width !== w || canvas.height !== h) {
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
  }

  let animFn = null;
  function loop() {
    requestAnimationFrame(loop);
    resize();
    if (animFn) animFn();
    renderer.render(scene, camera);
  }
  loop();

  function mat(color, opts) {
    return new THREE.MeshStandardMaterial(Object.assign({ color }, opts || {}));
  }
  function mesh(geo, material) {
    return new THREE.Mesh(geo, material);
  }
  function add(obj, parent) {
    (parent || scene).add(obj);
    return obj;
  }

  /* ═══════════════════════════════════════════════════════════════
     1. PRODUKTENTWICKLUNG — Product pipeline: 4 product categories
        materialise from a formula pool → scan + test → approval seal
  ═══════════════════════════════════════════════════════════════ */
  function buildFlask() {
    const root = add(new THREE.Group());
    root.position.set(0, 0.1, 0);

    const CYCLE = 15;
    function clamp01(v) { return Math.max(0, Math.min(1, v)); }
    function eOut(v) { const u = 1 - v; return 1 - u * u * u; }
    function ph(tc, a, b) { return clamp01((tc - a) / (b - a)); }

    // ── Platform ──────────────────────────────────────────────────
    const platBase = mesh(new THREE.CylinderGeometry(3.0, 3.0, 0.06, 64),
      mat(0x080f18, { roughness: 0.5, metalness: 0.7 }));
    platBase.position.y = -1.90;
    add(platBase, root);
    const platRing = mesh(new THREE.TorusGeometry(2.85, 0.016, 8, 80),
      mat(0x007799, { emissive: 0x004455, emissiveIntensity: 0.9, roughness: 0.2 }));
    platRing.rotation.x = Math.PI / 2;
    platRing.position.y = -1.87;
    add(platRing, root);

    // ── Ingredient particles ───────────────────────────────────────
    const PROD_COLS = [0x00ddcc, 0x00cc77, 0xeebb00, 0x00ccff];
    const PROD_EMT  = [0x009988, 0x007733, 0xaa8800, 0x0099cc];
    const NUM_INGR = 14;
    const ingrMeshes = [];
    const ingrData = [];
    for (let i = 0; i < NUM_INGR; i++) {
      const col = PROD_COLS[i % 4];
      const im = mat(col, { transparent: true, opacity: 0,
        emissive: col, emissiveIntensity: 1.3 });
      const s = mesh(new THREE.SphereGeometry(0.04 + Math.random() * 0.03, 6, 6), im);
      const ang = (i / NUM_INGR) * Math.PI * 2;
      s.userData = { im, ang0: ang, r0: 2.0 + Math.random() * 0.6,
        y0: -0.3 + Math.random() * 0.8, spd: 0.7 + Math.random() * 0.5 };
      add(s, root);
      ingrMeshes.push(s);
    }

    // ── Formula pool (glow disc at centre) ────────────────────────
    const poolMat = mat(0x00ffee, { transparent: true, opacity: 0,
      emissive: 0x00bbaa, emissiveIntensity: 2.0, roughness: 0.2 });
    const poolRingMat = mat(0x00ffdd, { transparent: true, opacity: 0,
      emissive: 0x00ccbb, emissiveIntensity: 1.5, roughness: 0.2 });
    const poolDisc = mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.06, 32), poolMat);
    poolDisc.position.set(0, -1.60, 0);
    add(poolDisc, root);
    const poolRingM = mesh(new THREE.TorusGeometry(0.42, 0.022, 8, 40), poolRingMat);
    poolRingM.rotation.x = Math.PI / 2;
    poolRingM.position.set(0, -1.58, 0);
    add(poolRingM, root);

    // ── 4 product bottles ─────────────────────────────────────────
    // Positions: -1.95, -0.65, 0.65, 1.95
    const BPOS = [-1.95, -0.65, 0.65, 1.95];
    const BACT = [3.0, 3.9, 4.8, 5.7]; // activation times
    const bottleGroups = [];
    const glowRingMats = [];
    const liquidMats = [];

    for (let i = 0; i < 4; i++) {
      const bG = new THREE.Group();
      bG.position.set(BPOS[i], -1.90, 0);
      bG.scale.setScalar(0);
      add(bG, root);
      bottleGroups.push(bG);

      const col = PROD_COLS[i], emt = PROD_EMT[i];
      const glassMat = mat(col, { transparent: true, opacity: 0.70,
        emissive: emt, emissiveIntensity: 0.4, roughness: 0.08, metalness: 0.35 });
      const capMat   = mat(col, { emissive: emt, emissiveIntensity: 0.8, roughness: 0.2, metalness: 0.7 });
      const labelMat = mat(0x060f1a, { roughness: 0.5, metalness: 0.15 });
      const liqM = mat(col, { transparent: true, opacity: 0,
        emissive: emt, emissiveIntensity: 0.5, roughness: 0.1 });
      liquidMats.push(liqM);

      if (i === 0) {
        // Kosmetik — tall pump bottle
        const body = mesh(new THREE.CylinderGeometry(0.14, 0.155, 0.60, 20), glassMat);
        body.position.y = 0.34; add(body, bG);
        const shoulder = mesh(new THREE.CylinderGeometry(0.075, 0.14, 0.14, 20), glassMat);
        shoulder.position.y = 0.71; add(shoulder, bG);
        const neck = mesh(new THREE.CylinderGeometry(0.055, 0.075, 0.10, 16), glassMat);
        neck.position.y = 0.82; add(neck, bG);
        const pump = mesh(new THREE.CylinderGeometry(0.038, 0.038, 0.28, 12), capMat);
        pump.position.y = 1.015; add(pump, bG);
        const pumpHead = mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.07, 12), capMat);
        pumpHead.position.y = 1.19; add(pumpHead, bG);
        const base = mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.06, 20), glassMat);
        base.position.y = 0.03; add(base, bG);
        const lbl = mesh(new THREE.CylinderGeometry(0.156, 0.156, 0.26, 20), labelMat);
        lbl.position.y = 0.34; add(lbl, bG);
        const liq = mesh(new THREE.CylinderGeometry(0.12, 0.135, 0.50, 20), liqM);
        liq.position.y = 0.30; add(liq, bG);

      } else if (i === 1) {
        // CBD — dark dropper bottle with pipette
        const body = mesh(new THREE.CylinderGeometry(0.092, 0.10, 0.52, 16), glassMat);
        body.position.y = 0.29; add(body, bG);
        const cap = mesh(new THREE.CylinderGeometry(0.096, 0.096, 0.13, 16), capMat);
        cap.position.y = 0.615; add(cap, bG);
        const pipette = mesh(new THREE.CylinderGeometry(0.012, 0.028, 0.16, 8), capMat);
        pipette.position.y = 0.805; add(pipette, bG);
        const tip = mesh(new THREE.ConeGeometry(0.012, 0.06, 6), capMat);
        tip.position.y = 0.915; add(tip, bG);
        const lbl = mesh(new THREE.CylinderGeometry(0.093, 0.093, 0.26, 16), labelMat);
        lbl.position.y = 0.29; add(lbl, bG);
        const dot = mesh(new THREE.CircleGeometry(0.038, 8),
          mat(0x00ff88, { emissive: 0x00cc55, emissiveIntensity: 1.2, side: THREE.DoubleSide }));
        dot.position.set(0, 0.30, 0.096); add(dot, bG);
        const liq = mesh(new THREE.CylinderGeometry(0.08, 0.088, 0.44, 16), liqM);
        liq.position.y = 0.26; add(liq, bG);

      } else if (i === 2) {
        // NEM — wide supplement jar
        const body = mesh(new THREE.CylinderGeometry(0.215, 0.215, 0.34, 24), glassMat);
        body.position.y = 0.20; add(body, bG);
        const cap = mesh(new THREE.CylinderGeometry(0.225, 0.225, 0.08, 24), capMat);
        cap.position.y = 0.42; add(cap, bG);
        const lbl = mesh(new THREE.CylinderGeometry(0.216, 0.216, 0.20, 24), labelMat);
        lbl.position.y = 0.20; add(lbl, bG);
        const stripe = mesh(new THREE.CylinderGeometry(0.217, 0.217, 0.05, 24),
          mat(col, { emissive: emt, emissiveIntensity: 0.7, roughness: 0.25 }));
        stripe.position.y = 0.31; add(stripe, bG);
        const liq = mesh(new THREE.CylinderGeometry(0.19, 0.19, 0.28, 24), liqM);
        liq.position.y = 0.17; add(liq, bG);

      } else {
        // Aroma — small round vial
        const body = mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.44, 14), glassMat);
        body.position.y = 0.25; add(body, bG);
        const btm = mesh(new THREE.SphereGeometry(0.08, 14, 8, 0, Math.PI * 2, 0, Math.PI / 2), glassMat);
        btm.position.y = 0.03; add(btm, bG);
        const neck = mesh(new THREE.CylinderGeometry(0.048, 0.08, 0.08, 14), glassMat);
        neck.position.y = 0.51; add(neck, bG);
        const cap = mesh(new THREE.SphereGeometry(0.054, 12, 8), capMat);
        cap.position.y = 0.59; add(cap, bG);
        const lbl = mesh(new THREE.CylinderGeometry(0.081, 0.081, 0.22, 14), labelMat);
        lbl.position.y = 0.25; add(lbl, bG);
        const liq = mesh(new THREE.CylinderGeometry(0.065, 0.065, 0.34, 14), liqM);
        liq.position.y = 0.21; add(liq, bG);
      }

      // Base glow ring
      const gRM = mat(col, { transparent: true, opacity: 0,
        emissive: emt, emissiveIntensity: 1.6, roughness: 0.2 });
      glowRingMats.push(gRM);
      const gR = mesh(new THREE.TorusGeometry(i === 2 ? 0.25 : 0.20, 0.013, 8, 32), gRM);
      gR.rotation.x = Math.PI / 2;
      gR.position.y = 0.01;
      add(gR, bG);

      // Pole to platform
      const poleH = 1.9;
      const pole = mesh(new THREE.CylinderGeometry(0.009, 0.009, poleH, 6),
        mat(0x003344, { roughness: 0.5, metalness: 0.7 }));
      pole.position.y = -poleH / 2;
      add(pole, bG);
    }

    // ── Connector rail between bottles ────────────────────────────
    const connMats = [];
    for (let i = 0; i < 3; i++) {
      const cM = mat(0x00aabb, { transparent: true, opacity: 0,
        emissive: 0x008899, emissiveIntensity: 0.9 });
      connMats.push(cM);
      const cSeg = mesh(new THREE.BoxGeometry(BPOS[i+1] - BPOS[i] - 0.08, 0.014, 0.014), cM);
      cSeg.position.set((BPOS[i] + BPOS[i+1]) / 2, 0.80, 0);
      add(cSeg, root);
    }

    // ── Scan beam ─────────────────────────────────────────────────
    const scanMat = mat(0x00ffee, { transparent: true, opacity: 0,
      emissive: 0x00ddcc, emissiveIntensity: 2.5, side: THREE.DoubleSide });
    const scanBeam = mesh(new THREE.PlaneGeometry(4.5, 0.035), scanMat);
    add(scanBeam, root);

    // ── Data bars (3 per bottle, rising behind each product) ─────
    const dataBarMats = [];
    const dataBarMeshes = [];
    // [bottleIndex, xOffset, barHeight]
    const BAR_DATA = [
      [0, -0.22, 0.70], [0, 0.00, 1.20], [0, 0.22, 0.50],
      [1, -0.22, 1.00], [1, 0.00, 1.45], [1, 0.22, 0.65],
      [2, -0.22, 0.85], [2, 0.00, 1.30], [2, 0.22, 0.55],
      [3, -0.22, 1.10], [3, 0.00, 0.75], [3, 0.22, 1.40],
    ];
    for (let b = 0; b < BAR_DATA.length; b++) {
      const [bi, xOff, bh] = BAR_DATA[b];
      // bar colour is neutral white/silver so it contrasts all product colours
      const BAR_COLS = [0xffffff, 0xddffee, 0xffffff];
      const BAR_EMITS = [0x88eeff, 0x55ddaa, 0x88eeff];
      const bIdx = b % 3;
      const bM = mat(BAR_COLS[bIdx], { transparent: true, opacity: 0,
        emissive: BAR_EMITS[bIdx], emissiveIntensity: 1.6 });
      dataBarMats.push(bM);
      const bBar = mesh(new THREE.BoxGeometry(0.16, bh, 0.07), bM);
      bBar.position.set(BPOS[bi] + xOff, -1.90 + bh / 2, -0.45);
      bBar.scale.y = 0;
      add(bBar, root);
      dataBarMeshes.push(bBar);
    }

    // ── Approval seal (faces camera — no rotation on ring) ────────
    const sealG = new THREE.Group();
    sealG.position.set(0, 1.05, 0);
    sealG.scale.setScalar(0);
    add(sealG, root);
    // Outer gold ring — no rotation so it faces the camera (+z)
    const sRing = mesh(new THREE.TorusGeometry(0.42, 0.055, 12, 56),
      mat(0xffcc33, { emissive: 0xdd9900, emissiveIntensity: 1.2, metalness: 0.6, roughness: 0.2 }));
    add(sRing, sealG);
    // Second inner decorative ring
    const sRing2 = mesh(new THREE.TorusGeometry(0.34, 0.018, 8, 48),
      mat(0xffdd66, { emissive: 0xcc8800, emissiveIntensity: 0.9 }));
    add(sRing2, sealG);
    // Dark background disc facing camera
    const sDisc = mesh(new THREE.CircleGeometry(0.32, 48),
      mat(0x030e18, { side: THREE.DoubleSide }));
    sDisc.position.z = -0.01; add(sDisc, sealG);
    // Checkmark — short left stroke
    const chk1 = mesh(new THREE.BoxGeometry(0.20, 0.058, 0.07),
      mat(0x00ffaa, { emissive: 0x00ee99, emissiveIntensity: 2.2 }));
    chk1.rotation.z = Math.PI * 0.38; chk1.position.set(-0.08, -0.08, 0.03); add(chk1, sealG);
    // Checkmark — long right stroke
    const chk2 = mesh(new THREE.BoxGeometry( 0.32, 0.058, 0.07),
      mat(0x00ffaa, { emissive: 0x00ee99, emissiveIntensity: 2.2 }));
    chk2.rotation.z = -Math.PI * 0.20; chk2.position.set(0.08, 0.05, 0.03); add(chk2, sealG);

    // ── Sparkle particles ─────────────────────────────────────────
    const sparkles = Array.from({ length: 22 }, (_, i) => {
      const col = PROD_COLS[i % 4];
      const sm = mat(col, { transparent: true, opacity: 0,
        emissive: col, emissiveIntensity: 1.4 });
      const s = mesh(new THREE.SphereGeometry(0.022 + Math.random() * 0.020, 5, 5), sm);
      s.userData = { sm, bx: BPOS[i % 4], ph: Math.random() * Math.PI * 2,
        spd: 0.38 + Math.random() * 0.30 };
      add(s, root);
      return s;
    });

    let t = 0;

    animFn = function () {
      t += 0.016;
      const tc = t % CYCLE;
      root.rotation.y = Math.sin(t * 0.20) * 0.08;

      // ── Reset ──────────────────────────────────────────────────
      if (tc < 0.30) {
        bottleGroups.forEach(bG => { bG.scale.setScalar(0); });
        glowRingMats.forEach(m => { m.opacity = 0; });
        liquidMats.forEach(m => { m.opacity = 0; });
        connMats.forEach(m => { m.opacity = 0; });
        dataBarMats.forEach(m => { m.opacity = 0; });
        dataBarMeshes.forEach(b => { b.scale.y = 0; });
        scanMat.opacity = 0;
        poolMat.opacity = 0; poolRingMat.opacity = 0;
        sealG.scale.setScalar(0);
        sparkles.forEach(s => { s.userData.sm.opacity = 0; });
      }

      // ── Phase 1: ingredients orbit + converge (0.3→2.8s) ───────
      ingrMeshes.forEach((s, i) => {
        const d = s.userData;
        const arrP  = eOut(clamp01((tc - 0.30) / 0.8));
        const convP = eOut(ph(tc, 1.9, 2.75));
        const ang   = d.ang0 + t * d.spd;
        const r     = d.r0 * arrP * (1 - convP);
        s.position.set(Math.cos(ang) * r, d.y0 * (1 - convP) - 1.55 * convP, Math.sin(ang) * r * 0.28);
        d.im.opacity = arrP * (1 - convP * 0.95);
        d.im.transparent = true;
      });

      // ── Phase 2: pool forms (2.7→3.1s) ─────────────────────────
      const poolP = eOut(ph(tc, 2.70, 3.10));
      const poolFade = 1 - eOut(ph(tc, 3.10, 4.20));
      poolMat.opacity = poolP * poolFade * 0.85;
      poolRingMat.opacity = poolP * poolFade;
      poolMat.emissiveIntensity = 1.5 + Math.sin(t * 4) * 0.4;

      // ── Phase 3: bottles materialise sequentially ───────────────
      bottleGroups.forEach((bG, i) => {
        const bP = eOut(ph(tc, BACT[i], BACT[i] + 0.75));
        bG.scale.setScalar(bP);
        bG.position.y = -1.90 + Math.sin(t * 1.0 + i * 1.4) * 0.028;
        bG.rotation.y = Math.sin(t * 0.28 + i * 0.8) * 0.12;
        // liquid fills in
        liquidMats[i].opacity = eOut(ph(tc, BACT[i] + 0.5, BACT[i] + 1.5)) * 0.65;
        // base glow ring pulses
        glowRingMats[i].opacity = bP * (0.45 + Math.sin(t * 2.2 + i * 1.1) * 0.22);
      });

      // ── Phase 4: connectors light up (6.3→7.8s) ─────────────────
      connMats.forEach((cM, i) => {
        const cP = eOut(ph(tc, 6.30 + i * 0.28, 6.90 + i * 0.28));
        cM.opacity = cP * 0.85;
        cM.emissiveIntensity = 0.7 + Math.sin(t * 1.6 + i) * 0.25;
      });

      // ── Phase 5: scan beam sweeps (7.5→9.5s) ────────────────────
      const scanP = ph(tc, 7.5, 9.5);
      scanMat.opacity = clamp01(scanP * 6) * (1 - clamp01((scanP - 0.82) / 0.18)) * 0.65;
      scanBeam.position.y = -1.90 + scanP * 3.20;

      // ── Phase 6: data bars rise behind bottles (8.5→10.5s) ──────
      const dataP = ph(tc, 8.5, 10.5);
      dataBarMats.forEach((bM, idx) => {
        const dp = eOut(clamp01((dataP - idx * 0.07) / 0.40));
        bM.opacity = dp * 0.80;
        dataBarMeshes[idx].scale.y = dp;
      });

      // ── Phase 7: seal rotates in (10.2→11.5s) ───────────────────
      const sealP = eOut(ph(tc, 10.20, 11.50));
      sealG.scale.setScalar(sealP);
      // entrance spin from -40°, then gentle continuous in-plane rotation
      sealG.rotation.z = (1 - sealP) * -Math.PI * 0.40 + t * 0.15 * sealP;

      // ── Sparkles rise (tc > 6.0) ─────────────────────────────────
      sparkles.forEach((s, i) => {
        if (tc > 6.0) {
          const age = ((tc - 6.0 + s.userData.ph * 2.5) % 3.8);
          const sp = age / 3.8;
          s.position.set(
            s.userData.bx + Math.sin(t * s.userData.spd + i) * 0.24,
            -1.5 + sp * 3.2,
            Math.cos(t * s.userData.spd * 0.7 + i) * 0.14
          );
          s.userData.sm.opacity = Math.sin(sp * Math.PI) * 0.80;
        } else {
          s.userData.sm.opacity = Math.max(0, s.userData.sm.opacity - 0.05);
        }
      });
    };
  }

  /* ═══════════════════════════════════════════════════════════════
     2. LOHNABFÜLLUNG — Industrial filling machine + batch conveyor
  ═══════════════════════════════════════════════════════════════ */
  function buildFillingMachine() {
    const root = add(new THREE.Group());
    root.position.set(0, -0.3, 0);

    const metalMat = mat(0xaabccc, { roughness: 0.25, metalness: 0.7 });
    const darkMat  = mat(0x334455, { roughness: 0.4, metalness: 0.6 });
    const convMat  = mat(0x88aabb, { roughness: 0.5, metalness: 0.3 });

    // Conveyor belt
    const convBelt = mesh(new THREE.BoxGeometry(4.5, 0.18, 1.1), convMat);
    convBelt.position.y = -1.6;
    add(convBelt, root);

    [-0.55, 0.55].forEach(z => {
      const rail = mesh(new THREE.BoxGeometry(4.5, 0.08, 0.08), mat(0x778899, { roughness: 0.3, metalness: 0.7 }));
      rail.position.set(0, -1.5, z);
      add(rail, root);
    });
    [-2.1, 2.1].forEach(x => {
      const roller = mesh(new THREE.CylinderGeometry(0.18, 0.18, 1.1, 16), mat(0x99aabb, { roughness: 0.3, metalness: 0.6 }));
      roller.rotation.z = Math.PI / 2;
      roller.position.set(x, -1.6, 0);
      add(roller, root);
    });

    // Scrolling belt divider markers
    const beltMarkers = [];
    for (let i = 0; i < 7; i++) {
      const m = mesh(new THREE.BoxGeometry(0.05, 0.05, 1.0), mat(0x6699aa, { roughness: 0.5 }));
      m.position.set(-2.1 + i * 0.72, -1.51, 0);
      add(m, root);
      beltMarkers.push(m);
    }

    // Frame posts + crossbar
    [-1.5, 1.5].forEach(x => {
      const post = mesh(new THREE.BoxGeometry(0.14, 3.2, 0.14), darkMat);
      post.position.set(x, 0, 0);
      add(post, root);
    });
    const crossbar = mesh(new THREE.BoxGeometry(3.3, 0.14, 0.14), darkMat);
    crossbar.position.y = 1.45;
    add(crossbar, root);

    // Machine head
    const head = mesh(new THREE.BoxGeometry(2.8, 0.36, 0.7), metalMat);
    head.position.y = 0.9;
    add(head, root);

    // Nozzle groups (move up/down together)
    const NOZZLE_X = [-0.85, 0, 0.85];
    const NOZZLE_BASE_Y = 0.52;
    const nozzleGroups = NOZZLE_X.map((x) => {
      const ng = new THREE.Group();
      ng.position.set(x, NOZZLE_BASE_Y, 0);
      add(ng, root);
      const arm = mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.7, 10), metalMat);
      add(arm, ng);
      const tip = mesh(new THREE.CylinderGeometry(0.08, 0.04, 0.18, 10), mat(0x55aacc, { roughness: 0.2, metalness: 0.5 }));
      tip.position.y = -0.35;
      add(tip, ng);
      return ng;
    });

    // Liquid streams (fixed under each nozzle, opacity animated)
    const streams = NOZZLE_X.map((x) => {
      const s = mesh(new THREE.CylinderGeometry(0.025, 0.025, 1.0, 6),
        mat(0x00ffaa, { transparent: true, opacity: 0.0, roughness: 0.1 }));
      s.position.set(x, -0.15, 0);
      add(s, root);
      return s;
    });

    // Control panel
    const panel = mesh(new THREE.BoxGeometry(0.7, 1.0, 0.12), mat(0x223344, { roughness: 0.5 }));
    panel.position.set(2.0, 0.1, 0);
    panel.rotation.y = -0.25;
    add(panel, root);
    const btnLights = [0x44ff88, 0xffcc00, 0xff4444].map((c, i) => {
      const btn = mesh(new THREE.SphereGeometry(0.07, 8, 8),
        mat(c, { emissive: c, emissiveIntensity: 0.4 }));
      btn.position.set(1.97, 0.35 - i * 0.25, 0.08);
      add(btn, root);
      return btn;
    });

    // ── Batch factory ──────────────────────────────────────────
    const ENTER_X  =  4.2;
    const FILL_X   =  0;
    const EXIT_X   = -4.8;
    const SLIDE_SPD = 0.046;
    const FILL_RATE = 0.007;

    function makeBatch(startX) {
      const group = new THREE.Group();
      group.position.set(startX, -1.15, 0);
      add(group, root);

      const bMat = mat(0x55dd99, { transparent: true, opacity: 0.55, roughness: 0.05, metalness: 0.15 });
      const cMat = mat(0xffffff, { roughness: 0.4 });
      const lMat = mat(0x00cc88, { transparent: true, opacity: 0.75, roughness: 0.1 });

      const bottles = NOZZLE_X.map((x) => {
        const bg = new THREE.Group();
        bg.position.set(x, 0, 0);
        add(bg, group);
        add(mesh(new THREE.CylinderGeometry(0.22, 0.25, 1.1, 18), bMat), bg);
        const sh = mesh(new THREE.CylinderGeometry(0.14, 0.22, 0.28, 18), bMat);
        sh.position.y = 0.69; add(sh, bg);
        const nk = mesh(new THREE.CylinderGeometry(0.10, 0.14, 0.3, 14), bMat);
        nk.position.y = 0.97; add(nk, bg);
        const cap = mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.14, 14), cMat);
        cap.position.y = 1.19; add(cap, bg);
        const liq = mesh(new THREE.CylinderGeometry(0.20, 0.23, 1.0, 18), lMat);
        liq.scale.y = 0.02;
        liq.position.y = -0.55;
        add(liq, bg);
        return { liq, level: 0 };
      });

      return { group, bottles, state: 'in', nextSpawned: false, done: false };
    }

    let batches = [makeBatch(ENTER_X)];
    let needSpawn = false;
    let t = 0;

    animFn = function () {
      t += 0.016;
      root.rotation.y = Math.sin(t * 0.28) * 0.18;

      // Scroll belt markers to show conveyor moving
      beltMarkers.forEach((m) => {
        m.position.x -= 0.022;
        if (m.position.x < -2.25) m.position.x += 4.55;
      });

      // Blink green button while filling
      const filling = batches.some(b => b.state === 'fill');
      btnLights[0].material.emissiveIntensity = filling ? 0.6 + Math.sin(t * 8) * 0.4 : 0.2;

      // Spawn next batch if requested
      if (needSpawn) {
        batches.push(makeBatch(ENTER_X));
        needSpawn = false;
      }

      // Hide all streams each frame; re-enable per bottle below
      streams.forEach(s => { s.material.opacity = 0; });

      batches.forEach((batch) => {
        if (batch.done) return;
        const gx = batch.group.position.x;

        if (batch.state === 'in') {
          // Slide toward fill position from right
          if (gx > FILL_X) {
            batch.group.position.x = Math.max(FILL_X, gx - SLIDE_SPD);
          } else {
            batch.state = 'fill';
          }

        } else if (batch.state === 'fill') {
          // Lower nozzles
          nozzleGroups.forEach(ng => {
            ng.position.y = Math.max(NOZZLE_BASE_Y - 0.24, ng.position.y - 0.01);
          });

          // Cascade: bottle 0 first, 1 starts at 35%, 2 starts at 35% of 1
          const [b0, b1, b2] = batch.bottles;
          if (b0.level < 1) b0.level = Math.min(1, b0.level + FILL_RATE);
          if (b0.level >= 0.35 && b1.level < 1) b1.level = Math.min(1, b1.level + FILL_RATE);
          if (b1.level >= 0.35 && b2.level < 1) b2.level = Math.min(1, b2.level + FILL_RATE);

          // Update liquid mesh + stream for each bottle
          batch.bottles.forEach((b, i) => {
            b.liq.scale.y = Math.max(0.02, b.level);
            b.liq.position.y = -0.55 + b.level * 0.5;
            if (b.level < 1.0) streams[i].material.opacity = 0.78;
          });

          // All full → slide out
          if (b0.level >= 1 && b1.level >= 1 && b2.level >= 1) {
            batch.state = 'out';
            if (!batch.nextSpawned) {
              needSpawn = true;
              batch.nextSpawned = true;
            }
          }

        } else if (batch.state === 'out') {
          // Raise nozzles back
          nozzleGroups.forEach(ng => {
            ng.position.y = Math.min(NOZZLE_BASE_Y, ng.position.y + 0.014);
          });

          // Slide out to left
          batch.group.position.x -= SLIDE_SPD;
          if (batch.group.position.x < EXIT_X) {
            root.remove(batch.group);
            batch.done = true;
          }
        }
      });

      // Prune finished batches
      batches = batches.filter(b => !b.done);
    };
  }

  /* ═══════════════════════════════════════════════════════════════
     3. VERPACKUNG — Box open → load → close → label → stamp → scan
  ═══════════════════════════════════════════════════════════════ */
  function buildPackagingBox() {
    const root = add(new THREE.Group());
    root.position.set(0.1, 0.1, 0);

    const cardboard  = mat(0xd4a86a, { roughness: 0.8 });
    const cardDark   = mat(0xb8884a, { roughness: 0.85 });
    const tapeMat    = mat(0x5577cc, { roughness: 0.5 });
    const bW = 2.2, bH = 1.6, bD = 1.8;

    // Box bottom + 4 sides
    const bottom = mesh(new THREE.BoxGeometry(bW, 0.08, bD), cardDark);
    bottom.position.y = -bH / 2;
    add(bottom, root);
    [
      { pos: [0, 0, -bD/2], size: [bW, bH, 0.08] },
      { pos: [0, 0,  bD/2], size: [bW, bH, 0.08] },
      { pos: [-bW/2, 0, 0], size: [0.08, bH, bD] },
      { pos: [ bW/2, 0, 0], size: [0.08, bH, bD] },
    ].forEach(({ pos, size }) => {
      const s = mesh(new THREE.BoxGeometry(...size), cardboard);
      s.position.set(...pos);
      add(s, root);
    });

    // 4 flaps
    const flaps = [];

    // Front / back flaps — pivot at top edge, extend inward in Z
    [
      { pos: [0, bH/2, -bD/2+0.04], size: [bW-0.12, 0.06, bD/2-0.06], axis: 'x', openAngle: -Math.PI*0.72, offsetZ: +(bD/2-0.06)/2 },
      { pos: [0, bH/2,  bD/2-0.04], size: [bW-0.12, 0.06, bD/2-0.06], axis: 'x', openAngle:  Math.PI*0.72, offsetZ: -(bD/2-0.06)/2 },
    ].forEach(({ pos, size, axis, openAngle, offsetZ }) => {
      const fg = new THREE.Group();
      fg.position.set(...pos);
      add(fg, root);
      const f = mesh(new THREE.BoxGeometry(...size), cardboard);
      f.position.z = offsetZ;
      add(f, fg);
      flaps.push({ group: fg, axis, openAngle });
    });

    // Left / right side flaps — mesh extends INWARD (X) so rotation=0 is the closed/flat state
    const sideFlapW = bW / 2 - 0.12;
    [
      { pos: [-bW/2+0.04, bH/2, 0], offsetX: +sideFlapW/2, openAngle: +Math.PI*0.72 },
      { pos: [ bW/2-0.04, bH/2, 0], offsetX: -sideFlapW/2, openAngle: -Math.PI*0.72 },
    ].forEach(({ pos, offsetX, openAngle }) => {
      const fg = new THREE.Group();
      fg.position.set(...pos);
      add(fg, root);
      const f = mesh(new THREE.BoxGeometry(sideFlapW, 0.06, bD - 0.1), cardboard);
      f.position.x = offsetX;
      add(f, fg);
      flaps.push({ group: fg, axis: 'z', openAngle });
    });

    // Tape strip (hidden while box is open, shown when closed)
    const tape = mesh(new THREE.BoxGeometry(bW + 0.1, 0.12, 0.22), tapeMat);
    tape.position.y = bH / 2 + 0.03;
    tape.visible = false;
    add(tape, root);

    // Products inside box (3 coloured items)
    const products = [0xff6655, 0x55aaff, 0x55dd88].map((c, i) => {
      const p = mesh(new THREE.BoxGeometry(0.5, 0.62, 0.55), mat(c, { roughness: 0.5 }));
      p.position.set(-0.6 + i * 0.6, -bH/2 + 0.37, 0);
      p.scale.setScalar(0);
      add(p, root);
      return p;
    });

    // ── Animated label group (slides from above onto front face) ──
    const labelGroup = new THREE.Group();
    labelGroup.position.set(0, 3.5, bD/2 + 0.04);
    add(labelGroup, root);

    // Label backing
    const labelBack = mesh(new THREE.BoxGeometry(1.05, 0.68, 0.04), mat(0xf5f0e8, { roughness: 0.6 }));
    add(labelBack, labelGroup);

    // Colour accent bar at top of label
    const accent = mesh(new THREE.BoxGeometry(1.05, 0.16, 0.05), mat(0xff6644, { roughness: 0.4 }));
    accent.position.y = 0.26;
    add(accent, labelGroup);

    // Barcode strips
    const barWidths = [0.028, 0.014, 0.042, 0.014, 0.028, 0.014, 0.042, 0.028, 0.014, 0.042, 0.014, 0.028];
    let bx = -0.38;
    barWidths.forEach((w) => {
      const bar = mesh(new THREE.BoxGeometry(w, 0.26, 0.05), mat(0x111111, { roughness: 0.5 }));
      bar.position.set(bx + w / 2, -0.08, 0);
      add(bar, labelGroup);
      bx += w + 0.028;
    });

    // Batch/date strip below barcode
    const dateStrip = mesh(new THREE.BoxGeometry(0.72, 0.07, 0.05), mat(0xaaaaaa, { roughness: 0.5 }));
    dateStrip.position.set(0, -0.27, 0);
    add(dateStrip, labelGroup);

    // ── Approval stamp ──
    const stampGroup = new THREE.Group();
    stampGroup.position.set(0.2, 4, bD/2 + 0.35);
    add(stampGroup, root);

    const stampHandle = mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.58, 12), mat(0x994422, { roughness: 0.6 }));
    add(stampHandle, stampGroup);
    const stampBody2 = mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.15, 14), mat(0xcc3322, { roughness: 0.3 }));
    stampBody2.position.y = -0.365;
    add(stampBody2, stampGroup);
    const rubber = mesh(new THREE.CylinderGeometry(0.26, 0.26, 0.09, 14), mat(0xff4433, { roughness: 0.5, emissive: 0x880000, emissiveIntensity: 0.2 }));
    rubber.position.y = -0.475;
    add(rubber, stampGroup);

    // Stamp mark (circle + check — starts invisible, scale to 1 when stamped)
    const stampMark = new THREE.Group();
    stampMark.position.set(0.18, 0.28, bD/2 + 0.1);
    stampMark.scale.setScalar(0);
    add(stampMark, root);
    add(mesh(new THREE.TorusGeometry(0.24, 0.035, 8, 32), mat(0xdd1111, { roughness: 0.4 })), stampMark);
    const ck1 = mesh(new THREE.BoxGeometry(0.24, 0.055, 0.06), mat(0xdd1111));
    ck1.rotation.z = Math.PI / 4;  ck1.position.set(-0.04, 0.0, 0);
    add(ck1, stampMark);
    const ck2 = mesh(new THREE.BoxGeometry(0.34, 0.055, 0.06), mat(0xdd1111));
    ck2.rotation.z = -Math.PI / 4 + 0.08; ck2.position.set(0.06, 0.1, 0);
    add(ck2, stampMark);

    // ── Barcode scanner arm ──
    const scanGroup = new THREE.Group();
    scanGroup.position.set(-0.9, 0.1, bD/2 + 0.55);
    scanGroup.visible = false;
    add(scanGroup, root);

    const scanBody = mesh(new THREE.BoxGeometry(0.44, 0.2, 0.24), mat(0x1a2233, { roughness: 0.3, metalness: 0.65 }));
    add(scanBody, scanGroup);
    const scanLens = mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.1, 10), mat(0x44aaff, { roughness: 0.05, emissive: 0x2266cc, emissiveIntensity: 0.5 }));
    scanLens.rotation.x = Math.PI / 2;
    scanLens.position.z = 0.13;
    add(scanLens, scanGroup);
    // Laser beam plane
    const beamMesh = mesh(
      new THREE.PlaneGeometry(0.9, 0.018),
      mat(0x44ff44, { transparent: true, opacity: 0, side: THREE.DoubleSide, emissive: 0x22ff22, emissiveIntensity: 1.0 })
    );
    beamMesh.position.z = 0.15;
    add(beamMesh, scanGroup);

    // ── Background floating boxes + labels ──
    const floaters = [];
    for (let i = 0; i < 8; i++) {
      const s = 0.2 + Math.random() * 0.32;
      const fb = mesh(new THREE.BoxGeometry(s, s * 0.85, s * 0.9), mat(0xcc9944, { roughness: 0.8 }));
      fb.position.set(-4.5 + Math.random() * 9, -3 + Math.random() * 6, -3 + Math.random() * 2);
      fb.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      fb.userData.rs = (Math.random() - 0.5) * 0.011;
      fb.userData.fo = Math.random() * Math.PI * 2;
      add(fb);
      floaters.push(fb);
    }
    // A few floating labels
    for (let i = 0; i < 4; i++) {
      const fl = mesh(new THREE.BoxGeometry(0.4, 0.26, 0.03), mat(0xf0ebe0, { roughness: 0.6 }));
      fl.position.set(-3 + Math.random() * 6, -2.5 + Math.random() * 5, -2.5 + Math.random() * 2);
      fl.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      fl.userData.rs = (Math.random() - 0.5) * 0.009;
      fl.userData.fo = Math.random() * Math.PI * 2;
      add(fl);
      floaters.push(fl);
    }

    // ── Animation ──────────────────────────────────────────────
    // Cycle (seconds): open(0-2.5) → hold(2.5-4) → close(4-5.5) → label(5.5-7.2) → stamp(7.2-8.8) → scan(8.8-10.4) → done(10.4-12.5) → restart
    const CYCLE = 12.5;
    function easeOut(x) { return 1 - Math.pow(1 - x, 3); }
    function clamp01(x) { return Math.max(0, Math.min(1, x)); }
    function phase(ct, start, end) { return clamp01((ct - start) / (end - start)); }

    let t = 0;
    animFn = function () {
      t += 0.016;
      const ct = t % CYCLE;

      // Gentle sway — box faces camera during label/stamp phases
      root.rotation.y = Math.sin(t * 0.28) * 0.22;
      root.position.y = 0.1 + Math.sin(t * 0.45) * 0.06;

      // ── Flaps ──
      let flapT = 0;
      if      (ct < 2.5) flapT = easeOut(phase(ct, 0.4, 2.2));
      else if (ct < 4.0) flapT = 1;
      else if (ct < 5.5) flapT = 1 - easeOut(phase(ct, 4.0, 5.4));
      flaps.forEach((f) => {
        if (f.axis === 'x') f.group.rotation.x = f.openAngle * flapT;
        if (f.axis === 'z') f.group.rotation.z = f.openAngle * flapT;
      });

      // Show tape only when box is closed
      tape.visible = (flapT < 0.05);

      // ── Products pop in while open ──
      const prodT = easeOut(clamp01((ct - 1.2) / 0.8));
      const prodOut = easeOut(clamp01((ct - 4.2) / 0.5));
      const prodScale = prodT * (1 - prodOut);
      products.forEach(p => p.scale.setScalar(prodScale));

      // ── Label slides down ──
      const labelT = easeOut(phase(ct, 5.6, 6.9));
      labelGroup.position.y = 3.5 - labelT * (3.5 + 0.12);   // 3.5 → -0.12

      // ── Stamp ──
      const stampPhase = phase(ct, 7.2, 8.8);
      if (ct >= 7.2 && ct < 8.8) {
        if (stampPhase < 0.35) {
          stampGroup.position.y = 4 - easeOut(stampPhase / 0.35) * 4.35;
        } else if (stampPhase < 0.55) {
          stampGroup.position.y = -0.35;
          stampMark.scale.setScalar(easeOut((stampPhase - 0.35) / 0.15));
        } else {
          stampGroup.position.y = -0.35 + easeOut((stampPhase - 0.55) / 0.45) * 5;
          stampMark.scale.setScalar(1);
        }
      } else if (ct < 7.2) {
        stampGroup.position.y = 4;
        stampMark.scale.setScalar(0);
      }

      // ── Scanner sweep ──
      if (ct >= 8.8 && ct < 10.4) {
        scanGroup.visible = true;
        const sw = phase(ct, 8.8, 10.4);
        scanGroup.position.x = -0.9 + sw * 1.8;
        beamMesh.material.opacity = 0.55 + Math.sin(t * 22) * 0.25;
        scanLens.material.emissiveIntensity = 0.5 + Math.sin(t * 18) * 0.3;
      } else {
        scanGroup.visible = false;
      }

      // ── Floaters ──
      floaters.forEach((f) => {
        f.rotation.y += f.userData.rs;
        f.rotation.x += f.userData.rs * 0.7;
        f.position.y += Math.sin(t * 0.55 + f.userData.fo) * 0.004;
      });
    };
  }

  /* ═══════════════════════════════════════════════════════════════
     4. QUALITÄTSMANAGEMENT — Clipboard checklist + magnifier + cert seal
  ═══════════════════════════════════════════════════════════════ */
  function buildQualityCert() {
    const root = add(new THREE.Group());
    root.position.set(0.2, 0.1, 0);

    const boardMat  = mat(0x1a2a3a, { roughness: 0.4, metalness: 0.3 });
    const paperMat  = mat(0xf4f0e8, { roughness: 0.7 });
    const clipMat   = mat(0xaabbcc, { roughness: 0.2, metalness: 0.7 });
    const goldMat   = mat(0xf0b840, { roughness: 0.2, metalness: 0.7, emissive: 0xaa7700, emissiveIntensity: 0.25 });
    const greenMat  = mat(0x44dd88, { roughness: 0.2, emissive: 0x22aa55, emissiveIntensity: 0.35 });
    const lineMat   = mat(0xcccccc, { roughness: 0.6 });
    const darkLine  = mat(0x556677, { roughness: 0.6 });

    // ── Clipboard backing ──
    const board = mesh(new THREE.BoxGeometry(2.5, 3.3, 0.14), boardMat);
    add(board, root);
    // Paper sheet
    const paper = mesh(new THREE.BoxGeometry(2.18, 2.9, 0.07), paperMat);
    paper.position.set(0, -0.08, 0.1);
    add(paper, root);
    // Clip top bar
    const clipBar = mesh(new THREE.BoxGeometry(0.85, 0.2, 0.28), clipMat);
    clipBar.position.set(0, 1.72, 0.12);
    add(clipBar, root);
    // Clip spring arch
    const clipArch = mesh(new THREE.TorusGeometry(0.28, 0.07, 8, 20, Math.PI), clipMat);
    clipArch.rotation.x = Math.PI / 2;
    clipArch.position.set(0, 1.88, 0.18);
    add(clipArch, root);

    // Header stripe on paper
    const header = mesh(new THREE.BoxGeometry(2.18, 0.36, 0.08), mat(0x1a3a5c, { roughness: 0.4 }));
    header.position.set(0, 1.27, 0.14);
    add(header, root);
    // Header label strips (simulate "QUALITY CHECKLIST" text)
    [[-0.45, 0.09], [0.1, 0.09], [0.5, 0.09]].forEach(([x, w]) => {
      const s = mesh(new THREE.BoxGeometry(w, 0.09, 0.04), mat(0xffffff, { roughness: 0.5 }));
      s.position.set(x, 1.27, 0.19);
      add(s, root);
    });

    // ── 4 Checklist rows ──
    const ROW_Y = [0.72, 0.22, -0.28, -0.78];
    const checkboxes = [];   // { box, fillMesh, tick1, tick2, filled }
    const lineGroups = [];

    ROW_Y.forEach((y, i) => {
      // Checkbox outline
      const cbOut = mesh(new THREE.BoxGeometry(0.28, 0.28, 0.06), darkLine);
      cbOut.position.set(-0.78, y, 0.17);
      add(cbOut, root);
      // Checkbox inner fill (green, scales in)
      const cbFill = mesh(new THREE.BoxGeometry(0.22, 0.22, 0.08), greenMat);
      cbFill.position.set(-0.78, y, 0.2);
      cbFill.scale.setScalar(0);
      add(cbFill, root);
      // Tick mark — two bars (start invisible)
      const tk1 = mesh(new THREE.BoxGeometry(0.16, 0.045, 0.07), mat(0xffffff, { roughness: 0.3 }));
      tk1.rotation.z =  Math.PI / 4;
      tk1.position.set(-0.83, y - 0.02, 0.24);
      tk1.scale.setScalar(0);
      add(tk1, root);
      const tk2 = mesh(new THREE.BoxGeometry(0.26, 0.045, 0.07), mat(0xffffff, { roughness: 0.3 }));
      tk2.rotation.z = -Math.PI / 4 + 0.08;
      tk2.position.set(-0.72, y + 0.05, 0.24);
      tk2.scale.setScalar(0);
      add(tk2, root);
      // Text lines (2 grey bars per row)
      const L1 = mesh(new THREE.BoxGeometry(0.9, 0.08, 0.04), lineMat);
      L1.position.set(-0.14, y + 0.06, 0.17);
      add(L1, root);
      const L2 = mesh(new THREE.BoxGeometry(0.6, 0.07, 0.04), mat(0xbbbbbb, { roughness: 0.6 }));
      L2.position.set(-0.3, y - 0.1, 0.17);
      add(L2, root);

      checkboxes.push({ fill: cbFill, tk1, tk2, level: 0 });
    });

    // ── Certificate seal (right side of board) ──
    const sealGroup = new THREE.Group();
    sealGroup.position.set(0, -1.28, 0.22);
    add(sealGroup, root);

    const sealRing = mesh(new THREE.TorusGeometry(0.42, 0.07, 10, 48), goldMat);
    add(sealRing, sealGroup);
    const sealDisc = mesh(new THREE.CylinderGeometry(0.34, 0.34, 0.06, 32), mat(0xf0b840, { roughness: 0.3, metalness: 0.6 }));
    sealDisc.rotation.x = Math.PI / 2;
    add(sealDisc, sealGroup);
    // Tick inside seal
    const sealTk1 = mesh(new THREE.BoxGeometry(0.2, 0.055, 0.08), mat(0x1a2a3a, { roughness: 0.3 }));
    sealTk1.rotation.z = Math.PI / 4;
    sealTk1.position.set(-0.06, -0.02, 0.05);
    add(sealTk1, sealGroup);
    const sealTk2 = mesh(new THREE.BoxGeometry(0.3, 0.055, 0.08), mat(0x1a2a3a, { roughness: 0.3 }));
    sealTk2.rotation.z = -Math.PI / 4 + 0.08;
    sealTk2.position.set(0.06, 0.08, 0.05);
    add(sealTk2, sealGroup);
    // Seal rays (star-like notches around ring)
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      const ray = mesh(new THREE.BoxGeometry(0.06, 0.18, 0.05), goldMat);
      ray.position.set(Math.cos(a) * 0.54, Math.sin(a) * 0.54, 0);
      ray.rotation.z = a + Math.PI / 2;
      add(ray, sealGroup);
    }

    // ── Magnifying glass (floats and sweeps rows) ──
    const magGroup = new THREE.Group();
    magGroup.position.set(1.4, 0.72, 0.55);
    add(magGroup, root);

    const magRing = mesh(new THREE.TorusGeometry(0.44, 0.07, 10, 36), mat(0xaabbcc, { roughness: 0.2, metalness: 0.7 }));
    add(magRing, magGroup);
    const magLens = mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.04, 32), mat(0x99ccee, { transparent: true, opacity: 0.28, roughness: 0.05 }));
    magLens.rotation.x = Math.PI / 2;
    add(magLens, magGroup);
    const magHandle = mesh(new THREE.CylinderGeometry(0.07, 0.055, 0.88, 12), mat(0x8899aa, { roughness: 0.25, metalness: 0.6 }));
    magHandle.rotation.z = -Math.PI / 4;
    magHandle.position.set(0.58, -0.58, 0);
    add(magHandle, magGroup);
    // Lens glint
    const glint = mesh(new THREE.SphereGeometry(0.06, 6, 6), mat(0xffffff, { transparent: true, opacity: 0.6, emissive: 0xffffff, emissiveIntensity: 0.4 }));
    glint.position.set(-0.12, 0.14, 0.08);
    add(glint, magGroup);

    // ── Quality metric bars (bottom right) ──
    const bars = [0.55, 0.82, 0.65, 0.92].map((targetH, i) => {
      const barGroup = new THREE.Group();
      barGroup.position.set(1.6 + i * 0.42, -1.8, 0);
      add(barGroup, root);
      const bg = mesh(new THREE.BoxGeometry(0.26, 1.2, 0.14), mat(0x223344, { roughness: 0.5 }));
      add(bg, barGroup);
      const fill = mesh(new THREE.BoxGeometry(0.22, 1.14, 0.16), mat([0x44aaff, 0x44dd88, 0xffcc44, 0x44dd88][i], { roughness: 0.3, emissive: [0x2255aa, 0x22aa44, 0xaa8800, 0x22aa44][i], emissiveIntensity: 0.2 }));
      fill.position.y = -0.57;
      add(fill, barGroup);
      return { fill, targetH, h: 0 };
    });

    // ── Animation ──────────────────────────────────────────────
    // 8s cycle: rows check off one by one (each 1.5s), magnifier sweeps, seal pulses, bars fill
    const CYCLE = 9.0;
    function easeOut3(x) { return 1 - Math.pow(1 - Math.max(0, Math.min(1, x)), 3); }

    let t = 0;
    animFn = function () {
      t += 0.016;
      const ct = t % CYCLE;

      root.rotation.y = Math.sin(t * 0.32) * 0.2;
      root.rotation.x = Math.sin(t * 0.18) * 0.05;

      // ── Checkboxes tick off sequentially (each takes 1.6s, staggered by 1.8s) ──
      checkboxes.forEach((cb, i) => {
        const start = i * 1.8;
        const progress = easeOut3((ct - start) / 0.7);
        if (ct < start) {
          cb.fill.scale.setScalar(0);
          cb.tk1.scale.setScalar(0);
          cb.tk2.scale.setScalar(0);
        } else {
          cb.fill.scale.setScalar(Math.min(1, progress));
          cb.tk1.scale.setScalar(Math.min(1, easeOut3((ct - start - 0.1) / 0.5)));
          cb.tk2.scale.setScalar(Math.min(1, easeOut3((ct - start - 0.2) / 0.5)));
        }
      });

      // ── Magnifier sweeps down the rows while they're being checked ──
      const magRow = Math.min(3, Math.floor(ct / 1.8));
      const magFrac = easeOut3((ct % 1.8) / 1.1);
      const targetY = ROW_Y[magRow] !== undefined ? ROW_Y[magRow] : ROW_Y[3];
      magGroup.position.y += (targetY - magGroup.position.y) * 0.08;
      magGroup.rotation.z = Math.sin(t * 1.4) * 0.08;
      magGroup.position.x = 1.4 + Math.sin(t * 0.9) * 0.12;

      // ── Seal spins gently, pulses when all rows checked ──
      sealGroup.rotation.z = t * 0.25;
      const allChecked = ct > 3 * 1.8 + 0.8;
      sealDisc.material.emissiveIntensity = allChecked ? 0.35 + Math.sin(t * 3) * 0.2 : 0.0;
      sealDisc.material.emissive = new THREE.Color(allChecked ? 0xaa7700 : 0x000000);

      // ── Metric bars rise ──
      bars.forEach((b, i) => {
        const barStart = 0.5 + i * 0.4;
        const barProgress = easeOut3((ct - barStart) / 1.5);
        b.h = b.targetH * barProgress;
        b.fill.scale.y = Math.max(0.02, b.h);
        b.fill.position.y = -0.57 + b.h * 0.57;
      });
    };
  }

  /* ═══════════════════════════════════════════════════════════════
     5. ANALYSEN — Lab beaker + test tubes + analysis display
  ═══════════════════════════════════════════════════════════════ */
  function buildMicroscope() {
    const root = add(new THREE.Group());
    root.position.set(0, -0.1, 0);

    const darkMetal = mat(0x1e2d3a, { roughness: 0.4, metalness: 0.55 });
    const steelMat  = mat(0x556677, { roughness: 0.25, metalness: 0.7 });

    // ── Lab bench ──
    const bench = mesh(new THREE.BoxGeometry(7.0, 0.18, 2.2), mat(0x162230, { roughness: 0.6 }));
    bench.position.y = -2.1;
    add(bench, root);
    const benchEdge = mesh(new THREE.BoxGeometry(7.0, 0.06, 0.06), mat(0x2a4a6a, { roughness: 0.4, metalness: 0.3 }));
    benchEdge.position.set(0, -1.98, 1.08);
    add(benchEdge, root);

    // ── Hot plate / stirrer base ──
    const hotBase = mesh(new THREE.CylinderGeometry(0.82, 0.9, 0.22, 24), darkMetal);
    hotBase.position.y = -1.99;
    add(hotBase, root);
    const hotRing = mesh(new THREE.TorusGeometry(0.58, 0.045, 8, 36), mat(0xff5500, { emissive: 0xdd3300, emissiveIntensity: 0.7 }));
    hotRing.rotation.x = Math.PI / 2;
    hotRing.position.y = -1.87;
    add(hotRing, root);

    // ── Main beaker (glass) ──
    const glassMat = mat(0x99ccee, { transparent: true, opacity: 0.22, roughness: 0.04, side: THREE.DoubleSide });
    const beaker = mesh(new THREE.CylinderGeometry(0.75, 0.68, 2.1, 32), glassMat);
    beaker.position.y = -0.85;
    add(beaker, root);
    const beakerBot = mesh(new THREE.CylinderGeometry(0.68, 0.68, 0.06, 32), mat(0x88bbdd, { transparent: true, opacity: 0.38, roughness: 0.04 }));
    beakerBot.position.y = -1.87;
    add(beakerBot, root);
    const beakerRim = mesh(new THREE.TorusGeometry(0.75, 0.045, 8, 36), mat(0xaaccee, { transparent: true, opacity: 0.5, roughness: 0.04 }));
    beakerRim.rotation.x = Math.PI / 2;
    beakerRim.position.y = 0.19;
    add(beakerRim, root);
    // Beaker spout notch
    const spout = mesh(new THREE.BoxGeometry(0.24, 0.18, 0.1), mat(0x99ccee, { transparent: true, opacity: 0.35, roughness: 0.04 }));
    spout.position.set(0.73, 0.15, 0);
    add(spout, root);
    // Volume markings
    [-0.6, -0.15, 0.3].forEach(y => {
      const mark = mesh(new THREE.BoxGeometry(0.16, 0.03, 0.04), mat(0x88aacc, { roughness: 0.5 }));
      mark.position.set(0.76, y, 0);
      add(mark, root);
    });

    // ── Liquid (color-morphing) ──
    const liquidMat2 = mat(0x00ccbb, { transparent: true, opacity: 0.72, roughness: 0.08, emissive: 0x009988, emissiveIntensity: 0.3 });
    const liquid2 = mesh(new THREE.CylinderGeometry(0.66, 0.6, 1.55, 32), liquidMat2);
    liquid2.position.y = -1.18;
    add(liquid2, root);

    // ── Bubbles ──
    const bubbles = [];
    const bMat = mat(0xffffff, { transparent: true, opacity: 0.45, roughness: 0.1 });
    for (let i = 0; i < 16; i++) {
      const r = 0.035 + Math.random() * 0.055;
      const b = mesh(new THREE.SphereGeometry(r, 6, 6), bMat);
      const ang = Math.random() * Math.PI * 2;
      const rad = Math.random() * 0.52;
      b.position.set(Math.cos(ang) * rad, -1.8 + Math.random() * 1.5, Math.sin(ang) * rad * 0.75);
      b.userData.spd = 0.005 + Math.random() * 0.009;
      b.userData.ang = ang;
      b.userData.rad = rad;
      add(b, root);
      bubbles.push(b);
    }

    // ── Retort stand (holds beaker) ──
    const standBase = mesh(new THREE.BoxGeometry(1.9, 0.1, 0.95), darkMetal);
    standBase.position.set(0.7, -2.02, -0.1);
    add(standBase, root);
    const standPole = mesh(new THREE.CylinderGeometry(0.075, 0.075, 3.8, 12), steelMat);
    standPole.position.set(1.3, -0.12, -0.1);
    add(standPole, root);
    const standArm = mesh(new THREE.BoxGeometry(1.6, 0.07, 0.07), steelMat);
    standArm.position.set(0.5, -0.55, -0.1);
    add(standArm, root);
    const clampRing = mesh(new THREE.TorusGeometry(0.8, 0.06, 8, 32), steelMat);
    clampRing.rotation.x = Math.PI / 2;
    clampRing.position.set(0, -0.68, -0.1);
    add(clampRing, root);

    // ── Thermometer probe ──
    const probeGroup = new THREE.Group();
    probeGroup.position.set(-0.3, 0.65, 0.28);
    probeGroup.rotation.z = -0.22;
    add(probeGroup, root);
    const probeRod = mesh(new THREE.CylinderGeometry(0.038, 0.038, 2.0, 10), steelMat);
    add(probeRod, probeGroup);
    const probeTip = mesh(new THREE.SphereGeometry(0.068, 8, 8), mat(0xff5500, { emissive: 0xdd2200, emissiveIntensity: 0.5 }));
    probeTip.position.y = -1.0;
    add(probeTip, probeGroup);
    const probeHead = mesh(new THREE.BoxGeometry(0.34, 0.24, 0.2), darkMetal);
    probeHead.position.y = 1.1;
    add(probeHead, probeGroup);
    const probeScreen2 = mesh(new THREE.BoxGeometry(0.24, 0.13, 0.06), mat(0x44ffcc, { emissive: 0x22ddaa, emissiveIntensity: 0.7 }));
    probeScreen2.position.set(0, 1.1, 0.12);
    add(probeScreen2, probeGroup);

    // ── Test tube rack (left side) ──
    const rackG = new THREE.Group();
    rackG.position.set(-2.4, -1.0, 0.1);
    rackG.rotation.y = 0.18;
    add(rackG, root);

    const rBase = mesh(new THREE.BoxGeometry(1.7, 0.12, 0.58), mat(0x334455, { roughness: 0.5 }));
    add(rBase, rackG);
    const rTop = mesh(new THREE.BoxGeometry(1.7, 0.1, 0.58), mat(0x334455, { roughness: 0.5 }));
    rTop.position.y = 1.65;
    add(rTop, rackG);
    [-0.72, 0.72].forEach(x => {
      add(mesh(new THREE.BoxGeometry(0.08, 1.65, 0.08), mat(0x445566, { roughness: 0.4 })), rackG).position.set(x, 0.825, 0);
    });

    const tubeColorsNew = [0xff3355, 0x44aaff, 0x44ffcc, 0xffcc22];
    const tubeData2 = tubeColorsNew.map((c, i) => {
      const tg = new THREE.Group();
      tg.position.set(-0.62 + i * 0.41, 0.06, 0);
      add(tg, rackG);
      // Glass
      const glass = mesh(new THREE.CylinderGeometry(0.115, 0.105, 1.62, 14), mat(c, { transparent: true, opacity: 0.38, roughness: 0.04 }));
      glass.position.y = 0.81;
      add(glass, tg);
      // Bottom bulge
      const bulge = mesh(new THREE.SphereGeometry(0.105, 10, 10, 0, Math.PI * 2, 0, Math.PI), mat(c, { transparent: true, opacity: 0.38, roughness: 0.04 }));
      bulge.rotation.x = Math.PI;
      add(bulge, tg);
      // Liquid
      const lh = 0.55 + Math.random() * 0.65;
      const liq = mesh(new THREE.CylinderGeometry(0.098, 0.088, lh, 14), mat(c, { roughness: 0.1, transparent: true, opacity: 0.85, emissive: c, emissiveIntensity: 0.12 }));
      liq.position.y = lh / 2;
      add(liq, tg);
      return { tg, liq, lh, c };
    });

    // ── Analysis readout panel (right side) ──
    const panelG = new THREE.Group();
    panelG.position.set(2.5, 0.35, 0.15);
    panelG.rotation.y = -0.28;
    add(panelG, root);

    add(mesh(new THREE.BoxGeometry(1.52, 1.96, 0.09), mat(0x0f1c28, { roughness: 0.3 })), panelG);
    add(mesh(new THREE.BoxGeometry(1.56, 2.0, 0.07), mat(0x1a3a5a, { roughness: 0.4 })), panelG).position.z = -0.02;

    // Title bar
    const titleBar = mesh(new THREE.BoxGeometry(1.52, 0.3, 0.07), mat(0x0a2244, { roughness: 0.3, emissive: 0x051122, emissiveIntensity: 0.4 }));
    titleBar.position.set(0, 0.83, 0.07);
    add(titleBar, panelG);
    // Title dots (simulating text)
    [-0.4, -0.1, 0.2, 0.45].forEach(x => {
      const d = mesh(new THREE.BoxGeometry(0.18, 0.07, 0.04), mat(0x44aaff, { emissive: 0x2266cc, emissiveIntensity: 0.5 }));
      d.position.set(x, 0.83, 0.1);
      add(d, panelG);
    });

    // 5 animated bar charts
    const panelBars = [0.68, 0.88, 0.52, 0.94, 0.76].map((target, i) => {
      const bg = mesh(new THREE.BoxGeometry(0.18, 1.1, 0.06), mat(0x1a2a3a, { roughness: 0.5 }));
      bg.position.set(-0.52 + i * 0.26, -0.1, 0.07);
      add(bg, panelG);
      const fillCol = [0x44aaff, 0x44ffcc, 0x44aaff, 0x44ffcc, 0xffcc44][i];
      const fillEmit = [0x2266cc, 0x22cc88, 0x2266cc, 0x22cc88, 0xcc8800][i];
      const fill = mesh(new THREE.BoxGeometry(0.14, 1.04, 0.08), mat(fillCol, { roughness: 0.2, emissive: fillEmit, emissiveIntensity: 0.3 }));
      fill.position.set(-0.52 + i * 0.26, -0.1 - 0.52, 0.09);
      add(fill, panelG);
      return { fill, target, h: 0, baseY: -0.1 - 0.52 };
    });

    // Scan line on panel (green sweep)
    const scanLine = mesh(new THREE.BoxGeometry(1.38, 0.025, 0.06), mat(0x44ffaa, { transparent: true, opacity: 0.7, emissive: 0x22dd88, emissiveIntensity: 0.8 }));
    scanLine.position.z = 0.1;
    add(scanLine, panelG);

    // ── Liquid color cycle ──
    const liqCols = [
      new THREE.Color(0x00ccbb),
      new THREE.Color(0x4488ff),
      new THREE.Color(0x44ffaa),
      new THREE.Color(0xffaa22),
    ];
    let lci = 0, lct = 0;

    let t = 0;
    animFn = function () {
      t += 0.016;
      root.rotation.y = Math.sin(t * 0.3) * 0.18;

      // Liquid color morph
      lct += 0.004;
      if (lct >= 1) { lct = 0; lci = (lci + 1) % liqCols.length; }
      const lc = liqCols[lci].clone().lerp(liqCols[(lci + 1) % liqCols.length], lct);
      liquid2.material.color.copy(lc);
      liquid2.material.emissive.copy(lc).multiplyScalar(0.3);

      // Liquid surface wobble
      liquid2.scale.x = 1 + Math.sin(t * 1.1) * 0.012;
      liquid2.scale.z = 1 + Math.sin(t * 0.85) * 0.01;

      // Bubbles rise
      bubbles.forEach((b) => {
        b.position.y += b.userData.spd;
        if (b.position.y > 0.15) {
          b.position.y = -1.8;
          const a2 = Math.random() * Math.PI * 2;
          const r2 = Math.random() * 0.52;
          b.position.x = Math.cos(a2) * r2;
          b.position.z = Math.sin(a2) * r2 * 0.75;
        }
      });

      // Hot ring glow pulse
      hotRing.material.emissiveIntensity = 0.45 + Math.sin(t * 2.8) * 0.3;

      // Probe screen blink
      probeScreen2.material.emissiveIntensity = 0.5 + Math.sin(t * 5) * 0.25;

      // Test tubes shimmer + sway
      tubeData2.forEach((td, i) => {
        td.liq.material.emissiveIntensity = 0.1 + Math.sin(t * 1.4 + i * 0.9) * 0.09;
        td.tg.position.y += Math.sin(t * 0.7 + i * 0.8) * 0.0006;
      });

      // Analysis bars fill (cycle every 5s)
      const bc = t % 5.5;
      panelBars.forEach((b, i) => {
        const delay = i * 0.32;
        const prog = Math.max(0, Math.min(1, (bc - delay) / 1.6));
        const eased = 1 - Math.pow(1 - prog, 2);
        b.h = b.target * eased;
        b.fill.scale.y = Math.max(0.02, b.h);
        b.fill.position.y = b.baseY + b.h * 0.52;
      });

      // Scan line sweeps down display panel
      const scanY = 0.6 - ((t * 0.55) % 1.4);
      scanLine.position.y = scanY;
      scanLine.material.opacity = 0.5 + Math.sin(t * 12) * 0.25;

      // Panel title glow pulse
      titleBar.material.emissiveIntensity = 0.25 + Math.sin(t * 1.8) * 0.12;
    };
  }

  /* ═══════════════════════════════════════════════════════════════
     6. LOGISTIK — Delivery truck + warehouse shelves + road
  ═══════════════════════════════════════════════════════════════ */
  function buildTruckWarehouse() {
    const root = add(new THREE.Group());
    root.rotation.y = -0.2;
    root.position.set(0.3, -0.2, 0);

    const whiteMat  = mat(0xfafafa, { roughness: 0.5 });
    const orangeMat = mat(0xff7700, { roughness: 0.4, metalness: 0.1 });
    const darkMat2  = mat(0x222233, { roughness: 0.6 });
    const wheelMat  = mat(0x1a1a1a, { roughness: 0.9 });
    const rimMat    = mat(0xccddee, { roughness: 0.2, metalness: 0.7 });
    const glassTruck = mat(0x99ccdd, { transparent: true, opacity: 0.5, roughness: 0.05 });
    const roadMat   = mat(0x333344, { roughness: 0.8 });
    const steelMat3 = mat(0x8899aa, { roughness: 0.3, metalness: 0.6 });
    const woodMat   = mat(0xb8865a, { roughness: 0.7 });

    // Road
    const road = mesh(new THREE.BoxGeometry(9, 0.06, 2.5), roadMat);
    road.position.set(0, -2.2, 0);
    add(road, root);
    for (let i = -3; i <= 3; i++) {
      const dash = mesh(new THREE.BoxGeometry(0.7, 0.07, 0.12), mat(0xeeddaa, { roughness: 0.5 }));
      dash.position.set(i * 1.15, -2.16, 0);
      add(dash, root);
    }
    [-1.22, 1.22].forEach(z => {
      const kerb = mesh(new THREE.BoxGeometry(9, 0.1, 0.12), mat(0xeeeedd, { roughness: 0.6 }));
      kerb.position.set(0, -2.17, z);
      add(kerb, root);
    });

    // Truck group
    const truck = new THREE.Group();
    truck.position.set(-1.6, -1.79, 0);
    add(truck, root);

    // Cargo box
    const cargo = mesh(new THREE.BoxGeometry(2.8, 1.4, 1.6), whiteMat);
    cargo.position.set(0.4, 0.7, 0);
    add(cargo, truck);
    const cargoFrame = mesh(new THREE.BoxGeometry(0.08, 1.4, 1.6), orangeMat);
    cargoFrame.position.set(-1.0, 0.7, 0);
    add(cargoFrame, truck);
    const stripe = mesh(new THREE.BoxGeometry(2.8, 0.22, 0.04), orangeMat);
    stripe.position.set(0.4, 1.3, 0.82);
    add(stripe, truck);

    // Cab
    const cab = mesh(new THREE.BoxGeometry(1.05, 1.2, 1.6), orangeMat);
    cab.position.set(-1.47, 0.6, 0);
    add(cab, truck);
    const fairing = mesh(new THREE.BoxGeometry(1.0, 0.28, 1.55), mat(0xff8811, { roughness: 0.4 }));
    fairing.position.set(-1.47, 1.34, 0);
    add(fairing, truck);
    const windshield = mesh(new THREE.BoxGeometry(0.06, 0.65, 1.1), glassTruck);
    windshield.position.set(-0.99, 0.76, 0);
    add(windshield, truck);
    [[0.62], [-0.62]].forEach(([z]) => {
      const hl = mesh(new THREE.BoxGeometry(0.08, 0.18, 0.28), mat(0xffffcc, { emissive: 0xffffaa, emissiveIntensity: 0.6 }));
      hl.position.set(-2.0, 0.28, z);
      add(hl, truck);
    });
    const bumper = mesh(new THREE.BoxGeometry(0.12, 0.22, 1.6), steelMat3);
    bumper.position.set(-2.04, 0.11, 0);
    add(bumper, truck);

    // Wheels
    const wheelPositions = [
      { x: -1.7, z:  0.88 }, { x: -1.7, z: -0.88 },
      { x:  0.3, z:  0.92 }, { x:  0.3, z: -0.92 },
      { x:  0.8, z:  0.92 }, { x:  0.8, z: -0.92 },
    ];
    const wheelMeshes = wheelPositions.map(({ x, z }) => {
      const wGroup = new THREE.Group();
      wGroup.position.set(x, 0, z);
      add(wGroup, truck);
      const tire = mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.28, 20), wheelMat);
      tire.rotation.x = Math.PI / 2;
      add(tire, wGroup);
      const rim = mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.3, 16), rimMat);
      rim.rotation.x = Math.PI / 2;
      add(rim, wGroup);
      for (let b = 0; b < 5; b++) {
        const ba = (b / 5) * Math.PI * 2;
        const bolt = mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.32, 6), mat(0x889999));
        bolt.rotation.x = Math.PI / 2;
        bolt.position.set(Math.cos(ba) * 0.14, 0, Math.sin(ba) * 0.14);
        add(bolt, wGroup);
      }
      return wGroup;
    });

    // Cargo boxes
    [[-0.4, 0], [0.2, 0], [-0.1, 0.38]].forEach(([relX, relY]) => {
      const b = mesh(new THREE.BoxGeometry(0.42, 0.42, 0.42), mat(0xcc9944, { roughness: 0.7 }));
      b.position.set(0.4 + relX, 0.21 + relY, 0);
      add(b, truck);
    });

    // Warehouse
    const whGroup = new THREE.Group();
    whGroup.position.set(2.6, -2.2, -0.3);
    add(whGroup, root);

    const whFloor = mesh(new THREE.BoxGeometry(3.8, 0.08, 2.4), mat(0x9999aa, { roughness: 0.7 }));
    add(whFloor, whGroup);
    const backWall = mesh(new THREE.BoxGeometry(3.8, 3.2, 0.1), mat(0xddddee, { roughness: 0.7 }));
    backWall.position.set(0, 1.6, -1.15);
    add(backWall, whGroup);
    const sideWall = mesh(new THREE.BoxGeometry(0.1, 3.2, 2.4), mat(0xccccdd, { roughness: 0.7 }));
    sideWall.position.set(1.9, 1.6, 0);
    add(sideWall, whGroup);

    // Shelving
    const shelfUnit = new THREE.Group();
    shelfUnit.position.set(-0.2, 0, -0.8);
    add(shelfUnit, whGroup);

    [0.55, 1.2, 1.88].forEach((y) => {
      const shelf = mesh(new THREE.BoxGeometry(3.0, 0.07, 0.7), woodMat);
      shelf.position.y = y;
      add(shelf, shelfUnit);
    });
    [-1.45, 0, 1.45].forEach(x => {
      const upright = mesh(new THREE.BoxGeometry(0.06, 2.4, 0.7), steelMat3);
      upright.position.set(x, 1.2, 0);
      add(upright, shelfUnit);
    });

    const boxColors2 = [0xff6644, 0x4488ff, 0x44cc88, 0xffcc33, 0xcc44ff, 0xff4488];
    let colorIdx = 0;
    [0.55, 1.2, 1.88].forEach((y) => {
      for (let b = 0; b < 5; b++) {
        const bW2 = 0.3 + Math.random() * 0.25;
        const bH2 = 0.25 + Math.random() * 0.2;
        const bD2 = 0.25 + Math.random() * 0.2;
        const box = mesh(new THREE.BoxGeometry(bW2, bH2, bD2), mat(boxColors2[colorIdx % boxColors2.length], { roughness: 0.6 }));
        box.position.set(-1.1 + b * 0.48, y + 0.07 + bH2 / 2, 0);
        add(box, shelfUnit);
        colorIdx++;
      }
    });

    // Forklift
    const forkGroup = new THREE.Group();
    forkGroup.position.set(0.8, 0.0, 0.6);
    forkGroup.rotation.y = -0.5;
    add(forkGroup, whGroup);

    const flBody = mesh(new THREE.BoxGeometry(0.7, 0.55, 1.0), mat(0xffcc00, { roughness: 0.4 }));
    flBody.position.y = 0.275;
    add(flBody, forkGroup);
    const mast = mesh(new THREE.BoxGeometry(0.08, 1.8, 0.08), steelMat3);
    mast.position.set(0.3, 0.9, -0.45);
    add(mast, forkGroup);
    [-0.14, 0.14].forEach(z => {
      const fork = mesh(new THREE.BoxGeometry(0.6, 0.05, 0.07), steelMat3);
      fork.position.set(0.6, 0.3, z - 0.45);
      add(fork, forkGroup);
    });
    [0.5, -0.5].forEach(z => {
      const w = mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.14, 12), wheelMat);
      w.rotation.z = Math.PI / 2;
      w.position.set(0, 0.14, z);
      add(w, forkGroup);
    });

    let t = 0;
    animFn = function () {
      t += 0.016;
      truck.position.y = -1.79 + Math.sin(t * 1.2) * 0.018;
      truck.position.x = -1.6 + Math.sin(t * 0.2) * 0.04;
      wheelMeshes.forEach((w) => { w.rotation.z += 0.04; });
      root.rotation.y = -0.2 + Math.sin(t * 0.22) * 0.18;
      mast.position.y = 0.9 + Math.sin(t * 0.5) * 0.3;
    };
  }

  /* ═══════════════════════════════════════════════════════════════
     7. PULVER & SACHETS — Sachet pouch inflating as powder rains in
  ═══════════════════════════════════════════════════════════════ */
  function buildPulverSachets() {
    /* Auger powder filling machine — inspired by industrial stainless steel
       auger fillers: large hopper on top, screw auger, conveyor with sachets */
    const root = add(new THREE.Group());
    root.position.set(0, -0.1, 0);
    root.rotation.y = -0.25;

    const steel   = mat(0xccd8e8, { roughness: 0.14, metalness: 0.88 });
    const dkSteel = mat(0x8899aa, { roughness: 0.28, metalness: 0.75 });
    const frame   = mat(0xaabccc, { roughness: 0.20, metalness: 0.82 });

    // Platform disc
    add(mesh(new THREE.CylinderGeometry(3.1, 3.1, 0.06, 64),
      mat(0x080f18, { roughness: 0.5, metalness: 0.7 }))).position.y = -2.2;
    const platRing = mesh(new THREE.TorusGeometry(2.95, 0.016, 8, 80),
      mat(0xaa33ff, { emissive: 0x6600cc, emissiveIntensity: 1.0, roughness: 0.2 }));
    platRing.rotation.x = Math.PI / 2; platRing.position.y = -2.17;
    add(platRing, root);

    // ── Machine base cabinet ──────────────────────────────────
    const base = mesh(new THREE.BoxGeometry(3.2, 1.1, 1.3), steel);
    base.position.set(0, -1.6, 0); add(base, root);
    // Front panel inset
    const panel = mesh(new THREE.BoxGeometry(2.8, 0.7, 0.04), dkSteel);
    panel.position.set(0, -1.6, 0.67); add(panel, root);
    // Logo strip
    const logo = mesh(new THREE.BoxGeometry(0.7, 0.18, 0.02),
      mat(0xaabbdd, { roughness: 0.4, metalness: 0.5 }));
    logo.position.set(0, -1.62, 0.69); add(logo, root);
    // Casters
    [[-1.45, -0.55], [-1.45, 0.55], [1.45, -0.55], [1.45, 0.55]].forEach(([x, z]) => {
      const w = mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.07, 12),
        mat(0x222233, { roughness: 0.9 }));
      w.rotation.z = Math.PI / 2; w.position.set(x, -2.18, z); add(w, root);
    });

    // ── Frame posts (4 vertical columns) ─────────────────────
    [[-1.35, -0.58], [-1.35, 0.58], [1.35, -0.58], [1.35, 0.58]].forEach(([x, z]) => {
      const p = mesh(new THREE.BoxGeometry(0.09, 3.6, 0.09), frame);
      p.position.set(x, 0.0, z); add(p, root);
    });
    // Top horizontal rails
    [0.58, -0.58].forEach(z => {
      const r = mesh(new THREE.BoxGeometry(2.82, 0.07, 0.07), frame);
      r.position.set(0, 1.78, z); add(r, root);
    });
    [-1.35, 1.35].forEach(x => {
      const r = mesh(new THREE.BoxGeometry(0.07, 0.07, 1.26), frame);
      r.position.set(x, 1.78, 0); add(r, root);
    });
    // Mid rails
    [0.58, -0.58].forEach(z => {
      const r = mesh(new THREE.BoxGeometry(2.82, 0.06, 0.06), frame);
      r.position.set(0, -0.02, z); add(r, root);
    });

    // Clear side panels
    const glassM = mat(0x99ccff, { transparent: true, opacity: 0.10, roughness: 0.0 });
    [-1.33, 1.33].forEach(x => {
      const g = mesh(new THREE.BoxGeometry(0.03, 1.68, 1.24), glassM);
      g.position.set(x, 0.86, 0); add(g, root);
    });

    // ── Hopper (large inverted cone) ─────────────────────────
    const hopperMat = mat(0xddeeff, { roughness: 0.10, metalness: 0.92 });
    const hopper = mesh(new THREE.ConeGeometry(0.85, 1.3, 28), hopperMat);
    hopper.rotation.z = Math.PI; hopper.position.set(0, 2.48, 0); add(hopper, root);
    // Hopper top rim ring
    const hRim = mesh(new THREE.TorusGeometry(0.86, 0.045, 8, 32), hopperMat);
    hRim.rotation.x = Math.PI / 2; hRim.position.set(0, 3.13, 0); add(hRim, root);
    // Hopper body cylinder (transition)
    const hBody = mesh(new THREE.CylinderGeometry(0.86, 0.86, 0.18, 28), hopperMat);
    hBody.position.set(0, 3.04, 0); add(hBody, root);

    // ── Auger housing (cylinder) ──────────────────────────────
    const housing = mesh(new THREE.CylinderGeometry(0.175, 0.175, 1.55, 20),
      mat(0xbbccdd, { roughness: 0.12, metalness: 0.88 }));
    housing.position.set(0, 1.05, 0); add(housing, root);
    // Housing clamp rings
    [0.3, 0.9].forEach(y => {
      const clamp = mesh(new THREE.TorusGeometry(0.2, 0.028, 8, 24),
        mat(0x889aaa, { roughness: 0.25, metalness: 0.7 }));
      clamp.rotation.x = Math.PI / 2; clamp.position.set(0, y, 0); add(clamp, root);
    });

    // ── Auger screw (spinning group inside housing) ───────────
    const augerGrp = new THREE.Group();
    augerGrp.position.set(0, 1.05, 0); add(augerGrp, root);
    // Shaft
    add(mesh(new THREE.CylinderGeometry(0.028, 0.028, 1.5, 8),
      mat(0x99aacc, { metalness: 0.9, roughness: 0.1 })), augerGrp);
    // Screw flights (8 staggered torus rings)
    for (let i = 0; i < 8; i++) {
      const flight = mesh(new THREE.TorusGeometry(0.13, 0.022, 6, 22),
        mat(0x8899bb, { roughness: 0.25, metalness: 0.75 }));
      flight.position.y = -0.62 + i * 0.18;
      flight.rotation.x = Math.PI / 2;
      flight.rotation.z = (i / 8) * Math.PI * 2;
      add(flight, augerGrp);
    }

    // Nozzle tip (bottom of auger)
    const nozzTipMat = mat(0xaa66dd, { emissive: 0x551199, emissiveIntensity: 0.5, roughness: 0.18 });
    const nozzTip = mesh(new THREE.CylinderGeometry(0.1, 0.065, 0.22, 14), nozzTipMat);
    nozzTip.position.set(0, 0.22, 0); add(nozzTip, root);

    // ── Conveyor belt ─────────────────────────────────────────
    const belt = mesh(new THREE.BoxGeometry(3.3, 0.13, 0.88), mat(0x556677, { roughness: 0.65, metalness: 0.3 }));
    belt.position.set(0, -0.95, 0); add(belt, root);
    [-1.55, 1.55].forEach(x => {
      const roller = mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.88, 16), dkSteel);
      roller.rotation.z = Math.PI / 2; roller.position.set(x, -0.95, 0); add(roller, root);
    });
    // Belt lane markers
    for (let i = -2; i <= 2; i++) {
      const mark = mesh(new THREE.BoxGeometry(0.04, 0.04, 0.82),
        mat(0x6677aa, { roughness: 0.6 }));
      mark.position.set(i * 0.65, -0.88, 0); add(mark, root);
    }

    // ── Sachets on conveyor ───────────────────────────────────
    const sachets = [];
    const sachetBodyMat = mat(0xaa77ee, { transparent: true, opacity: 0.72, roughness: 0.3 });
    const sachetSealMat = mat(0x7744bb, { roughness: 0.3 });
    for (let i = 0; i < 4; i++) {
      const sg = new THREE.Group();
      sg.position.set(-1.5 + i * 1.0, -0.78, 0);
      const body = mesh(new THREE.BoxGeometry(0.52, 0.22, 0.62), sachetBodyMat.clone());
      add(body, sg);
      [0.11, -0.11].forEach(y => {
        const seal = mesh(new THREE.BoxGeometry(0.52, 0.03, 0.62), sachetSealMat);
        seal.position.y = y; add(seal, sg);
      });
      add(sg, root); sachets.push(sg);
    }

    // ── Control panel + arm ───────────────────────────────────
    const armPost = mesh(new THREE.BoxGeometry(0.06, 1.4, 0.06), frame);
    armPost.position.set(1.95, 0.6, 0); add(armPost, root);
    const armH = mesh(new THREE.BoxGeometry(0.68, 0.06, 0.06), frame);
    armH.position.set(1.64, 1.38, 0); add(armH, root);
    const cpanel = mesh(new THREE.BoxGeometry(0.62, 0.52, 0.08),
      mat(0x1a2535, { roughness: 0.5 }));
    cpanel.position.set(1.32, 1.22, 0); cpanel.rotation.y = 0.28; add(cpanel, root);
    const screenMat = mat(0x081528, { emissive: 0x002244, emissiveIntensity: 0.5 });
    const scr = mesh(new THREE.BoxGeometry(0.42, 0.30, 0.01), screenMat);
    scr.position.set(1.28, 1.24, 0.05); scr.rotation.y = 0.28; add(scr, root);
    // Data bars on screen
    [[0.18, 0xee4444], [0.28, 0x44ee88], [0.22, 0x4488ee], [0.35, 0xeecc44]].forEach(([h, c], i) => {
      const b = mesh(new THREE.BoxGeometry(0.038, h * 0.18, 0.005),
        mat(c, { emissive: c, emissiveIntensity: 0.7 }));
      b.position.set(1.22 + i * 0.055, 1.19, 0.055); b.rotation.y = 0.28; add(b, root);
    });
    const eBtnMat = mat(0xff2222, { emissive: 0xcc0000, emissiveIntensity: 0.6 });
    const eBtn = mesh(new THREE.SphereGeometry(0.042, 10, 10), eBtnMat);
    eBtn.position.set(1.28, 0.97, 0.06); eBtn.rotation.y = 0.28; add(eBtn, root);

    // ── Powder particles (through housing → into sachet) ──────
    const pCols = [0xeeddff, 0xddccee, 0xffeeff, 0xccbbdd];
    const particles = [];
    for (let i = 0; i < 20; i++) {
      const p = mesh(new THREE.SphereGeometry(0.022 + Math.random() * 0.018, 5, 4),
        mat(pCols[i % pCols.length], { transparent: true, opacity: 0.65 + Math.random() * 0.35, roughness: 0.88 }));
      p.position.set((Math.random() - 0.5) * 0.22, 0.0 + Math.random() * 2.8, (Math.random() - 0.5) * 0.14);
      p.userData.vy = 0.009 + Math.random() * 0.012;
      p.userData.ph = Math.random() * Math.PI * 2;
      add(p, root); particles.push(p);
    }

    animFn = () => {
      const t = Date.now() * 0.001;

      // Auger spins
      augerGrp.rotation.y += 0.055;

      // Powder falls through housing
      particles.forEach(p => {
        p.position.y -= p.userData.vy;
        if (p.position.y < -0.82) { p.position.y = 1.8 + Math.random() * 1.0; p.position.x = (Math.random() - 0.5) * 0.16; }
      });

      // Sachets scroll on belt
      sachets.forEach(s => {
        s.position.x -= 0.005;
        if (s.position.x < -1.8) s.position.x = 1.8;
      });

      // Nozzle tip pulses
      nozzTipMat.emissiveIntensity = 0.3 + Math.sin(t * 7) * 0.25;
      // Screen flickers
      screenMat.emissiveIntensity = 0.4 + Math.sin(t * 3.5) * 0.15;
      // Ebutton pulses
      eBtnMat.emissiveIntensity = 0.4 + Math.sin(t * 1.8) * 0.3;
      // Platform ring breathes
      platRing.material.emissiveIntensity = 0.8 + Math.sin(t * 1.2) * 0.35;

      root.rotation.y = -0.25 + Math.sin(t * 0.22) * 0.20;
      root.position.y = -0.1 + Math.sin(t * 0.45) * 0.07;
    };
  }

  /* ── Scene router ──────────────────────────────────────────── */
  ({
    produktentwicklung: buildFlask,
    lohnabfuellung:    buildFillingMachine,
    verpackung:        buildPackagingBox,
    qualitaet:         buildQualityCert,
    analysen:          buildMicroscope,
    logistik:          buildTruckWarehouse,
    pulver:            buildPulverSachets,
  }[sceneName] || function () {})();
})();
