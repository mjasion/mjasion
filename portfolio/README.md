# Portfolio - Next.js Portfolio Website

A modern, interactive portfolio website built with Next.js, featuring 3D animations, smooth scrolling, and markdown blog support. Inspired by the LanX template design with advanced Framer Motion animations.

## ✨ Features

- **🎨 Modern Dark Design**: Sleek dark theme with gradient backgrounds and glass morphism effects
- **🎭 3D Animations**: Advanced 3D transformations with perspective, rotation, and depth effects
- **📱 Responsive Design**: Fully responsive layout that works on all devices
- **🎯 Smooth Scrolling**: Seamless scroll-based animations and interactions
- **📝 Markdown Blog**: Write blog posts in Markdown with full syntax highlighting
- **⚡ Performance Optimized**: Built with Next.js 15 and Turbopack for optimal performance
- **🎬 Framer Motion**: Advanced animations and micro-interactions
- **🔍 SEO Friendly**: Optimized for search engines with proper meta tags

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS 4 with custom 3D transform utilities
- **Animations**: Framer Motion with advanced 3D effects
- **Blog**: Markdown processing with gray-matter and remark
- **Typography**: Inter font family
- **Deployment**: Ready for Vercel, Netlify, or any static hosting

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

1. Clone the repository
2. Install dependencies: `pnpm install`
3. Start the development server: `pnpm dev`
4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for production

```bash
pnpm build
```

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
├── components/            # React components with 3D animations
├── content/blog/          # Markdown blog posts
├── lib/                   # Utilities and helpers
└── types/                 # TypeScript type definitions
```

## ✏️ Customization

### Personal Information
- Update hero section in `src/components/Hero.tsx`
- Edit experience data in `src/components/Experience.tsx`
- Modify projects in `src/components/Projects.tsx`

### Blog Posts
Create Markdown files in `src/content/blog/` with frontmatter:

```markdown
---
title: "Your Post Title"
excerpt: "Brief description"
date: "2024-08-24"
tags: ["tag1", "tag2"]
---

Your content here...
```

## 🎬 Animation Features

- **3D Transforms**: Mouse-following parallax effects, scroll-based rotations
- **Micro-interactions**: Hover effects, staggered animations, smooth transitions
- **Performance**: GPU acceleration, optimized re-renders

## 📦 Deployment

Ready for deployment on Vercel, Netlify, or any static hosting platform.

## 🙏 Acknowledgments

- Inspired by the LanX template design
- Built with Next.js, Framer Motion, and Tailwind CSS
- Advanced 3D animation techniques
