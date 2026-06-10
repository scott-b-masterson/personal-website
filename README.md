# scottmasterson — personal website

Personal academic site for **Scott Masterson** (Research Fellow, Stanford GSB).
Plain HTML/CSS/JS — no build step, no dependencies. Designed for GitHub Pages.

**Live site (after setup):** https://scott-b-masterson.github.io/personal-website/

---

## 🚀 Putting this on GitHub (first time, ~10 minutes, no coding)

You already have the repository `scott-b-masterson/personal-website`. Here are two ways
to get these files into it. **Option A needs no software installed.**

### Option A — Upload through the browser (easiest)
1. Go to **https://github.com/scott-b-masterson/personal-website** and sign in.
2. Click **Add file ▾ → Upload files**.
3. In Finder, open this `personal-website` folder, press **⌘A** to select everything
   inside it (index.html, css, js, assets, README.md, CLAUDE.md, .nojekyll), and **drag
   the selection** into the GitHub upload box. *(Drag the contents, not the folder itself —
   index.html must end up at the top level of the repo.)*
4. Scroll down, write a short message like `Initial site`, click **Commit changes**.
5. Turn on the website: in the repo, go to **Settings → Pages** (left sidebar).
   Under **Build and deployment → Source**, choose **Deploy from a branch**.
   Branch: **main**, folder: **/ (root)**. Click **Save**.
6. Wait 1–2 minutes, refresh the Pages settings page — it will show your live URL:
   **https://scott-b-masterson.github.io/personal-website/**

That's it. Every future edit you upload the same way (GitHub keeps the history).

### Option B — GitHub Desktop (nicer for ongoing edits)
1. Install **GitHub Desktop** from https://desktop.github.com and sign in.
2. **File → Clone repository** → pick `scott-b-masterson/personal-website` → choose where
   to put it on your Mac.
3. Copy everything inside this folder into the cloned folder (replace if asked).
4. GitHub Desktop will show the changes. Type a summary (e.g., `Initial site`),
   click **Commit to main**, then **Push origin**.
5. Do step 5–6 from Option A once to enable GitHub Pages.

From then on: edit files → open GitHub Desktop → Commit → Push. Live in ~1 minute.

> 💡 **Cleaner URL (optional):** if you rename the repo to `scott-b-masterson.github.io`
> (Settings → General → Repository name), the site lives at
> `https://scott-b-masterson.github.io/` with no suffix. Everything here works either way.

---

## ✏️ Editing the site

| What you want to change | Where |
|---|---|
| Add a news item | `js/content.js` — add to the **top** of `SITE_NEWS` |
| Bio, research text, links | `index.html` — search for `✏️ EDIT` comments |
| Your photo | Drop `headshot.jpg` into `assets/` (portrait, ~4:5, ≥800px wide) |
| StoryMap link | `index.html` → Maps section → replace `href="#"` on the View-the-story button |
| Colors, fonts, spacing | `css/style.css` — tokens at the very top under `:root` |

To preview locally: just **double-click `index.html`** — it opens in your browser.
(The Inter font needs internet; everything else works offline.)

`CLAUDE.md` tracks project status and TODOs — keep it updated when working with Claude.

## Structure
```
index.html        all content (single page)
css/style.css     design system
js/content.js     ✏️ news items (edit me)
js/hero.js        world-network hero animation
js/main.js        scroll reveals, counters, nav
js/world-dots.js  baked Earth dot-map coordinates (auto-generated)
assets/           favicon, og-image, project art, headshot.jpg (you add)
```

© 2026 Scott Masterson
