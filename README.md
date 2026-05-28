# COMPREHEND Lab Website

The static website for the COMPREHEND Lab at [comprehendlab.com](https://comprehendlab.com).

Three pages: **Home** (`index.html`), **People** (`people.html`), **Research** (`research.html`).
Plain HTML, CSS, and minimal vanilla JavaScript. No frameworks, no build step.

## File structure

```
comprehend-website/
├── index.html              Home page
├── people.html             Lab members
├── research.html           Publications, talks, posters, grants, awards
├── css/styles.css          Single shared stylesheet (incl. dark mode + print)
├── js/main.js              Nav toggle, sticky shadow, research filters,
│                           copy-citation/BibTeX, bio toggles, stat counters,
│                           scroll-reveal
├── assets/
│   ├── logo.png            COMPREHEND Lab logo
│   ├── banner.png          COMPREHEND Lab banner
│   ├── network.svg         Network motif (hero background)
│   ├── wave-divider.svg    Wave divider between sections
│   ├── silhouette.svg      Placeholder headshot
│   └── people/             Real headshots go here (firstname-lastname.jpg)
├── README.md               This file
└── .gitignore
```

## Previewing locally

No server required. Open `index.html` in any browser:

```
open index.html        # macOS
```

For a slightly more accurate preview with proper MIME types, you can run a one-line Python server from the project root:

```
python3 -m http.server 8000
```

Then visit `http://localhost:8000` in your browser.

## How to make common edits

The home page sections (hero, mission, by-the-numbers stats, what we study, long-term impact, CTA) are all written out in `index.html`. Edit the copy in place. If you add or remove lab members, publications, talks, posters, or awards, update the matching `data-target` value on the relevant `.stat-num` in the "by the numbers" section so the home-page counters stay accurate.

### 1. Replace a placeholder email

If any email still uses the pattern `firstname.lastname@comprehendlab.com` (preceded by `<!-- TODO: confirm email -->`), replace the address in both the `href="mailto:..."` and the link text, and delete the TODO comment.

### 2. Replace a placeholder headshot

1. Save the new image as a square JPG named `firstname-lastname.jpg` (lowercase, dashes for spaces).
2. Drop it into `assets/people/`.
3. In `people.html`, find the matching person card and change `src="assets/silhouette.svg"` to `src="assets/people/firstname-lastname.jpg"`. Update the `alt` text if needed.

### 3. Add a new lab member

In `people.html`, copy any existing `<article class="person">` block, paste it into the correct subgroup, and update the headshot, name, role, affiliation, and email. The pill (`<span class="pill">…</span>`) is optional — keep it for founders and attending physicians, omit it for trainees.

### 4. Add a publication, talk, poster, grant, or award

Open `research.html` and find the relevant section. Each section has a format comment near the top of its `<ul>`. Copy a `<li class="research-item">` block and follow the format. Place the newest entry at the top of its section, under the correct year subheading where one exists.

Every entry needs the wrapper structure so the filters, counts, and search work:

```html
<li class="research-item" data-type="poster" data-year="2025">
  <div class="item-body">Authors. "Title." Venue, City, Date.</div>
</li>
```

- `data-type` is one of `award`, `publication`, `talk`, `poster` (or `grant` once that section is restored). It drives the type filter and the chip counts.
- `data-year` is the four-digit year. It populates the year dropdown and the publication year subheadings.
- Keep the visible citation inside `.item-body`.

For publications, also add the citation `data-*` attributes that power the **Copy citation** and **BibTeX** buttons, the two `.cite-btn` buttons, and an `<span class="oa-badge">Open access</span>` inside `.item-body` when the article is free to read:

```html
<li class="research-item" data-type="publication" data-year="2025"
    data-authors="Last F, Last F" data-title="Article title"
    data-journal="Journal Name" data-volume="10(1)" data-pages="e123"
    data-doi="10.xxxx/xxxxx">
  <div class="item-body">
    <strong>Last F</strong>, Last F.
    <a href="https://doi.org/10.xxxx/xxxxx" target="_blank" rel="noopener">Article title</a>.
    <em>Journal Name</em>. 2025;10(1):e123. doi:10.xxxx/xxxxx
    <span class="oa-badge" title="Free full text">Open access</span>
  </div>
  <div class="item-actions">
    <button type="button" class="cite-btn" data-cite="copy">Copy citation</button>
    <button type="button" class="cite-btn" data-cite="bibtex">BibTeX</button>
  </div>
</li>
```

Bold any COMPREHEND lab members with `<strong>Last F</strong>`, link the title to its PubMed or DOI page, and italicize the journal name with `<em>`. Keep the `data-*` values in sync with the visible text. The chip counts, year dropdown, and number badges all update automatically from the DOM, so there is nothing else to edit.

The **Grants** section is currently hidden (commented out near the bottom of `research.html`). To bring it back, uncomment that block and add a `Grants` chip to `.section-jump` in the toolbar.

## Deploying to Cloudflare Pages

The site is a flat static folder, so it deploys with no build configuration.

**Option A — Git-based (recommended).**

1. Push this folder to a GitHub repository.
2. In the Cloudflare dashboard, go to **Workers & Pages → Create application → Pages → Connect to Git**.
3. Pick the repo. Leave the build command blank. Set the output directory to `/` (the project root).
4. Deploy. Cloudflare assigns a `*.pages.dev` URL immediately.
5. Under **Custom domains**, add `comprehendlab.com` and follow the DNS prompts.

**Option B — Drag-and-drop.**

1. In the Cloudflare dashboard, go to **Workers & Pages → Create application → Pages → Upload assets**.
2. Drag the entire `comprehend-website` folder into the upload area.
3. Deploy and attach the custom domain as above.

## Page features

- **Home**: typographic hero, three study-branch cards with inline SVG icons, an animated "by the numbers" stat strip, and a closing CTA. Stat counters and card reveals animate on scroll and are disabled under `prefers-reduced-motion`. Update the `data-target` values on `.stat-num` when the research or people pages change.
- **People**: every bio clamps to four lines with a "Read more / Read less" toggle. The toggle is added by JavaScript only when a bio actually overflows, so the full text still shows with scripting disabled.
- **Research**: a sticky toolbar with section-jump chips (with live counts), plus search, type, and year filters. Publications are grouped by year and carry per-entry Copy citation and BibTeX buttons. Empty sections and year groups hide themselves while filtering.

## Accessibility and SEO notes

- Each page has a unique `<title>` and `<meta name="description">`.
- The logo and banner use meaningful `alt` text.
- Focus states are visible (teal outline). The site respects `prefers-reduced-motion`.
- Color contrast for body text on background is WCAG AA compliant.
- The site honors `prefers-color-scheme`, so it has a built-in dark mode.
- The Research page has a print stylesheet that drops the navigation and buttons and expands link URLs, so it prints as a clean reference list.

## Still outstanding before launch

1. Real email addresses for every member (most are real; confirm the remaining placeholders).
2. Real headshots for the members still using `assets/silhouette.svg`.
3. Continue adding publications, talks, posters, and awards as they land. Restore the Grants section once there is a first entry.
