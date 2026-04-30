# Database Scripts Reference

Database scripts dapat dijalankan dari root monorepo untuk kemudahan manajemen.

## Available Scripts

### 1. `pnpm db:generate`
**Purpose:** Generate Prisma Client dari schema

```bash
pnpm db:generate
```

**Output:**
```
✔ Generated Prisma Client (7.8.0) to ./generated/client in 29ms
```

**Kapan digunakan:**
- Setelah mengubah Prisma schema
- Saat setup awal
- Setelah update Prisma dependencies

---

### 2. `pnpm db:migrate`
**Purpose:** Create & apply database migration

```bash
pnpm db:migrate
```

**Interactive flow:**
```
? Enter a name for the new migration (e.g. add_post_model):
```

**Output:**
```
✔ Prisma Migrate created the following migration:

prisma/migrations/
  └─ 20260430132403_add_post_model/
    └─ migration.sql

Your database is now in sync with your schema.
```

**Kapan digunakan:**
- Setelah menambah/mengubah models di schema
- Saat development untuk sync database dengan schema

**Example:**
```bash
# Interactive (akan ditanya nama migration)
pnpm db:migrate

# Atau berikan nama migration langsung
pnpm db:migrate -- --name add_employee_table
```

---

### 3. `pnpm db:deploy`
**Purpose:** Apply existing migrations ke production database

```bash
pnpm db:deploy
```

**Kapan digunakan:**
- Saat deploy ke production/staging
- Untuk apply migrations tanpa interactive mode
- Di CI/CD pipeline

**Output:**
```
Migrations to apply:
  20260430132403_init
  20260430132404_add_employee_table

✔ 2 migrations applied
```

---

### 4. `pnpm db:studio`
**Purpose:** Open Prisma Studio (GUI untuk browse & edit data)

```bash
pnpm db:studio
```

**Output:**
```
Prisma Studio is running at http://localhost:5555
```

**Features:**
- 🎨 Visual database browser
- ✏️  Edit data directly
- 🔍 Filter & search
- 📊 View relationships

**Kapan digunakan:**
- Inspect data di development
- Quick data manipulation
- Debug database issues

---

### 5. `pnpm db:test`
**Purpose:** Test database connection & basic operations

```bash
pnpm db:test
```

**Output:**
```
🔍 Testing Prisma connection...

✅ Connected to database!

📝 Creating a test user...
✅ Created user: { id: 1, email: 'demo@example.com', name: 'Demo User', ... }

📋 Fetching all users...
✅ Found 1 user(s):
   - Demo User (demo@example.com)

🎉 All tests passed! Your database is working.
```

**Kapan digunakan:**
- Verify database setup
- After migration
- Troubleshoot connection issues
- CI/CD testing

---

### 6. `pnpm db:seed`
**Purpose:** Seed initial/demo data ke database

```bash
pnpm db:seed
```

**Status:** ⏳ Pending - Belum implemented

**Akan digunakan untuk:**
- Load initial demo data
- Setup test data
- Populate reference tables

---

## Workflow Examples

### 🚀 Development Workflow

```bash
# 1. Setup database (first time)
pnpm db:generate
pnpm db:migrate --name init

# 2. Add new model ke schema.prisma
# (edit schema file)

# 3. Create migration
pnpm db:migrate --name add_new_model

# 4. Test koneksi
pnpm db:test

# 5. Inspect data di GUI
pnpm db:studio
```

### 🌐 Production/Staging Deployment

```bash
# 1. Generate client
pnpm db:generate

# 2. Apply migrations (tanpa interactive)
pnpm db:deploy

# 3. Verify
pnpm db:test
```

### 🧪 CI/CD Pipeline

```bash
# .github/workflows/deploy.yml
- name: Generate Prisma Client
  run: pnpm db:generate

- name: Deploy migrations
  run: pnpm db:deploy

- name: Test database
  run: pnpm db:test
```

---

## Environment Variables

Semua scripts menggunakan `.env` dari `packages/database/`:

```env
# packages/database/.env
DATABASE_URL="file:./dev.db"

# Untuk production (contoh PostgreSQL)
DATABASE_URL="postgresql://user:password@localhost:5432/kepegawaian_prod"
```

---

## Troubleshooting

### ❌ Error: "Table does not exist"
```bash
# Solution: Run migration
pnpm db:migrate -- --name init
```

### ❌ Error: "DATABASE_URL is not set"
```bash
# Solution: Check .env file
cat packages/database/.env
```

### ❌ Error: "Cannot find module './generated/client'"
```bash
# Solution: Generate Prisma Client
pnpm db:generate
```

### ❌ Error: "Cannot run scripts - filter not found"
```bash
# Solution: Install dependencies
pnpm install
```

---

## Quick Commands Cheatsheet

```bash
# Setup & test
pnpm db:generate && pnpm db:migrate && pnpm db:test

# Development
pnpm db:studio             # Open GUI browser
pnpm db:test               # Quick test

# Production
pnpm db:generate           # Generate client
pnpm db:deploy             # Apply migrations
pnpm db:test               # Verify

# Clean workflow
pnpm db:generate
pnpm db:migrate --name <migration_name>
pnpm db:test
pnpm db:studio
```

---

## Learn More

- [Prisma Docs](https://www.prisma.io/docs/)
- [Prisma CLI Reference](https://www.prisma.io/docs/reference/cli-reference)
- [Prisma Migrate](https://www.prisma.io/docs/orm/prisma-migrate)
- [Prisma Studio](https://www.prisma.io/docs/concepts/components/prisma-studio)

---

## Code Quality Improvements (v1.1)

### client.ts Enhancements

The `packages/database/client.ts` file has been enhanced with production-ready features:

#### ✅ Improvements Made

1. **Adapter Error Handling**
   - Wrapped adapter initialization in try-catch
   - Clear error logging for initialization failures

2. **Graceful Shutdown Handling**
   - Handles SIGINT (Ctrl+C) signals
   - Handles SIGTERM (kill) signals
   - Proper database disconnection on termination

3. **Comprehensive Error Handling**
   - Uncaught exception handler
   - Unhandled promise rejection handler
   - Graceful shutdown before exit

4. **Improved Logging (Prisma 7)**
   - Removed deprecated "warn" level
   - Query logging in development mode
   - Error logging in all modes

5. **Better Type Safety**
   - Proper global declaration (instead of type casting)
   - ESLint compatible

6. **Clearer Code**
   - Explicit environment variable handling
   - Better code organization with comments
   - Production-ready quality

#### Example: Query Logging in Development

```bash
$ NODE_ENV=development pnpm db:test

prisma:query DELETE FROM `main`.`User` WHERE `main`.`User`.`email` = ?
prisma:query INSERT INTO `main`.`User` (`email`, `name`, ...) VALUES (?,?,?,?)
prisma:query SELECT `main`.`User` ... FROM `main`.`User` WHERE 1=1
```

#### Example: Graceful Shutdown

```bash
$ pnpm dev  # Running your app
^C          # Press Ctrl+C

📍 Received SIGINT, closing database...
✅ Database connection closed gracefully
```

#### Features Matrix

| Feature | Status | Environment |
|---------|--------|-------------|
| Query Logging | ✅ | Development only |
| Error Logging | ✅ | All environments |
| Graceful Shutdown | ✅ | All environments |
| Singleton Pattern | ✅ | Dev (reused instances) |
| Error Recovery | ✅ | All environments |

