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
## Buat Github Issue day-01 melalui terminal
- gh auth login
- gh issue create
## Buat Git Ignore
- touch .gitignore -> node_modelues/

## Bonus menghapus node_modules yang terlanjut dicommit ke github
- Hapus dari Cache Git (Untrack) -> git rm -r --cached node_modules
- Pastikan .gitignore Sudah Benar -> node_modules/
- Commit Perubahan -> git commit -m "fix: remove node_modules from tracking and apply gitignore"
- Push ke GitHub -> git push origin -u main
