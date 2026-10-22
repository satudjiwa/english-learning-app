# Small Steps English

Aplikasi web belajar bahasa Inggris pemula. Aplikasi menampilkan latihan di browser dan memutar audio asli dari situs sumber jika stream resmi tersedia.

## Versi daring

**https://satudjiwa.github.io/english-learning-app/**

Situs dipublikasikan otomatis oleh GitHub Pages setiap kali ada push ke branch `main` (workflow `.github/workflows/pages.yml`). Tidak ada proses build — repo ini berisi file statis apa adanya.

## Menjalankan di komputer

Di terminal, masuk ke folder ini lalu jalankan:

```bash
python3 -m http.server 8080
```

Buka <http://localhost:8080>. Hentikan server dengan `Ctrl+C`.

Server lokal diperlukan karena aplikasi memuat data materi lewat `fetch()` dan service worker menyimpan kerangka aplikasi untuk dibuka kembali. Materi audio asli tetap membutuhkan koneksi internet.

## Struktur data

Data materi **tidak ditulis di dalam `app.js`**. Alurnya:

```
materi hasil scrape BrowserOS neo
   └─► ~/outputs/english_learning_library_mvp/materials.json   ← raw store, sumber acuan
          └─► node ~/sync_materials_to_app.mjs
                 └─► english-learning-app/lessons.json          ← dimuat aplikasi saat runtime
```

- `materials.json` di raw store berisi materi lengkap: isi pelajaran, catatan tata bahasa, latihan, roleplay, plus metadata riset (level CEFR sumber, URL audio, durasi, catatan verifikasi).
- `lessons.json` di repo ini adalah salinan yang sudah divalidasi dan siap dimuat browser. **Jangan menyuntingnya langsung** — ubah raw store lalu jalankan perintah sinkronisasi di atas.
- `app.js` memuat `lessons.json`, memvalidasi tiap materi, lalu menampilkannya lewat UI. Materi yang tidak valid dilewati dengan pesan di console, bukan membuat aplikasi gagal tampil.

### Izin penyematan media

`materials.json` punya tiga gerbang di `research`, yang menentukan apa yang boleh tampil di dalam aplikasi:

| Gerbang | Arti | Terisi untuk |
|---|---|---|
| `audio_embed_allowed` | File MP3 boleh diputar langsung dari server sumber | 37 materi British Council — hotlink diizinkan & sudah diuji |
| `frame_embed_allowed` | Halaman sumber boleh ditampilkan dalam iframe | 29 materi Randall's ESL Lab — CDN-nya menolak hotlink, jadi pemutar tampil lewat halaman script |
| `transcript_embed_allowed` | Teks transkrip boleh disalin ke aplikasi | **tidak ada** — transkrip tetap berada di situs sumber |

Ubah nilainya hanya setelah menguji sendiri dari origin `satudjiwa.github.io`; `audio_url` dan `frame_url` hanya diteruskan ke aplikasi bila gerbangnya `true`.

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

## Fitur

- 66 materi: 23 percakapan sehari-hari, 23 workplace, dan 20 fokus listening.
- Alur Listen → Understand → Repeat → Use → Review.
- **Audio asli diputar di dalam aplikasi.** Dua cara, ditentukan server sumber:
  - *British Council* (37 materi): berkas MP3 resmi diputar langsung dari server British Council. Hotlink diizinkan dan sudah diuji.
  - *Randall's ESL Lab* (29 materi): CDN mereka menolak pemutaran dari luar (`403` tanpa `Referer: esl-lab.com`), jadi halaman script resmi ditampilkan di dalam iframe. Audio di dalamnya tetap berbunyi karena referrer-nya tetap halaman aslinya.
  - Tidak ada berkas audio yang diunduh atau disimpan ulang di repo ini.
- Tombol ▶ pada tiap kalimat membacakan kalimat itu dengan text-to-speech perangkat — alat latihan melafalkan, bukan pengganti audio pelajaran.
- Transkrip British Council tidak bisa ditampilkan di dalam aplikasi (`X-Frame-Options: SAMEORIGIN` + tanpa CORS), jadi tautan ke sumbernya tetap dipakai. Pada materi Randall's transkripnya sudah terlihat di panel yang tertanam.
- Catatan tata bahasa per kalimat, maksimal empat kosakata kunci, satu latihan isian, dan satu latihan bicara (roleplay).
- Progres tersimpan di local storage browser dan review bersela pada hari ke-1, 3, 7, 14, dan 28.
- Layout responsif untuk laptop dan ponsel; aplikasi dapat dipasang dari browser yang mendukung PWA.

## Catatan sumber

Audio asli diputar dari URL streaming pada situs pemilik untuk materi yang sudah diverifikasi tersedia; berkas tidak diunduh atau disimpan ulang. Materi Randall’s ESL Lab yang ketentuan penggunaannya tidak mengizinkan penyematan tetap dibuka melalui halaman sumber. Transkrip lengkap tetap berada di situs sumber kecuali ada izin untuk menampilkannya.
