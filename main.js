/* ==========================================================================
   S. B. Lombardo — portfolio site behaviour
   Sections: theme toggle · sticky header · mobile menu · smooth scroll spy
             hero slideshow · scroll reveals · gallery lightbox · contact form
   All vanilla JS, no build step, no dependencies.
   ========================================================================== */

(function () {
  "use strict";

  var root = document.documentElement;

  /* ----------------------------------------------------------------------
     Footer year
  ---------------------------------------------------------------------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ----------------------------------------------------------------------
     Dark / light mode
     Respects saved preference, falls back to OS preference.
  ---------------------------------------------------------------------- */
  function applyTheme(isDark) {
    root.classList.toggle("dark", isDark);
    document.querySelectorAll("#theme-toggle, #theme-toggle-mobile").forEach(function (btn) {
      btn.setAttribute("aria-pressed", String(isDark));
    });
    document.querySelectorAll("#icon-sun, .icon-sun-m").forEach(function (el) {
      el.classList.toggle("hidden", isDark);
    });
    document.querySelectorAll("#icon-moon, .icon-moon-m").forEach(function (el) {
      el.classList.toggle("hidden", !isDark);
    });
  }

  var saved = localStorage.getItem("sbl-theme");
  var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  applyTheme(saved ? saved === "dark" : prefersDark);

  function toggleTheme() {
    var nowDark = !root.classList.contains("dark");
    applyTheme(nowDark);
    localStorage.setItem("sbl-theme", nowDark ? "dark" : "light");
  }

  var themeBtn = document.getElementById("theme-toggle");
  var themeBtnMobile = document.getElementById("theme-toggle-mobile");
  if (themeBtn) themeBtn.addEventListener("click", toggleTheme);
  if (themeBtnMobile) themeBtnMobile.addEventListener("click", toggleTheme);

  /* ----------------------------------------------------------------------
     Sticky header background on scroll
  ---------------------------------------------------------------------- */
  var header = document.getElementById("site-header");
  function onScrollHeader() {
    header.classList.toggle("scrolled", window.scrollY > 40);
  }
  onScrollHeader();
  window.addEventListener("scroll", onScrollHeader, { passive: true });

  /* ----------------------------------------------------------------------
     Mobile menu
  ---------------------------------------------------------------------- */
  var menuToggle = document.getElementById("menu-toggle");
  var mobileMenu = document.getElementById("mobile-menu");

  function closeMobileMenu() {
    mobileMenu.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open menu");
  }

  menuToggle.addEventListener("click", function () {
    var isOpen = mobileMenu.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  });

  document.querySelectorAll("[data-mobile]").forEach(function (link) {
    link.addEventListener("click", closeMobileMenu);
  });

  /* ----------------------------------------------------------------------
     Scroll-spy for nav active state
  ---------------------------------------------------------------------- */
  var sections = ["home", "process", "commissions", "tos", "gallery", "contact"]
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);
  var navLinks = document.querySelectorAll("[data-nav]");

  var spyObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = entry.target.id;
        navLinks.forEach(function (link) {
          var isActive = link.getAttribute("href") === "#" + id;
          link.classList.toggle("active", isActive);
          if (isActive) {
            link.setAttribute("aria-current", "page");
          } else {
            link.removeAttribute("aria-current");
          }
        });
      });
    },
    { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
  );
  sections.forEach(function (s) { spyObserver.observe(s); });

  /* ----------------------------------------------------------------------
     Hero slideshow — simple crossfade rotation
     The first slide's image is set directly in HTML and loads eagerly;
     the other two carry their URL in data-bg and are only fetched after
     the window "load" event, so they don't compete with the critical
     first paint for bandwidth.
  ---------------------------------------------------------------------- */
  var slides = document.querySelectorAll(".hero-slide");

  function loadDeferredHeroBackgrounds() {
    document.querySelectorAll(".hero-slide[data-bg]").forEach(function (slide) {
      slide.style.backgroundImage = "url('" + slide.getAttribute("data-bg") + "')";
      slide.removeAttribute("data-bg");
    });
  }
  if (document.readyState === "complete") {
    loadDeferredHeroBackgrounds();
  } else {
    window.addEventListener("load", loadDeferredHeroBackgrounds);
  }

  if (slides.length > 1) {
    var current = 0;
    setInterval(function () {
      slides[current].classList.remove("active");
      current = (current + 1) % slides.length;
      slides[current].classList.add("active");
    }, 6000);
  }

  /* ----------------------------------------------------------------------
     Scroll reveal for below-the-fold content
  ---------------------------------------------------------------------- */
  var revealEls = document.querySelectorAll(".reveal-up");
  var revealObserver = new IntersectionObserver(
    function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  revealEls.forEach(function (el) { revealObserver.observe(el); });

  /* ----------------------------------------------------------------------
     TOS accordion — keep only one entry open at a time
  ---------------------------------------------------------------------- */
  var tosItems = document.querySelectorAll(".tos-item");
  tosItems.forEach(function (item) {
    item.addEventListener("toggle", function () {
      if (item.open) {
        tosItems.forEach(function (other) {
          if (other !== item) other.open = false;
        });
      }
    });
  });

  /* ----------------------------------------------------------------------
     Gallery lightbox
     Guarded — pages without a gallery (e.g. shop.html) share this same
     main.js file for the header/menu/theme logic, but have no lightbox.
  ---------------------------------------------------------------------- */
  var lightbox = document.getElementById("lightbox");

  if (lightbox) {
    var galleryItems = Array.prototype.slice.call(document.querySelectorAll(".gallery-item"));
    var lightboxImg = document.getElementById("lightbox-img");
    var lightboxCaption = document.getElementById("lightbox-caption");
    var lightboxIndex = 0;

    var openLightbox = function (index) {
      lightboxIndex = index;
      showLightboxImage();
      lightbox.classList.add("open");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    };

    var showLightboxImage = function () {
      var item = galleryItems[lightboxIndex];
      lightboxImg.classList.remove("loaded");
      lightboxImg.src = item.getAttribute("data-full");
      lightboxImg.alt = item.querySelector("img").getAttribute("alt");
      lightboxCaption.textContent = item.getAttribute("data-caption") || "";
      lightboxImg.onload = function () { lightboxImg.classList.add("loaded"); };
    };

    var closeLightbox = function () {
      lightbox.classList.remove("open");
      lightbox.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    };

    var showNext = function () {
      lightboxIndex = (lightboxIndex + 1) % galleryItems.length;
      showLightboxImage();
    };
    var showPrev = function () {
      lightboxIndex = (lightboxIndex - 1 + galleryItems.length) % galleryItems.length;
      showLightboxImage();
    };

    galleryItems.forEach(function (item, i) {
      item.addEventListener("click", function () { openLightbox(i); });
    });

    document.querySelector(".lightbox-close").addEventListener("click", closeLightbox);
    document.querySelector(".lightbox-next").addEventListener("click", showNext);
    document.querySelector(".lightbox-prev").addEventListener("click", showPrev);

    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener("keydown", function (e) {
      if (!lightbox.classList.contains("open")) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") showNext();
      if (e.key === "ArrowLeft") showPrev();
    });
  }

  /* ----------------------------------------------------------------------
     Contact form — client-side validation + simulated submit
     (No backend is wired up; replace the submit handler with a real
     endpoint, e.g. Formspree, Netlify Forms, or your own API.)
  ---------------------------------------------------------------------- */
  var form = document.getElementById("contact-form");
  var successMsg = document.getElementById("form-success");

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var valid = true;

      ["name", "email", "inquiry", "message"].forEach(function (fieldName) {
        var input = form.elements[fieldName];
        var wrapper = input.closest(".field");
        var fieldValid = input.checkValidity() && input.value.trim().length > 0;
        wrapper.classList.toggle("invalid", !fieldValid);
        if (!fieldValid) valid = false;
      });

      if (!valid) return;

      // Simulate a successful send. Swap this block for a fetch() call
      // to your form backend of choice when the site goes live.
      successMsg.classList.remove("hidden");
      form.reset();
      document.querySelectorAll(".field.invalid").forEach(function (f) {
        f.classList.remove("invalid");
      });

      setTimeout(function () {
        successMsg.classList.add("hidden");
      }, 6000);
    });

    // Clear the invalid state as soon as a field becomes valid again.
    form.querySelectorAll("input, select, textarea").forEach(function (el) {
      el.addEventListener("input", function () {
        var wrapper = el.closest(".field");
        if (el.checkValidity() && el.value.trim().length > 0) {
          wrapper.classList.remove("invalid");
        }
      });
    });
  }
})();
