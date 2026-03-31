# Gobbl — Talk Turkey. Build Bridges.

A gamified civil discourse training app where you practice respectful political debate with AI. Grow your turkey from an Egg to a Thunderbird as you master civil discourse.

## Quick Start

```bash
npm install
npx prisma db push
npm run db:seed     # Creates 5 sample users
npm run dev         # http://localhost:3000
```

## Features

- **AI Debate Arena** — Discuss real political topics with AI at 3 difficulty levels (Friendly Cluck, Spirited Strut, Full Gobble)
- **Civility Scoring** — Scored on 5 dimensions: respectful tone, evidence-based reasoning, empathy, constructive framing, and active listening
- **Feathers & Levels** — Earn feathers and evolve from Egg to Thunderbird across 8 levels
- **Turkey Badges** — 8 turkey-themed badges for milestones like First Gobble, Migration Streak, and Flock Leader
- **Daily Gobble** — A new topic every day with bonus feathers
- **The Flock** — Leaderboard to see who's strutting their stuff

## AI System — SAIL Lab Integration

Gobbl uses the SAIL Lab behavioral AI system powered by the Grok API. The AI character ("Robert") has:
- **Political belief presets** that auto-oppose based on topic category
- **8 behavioral parameters** (Participation, Expression, Reason-Giving, Listening, Self-Interrogation, Disagreement, Abrasiveness, Persuadability) — automatically configured per difficulty level
- **Difficulty-to-preset mapping**: Friendly Cluck (warm, listens well), Spirited Strut (engaged, direct), Full Gobble (confrontational, immovable)

## Mock Mode

Works without a Grok API key! The app uses mock AI responses and scoring when `GROK_API_KEY` is not set.

To enable real AI:
1. Get an API key from [console.x.ai](https://console.x.ai)
2. Add it to `.env.local`: `GROK_API_KEY=xai-...`

## Sample Accounts

After `npm run db:seed`, log in with any of these (password: `password123`):
- CivilSam, DebateDana, ReasonRick, EmpathyElla, BridgeBot

## Deploy to Vercel

The repo is set up for [Vercel](https://vercel.com): connect your GitHub repo, then add these **Environment Variables** in the project settings (Production and Preview):

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Neon Postgres connection string for the Gobbl branch (include `?sslmode=require` if required by Neon) |
| `GROK_API_KEY` | xAI API key (`xai-...`) |
| `NEXTAUTH_SECRET` | Random secret (32+ chars), e.g. `openssl rand -base64 32` — use a new value for production |
| `NEXTAUTH_URL` | Your site URL, e.g. `https://your-project.vercel.app` |

The build runs `prisma generate`, `prisma db push`, then `next build`, so the schema is applied on each deploy. Do not commit `.env` or `.env.local`.

Repository: [github.com/bostonjsharp/gobbl-app](https://github.com/bostonjsharp/gobbl-app)

## Tech Stack

- Next.js 14 (App Router, TypeScript)
- Tailwind CSS with custom turkey-themed palette
- Prisma + PostgreSQL ([Neon](https://neon.tech))
- Grok API (xAI) with SAIL Lab prompt architecture
- NextAuth.js
