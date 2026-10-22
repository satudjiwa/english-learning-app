# Small Steps English

Aplikasi web belajar bahasa Inggris pemula. Tampilan dan latihan berjalan lokal di browser; audio dan transkrip asli dibuka dari situs sumber.

## Versi daring

**https://satudjiwa.github.io/english-learning-app/**

Situs dipublikasikan otomatis oleh GitHub Pages setiap kali ada push ke branch `main` (workflow `.github/workflows/pages.yml`). Tidak ada proses build — repo ini berisi file statis apa adanya.

## Menjalankan di komputer

Di terminal, masuk ke folder ini lalu jalankan:

```bash
python3 -m http.server 8080
```

Buka <http://localhost:8080>. Hentikan server dengan `Ctrl+C`.

Server lokal diperlukan agar service worker dapat menyimpan kerangka aplikasi untuk dibuka kembali. Materi audio asli tetap membutuhkan koneksi internet.

## Menerbitkan perubahan

```bash
git add -A
git commit -m "Deskripsi perubahan"
git push
```

Workflow GitHub Pages memuat ulang situs otomatis setelah push. Bila `index.html`, `app.js`, atau `styles.css` berubah, naikkan versi cache di `sw.js` (baris `const CACHE = "small-steps-shell-v3"`) agar pengunjung yang sudah pernah membuka situs mendapat versi terbaru, bukan salinan lama dari cache.

## Fitur

- 30 materi: 10 percakapan sehari-hari, 10 workplace, dan 10 fokus listening.
- Alur Listen → Understand → Repeat → Use → Review.
- Kalimat Inggris dengan terjemahan Indonesia dan contoh pengucapan melalui text-to-speech browser.
- Latihan singkat per materi.
- Progres tersimpan di local storage browser dan review bersela pada hari ke-1, 3, 7, 14, dan 28.
- Layout responsif untuk laptop dan ponsel; aplikasi dapat dipasang dari browser yang mendukung PWA.

## Catatan sumber

Audio dan transkrip lengkap tidak disalin ke aplikasi. Tombol materi dan transkrip membuka halaman sumber resmi. Suara contoh menggunakan fitur text-to-speech perangkat, bukan audio dari situs pelajaran.
