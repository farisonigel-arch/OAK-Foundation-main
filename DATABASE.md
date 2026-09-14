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

## Changing the data model

Edit the `model` blocks in **both** `prisma/schema.sqlite.prisma` and
`prisma/schema.postgresql.prisma` (keep them identical apart from the
`datasource` block), then:

```bash
npm run db:push          # applies to whichever DB DATABASE_URL points at
```
