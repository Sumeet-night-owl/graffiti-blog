// Every internal URL goes through these helpers so it respects `base` ('/blog').
// BASE_URL is '/blog/' because trailingSlash is 'always'.
const BASE = import.meta.env.BASE_URL.endsWith('/')
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}/`;

/** `withBase('tags/')` → `/blog/tags/`. Pass paths without a leading slash. */
export function withBase(path = ''): string {
  return `${BASE}${path.replace(/^\/+/, '')}`;
}

export function postPath(slug: string): string {
  return withBase(`${slug}/`);
}

export function tagPath(tagSlug: string): string {
  return withBase(`tags/${tagSlug}/`);
}

export function tagsIndexPath(): string {
  return withBase('tags/');
}

/** Absolute URL on the configured `site`, e.g. for canonical and Open Graph tags. */
export function absoluteUrl(pathOrUrl: string, site: URL | undefined): string {
  if (!site) throw new Error('`site` must be set in astro.config to build absolute URLs.');
  return new URL(pathOrUrl, site).href;
}
