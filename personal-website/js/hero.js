/* ═══════════════════════════════════════════════════════════════
   hero.js — "The world as a network"
   Animated dot-map of Earth with ownership routes pulsing between
   financial centers. Gold sequences trace real haven structures
   (IE → NL → IE …) and update the HUD label in the hero.
   Powered by js/world-dots.js (baked land coordinates).
   You should not need to edit this file to change site content.
   ═══════════════════════════════════════════════════════════════ */

(function () {
  "use strict";

  // ── Financial / personal hubs (lon, lat) ──────────────────────
  const HUBS = {
    PA:  { name: "Palo Alto",  lon: -122.14, lat: 37.44 },
    NY:  { name: "New York",   lon: -74.01,  lat: 40.71 },
    BOS: { name: "Boston",     lon: -71.06,  lat: 42.36 },
    AA:  { name: "Ann Arbor",  lon: -83.74,  lat: 42.28 },
    CHI: { name: "Chicago",    lon: -87.63,  lat: 41.88 },
    ATL: { name: "Atlanta",    lon: -84.39,  lat: 33.75 },
    LDN: { name: "London",     lon: -0.12,   lat: 51.51 },
    IE:  { name: "Dublin",     lon: -6.26,   lat: 53.35 },
    NL:  { name: "Amsterdam",  lon: 4.90,    lat: 52.37 },
    LU:  { name: "Luxembourg", lon: 6.13,    lat: 49.61 },
    CH:  { name: "Zurich",     lon: 8.54,    lat: 47.37 },
    BM:  { name: "Bermuda",    lon: -64.78,  lat: 32.30 },
    KY:  { name: "Cayman Is.", lon: -81.38,  lat: 19.31 },
    SG:  { name: "Singapore",  lon: 103.85,  lat: 1.35 },
    HK:  { name: "Hong Kong",  lon: 114.17,  lat: 22.32 },
    TYO: { name: "Tokyo",      lon: 139.69,  lat: 35.68 }
  };

  // Named structures (gold pulses + HUD captions)
  const SEQUENCES = [
    { label: "Dutch Sandwich · IE → NL → IE", legs: [["IE", "NL"], ["NL", "IE"]] },
    { label: "Conduit route · KY → LU → KY",  legs: [["KY", "LU"], ["LU", "KY"]] },
    { label: "Conduit route · SG → HK → SG",  legs: [["SG", "HK"], ["HK", "SG"]] },
    { label: "Parent → haven · US → BM",      legs: [["NY", "BM"]] },
    { label: "Parent → haven · US → IE",      legs: [["PA", "IE"]] }
  ];

  const AMBIENT_PAIRS = [
    ["NY", "LDN"], ["PA", "TYO"], ["CHI", "NY"], ["LDN", "SG"], ["BOS", "IE"],
    ["ATL", "KY"], ["NY", "CH"], ["HK", "TYO"], ["PA", "NY"], ["LDN", "LU"],
    ["AA", "CHI"], ["NL", "CH"], ["SG", "TYO"], ["NY", "KY"], ["BOS", "NY"],
    ["ATL", "NY"], ["LDN", "NL"], ["PA", "HK"]
  ];

  const CYAN = "100,210,255", GOLD = "245,185,66";
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ── Map engine ─────────────────────────────────────────────────
  function createMap(canvas, opts) {
    const o = Object.assign({
      dotAlpha: 0.34, dotSize: 1.1, hubGlow: true, ambient: true,
      sequences: false, hud: null, sparkles: 130, ambientEvery: [650, 1500],
      focusLon: -32, focusLat: 34, zoom: 1.0
    }, opts);

    const ctx = canvas.getContext("2d");
    let W = 0, H = 0, DPR = 1, mapW = 0, mapH = 0, mapX = 0, mapY = 0;
    let dotLayer = null;
    let running = false, raf = 0, last = 0;
    const px = { x: 0, y: 0, tx: 0, ty: 0 };           // parallax
    let arcs = [], ripples = [], sparkles = [];
    let nextAmbient = 600, seqIndex = 0, nextSeq = 2600, hudTimer = 0;

    const LON_MIN = -168, LON_MAX = 180, LAT_MAX = 72, LAT_MIN = -56;
    const LAT_STRETCH = 1.18;

    function project(lon, lat) {
      return [
        mapX + ((lon - LON_MIN) / (LON_MAX - LON_MIN)) * mapW,
        mapY + ((LAT_MAX - lat) / (LAT_MAX - LAT_MIN)) * mapH
      ];
    }

    function resize() {
      const r = canvas.getBoundingClientRect();
      DPR = Math.min(window.devicePixelRatio || 1, 2);
      W = Math.max(r.width, 10); H = Math.max(r.height, 10);
      canvas.width = W * DPR; canvas.height = H * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

      // Fit map: prefer filling width; keep equirect aspect w/ lat stretch
      const degAspect = (LON_MAX - LON_MIN) / ((LAT_MAX - LAT_MIN) * LAT_STRETCH); // ≈ 2.3
      mapW = Math.max(W * 1.04, H * degAspect * 0.96) * o.zoom;
      mapH = mapW / degAspect;
      // Position focus point
      const fx = ((o.focusLon - LON_MIN) / (LON_MAX - LON_MIN)) * mapW;
      const fy = ((LAT_MAX - o.focusLat) / (LAT_MAX - LAT_MIN)) * mapH;
      mapX = (mapW > W * 1.05) ? (W * 0.5 - fx) : (W - mapW) / 2;
      mapY = (mapH > H * 1.05) ? (H * 0.46 - fy) : (H - mapH) / 2;

      buildDotLayer();
      buildSparkles();
    }

    function buildDotLayer() {
      dotLayer = document.createElement("canvas");
      dotLayer.width = W * DPR; dotLayer.height = H * DPR;
      const dctx = dotLayer.getContext("2d");
      dctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      const s = o.dotSize;
      dctx.fillStyle = "rgba(154,166,196," + o.dotAlpha + ")";
      for (let i = 0; i < WORLD_DOTS.length; i += 2) {
        const p = project(WORLD_DOTS[i], WORLD_DOTS[i + 1]);
        if (p[0] < -4 || p[0] > W + 4 || p[1] < -4 || p[1] > H + 4) continue;
        dctx.beginPath();
        dctx.arc(p[0], p[1], s, 0, 6.2832);
        dctx.fill();
      }
    }

    function buildSparkles() {
      sparkles = [];
      const n = o.sparkles;
      for (let k = 0; k < n; k++) {
        const i = (Math.floor(Math.random() * (WORLD_DOTS.length / 2))) * 2;
        const p = project(WORLD_DOTS[i], WORLD_DOTS[i + 1]);
        if (p[0] < 0 || p[0] > W || p[1] < 0 || p[1] > H) { k--; continue; }
        sparkles.push({ x: p[0], y: p[1], ph: Math.random() * 6.28, sp: 0.6 + Math.random() * 1.4 });
      }
    }

    // ── Arcs ────────────────────────────────────────────────────
    function spawnArc(aKey, bKey, gold, slow) {
      const A = project(HUBS[aKey].lon, HUBS[aKey].lat);
      const B = project(HUBS[bKey].lon, HUBS[bKey].lat);
      const mx = (A[0] + B[0]) / 2, my = (A[1] + B[1]) / 2;
      const dx = B[0] - A[0], dy = B[1] - A[1];
      const d = Math.hypot(dx, dy);
      // perpendicular lift, always arcing upward-ish
      let nx = -dy / (d || 1), ny = dx / (d || 1);
      if (ny > 0) { nx = -nx; ny = -ny; }
      const lift = Math.min(d * 0.3, 150) + 18;
      const C = [mx + nx * lift, my + ny * lift];

      const N = 70, pts = new Float32Array(N * 2);
      for (let i = 0; i < N; i++) {
        const t = i / (N - 1), u = 1 - t;
        pts[i * 2]     = u * u * A[0] + 2 * u * t * C[0] + t * t * B[0];
        pts[i * 2 + 1] = u * u * A[1] + 2 * u * t * C[1] + t * t * B[1];
      }
      arcs.push({
        pts, N, t: 0, gold: !!gold, end: B,
        dur: (slow ? 2400 : 1500) + d * (slow ? 2.2 : 1.4)
      });
    }

    function fireSequence(seq) {
      let delay = 0;
      seq.legs.forEach(function (leg) {
        setTimeout(function () { if (running) spawnArc(leg[0], leg[1], true, true); }, delay);
        delay += 950;
      });
      if (o.hud) {
        const el = document.getElementById(o.hud);
        if (el) {
          el.textContent = seq.label;
          clearTimeout(hudTimer);
          hudTimer = setTimeout(function () {
            el.textContent = "Multinational ownership routes";
          }, delay + 3800);
        }
      }
    }

    // ── Frame loop ──────────────────────────────────────────────
    function frame(now) {
      if (!running) return;
      const dt = Math.min(now - last || 16, 50);
      last = now;

      // parallax ease
      px.x += (px.tx - px.x) * 0.045;
      px.y += (px.ty - px.y) * 0.045;

      ctx.clearRect(0, 0, W, H);
      ctx.save();
      ctx.translate(px.x, px.y);

      // land dots
      if (dotLayer) ctx.drawImage(dotLayer, 0, 0, W, H);

      // twinkles
      const tNow = now * 0.001;
      for (let i = 0; i < sparkles.length; i++) {
        const s = sparkles[i];
        const a = 0.18 + 0.5 * (0.5 + 0.5 * Math.sin(tNow * s.sp + s.ph));
        ctx.fillStyle = "rgba(170,190,230," + a.toFixed(3) + ")";
        ctx.fillRect(s.x - 0.8, s.y - 0.8, 1.6, 1.6);
      }

      // hubs
      for (const k in HUBS) {
        const p = project(HUBS[k].lon, HUBS[k].lat);
        if (p[0] < -10 || p[0] > W + 10) continue;
        if (o.hubGlow) {
          const g = ctx.createRadialGradient(p[0], p[1], 0, p[0], p[1], 9);
          g.addColorStop(0, "rgba(" + CYAN + ",0.55)");
          g.addColorStop(1, "rgba(" + CYAN + ",0)");
          ctx.fillStyle = g;
          ctx.beginPath(); ctx.arc(p[0], p[1], 9, 0, 6.2832); ctx.fill();
        }
        ctx.fillStyle = "rgba(" + CYAN + ",0.95)";
        ctx.beginPath(); ctx.arc(p[0], p[1], 1.9, 0, 6.2832); ctx.fill();
      }

      // arcs
      for (let i = arcs.length - 1; i >= 0; i--) {
        const a = arcs[i];
        a.t += dt / a.dur;
        const col = a.gold ? GOLD : CYAN;
        const head = Math.min(a.t, 1) * (a.N - 1);
        const hi = Math.floor(head);
        const trail = a.gold ? 34 : 24;
        const lo = Math.max(0, hi - trail);

        ctx.lineCap = "round";
        for (let j = lo; j < hi; j++) {
          const fade = (j - lo) / (hi - lo || 1);
          ctx.strokeStyle = "rgba(" + col + "," + (fade * (a.gold ? 0.85 : 0.5)).toFixed(3) + ")";
          ctx.lineWidth = a.gold ? 1.7 : 1.2;
          ctx.beginPath();
          ctx.moveTo(a.pts[j * 2], a.pts[j * 2 + 1]);
          ctx.lineTo(a.pts[(j + 1) * 2], a.pts[(j + 1) * 2 + 1]);
          ctx.stroke();
        }
        // head glow
        if (a.t < 1) {
          const hx = a.pts[hi * 2], hy = a.pts[hi * 2 + 1];
          const g = ctx.createRadialGradient(hx, hy, 0, hx, hy, a.gold ? 8 : 5);
          g.addColorStop(0, "rgba(" + col + ",0.9)");
          g.addColorStop(1, "rgba(" + col + ",0)");
          ctx.fillStyle = g;
          ctx.beginPath(); ctx.arc(hx, hy, a.gold ? 8 : 5, 0, 6.2832); ctx.fill();
        } else {
          a.t += dt / a.dur; // keep advancing to fade out trail
          if (a.t > 1.45) {
            ripples.push({ x: a.end[0], y: a.end[1], r: 2, a: a.gold ? 0.75 : 0.45, gold: a.gold });
            arcs.splice(i, 1);
          }
        }
      }

      // ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.r += dt * 0.022; r.a -= dt * 0.0011;
        if (r.a <= 0) { ripples.splice(i, 1); continue; }
        ctx.strokeStyle = "rgba(" + (r.gold ? GOLD : CYAN) + "," + r.a.toFixed(3) + ")";
        ctx.lineWidth = 1.1;
        ctx.beginPath(); ctx.arc(r.x, r.y, r.r, 0, 6.2832); ctx.stroke();
      }

      ctx.restore();

      // schedulers
      if (o.ambient) {
        nextAmbient -= dt;
        if (nextAmbient <= 0 && arcs.length < 9) {
          const pr = AMBIENT_PAIRS[Math.floor(Math.random() * AMBIENT_PAIRS.length)];
          const flip = Math.random() < 0.5;
          spawnArc(flip ? pr[1] : pr[0], flip ? pr[0] : pr[1], false, false);
          nextAmbient = o.ambientEvery[0] + Math.random() * (o.ambientEvery[1] - o.ambientEvery[0]);
        }
      }
      if (o.sequences) {
        nextSeq -= dt;
        if (nextSeq <= 0) {
          fireSequence(SEQUENCES[seqIndex % SEQUENCES.length]);
          seqIndex++;
          nextSeq = 7800 + Math.random() * 2600;
        }
      }

      raf = requestAnimationFrame(frame);
    }

    function staticFrame() {
      ctx.clearRect(0, 0, W, H);
      if (dotLayer) ctx.drawImage(dotLayer, 0, 0, W, H);
      ctx.fillStyle = "rgba(" + CYAN + ",0.9)";
      for (const k in HUBS) {
        const p = project(HUBS[k].lon, HUBS[k].lat);
        ctx.beginPath(); ctx.arc(p[0], p[1], 2, 0, 6.2832); ctx.fill();
      }
    }

    function start() {
      if (prefersReduced) { staticFrame(); return; }
      if (running) return;
      running = true; last = 0;
      raf = requestAnimationFrame(frame);
    }
    function stop() { running = false; cancelAnimationFrame(raf); }

    // events
    let rT;
    window.addEventListener("resize", function () {
      clearTimeout(rT);
      rT = setTimeout(function () { resize(); if (prefersReduced) staticFrame(); }, 160);
    });
    if (o.parallax) {
      window.addEventListener("pointermove", function (e) {
        const r = canvas.getBoundingClientRect();
        if (e.clientY < r.top || e.clientY > r.bottom) return;
        px.tx = ((e.clientX / W) - 0.5) * 14;
        px.ty = ((e.clientY / Math.max(r.height, 1)) - 0.5) * 9;
      }, { passive: true });
    }
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) stop();
      else if (visible) start();
    });
    let visible = true;
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting;
        if (visible) start(); else stop();
      }, { threshold: 0.02 }).observe(canvas);
    }

    resize();
    start();
    return { resize: resize };
  }

  // ── Boot ───────────────────────────────────────────────────────
  function boot() {
    const hero = document.getElementById("hero-canvas");
    if (hero && typeof WORLD_DOTS !== "undefined") {
      createMap(hero, {
        ambient: true, sequences: true, parallax: true,
        hud: "hud-label", dotAlpha: 0.36, sparkles: 140
      });
    }
    const foot = document.getElementById("footer-canvas");
    if (foot && typeof WORLD_DOTS !== "undefined") {
      createMap(foot, {
        ambient: true, sequences: false, parallax: false, hubGlow: false,
        dotAlpha: 0.16, sparkles: 50, ambientEvery: [1800, 3600], dotSize: 1.0
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else { boot(); }
})();
