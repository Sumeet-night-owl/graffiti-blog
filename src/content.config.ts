import { readFileSync } from 'node:fs';
import { defineCollection } from 'astro:content';
import { glob, type Loader } from 'astro/loaders';
import { z } from 'astro/zod';
import { POST_SLUG_PATTERN, RESERVED_SLUGS } from './consts';
import { parseCalendarDate } from './lib/dates';
import { slugifyTag } from './lib/slugify';

const POSTS_DIR = 'src/content/posts';
const DATE_FIELDS = ['pubDate', 'updatedDate'] as const;

/**
 * The post slug is its folder name, used as-is (never slugified or rewritten).
 * Runs for every post, drafts included, so a bad folder always fails the build.
 */
function postIdFromEntry(entry: string, base: URL): string {
  const [folder, file, ...rest] = entry.split('/');
  if (file !== 'index.md' || rest.length > 0) {
    throw new Error(
      `Unexpected post file "${POSTS_DIR}/${entry}". Each post must be ${POSTS_DIR}/<slug>/index.md.`,
    );
  }
  if (RESERVED_SLUGS.has(folder)) {
    throw new Error(
      `Post folder "${POSTS_DIR}/${folder}/" uses a reserved name. "${folder}" clashes with a page the blog generates; choose another folder name.`,
    );
  }
  if (!POST_SLUG_PATTERN.test(folder)) {
    throw new Error(
      `Post folder "${POSTS_DIR}/${folder}/" is not a valid slug. Folder names must be lowercase kebab-case: letters a-z, digits, and single hyphens (e.g. "my-first-post").`,
    );
  }
  checkRawDates(entry, base);
  return folder;
}

/**
 * The YAML parser turns an unquoted impossible date like `2026-02-30` into a
 * rolled-over Date (March 2) before the schema sees it, so check the raw text.
 */
function checkRawDates(entry: string, base: URL) {
  const source = readFileSync(new URL(entry, base), 'utf8');
  const frontmatter = /^﻿?---\r?\n([\s\S]*?)\r?\n---/.exec(source)?.[1] ?? '';
  for (const field of DATE_FIELDS) {
    const line = new RegExp(`^${field}:[ \\t]*(.*)$`, 'm').exec(frontmatter);
    if (!line) continue;
    const value = line[1].replace(/\s+#.*$/, '').trim().replace(/^(['"])(.*)\1$/, '$2');
    const datePart = /^\d{4}-\d{2}-\d{2}/.exec(value)?.[0];
    if (datePart && !parseCalendarDate(datePart)) {
      throw new Error(
        `${POSTS_DIR}/${entry}: ${field} "${datePart}" is not a real calendar date. Use YYYY-MM-DD.`,
      );
    }
  }
}

/**
 * A calendar date (`YYYY-MM-DD`), stored as UTC midnight. Rejects null and blank
 * values explicitly: z.coerce.date() would turn null into 1970-01-01.
 */
function calendarDate(field: string) {
  return z.unknown().transform((value, ctx) => {
    let date: Date | undefined;
    if (value instanceof Date && !Number.isNaN(value.getTime())) {
      date = new Date(
        Date.UTC(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate()),
      );
    } else if (typeof value === 'string') {
      date = parseCalendarDate(value);
    }
    if (!date) {
      ctx.addIssue({
        code: 'custom',
        message:
          value === null || value === undefined || value === ''
            ? `${field} is required and must be a date in YYYY-MM-DD format.`
            : `${field} must be a real date in YYYY-MM-DD format (got ${JSON.stringify(value)}).`,
      });
      return z.NEVER;
    }
    return date;
  });
}

const tags = z
  .array(z.string().trim().min(1, 'Tags cannot be blank.'))
  .default([])
  .superRefine((labels, ctx) => {
    labels.forEach((label, index) => {
      if (!slugifyTag(label)) {
        ctx.addIssue({
          code: 'custom',
          path: [index],
          message: `Tag "${label}" has no letters or numbers, so it cannot have a tag page. Use a tag with letters or digits.`,
        });
      }
    });
  })
  // One entry per slug, keeping the first label, so `AI` and `ai` on the
  // same post produce one tag link, one RSS category, and one count.
  .transform((labels) => {
    const bySlug = new Map<string, { label: string; slug: string }>();
    for (const label of labels) {
      const slug = slugifyTag(label);
      if (!bySlug.has(slug)) bySlug.set(slug, { label, slug });
    }
    return [...bySlug.values()];
  });

const postsGlob = glob({
  pattern: '*/index.md',
  base: `./${POSTS_DIR}`,
  generateId: ({ entry, base }) => postIdFromEntry(entry, base),
});

/**
 * Every post (drafts included) is loaded and validated first, so a broken draft
 * still fails the build. In production, drafts are then dropped from the store so
 * their images are never emitted to dist/.
 */
const postsLoader: Loader = {
  name: 'posts-loader',
  load: async (context) => {
    await postsGlob.load(context);
    if (!import.meta.env.PROD) return;
    for (const [id, entry] of context.store.entries()) {
      if (entry.data.draft === true) context.store.delete(id);
    }
  },
};

const posts = defineCollection({
  loader: postsLoader,
  schema: ({ image }) =>
    z
      .object({
        title: z.string().trim().min(1, 'title is required.'),
        description: z.string().trim().min(1, 'description is required.'),
        pubDate: calendarDate('pubDate'),
        updatedDate: calendarDate('updatedDate').optional(),
        author: z.string().trim().min(1, 'author is required.'),
        tags,
        heroImage: image().optional(),
        heroImageAlt: z.string().trim().min(1, 'heroImageAlt cannot be blank.').optional(),
        draft: z.boolean().default(false),
      })
      .superRefine((data, ctx) => {
        if (data.heroImage && !data.heroImageAlt) {
          ctx.addIssue({
            code: 'custom',
            path: ['heroImageAlt'],
            message: 'heroImageAlt is required when heroImage is set. Describe the image for screen readers.',
          });
        }
      }),
});

export const collections = { posts };
