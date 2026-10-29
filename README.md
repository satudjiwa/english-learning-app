# English for Service Engineer

Aplikasi latihan bahasa Inggris praktis untuk **service engineer dan teknisi bandara Indonesia**. Materi berfokus pada percakapan dengan engineer remote: menjelaskan masalah, mengikuti instruksi, melaporkan hasil tes, dan menutup sesi.

Aplikasi ini statis, tanpa akun, tanpa backend, dan tanpa API berbayar. Seluruh progres belajar disimpan di `localStorage` perangkat.

**Produksi:** <https://satudjiwa.github.io/english-learning-app/>

## Siklus belajar

`LISTEN → UNDERSTAND → RECALL → SPEAK → REVIEW`

Fitur utama:

- **Beranda** — rekomendasi belajar hari ini, target harian, progres, frasa jatuh tempo, dan pintu masuk semua modul.
- **Latihan Harian** — maksimal 5 frasa baru per hari, audio, arti yang bisa disembunyikan, catatan penggunaan, dan tombol tandai dipelajari.
- **Bank Frasa** — 91 kalimat dalam 14 kategori, pencarian dua bahasa, filter, status review, contoh dialog, dan audio.
- **Latihan Recall** — prompt Indonesia, jawaban Inggris, penilaian keyakinan, dan penjadwalan ulang.
- **Listen & Speak** — text-to-speech, mode lambat, sembunyikan teks, terjemahan, dan perekaman suara opsional.
- **Simulator Remote Session** — 11 skenario roleplay berurutan dengan pilihan respons dan penjelasan.
- **Progres & Review** — statistik dari data nyata, grafik 14 hari, jadwal review, riwayat, dan reset dengan konfirmasi.
- **Pengaturan** — suara Inggris, kecepatan bicara, target harian, dan informasi penyimpanan lokal.

### Spaced repetition

- **Belum Ingat** — muncul lagi di sesi yang sama; jadwal tetap jatuh tempo.
- **Agak Ingat** — review besok.
- **Sudah Ingat** — 3, 7, 15, 34, lalu 60 hari.
- **Dikuasai** — butuh 4 recall sukses berturut-turut dan interval minimal 14 hari.

Tanggal review disimpan sebagai ISO date di browser. Perhitungan dilakukan ulang setiap halaman dibuka, sehingga tidak bergantung pada timer atau server.

## Menjalankan secara lokal

Tidak ada proses build. Karena aplikasi memakai ES modules, jalankan lewat server HTTP (bukan `file://`).

Dari folder repositori:

```bash
cd /home/misbah/english-learning-app
python3 -m http.server 8080
```

Buka <http://localhost:8080/>.

Untuk menguji base path yang sama seperti GitHub Pages, jalankan server dari folder induk:

```bash
cd /home/misbah
python3 -m http.server 8080
```

Buka <http://localhost:8080/english-learning-app/>.

## Pemeriksaan

```bash
npm test
```

Pemeriksaan menjalankan 15 cek: 14 kategori, 91 frasa, 30 frasa wajib, keunikan ID, kelengkapan terjemahan, 11 skenario dengan tepat satu jawaban benar, berkas deployment, serta perhitungan jadwal spaced repetition. Tidak ada dependensi yang dipasang.

## Struktur

```text
index.html                 shell, navigasi, dialog, toast
styles.css                 design system dan seluruh tampilan responsif
js/app.js                  router hash, navigasi, status penyimpanan
js/data.js                 kategori, frasa, dialog, dan skenario
js/store.js                localStorage berversi, statistik, reset
js/srs.js                  penjadwalan review dan aturan mastery
js/speech.js               Web Speech API dan pemilihan suara en-US
js/ui.js                   komponen bersama (toast, dialog, progres)
js/utils.js                tanggal, format, pencarian, escape HTML
js/icons.js                ikon SVG inline
js/views/                  satu modul per halaman
scripts/check.mjs          pemeriksaan konten dan logika
sw.js                      cache shell untuk penggunaan offline
manifest.webmanifest       metadata PWA
```

## Penyimpanan data

- Kunci: `service-english.progress.v1`
- Skema diberi versi dan divalidasi saat dibaca.
- Data rusak tidak dikirim ke mana pun; aplikasi memulai progres baru dan menyimpan cadangan mentah dengan prefiks `service-english.progress.backup.`.
- Jika `localStorage` diblokir, aplikasi tetap berjalan dan menampilkan peringatan bahwa progres hanya bertahan selama tab terbuka.
- Reset progres menghapus frasa, jadwal, riwayat, dan streak; pengaturan suara/target tetap disimpan.

## Deployment GitHub Pages

Workflow `.github/workflows/pages.yml` menyalin hanya berkas aplikasi ke `_site`, menambahkan `.nojekyll`, lalu mengunggah artefak ke GitHub Pages. Tidak ada langkah build.

1. Buka **Settings → Pages** di repositori GitHub.
2. Pilih **Source: GitHub Actions**.
3. Push ke branch `main` atau jalankan workflow secara manual.
4. Situs terbit di <https://satudjiwa.github.io/english-learning-app/>.

Semua path aset relatif dan navigasi memakai hash (`#/recall`), sehingga tidak memerlukan rewrite server atau konfigurasi base path tambahan.

## Batasan

- Audio memakai **text-to-speech browser**, bukan narator profesional. Kualitas dan ketersediaan suara bergantung pada perangkat.
- Perekaman suara memakai `MediaRecorder` bila didukung; audio hanya berada di memori tab dan tidak diunggah.
- Progres tidak disinkronkan antarperangkat dan dapat hilang jika data situs dihapus.
- Materi adalah konten latihan orisinal; bukan pengganti pelatihan teknis resmi.
