# English for Service Engineer

Aplikasi latihan bahasa Inggris praktis untuk **service engineer dan teknisi bandara Indonesia**. Materi berfokus pada pekerjaan lapangan dan dukungan remote: melaporkan status awal, menjelaskan masalah, mengikuti instruksi, melakukan pemeriksaan dan perbaikan, mematuhi keselamatan, melaporkan hasil, serta menyerahkan pekerjaan ke tim berikutnya.

Aplikasi ini statis, tanpa akun, tanpa backend, dan tanpa API berbayar. Seluruh progres belajar disimpan di `localStorage` perangkat.

**Produksi:** <https://satudjiwa.github.io/english-learning-app/>

## Siklus belajar

`LISTEN → UNDERSTAND → RECALL → SPEAK → REVIEW`

Fitur utama:

- **Beranda** — rekomendasi belajar hari ini, target harian, progres, frasa jatuh tempo, dan pintu masuk semua modul.
- **Latihan Harian** — maksimal 5 frasa baru per hari, audio, arti yang bisa disembunyikan, catatan penggunaan, dan tombol tandai dipelajari.
- **Bank Frasa** — 198 kalimat dalam 25 kategori, pencarian dua bahasa, filter kategori dan level (Pemula/Menengah), status review, contoh dialog, dan audio.
- **Latihan Recall** — prompt bahasa Indonesia, jawaban bahasa Inggris, penjelasan singkat, penilaian **Again / Difficult / Easy**, dan penjadwalan ulang. Frasa yang sering dinilai Again atau Difficult didahulukan.
- **Pola Pertanyaan** — 8 pola bertanya (`Can I`, `Could you`, `How do I`, `What is`, `What should I`, `Why is`, `Where is`, `Is it`) dengan 34 contoh kalimat dan pembeda fungsi.
- **Listen & Speak** — text-to-speech, mode lambat, sembunyikan teks, terjemahan, dan perekaman suara opsional.
- **Simulator Remote Session** — 17 skenario roleplay berurutan dengan pilihan respons dan penjelasan, termasuk laporan awal, ketersediaan remote, jaringan, PSU, eskalasi, dan handover.
- **Progres & Review** — statistik dari data nyata, grafik 14 hari, jadwal review, riwayat, dan reset dengan konfirmasi.
- **Pengaturan** — suara Inggris, kecepatan bicara, target harian, dan informasi penyimpanan lokal.

### Keselamatan

Materi keselamatan menekankan **LOTO (lockout/tagout)**, **work permit**, koordinasi dengan tim operasi, dan prosedur yang disetujui. Izin dari engineer remote tidak pernah digambarkan sebagai pengganti prosedur keselamatan: untuk pekerjaan berisiko, konfirmasi isolasi energi dan tegangan nol sebelum bertindak.

### Spaced repetition

- **Again** — muncul lagi di sesi yang sama; jadwal tetap jatuh tempo.
- **Difficult** — review besok.
- **Easy** — 3, 7, 15, 34, lalu 60 hari.
- **Dikuasai** — butuh 4 recall sukses berturut-turut dan interval minimal 14 hari.

Label tombol berubah menjadi Again/Difficult/Easy, tetapi kunci penyimpanan (`again`/`hard`/`good`) dan riwayat lama tidak berubah, sehingga progres pengguna tetap terbaca.

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

Pemeriksaan menjalankan 22 cek: 25 kategori, 198 frasa, 107 frasa tambahan wajib, placeholder `[time]`/`[name]`, keunikan ID dan teks, kelengkapan terjemahan, 8 pola pertanyaan dengan 34 contoh, 17 skenario dengan tepat satu jawaban benar, aturan keselamatan LOTO/work permit, berkas deployment, serta perhitungan jadwal spaced repetition. Tidak ada dependensi yang dipasang.

## Struktur

```text
index.html                 shell, navigasi, dialog, toast
styles.css                 design system dan seluruh tampilan responsif
js/app.js                  router hash, navigasi, status penyimpanan
js/data.js                 kategori, frasa, dialog, skenario, pola pertanyaan
js/expansion.js            paket 107 frasa, 11 kategori, 6 skenario baru
js/store.js                localStorage berversi, statistik, reset
js/srs.js                  penjadwalan review dan aturan mastery
js/speech.js               Web Speech API dan pemilihan suara en-US
js/ui.js                   komponen bersama (toast, dialog, progres)
js/utils.js                tanggal, format, pencarian, escape HTML
js/icons.js                ikon SVG inline
js/views/                  satu modul per halaman, termasuk patterns.js
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
