# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal website/blog built with Hugo using the Toha theme. The site showcases the owner's professional experience as a Platform Engineer with expertise in Kubernetes, AWS, DevOps, CI/CD, GitOps and Security. The site includes blog posts, notes, and a professional portfolio.

## Architecture

- **Static Site Generator**: Hugo with Toha theme (v4.9.0)
- **Content Management**:
  - Blog posts in `content/posts/` organized by category (cloud, golang, kubernetes, etc.)
  - Notes in `content/notes/` for shorter technical documentation
  - Site data in YAML files under `data/` directory
- **Theme**: Uses Hugo modules to import the Toha theme from GitHub
- **Assets**: Node.js dependencies managed via pnpm for theme assets and tooling
- **Deployment**: Configured for Netlify with custom build commands

## Common Development Commands

### Building the site
```bash
# Full build process (recommended)
./build.sh

# Manual build steps
hugo mod tidy              # Clean up module dependencies
hugo mod npm pack          # Generate package.json from Hugo modules
pnpm install              # Install Node.js dependencies
hugo --gc --minify --cleanDestinationDir  # Build site
```

### Development server
```bash
hugo server --buildDrafts --buildFuture
```

### Linting
```bash
# The project uses pre-commit hooks
pre-commit run --all-files
```

### Package management
```bash
# This project uses pnpm (not npm)
pnpm install
pnpm update
```

## Content Structure

### Blog Posts
- Located in `content/posts/`
- Organized by categories: `cloud/`, `golang/`, `kubernetes/`
- Each post is in its own directory with an `index.md` file
- Images and assets are stored alongside the post content

### Notes
- Located in `content/notes/`
- Shorter technical documentation and quick references
- Categories include `gmail/`, `k8s/`

### Site Configuration
- Main config: `config.yml` - Contains Hugo and theme configuration
- Author data: `data/author.yaml`
- Sections: `data/en/sections/` - Contains YAML files defining site sections
- Site metadata: `data/site.yaml`

## Key Files

- `build.sh` - Main build script used by CI/CD
- `go.mod` - Hugo module dependencies
- `package.json` - Node.js dependencies for theme assets
- `netlify.toml` - Netlify deployment configuration
- `config.yml` - Main Hugo configuration

## Hugo Theme Customization

The site uses custom layouts and partials:
- Custom presentations layout: `layouts/partials/sections/presentations.html`
- Custom video shortcode: `layouts/shortcodes/video.html`
- Custom RSS and robots.txt templates

## Deployment

- **Production**: Netlify with Hugo version 0.111.1
- **Preview**: Deploy previews enabled for pull requests
- **Build command**: Uses `./build.sh` for preview/branch deploys, direct Hugo build for production
