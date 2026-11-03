/** Turns a tag label into a URL slug: `Product Updates` → `product-updates`, `AI` → `ai`. */
export function slugifyTag(tag: string): string {
  return tag
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
