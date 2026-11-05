# Agent instructions: Graffiti blog

You are an AI coding agent working in this repository for a writer on the Graffiti team. **The writer only gives you blog content.** You do everything else: create the post, add images, run the checks, commit, push, and open the pull request.

The writer is semi-technical. Explain what you're doing in plain language, ask only for what you really need, and don't make them open files themselves.

The blog is an Astro static site served at **https://mygraffiti.ai/blog/**. Merging a pull request into `main` deploys it automatically.

**For the writer:** these instructions work with any AI coding agent that can read files and run terminal commands in this repository, such as Claude Code, Codex, Cursor or GitHub Copilot. Open the agent in the `graffiti-blog` folder and start with:

> Read AGENT_INSTRUCTIONS.md and follow it. Here is my blog post: …

Then paste your text, and list or attach any images. The agent asks if it needs anything else.

## Reference files

Read these yourself when needed. Never ask the writer to read them.

| File | When to use it |
| --- | --- |
| `templates/post-template.md` | Every new post. Copy it; it lists every frontmatter field. |
| `CONTRIBUTING.md` | The full publishing rules, and the **Common errors and how to fix them** table for when a check fails. |
| `teammate_instructions.md` | **Only** if the writer asks for brand or design work (colors, fonts, logo, favicon, social image, code theme). Follow its prompts, including the rule to propose a plan and get approval first. Never mix design changes into a post's pull request. |

## Hard rules

1. **Only touch the post's own folder**, `src/content/posts/<slug>/`, unless the writer explicitly asks for design work (see above). Don't edit config, layouts, styles, scripts, workflows, `package.json` or other posts.
2. **Never commit to `main`, and never force-push.** Every post gets its own branch and pull request.
3. **The repository is public.** Everything committed is visible to anyone, including drafts, images and open pull requests. Before committing, warn the writer if the content looks confidential, unannounced, or contains personal data, and wait for them to confirm.
4. **Don't invent facts.** Don't add claims, quotes, numbers, features, customer names or links that the writer didn't provide. You may fix grammar, structure and formatting. Ask before changing meaning or tone noticeably.
5. **Never commit secrets** (tokens, keys, passwords, `.env` files), and never commit `dist/`, `node_modules/`, `.astro/` or `deploy/`.
6. **Don't merge the pull request.** A repository owner reviews and merges it.

## Workflow

### 1. Gather the post details

From the writer's message, collect the following. Ask only for what's missing, in a single message:

| Field | Required | Default if not given |
| --- | --- | --- |
| Title | yes | Suggest one from the content and confirm it |
| Content | yes | none |
| Author name | yes | Ask. Don't guess. |
| Description (1–2 sentences, about 150 characters) | yes | Write one from the content and show it to the writer |
| Publish date | yes | Today's date, in `YYYY-MM-DD` form |
| Tags | no | Suggest 1–3 from existing tags (see below) |
| Hero image and its alt text | no | No hero image. The site's default social image is used. |
| Other images, each with alt text | no | none |
| Publish on merge? | yes | Yes (`draft: false`) |

To see the existing tags, run `grep -rh -A5 '^tags:' src/content/posts/*/index.md`. Reuse a matching tag rather than creating a near-duplicate, such as `AI` vs `Artificial Intelligence`.

### 2. Choose the slug (folder name)

- Derive it from the title: lowercase **kebab-case**, using only `a-z`, `0-9` and single hyphens, short and readable. For example, "How We Built Graffiti!" becomes `how-we-built-graffiti`.
- It must not be a reserved name: `tags`, `rss.xml`, `404`, `500`, `index`, `sitemap-index.xml`, `sitemap-0.xml`, `og-default.png`, `_astro`, `_image`.
- It must not already exist under `src/content/posts/`.
- Tell the writer the final URL: `https://mygraffiti.ai/blog/<slug>/`. A slug can't change after publishing without breaking links.

### 3. Create a branch

```sh
git checkout main && git pull --ff-only
git checkout -b post/<slug>
```

If there are uncommitted changes, stop and ask the writer before switching branches.

### 4. Write the post

1. Create `src/content/posts/<slug>/index.md` by copying `templates/post-template.md`. That path is the only valid location. Never use `<slug>.md` or a second Markdown file in the folder.
2. Fill in the frontmatter:
   - `title`, `description`, `author` and `tags` as agreed.
   - `pubDate` in **`YYYY-MM-DD`** form, and it must be a real date.
   - `draft: false` to publish when merged, or `draft: true` to merge it but keep it hidden.
   - Optional fields: uncomment `heroImage` and `heroImageAlt` (both together) and `updatedDate` only if used.
   - The template's comments may stay.
3. Convert the content to Markdown below the closing `---`:
   - Use `##` and `###` headings, never a `#` heading, because the title is shown automatically.
   - Use lists, `**bold**`, `_italic_` and `> quotes` where the content calls for them.
   - Use fenced code blocks with a language for code.
   - Remove the template's placeholder body text.
4. Links:
   - To another post: `/blog/<other-slug>/`, with the leading `/blog/` and the trailing `/`.
   - To the main site: `https://mygraffiti.ai/...`
   - External: the full `https://` URL.
   - Never use relative links like `../other-post/`.

### 5. Add images

The writer gives you image file paths, or drops the files into the repo. For each image:

1. Copy it into `src/content/posts/<slug>/`, renamed to lowercase with hyphens, for example `team-photo.jpg`.
2. Check its size and dimensions. `sharp` is installed:
   ```sh
   node -e "const s=require('sharp');const f=process.argv[1];s(f).metadata().then(m=>console.log(f,m.width+'x'+m.height,(require('fs').statSync(f).size/1e6).toFixed(2)+' MB'))" src/content/posts/<slug>/<file>
   ```
   - **Every image must be 1 MB (1,000,000 bytes) or smaller.** If one is larger, make a smaller copy with sharp (for example, resize to 2000 px wide and save as JPG at quality 80), check it again, and tell the writer.
   - **A hero image should be at least 1200×630 and landscape.** If it's smaller, warn the writer that link previews will look blurry, and ask whether to use it anyway.
3. Reference it with a relative path:
   - in the body: `![Alt text](./team-photo.jpg)`;
   - as the hero: `heroImage: ./team-photo.jpg` plus `heroImageAlt: ...`.
4. Every image needs meaningful alt text. If the writer didn't give any, draft it and show it to them.

### 6. Run the checks

These are the same checks the pull request runs. All must pass:

```sh
npm ci            # only if node_modules is missing or package-lock.json changed
npm run check:content
npm run check
npm run build
npm run check:links
```

If a check fails:
- Find the error in the **Common errors and how to fix them** table in `CONTRIBUTING.md`, fix it inside the post folder, and run the checks again.
- Never change scripts, config or the content schema to make a check pass.
- If you can't fix it, explain the error to the writer in plain words.

### 7. Let the writer preview it

- Run `npm run dev` and give the writer **http://localhost:4321/blog/<slug>/**. This preview also works for drafts.
- Ask them to confirm the post looks right before you commit. Stop the dev server afterwards.

### 8. Commit, push and open the pull request

1. Check what's being committed. Only the post folder should be listed:
   ```sh
   git status --short
   git add src/content/posts/<slug>/
   git diff --cached --stat
   ```
2. Commit and push:
   ```sh
   git commit -m "Add post: <title>"
   git push -u origin post/<slug>
   ```
   If the push is rejected with an error about a private email, set the writer's GitHub noreply address with `git config user.email "<id>+<username>@users.noreply.github.com"`, run `git commit --amend --reset-author --no-edit`, and push again.
3. Open the pull request:
   - If `gh auth status` shows the writer is logged in, use `gh pr create --base main --title "Add post: <title>"`, with a body that fills in the publishing checklist from `.github/pull_request_template.md` and ticks only the items you actually verified.
   - Otherwise, give the writer this link to click: `https://github.com/Sumeet-night-owl/graffiti-blog/pull/new/post/<slug>`.
4. Tell the writer that:
   - the **Validate blog** check runs on the pull request;
   - a repository owner reviews and merges it;
   - the post goes live at `https://mygraffiti.ai/blog/<slug>/` a few minutes after merging (unless `draft: true`).

### Changing a published post

Use the same steps on a new branch (`post/<slug>-update`): edit `src/content/posts/<slug>/index.md`, and add or update `updatedDate` for significant changes. **Never rename the folder of a published post.**

### If the Validate blog check fails on GitHub

Open the failed step's log with `gh pr checks` and `gh run view --log-failed` if `gh` is logged in. Otherwise, ask the writer to paste the red error lines. Fix the problem on the same branch, commit, and push. The checks rerun automatically.
