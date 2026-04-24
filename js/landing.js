/* ============================================================
   Tonkraft — landing
   Reveals the composition, then animates a slow breathing sine
   wave (the single living element). Any click, tap, scroll or
   key advances to the next section.
   ============================================================ */

(() => {
  "use strict";

  const body = document.body;
  const landing = document.getElementById("landing");
  const canvas = landing && landing.querySelector(".landing__wave");
  const next = document.getElementById("next");
  if (!landing || !canvas || !next) return;

  const REDUCED =
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // -----------------------------------------------------------
  //  Language (DE / EN)
  //  The html.lang-de|en class is set by an inline script in
  //  <head> before first paint. Here we wire the toggle buttons
  //  and keep derived attributes (title, aria-label) in sync.
  // -----------------------------------------------------------
  const TITLES = {
    de: "Tonkraft — Klang, Resonanz, Grundton",
    en: "Tonkraft — Sound, Resonance, Fundamental Tone",
  };
  const DESCRIPTIONS = {
    de: "Tonkraft — Institut für Sonologie. Klang, Resonanz und der Persönliche Grundton.",
    en: "Tonkraft — Institute of Sonology. Sound, resonance, and the personal fundamental tone.",
  };
  const HTML = document.documentElement;
  const langBtns = document.querySelectorAll(".lang-btn");
  const metaDesc = document.querySelector('meta[name="description"]');

  function currentLang() {
    return HTML.classList.contains("lang-en") ? "en" : "de";
  }

  function setLang(lang) {
    if (lang !== "en") lang = "de";
    HTML.classList.remove("lang-de", "lang-en");
    HTML.classList.add("lang-" + lang);
    HTML.setAttribute("lang", lang);
    document.title = TITLES[lang];
    if (metaDesc) metaDesc.setAttribute("content", DESCRIPTIONS[lang]);
    langBtns.forEach((b) =>
      b.setAttribute(
        "aria-pressed",
        b.dataset.lang === lang ? "true" : "false"
      )
    );
    try {
      localStorage.setItem("tonkraft:lang", lang);
    } catch (e) {
      /* ignore */
    }
  }

  // initialise derived state from whatever the inline script set
  setLang(currentLang());

  langBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      setLang(btn.dataset.lang);
    });
  });

  // -----------------------------------------------------------
  //  Reveal
  // -----------------------------------------------------------
  // Give the browser one frame so the initial (loading) styles
  // paint before we switch to the ready state — this guarantees
  // the transitions actually fire.
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      body.classList.remove("is-loading");
      body.classList.add("is-ready");
    });
  });

  // -----------------------------------------------------------
  //  Advance (click · tap · key)
  // -----------------------------------------------------------
  let landingInView = true;
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      ([entry]) => {
        landingInView = entry.intersectionRatio > 0.5;
      },
      { threshold: [0.5] }
    );
    io.observe(landing);
  }

  function advance() {
    if (!landingInView) return;
    body.classList.add("is-leaving");
    next.scrollIntoView({
      behavior: REDUCED ? "auto" : "smooth",
      block: "start",
    });
    window.setTimeout(() => body.classList.remove("is-leaving"), 1400);
  }

  landing.addEventListener("click", advance);
  window.addEventListener("keydown", (e) => {
    if (!landingInView) return;
    if (
      e.key === "Enter" ||
      e.key === " " ||
      e.key === "ArrowDown" ||
      e.key === "PageDown"
    ) {
      e.preventDefault();
      advance();
    }
  });

  // -----------------------------------------------------------
  //  The wave
  // -----------------------------------------------------------
  if (REDUCED) return;

  const ctx = canvas.getContext("2d", { alpha: true });
  let w = 0,
    h = 0,
    dpr = 1;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = landing.getBoundingClientRect();
    w = Math.max(1, rect.width);
    h = Math.max(1, rect.height);
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();

  let resizeTimer = 0;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(resize, 120);
  });

  // smoothed cursor, normalized to roughly -0.5..0.5
  const target = { x: 0, y: 0 };
  const cursor = { x: 0, y: 0 };
  let hasPointer = false;

  window.addEventListener("pointermove", (e) => {
    hasPointer = true;
    target.x = e.clientX / window.innerWidth - 0.5;
    target.y = e.clientY / window.innerHeight - 0.5;
  });
  window.addEventListener("pointerleave", () => {
    target.x = 0;
    target.y = 0;
  });
  document.addEventListener("visibilitychange", () => {
    // reset target when tab hidden so we don't snap on return
    target.x = 0;
    target.y = 0;
  });

  // Vishuddha blue (matches --indigo)
  const RGB = "28, 82, 138";

  function drawWave(yBase, amp, freq, phase, jitter, alpha, thick) {
    const segments = Math.max(80, Math.floor(w / 6));
    ctx.beginPath();
    for (let i = 0; i <= segments; i++) {
      const x = (i / segments) * w;
      const fx = x * freq;
      const y =
        yBase +
        Math.sin(fx + phase) * amp +
        Math.sin(fx * 1.73 + phase * 0.62 + jitter) * amp * 0.28;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    // horizontal gradient: fade to paper at both edges
    const grad = ctx.createLinearGradient(0, 0, w, 0);
    grad.addColorStop(0, `rgba(${RGB}, 0)`);
    grad.addColorStop(0.14, `rgba(${RGB}, ${alpha})`);
    grad.addColorStop(0.86, `rgba(${RGB}, ${alpha})`);
    grad.addColorStop(1, `rgba(${RGB}, 0)`);
    ctx.strokeStyle = grad;
    ctx.lineWidth = thick;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
  }

  // bloom factor: 0 → 1 over ~1.6s after ready, then stays at 1
  const start = performance.now();
  function bloomAt(t) {
    const k = Math.min(1, Math.max(0, (t - start - 600) / 1600));
    // ease-out-cubic
    return 1 - Math.pow(1 - k, 3);
  }

  // -----------------------------------------------------------
  //  Ripples — slow concentric rings from the composition center.
  //  Spatial counterpart to the linear wave: together they evoke
  //  the two ways sound actually propagates (time + space).
  // -----------------------------------------------------------
  const RIPPLE_LIFE = 6400;     // ms
  const RIPPLE_INTERVAL = 2600; // ms between spawns
  const ripples = [];
  let lastRipple = start - 2000; // first ring appears shortly after load

  function spawnRipple(t) {
    ripples.push({ born: t });
  }

  function drawRipples(t, cx, cy, bloom) {
    const maxR = Math.min(w, h) * 0.48;
    for (let i = ripples.length - 1; i >= 0; i--) {
      const age = (t - ripples[i].born) / RIPPLE_LIFE;
      if (age >= 1) {
        ripples.splice(i, 1);
        continue;
      }
      // ease-out-cubic on radius for a soft "push"
      const r = (1 - Math.pow(1 - age, 3)) * maxR;
      // bell curve on alpha: 0 → peak → 0
      const a = 0.2 * Math.sin(age * Math.PI) * bloom;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${RGB}, ${a})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }

  function frame(t) {
    // ease cursor toward target
    cursor.x += (target.x - cursor.x) * 0.045;
    cursor.y += (target.y - cursor.y) * 0.045;

    ctx.clearRect(0, 0, w, h);

    const bloom = bloomAt(t);
    const breath = 0.6 + 0.4 * Math.sin(t * 0.00055);
    const yCenter = h * 0.5;

    // ripples emanate from slightly above the geometric center,
    // so they appear to originate from the Aum seal / wordmark.
    const cx = w * 0.5 + cursor.x * 16;
    const cy = h * 0.46 + cursor.y * 10;
    if (t - lastRipple > RIPPLE_INTERVAL) {
      spawnRipple(t);
      lastRipple = t;
    }
    drawRipples(t, cx, cy, bloom);

    // primary wave: crisper, thinner, closer to ink
    const ampBase1 = Math.min(h * 0.08, 52);
    const amp1 = ampBase1 * breath * bloom * (1 + cursor.y * 0.35);
    const freq1 = 0.0055 + cursor.x * 0.0007;
    const phase1 = t * 0.00022 + cursor.x * 0.7;
    drawWave(yCenter, amp1, freq1, phase1, 0, 0.55, 1.4);

    // ghost wave: slower, larger, softer — adds resonance / depth
    const ampBase2 = Math.min(h * 0.11, 72);
    const amp2 =
      ampBase2 * (0.7 + 0.3 * Math.sin(t * 0.00033)) * bloom;
    const freq2 = 0.0032 + cursor.x * 0.00035;
    const phase2 = -t * 0.00013 + cursor.x * 0.35;
    drawWave(yCenter + 22, amp2, freq2, phase2, 1.3, 0.13, 1);

    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
