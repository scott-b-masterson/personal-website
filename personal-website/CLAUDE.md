# CLAUDE.md — Scott Masterson Personal Website

Working memory for this project. Update this file whenever the site changes.

## Mission
A PhD-application-grade personal site for Scott Masterson (Research Fellow, Stanford GSB).
Theme: **networks and maps** — Apple-level polish (apple.com/airpods-pro), Barabási/Moro
academic sensibility. Audience: admissions committees at MIT ORC, Stanford MS&E, Stanford GSB,
Michigan Econ, Northeastern Network Science, and faculty (Jackson, Lester, Leskovec, Newman,
Barabási, Moro).

Live at: `https://scott-b-masterson.github.io/personal-website/` (after first deploy)
Repo: `https://github.com/scott-b-masterson/personal-website`

## Architecture (no build step — plain HTML/CSS/JS, GitHub Pages ready)
```
personal-website/
├── index.html          ← all content & sections (look for ✏️ EDIT comments)
├── css/style.css       ← design tokens at top (:root); all styling
├── js/
│   ├── content.js      ← ✏️ NEWS ITEMS — the file Scott edits most
│   ├── world-dots.js   ← baked land-dot coordinates (auto-generated, don't hand-edit)
│   ├── hero.js         ← world-map network animation engine (hero + footer canvases)
│   └── main.js         ← nav, scroll reveals, stat counters, news renderer
├── assets/
│   ├── favicon.svg, og-image.png, topo-pattern.svg
│   ├── headshot.jpg    ← ⚠️ NOT YET ADDED — drop photo here (4:5 portrait, ≥800px wide)
│   └── thumbs/*.svg    ← generated project-card art
├── .nojekyll
└── README.md           ← deployment instructions for Scott
```

## Design system
- Fonts: Inter (Google Fonts) with SF Pro fallback on Apple devices
- Dark: `--ink #06091a` (hero, Maps section, footer) · Light: white + `#f5f5f7` Apple gray
- Accents: cyan `#64d2ff` (network edges), gold `#f5b942` (tax-haven routes), blue `#0071e3` (actions)
- Hero animation: equirectangular dot-map, ambient cyan arcs between financial hubs,
  gold "named structure" sequences (Dutch Sandwich IE→NL→IE etc.) that update the HUD chip.
  Honors `prefers-reduced-motion`; pauses off-screen and on hidden tabs.

## Section map (index.html)
1. `#home` hero — name, statement, CTAs, live-route HUD
2. `#about` — bio, portrait (fallback shows until headshot.jpg added), PhD-application note
3. `#research` — featured Tax Haven Sandwiches card (animated diagram + counters), 3 project cards, RA contributions
4. `#maps` — dark GIS section: FFIEC dashboard + More Than Miles StoryMap
5. `#toolkit` — methods grid
6. `#background` — Stanford/Emory timeline
7. `#news` — rendered from `js/content.js`
8. `#contact` — footer with animated canvas

## Key links in use
- SSRN paper: https://papers.ssrn.com/abstract=6691760
- FFIEC dashboard: https://experience.arcgis.com/experience/4afdae6fadaa4f2cb8579f3394f020a2
- LinkedIn: https://www.linkedin.com/in/scottbmasterson/
- GitHub profile: https://github.com/scott-b-masterson

## TODO / open items
- [x] Title unified site-wide to **"Predoctoral Fellow"** (Scott's call, 2026-06-10): hero,
      meta tags, bio, timeline, og-image all match.
- [ ] CV links to the shared Drive file
      (https://drive.google.com/file/d/1B-wNwO2L2dILPnE90VTnodEdpVNZdK-6/view?usp=sharing).
      Scott will update the file in coming weeks. Later consider hosting `assets/cv.pdf` directly.
- [ ] Google Drive links for the two research-contribution papers: confirm they're shared
      publicly, and confirm coauthors are OK with drafts being linked.
- [ ] Optional: custom domain (e.g., scottmasterson.com) via repo Settings → Pages
- [ ] After CS224W (Dec 2026): move Poincaré card from "In development" to results + add news item
- [ ] When networks paper status changes (accepted/published): update badges + news
- [ ] STYLE RULE from Scott: avoid em dashes in site prose; they read like AI. Date ranges OK.

## Two sandwich papers (do not confuse them)
1. **Networks version (featured card)**: "Constrained Randomization for Strategic Motif
   Detection in Attributed Hierarchical Networks" — three-null framework (edge-swap,
   label-shuffle, Erdős–Rényi), 1,033 MNEs, 2012–2022, 11,363 network-years. Status:
   Submitted to Network Science (Cambridge). SSRN abstract 6691760.
2. **Economics version (paper-strip card)**: "Tax Haven Sandwiches in U.S. Multinational
   Ownership Networks: Evidence from Orbis, 2007–2022" — universe of U.S. MNEs, ECON 291
   final paper, being expanded. Stats: 2,062 instances, 44→169, 3.3→7.4%, 45.8% Dutch family.
   Status: working paper in progress, draft on request. NOT submitted anywhere.

## How to edit (for Scott)
- **News**: edit `js/content.js`, add an item at the top of `SITE_NEWS`.
- **Text**: search index.html for `✏️ EDIT` comments; edit the visible text between tags.
- **Colors/spacing**: top of `css/style.css` under `:root`.
- **New research card**: copy an `<article class="card reveal">…</article>` block in
  index.html, change text; thumbs live in `assets/thumbs/`.
- Anything bigger: ask Claude in this project — this file is the context.

## Changelog
- **2026-06-10 (v1.1, feedback round 1)** — Headshot added by Scott (object-position: top fixes
  hair crop). Research split into two correctly-attributed papers (see above). Bio rewritten
  with the real origin story (Emory professor gifting Jackson's networks book, the Lester
  first-week moment); big-name call-outs removed; em dashes purged from prose. Timeline rebuilt
  from resume: Stanford Predoctoral Fellow (Jul 2025–), NCAA All-American gold node (Mar 2025),
  MS Econ 2023–2025, BS+BA 2020–2024 with Trevor Evans Award + thesis links. StoryMap, thesis,
  award, both Drive paper links, and CV (Drive folder) all wired. Sigma icon un-mirrored.
  Data list updated (Orbis, Zephyr, Census SSS, Alabama UI, FFIEC, Qualtrics) + languages line.
  News refreshed; "300 Tennessee firms" corrected per resume.
- **2026-06-10 (v1)** — v1 built: full single-page site, hero world-network animation,
  featured paper card w/ animated Dutch Sandwich diagram + live counters, Maps/Toolkit/
  Background/News/Contact sections, OG image, favicon, thumbnails, deployment README.
  Dot-map data generated from world-atlas (land-110m) at 1.8° resolution → 4,480 dots.
