import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'posts'>;

export interface TagSummary {
  slug: string;
  label: string;
  posts: Post[];
}

/**
 * Posts that should be published, newest first. Drafts are visible in `astro dev`
 * and excluded from production builds (pages, tag pages, RSS, and so the sitemap).
 */
export async function getPublishedPosts(): Promise<Post[]> {
  const posts = await getCollection('posts', ({ data }) => import.meta.env.DEV || !data.draft);
  return posts.sort(
    (a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime() || a.id.localeCompare(b.id),
  );
}

/**
 * Tags grouped by slug, so `AI` and `ai` share one page. The label shown is the
 * first one seen in the newest-first post list. Sorted by label.
 */
export function getTags(posts: Post[]): TagSummary[] {
  const bySlug = new Map<string, TagSummary>();
  for (const post of posts) {
    for (const { slug, label } of post.data.tags) {
      const summary = bySlug.get(slug) ?? { slug, label, posts: [] };
      summary.posts.push(post);
      bySlug.set(slug, summary);
    }
  }
  return [...bySlug.values()].sort((a, b) =>
    a.label.localeCompare(b.label, 'en', { sensitivity: 'base' }),
  );
}
