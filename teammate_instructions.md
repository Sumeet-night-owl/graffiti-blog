# Brand design: instructions for the teammate

The blog works today, but its styling is a neutral placeholder. Your job is to apply the Graffiti brand from Figma: colors, fonts, spacing, pictures, the default social image, the favicon, and the code-block theme.

Below are copy-paste prompts for **Claude Code**. Run them one at a time, from the repo root (`graffiti-blog/`). Each prompt asks Claude Code to inspect the code and propose a plan first, so review and approve each plan before it makes changes.

## Where things live

| What                          | File                                    |
| ----------------------------- | --------------------------------------- |
| All styles (the only stylesheet) | `src/styles/global.css`              |
| Page shell: `<head>`, header, nav, footer | `src/layouts/BaseLayout.astro` |
| SEO, Open Graph and Twitter tags, default social image | `src/components/SEO.astro` |
| Base-aware URL helpers (`withBase`, `postPath`, `tagPath`, …) | `src/lib/urls.ts` |
| Site title, description, main-site URL | `src/consts.ts`                |
| Default social image (1200x630 PNG, placeholder) | `public/og-default.png` |
| Astro config: `site`, `base`, Markdown settings | `astro.config.mjs`       |
| Pages                         | `src/pages/index.astro`, `src/pages/[slug]/index.astro`, `src/pages/tags/index.astro`, `src/pages/tags/[tag]/index.astro`, `src/pages/404.astro` |
| Components                    | `src/components/PostList.astro`, `src/components/TagLinks.astro`, `src/components/FormattedDate.astro` |
| Example post (draft, shows every Markdown feature) | `src/content/posts/example-post/index.md` |

Paths marked **(new)** in the prompts don't exist yet. Create them.

## Rules that must keep working

- **Base path.** The blog is served at `https://mygraffiti.ai/blog/`.
  - Don't change `site`, `base` or `trailingSlash` in `astro.config.mjs`.
  - Build every internal URL with the helpers in `src/lib/urls.ts`, such as `withBase('favicon.svg')`. Never hardcode a root-relative path like `/favicon.svg` or `/fonts/x.woff2`.
  - Link to the main site with `MAIN_SITE_URL` from `src/consts.ts`, which is `https://mygraffiti.ai/`.
  - In CSS, reference files with relative paths (e.g. `url('../assets/fonts/x.woff2')`) so Astro rewrites them under `/blog/_astro/`.
- **SEO.**
  - Keep every tag `src/components/SEO.astro` outputs: canonical, description, Open Graph, Twitter, the RSS link and the sitemap link.
  - Keep `public/og-default.png` as a **1200x630 PNG with the same filename**. `SEO.astro` hardcodes its 1200x630 size and works out its type from the `.png` extension.
- **Accessibility (WCAG 2.1 AA).**
  - Body text and **link text must have a contrast ratio of at least 4.5:1** against their background, in every state: normal, hover, visited, and on any colored background.
  - Large text (24px, or 18.66px bold) needs at least 3:1. So do focus outlines and UI borders.
  - Links in body text must be recognizable without color, so keep the underline.
  - Keep a visible focus outline for keyboard users. Today this is the browser default. If you restyle it, use `:focus-visible` with at least 3:1 contrast.
  - Keep alt text on images, the heading order (one `h1` per page), and `lang="en"`.
  - Respect `prefers-reduced-motion` for any animation.
- **Checks.** Before opening a pull request, all of these must pass:
  ```sh
  npm run check:content   # post files and image sizes
  npm run check           # astro check
  npm run build
  npm run check:links     # every internal URL stays under /blog/
  ```
  Also look at the result:
  - In `npm run dev` at http://localhost:4321/blog/, which shows the draft example post at `/blog/example-post/`.
  - In `npm run preview` after a build, including a missing nested URL like http://localhost:4321/blog/does/not/exist/. Its styles must still load.
- **Scope.** Don't change the content schema (`src/content.config.ts`), the check scripts in `scripts/`, or the workflows in `.github/workflows/`. Work on a branch and open a pull request. The **Validate blog** check must pass.

---

## Prompt 1: Brand colors

```text
Apply the Graffiti brand colors from Figma to the blog.

First, inspect src/styles/global.css (the only stylesheet), src/layouts/BaseLayout.astro, the
components in src/components/, and the pages in src/pages/. List every hardcoded color in
global.css and where it is used. Then propose a plan and wait for my approval before changing
anything.

Brand colors (from Figma):
- Background: <hex>
- Text: <hex>
- Muted text: <hex>
- Primary / links: <hex>
- Link hover: <hex>
- Borders: <hex>
- Surface (cards, code, table headers): <hex>
- Accent: <hex>

Requirements:
- Define the colors once as CSS custom properties on :root at the top of src/styles/global.css,
  and replace every hardcoded color with var(--...). Keep all styles in global.css.
- Every text/background pair, including link text in normal, hover, and visited states, the
  muted text, tag chips, the draft badge, and table headers, must meet WCAG AA: 4.5:1 or higher
  for normal text, 3:1 for large text, focus outlines, and borders. Show me a table of each pair
  and its contrast ratio. If a brand color fails, propose the closest passing shade and ask me.
- Keep underlines on links in body text. Keep a visible focus outline (browser default today); if
  you style it, use :focus-visible with 3:1 contrast or higher.
- Don't change the base path, URL helpers in src/lib/urls.ts, or the SEO tags in
  src/components/SEO.astro.
- When done, run npm run check:content, npm run check, npm run build, and npm run check:links,
  and report the results.
```

## Prompt 2: Fonts

```text
Apply the Graffiti brand fonts to the blog.

First, inspect src/styles/global.css (font-family rules, font sizes, line heights, headings, code
font) and src/layouts/BaseLayout.astro (<head>). Then propose a plan and wait for my approval
before changing anything.

Fonts (from Figma):
- Headings: <font family, weights>
- Body: <font family, weights>
- Code: <font family or keep the current monospace stack>
- Type scale: <sizes / line heights for h1, h2, h3, body, small>

Requirements:
- Self-host the fonts as .woff2 files in src/assets/fonts/ (new). Declare them with @font-face in
  src/styles/global.css using relative url('../assets/fonts/...') paths, so the built files are
  served from /blog/_astro/. Use font-display: swap. Only include the weights we use. Don't load
  fonts from a third-party CDN such as Google Fonts unless I approve it.
- Keep a sensible system-font fallback stack after each brand font.
- Text must stay readable: body at least 16px, and contrast unchanged (WCAG AA 4.5:1 for text and
  links).
- No hardcoded root-relative URLs (e.g. /fonts/...). npm run check:links must pass.
- When done, run npm run check:content, npm run check, npm run build, and npm run check:links, and
  confirm in the built CSS (dist/_astro/*.css) that the font URLs start with /blog/_astro/.
```

## Prompt 3: Spacing and layout

```text
Apply the Graffiti brand spacing and layout to the blog.

First, inspect src/styles/global.css (container width, header, nav, footer, post list, post page,
tags, empty states, 404) and the markup in src/layouts/BaseLayout.astro, src/components/, and
src/pages/. Then propose a plan and wait for my approval before changing anything.

From Figma:
- Spacing scale: <e.g. 4, 8, 12, 16, 24, 32, 48, 64 px>
- Content width: <px>
- Border radius: <px>
- Header / footer layout: <description>
- Mobile breakpoint(s): <px>

Requirements:
- Define the spacing scale, content width, and radii as CSS custom properties on :root in
  src/styles/global.css and use them throughout. Keep all styles in global.css.
- Keep the existing class names and HTML structure where possible. If markup must change, keep
  one h1 per page, the header <nav aria-label="Main">, and the links built with the helpers in
  src/lib/urls.ts and MAIN_SITE_URL from src/consts.ts.
- Check the layout at 360px, 768px, and 1280px wide on the index, a post
  (/blog/example-post/ in npm run dev), the tags page, a tag page, and the 404 page. Nothing may
  overflow horizontally (tables and code blocks scroll inside their own box).
- Keep the empty states on the index and tags pages.
- When done, run npm run check:content, npm run check, npm run build, and npm run check:links,
  and report the results.
```

## Prompt 4: Code-block theme

```text
Match the blog's code blocks to the Graffiti brand.

First, inspect astro.config.mjs (there is no markdown.shikiConfig yet, so Astro's default Shiki
theme, github-dark, is used), the .prose pre and .prose code rules in src/styles/global.css
(there is no .astro-code rule yet; Shiki sets colors inline on <pre class="astro-code">), and how the code block renders in src/content/posts/example-post/index.md
(visible in npm run dev at /blog/example-post/). Then propose a plan and wait for my approval
before changing anything.

From Figma:
- Code block background: <hex>
- Theme: <a bundled Shiki theme name, light/dark pair, or token colors for a custom theme>

Requirements:
- Configure the theme in astro.config.mjs with markdown.shikiConfig, using either theme: '<name>'
  for one theme, or themes: { light: '<name>', dark: '<name>' } for a light/dark pair. With a
  pair, add the CSS in src/styles/global.css that switches .astro-code to the dark colors
  (the --shiki-dark and --shiki-dark-bg variables) under prefers-color-scheme: dark. For a custom
  theme from brand colors, use a theme object (or JSON file) passed to shikiConfig.
- Don't change site, base, or trailingSlash in astro.config.mjs.
- Code text must meet WCAG AA contrast (4.5:1) against the code-block background. Check the
  comment and punctuation token colors, which are often too faint, and list the ratios.
- Inline code (`like this`) must match the brand too.
- When done, run npm run check:content, npm run check, npm run build, and npm run check:links,
  and report the results.
```

## Prompt 5: Pictures and logo

```text
Add the Graffiti logo and brand pictures to the blog.

First, inspect src/layouts/BaseLayout.astro (the header shows the site title text from
SITE_TITLE in src/consts.ts, and the footer), src/styles/global.css, src/pages/index.astro, and
src/pages/404.astro. Then propose a plan and wait for my approval before changing anything.

Assets (from Figma):
- Logo: <file, e.g. logo.svg>
- Other pictures: <files and where they go>

Requirements:
- Put the files in src/assets/ (new) and import them, so Astro optimizes them and serves them
  from /blog/_astro/. Use the Image component from astro:assets for raster images. Don't put
  them in public/ with hardcoded paths.
- The header logo must stay a link to the blog home (withBase() from src/lib/urls.ts) with an
  accessible name, e.g. alt="Graffiti Blog". Decorative pictures use alt="".
- Every picture has explicit width/height (no layout shift) and is a reasonable size (each
  source file 1 MB or smaller).
- The 404 page (src/pages/404.astro) must still load its styles and any images from a nested
  missing URL such as /blog/does/not/exist/. Check this in npm run preview.
- When done, run npm run check:content, npm run check, npm run build, and npm run check:links,
  and report the results.
```

## Prompt 6: Default social image

```text
Replace the placeholder default social image with the Graffiti brand version.

First, inspect public/og-default.png (currently a grey placeholder) and how
src/components/SEO.astro uses it: it is the og:image and twitter:image for every page without a
hero image, with og:image:width 1200 and og:image:height 630 hardcoded and og:image:type
derived from the .png extension. Then propose a plan and wait for my approval before changing
anything.

New image: <path to the exported file from Figma>

Requirements:
- Replace public/og-default.png with the new image, exactly 1200x630 pixels, PNG format, the same
  filename, and ideally under 300 KB. Verify the dimensions and format of the file. Keep the
  important content in the center, since some platforms crop the edges.
- Don't change SEO.astro unless the image cannot be a 1200x630 PNG. If so, explain why and
  update the filename, width, and height there to match.
- After npm run build, confirm that dist/index.html has og:image
  https://mygraffiti.ai/blog/og-default.png and that dist/og-default.png is the new image.
- When done, run npm run check:content, npm run check, npm run build, and npm run check:links,
  and report the results.
```

## Prompt 7: Favicon

```text
Add the Graffiti favicon to the blog.

First, inspect src/layouts/BaseLayout.astro (<head>, which has no favicon yet), the URL helpers
in src/lib/urls.ts, and the public/ folder. Then propose a plan and wait for my approval before
changing anything.

Favicon files (from Figma): <favicon.svg, and a 180x180 PNG for Apple devices>

Requirements:
- Add public/favicon.svg (new) and public/apple-touch-icon.png (new, 180x180).
- Link them in the <head> of src/layouts/BaseLayout.astro using withBase() from src/lib/urls.ts:
  href={withBase('favicon.svg')} and href={withBase('apple-touch-icon.png')}. Never hardcode
  /favicon.svg or /favicon.ico (the root belongs to the main site).
- After npm run build, confirm that the built HTML links /blog/favicon.svg and
  /blog/apple-touch-icon.png, and that both files are in dist/.
- When done, run npm run check:content, npm run check, npm run build, and npm run check:links,
  and report the results.
```

## Prompt 8: Final review

```text
Review the brand design changes on this branch before I open a pull request.

First, inspect the diff against main, src/styles/global.css, src/layouts/BaseLayout.astro, and
astro.config.mjs. Then propose a review plan and wait for my approval before changing anything.

Check and report:
- WCAG AA contrast for every text/background pair, including link text in all states (4.5:1 or
  higher), large text, focus outlines, and borders (3:1 or higher), and code-block tokens.
- No hardcoded root-relative URLs in src/ (everything goes through src/lib/urls.ts or relative
  CSS url() paths), and site/base/trailingSlash in astro.config.mjs are unchanged.
- SEO tags in src/components/SEO.astro unchanged; public/og-default.png is a 1200x630 PNG.
- Pages look right at 360px, 768px, and 1280px: index, /blog/example-post/ (in npm run dev),
  tags, a tag page, and the 404 page at a nested missing URL (in npm run preview).
- npm run check:content, npm run check, npm run build, and npm run check:links all pass.
- The example post is still draft: true and nothing in src/content.config.ts, scripts/, or
  .github/workflows/ changed.
```
