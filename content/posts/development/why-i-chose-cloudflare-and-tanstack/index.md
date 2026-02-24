---
title: Why I'm Choosing Cloudflare and TanStack for My Side Projects
date: "2026-02-24"
description: |
  After building with Vercel and Supabase, I switched to Cloudflare and TanStack.
  Here's why — and what I gained.
author:
  name: Marcin Jasion
menu:
  sidebar:
    name: Cloudflare + TanStack
    identifier: cloudflare-tanstack
    parent: development
    weight: 1
---

I like building side projects. They're how I learn new tools, test ideas, and stay sharp outside of work. Over the past year I've gone through a few stacks trying to find the right balance between developer experience, cost, and simplicity. I started with Vercel and Supabase. I ended up on Cloudflare and TanStack.

This post is about why.

## What I moved away from

### Vercel — great DX, steep price

Vercel is genuinely excellent for development. The deployment workflow, preview environments, and Next.js integration are top-notch. For a team shipping a product, it makes a lot of sense.

But for side projects? The free tier is limited, and the moment you need anything beyond it — more bandwidth, analytics, or team features — the Pro plan jumps to $20/month per member. That adds up fast when you're just experimenting.

### Supabase — powerful, but not simple

Supabase markets itself as a Firebase alternative with a Postgres database. And it is. But "Postgres under the hood" means you're still writing SQL for everything. Migrations, functions, triggers — it's all manual.

The bigger friction is Row Level Security (RLS). In theory, RLS is elegant — your authorization lives in the database. In practice, writing and debugging RLS policies is painful. Every new table needs policies. Every edge case needs another rule. It slows you down when you're prototyping.

And when you combine Supabase with Vercel, the costs stack up. Two paid services, two billing dashboards, and the Supabase free tier doesn't include automatic backups. For a side project that might sit idle for weeks, that's hard to justify.

## Why Cloudflare ☁️

Cloudflare solves most of what bothered me about the previous stack.

### Global distribution by default

Everything on Cloudflare runs at the edge. Workers, Pages, KV, D1 — it's all distributed globally without any configuration. Your side project in Warsaw serves just as fast in Tokyo. You don't think about regions.

### The free tier is generous

This is the big one. Cloudflare gives you a lot for free:

- **Workers** — 100,000 requests/day
- **Pages** — unlimited sites, unlimited bandwidth
- **D1** — 5 GB storage, 5 million reads/day
- **KV** — 100,000 reads/day, 1,000 writes/day
- **R2** — 10 GB storage, no egress fees

For a side project, you may never leave the free tier. And when you do, the paid plans are cheap.

### A complete platform

Instead of stitching together Vercel for hosting and Supabase for the database, Cloudflare gives you everything in one place: compute (Workers), hosting (Pages), database (D1), key-value store (KV), object storage (R2), queues, cron triggers, and more. One dashboard, one bill.

### Simple resource access with bindings

After years of working with AWS IAM — writing JSON policies, managing roles, trust relationships, permission boundaries — Cloudflare's bindings model feels refreshing. You bind a D1 database or KV namespace to your Worker in `wrangler.toml`, and it's available as a variable in your code. No IAM roles, no resource ARNs, no "Action": "s3:GetObject" policy chains. Your Worker can only access what you explicitly bind to it — simple, secure, and zero boilerplate.

Worker bindings also make it trivial to expose an API. Want to add a `/api` route next to your frontend? It's the same Worker — just handle the path. No separate Lambda, no API Gateway configuration, no CORS headaches between services. Your frontend and API live together, share the same bindings, and deploy as one unit.

### Growing ecosystem

What convinced me that Cloudflare Workers are ready for real use is how many frameworks now support them as a first-class deployment target. In the last couple of years, the ecosystem has grown significantly. I use TanStack Start and Hono — both deploy to Workers out of the box. But React Router also has excellent Workers support. When multiple major frameworks invest in your platform, that's a strong signal.

## Why TanStack ⚡

The other half of the equation is the framework. I picked TanStack because it fits naturally on top of Cloudflare.

### Full-stack, type-safe

TanStack Start gives you a full-stack React framework with server-side rendering, file-based routing via TanStack Router, and built-in data fetching with TanStack Query. Everything is type-safe end-to-end — from route parameters to API responses.

### No vendor lock-in

Unlike Next.js, which is deeply tied to Vercel's infrastructure, TanStack runs anywhere. It deploys to Cloudflare Workers, Node.js, Deno, or Bun. If I ever want to move, I can. That matters for side projects — you don't want to be locked in to infrastructure you might stop paying for.

### Modern DX

TanStack Router's type-safe routing catches errors at build time instead of runtime. TanStack Query handles caching, deduplication, and background refetching out of the box. The developer experience is excellent without the framework trying to own your deployment.

## Comparison

| | **Vercel + Supabase** | **Cloudflare + TanStack** |
|---|---|---|
| **Hosting cost** | Free tier limited; Pro at $20/mo | Pages: free, unlimited bandwidth |
| **Database** | Postgres (write SQL, manage RLS) | D1: 5 GB free, simple SQL |
| **Key-value store** | Requires additional service | KV: included free |
| **Global distribution** | Edge functions available (paid) | Everything runs at the edge |
| **Backups** | Not on free tier | D1 time-travel recovery included |
| **Auth complexity** | RLS policies per table | Flexible — use what you need |
| **Framework lock-in** | Next.js tied to Vercel | TanStack runs anywhere |
| **Single dashboard** | Two separate services | One platform |

## Cloudflare's perception problem

I have a feeling that Cloudflare is not promoted enough as a hosting and application platform. Most developers still think of it as a CDN or a DNS provider. When they hear "Workers," they picture a backend-only compute layer — something like AWS Lambda, not a place to run a full-stack app. But Workers serve static assets alongside your server code. You deploy one thing and it handles everything.

D1 has a similar perception issue. People hear "SQLite" and immediately associate it with pet projects or local development. SQLite on a single machine — sure. But D1 is SQLite replicated globally across Cloudflare's network. It handles reads at the edge with automatic replication. That's not a pet project database — that's a globally distributed data layer. Yet the "SQLite" label makes people dismiss it before looking at what it actually does.

The result is that Cloudflare has quietly built a serious application platform — Workers, Pages, D1, KV, R2, Queues, Durable Objects — but many developers don't consider it because the naming and associations don't match what they expect from "enterprise" or "production-grade" infrastructure.

## Closing thoughts

There's no perfect stack. Vercel and Supabase are solid products, and for a funded team shipping fast, they might be the right choice. But for side projects — where you want to keep costs near zero, avoid unnecessary complexity, and still build something real — Cloudflare and TanStack hit the sweet spot.

I get global distribution for free, a database that doesn't require RLS gymnastics, and a framework that doesn't lock me in. That's enough to ship ideas without worrying about the bill.
