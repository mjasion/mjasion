# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal website/blog built with Hugo using the [Toha theme](https://github.com/hugo-toha/toha) (v4, imported via Hugo modules). Includes blog posts, notes, and a professional portfolio. Site: [mjasion.pl](https://mjasion.pl)

## Commands

```bash
# Build (recommended — used by CI)
./build.sh

# Dev server (includes drafts and future-dated posts)
hugo server --buildDrafts --buildFuture

# Lint (pre-commit hooks: check-json, check-toml, check-yaml, end-of-file-fixer, trailing-whitespace)
pre-commit run --all-files

# Package management — uses pnpm, NOT npm
pnpm install
```

`build.sh` runs: `hugo mod tidy` → `hugo mod npm pack` → `pnpm install` → `hugo --gc --minify --cleanDestinationDir` → copies `static/_redirects` to output. When `CF_PAGES_URL` is set, it passes `-b $CF_PAGES_URL` to Hugo.

## Architecture

- **Hugo modules** pull in the Toha theme (`go.mod`); `hugo mod npm pack` generates `package.json` from the theme's requirements
- **Content**: blog posts in `content/posts/<category>/` (each post is a directory with `index.md` + assets); notes in `content/notes/`
- **Site data**: `config.yml` (main config), `data/author.yaml`, `data/site.yaml`, section definitions in `data/en/sections/` (numbered YAML files control homepage sections)
- **Custom layouts** override the theme: `layouts/partials/sections/presentations.html`, `layouts/shortcodes/video.html`, `layouts/rss.xml`, `layouts/robots.txt`

## Blog Post Front Matter

Posts use this front matter structure:
```yaml
title: "Post Title"
date: "YYYY-MM-DD"
description: |
  Multi-line description
hero: hero-image-filename.svg
author:
  name: Marcin Jasion
menu:
  sidebar:
    name: Display Name
    identifier: unique-id
    parent: category-name
```

## Deployment

- **Cloudflare Pages**: primary deployment target; daily scheduled deploy via GitHub Actions (`.github/workflows/cloudflare-deploy.yml`)
