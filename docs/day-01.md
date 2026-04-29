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

## Insight
### Kenapa Harus Monorepo?
1. Monorepo adalah strategi di mana kita menyimpan banyak proyek (misalnya: frontend, backend, dan mobile app) dalam satu repository yang sama.
2. Sharing Code Jadi Sat-Set: Kamu punya logika validasi atau tipe data yang sama di frontend dan backend? Di monorepo, kamu tinggal bikin satu package internal dan bagi-pakai tanpa perlu publish ke NPM publik.
3. Single Source of Truth: Tidak ada lagi drama "Versi API di repo sebelah ternyata udah beda." Semua kode sinkron di satu tempat, jadi ketergantungan antar tim lebih transparan.
4. Atomic Changes: Kamu bisa mengubah API di backend sekaligus mengupdate cara frontend memanggilnya dalam satu Pull Request. Ini meminimalisir risiko aplikasi pecah karena perubahan yang setengah-setengah.
5. Standardisasi Tools: Kamu cukup mengatur konfigurasi deployment, CI/CD, dan aturan keamanan satu kali untuk semua proyek. Hemat waktu setup!

### Manfaat Linting Sejak Awal (Early Linting)
1. Linting adalah proses otomatis untuk mengecek kesalahan penulisan atau gaya kode sebelum kode tersebut dijalankan.
2. Menangkap Bug "Konyol" Lebih Cepat: Linter bakal teriak kalau ada variabel yang lupa didefinisikan atau fungsi yang tidak pernah dipanggil. Ini jauh lebih murah daripada nemuin bug pas aplikasi sudah di tangan user.
3. Debat Kusir Saat Code Review Berkurang: Tanpa linter, tim sering berantem soal "bagusnya pakai titik koma atau enggak" atau "pakai spasi atau tab". Dengan early linting, aturan sudah baku, jadi reviewer bisa fokus ke logika bisnis, bukan kosmetik.
4. Menjaga Kode Tetap "Sehat": Kode yang konsisten lebih mudah dibaca oleh siapa pun. Ini sangat membantu saat ada anggota tim baru yang bergabung (onboarding jadi lebih cepat).
5. Mencegah Technical Debt: Memperbaiki ribuan peringatan linter di proyek yang sudah besar itu mimpi buruk. Melakukannya sejak hari pertama memastikan hutang teknis tidak menumpuk.

Singkatnya: Monorepo bikin tim kolaborasi lebih sinkron, sedangkan early linting memastikan kualitas kode tetap terjaga tanpa perlu banyak emosi.
