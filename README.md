# S. B. Lombardo — Portfolio Site

Portfolio and commission site for S. B. Lombardo: digital illustration, VTuber model art, and traditional acrylic painting. Static HTML/CSS/JS, no build step, no dependencies — built to be served as-is (including directly from GitHub Pages).

## Structure

```
.
├── index.html      Main portfolio page (hero, process, commissions,
│                    pricing, terms of service, gallery, contact)
├── shop.html        Placeholder "coming soon" page, linked from the nav
├── style.css        All custom CSS (Tailwind handles utility classes;
│                    this file covers everything Tailwind doesn't:
│                    fonts, custom components, animations, dark mode)
├── main.js          Theme toggle, sticky header, mobile menu, scroll
│                    spy, hero slideshow, scroll reveals, gallery
│                    lightbox, contact form validation
└── README.md
```

Everything lives flat in one folder — no subfolders to keep track of when
uploading to GitHub.

## Tech

- [Tailwind CSS](https://tailwindcss.com/) via the CDN script (no build step)
- Google Fonts: Fraunces (display) + Work Sans (body)
- Vanilla JavaScript, no frameworks or dependencies
- All internal links and asset paths are relative (`./style.css`, `./main.js`,
  `shop.html`), so the site works from any subfolder — including a GitHub
  Pages project URL like `https://<username>.github.io/<repo-name>/`

## Running locally

No build step is required. Either open `index.html` directly in a browser, or
serve the folder locally (recommended, since some browsers restrict features
under the `file://` protocol):

```bash
# Python
python3 -m http.server 8000

# or Node
npx serve .
```

Then visit `http://localhost:8000`.

## Editing

- Text content lives directly in `index.html` / `shop.html`.
- Colors, fonts, and spacing tokens are defined in the `tailwind.config` script
  block at the top of each HTML file's `<head>`.
- Anything not covered by a Tailwind utility class (custom components like
  `.tier-card`, `.tos-item`, `.gallery-item`, animations, dark-mode overrides)
  lives in `style.css`.
