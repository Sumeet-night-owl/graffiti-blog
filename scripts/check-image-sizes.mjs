// Fails if any image in src/content/posts is larger than 1 MB (1,000,000 bytes,
// the "MB" shown by macOS Finder and most image tools).
// Run with `npm run check:images`.

import { existsSync, readdirSync, statSync } from 'node:fs';
import { extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const POSTS_DIR = 'src/content/posts';
const ROOT = fileURLToPath(new URL(`../${POSTS_DIR}/`, import.meta.url));
const MAX_BYTES = 1_000_000;
const IMAGE_EXTENSIONS = new Set([
  '.png', '.jpg', '.jpeg', '.gif', '.webp', '.avif', '.svg', '.tif', '.tiff',
]);

if (!existsSync(ROOT)) {
  console.error(`✗ ${POSTS_DIR}/ does not exist.`);
  process.exit(1);
}

function walk(dir, prefix = '') {
  return readdirSync(dir).flatMap((name) => {
    const rel = prefix ? `${prefix}/${name}` : name;
    return statSync(join(dir, name)).isDirectory() ? walk(join(dir, name), rel) : [rel];
  });
}

const formatMB = (bytes) => `${(bytes / 1_000_000).toFixed(2)} MB`;

const images = walk(ROOT).filter((rel) => IMAGE_EXTENSIONS.has(extname(rel).toLowerCase()));
const oversized = images
  .map((rel) => ({ rel, bytes: statSync(join(ROOT, rel)).size }))
  .filter(({ bytes }) => bytes > MAX_BYTES);

if (oversized.length > 0) {
  console.error(`✗ ${oversized.length} image(s) are larger than the 1 MB limit:\n`);
  for (const { rel, bytes } of oversized) {
    console.error(`  ${POSTS_DIR}/${rel} is ${formatMB(bytes)} (limit 1.00 MB)`);
  }
  console.error(
    '\nShrink each image to 1 MB or less and commit it again. Export as JPG or WebP,' +
      '\nresize to about 1600-2400 px wide, or use a tool such as https://squoosh.app/.',
  );
  process.exit(1);
}

console.log(`✓ ${images.length} image(s) checked, all 1 MB or smaller.`);
