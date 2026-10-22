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
- Kalimat Inggris dengan terjemahan Indonesia dan contoh pengucapan melalui text-to-speech browser.
- Catatan tata bahasa per kalimat, maksimal empat kosakata kunci, satu latihan isian, dan satu latihan bicara (roleplay).
- Progres tersimpan di local storage browser dan review bersela pada hari ke-1, 3, 7, 14, dan 28.
- Layout responsif untuk laptop dan ponsel; aplikasi dapat dipasang dari browser yang mendukung PWA.

## Catatan sumber

Audio dan transkrip lengkap tidak disalin ke aplikasi. Tombol materi dan transkrip membuka halaman sumber resmi. Suara contoh menggunakan fitur text-to-speech perangkat, bukan audio dari situs pelajaran.
