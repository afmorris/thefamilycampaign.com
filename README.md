# The Family Campaign

A static archive of family camping trips, written as Civil War–era field dispatches. Built with [Eleventy (11ty) v3](https://www.11ty.dev/) and plain Nunjucks templates. Hosted on Cloudflare Pages.

## Local development

Requires Node.js 18+.

```bash
npm install
npm run serve
```

The site will be available at `http://localhost:8080` (or whatever 11ty prints). Edit templates or content and the browser will live-reload.

To build for production:

```bash
npm run build
```

Output is written to `dist/`.

## Project structure

```
src/
  _includes/
    base.njk          # Base HTML layout, loads fonts and CSS
  campaigns/
    *.md              # Campaign (trip) frontmatter files
  dispatches/
    *.md              # Letter/dispatch markdown files
  css/
    site.css          # All styles, design tokens, animations
  js/
    reader.js         # Vanilla JS progressive enhancement for the campaign reader
  index.njk           # Home page
  campaigns.njk       # Paginated campaign reader template
```

## How to add a new campaign

1. Create a new markdown file in `src/campaigns/`.
2. Use this frontmatter (include `permalink: false` so the file does not generate a standalone page):

```yaml
---
title: The Shenandoah Campaign
number: 2
location: Shenandoah National Park, Virginia
dates: October 2026
summary: A crisp autumn march among the ridge lines.
hounds: 2
casualties: 0
slug: shenandoah
permalink: false
---
```

3. Use `number` for ordering and `slug` for the URL (`/campaigns/<slug>/`).

## How to add a new dispatch

1. Create a new markdown file in `src/dispatches/`.
2. Reference the campaign by `slug` and set the order, and add `permalink: false` so it only appears inside the campaign reader:

```yaml
---
campaign: shenandoah
order: 1
dateline: October the 12th, 2026 — Morning
place: Front Royal, Virginia
permalink: false
---
```

3. Write the letter body in markdown.
4. The first paragraph will be styled as the salutation and the last paragraph as the sign-off.

## Cloudflare Pages settings

- **Build command:** `npm run build`
- **Output directory:** `dist`
- **Root directory:** `/` (leave default)

No framework preset is required; the build is plain Eleventy.

## Notes

- The site is fully readable with JavaScript disabled; all dispatches render as stacked letters in a `<noscript>` block.
- The single JS file (`src/js/reader.js`) enhances the campaign reader with pagination, page-turn animation, and an ink-in effect. It respects `prefers-reduced-motion`.
