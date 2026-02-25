---
title: Why I'm Choosing Cloudflare and TanStack for My Side Projects
date: "2026-02-25"
description: |
  After building with Vercel and Supabase, I switched to Cloudflare and TanStack.
  Here's why - and what I gained.
hero: hero.svg
tags:
- cloudflare
- tanstack
- frontend
- side-projects
mermaid: true
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

Vercel is genuinely excellent for development. The deployment workflow, preview environments, and Next.js integration are top-notch. For a team shipping a product, it makes a lot of sense. But for side projects the free tier is limited, and the moment you need anything beyond it - more bandwidth, analytics, or team features - the Pro plan jumps to $20/month per member. That adds up fast when you're just experimenting.

Supabase has a similar story. It markets itself as a Firebase alternative with a Postgres database, and it is. But "Postgres under the hood" means you're still writing SQL for everything - migrations, functions, triggers. The bigger friction is Row Level Security (RLS). In theory it's elegant: your authorization lives in the database. In practice, writing and debugging RLS policies is painful. Every new table needs policies, every edge case needs another rule, and it slows you down when you're prototyping.

When you combine the two, the costs stack up. Two paid services, two billing dashboards, and the Supabase free tier doesn't include automatic backups. For a side project that might sit idle for weeks, that's hard to justify.

## Why Cloudflare ☁️

Cloudflare solves most of what bothered me about the previous stack. Everything runs at the edge - Workers, Pages, KV, D1 - distributed globally without any configuration. Your side project in Warsaw serves just as fast in Tokyo. Instead of stitching together Vercel for hosting and Supabase for the database, you get everything in one place: compute, hosting, database, key-value store, object storage, queues, and cron triggers. One dashboard, one bill.

The free tier is what sealed it for me. Workers get 100,000 requests/day, Pages offers unlimited sites and bandwidth, D1 gives you 5 GB of storage with 5 million reads/day, KV handles 100,000 reads/day, and R2 provides 10 GB with no egress fees. For a side project, you may never leave the free tier. And when you do, the paid plans are cheap.

After years of working with AWS IAM - writing JSON policies, managing roles, trust relationships - Cloudflare's bindings model feels refreshing. You bind a D1 database or KV namespace to your Worker in `wrangler.toml`, and it's available as a variable in your code. No IAM roles, no resource ARNs. Want to add a `/api` route next to your frontend? It's the same Worker - just handle the path. No separate Lambda, no API Gateway configuration, no CORS headaches between services. Your frontend and API live together, share the same bindings, and deploy as one unit. The ecosystem backs this up - TanStack Start, Hono, and React Router all deploy to Workers out of the box. When multiple major frameworks invest in your platform, that's a strong signal.

## Why TanStack ⚡

The other half of the equation is the framework. TanStack Start gives you a full-stack React framework with server-side rendering, file-based routing via TanStack Router, and built-in data fetching with TanStack Query. Everything is type-safe end-to-end - from route parameters to API responses. The router catches errors at build time instead of runtime, and Query handles caching, deduplication, and background refetching out of the box.

What matters most for side projects is portability. Unlike Next.js, which is deeply tied to Vercel's infrastructure, TanStack runs anywhere - Cloudflare Workers, Node.js, Deno, or Bun. If I ever want to move, I can. You don't want to be locked in to infrastructure you might stop paying for. The developer experience is excellent without the framework trying to own your deployment.

## Comparison

| | **Vercel + Supabase** | **Cloudflare + TanStack**        |
|---|---|----------------------------------|
| **Hosting cost** | Free tier limited; Pro at $20/mo | Pages: free, unlimited bandwidth |
| **Database** | Postgres (write SQL, manage RLS); Pro at $25/mo | D1: 5 GB free, simple SQL        |
| **Key-value store** | Requires additional service (e.g. Upstash) | KV: included free                |
| **Global distribution** | Edge functions available (paid) | Everything runs at the edge      |
| **Backups** | Not on free tier | D1 time-travel recovery included |
| **Auth complexity** | RLS policies per table | Flexible - use what you need     |
| **Framework lock-in** | Next.js tied to Vercel | TanStack runs anywhere           |
| **Single dashboard** | Two separate services | One platform                     |

## How I structure a project

In practice, I run two Cloudflare Workers as a monorepo. The frontend is a TanStack Start worker handling SSR and file-based routing. The backend is a [Hono](https://hono.dev/) API worker handling auth, database, and business logic. The frontend calls the backend directly through a Cloudflare [service binding](https://developers.cloudflare.com/workers/runtime-apis/bindings/service-bindings/) - no HTTP round-trip, no CORS, just an internal `env.API.fetch()` call. Both workers share the same cookie prefix, so auth tokens flow seamlessly between them.

For data, D1 handles the relational storage with Drizzle ORM for type-safe queries and migrations. KV stores session data - specifically refresh tokens for the JWT auth flow. R2 is available for file uploads when needed. Everything is bound to the workers through `wrangler.toml`, so there's no infrastructure to provision beyond the config file.

{{< mermaid align="center" >}}
%%{init: {'theme':'default'}}%%
graph TD
    Browser -->|HTTPS| FW[Frontend Worker - TanStack Start]
    Browser -->|HTTPS /a/| BW[Backend Worker - Hono API]
    FW -->|Service Binding| BW
    BW --> D1[(D1 Database)]
    BW --> KV[(KV Sessions)]
    BW --> R2[(R2 Storage)]
    FW ~~~ BW
{{< /mermaid >}}

This setup deploys as two workers with a single `wrangler deploy` per workspace. The service binding between them means the frontend-to-backend call stays within Cloudflare's network - no public endpoint needed for the API.

One small detail worth mentioning: I prefix backend routes with `/a/` instead of the conventional `/api/`. I noticed that `/api` paths are regularly scanned by bots - automated crawlers probing for exposed endpoints, looking for common frameworks and vulnerabilities. Switching to `/a/` reduced random worker invocations to a minimum. It's a simple change, but it keeps noise out of your logs and your free tier usage low.

## Cloudflare's perception problem

I have a feeling that Cloudflare is not promoted enough as a hosting and application platform. Most developers still think of it as a CDN or a DNS provider. When they hear "Workers," they picture a backend-only compute layer - something like AWS Lambda, not a place to run a full-stack app. But Workers serve static assets alongside your server code. You deploy one thing and it handles everything.

D1 has a similar perception issue. People hear "SQLite" and immediately associate it with pet projects or local development. SQLite on a single machine - sure. But D1 is SQLite replicated globally across Cloudflare's network. It handles reads at the edge with automatic replication. That's not a pet project database - that's a globally distributed data layer. Yet the "SQLite" label makes people dismiss it before looking at what it actually does.

The result is that Cloudflare has quietly built a serious application platform - Workers, Pages, D1, KV, R2, Queues, Durable Objects - but many developers don't consider it because the naming and associations don't match what they expect from "enterprise" or "production-grade" infrastructure.

### A note on reliability

Cloudflare has had several notable downtimes in recent months, and that's worth acknowledging. If your side project grows into something people rely on, a single-vendor dependency becomes a real risk. The good news is that the stack I described is portable by design. TanStack Start can run on [AWS Lambda via serverless](https://johanneskonings.dev/blog/2025-11-30-tanstack-start-aws-serverless/) or on [Google Cloud Run with Docker and Bun](https://medium.com/@chadbell045/deploying-tanstack-start-on-cloud-run-with-docker-bun-d4e66c246557). Hono has first-class support for both [AWS Lambda](https://hono.dev/docs/getting-started/aws-lambda) and [Google Cloud Run](https://hono.dev/docs/getting-started/google-cloud-run). Neither framework locks you into Cloudflare's runtime.

For one of my side projects I've started exploring this as an option - setting up a backup for API endpoints on AWS or GCP, so that if Cloudflare becomes unavailable, traffic can fail over to an alternative. It's a wider architecture problem that touches DNS failover, database replication, and session portability. I might write a dedicated post about it in the future.

## Closing thoughts

There's no perfect stack. Vercel and Supabase are solid products, and for a funded team shipping fast, they might be the right choice. But for side projects - where you want to keep costs near zero, avoid unnecessary complexity, and still build something real - Cloudflare and TanStack hit the sweet spot.

I get global distribution for free, a database that doesn't require RLS gymnastics, and a framework that doesn't lock me in. That's enough to ship ideas without worrying about the bill.
