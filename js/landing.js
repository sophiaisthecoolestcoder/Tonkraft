/* ============================================================
   Tonkraft — landing + story
   One canvas engine drives two sections: the landing (wave +
   ripples + reveal) and the story (same wave as a character
   that quiets or swells according to the current beat).
   ============================================================ */

(() => {
  "use strict";

  const body = document.body;
  const HTML = document.documentElement;
  const REDUCED =
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Vishuddha blue — matches --indigo in CSS.
  const RGB = "28, 82, 138";

  // -----------------------------------------------------------
  //  Language (DE / EN)
  // -----------------------------------------------------------
  const TITLES = {
    de: "Tonkraft — Klang, Resonanz, Grundton",
    en: "Tonkraft — Sound, Resonance, Fundamental Tone",
  };
  const DESCRIPTIONS = {
    de: "Tonkraft — Institut für Sonologie. Klang, Resonanz und der Persönliche Grundton.",
    en: "Tonkraft — Institute of Sonology. Sound, resonance, and the personal fundamental tone.",
  };
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
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      body.classList.remove("is-loading");
      body.classList.add("is-ready");
    });
  });

  // -----------------------------------------------------------
  //  Wave / ripple renderer — one instance per canvas.
  //
  //  Each controller owns its own canvas, cursor state, ripples
  //  and a set of target parameters. Params are smoothed toward
  //  their targets frame-by-frame, so calls to updateTargets()
  //  produce gentle transitions rather than jumps.
  // -----------------------------------------------------------
  function createWaveRenderer(section, canvas, initial) {
    const ctx = canvas.getContext("2d", { alpha: true });
    let w = 0,
      h = 0,
      dpr = 1;

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = section.getBoundingClientRect();
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

    // cursor: normalized roughly -0.5..0.5, relative to section
    const target = Object.assign(
      {
        amp1: 1,
        amp2: 1,
        freq1: 1,
        freq2: 1,
        alpha1: 0.55,
        alpha2: 0.13,
        rippleInterval: 2600,
        yShift: 0,
      },
      initial || {}
    );
    const params = Object.assign({}, target);

    const cursor = { x: 0, y: 0 };
    const cursorTarget = { x: 0, y: 0 };
    section.addEventListener("pointermove", (e) => {
      const rect = section.getBoundingClientRect();
      cursorTarget.x = (e.clientX - rect.left) / Math.max(w, 1) - 0.5;
      cursorTarget.y = (e.clientY - rect.top) / Math.max(h, 1) - 0.5;
    });
    section.addEventListener("pointerleave", () => {
      cursorTarget.x = 0;
      cursorTarget.y = 0;
    });

    const ripples = [];
    const start = performance.now();
    let lastAutoRipple = start - 2000;

    function spawnRipple(x, y, opts) {
      ripples.push({
        born: performance.now(),
        x: typeof x === "number" ? x : w * 0.5,
        y: typeof y === "number" ? y : h * 0.46,
        big: !!(opts && opts.big),
      });
    }

    function bloomAt(t) {
      const k = Math.min(1, Math.max(0, (t - start - 400) / 1600));
      return 1 - Math.pow(1 - k, 3);
    }

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

    function drawRipples(t, bloom) {
      const maxR = Math.min(w, h) * 0.48;
      for (let i = ripples.length - 1; i >= 0; i--) {
        const rp = ripples[i];
        const life = rp.big ? 8000 : 6400;
        const age = (t - rp.born) / life;
        if (age >= 1) {
          ripples.splice(i, 1);
          continue;
        }
        const r = (1 - Math.pow(1 - age, 3)) * maxR * (rp.big ? 1.5 : 1);
        const a = (rp.big ? 0.3 : 0.2) * Math.sin(age * Math.PI) * bloom;
        ctx.beginPath();
        ctx.arc(rp.x, rp.y, r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${RGB}, ${a})`;
        ctx.lineWidth = rp.big ? 1.4 : 1;
        ctx.stroke();
      }
    }

    function lerpTo(obj, tgt, f) {
      for (const k in tgt) {
        if (typeof tgt[k] === "number") {
          obj[k] = obj[k] + (tgt[k] - obj[k]) * f;
        } else {
          obj[k] = tgt[k];
        }
      }
    }

    function frame(t) {
      lerpTo(cursor, cursorTarget, 0.045);
      lerpTo(params, target, 0.03);

      ctx.clearRect(0, 0, w, h);
      const bloom = bloomAt(t);
      const breath = 0.6 + 0.4 * Math.sin(t * 0.00055);

      const cx = w * 0.5 + cursor.x * 16;
      const cy = h * (0.46 + params.yShift) + cursor.y * 10;

      if (t - lastAutoRipple > params.rippleInterval) {
        spawnRipple(cx, cy);
        lastAutoRipple = t;
      }
      drawRipples(t, bloom);

      const yCenter = h * 0.5;
      const ampBase1 = Math.min(h * 0.08, 52);
      const amp1 =
        ampBase1 * breath * bloom * params.amp1 * (1 + cursor.y * 0.35);
      const freq1 = 0.0055 * params.freq1 + cursor.x * 0.0007;
      const phase1 = t * 0.00022 + cursor.x * 0.7;
      drawWave(yCenter, amp1, freq1, phase1, 0, params.alpha1, 1.4);

      const ampBase2 = Math.min(h * 0.11, 72);
      const amp2 =
        ampBase2 *
        (0.7 + 0.3 * Math.sin(t * 0.00033)) *
        bloom *
        params.amp2;
      const freq2 = 0.0032 * params.freq2 + cursor.x * 0.00035;
      const phase2 = -t * 0.00013 + cursor.x * 0.35;
      drawWave(yCenter + 22, amp2, freq2, phase2, 1.3, params.alpha2, 1);

      requestAnimationFrame(frame);
    }

    return {
      get size() {
        return { w, h };
      },
      updateTargets(partial) {
        Object.assign(target, partial || {});
      },
      spawnRipple,
      getCtxOffsetForEvent(e) {
        const rect = canvas.getBoundingClientRect();
        return { x: e.clientX - rect.left, y: e.clientY - rect.top };
      },
      start() {
        requestAnimationFrame(frame);
      },
    };
  }

  // -----------------------------------------------------------
  //  Landing
  // -----------------------------------------------------------
  const landing = document.getElementById("landing");
  const landingCanvas = landing && landing.querySelector(".landing__wave");

  let landingInView = true;
  if (landing && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      ([entry]) => {
        landingInView = entry.intersectionRatio > 0.5;
      },
      { threshold: [0.5] }
    );
    io.observe(landing);
  }

  function advanceFromLanding() {
    if (!landingInView) return;
    body.classList.add("is-leaving");
    const next = document.getElementById("next");
    if (next) {
      next.scrollIntoView({
        behavior: REDUCED ? "auto" : "smooth",
        block: "start",
      });
    }
    window.setTimeout(() => body.classList.remove("is-leaving"), 1400);
  }

  if (landing) {
    landing.addEventListener("click", advanceFromLanding);
  }
  window.addEventListener("keydown", (e) => {
    if (!landingInView) return;
    if (
      e.key === "Enter" ||
      e.key === " " ||
      e.key === "ArrowDown" ||
      e.key === "PageDown"
    ) {
      e.preventDefault();
      advanceFromLanding();
    }
  });

  let landingWave = null;
  if (!REDUCED && landingCanvas) {
    landingWave = createWaveRenderer(landing, landingCanvas, {
      amp1: 1,
      amp2: 1,
      freq1: 1,
      freq2: 1,
      alpha1: 0.55,
      alpha2: 0.13,
      rippleInterval: 2600,
    });
    landingWave.start();
  }

  // -----------------------------------------------------------
  //  Story — six beats, tap-driven. The wave is a character.
  //
  //  Beat 1: mythic framing (normal wave)
  //  Beat 2: embodied / vibrating (quicker, higher freq)
  //  Beat 3: wordless naming — seal swells; a big ripple from it
  //  Beat 4: the naming lands (wave intimate, lower amp)
  //  Beat 5: the question (wave almost silent — listening)
  //  Beat 6: the invitation (wave fullest, most expansive)
  // -----------------------------------------------------------
  const story = document.getElementById("next");
  if (story) {
    const storyCanvas = story.querySelector(".story__wave");
    const beats = Array.from(story.querySelectorAll(".story__beat"));
    const TOTAL = beats.length;
    let beatIndex = 1;
    let lock = false;

    const BEAT_PARAMS = {
      1: { amp1: 1.0, amp2: 1.0, freq1: 1.0, freq2: 1.0, alpha1: 0.55, alpha2: 0.13, rippleInterval: 2600 },
      2: { amp1: 1.15, amp2: 1.05, freq1: 1.35, freq2: 1.2, alpha1: 0.55, alpha2: 0.14, rippleInterval: 2000 },
      3: { amp1: 1.25, amp2: 1.35, freq1: 0.9, freq2: 0.9, alpha1: 0.5, alpha2: 0.16, rippleInterval: 3200 },
      4: { amp1: 0.7, amp2: 0.85, freq1: 0.85, freq2: 0.9, alpha1: 0.48, alpha2: 0.12, rippleInterval: 3000 },
      5: { amp1: 0.35, amp2: 0.6, freq1: 0.75, freq2: 0.8, alpha1: 0.36, alpha2: 0.1, rippleInterval: 4200 },
      6: { amp1: 1.3, amp2: 1.25, freq1: 1.0, freq2: 1.0, alpha1: 0.6, alpha2: 0.15, rippleInterval: 2300 },
    };

    let storyWave = null;
    if (!REDUCED && storyCanvas) {
      storyWave = createWaveRenderer(story, storyCanvas, BEAT_PARAMS[1]);
      storyWave.start();
    }

    function setBeat(n) {
      beatIndex = Math.max(1, Math.min(TOTAL, n));
      beats.forEach((b) => {
        b.classList.toggle(
          "is-active",
          parseInt(b.dataset.beat, 10) === beatIndex
        );
      });
      story.classList.toggle("is-beat-3", beatIndex === 3);
      story.classList.toggle("is-end", beatIndex === TOTAL);

      if (storyWave) {
        storyWave.updateTargets(BEAT_PARAMS[beatIndex]);
        // The wordless naming — one prominent ripple from the seal's
        // resting spot (upper centre), arriving as it swells.
        if (beatIndex === 3) {
          const { w, h } = storyWave.size;
          storyWave.spawnRipple(w * 0.5, h * 0.12, { big: true });
        }
      }
    }

    function advanceStory(e) {
      if (lock) return;
      if (beatIndex >= TOTAL) return;
      lock = true;
      if (storyWave && e && typeof e.clientX === "number") {
        const { x, y } = storyWave.getCtxOffsetForEvent(e);
        storyWave.spawnRipple(x, y);
      }
      setBeat(beatIndex + 1);
      window.setTimeout(() => {
        lock = false;
      }, 380);
    }

    story.addEventListener("click", advanceStory);
    window.addEventListener("keydown", (e) => {
      if (landingInView) return;
      if (beatIndex >= TOTAL) return;
      if (
        e.key === "Enter" ||
        e.key === " " ||
        e.key === "ArrowDown" ||
        e.key === "PageDown"
      ) {
        e.preventDefault();
        advanceStory();
      }
    });
  }
})();
