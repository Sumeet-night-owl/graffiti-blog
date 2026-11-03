// Post-build link scanner. Run after `npm run build`: `npm run check:links`.
//
// Flags, in dist/**/*.{html,xml,css}:
//   - root-relative URLs outside /blog/ (e.g. "/favicon.ico", "/_astro/x.css")
//   - document-relative URLs (e.g. "tags/", "../x.png"), which break on nested 404s
//   - https://mygraffiti.ai/blog/... URLs with the wrong form (http, www, missing
//     trailing slash, double slashes) or that point at nothing in dist/
//   - /blog/... URLs that point at nothing in dist/
// Ignores fragments, mailto:/tel:/data:, external hosts, and absolute links to
// the main site (https://mygraffiti.ai/ outside /blog/).

import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { extname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const DIST = fileURLToPath(new URL('../dist/', import.meta.url));
const BASE = '/blog/';
const SITE_HOST = 'mygraffiti.ai';
const SITE_ORIGIN = `https://${SITE_HOST}`;

// Only these meta tags carry URLs; og:title, og:type, twitter:card etc. do not.
const URL_META = new Set(['og:url', 'og:image', 'og:image:url', 'og:image:secure_url', 'twitter:image']);

if (!existsSync(DIST)) {
  console.error('dist/ not found. Run `npm run build` first.');
  process.exit(1);
}

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

function decode(value) {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function attrs(tag) {
  const out = {};
  for (const m of tag.matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g)) {
    out[m[1].toLowerCase()] = decode(m[2] ?? m[3] ?? m[4] ?? '');
  }
  return out;
}

function urlsFromHtml(html) {
  const urls = [];
  for (const [tag] of html.matchAll(/<[a-zA-Z][^>]*>/g)) {
    const a = attrs(tag);
    for (const name of ['href', 'src', 'action', 'poster']) if (a[name] !== undefined) urls.push(a[name]);
    for (const name of ['srcset', 'imagesrcset']) {
      if (a[name]) for (const part of a[name].split(',')) urls.push(part.trim().split(/\s+/)[0]);
    }
    if (tag.startsWith('<meta') && URL_META.has(a.property ?? a.name)) urls.push(a.content ?? '');
  }
  for (const [, css] of html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)) urls.push(...urlsFromCss(css));
  for (const [, style] of html.matchAll(/style="([^"]*)"/g)) urls.push(...urlsFromCss(decode(style)));
  return urls;
}

function urlsFromCss(css) {
  return [...css.matchAll(/url\(\s*(['"]?)([^'")]*)\1\s*\)/g)].map((m) => m[2]);
}

function urlsFromXml(xml) {
  const urls = [];
  for (const m of xml.matchAll(/<(link|loc|guid|url)\b[^>]*>([^<]*)<\/\1>/g)) urls.push(decode(m[2].trim()));
  for (const [, href] of xml.matchAll(/<\?xml-stylesheet[^>]*href="([^"]*)"/g)) urls.push(href);
  return urls;
}

/** Maps a /blog/... pathname to a file in dist/, or null if nothing is there. */
function distTarget(pathname) {
  const rest = decodeURIComponent(pathname.slice(BASE.length));
  const candidates = pathname.endsWith('/')
    ? [join(DIST, rest, 'index.html')]
    : [join(DIST, rest)];
  return candidates.find((c) => existsSync(c)) ?? null;
}

function checkBlogPath(pathname) {
  if (pathname.includes('//')) return 'path contains "//"';
  if (!pathname.endsWith('/') && !extname(pathname)) return 'page URL is missing its trailing slash';
  if (!distTarget(pathname)) return 'target does not exist in dist/';
  return null;
}

/** Returns a problem description, or null if the URL is fine or out of scope. */
function check(raw) {
  const url = raw.trim();
  if (url === '') return 'empty URL';
  if (url.startsWith('#')) return null;
  if (/^(mailto|tel|data|javascript):/i.test(url)) return null;

  if (url.startsWith('//')) {
    const host = new URL(`https:${url}`).hostname;
    return host.endsWith(SITE_HOST) ? 'protocol-relative URL to our own site; use https://' : null;
  }

  if (/^[a-z][a-z0-9+.-]*:/i.test(url)) {
    let parsed;
    try {
      parsed = new URL(url);
    } catch {
      return 'malformed absolute URL';
    }
    const host = parsed.hostname;
    if (host !== SITE_HOST && !host.endsWith(`.${SITE_HOST}`)) return null; // external
    if (parsed.protocol !== 'https:') return `must use https://${SITE_HOST}`;
    if (host !== SITE_HOST) return `must use the bare host ${SITE_HOST} (no subdomain)`;
    if (parsed.port) return 'must not include a port';
    const path = parsed.pathname;
    if (path.startsWith('/blog') && !path.startsWith(BASE)) {
      return 'blog URL must start with https://mygraffiti.ai/blog/';
    }
    if (!path.startsWith(BASE)) return null; // intentional link to the main site
    return checkBlogPath(path);
  }

  if (url.startsWith('/')) {
    const pathname = url.split(/[?#]/)[0];
    if (!pathname.startsWith(BASE)) return `root-relative URL outside ${BASE}`;
    return checkBlogPath(pathname);
  }

  return `document-relative URL; use a ${BASE}-prefixed path`;
}

const problems = [];
let scanned = 0;
const files = walk(DIST).filter((f) => ['.html', '.xml', '.css'].includes(extname(f)));
for (const file of files) {
  const text = readFileSync(file, 'utf8');
  const ext = extname(file);
  const urls = ext === '.html' ? urlsFromHtml(text) : ext === '.xml' ? urlsFromXml(text) : urlsFromCss(text);
  for (const url of urls) {
    scanned++;
    const reason = check(url);
    if (reason) problems.push({ file: relative(DIST, file), url, reason });
  }
}

if (problems.length) {
  for (const p of problems) console.error(`✗ dist/${p.file} → ${p.url || '(empty)'} → ${p.reason}`);
  console.error(`\n${problems.length} problem(s) in ${files.length} files (${scanned} URLs scanned).`);
  process.exit(1);
}
console.log(`✓ ${scanned} URLs in ${files.length} files: all internal links respect ${BASE} (${SITE_ORIGIN}${BASE}).`);
