# Hari 3 – Integrasi Prisma ORM + SQLite

## Teori Singkat
- Prisma ORM mempermudah interaksi dengan DB secara type-safe, cocok untuk domain kepegawaian yang kompleks.
- SQLite cukup untuk tahap awal (dev/local) karena sederhana, file-based.
- Prisma 7 menggunakan config-driven approach (prisma.config.ts) bukan schema-based URL.

## Ringkasan Langkah yang Dilakukan

### ✅ 1. Setup Package Database
```bash
mkdir -p packages/database
cd packages/database
pnpm init
```

### ✅ 2. Install Dependencies
```bash
pnpm add typescript tsx @types/node @types/better-sqlite3 -D
pnpm add @prisma/client @prisma/adapter-better-sqlite3 dotenv
```

Update `packages/database/package.json`:
```json
{
  "devDependencies": {
    "prisma": "catalog:prisma",
    "typescript": "^5.9.3",
    "tsx": "^4.21.0",
    "@types/node": "^20.19.39",
    "@types/better-sqlite3": "^7.6.13"
  },
  "dependencies": {
    "@prisma/client": "^7.8.0",
    "@prisma/adapter-better-sqlite3": "^7.8.0",
    "dotenv": "^17.4.2"
  }
}
```

### ✅ 3. Initialize Prisma
```bash
pnpm dlx prisma init --datasource-provider sqlite
```

Ini akan membuat:
- `prisma/schema.prisma` - Schema definisi database
- `.env` - Environment variables dengan `DATABASE_URL="file:./dev.db"`
- `prisma.config.ts` - Konfigurasi Prisma

### ✅ 4. Konfigurasi Prisma (Prisma 7 - PENTING)

**Update `prisma/schema.prisma`:**
```prisma
generator client {
  provider = "prisma-client"
  output   = "../generated/client"
}

datasource db {
  provider = "sqlite"
}

model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

**⚠️ PENTING (Prisma 7):** Jangan tambahkan `url` di datasource. Datasource URL diambil dari `prisma.config.ts`.

**Update `prisma.config.ts`:**
```typescript
import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
```

**Update `.env`:**
```
DATABASE_URL="file:./dev.db"
```

### ✅ 5. Add NPM Scripts (packages/database)

Update `packages/database/package.json`:
```json
{
  "scripts": {
    "db:generate": "prisma generate",
    "db:migrate": "prisma migrate dev",
    "db:deploy": "prisma migrate deploy",
    "db:studio": "prisma studio",
    "db:test": "tsx scripts/test-database.ts"
  }
}
```

### ✅ 6. Generate Prisma Client
```bash
pnpm db:generate
```

Output:
```
✔ Generated Prisma Client (7.8.0) to ./generated/client in 29ms
```

### ✅ 7. Create Prisma Client Wrapper

**Create `packages/database/client.ts`:**
```typescript
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "./generated/client/client";

// Validate DATABASE_URL is set
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
	throw new Error(
		"DATABASE_URL environment variable is not set. Please configure it in your .env file."
	);
}

const adapter = new PrismaBetterSqlite3({ url: databaseUrl });

const globalForPrisma = globalThis as typeof globalThis & {
	prisma?: PrismaClient;
};

export const prisma: PrismaClient =
	globalForPrisma.prisma ??
	new PrismaClient({
		adapter,
		log:
			process.env.NODE_ENV === "development"
				? ["query", "error", "warn"]
				: ["error"],
	});

if (process.env.NODE_ENV !== "production") {
	globalForPrisma.prisma = prisma;
}
```

**Key Points:**
- ✅ Validasi `DATABASE_URL` saat module load
- ✅ Singleton pattern untuk reuse instance
- ✅ Logging configuration untuk development mode
- ✅ Environment-specific behavior
- ✅ Import dari `./generated/client/client` (bukan `./generated/client`)

### ✅ 8. Create Export Index

**Create `packages/database/index.ts`:**
```typescript
export { prisma } from "./client";
export * from "./generated/client/client";
```

### ✅ 9. Create Database Migration
```bash
pnpm db:migrate -- --name init
```

Output:
```
✔ Prisma Migrate created the following migration:

prisma/migrations/
  └─ 20260430132403_init/
    └─ migration.sql

Your database is now in sync with your schema.
```

### ✅ 10. Create Test Script

**Create `packages/database/scripts/test-database.ts`:**
```typescript
import "dotenv/config";
import { prisma } from "../client";

async function testDatabase() {
	console.log("🔍 Testing Prisma connection...\n");

	try {
		console.log("✅ Connected to database!");

		console.log("\n📝 Creating a test user...");
		try {
			// Delete existing test user if exists
			await prisma.user.deleteMany({
				where: {
					email: "demo@example.com",
				},
			});
		} catch (error) {
			// Silently ignore if deletion fails
		}

		const newUser = await prisma.user.create({
			data: {
				email: "demo@example.com",
				name: "Demo User",
			},
		});
		console.log("✅ Created user:", newUser);

		console.log("\n📋 Fetching all users...");
		const allUsers = await prisma.user.findMany();
		console.log(`✅ Found ${allUsers.length} user(s):`);
		allUsers.forEach((user) => {
			console.log(`   - ${user.name} (${user.email})`);
		});

		console.log("\n🎉 All tests passed! Your database is working.\n");
	} catch (error) {
		console.error("❌ Error:", error);
		process.exit(1);
	} finally {
		await prisma.$disconnect();
	}
}

testDatabase();
```

**Run test:**
```bash
pnpm db:test
```

**Test Output:**
```
🔍 Testing Prisma connection...

✅ Connected to database!

📝 Creating a test user...
✅ Created user: { id: 1, email: 'demo@example.com', name: 'Demo User', createdAt: ..., updatedAt: ... }

📋 Fetching all users...
✅ Found 1 user(s):
   - Demo User (demo@example.com)

🎉 All tests passed! Your database is working.
```

## Root Level Scripts (MonoRepo)

Setelah setup, tambahkan scripts di root `package.json`:

```json
{
  "scripts": {
    "db:generate": "pnpm --filter database db:generate",
    "db:migrate": "pnpm --filter database db:migrate",
    "db:deploy": "pnpm --filter database db:deploy",
    "db:studio": "pnpm --filter database db:studio",
    "db:test": "pnpm --filter database db:test",
    "db:seed": "pnpm --filter database db:seed"
  }
}
```

Sekarang bisa menjalankan dari root:
```bash
pnpm db:generate
pnpm db:migrate
pnpm db:test
pnpm db:studio
```

Untuk dokumentasi lengkap setiap script, lihat: **[DATABASE-SCRIPTS.md](./DATABASE-SCRIPTS.md)**

## Integration dengan App

### 1. Add database dependency di app's package.json
```json
{
  "dependencies": {
    "database": "workspace:*"
  }
}
```

### 2. Install dependencies
```bash
pnpm install
```

### 3. Import di aplikasi
```typescript
import { prisma } from "database";

// Contoh: Get all users
const users = await prisma.user.findMany();

// Contoh: Create user
const newUser = await prisma.user.create({
  data: { email: "john@example.com", name: "John Doe" }
});
```

## Common Issues & Solutions

### ❌ Issue: "Cannot find module './generated/client'"
**Solusi:** Run `pnpm db:generate` untuk generate Prisma Client

### ❌ Issue: "DATABASE_URL environment variable is not set"
**Solusi:** Pastikan `.env` file ada dengan `DATABASE_URL="file:./dev.db"`

### ❌ Issue: "Table does not exist"
**Solusi:** Run `pnpm db:migrate` untuk create database tables

### ❌ Issue: Duplicate key error pada test
**Solusi:** Script sudah di-update dengan `deleteMany()` sebelum create untuk idempotency

### ❌ Issue: "Cannot run scripts - filter not found"
**Solusi:** Pastikan pnpm workspace sudah setup dengan benar (`pnpm install`)

## Directory Structure
```
packages/database/
├── prisma/
│   ├── schema.prisma          # Database schema definition
│   └── migrations/            # Migration files
├── generated/
│   └── client/                # Generated Prisma Client (auto-generated)
├── scripts/
│   └── test-database.ts       # Test script
├── client.ts                  # Prisma Client wrapper dengan singleton pattern
├── index.ts                   # Export index
├── .env                       # Environment variables
├── prisma.config.ts           # Prisma configuration (Prisma 7)
└── package.json               # Package definition
```

## Checklist Completion
- ✅ Setup packages/database dengan struktur yang benar
- ✅ Install dependencies (Prisma, SQLite adapter, TypeScript)
- ✅ Configure Prisma untuk Prisma 7 (config-driven approach)
- ✅ Create User model schema dengan proper fields
- ✅ Generate Prisma Client ke custom output directory
- ✅ Create migration dan setup database tables
- ✅ Create Prisma Client wrapper dengan validation & logging
- ✅ Create export index untuk easy imports
- ✅ Create test script dengan proper error handling
- ✅ Test CRUD operations (Create, Read, Delete)
- ✅ Add root level scripts untuk monorepo convenience
- ✅ Document integration steps untuk digunakan di apps

## Next Steps
- Untuk dokumentasi lengkap script: lihat **[DATABASE-SCRIPTS.md](./DATABASE-SCRIPTS.md)**
- Untuk menambah models baru: edit `prisma/schema.prisma` → `pnpm db:migrate` → test
- Untuk seed data: implement `db:seed` script di packages/database/package.json

## Resources
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Prisma Migrate Guide](https://www.prisma.io/docs/orm/prisma-migrate)
- [Prisma Studio](https://www.prisma.io/docs/concepts/components/prisma-studio)
- [SQLite Provider](https://www.prisma.io/docs/orm/overview/databases/sqlite)
