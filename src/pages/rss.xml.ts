import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { SITE_DESCRIPTION, SITE_TITLE } from '../consts';
import { getPublishedPosts } from '../lib/posts';
import { postPath, withBase } from '../lib/urls';

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export const GET: APIRoute = async (context) => {
  const posts = await getPublishedPosts();
  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    // @astrojs/rss does not apply `base`: resolve the channel link to /blog/ and
    // give items base-prefixed paths.
    site: new URL(withBase(), context.site).href,
    xmlns: { dc: 'http://purl.org/dc/elements/1.1/' },
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: postPath(post.id),
      categories: post.data.tags.map((tag) => tag.label),
      customData: `<dc:creator>${escapeXml(post.data.author)}</dc:creator>`,
    })),
  });
};
