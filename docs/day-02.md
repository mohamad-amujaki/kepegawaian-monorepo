# Langkah Praktis
## Buat folder api di dalam apps
- mkdir -p apps/api
- cd apps/api    
- pnpm init -> Wrote to /Users/mohamadarifmujaki/Learning/kepegawaian-monorepo/apps/api/package.json
## Install Hono dan Typescript
- pnpm create hono@latest -> Target directory . Template -> nodejs Package Manager -> Pnpm
- pnpm add -D typescript ts-node @types/node
- npx tsc --init -> Created a new tsconfig.json
- Edit tsconfig.json -> "module": "ESNext","moduleResolution": "bundler",
## Buat index.ts di folder api/src/index.ts
- mkdir src
- touch src/index.ts
- untuk API gunakan port 8000
- jalankan pnpm dev
