# DecisionTrace

Understand WHY code exists. DecisionTrace analyzes a public GitHub repository's
files, commits, issues, and pull requests, then reconstructs the engineering
decision behind a given file — not just what it does.

## Stack

- Next.js 14 (App Router, Server Components by default)
- TypeScript (strict, `noUncheckedIndexedAccess`)
- Tailwind CSS
- Zod for runtime validation
- OpenAI-compatible chat API for analysis generation (defaults to **Groq's free tier**, `llama-3.3-70b-versatile`)
- GitHub REST API for repository data

## Getting started

```bash
npm install
cp .env.example .env.local   # get a free key at console.groq.com/keys and set AI_API_KEY
npm run dev
```

Visit `http://localhost:3000`. Paste a public GitHub repo URL, or click
"Try Demo" to load `vercel/next.js`.

## Project structure

```
app/                  Routes: landing (/), dashboard (/dashboard), API routes
components/           ui/, layout/, landing/, repository/, analysis/
services/             GitHub client, import, context builder, OpenAI client,
                       analyze orchestration, cache
lib/                  utils, constants, db access point
types/                Repository, Evidence, Analysis, AppError
hooks/                useRepositoryImport, useFileAnalysis
prompts/              System + user prompt builders for the AI engine
```

## Data flow

```
Paste URL → validate → GET /repos + tree (GitHub) → render Repository Explorer
Click file → GET commits/issues/PRs + file content → build compact context
           → POST context to OpenAI (JSON mode) → validate with Zod
           → cache in analyses table → render WHY / Evidence / Confidence / Still Valid
```

## Persistence

`lib/db.ts` currently uses an in-memory Map so the app runs with zero
external services. The file documents the expected Postgres schema
(`repositories`, `files`, `analyses`, `evidence`) — swap its internals for
Prisma/Drizzle/Kysely against that schema for real persistence; nothing
else in the codebase needs to change, since every caller goes through
`services/analysis-cache.service.ts`.

## Known sandbox-only build note

`next/font` fetches Inter from Google Fonts at build time. If you build in
an environment without outbound internet access, that step will fail —
this is a network restriction of the build environment, not a code issue.

## Out of scope (by design, per MVP spec)

Auth, billing, organizations, notifications, user profiles, settings,
timeline, analytics, multi-repository, GitLab/Bitbucket, Slack, VSCode
extension, CLI.
