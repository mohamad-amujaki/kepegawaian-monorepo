# Langkah Praktis
## Buat folder project dan init git
- mkdir kepegawaian-monorepo
- git init
- git remote add origin git@github.com:mohamad-amujaki/kepegawaian-monorepo.git
## Inisiasi package.json dan pnpm
- pnpm init -> Wrote to /Users/mohamadarifmujaki/Learning/kepegawaian-monorepo/package.json
## Buat pnpm-workspace.yaml
- touch pnpm-workspace.yaml 
## Install Biomejs dan Setup Script
- pnpm add -D @biomejs/biome -w 
- edit package.json pada scripts untuk menambahkan perintah lint (check kualitas code) dan format (perbaikan format otomatis)
- coba jalankan dengan perintah pnpm lint atau pnpm format
