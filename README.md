# Small Steps English

Aplikasi web belajar bahasa Inggris pemula. Aplikasi menampilkan latihan di browser. Audio asli diputar dari situs sumber jika stream resmi tersedia; audio public domain disimpan di repo agar bisa diputar tanpa meninggalkan halaman.

## Versi daring

**https://satudjiwa.github.io/english-learning-app/**

Situs dipublikasikan otomatis oleh GitHub Pages setiap kali ada push ke branch `main` (workflow `.github/workflows/pages.yml`). Tidak ada proses build — repo ini berisi file statis apa adanya.

## Menjalankan di komputer

Di terminal, masuk ke folder ini lalu jalankan:

```bash
python3 -m http.server 8080
```

Buka <http://localhost:8080>. Hentikan server dengan `Ctrl+C`.

Server lokal diperlukan karena aplikasi memuat data materi lewat `fetch()` dan service worker menyimpan kerangka aplikasi untuk dibuka kembali. Sebagian besar audio asli tetap membutuhkan koneksi internet; audio VOA public domain tersedia lokal di `audio/`.

## Struktur data

Data materi **tidak ditulis di dalam `app.js`**. Alurnya:

```
materi hasil scrape BrowserOS neo
   └─► ~/outputs/english_learning_library_mvp/materials.json   ← raw store, sumber acuan
          └─► node ~/sync_materials_to_app.mjs
                 └─► english-learning-app/lessons.json          ← dimuat aplikasi saat runtime
```

Modul rencana baca memakai alur terpisah dan tidak melewati sync:

```
english-learning-app/reading-plan.json   ← ditulis manual, divalidasi app.js saat dimuat
```

- `materials.json` di raw store berisi materi lengkap: isi pelajaran, catatan tata bahasa, latihan, roleplay, plus metadata riset (level CEFR sumber, URL audio, durasi, catatan verifikasi).
- `lessons.json` di repo ini adalah salinan yang sudah divalidasi dan siap dimuat browser. **Jangan menyuntingnya langsung** — ubah raw store lalu jalankan perintah sinkronisasi di atas.
- `app.js` memuat `lessons.json`, memvalidasi tiap materi, lalu menampilkannya lewat UI. Materi yang tidak valid dilewati dengan pesan di console, bukan membuat aplikasi gagal tampil.

### Izin penyematan media

`materials.json` punya tiga gerbang di `research`, yang menentukan apa yang boleh tampil di dalam aplikasi:

| Gerbang | Arti | Terisi untuk |
|---|---|---|
| `audio_embed_allowed` | File MP3 resmi tersedia untuk diputar di aplikasi | 37 materi British Council (remote) + 1 materi VOA (lokal, public domain) |
| `frame_embed_allowed` | Halaman sumber boleh ditampilkan dalam iframe | Tidak ada untuk Randall's ESL Lab; syarat situs melarang penyematan audio/teks di aplikasi lain |
| `transcript_embed_allowed` | Teks transkrip boleh disalin ke aplikasi | 1 materi VOA public domain; **tidak ada** untuk sumber all-rights-reserved |

Ubah nilainya hanya setelah menguji sendiri dari origin `satudjiwa.github.io`; `audio_url`, `local_audio_url`, dan `frame_url` hanya diteruskan ke aplikasi bila gerbangnya `true`.

### Format teks + audio lengkap

Materi dengan array `sentences` memakai tampilan *reader*: audio asli, daftar kalimat dengan timestamp, terjemahan Indonesia per kalimat, dan penjelasan pola kalimat. Untuk materi seperti ini, `research.local_audio_url` menunjuk ke file audio yang disimpan di `audio/`; sync memakai path lokal itu dan mengabaikan `research.audio_url` (URL sumber asli tetap disimpan untuk provenance).

## Menambah materi

1. Scrape halaman sumber dengan BrowserOS neo dan simpan hasil mentahnya ke `~/outputs/english_learning_library_mvp/scrape/`.
2. Tambahkan objek materi ke `~/outputs/english_learning_library_mvp/materials.json` (atau file `new_materials_*.mjs` di folder yang sama).
3. Sinkronkan:

```bash
node ~/sync_materials_to_app.mjs
```

4. Terbitkan:

```bash
git add -A
git commit -m "Tambah materi <judul>"
git push
```

Workflow GitHub Pages memuat ulang situs otomatis setelah push.

Service worker memakai strategi *network-first* untuk `.json` dan halaman, sehingga materi baru langsung terlihat tanpa menaikkan versi cache. Masih tetap menaikkan `const CACHE` di `sw.js` bila `app.js` atau `styles.css` berubah besar.

## Modul bacaan

Tab **Bacaan** berisi daftar graded reader berjenjang: 10 buku inti A2–B1 dan 4 buku bonus.

- Sumber data: `reading-plan.json` (ditulis manual, tidak lewat sync).
- Isi: `meta` (judul, total kata) dan `books[]` (14 buku: 10 inti + 4 bonus).
- Buku **tidak disalin** ke repo. Setiap kartu hanya menautkan ke halaman English e-Reader, mengikuti pola yang sama seperti materi Randall's ESL Lab.
- Menambah atau mengubah bacaan cukup di `reading-plan.json`; tidak perlu menjalankan `sync_materials_to_app.mjs`. Naikkan `const CACHE` di `sw.js` hanya bila `app.js` atau `styles.css` berubah.

## Materi public domain

Contoh format lengkap tersedia di **VOA01 — Welcome! — Nice to meet you**:

- Sumber: [VOA Learning English, Lesson 1: Welcome!](https://learningenglish.voanews.com/a/lets-learn-english-lesson-one/3111026.html)
- Lisensi: public domain — VOA menyatakan seluruh teks, audio, dan video yang diproduksi VOA berada di domain publik ([Terms of Use](https://learningenglish.voanews.com/p/6021.html)).
- Isi: percakapan 30 detik, 2 pembicara (Pete dan Anna), 18 kalimat dengan timestamp, audio asli, terjemahan Indonesia per kalimat, dan penjelasan pola kalimat.
- Audio: `audio/voa-lesson1-welcome.mp3` (mono, 96 kbps, 30,0 detik). File sumber 29,56 detik dinormalisasi loudness-nya dan ditambah 0,5 detik keheningan di akhir; isi percakapan tidak diubah.
- Teks lengkap disalin karena lisensinya memungkinkan. Tetap cantumkan atribusi ke VOA.

## Fitur

- 69 materi: 26 percakapan sehari-hari, 23 workplace, dan 20 fokus listening.
- **Bacaan berjenjang**: 10 graded reader A2–B1 (±58.800 kata) + 4 buku bonus, dengan level, jumlah kata, dan tautan ke sumber.
- Alur Listen → Understand → Repeat → Use → Review.
- **Tampilan reader untuk materi public domain**: teks per kalimat, audio asli dengan highlight, replay per kalimat, toggle terjemahan, dan pola kalimat. VOA01 menjadi pilot format ini.
- **Rekaman asli digunakan.** 37 materi British Council memiliki pemutar MP3 langsung dari server sumber. 29 materi Randall's ESL Lab membuka pemutar di halaman resmi karena ketentuan situs melarang penyematan. 2 materi ESLyes juga hanya menautkan ke halaman resmi karena audio dan transkripnya berstatus all rights reserved. 1 materi VOA public domain menyimpan audio di repo. Audio sumber berhak cipta tidak diunduh atau disimpan ulang.
- Tombol ▶ pada tiap kalimat di materi klasik membacakan kalimat latihan dengan text-to-speech perangkat. Di tampilan reader, tombol ▶ memutar rekaman asli dari titik kalimat itu.
- Transkrip resmi dibuka lewat halaman sumber untuk materi berhak cipta; aplikasi tidak menyalin teks lengkap mereka. Untuk VOA public domain, teks lengkap ditampilkan di dalam reader.
- Catatan tata bahasa per kalimat, maksimal empat kosakata kunci, satu latihan isian, dan satu latihan bicara (roleplay).
- Progres tersimpan di local storage browser dan review bersela pada hari ke-1, 3, 7, 14, dan 28.
- Layout responsif untuk laptop dan ponsel; aplikasi dapat dipasang dari browser yang mendukung PWA.

## Catatan sumber

Audio asli diputar dari URL streaming pada situs pemilik untuk materi yang sudah diverifikasi tersedia. Berkas dari sumber berhak cipta tidak diunduh atau disimpan ulang; satu-satunya audio yang disimpan di repo adalah VOA public domain (`VOA01`).

Untuk materi Randall's ESL Lab, [Terms of Use](https://www.esl-lab.com/copyright_terms/) melarang materi situs "reproduced, copied, recorded, stored, modified, republished, downloaded, or distributed" tanpa izin tertulis; yang diizinkan hanya penggunaan online untuk belajar pribadi dan mencetak transkrip untuk dipakai offline pribadi. Karena itu rekaman dan transkripnya **tidak** ditampilkan di dalam aplikasi — hanya ditautkan ke sumbernya. Serupa, halaman British Council mengirim `X-Frame-Options: SAMEORIGIN` dan tidak mengizinkan CORS, sehingga transkripnya pun tidak bisa ditampilkan di dalam aplikasi.

Untuk dua materi ESLyes (*I Live in Pasadena* dan *Red Ball on the Floor*), audio dan transkrip lengkap tidak disalin. Halaman sumber mencantumkan “Copyright © Mike Carlson. All rights reserved.”; aplikasi hanya menampilkan tiga kalimat latihan pendek dan menautkan ke pemutar resmi.

Untuk VOA01, audio dan teks disalin karena VOA menyatakan materi yang diproduksi VOA berada di domain publik. Atribusi: *VOA Learning English, Lesson 1: Welcome!* Audio dinormalisasi dan ditambah keheningan di akhir; isi percakapan tidak diubah. Bukti teknis dan kebijakan media tersimpan di `research.media_policy` pada raw store.
