# Database setup

This project uses **SQLite locally** and **PostgreSQL in production (Vercel)**,
via two Prisma schema files that get swapped in automatically:

- `prisma/schema.sqlite.prisma` — local dev
- `prisma/schema.postgresql.prisma` — Vercel / production
- `prisma/schema.prisma` — **generated file**, do not edit directly. It's
  overwritten by `scripts/select-db-schema.mjs` before every `dev`, `build`,
  `db:push`, and `db:studio` run.

## How the switch happens

`scripts/select-db-schema.mjs` picks a provider in this order:

1. `DATABASE_PROVIDER` env var if set (`sqlite` or `postgresql`)
2. otherwise, if `VERCEL` is set (Vercel sets this automatically at build/runtime) → `postgresql`
3. otherwise → `sqlite` (your local machine)

## Local development

```bash
cp .env.example .env   # DATABASE_URL="file:./dev.db"
npm install
npm run dev             # runs select-db-schema + prisma generate, then next dev
```

Your data lives in `prisma/dev.db` (already gitignored).

## Production (Vercel)

1. Provision a Postgres database — easiest options: **Vercel Postgres** (Storage
   tab in your Vercel project) or **Neon** (neon.tech, has a Vercel integration).
2. Copy its connection string.
3. In your Vercel project → **Settings → Environment Variables**, add:
   - `DATABASE_URL` = your Postgres connection string (Production, and Preview if you want preview deployments to hit a DB too)
4. Push the schema to that database once (and again any time you change `prisma/schema.postgresql.prisma`):
   ```bash
   vercel env pull .env.production.local   # pulls DATABASE_URL from Vercel
   DATABASE_URL="$(grep DATABASE_URL .env.production.local | cut -d= -f2- | tr -d '"')" npm run db:push
   ```
   (Or just paste the Postgres URL directly: `DATABASE_URL="postgresql://..." npm run db:push`.)

Vercel automatically sets `VERCEL=1` during the build, so `next build` on Vercel
always compiles against the PostgreSQL schema — no extra config needed there.

## Pages that query the database

`app/attendance/page.tsx`, `app/nametags/page.tsx`, and `app/pass/[id]/page.tsx`
all query Prisma directly in a server component. Each has:

```ts
export const dynamic = 'force-dynamic';
```

This is required — without it, Next.js tries to **statically prerender these
pages during `next build`**, which means the build itself needs a live,
correctly-configured `DATABASE_URL`. If `DATABASE_URL` is unset or blank at
build time, the build fails with an error like:

```
error: Error validating datasource `db`: You must provide a nonempty URL.
The environment variable `DATABASE_URL` resolved to an empty string.
```

`force-dynamic` makes these pages render per-request instead, so the database
is only ever contacted when a real user loads the page — not during the
build. If you add a new page or API route that queries `db`, add the same
export unless you have a good reason for it to be statically generated.

## Troubleshooting: "DATABASE_URL resolved to an empty string"

This means Vercel *has* a `DATABASE_URL` variable defined, but its value is
blank — usually one of:

- The value field was left empty when the variable was saved in **Settings →
  Environment Variables**
- The variable isn't checked for the **Production** environment
- The variable was added *after* the failing build ran — trigger a fresh
  deploy once it's set correctly

Double-check the variable, then redeploy. `DATABASE_URL` is a reserved name
this project's Prisma schema (`prisma/schema.postgresql.prisma`) expects
exactly as-is — don't rename it.



Edit the `model` blocks in **both** `prisma/schema.sqlite.prisma` and
`prisma/schema.postgresql.prisma` (keep them identical apart from the
`datasource` block), then:

```bash
npm run db:push          # applies to whichever DB DATABASE_URL points at
```
