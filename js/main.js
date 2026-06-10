/* ═══════════════════════════════════════════════════════════════
   main.js — page behavior (nav, reveals, counters, news render)
   You should not need to edit this file to change site content.
   ═══════════════════════════════════════════════════════════════ */

(function () {
  "use strict";

  // ── Nav: scrolled state + mobile menu ──────────────────────────
  const nav = document.getElementById("nav");
  const toggle = document.getElementById("nav-toggle");

  window.addEventListener("scroll", function () {
    nav.classList.toggle("scrolled", window.scrollY > 30);
  }, { passive: true });

  if (toggle) {
    toggle.addEventListener("click", function () {
      const open = document.body.classList.toggle("menu-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    document.querySelectorAll(".nav-links a").forEach(function (a) {
      a.addEventListener("click", function () {
        document.body.classList.remove("menu-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // ── News list (from js/content.js) ─────────────────────────────
  const newsList = document.getElementById("news-list");
  function renderItems(items, dim) {
    items.forEach(function (n) {
      const li = document.createElement("li");
      li.className = "reveal" + (dim ? " news-upcoming" : "");
      const d = document.createElement("span");
      d.className = "news-date";
      d.textContent = n.date;
      const t = document.createElement("span");
      t.className = "news-text";
      t.textContent = n.text + (n.link ? " " : "");
      if (n.link) {
        const a = document.createElement("a");
        a.href = n.link.url;
        a.target = "_blank";
        a.rel = "noopener";
        a.textContent = n.link.label;
        t.appendChild(a);
      }
      li.appendChild(d);
      li.appendChild(t);
      newsList.appendChild(li);
    });
  }
  if (newsList && typeof SITE_NEWS !== "undefined") {
    renderItems(SITE_NEWS, false);
    if (typeof SITE_UPCOMING !== "undefined" && SITE_UPCOMING.length) {
      renderItems(SITE_UPCOMING, true);
    }
  }

  // ── Animated counters (elements with data-count) ───────────────
  const done = new WeakSet();
  function startCounter(el) {
    if (done.has(el)) return;
    done.add(el);
    const target = parseFloat(el.getAttribute("data-count"));
    const decimals = parseInt(el.getAttribute("data-decimals") || "0", 10);
    const prefix = el.getAttribute("data-prefix") || "";
    const suffix = el.getAttribute("data-suffix") || "";
    const dur = 1600;
    const t0 = performance.now();
    function fmt(v) {
      return prefix + v.toLocaleString("en-US", {
        minimumFractionDigits: decimals, maximumFractionDigits: decimals
      }) + suffix;
    }
    function tick(now) {
      const p = Math.min((now - t0) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(target * eased);
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = fmt(target);
    }
    requestAnimationFrame(tick);
  }

  // ── Scroll reveals ─────────────────────────────────────────────
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
          // trigger counters inside the revealed element
          e.target.querySelectorAll("[data-count]").forEach(startCounter);
          if (e.target.hasAttribute("data-count")) startCounter(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  // ── Placeholder links (✏️ replace href="#" data-todo-link) ─────
  document.querySelectorAll("[data-todo-link]").forEach(function (a) {
    a.addEventListener("click", function (e) {
      if (a.getAttribute("href") === "#") {
        e.preventDefault();
        a.textContent = "Link coming soon";
        setTimeout(function () { a.innerHTML = "View the story&nbsp;↗"; }, 1600);
      }
    });
  });
})();
