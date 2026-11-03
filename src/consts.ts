export const SITE_TITLE = 'Graffiti Blog';
export const SITE_DESCRIPTION = 'News, guides, and product updates from the Graffiti team.';

/** The main Graffiti site. Links from the blog to it must use this absolute URL. */
export const MAIN_SITE_URL = 'https://mygraffiti.ai/';

/** Post folders must be lowercase kebab-case, e.g. `my-first-post`. */
export const POST_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * Folder names that would clash with generated routes or build output under /blog/.
 * Some (e.g. `rss.xml`) already fail the kebab-case rule; they are listed so the
 * error message says why.
 */
export const RESERVED_SLUGS = new Set([
  'tags',
  'rss.xml',
  '404',
  '500',
  'index',
  'sitemap-index.xml',
  'sitemap-0.xml',
  'og-default.png',
  '_astro',
  '_image',
]);
