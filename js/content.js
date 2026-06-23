/* ═══════════════════════════════════════════════════════════════
   content.js — ✏️ THE FILE YOU EDIT MOST OFTEN
   Add news items to the TOP of the list below. Each item:
     date:  short label shown on the left
     text:  the announcement (plain text)
     link:  optional — { url: "...", label: "shown as a link" }
   Save the file, refresh the page, done.
   ═══════════════════════════════════════════════════════════════ */

const SITE_NEWS = [
  {
    date: "Jun 2026",
    text: "Completed Social & Economic Networks at Stanford",
  },
  {
    date: "Jun 2026",
    text: "Submitted my constrained-randomization paper on tax-haven sandwich structures to Network Science (Cambridge). The working paper is on SSRN.",
    link: { url: "https://papers.ssrn.com/abstract=6691760", label: "Read it here." }
  },
  {
    date: "Dec 2025",
    text: "Submitted \"More Than Miles: The True Cost of a Grocery Trip\" to the ArcGIS StoryMaps Annual Competition.",
    link: { url: "https://storymaps.arcgis.com/stories/ac56f552e0254954a7d387a317794e5b", label: "View the story." }
  },
  {
    date: "Jul 2025",
    text: "Joined Stanford Graduate School of Business as a Predoctoral Fellow, working with Prof. Rebecca Lester.",
  },
  {
    date: "Mar 2025",
    text: "Named NCAA Indoor Track & Field All-American.",
    link: { url: "https://emoryathletics.com/sports/mens-track-and-field/roster/scott-masterson/9847", label: "Athlete page." }
  }
];

/* Coming up (rendered after news, slightly dimmed) — optional list */
const SITE_UPCOMING = [
  {
    date: "Fall 2026",
    text: "Graduate Stochastic Processes (STATS 217) begins this summer.",
  }
];
