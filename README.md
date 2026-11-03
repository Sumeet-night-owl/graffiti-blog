# Graffiti Blog

The Graffiti blog, served at **https://mygraffiti.ai/blog/**.

It is a static site built with [Astro](https://astro.build/). Posts are Markdown files in this repository. There is no CMS, no database, and no server-side rendering.

## Stack

- **Astro 7** with static output and no adapter
- **TypeScript** in strict mode
- **Content collections**, with post frontmatter validated by Zod
- **@astrojs/rss** for the feed
- **@astrojs/sitemap** for the sitemap
- **sharp** for image optimization and Open Graph images

## Requirements

- Node.js `>=22.23.4`. The version is pinned in `.nvmrc`, so run `nvm use` to pick it up.
- npm

## Commands

| Command               | What it does                                                        |
| --------------------- | ------------------------------------------------------------------- |
| `npm install`         | Install dependencies                                                |
| `npm run dev`         | Start the dev server at http://localhost:4321/blog/ (drafts shown)  |
| `npm run check`       | Type-check the project (`astro check`)                              |
| `npm run build`       | Build the production site to `dist/` (drafts excluded)              |
| `npm run preview`     | Serve the production build locally at http://localhost:4321/blog/   |
| `npm run check:links` | Scan `dist/` for links that don't respect `/blog/` (after build)    |

## Project structure

```
src/
  content.config.ts        posts collection, slug rules, frontmatter schema
  content/posts/<slug>/    one folder per post: index.md + its images
  pages/                   index, [slug] post page, tags, 404, rss.xml
  layouts/, components/    page shell, SEO tags, post list, tags, dates
  lib/                     URL helpers (base-aware), posts/tags, dates, slugify
  styles/global.css        the only stylesheet
public/og-default.png      default social image for posts without a hero
scripts/check-links.mjs    post-build link scanner
```

## URLs

The site is deployed under `/blog`:

- `astro.config.mjs` sets `site: 'https://mygraffiti.ai'`, `base: '/blog'` and `trailingSlash: 'always'`.
- Internal links are built with the helpers in `src/lib/urls.ts`. Don't hardcode root-relative paths such as `/tags/`.
- Links to the main site use `https://mygraffiti.ai/`.

| Page        | URL                                              |
| ----------- | ------------------------------------------------ |
| Index       | `https://mygraffiti.ai/blog/`                    |
| Post        | `https://mygraffiti.ai/blog/<slug>/`             |
| Tags        | `https://mygraffiti.ai/blog/tags/`               |
| Tag         | `https://mygraffiti.ai/blog/tags/<tag>/`         |
| RSS         | `https://mygraffiti.ai/blog/rss.xml`             |
| Sitemap     | `https://mygraffiti.ai/blog/sitemap-index.xml`   |

## Content rules (enforced at build time)

- **Folder name is the slug.** It must be lowercase kebab-case, and it must not use a reserved name such as `tags`, `rss.xml` or `404`.
- **Required frontmatter:**
  - `title`, `description`, `author`
  - `pubDate`: a real calendar date in `YYYY-MM-DD` form. Blank values and dates like `2026-02-30` are rejected.
- **Optional frontmatter:**
  - `updatedDate`
  - `tags`: a list of tags. Each must contain at least one letter or digit.
  - `heroImage`: a relative path to an image in the post's folder. If you set it, `heroImageAlt` is required.
  - `draft`: defaults to `false`.
- **Drafts** appear in `npm run dev` only. They are excluded from production pages, RSS and the sitemap.

Any rule violation fails `npm run build` with an error that names the file.
