(() => {
  const canvas = document.getElementById("rippleCanvas");
  const nextBtn = document.querySelector(".intro-next");

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      const sel = nextBtn.dataset.scrollTo || "#after-intro";
      const target = document.querySelector(sel);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
      }
    });
  }

  if (!canvas || typeof canvas.getContext !== "function") return;

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  if (reduceMotion) return;

  const ctx = canvas.getContext("2d");
  let w = 0;
  let h = 0;
  let dpr = 1;

  function resize() {
    const rect = canvas.getBoundingClientRect();
    dpr = window.devicePixelRatio || 1;
    w = rect.width;
    h = rect.height;
    if (w === 0 || h === 0) return;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  resize();
  window.addEventListener("resize", resize);

  const SPEED = 52; // px / second
  const LIFETIME = 22000; // ms
  const RING_COUNT = 3;
  const RING_DELAY = 420; // ms between rings from the same drop
  const BASE_RGB = "36, 70, 120"; // muted slate blue — reads as water
  const MAX_ALPHA = 0.16;
  const MAX_DROPS = 8;

  const drops = [];

  function addDrop(x, y) {
    drops.push({ x, y, t0: performance.now() });
  }

  function addRandomDrop() {
    if (w <= 0 || h <= 0) return;
    const pad = 0.12;
    const rx = pad + Math.random() * (1 - 2 * pad);
    const ry = pad + Math.random() * (1 - 2 * pad);
    addDrop(w * rx, h * ry);
  }

  // Seed a few initial drops, gently staggered.
  const seedCount = 4;
  for (let i = 0; i < seedCount; i++) {
    setTimeout(addRandomDrop, 120 + i * 650);
  }

  // Keep the scene alive — a new drop every few seconds, capped.
  setInterval(() => {
    if (drops.length < MAX_DROPS) addRandomDrop();
  }, 3400);

  function drawRing(cx, cy, r, alpha) {
    if (alpha <= 0.002 || r <= 0) return;
    // Skip rings that are nowhere near the viewport.
    const margin = r + 2;
    if (cx + margin < 0) return;
    if (cx - margin > w) return;
    if (cy + margin < 0) return;
    if (cy - margin > h) return;
    // Skip rings that have already passed the farthest corner of the viewport.
    const fx = Math.max(cx, w - cx);
    const fy = Math.max(cy, h - cy);
    if (r > Math.sqrt(fx * fx + fy * fy) + 1) return;

    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(${BASE_RGB}, ${alpha})`;
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  function frame(now) {
    ctx.clearRect(0, 0, w, h);

    for (let i = drops.length - 1; i >= 0; i--) {
      const d = drops[i];
      const age = now - d.t0;
      const totalLife = LIFETIME + RING_DELAY * (RING_COUNT - 1);
      if (age > totalLife) {
        drops.splice(i, 1);
        continue;
      }

      for (let k = 0; k < RING_COUNT; k++) {
        const ringAge = age - k * RING_DELAY;
        if (ringAge < 0 || ringAge > LIFETIME) continue;

        const r = (ringAge / 1000) * SPEED;
        // Smooth ease-out fade across the ring's life.
        const p = ringAge / LIFETIME;
        const envelope = 1 - p * p; // eases out toward zero
        const ringAlpha = MAX_ALPHA * envelope * (1 - k * 0.22);

        // Original source.
        drawRing(d.x, d.y, r, ringAlpha);

        // First-order edge reflections (the "bounce").
        drawRing(-d.x, d.y, r, ringAlpha);
        drawRing(2 * w - d.x, d.y, r, ringAlpha);
        drawRing(d.x, -d.y, r, ringAlpha);
        drawRing(d.x, 2 * h - d.y, r, ringAlpha);

        // Second-order corner reflections, slightly dimmer.
        const cornerAlpha = ringAlpha * 0.85;
        drawRing(-d.x, -d.y, r, cornerAlpha);
        drawRing(2 * w - d.x, -d.y, r, cornerAlpha);
        drawRing(-d.x, 2 * h - d.y, r, cornerAlpha);
        drawRing(2 * w - d.x, 2 * h - d.y, r, cornerAlpha);
      }
    }

    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
})();
