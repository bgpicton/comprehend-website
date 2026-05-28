# CLAUDE.md — COMPREHEND Lab Website

Working notes for any Claude session opened inside this project. Read this first.

## What this project is

The public marketing site for the COMPREHEND Lab. Three static pages — home, people, research — served at [comprehendlab.com](https://comprehendlab.com). The lab studies how medical information reaches patients in the digital era, combining clinical research, AI methodology, and infodemiology.

- GitHub: [github.com/bgpicton/comprehend-website](https://github.com/bgpicton/comprehend-website)
- Hosting: Cloudflare Pages, auto-deploys from `main` (no manual deploy step)
- Domain: `comprehendlab.com` (registered via Cloudflare Registrar)
- Owner / primary editor: Bryce Picton (co-founder, incoming Henry Ford neurosurgery resident)

## Hard constraints — do not violate

1. **No frameworks.** No React, Vue, Svelte, Tailwind, Next.js, anything. Plain HTML, CSS, and vanilla JS only.
2. **No build step.** The site must work when `index.html` is opened directly from the filesystem. Anything that requires `npm install` or compilation is rejected.
3. **No em-dashes in body copy.** Bryce's writing preference and the lab brand guide both ban them. Use a sentence break or comma instead. This applies to HTML content, not code or comments.
4. **No new dependencies, period.** If a task seems to need a library, push back first.
5. **Single shared stylesheet** (`css/styles.css`) and **single shared script** (`js/main.js`). Do not split them.

## Brand system source of truth

The full brand guide lives at:

```
/Users/brycepicton/Desktop/COMPREHEND_Lab_Drive_Bundle/Brand Assets/COMPREHEND-Brand-Guidelines.md
```

Read it before making any visual changes. Key values are already wired into `css/styles.css` as CSS custom properties on `:root`:

- Navy `#1B2A5E` — headers, primary type
- Teal `#3FAB95` — accents, eyebrows, top stripes on cards, links
- Ink `#1F2937` — body copy
- Plus mist, steel, smoke, gray neutrals

Visual motifs already in use:
- `assets/network.svg` — connected-dots pattern behind hero / page headers / CTA strip
- `assets/wave-divider.svg` — wave divider between sections
- `.card` — white card with 3px teal top stripe (echoes the deck's "CardStripe" motif)
- Eyebrows — short ALL-CAPS labels in teal above sections (e.g., "OUR MISSION", "WHAT WE STUDY")

The brand uses Arial, but the web stylesheet uses the system stack instead (`system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`). This is intentional — no web fonts loaded, faster, still close to Arial on most systems.

## Deployment flow

Push to `main` on GitHub → Cloudflare Pages auto-builds and deploys (no actual build, just publishes the static files) → live at comprehendlab.com within ~60 seconds.

There is no staging environment. PRs against `main` get a Cloudflare preview URL automatically.

To make a change live: edit, commit, push. That's it.

## Local preview

The fastest reliable preview is Python's built-in server. From the project root:

```
python3 -m http.server 8000
```

Then open `http://localhost:8000`. Opening `index.html` via `file://` also works, but some browsers handle relative paths differently in that mode.

## File layout

Standard static site. Nothing surprising:

- `index.html`, `people.html`, `research.html` — the three pages
- `css/styles.css` — shared stylesheet (one file, do not split). Includes a `prefers-color-scheme` dark mode built on semantic CSS custom properties, and a print stylesheet for the research page.
- `js/main.js` — one IIFE, feature-detected and guarded so each block only runs where its elements exist: mobile hamburger toggle, sticky-nav shadow, sticky-bar height measurement (`--nav-h` / `--toolbar-h`), the research toolbar (chip counts, year-filter options, search/type/year filtering, scroll-spy, copy-citation/BibTeX), people-page bio clamp toggles, home-page stat counters, and scroll-reveal. All animation respects `prefers-reduced-motion`.
- `assets/` — `logo.png`, `banner.png`, `network.svg`, `wave-divider.svg`, `silhouette.svg`, plus `people/` for real headshots when they land
- `README.md` — human-facing editing instructions

## People roster — source of truth

The complete current roster lives in `people.html`. Three top-level groups:

1. **Co-Founders** (3) — Saman Andalib (UCI Ortho PGY-1), Bryce Picton (Henry Ford Neurosurgery PGY-1), Aidin Spina (UCSD Ophthalmology PGY-1). All wear the teal `FOUNDER` pill.
2. **Faculty** (8) — grouped by specialty: Anesthesiology/Pain (Nelson), Orthopaedic Surgery (Scolaro, Hebert-Davies, Wu, Hashmi, Park), Neurosurgery (Oh), Ophthalmology (Fox). All wear the teal `ATTENDING PHYSICIAN` pill.
3. **Trainees & Students** (11) — MS3 (Brunette, Thiagarajan), MS2 (Cheng, Huang, Liu, Tazhibi, Habib), MS1 (Solimon, Chandekar), PhD (Ilaty), Undergraduate (R. Andalib). No pill.

Total: 22 members. If you add or remove members, update the `data-target` on the "Lab members" stat in `index.html` to match.

Card template: `<article class="person">` containing a headshot `<img>`, optional pill, `<h3>` name, `.role` line, `.affiliation` line, an optional `.bio` paragraph, and `.email` link. Copy any existing card to add a new member. Bios are clamped to four lines and JavaScript adds a "Read more" toggle automatically when one overflows, so paste the full bio as-is.

## Outstanding work

1. **Real emails** — most members have real addresses now. Confirm any remaining placeholders and drop the `<!-- TODO: confirm email -->` comment when you do.
2. **Real headshots** — several members still use `assets/silhouette.svg`. Drop real photos into `assets/people/` named `firstname-lastname.jpg` and update the `src=` and `alt=`.
3. **Grants section** — hidden (commented out near the bottom of `research.html`) until the first real entry. To restore: uncomment that block and add a `Grants` chip to `.section-jump` in the research toolbar. Awards, Publications, Talks, and Posters are all populated.

## Conventions when editing

- **Research entries**: every item is a `<li class="research-item" data-type="…" data-year="YYYY">` with the visible citation inside a `.item-body` div. `data-type` is `award` / `publication` / `talk` / `poster` / `grant` and drives the type filter and chip counts; `data-year` drives the year filter and the publication year subheadings. The chip counts, year dropdown, and numbering update automatically from the DOM.
- **Publication formatting**: inside `.item-body`, `Authors. <a href="DOI/PubMed URL">Title</a>. <em>Journal</em>. Year;Volume:Pages. doi:DOI`. Bold any lab member with `<strong>Last F</strong>`. Italicize the journal with `<em>`. Add `<span class="oa-badge">Open access</span>` for free full text. Publications also carry citation `data-*` attributes (`data-authors`, `data-title`, `data-journal`, `data-volume`, `data-pages`, `data-doi`, or `data-url`) plus two `.cite-btn` buttons (`data-cite="copy"` and `data-cite="bibtex"`); keep the data attributes in sync with the visible text. Copy an existing publication `<li>` as the template. Group under the right year `<li class="year-head">YYYY</li>`, newest on top.
- **Pills**: only co-founders get `Founder`, only attendings get `Attending Physician`. Trainees have no pill.
- **Eyebrows**: short ALL-CAPS labels in teal, used to label section purpose ("OUR MISSION", "WHAT WE STUDY", "PUBLICATIONS", etc.). Never longer than ~3 words.
- **Accessibility**: every interactive element keeps a visible focus state (`:focus-visible` is wired). Every image has meaningful `alt` text. The page respects `prefers-reduced-motion`.
- **Responsive**: mobile-first. Breakpoints at 600px (people grid 2 cols), 768px (card grids 2 cols, nav switches from hamburger to horizontal), 1024px (3-col grids, looser padding). Layout has been verified at 375 / 768 / 1280.
- **Touch targets**: 44x44 minimum. Buttons enforce `min-height: 44px`.

## What this site is NOT

- Not a blog. Don't add a posts/articles section without explicit ask.
- Not a CMS. All content is hand-edited in HTML.
- Not a SPA. Each page is a real document with its own `<title>` and meta tags.
- Not analytics-heavy. Currently no tracking at all. Cloudflare Pages provides aggregate visit counts in its dashboard, which is enough.

## When in doubt

Ask Bryce. He has strong opinions on visual identity (see the brand guide), writing voice (terse, clinical, no em-dashes), and scope creep (avoid it).
