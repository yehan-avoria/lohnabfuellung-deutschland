/* ============================================================
   THREE.JS HERO SCENE - Avoria GmbH
   Floating molecular particle network
   ============================================================ */

(function () {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  // ---- Scene setup ----
  const scene = new THREE.Scene();
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 60;

  // ---- Color palette ----
  const GOLD  = new THREE.Color(0x4aaee8);   // bright light-blue (visible on dark hero)
  const NAVY  = new THREE.Color(0x065192);   // logo blue
  const BLUE  = new THREE.Color(0x1a7dc8);   // medium blue

  // ---- Particles ----
  const PARTICLE_COUNT = 600;
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  const colors    = new Float32Array(PARTICLE_COUNT * 3);
  const sizes     = new Float32Array(PARTICLE_COUNT);
  const velocities = [];

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const x = (Math.random() - 0.5) * 140;
    const y = (Math.random() - 0.5) * 90;
    const z = (Math.random() - 0.5) * 70;

    positions[i * 3]     = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;

    const r = Math.random();
    let col = r < 0.40 ? NAVY : r < 0.70 ? BLUE : GOLD;
    colors[i * 3]     = col.r;
    colors[i * 3 + 1] = col.g;
    colors[i * 3 + 2] = col.b;

    sizes[i] = Math.random() * 1.8 + 0.4;

    velocities.push({
      x: (Math.random() - 0.5) * 0.018,
      y: (Math.random() - 0.5) * 0.012,
      z: (Math.random() - 0.5) * 0.009,
    });
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('color',    new THREE.BufferAttribute(colors, 3));
  geo.setAttribute('size',     new THREE.BufferAttribute(sizes, 1));

  const mat = new THREE.PointsMaterial({
    size: 0.45,
    vertexColors: true,
    transparent: true,
    opacity: 0.80,
    blending: THREE.NormalBlending,
    depthWrite: false,
  });

  const particles = new THREE.Points(geo, mat);
  scene.add(particles);

  // ---- Connection lines ----
  const LINE_DIST = 18;
  let lineGeo = new THREE.BufferGeometry();
  const lineMat = new THREE.LineSegmentsMaterial
    ? new THREE.LineBasicMaterial({ color: 0x065192, transparent: true, opacity: 0.18, blending: THREE.NormalBlending })
    : null;
  let lines = null;

  function buildLines() {
    const verts = [];
    const pos = geo.attributes.position.array;
    for (let a = 0; a < PARTICLE_COUNT; a++) {
      for (let b = a + 1; b < PARTICLE_COUNT; b++) {
        const dx = pos[a*3]   - pos[b*3];
        const dy = pos[a*3+1] - pos[b*3+1];
        const dz = pos[a*3+2] - pos[b*3+2];
        const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);
        if (dist < LINE_DIST) {
          verts.push(pos[a*3], pos[a*3+1], pos[a*3+2]);
          verts.push(pos[b*3], pos[b*3+1], pos[b*3+2]);
        }
      }
    }
    return new Float32Array(verts);
  }

  if (lineMat) {
    lineGeo.setAttribute('position', new THREE.BufferAttribute(buildLines(), 3));
    lines = new THREE.LineSegments(lineGeo, lineMat);
    scene.add(lines);
  }

  // ---- Mouse parallax ----
  let mouseX = 0, mouseY = 0;
  let targetX = 0, targetY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth  - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  // ---- Large glowing sphere (ambient) ----
  const sphereGeo = new THREE.SphereGeometry(8, 32, 32);
  const sphereMat = new THREE.MeshBasicMaterial({
    color: 0x065192,
    transparent: true,
    opacity: 0.07,
    wireframe: false,
  });
  const sphere = new THREE.Mesh(sphereGeo, sphereMat);
  sphere.position.set(-20, 5, -10);
  scene.add(sphere);

  // Second sphere
  const sphere2 = new THREE.Mesh(
    new THREE.SphereGeometry(5, 24, 24),
    new THREE.MeshBasicMaterial({ color: 0x1a7dc8, transparent: true, opacity: 0.08 })
  );
  sphere2.position.set(30, -10, -20);
  scene.add(sphere2);

  // ---- Resize ----
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // ---- Animation ----
  let lineUpdateCounter = 0;
  let clock = 0;

  function animate() {
    requestAnimationFrame(animate);
    clock += 0.005;

    // Move particles
    const pos = geo.attributes.position.array;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      pos[i*3]   += velocities[i].x;
      pos[i*3+1] += velocities[i].y;
      pos[i*3+2] += velocities[i].z;

      if (Math.abs(pos[i*3])   > 70)  velocities[i].x *= -1;
      if (Math.abs(pos[i*3+1]) > 45)  velocities[i].y *= -1;
      if (Math.abs(pos[i*3+2]) > 35)  velocities[i].z *= -1;
    }
    geo.attributes.position.needsUpdate = true;

    // Update lines every 30 frames
    lineUpdateCounter++;
    if (lines && lineUpdateCounter % 30 === 0) {
      lineGeo.attributes.position = new THREE.BufferAttribute(buildLines(), 3);
      lineGeo.attributes.position.needsUpdate = true;
    }

    // Camera mouse follow
    targetX += (mouseX * 6 - targetX) * 0.025;
    targetY += (-mouseY * 4 - targetY) * 0.025;
    camera.position.x = targetX;
    camera.position.y = targetY;
    camera.lookAt(0, 0, 0);

    // Slow rotation
    particles.rotation.y = clock * 0.08;
    if (lines) lines.rotation.y = clock * 0.08;

    // Breathe spheres
    sphere.scale.setScalar(1 + Math.sin(clock * 0.7) * 0.06);
    sphere2.scale.setScalar(1 + Math.sin(clock * 0.5 + 1) * 0.06);

    renderer.render(scene, camera);
  }

  animate();
})();
