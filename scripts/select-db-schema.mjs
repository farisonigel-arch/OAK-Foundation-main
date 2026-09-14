#!/usr/bin/env node
// Copies the right prisma/schema.<provider>.prisma over prisma/schema.prisma
// so the same repo can run SQLite locally and PostgreSQL on Vercel.
//
// Resolution order:
//   1. DATABASE_PROVIDER env var, if set ("sqlite" | "postgresql")
//   2. VERCEL env var (automatically set to "1" by Vercel) -> postgresql
//   3. default -> sqlite (plain `npm run dev`/local machine)
//
// prisma/schema.prisma itself is generated output — edit
// prisma/schema.sqlite.prisma and prisma/schema.postgresql.prisma instead.

import { copyFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const prismaDir = path.join(__dirname, '..', 'prisma');

const explicit = process.env.DATABASE_PROVIDER?.toLowerCase();
const provider =
  explicit === 'postgresql' || explicit === 'sqlite'
    ? explicit
    : process.env.VERCEL
      ? 'postgresql'
      : 'sqlite';

const source = path.join(prismaDir, `schema.${provider}.prisma`);
const dest = path.join(prismaDir, 'schema.prisma');

if (!existsSync(source)) {
  console.error(`[select-db-schema] Missing ${source}`);
  process.exit(1);
}

copyFileSync(source, dest);
console.log(`[select-db-schema] Using ${provider} (prisma/schema.${provider}.prisma -> prisma/schema.prisma)`);
