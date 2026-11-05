# Writing for the Graffiti blog

This guide explains how to write and submit a blog post. You don't need to install anything. Everything happens in your web browser, on GitHub.

Posts are published at **https://mygraffiti.ai/blog/**.

## How publishing works

1. You create a **branch**, which is your own working copy of the blog.
2. You add your post and its images on that branch.
3. You open a **pull request** (PR), which asks for your post to be added to the blog.
4. Automatic **checks** run on your PR. They catch mistakes such as a wrong date or a missing image.
5. Someone reviews the PR and **merges** it. Merging publishes the post.

> **Never commit directly to `main`.** The `main` branch is the published blog. Every post goes through a branch and a pull request, so the checks run and someone reviews it first.

A post is published when its PR is merged, as long as it has `draft: false`. If it has `draft: true`, it stays hidden even after merging. Use `draft: true` only when you want to merge a post now and publish it later.

> **Drafts are not private.** This repository is public. Anyone can read every file on GitHub, including drafts, their images, and posts in open pull requests. `draft: true` only keeps a post off the website. Don't commit anything confidential or unannounced.

---

## Step 1: Open the editor

1. Go to https://github.com/Sumeet-night-owl/graffiti-blog.
2. Press the **`.`** (period) key on your keyboard. This opens **github.dev**, a code editor that runs in your browser.

   If that doesn't work, change `github.com` in the address bar to `github.dev` and press Enter.

## Step 2: Create a branch

Do this **before** you change anything.

1. Look at the bottom-left corner of the editor. You'll see the current branch name, `main`. Click it.
2. Choose **Create new branch…**.
3. Type a name like `post/my-first-post` and press Enter.

The bottom-left corner should now show your new branch name.

## Step 3: Create the post folder and file

Each post is a **folder** containing a file named **`index.md`**:

```
src/content/posts/<slug>/index.md
```

The folder name is the **slug**. It becomes the post's web address. For example, the folder `my-first-post` becomes `https://mygraffiti.ai/blog/my-first-post/`.

To create it:

1. In the **Explorer** panel on the left, open `src`, then `content`, and right-click the `posts` folder.
2. Choose **New File…**.
3. Type `my-first-post/index.md`, using your own slug, and press Enter. This creates the folder and the file at the same time.

### Folder name rules

The folder name must be **lowercase kebab-case**: lowercase letters a-z and digits 0-9, with single hyphens between words.

| ✅ Good                    | ❌ Bad                     | Why it's bad                         |
| ------------------------- | ------------------------- | ------------------------------------ |
| `my-first-post`           | `My-First-Post`           | Capital letters                      |
| `launch-2026`             | `my_first_post`           | Underscores                          |
| `ai-for-teams`            | `my first post`           | Spaces                               |
|                           | `my--post`, `-my-post`    | Double hyphens, or a hyphen at an end |
|                           | `tags`, `rss.xml`, `404`  | Reserved names the blog already uses |

The file inside must be named exactly **`index.md`**. These are all wrong:

- `post.md` or `draft.md`
- `Index.md` or `index.markdown`
- `my-first-post.md` placed directly in `posts/`

Each folder holds exactly one Markdown file.

> Choose the slug carefully. Changing it after publishing changes the post's web address and breaks any links people have shared.

## Step 4: Fill in the post from the template

1. In Explorer, open **`templates/post-template.md`**.
2. Select all (Ctrl+A on Windows, Cmd+A on Mac), copy it, and paste it into your new `index.md`.
3. Replace the example values with your own.

The block between the two `---` lines at the top is the **frontmatter**: details about the post. Lines that start with `#` are comments. They're ignored, so you can leave them in.

| Field          | Required? | What to write                                                      | Example                                  |
| -------------- | --------- | ------------------------------------------------------------------ | ---------------------------------------- |
| `title`        | Yes       | The headline                                                       | `title: How we built Graffiti`           |
| `description`  | Yes       | One or two sentences summarizing the post                          | `description: A look behind the scenes.` |
| `pubDate`      | Yes       | Publication date, **YYYY-MM-DD**                                   | `pubDate: 2026-11-02`                    |
| `author`       | Yes       | Author name                                                        | `author: Sam Lee`                        |
| `tags`         | No        | A list of topics. Each needs at least one letter or number.        | see below                                |
| `updatedDate`  | No        | Date of the last significant change, **YYYY-MM-DD**                | `updatedDate: 2026-11-15`                |
| `heroImage`    | No        | The image at the top of the post. Must start with `./`.            | `heroImage: ./hero.jpg`                  |
| `heroImageAlt` | If `heroImage` is set | A description of the hero image                 | `heroImageAlt: Two people at a laptop`   |
| `draft`        | No        | `false` publishes on merge. `true` keeps the post hidden.          | `draft: false`                           |

**Dates** must be written as **YYYY-MM-DD**: a four-digit year, two-digit month, and two-digit day. For example, `2026-11-02` is November 2, 2026. These formats don't work: `11/02/2026`, `Nov 2, 2026`, and `2026-2-5`. The date must also exist, so `2026-02-30` is rejected.

**Tags** are written as a list, one per line, each starting with `- `:

```yaml
tags:
  - Product Updates
  - AI
```

Capitalization doesn't matter: `AI` and `ai` are the same tag. If you don't want any tags, write `tags: []`.

**Optional fields** (`updatedDate`, `heroImage`, `heroImageAlt`) are commented out in the template. To use one, delete the `# ` at the start of its line. For example:

```yaml
# heroImage: ./hero.jpg        ← commented out (ignored)
heroImage: ./hero.jpg          ← active
```

If you turn on `heroImage`, you must also turn on `heroImageAlt` and describe the image. The image file must already exist in your post folder, or the checks will fail.

### Writing the post

Write the body of the post below the second `---`, using Markdown:

| You type                          | You get                       |
| --------------------------------- | ----------------------------- |
| `## Section title`                | A section heading             |
| `### Subsection`                  | A smaller heading             |
| `**bold**` / `_italic_`           | **bold** / _italic_           |
| `- item`                          | A bulleted list               |
| `1. step`                         | A numbered list               |
| `> quote`                         | A quote block                 |
| `[text](https://example.com/)`    | A link                        |
| `![description](./photo.jpg)`     | An image                      |

Don't add a `#` (level 1) heading. The `title` is shown automatically as the page headline.

**Links:**

| Linking to                          | Write it like this                                |
| ----------------------------------- | ------------------------------------------------- |
| Another blog post                   | `[Read our launch post](/blog/launch-post/)`      |
| A page on the main Graffiti site    | `[Pricing](https://mygraffiti.ai/pricing)`        |
| Any other website                   | `[Astro](https://astro.build/)`                   |

Links to other blog posts start with `/blog/` and end with `/`. Don't use links like `../other-post/`.

## Step 5: Add images

1. Prepare your images on your computer:
   - Each image must be **1 MB or smaller**. Larger files fail the checks.
   - The **hero image** should be at least **1200 × 630 pixels**, in landscape orientation. Link previews on social media crop it to 1200 × 630, so keep the important part in the middle. Smaller images work but look blurry in previews.
   - Use lowercase file names without spaces, such as `team-photo.jpg` rather than `Team Photo.JPG`.
   - JPG suits photos. PNG suits screenshots and graphics.
2. Drag the image files from your computer onto **your post's folder** in the Explorer panel. They must be in the same folder as `index.md`.
3. Refer to them with `./` and the file name:
   - In the body: `![A short description of the image](./team-photo.jpg)`
   - As the hero, in the frontmatter: `heroImage: ./team-photo.jpg` and `heroImageAlt: …`

Every image needs a description, called **alt text**. Write it inside the `[ ]` for body images, or in `heroImageAlt` for the hero. People using screen readers hear this text.

> If dragging files doesn't work, upload them on GitHub instead. Go to https://github.com/Sumeet-night-owl/graffiti-blog, switch to **your branch** using the branch dropdown, open your post folder, and choose **Add file → Upload files**.

To shrink an image that's too large, export it as JPG at around 80% quality, resize it to about 1600–2400 pixels wide, or use https://squoosh.app/.

## Step 6: Check formatting and images in the preview

1. With your `index.md` open, click the **Open Preview to the Side** icon in the top-right corner of the editor. It looks like a page with a magnifying glass. You can also press Ctrl+K and then V on Windows, or Cmd+K and then V on Mac.
2. Check that headings, lists, links, and images in the body look right. If an image doesn't appear in the preview, its file name or `./` path is probably wrong.

> **The preview is not the final website.** It shows your text formatting and body images. It does **not** show the blog's design, fonts, layout, the hero image, the date, or the tags. It also doesn't check your frontmatter. The checks in Step 9 do that.

## Step 7: Commit and push your changes

1. Click the **Source Control** icon in the left sidebar. It looks like a branching line, and a number shows how many files you changed.
2. Make sure the bottom-left corner shows **your branch**, not `main`.
3. Type a short message, like `Add post: How we built Graffiti`.
4. Click **Commit & Push**. If the editor asks whether to stage all changes, choose **Yes**.

You can commit more than once. Each **Commit & Push** adds to the same branch.

## Step 8: Open a pull request

Either:

- In **Source Control**, click the **pull request icon** at the top of the panel. Set the base branch to **`main`**, add a title, and click **Create**.

Or:

- Go to https://github.com/Sumeet-night-owl/graffiti-blog. Click the yellow **Compare & pull request** banner for your branch, or go to **Pull requests → New pull request** and pick your branch.

The pull request description contains a **publishing checklist**. Go through it and tick each box.

## Step 9: Wait for the checks

At the bottom of the pull request, a check called **Validate blog** runs automatically. It takes a few minutes.

- ✅ **Green check:** everything passed, and the post is ready for review.
- ❌ **Red X:** something needs fixing. See below.

## Reading a failed check

1. On the pull request, scroll to the checks section and click **Details** next to **Validate blog**.
2. The steps are listed in order. The failed one has a red ❌. Click it to expand it.
3. Read the lines that start with ✗, or the lines containing `Error`. They name the file and explain the problem.
4. Fix the problem in github.dev, on **the same branch**, and **Commit & Push** again. The checks rerun automatically.

The checks run in this order and stop at the first failure:

| Step                                   | What it checks                                                        |
| -------------------------------------- | --------------------------------------------------------------------- |
| **Check post file locations**          | Every post is `src/content/posts/<slug>/index.md` with a valid folder name |
| **Check image sizes**                  | Every image in a post folder is 1 MB or smaller                       |
| **Type check (npm run check)**         | Frontmatter fields: required fields, dates, tags, hero image alt text |
| **Build site (npm run build)**         | The site builds, and every image path points to a real file           |
| **Check links (npm run check:links)**  | Links between blog pages point to pages that exist                    |

Fixing one problem can reveal the next one. If the check fails again, read the new message.

## Common errors and how to fix them

| Failed step | Error message (shortened) | What it means | How to fix it |
| --- | --- | --- | --- |
| Check post file locations | `Found: src/content/posts/my-post.md` / `Expected: src/content/posts/my-post/index.md` | The post isn't in its own folder | Create the folder `my-post` and move the text into `my-post/index.md` |
| Check post file locations | `Why: Each post folder holds exactly one Markdown file, named index.md.` | The file is named something other than `index.md`, like `draft.md` | Rename it to `index.md`, all lowercase |
| Check post file locations | `Why: This post folder has no index.md, so it would not be published.` | The folder has images but no `index.md`, or the file name has different capitals, like `Index.md` | Add or rename the file to exactly `index.md` |
| Check post file locations | `Why: Folder names must be lowercase kebab-case` | The folder name has capitals, spaces, or underscores | Rename the folder to the `Expected:` name shown |
| Check post file locations | `Why: Files must be inside a post folder` | An image was put directly in `posts/` | Move it into your post's folder |
| Check image sizes | `src/content/posts/my-post/photo.png is 2.40 MB (limit 1.00 MB)` | The image is too large | Shrink it to 1 MB or less (see Step 5), then replace the file |
| Type check | `pubDate: pubDate must be a real date in YYYY-MM-DD format (got "11/02/2026")` | The date is in the wrong format, or doesn't exist (like `2026-02-30`) | Write it as `pubDate: 2026-11-02` |
| Type check | `pubDate "2026-02-30" is not a real calendar date. Use YYYY-MM-DD.` | The date doesn't exist | Fix the day or month |
| Type check | `pubDate: pubDate is required and must be a date in YYYY-MM-DD format.` | `pubDate` is missing or empty | Add `pubDate: 2026-11-02` with your date |
| Type check | `description: Required` (or `title`, `author`) | A required field is missing | Add the field to the frontmatter |
| Type check | `heroImageAlt: heroImageAlt is required when heroImage is set.` | There's a hero image without a description | Uncomment `heroImageAlt` and describe the image |
| Type check | `Tag "!!!" has no letters or numbers` | A tag has only symbols | Use a tag with letters or numbers, or remove it |
| Type check | `Post folder "…/tags/" uses a reserved name.` | The folder name is already used by the blog | Choose a different folder name |
| Type check | `Implicit map keys need to be followed by map values at line 6` (or another YAML message with a line number) | The frontmatter is malformed. This is usually a missing space after `:`, or broken indentation. | Look at the line shown and compare it with `templates/post-template.md`. Write `title: My title`, not `title:My title`, and indent tags with two spaces |
| Build site | `[ImageNotFound] Could not find requested image ./photo.jpg. Does it exist?` | An image path is wrong, or the image isn't in the post folder | Check the spelling and capitals of the file name, make sure the path starts with `./`, and make sure the file is in the same folder as `index.md` |
| Check links | `dist/my-post/index.html → /blog/old-post/ → target does not exist in dist/` | A link points to a blog page that doesn't exist | Fix the slug in the link, e.g. `/blog/real-post-slug/` |
| Check links | `… → document-relative URL; use a /blog/-prefixed path` | A link like `../other-post/` was used | Use the full path, e.g. `/blog/other-post/` |
| Check links | `… → page URL is missing its trailing slash` | A blog link doesn't end with `/` | Add `/` at the end, e.g. `/blog/other-post/` |

If you're stuck, leave a comment on your pull request and ask for help.

## Editing a published post

Follow the same steps: create a branch, edit `src/content/posts/<slug>/index.md`, commit, and open a PR. If the change is significant, add or update `updatedDate`. Don't rename the folder, because that changes the post's web address.

---

## For developers

Run the same checks locally (Node version from `.nvmrc`):

```sh
npm ci
npm run check:posts    # post file locations
npm run check:images   # image sizes (1 MB = 1,000,000 bytes)
npm run check          # astro check, including frontmatter validation
npm run build
npm run check:links    # run after build
```

`npm run check:content` runs `check:posts` and `check:images` together. `npm run dev` serves the site at http://localhost:4321/blog/ and shows drafts.

The pull request workflow is `.github/workflows/pr-checks.yml`. Its job, **Validate blog**, should be a required status check on `main`.
