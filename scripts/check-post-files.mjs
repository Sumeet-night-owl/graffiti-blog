// Checks that every post lives at src/content/posts/<slug>/index.md.
// Run with `npm run check:posts`.
//
// The content loader only picks up `*/index.md`, so a misplaced file would be
// silently skipped instead of published. This check fails loudly instead:
//   - any Markdown file (.md, .mdx, .markdown, any letter case) that is not
//     exactly src/content/posts/<slug>/index.md
//   - any folder directly under src/content/posts without an index.md
//   - any other file sitting directly in src/content/posts, outside a post folder

import { existsSync, readdirSync, statSync } from 'node:fs';
import { extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const POSTS_DIR = 'src/content/posts';
const ROOT = fileURLToPath(new URL(`../${POSTS_DIR}/`, import.meta.url));
const MARKDOWN_EXTENSIONS = new Set(['.md', '.mdx', '.markdown']);
// Keep in sync with POST_SLUG_PATTERN in src/consts.ts.
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

if (!existsSync(ROOT)) {
  console.error(`✗ ${POSTS_DIR}/ does not exist.`);
  process.exit(1);
}

/** Lists files under `dir` as paths relative to ROOT, skipping hidden files like .DS_Store. */
function walk(dir, prefix = '') {
  return readdirSync(dir)
    .filter((name) => !name.startsWith('.'))
    .flatMap((name) => {
      const rel = prefix ? `${prefix}/${name}` : name;
      return statSync(join(dir, name)).isDirectory() ? walk(join(dir, name), rel) : [rel];
    });
}

/** Best guess at the slug the writer meant: `My Post_2.md` → `my-post-2`. */
function suggestSlug(name) {
  return (
    name
      .replace(/\.[^.]+$/, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'my-post'
  );
}

const problems = [];
const report = (found, expected, reason) => problems.push({ found, expected, reason });

for (const rel of walk(ROOT)) {
  const parts = rel.split('/');
  const found = `${POSTS_DIR}/${rel}`;
  const isMarkdown = MARKDOWN_EXTENSIONS.has(extname(rel).toLowerCase());

  if (parts.length === 1) {
    const slug = suggestSlug(parts[0]);
    report(
      found,
      isMarkdown ? `${POSTS_DIR}/${slug}/index.md` : `${POSTS_DIR}/<slug>/${parts[0]}`,
      isMarkdown
        ? 'Posts must be in their own folder, in a file named index.md.'
        : 'Files must be inside a post folder, next to that post’s index.md.',
    );
    continue;
  }

  if (!isMarkdown) continue;

  const [folder] = parts;
  const slug = SLUG_PATTERN.test(folder) ? folder : suggestSlug(folder);
  const expected = `${POSTS_DIR}/${slug}/index.md`;
  if (parts.length > 2) {
    report(found, expected, 'Posts cannot be in nested folders.');
  } else if (parts[1] !== 'index.md') {
    report(
      found,
      expected,
      parts[1].toLowerCase() === 'index.md' || parts[1].toLowerCase().startsWith('index.')
        ? 'The post file must be named exactly index.md (lowercase, .md extension).'
        : 'Each post folder holds exactly one Markdown file, named index.md.',
    );
  } else if (!SLUG_PATTERN.test(folder)) {
    report(
      found,
      expected,
      'Folder names must be lowercase kebab-case: letters a-z, digits, and single hyphens.',
    );
  }
}

for (const name of readdirSync(ROOT)) {
  if (name.startsWith('.') || !statSync(join(ROOT, name)).isDirectory()) continue;
  // Compare names exactly: existsSync is case-insensitive on macOS, so `Index.md` would pass it.
  if (!readdirSync(join(ROOT, name)).includes('index.md')) {
    const slug = SLUG_PATTERN.test(name) ? name : suggestSlug(name);
    report(
      `${POSTS_DIR}/${name}/`,
      `${POSTS_DIR}/${slug}/index.md`,
      'This post folder has no index.md, so it would not be published.',
    );
  }
}

if (problems.length > 0) {
  console.error(`✗ Found ${problems.length} problem(s) with post files:\n`);
  for (const { found, expected, reason } of problems) {
    console.error(`  Found:    ${found}`);
    console.error(`  Expected: ${expected}`);
    console.error(`  Why:      ${reason}\n`);
  }
  console.error(`Every post must be ${POSTS_DIR}/<slug>/index.md. See CONTRIBUTING.md.`);
  process.exit(1);
}

const count = readdirSync(ROOT).filter((n) => !n.startsWith('.')).length;
console.log(`✓ ${count} post folder(s), all at ${POSTS_DIR}/<slug>/index.md.`);
