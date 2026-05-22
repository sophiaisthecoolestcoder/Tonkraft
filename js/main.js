/* ============================================================================
   Tonkraft — shared progressive-enhancement script
   Vanilla ES module behavior; every feature degrades gracefully without it.
   ============================================================================ */
(function () {
  "use strict";

  var root = document.documentElement;
  root.classList.remove("no-js");
  root.classList.add("js");

  var LANG_KEY = "tonkraft:lang";
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- 1. Language toggle ------------------------------------------------- */
  function setLang(lang) {
    if (lang !== "de" && lang !== "en") lang = "de";
    root.classList.remove("lang-de", "lang-en");
    root.classList.add("lang-" + lang);
    root.lang = lang;
    try { localStorage.setItem(LANG_KEY, lang); } catch (e) {}
    document.querySelectorAll("[data-lang]").forEach(function (btn) {
      btn.setAttribute("aria-pressed", String(btn.getAttribute("data-lang") === lang));
    });
  }
  document.querySelectorAll("[data-lang]").forEach(function (btn) {
    btn.addEventListener("click", function () { setLang(btn.getAttribute("data-lang")); });
  });
  // sync button state to whatever the pre-paint script already chose
  (function () {
    var current = root.classList.contains("lang-en") ? "en" : "de";
    document.querySelectorAll("[data-lang]").forEach(function (btn) {
      btn.setAttribute("aria-pressed", String(btn.getAttribute("data-lang") === current));
    });
  })();

  /* ---- 2. Mobile navigation ---------------------------------------------- */
  var navToggle = document.querySelector(".navtoggle");
  var topnav = document.querySelector(".topnav");
  if (navToggle && topnav) {
    var closeNav = function () {
      topnav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    };
    navToggle.addEventListener("click", function () {
      var open = topnav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(open));
    });
    topnav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", closeNav);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeNav();
    });
    document.addEventListener("click", function (e) {
      if (topnav.classList.contains("is-open") &&
          !topnav.contains(e.target) && !navToggle.contains(e.target)) {
        closeNav();
      }
    });
  }

  /* ---- 3. Masthead scrolled state ---------------------------------------- */
  var masthead = document.querySelector(".masthead");
  if (masthead) {
    var onScroll = function () {
      masthead.classList.toggle("is-scrolled", window.scrollY > 10);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---- 4. Story-beat sequencer (landing) --------------------------------- */
  var beatsWrap = document.querySelector("[data-beats]");
  if (beatsWrap) {
    var beats = Array.prototype.slice.call(beatsWrap.querySelectorAll(".beat"));
    var dotsWrap = document.querySelector("[data-beat-dots]");
    var dots = dotsWrap ? Array.prototype.slice.call(dotsWrap.querySelectorAll(".story__dot")) : [];
    var activeIdx = 0;

    function activate(i) {
      if (i < 0 || i >= beats.length) return;
      activeIdx = i;
      beats.forEach(function (b, n) { b.classList.toggle("is-active", n === i); });
      dots.forEach(function (d, n) {
        d.classList.toggle("is-active", n === i);
        d.setAttribute("aria-current", n === i ? "true" : "false");
      });
    }

    // click / tap to focus a beat
    beats.forEach(function (b, i) {
      b.addEventListener("click", function () { activate(i); });
    });

    // dots: jump + scroll
    dots.forEach(function (d, i) {
      d.addEventListener("click", function () {
        activate(i);
        beats[i].scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
      });
    });

    // keyboard: arrows/space/enter advance, Home resets
    beatsWrap.setAttribute("tabindex", "0");
    beatsWrap.addEventListener("keydown", function (e) {
      if (["ArrowDown", "ArrowRight", " ", "Enter"].indexOf(e.key) !== -1) {
        e.preventDefault(); activate(Math.min(activeIdx + 1, beats.length - 1));
        beats[activeIdx].scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
      } else if (["ArrowUp", "ArrowLeft"].indexOf(e.key) !== -1) {
        e.preventDefault(); activate(Math.max(activeIdx - 1, 0));
        beats[activeIdx].scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
      } else if (e.key === "Home") {
        e.preventDefault(); activate(0);
        beats[0].scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
      }
    });

    // scroll: activate the beat nearest viewport centre
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) activate(beats.indexOf(entry.target));
        });
      }, { rootMargin: "-45% 0px -45% 0px", threshold: 0 });
      beats.forEach(function (b) { io.observe(b); });
    }
    activate(0);
  }

  /* ---- 5. Scroll reveal --------------------------------------------------- */
  var reveals = document.querySelectorAll(".reveal");
  if (reveals.length && "IntersectionObserver" in window && !reduceMotion) {
    var ro = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add("in-view"); obs.unobserve(entry.target); }
      });
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.05 });
    reveals.forEach(function (el) { ro.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in-view"); });
  }

  /* ---- 6. Biography gallery (Hintergrund) -------------------------------- */
  var portrait = document.querySelector("[data-bio-portrait]");
  if (portrait) {
    document.querySelectorAll("[data-bio-thumb]").forEach(function (thumb) {
      thumb.addEventListener("click", function () {
        portrait.src = thumb.src;
        document.querySelectorAll("[data-bio-thumb]").forEach(function (t) { t.classList.remove("is-active"); });
        thumb.classList.add("is-active");
      });
    });
  }

  /* ---- 7. Two-click video (DSGVO) ---------------------------------------- */
  document.querySelectorAll("[data-video]").forEach(function (box) {
    var btn = box.querySelector(".video__consent");
    if (!btn) return;
    btn.addEventListener("click", function () {
      var id = box.getAttribute("data-video");
      var title = box.getAttribute("data-video-title") || "Video";
      var iframe = document.createElement("iframe");
      iframe.src = "https://www.youtube-nocookie.com/embed/" + encodeURIComponent(id) +
        "?autoplay=1&rel=0";
      iframe.title = title;
      iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
      iframe.allowFullscreen = true;
      iframe.loading = "lazy";
      box.innerHTML = "";
      box.appendChild(iframe);
    });
  });
})();
