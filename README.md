# English for Service Engineer

Aplikasi latihan bahasa Inggris praktis untuk **service engineer dan teknisi bandara Indonesia**. Materi berfokus pada pekerjaan lapangan dan dukungan remote: melaporkan status awal, menjelaskan masalah, mengikuti instruksi, melakukan pemeriksaan dan perbaikan, mematuhi keselamatan, melaporkan hasil, serta menyerahkan pekerjaan ke tim berikutnya.

Aplikasi ini statis, tanpa akun, tanpa backend, dan tanpa API berbayar. Seluruh progres belajar disimpan di `localStorage` perangkat.

**Produksi:** <https://satudjiwa.github.io/english-learning-app/>

## Siklus belajar

`LISTEN → UNDERSTAND → RECALL → SPEAK → REVIEW`

Fitur utama:

- **Beranda** — rekomendasi hari program berikutnya, progres 35 hari, frasa jatuh tempo, dan pintu masuk semua modul.
- **Latihan Harian** — program **35 hari × 5 frasa** (175 frasa) dengan audio, arti, konteks kerja, pola kalimat, 2–3 contoh tambahan, dan prompt latihan untuk setiap frasa. Hari bisa dipilih bebas, diulang, dan diselesaikan tanpa timer atau kunci.
- **Sesi Bebas** — jalur latihan lama di `#/daily/free`: rencana 3–5 frasa per tanggal dari bank frasa, cocok untuk belajar di luar urutan program.
- **Bank Frasa** — 224 kalimat dalam 26 kategori, pencarian dua bahasa, filter kategori dan level (Pemula/Menengah), status review, contoh dialog, dan audio.
- **Latihan Recall** — prompt bahasa Indonesia, jawaban bahasa Inggris, penjelasan singkat, penilaian **Again / Difficult / Easy**, dan penjadwalan ulang. Frasa yang sering dinilai Again atau Difficult didahulukan.
- **Pola Pertanyaan** — 8 pola bertanya (`Can I`, `Could you`, `How do I`, `What is`, `What should I`, `Why is`, `Where is`, `Is it`) dengan 34 contoh kalimat dan pembeda fungsi.
- **Listen & Speak** — text-to-speech, mode lambat, sembunyikan teks, terjemahan, dan perekaman suara opsional.
- **Simulator Remote Session** — 17 skenario roleplay berurutan dengan pilihan respons dan penjelasan, termasuk laporan awal, ketersediaan remote, jaringan, PSU, eskalasi, dan handover.
- **Progres & Review** — statistik dari data nyata, progres program, grafik 14 hari, jadwal review, riwayat, dan reset dengan konfirmasi.
- **Pengaturan** — suara Inggris, kecepatan bicara, target Sesi Bebas, dan informasi penyimpanan lokal.

## Program 35 hari

Program disusun dari frasa yang sudah ada di bank frasa, lalu diberi penjelasan pola per frasa. Setiap hari selalu berisi lima frasa dan setiap frasa memiliki konteks kerja, fokus pola, contoh kalimat tambahan, serta prompt latihan.

| Hari | Fase | Fokus |
| --- | --- | --- |
| 1–11 | Fondasi | Status awal, gejala, kabel, sensor, jaringan, dan hasil pemeriksaan |
| 12–15 | Komunikasi | Klarifikasi, instruksi lambat, bantuan remote, dan ketersediaan engineer |
| 16–20 | Troubleshooting | Mengikuti langkah, melaporkan progres, restart, dan hasilnya |
| 21–25 | Perbaikan | Penggantian PSU, perbaikan kabel, pengujian, dan konfirmasi |
| 26–31 | Pelanggan & perawatan | Dampak operasi, persetujuan, jadwal, downtime, pemantauan, dan inspeksi rutin |
| 32–33 | Laporan & handover awal | Rekomendasi, akar masalah, eskalasi, komitmen pemantauan, dan awal serah terima |
| 34–35 | Handover & penutupan | Briefing tim berikutnya, status terbuka, dan penutupan sesi |

Hari dianggap selesai jika kelima frasanya sudah ditandai. Status ini **dihitung dari `learnedAt` yang sudah ada**, bukan dari field progres baru, sehingga data belajar lama tetap valid dan tidak perlu migrasi. Semua hari bisa dibuka kapan saja; tidak ada kunci tanggal, timer, atau syarat menyelesaikan hari sebelumnya.

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

Pemeriksaan menjalankan 28 cek: 26 kategori, 224 frasa, 107 frasa tambahan wajib, kurikulum 35 hari dengan 175 frasa unik, kelengkapan pola/konteks/contoh/prompt, cakupan frasa pelanggan–handover–perawatan–laporan, placeholder `[time]`/`[name]`, keunikan ID dan teks, kelengkapan terjemahan, 8 pola pertanyaan dengan 34 contoh, 17 skenario dengan tepat satu jawaban benar, aturan keselamatan LOTO/work permit, berkas deployment, serta perhitungan jadwal spaced repetition. Tidak ada dependensi yang dipasang.

## Struktur

```text
index.html                 shell, navigasi, dialog, toast
styles.css                 design system dan seluruh tampilan responsif
js/app.js                  router hash, navigasi, status penyimpanan
js/data.js                 kategori, frasa, dialog, skenario, pola pertanyaan
js/expansion.js            paket 133 frasa, 12 kategori, 6 skenario baru
js/curriculum.js           46 pola kalimat dan kurikulum 35 hari/175 frasa
js/program.js              progres program dari learnedAt, navigasi hari
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
- Progres program 35 hari tidak menambah kunci atau field baru; status hari dihitung dari `learnedAt` pada frasa yang sudah ditandai.
- Rencana Sesi Bebas lama di `state.daily` tetap dibaca dan dibatasi maksimal lima ID.
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
