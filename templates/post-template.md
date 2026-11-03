---
# HOW TO USE THIS TEMPLATE
# 1. Create src/content/posts/<your-post-slug>/index.md (see CONTRIBUTING.md).
# 2. Copy this whole file into it and replace the example values.
# 3. Lines starting with # are comments. They are ignored and can stay.

# Required. The post headline, shown on the page and in search results.
title: Your post title

# Required. One or two sentences summarizing the post (about 150 characters).
# Used in post lists, search results, and link previews.
description: A short summary of what this post is about.

pubDate: 2026-11-02 # Required. Publication date in YYYY-MM-DD format.

# Required. The name shown as the post's author.
author: Your Name

# Optional. Topics for this post. Each tag gets its own page.
# Capitalization doesn't matter: "AI" and "ai" are the same tag.
# Use letters or numbers. For no tags, delete the list and write: tags: []
tags:
  - Product Updates
  - AI

# Optional fields. To use one, delete the "# " at the start of its line.
#
# The date you last made a significant change, in YYYY-MM-DD format.
# updatedDate: 2026-11-15
#
# The large image at the top of the post, also used for link previews.
# Put the image file in the same folder as this index.md and keep the "./".
# Use at least 1200x630 pixels and 1 MB or smaller.
# heroImage: ./hero.jpg
#
# Required if you use heroImage: describe the image for people who can't see it.
# heroImageAlt: A short description of what the image shows

# false = the post is published when its pull request is merged.
# true  = the post stays hidden, even after merging.
draft: false
---

Write your opening paragraph here. Keep it short and tell readers what they will learn.

## A section heading

Use `##` for sections and `###` for subsections. Don't add a `#` heading: the title above is shown automatically.

Write **bold** text, _italic_ text, and [links to other sites](https://example.com/).

- A bulleted list item
- Another item

1. A numbered step
2. Another step

> A quote or callout.
