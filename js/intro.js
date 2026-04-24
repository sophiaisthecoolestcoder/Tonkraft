(() => {
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
})();

(function initRipples() {
  if (typeof window.jQuery === "undefined") return;

  window.jQuery(function ($) {
    const $intro = $(".intro");
    if (!$intro.length || !$.fn.ripples) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    try {
      $intro.ripples({
        resolution: 512,
        perturbance: 0.035,
        dropRadius: 22,
        interactive: true,
      });
    } catch (_err) {
      // No WebGL — just leave the static background.
      return;
    }

    function randomDrop(radius, strength) {
      const w = $intro.outerWidth();
      const h = $intro.outerHeight();
      if (w <= 0 || h <= 0) return;
      const pad = 0.14;
      const x = w * (pad + Math.random() * (1 - 2 * pad));
      const y = h * (pad + Math.random() * (1 - 2 * pad));
      $intro.ripples("drop", x, y, radius, strength);
    }

    // A few seeded drops as the page settles in.
    const seed = 4;
    for (let i = 0; i < seed; i++) {
      setTimeout(() => randomDrop(28, 0.05), 220 + i * 650);
    }

    // Keep the surface quietly alive.
    setInterval(() => {
      if (document.hidden) return;
      const r = 18 + Math.random() * 18;
      const s = 0.03 + Math.random() * 0.025;
      randomDrop(r, s);
    }, 3200);
  });
})();
