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
├── css/styles.css          Single shared stylesheet
├── js/main.js              Mobile nav toggle, sticky nav shadow
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

All editable spots are marked with `<!-- TODO: ... -->` comments. Search for `TODO` in any HTML file to find them.

### 1. Fill in the long-term goals on the home page

Open `index.html` and find the comment that begins:

```
SECTION 4 — LONG-TERM IMPACT
TODO: Bryce to provide final long-term goals copy.
```

Replace each of the three `card-placeholder` blocks with the real long-term goal text. Remove the `card-placeholder` class so the cards adopt the standard teal accent.

### 2. Replace a placeholder email

Every email currently uses the pattern `firstname.lastname@comprehendlab.com` and is preceded by `<!-- TODO: confirm email -->`.

Search the file for `@comprehendlab.com`, replace the address in both the `href="mailto:..."` and the link text, and delete the TODO comment.

### 3. Replace a placeholder headshot

1. Save the new image as a square JPG named `firstname-lastname.jpg` (lowercase, dashes for spaces).
2. Drop it into `assets/people/`.
3. In `people.html`, find the matching person card and change `src="assets/silhouette.svg"` to `src="assets/people/firstname-lastname.jpg"`. Update the `alt` text if needed.

### 4. Add a new lab member

In `people.html`, copy any existing `<article class="person">` block, paste it into the correct subgroup, and update the headshot, name, role, affiliation, and email. The pill (`<span class="pill">…</span>`) is optional — keep it for founders and attending physicians, omit it for trainees.

### 5. Add a publication, talk, poster, grant, or award

Open `research.html` and find the relevant section. Each section has a format comment near the top of its `<ul>`. Copy a `<li>` block and follow the format. Place the newest entry at the top of the list.

For publications, bold any COMPREHEND lab members with `<strong>Last F</strong>`, link the title to its PubMed or DOI page, and italicize the journal name with `<em>`.

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

## Accessibility and SEO notes

- Each page has a unique `<title>` and `<meta name="description">`.
- The logo and banner use meaningful `alt` text.
- Focus states are visible (teal outline). The site respects `prefers-reduced-motion`.
- Color contrast for body text on background is WCAG AA compliant.

## Still outstanding before launch

1. Long-term goals copy on the home page.
2. Real email addresses for every member.
3. Real headshots.
4. Remaining publications, talks, posters, grants, awards.
