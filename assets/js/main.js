/* ==========================================================================
   Raka Aditya — Portfolio Landing Page
   Vanilla JS, no dependencies.
   ========================================================================== */
(function () {
  "use strict";

  const doc = document;
  const root = doc.documentElement;
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

  /* ---------------------------------------------------------------- Toast */
  const toastEl = doc.getElementById("toast");
  let toastTimer;

  function toast(message) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.add("is-visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toastEl.classList.remove("is-visible"), 2600);
  }

  /* ---------------------------------------------------------------- Theme */
  const themeToggle = doc.getElementById("themeToggle");
  const themeMeta = doc.querySelector('meta[name="theme-color"]');

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    const isLight = theme === "light";
    if (themeToggle) themeToggle.setAttribute("aria-pressed", String(isLight));
    if (themeMeta) themeMeta.setAttribute("content", isLight ? "#f3f0e9" : "#0a0a0b");
  }

  function initTheme() {
    let stored = null;
    try {
      stored = localStorage.getItem("theme");
    } catch (err) {
      stored = null;
    }
    const systemLight = window.matchMedia("(prefers-color-scheme: light)").matches;
    applyTheme(stored === "light" || stored === "dark" ? stored : systemLight ? "light" : "dark");

    if (!themeToggle) return;
    themeToggle.addEventListener("click", () => {
      const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
      applyTheme(next);
      try {
        localStorage.setItem("theme", next);
      } catch (err) {
        /* storage may be unavailable — theme still applies for this session */
      }
    });
  }

  initTheme();

  /* --------------------------------------------------------- Header states */
  const header = doc.getElementById("header");
  const progressBar = doc.getElementById("progressBar");
  let lastY = window.scrollY;
  let ticking = false;

  function onScroll() {
    const y = window.scrollY;
    const max = doc.documentElement.scrollHeight - window.innerHeight;

    if (header) {
      header.classList.toggle("is-scrolled", y > 12);
      const menuOpen = doc.getElementById("menuToggle")?.getAttribute("aria-expanded") === "true";
      if (!menuOpen && y > 480 && y > lastY + 6) {
        header.classList.add("is-hidden");
      } else if (y < lastY - 4 || y < 200) {
        header.classList.remove("is-hidden");
      }
    }

    if (progressBar) {
      const ratio = max > 0 ? Math.min(y / max, 1) : 0;
      progressBar.style.width = (ratio * 100).toFixed(2) + "%";
    }

    lastY = y;
    ticking = false;
  }

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(onScroll);
      }
    },
    { passive: true }
  );
  onScroll();

  /* ------------------------------------------------------------- Mobile nav */
  const menuToggle = doc.getElementById("menuToggle");
  const nav = doc.getElementById("nav");

  function setMenu(open) {
    if (!nav || !menuToggle) return;
    nav.classList.toggle("is-open", open);
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute("aria-label", open ? "Tutup menu" : "Buka menu");
    doc.body.style.overflow = open ? "hidden" : "";
    if (open) header?.classList.remove("is-hidden");
  }

  if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
      setMenu(menuToggle.getAttribute("aria-expanded") !== "true");
    });

    nav.addEventListener("click", (event) => {
      if (event.target.closest("a")) setMenu(false);
    });

    doc.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && nav.classList.contains("is-open")) {
        setMenu(false);
        menuToggle.focus();
      }
    });

    window.matchMedia("(min-width: 901px)").addEventListener("change", (event) => {
      if (event.matches) setMenu(false);
    });
  }

  /* --------------------------------------------------------- Scroll reveal */
  const revealEls = doc.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window && !prefersReduced.matches) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    revealEls.forEach((el) => revealObserver.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  /* ------------------------------------------------- Active navigation link */
  const navLinks = Array.from(doc.querySelectorAll("[data-nav]"));
  const sections = navLinks
    .map((link) => doc.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          navLinks.forEach((link) => {
            const isActive = link.getAttribute("href") === "#" + entry.target.id;
            link.classList.toggle("is-active", isActive);
            if (isActive) link.setAttribute("aria-current", "true");
            else link.removeAttribute("aria-current");
          });
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach((section) => navObserver.observe(section));
  }

  /* -------------------------------------------------------------- Counters */
  const counters = doc.querySelectorAll("[data-count]");

  // HTML ships with the final values (works without JS); reset to zero only
  // when we know the animation can run.
  if (!prefersReduced.matches) {
    counters.forEach((el) => {
      el.textContent = "0";
    });
  }

  function animateCounter(el) {
    const target = Number(el.dataset.count) || 0;
    const suffix = el.dataset.suffix || "";

    if (prefersReduced.matches) {
      el.textContent = target + suffix;
      return;
    }

    const duration = 1500;
    const start = performance.now();

    function frame(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased) + (progress === 1 ? suffix : "");
      if (progress < 1) window.requestAnimationFrame(frame);
    }
    window.requestAnimationFrame(frame);
  }

  if ("IntersectionObserver" in window && counters.length) {
    const countObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            countObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach((el) => countObserver.observe(el));
  } else {
    counters.forEach((el) => (el.textContent = el.dataset.count + (el.dataset.suffix || "")));
  }

  /* ---------------------------------------------------------- Local clock */
  const clockEl = doc.querySelector("[data-clock]");

  function updateClock() {
    if (!clockEl) return;
    try {
      const time = new Intl.DateTimeFormat("id-ID", {
        timeZone: "Asia/Jakarta",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).format(new Date());
      clockEl.textContent = time.replace(".", ":") + " WIB";
    } catch (err) {
      clockEl.textContent = "GMT+7";
    }
  }
  updateClock();
  window.setInterval(updateClock, 30000);

  /* ----------------------------------------------------------- Year stamp */
  doc.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });

  /* ---------------------------------------------------------- Copy email */
  const copyBtn = doc.getElementById("copyEmail");

  if (copyBtn) {
    copyBtn.addEventListener("click", async () => {
      const email = copyBtn.dataset.email || "hello@raka.design";
      try {
        await navigator.clipboard.writeText(email);
        toast("Email disalin: " + email);
        const label = copyBtn.querySelector("span");
        if (label) {
          const original = label.textContent;
          label.textContent = "Tersalin";
          window.setTimeout(() => (label.textContent = original), 1800);
        }
      } catch (err) {
        toast("Salin manual: " + email);
      }
    });
  }

  /* ------------------------------------------------------- Contact form */
  const form = doc.getElementById("contactForm");

  if (form) {
    const fields = {
      name: form.querySelector("#name"),
      email: form.querySelector("#email"),
      message: form.querySelector("#message"),
    };

    function setError(input, message) {
      const field = input.closest(".field");
      const errorEl = form.querySelector('[data-error-for="' + input.name + '"]');
      field?.classList.toggle("has-error", Boolean(message));
      if (errorEl) {
        errorEl.textContent = message || "";
        errorEl.classList.toggle("is-visible", Boolean(message));
      }
      input.setAttribute("aria-invalid", message ? "true" : "false");
    }

    function validate() {
      let valid = true;
      let firstInvalid = null;

      if (fields.name.value.trim().length < 2) {
        setError(fields.name, "Mohon isi nama Anda (min. 2 karakter).");
        valid = false;
        firstInvalid = firstInvalid || fields.name;
      } else {
        setError(fields.name, "");
      }

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
      if (!emailPattern.test(fields.email.value.trim())) {
        setError(fields.email, "Masukkan alamat email yang valid.");
        valid = false;
        firstInvalid = firstInvalid || fields.email;
      } else {
        setError(fields.email, "");
      }

      if (fields.message.value.trim().length < 10) {
        setError(fields.message, "Ceritakan sedikit lebih detail (min. 10 karakter).");
        valid = false;
        firstInvalid = firstInvalid || fields.message;
      } else {
        setError(fields.message, "");
      }

      if (!valid) firstInvalid?.focus();
      return valid;
    }

    Object.values(fields).forEach((input) => {
      input.addEventListener("input", () => {
        if (input.closest(".field")?.classList.contains("has-error")) validate();
      });
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!validate()) {
        toast("Periksa kembali kolom yang ditandai.");
        return;
      }

      const budget = form.querySelector("#budget")?.value || "Belum ditentukan";
      const subject = "Proyek baru dari " + fields.name.value.trim();
      const body = [
        "Nama: " + fields.name.value.trim(),
        "Email: " + fields.email.value.trim(),
        "Anggaran: " + budget,
        "",
        fields.message.value.trim(),
      ].join("\n");

      window.location.href =
        "mailto:hello@raka.design?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);

      toast("Membuka aplikasi email Anda…");
    });
  }

  /* -------------------------------------------------------- Custom cursor */
  const cursor = doc.querySelector(".cursor");

  if (cursor && finePointer.matches && !prefersReduced.matches) {
    const dot = cursor.querySelector(".cursor__dot");
    const ring = cursor.querySelector(".cursor__ring");
    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ringPos = { x: pos.x, y: pos.y };
    let visible = false;

    root.classList.add("has-cursor");

    window.addEventListener(
      "pointermove",
      (event) => {
        pos.x = event.clientX;
        pos.y = event.clientY;
        if (!visible) {
          visible = true;
          ringPos.x = pos.x;
          ringPos.y = pos.y;
        }
        dot.style.transform = "translate3d(" + pos.x + "px," + pos.y + "px,0) translate(-50%,-50%)";
      },
      { passive: true }
    );

    (function loop() {
      ringPos.x += (pos.x - ringPos.x) * 0.16;
      ringPos.y += (pos.y - ringPos.y) * 0.16;
      ring.style.transform = "translate3d(" + ringPos.x + "px," + ringPos.y + "px,0) translate(-50%,-50%)";
      window.requestAnimationFrame(loop);
    })();

    doc.addEventListener("pointerover", (event) => {
      const interactive = event.target.closest("a, button, [role='button'], input, textarea, select");
      cursor.classList.toggle("is-active", Boolean(interactive));
    });

    doc.addEventListener("pointerleave", () => {
      cursor.style.opacity = "0";
    });
    doc.addEventListener("pointerenter", () => {
      cursor.style.opacity = "1";
    });
  }
})();
