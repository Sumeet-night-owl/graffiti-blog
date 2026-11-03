// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Static output only: no adapter, no on-demand rendering.
export default defineConfig({
  site: 'https://mygraffiti.ai',
  base: '/blog',
  trailingSlash: 'always',
  integrations: [sitemap()],
  build: {
    // One cacheable stylesheet under /blog/_astro/ instead of inlining it per page.
    inlineStylesheets: 'never',
  },
});
