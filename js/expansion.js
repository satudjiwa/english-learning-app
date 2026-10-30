/*
 * Paket konten tambahan untuk Service Engineer.
 *
 * File ini sengaja terpisah dari data.js agar penambahan materi besar tidak
 * mengubah blok konten lama. Semua ID baru bersifat permanen: ID dipakai
 * sebagai kunci progres di localStorage. Jangan mengganti ID yang sudah ada.
 */

export const EXTRA_CATEGORIES = [
  {
    id: "initial-status",
    label: "Status awal di lokasi",
    short: "Status awal",
    icon: "activity",
    level: "Pemula",
    description: "Melaporkan kondisi mesin saat pertama kali tiba di lokasi."
  },
  {
    id: "observations",
    label: "Mengamati kondisi",
    short: "Observasi",
    icon: "search",
    level: "Menengah",
    description: "Menjelaskan tanda fisik, bunyi, suhu, dan hasil pengukuran."
  },
  {
    id: "help-clarification",
    label: "Minta bantuan & klarifikasi",
    short: "Bantuan",
    icon: "help",
    level: "Pemula",
    description: "Meminta instruksi ulang, diagram, atau bantuan teknis."
  },
  {
    id: "remote-availability",
    label: "Ketersediaan bantuan remote",
    short: "Bantuan remote",
    icon: "headset",
    level: "Pemula",
    description: "Menanyakan siapa yang bisa membuka sesi remote."
  },
  {
    id: "following-instructions",
    label: "Mengikuti instruksi",
    short: "Ikuti instruksi",
    icon: "list",
    level: "Pemula",
    description: "Mengonfirmasi langkah, mengirim bukti, dan melaporkan progres."
  },
  {
    id: "checks-repairs",
    label: "Pemeriksaan & perbaikan",
    short: "Perbaikan",
    icon: "wrench",
    level: "Pemula",
    description: "Melaporkan tindakan perbaikan dan hasilnya."
  },
  {
    id: "safety-coordination",
    label: "Keselamatan & koordinasi",
    short: "Keselamatan",
    icon: "shield",
    level: "Menengah",
    description: "LOTO, izin kerja, koordinasi operasi, dan izin tindakan berisiko."
  },
  {
    id: "customer-operations",
    label: "Pelanggan & dampak operasi",
    short: "Pelanggan & operasi",
    icon: "users",
    level: "Menengah",
    description: "Menanyakan dampak operasi, downtime, izin pelanggan, dan jadwal sesi remote."
  },
  {
    id: "reporting-team",
    label: "Laporan ke supervisor",
    short: "Laporan",
    icon: "chart",
    level: "Menengah",
    description: "Menyampaikan hasil, akar masalah, eskalasi, dan pemantauan."
  },
  {
    id: "site-handover",
    label: "Serah terima lokasi",
    short: "Handover",
    icon: "users",
    level: "Menengah",
    description: "Memberi briefing dan menyerahkan pekerjaan ke tim berikutnya."
  },
  {
    id: "preventive-maintenance",
    label: "Perawatan preventif",
    short: "Preventif",
    icon: "calendar",
    level: "Pemula",
    description: "Inspeksi rutin, kebersihan panel, dan rekomendasi penggantian."
  },
  {
    id: "question-patterns",
    label: "Pola pertanyaan",
    short: "Pola tanya",
    icon: "message",
    level: "Menengah",
    description: "Struktur bertanya untuk izin, permintaan, instruksi, dan informasi."
  }
];

export const EXTRA_PHRASES = [
  // ── 1. Status awal di lokasi ─────────────────────────────────────────────
  {
    id: "init-01",
    category: "initial-status",
    en: "I’m on site now.",
    idText: "Saya sudah berada di lokasi sekarang.",
    note: "Konfirmasi lokasi sebelum mulai bekerja. Engineer remote perlu tahu bahwa Anda sudah berada di dekat mesin."
  },
  {
    id: "init-02",
    category: "initial-status",
    en: "I’m checking the machine.",
    idText: "Saya sedang memeriksa mesinnya.",
    note: "Beri tahu tindakan yang sedang berlangsung. Present continuous menunjukkan pekerjaan berjalan saat ini."
  },
  {
    id: "init-03",
    category: "initial-status",
    en: "The machine stopped at around 08:15, and the alarm is still active.",
    idText: "Mesin berhenti sekitar pukul 08.15, dan alarmnya masih aktif.",
    note: "Sebutkan waktu kejadian dan status alarm. \"Around\" dipakai jika waktu tidak tercatat persis."
  },
  {
    id: "init-04",
    category: "initial-status",
    en: "The HMI shows error code E-204.",
    idText: "HMI menampilkan kode error E-204.",
    note: "HMI adalah Human Machine Interface, layar kontrol mesin. Sebutkan kode error persis seperti yang terlihat."
  },
  {
    id: "init-05",
    category: "initial-status",
    en: "The system is running, but it’s very slow.",
    idText: "Sistemnya berjalan, tetapi sangat lambat.",
    note: "Pola \"is running, but ...\" memisahkan kondisi yang masih hidup dari gejala yang bermasalah."
  },
  {
    id: "init-06",
    category: "initial-status",
    en: "I can’t access the server. It doesn’t respond to ping.",
    idText: "Saya tidak bisa mengakses server. Server tidak merespons ping.",
    note: "Dua kalimat pendek: masalah utama, lalu bukti teknis. \"Respond to ping\" adalah frasa umum untuk tes koneksi."
  },
  {
    id: "init-07",
    category: "initial-status",
    en: "The power supply LED is off.",
    idText: "LED catu daya mati.",
    note: "LED mati bisa berarti tidak ada daya masuk, sakelar mati, atau PSU bermasalah. Jangan langsung menyimpulkan sebelum diukur."
  },
  {
    id: "init-08",
    category: "initial-status",
    en: "The LAN link light is blinking, but there’s no connection.",
    idText: "Lampu link LAN berkedip, tetapi tidak ada koneksi.",
    note: "Lampu berkedip menunjukkan ada aktivitas fisik di port, belum tentu koneksi sampai ke server."
  },

  // ── 2. Mengamati kondisi ─────────────────────────────────────────────────
  {
    id: "obs-01",
    category: "observations",
    en: "I can see a burn mark on the connector.",
    idText: "Saya melihat bekas terbakar pada konektor.",
    note: "Tanda terbakar bisa berarti panas berlebih atau koneksi longgar. Jangan menyentuh sebelum daya diisolasi dan prosedur keselamatan dikonfirmasi."
  },
  {
    id: "obs-02",
    category: "observations",
    en: "The cable looks loose at the terminal.",
    idText: "Kabelnya tampak longgar di terminal.",
    note: "Gunakan \"looks\" karena ini pengamatan visual, belum tentu hasil pengukuran."
  },
  {
    id: "obs-03",
    category: "observations",
    en: "There’s an unusual noise coming from the motor.",
    idText: "Ada suara tidak biasa dari motor.",
    note: "Jelaskan sumber bunyi jika bisa. \"Coming from\" menunjukkan asal suara."
  },
  {
    id: "obs-04",
    category: "observations",
    en: "The temperature inside the panel is higher than normal.",
    idText: "Suhu di dalam panel lebih tinggi dari normal.",
    note: "Sebutkan angka jika tersedia, misalnya \"It’s 52 degrees Celsius.\" Jika tidak, bandingkan dengan kondisi normal."
  },
  {
    id: "obs-05",
    category: "observations",
    en: "I measured 24 volts at the input, which is normal.",
    idText: "Saya mengukur 24 volt di input, dan itu normal.",
    note: "\"Measured\" menunjukkan hasil alat ukur. \"Which is normal\" memberi konteks bahwa nilai itu sesuai spesifikasi."
  },
  {
    id: "obs-06",
    category: "observations",
    en: "I measured 0 volts at the output.",
    idText: "Saya mengukur 0 volt di output.",
    note: "Bandingkan input dan output. Jika input normal tetapi output nol, PSU atau jalur keluaran perlu diperiksa."
  },
  {
    id: "obs-07",
    category: "observations",
    en: "There is no voltage at the power supply terminal.",
    idText: "Tidak ada tegangan di terminal catu daya.",
    note: "\"There is no voltage\" adalah pernyataan hasil ukur yang lebih kuat daripada \"the light is off\"."
  },

  // ── 3. Minta bantuan & klarifikasi ───────────────────────────────────────
  {
    id: "help-01",
    category: "help-clarification",
    en: "Could you repeat that more slowly, please?",
    idText: "Bisakah Anda mengulanginya lebih lambat?",
    note: "\"More slowly\" lebih halus daripada meminta engineer berhenti bicara. Gunakan saat instruksi terlalu cepat."
  },
  {
    id: "help-02",
    category: "help-clarification",
    en: "Sorry, I didn’t understand. Could you explain it another way?",
    idText: "Maaf, saya tidak mengerti. Bisakah Anda menjelaskannya dengan cara lain?",
    note: "\"Another way\" meminta penjelasan ulang dengan kata atau contoh berbeda, bukan sekadar pengulangan."
  },
  {
    id: "help-03",
    category: "help-clarification",
    en: "Can you send me the wiring diagram?",
    idText: "Bisakah Anda mengirimkan diagram kabelnya?",
    note: "Diagram membantu memastikan terminal dan kabel yang benar. Sebutkan panel atau mesin yang dimaksud."
  },
  {
    id: "help-04",
    category: "help-clarification",
    en: "Which terminal should I check first?",
    idText: "Terminal mana yang harus saya periksa dulu?",
    note: "\"Which terminal\" menanyakan pilihan spesifik. \"First\" membantu engineer memberi urutan pemeriksaan."
  },
  {
    id: "help-05",
    category: "help-clarification",
    en: "Should I restart the server or only the service?",
    idText: "Apakah saya harus memulai ulang server atau hanya layanannya?",
    note: "Pertanyaan ini membedakan restart seluruh server dari restart satu layanan saja. Pilihan yang salah bisa mengganggu pengguna lain."
  },
  {
    id: "help-06",
    category: "help-clarification",
    en: "Is it safe to power off the system now?",
    idText: "Apakah aman mematikan sistem sekarang?",
    note: "Menanyakan keamanan bukan berarti menyerahkan tanggung jawab. Pastikan juga izin operasi dan prosedur shutdown sudah dikonfirmasi."
  },
  {
    id: "help-07",
    category: "help-clarification",
    en: "Could you check the logs from your side?",
    idText: "Bisakah Anda memeriksa log dari sisi Anda?",
    note: "\"From your side\" berarti di sistem atau lokasi engineer remote. Log sering menunjukkan penyebab yang tidak terlihat di lapangan."
  },
  {
    id: "help-08",
    category: "help-clarification",
    en: "Could you check the sensor?",
    idText: "Bisakah Anda memeriksa sensornya?",
    note: "Engineer remote mungkin bisa melihat status sensor di sistem. Tetap periksa kondisi fisik jika diminta."
  },
  {
    id: "help-09",
    category: "help-clarification",
    en: "Could you check the connection?",
    idText: "Bisakah Anda memeriksa koneksinya?",
    note: "Sebutkan koneksi mana: LAN, ke server, atau ke controller. Konteks membuat permintaan lebih jelas."
  },
  {
    id: "help-10",
    category: "help-clarification",
    en: "Could you guide me through the process?",
    idText: "Bisakah Anda menuntun saya melalui prosesnya?",
    note: "\"Guide me through\" berarti meminta langkah demi langkah. Cocok saat pekerjaan baru atau berisiko."
  },
  {
    id: "help-11",
    category: "help-clarification",
    en: "What should I check first?",
    idText: "Apa yang harus saya periksa dulu?",
    note: "Gunakan setelah menjelaskan gejala. Engineer dapat memberi prioritas pemeriksaan yang paling mungkin."
  },
  {
    id: "help-12",
    category: "help-clarification",
    en: "What should I do if the problem persists?",
    idText: "Apa yang harus saya lakukan jika masalahnya berlanjut?",
    note: "\"Persists\" berarti tetap terjadi setelah tindakan. Tanyakan langkah lanjutan sebelum menutup sesi."
  },

  // ── 4. Ketersediaan bantuan remote ───────────────────────────────────────
  {
    id: "avail-01",
    category: "remote-availability",
    en: "Who is available for a remote session?",
    idText: "Siapa yang tersedia untuk sesi remote?",
    note: "Dipakai saat menghubungi tim support dan belum tahu siapa yang bisa membantu."
  },
  {
    id: "avail-02",
    category: "remote-availability",
    en: "Is anyone available to provide remote support?",
    idText: "Apakah ada yang tersedia untuk memberikan dukungan remote?",
    note: "Pertanyaan sopan untuk meminta bantuan tanpa menunjuk orang tertentu."
  },
  {
    id: "avail-03",
    category: "remote-availability",
    en: "Are you available for a remote session?",
    idText: "Apakah Anda tersedia untuk sesi remote?",
    note: "Langsung kepada engineer yang Anda hubungi. Sebutkan perkiraan durasi jika sudah tahu."
  },
  {
    id: "avail-04",
    category: "remote-availability",
    en: "Could someone assist me remotely?",
    idText: "Bisakah seseorang membantu saya secara remote?",
    note: "\"Someone\" membuka pilihan kepada tim, bukan hanya satu engineer."
  },
  {
    id: "avail-05",
    category: "remote-availability",
    en: "Could you start a remote session?",
    idText: "Bisakah Anda memulai sesi remote?",
    note: "Gunakan setelah engineer setuju membantu. Pastikan laptop dan koneksi Anda siap."
  },

  // ── 5. Mengikuti instruksi ───────────────────────────────────────────────
  {
    id: "follow-01",
    category: "following-instructions",
    en: "Understood. I’ll do it now.",
    idText: "Mengerti. Saya akan melakukannya sekarang.",
    note: "Konfirmasi singkat bahwa instruksi dipahami dan segera dilakukan."
  },
  {
    id: "follow-02",
    category: "following-instructions",
    en: "Let me confirm: I should replace the LAN cable, then reboot the switch. Is that correct?",
    idText: "Saya pastikan dulu: saya harus mengganti kabel LAN, lalu memulai ulang switch. Apakah itu benar?",
    note: "Ulangi urutan dengan kata sendiri. Ini mencegah kesalahan saat instruksi panjang atau berisi beberapa langkah."
  },
  {
    id: "follow-03",
    category: "following-instructions",
    en: "I’ve done step 3. What’s next?",
    idText: "Saya sudah menyelesaikan langkah 3. Apa selanjutnya?",
    note: "Sebutkan nomor langkah agar engineer tahu posisi Anda. \"What’s next?\" adalah bentuk pendek dari \"What is next?\""
  },
  {
    id: "follow-04",
    category: "following-instructions",
    en: "I’ll let you know as soon as I finish.",
    idText: "Saya akan memberi tahu Anda segera setelah selesai.",
    note: "\"As soon as\" berarti segera setelah, bukan sebelum pekerjaan selesai."
  },
  {
    id: "follow-05",
    category: "following-instructions",
    en: "Please wait a moment. I’m opening the panel now.",
    idText: "Mohon tunggu sebentar, saya sedang membuka panel.",
    note: "Membuka panel hanya boleh dilakukan dengan izin, work permit, dan prosedur keselamatan yang berlaku."
  },
  {
    id: "follow-06",
    category: "following-instructions",
    en: "I’m sending you a photo of the connector now.",
    idText: "Saya sedang mengirimkan foto konektornya sekarang.",
    note: "Foto membantu engineer melihat kondisi nyata. Pastikan area sensitif tidak ikut terfoto jika tidak diperlukan."
  },
  {
    id: "follow-07",
    category: "following-instructions",
    en: "I’m sharing the screen so you can see the HMI.",
    idText: "Saya sedang membagikan layar agar Anda bisa melihat HMI.",
    note: "\"Share my screen\" adalah frasa umum untuk berbagi tampilan saat sesi remote."
  },
  {
    id: "follow-08",
    category: "following-instructions",
    en: "Could you show me which cable I need to check?",
    idText: "Bisakah Anda menunjukkan kabel mana yang perlu saya periksa?",
    note: "Minta penunjuk visual atau nomor kabel. Jangan menebak pada panel yang berisi banyak kabel."
  },

  // ── 6. Pemeriksaan & perbaikan ───────────────────────────────────────────
  {
    id: "repair-01",
    category: "checks-repairs",
    en: "I replaced the power supply, and the system is back online.",
    idText: "Saya sudah mengganti catu daya, dan sistem kembali online.",
    note: "Laporkan tindakan dan hasil dalam satu kalimat. \"Back online\" berarti sistem kembali beroperasi."
  },
  {
    id: "repair-02",
    category: "checks-repairs",
    en: "I reseated the connector, but the problem is still there.",
    idText: "Saya sudah memasang kembali konektornya, tetapi masalahnya masih ada.",
    note: "Pola \"I ..., but ...\" sangat berguna untuk melaporkan usaha yang belum berhasil."
  },
  {
    id: "repair-03",
    category: "checks-repairs",
    en: "I tightened all the terminal screws.",
    idText: "Saya sudah mengencangkan semua sekrup terminal.",
    note: "Gunakan past tense karena tindakan sudah selesai. Sebutkan jika ada sekrup yang rusak."
  },
  {
    id: "repair-04",
    category: "checks-repairs",
    en: "I swapped the LAN cable, and the connection is stable now.",
    idText: "Saya sudah menukar kabel LAN, dan koneksinya stabil sekarang.",
    note: "\"Swapped\" berarti menukar dengan kabel lain. \"Stable\" menunjukkan koneksi tidak putus-putus."
  },
  {
    id: "repair-05",
    category: "checks-repairs",
    en: "The service is running again after the restart.",
    idText: "Layanannya berjalan lagi setelah restart.",
    note: "Bedakan \"service\" (layanan/aplikasi) dari \"server\" (perangkat). Ini penting saat melapor."
  },
  {
    id: "repair-06",
    category: "checks-repairs",
    en: "I’m running a test now to make sure it works properly.",
    idText: "Saya sedang menjalankan tes sekarang untuk memastikan semuanya bekerja dengan baik.",
    note: "\"Make sure\" berarti memastikan. \"Properly\" berarti sesuai fungsi yang seharusnya."
  },
  {
    id: "repair-07",
    category: "checks-repairs",
    en: "It looks like the problem was caused by a loose cable.",
    idText: "Sepertinya masalahnya disebabkan oleh kabel yang longgar.",
    note: "\"Looks like\" menunjukkan dugaan berdasarkan bukti, bukan kepastian. Engineer dapat memverifikasi."
  },
  {
    id: "repair-08",
    category: "checks-repairs",
    en: "I’ve checked the cable and the power supply.",
    idText: "Saya sudah memeriksa kabel dan catu dayanya.",
    note: "Sebutkan apa saja yang sudah diperiksa agar engineer tidak mengulang langkah yang sama."
  },
  {
    id: "repair-09",
    category: "checks-repairs",
    en: "Everything looks normal now.",
    idText: "Semuanya tampak normal sekarang.",
    note: "Gunakan \"looks normal\" jika baru berdasarkan pengamatan. Tambahkan hasil tes jika ingin lebih kuat."
  },
  {
    id: "repair-10",
    category: "checks-repairs",
    en: "The test passed.",
    idText: "Tesnya lulus.",
    note: "Bentuk singkat dan jelas. \"Passed\" berarti hasil tes memenuhi kriteria."
  },
  {
    id: "repair-11",
    category: "checks-repairs",
    en: "The test failed.",
    idText: "Tesnya gagal.",
    note: "Jangan menyembunyikan hasil gagal. Sertakan kode error atau langkah yang gagal jika ada."
  },
  {
    id: "repair-12",
    category: "checks-repairs",
    en: "We need to run another test.",
    idText: "Kita perlu menjalankan tes lain.",
    note: "\"Another test\" berarti satu tes tambahan, bukan mengulang tes yang sama. Gunakan \"the test again\" untuk mengulang."
  },

  // ── 7. Keselamatan & koordinasi ──────────────────────────────────────────
  {
    id: "safe-01",
    category: "safety-coordination",
    en: "I need to lock out the machine before I start working.",
    idText: "Saya perlu melakukan lockout pada mesin sebelum mulai bekerja.",
    note: "Lockout/tagout (LOTO) mengisolasi sumber energi dan mengunci peralatan agar tidak dinyalakan saat diperbaiki."
  },
  {
    id: "safe-02",
    category: "safety-coordination",
    en: "Please stop the operation until the work is finished.",
    idText: "Mohon hentikan operasi sampai pekerjaan selesai.",
    note: "Koordinasikan dengan tim operasi sebelum menghentikan proses yang sedang berjalan."
  },
  {
    id: "safe-03",
    category: "safety-coordination",
    en: "I need a work permit before I can open the panel.",
    idText: "Saya perlu izin kerja sebelum bisa membuka panel.",
    note: "Work permit adalah dokumen izin resmi. Izin lisan dari engineer remote tidak menggantikannya."
  },
  {
    id: "safe-04",
    category: "safety-coordination",
    en: "I need to coordinate with the operations team to take the system offline.",
    idText: "Saya perlu berkoordinasi dengan tim operasi untuk mematikan sistem.",
    note: "Mematikan sistem bisa memengaruhi operasi bandara. Pastikan waktu dan dampaknya disetujui."
  },
  {
    id: "safe-05",
    category: "safety-coordination",
    en: "I’ll need about one hour to fix this.",
    idText: "Saya perlu sekitar satu jam untuk memperbaikinya.",
    note: "Beri perkiraan waktu yang realistis. \"About\" menunjukkan perkiraan, bukan janji pasti."
  },
  {
    id: "safe-06",
    category: "safety-coordination",
    en: "We need a spare part, and I’ll check the stock.",
    idText: "Kita perlu suku cadang, dan saya akan memeriksa stoknya.",
    note: "Sebutkan nama dan nomor part jika tersedia agar tim lain bisa menyiapkan pengganti."
  },
  {
    id: "safe-07",
    category: "safety-coordination",
    en: "Is it safe to restart the machine?",
    idText: "Apakah aman memulai ulang mesin?",
    note: "Jawaban \"yes\" saja tidak cukup. Konfirmasi prosedur restart, kondisi mesin, dan izin operasi."
  },
  {
    id: "safe-08",
    category: "safety-coordination",
    en: "Can I disconnect this cable?",
    idText: "Bolehkah saya melepas kabel ini?",
    note: "Izin engineer bukan pengganti LOTO, work permit, atau pemeriksaan tegangan nol. Pastikan prosedur isolasi sudah dijalankan."
  },
  {
    id: "safe-09",
    category: "safety-coordination",
    en: "Can I replace the PSU?",
    idText: "Bolehkah saya mengganti PSU?",
    note: "Izin untuk mengganti bukan berarti pekerjaan otomatis aman. Wajib ikuti LOTO, work permit, dan verifikasi tegangan nol sesuai prosedur yang disetujui."
  },
  {
    id: "safe-10",
    category: "safety-coordination",
    en: "Can I run the test again?",
    idText: "Bolehkah saya menjalankan tesnya lagi?",
    note: "Pastikan mesin dalam kondisi aman dan koordinasikan dengan operasi sebelum tes yang menggerakkan peralatan."
  },

  // ── 8. Pelanggan & dampak operasi ────────────────────────────────────────
  {
    id: "cust-01",
    category: "customer-operations",
    en: "Will the remote session affect normal operations?",
    idText: "Apakah sesi remote akan memengaruhi operasi normal?",
    note: "Tanyakan dampaknya sebelum sesi dimulai. Sesi remote sendiri belum tentu menghentikan mesin, tetapi langkah troubleshooting bisa berdampak pada operasi."
  },
  {
    id: "cust-02",
    category: "customer-operations",
    en: "Will the machine need to be stopped during the session?",
    idText: "Apakah mesin perlu dihentikan selama sesi?",
    note: "Bedakan antara sesi remote dan penghentian mesin. Hanya hentikan mesin jika prosedur dan izin operasi sudah disetujui."
  },
  {
    id: "cust-03",
    category: "customer-operations",
    en: "Can we perform the remote session while the machine is running?",
    idText: "Bisakah kita melakukan sesi remote saat mesin sedang berjalan?",
    note: "Pertanyaan ini membuka pilihan kerja tanpa menghentikan mesin. Pastikan langkahnya memang aman dan disetujui, bukan sekadar ingin menghindari downtime."
  },
  {
    id: "cust-04",
    category: "customer-operations",
    en: "Will there be any downtime during the process?",
    idText: "Apakah akan ada downtime selama proses ini?",
    note: "\"Downtime\" adalah waktu sistem tidak tersedia untuk operasi. Sampaikan perkiraan durasi jika sudah diketahui."
  },
  {
    id: "cust-05",
    category: "customer-operations",
    en: "Do we need to take the system offline?",
    idText: "Apakah kita perlu mematikan sistem dari jaringan?",
    note: "\"Take the system offline\" berarti sistem dilepas dari layanan. Koordinasikan dampaknya dengan tim operasi sebelum melakukannya."
  },
  {
    id: "cust-06",
    category: "customer-operations",
    en: "I need to discuss this with the customer.",
    idText: "Saya perlu membahas ini dengan pelanggan.",
    note: "Gunakan saat lingkup pekerjaan atau dampaknya perlu disepakati dengan pelanggan sebelum dilanjutkan."
  },
  {
    id: "cust-07",
    category: "customer-operations",
    en: "I need to get the customer’s approval first.",
    idText: "Saya perlu mendapatkan persetujuan pelanggan terlebih dahulu.",
    note: "Persetujuan pelanggan untuk dampak operasi berbeda dari izin keselamatan. Keduanya bisa diperlukan untuk pekerjaan yang sama."
  },
  {
    id: "cust-08",
    category: "customer-operations",
    en: "Let me check with the customer first.",
    idText: "Saya cek dulu dengan pelanggan.",
    note: "Kalimat singkat untuk menunda keputusan sampai kondisi pelanggan dikonfirmasi."
  },
  {
    id: "cust-09",
    category: "customer-operations",
    en: "I need to coordinate with the operations team.",
    idText: "Saya perlu berkoordinasi dengan tim operasi.",
    note: "Koordinasi umum dengan tim operasi. Untuk mematikan sistem, gunakan kalimat yang lebih spesifik seperti pada kategori keselamatan."
  },
  {
    id: "cust-10",
    category: "customer-operations",
    en: "The customer needs to approve the downtime.",
    idText: "Pelanggan perlu menyetujui downtime-nya.",
    note: "Downtime yang disetujui pelanggan tetap harus mengikuti prosedur operasi dan keselamatan di lokasi."
  },
  {
    id: "cust-11",
    category: "customer-operations",
    en: "I’ll inform the customer before we start.",
    idText: "Saya akan memberi tahu pelanggan sebelum kita mulai.",
    note: "Beri tahu pelanggan tentang waktu, dampak, dan langkah yang akan dilakukan."
  },
  {
    id: "cust-12",
    category: "customer-operations",
    en: "We need permission before proceeding.",
    idText: "Kita perlu izin sebelum melanjutkan.",
    note: "Sebutkan izin apa yang dimaksud: izin operasi, persetujuan pelanggan, work permit, atau otorisasi teknis."
  },
  {
    id: "cust-13",
    category: "customer-operations",
    en: "When can we start the remote session?",
    idText: "Kapan kita bisa memulai sesi remote?",
    note: "Gunakan untuk menyepakati waktu yang tidak mengganggu operasi dan tersedia bagi engineer remote."
  },
  {
    id: "cust-14",
    category: "customer-operations",
    en: "How long will the remote session take?",
    idText: "Berapa lama sesi remote akan berlangsung?",
    note: "Perkiraan waktu membantu tim operasi menyiapkan celah operasi. Hindari menjanjikan waktu pasti jika belum tahu."
  },
  {
    id: "cust-15",
    category: "customer-operations",
    en: "Can we schedule the session after operating hours?",
    idText: "Bisakah kita menjadwalkan sesi setelah jam operasi?",
    note: "Pilihan yang baik jika pekerjaan membutuhkan mesin berhenti. Pastikan izin dan pengawasan tetap tersedia."
  },
  {
    id: "cust-16",
    category: "customer-operations",
    en: "We have a limited time window for this work.",
    idText: "Kita punya waktu terbatas untuk pekerjaan ini.",
    note: "\"Time window\" adalah rentang waktu yang disetujui. Jangan mempersingkat prosedur keselamatan karena waktu terbatas."
  },
  {
    id: "cust-17",
    category: "customer-operations",
    en: "Before we proceed, I need to confirm this with the customer.",
    idText: "Sebelum kita lanjut, saya perlu mengonfirmasi ini dengan pelanggan.",
    note: "Konfirmasi ulang jika ada perubahan langkah, dampak, atau waktu."
  },
  {
    id: "cust-18",
    category: "customer-operations",
    en: "The machine is currently in operation.",
    idText: "Mesin saat ini sedang beroperasi.",
    note: "Informasi penting sebelum engineer meminta langkah yang dapat menghentikan atau mengganggu mesin."
  },
  {
    id: "cust-19",
    category: "customer-operations",
    en: "We cannot stop the machine at the moment.",
    idText: "Kita tidak bisa menghentikan mesin saat ini.",
    note: "Sampaikan kendala operasi dengan jelas, lalu tanyakan langkah aman yang tidak memerlukan penghentian mesin."
  },
  {
    id: "cust-20",
    category: "customer-operations",
    en: "Could we do this step without interrupting operations?",
    idText: "Bisakah kita melakukan langkah ini tanpa mengganggu operasi?",
    note: "Gunakan hanya jika langkah tersebut memang aman dilakukan saat mesin berjalan. Jangan melewati prosedur keselamatan demi menghindari gangguan."
  },
  {
    id: "cust-21",
    category: "customer-operations",
    en: "Please let me know before restarting the system.",
    idText: "Tolong beri tahu saya sebelum memulai ulang sistem.",
    note: "Restart dapat memengaruhi operasi. Mintalah konfirmasi sebelum engineer remote melakukannya dari sisi mereka."
  },
  {
    id: "cust-22",
    category: "customer-operations",
    en: "I’ll proceed once we get the customer’s approval.",
    idText: "Saya akan melanjutkan setelah kita mendapat persetujuan pelanggan.",
    note: "Persetujuan pelanggan belum tentu cukup untuk pekerjaan berisiko; pastikan izin keselamatan dan prosedur teknis juga siap."
  },
  {
    id: "cust-23",
    category: "customer-operations",
    en: "We haven’t noticed any impact on operations.",
    idText: "Kami belum melihat dampak pada operasi.",
    note: "\"Haven’t noticed\" berarti belum terlihat, bukan jaminan tidak ada dampak. Tetap pantau setelah pekerjaan."
  },
  {
    id: "cust-24",
    category: "customer-operations",
    en: "I’ll monitor the machine after the session.",
    idText: "Saya akan memantau mesin setelah sesi.",
    note: "Pemantauan setelah perubahan penting untuk memastikan masalah tidak muncul kembali."
  },
  {
    id: "cust-25",
    category: "customer-operations",
    en: "I’ll update the customer on the results.",
    idText: "Saya akan memberi tahu pelanggan tentang hasilnya.",
    note: "Sertakan status mesin, hasil tes, dan langkah berikutnya dalam update."
  },
  {
    id: "cust-26",
    category: "customer-operations",
    en: "The machine is ready to return to normal operation.",
    idText: "Mesin siap dikembalikan ke operasi normal.",
    note: "Gunakan setelah tes selesai dan kondisi mesin dikonfirmasi aman oleh pihak yang berwenang."
  },

  // ── 9. Laporan ke supervisor ─────────────────────────────────────────────
  {
    id: "report-01",
    category: "reporting-team",
    en: "The issue has been resolved, and the machine is in normal operation.",
    idText: "Masalahnya sudah teratasi, dan mesin beroperasi normal.",
    note: "Kalimat laporan formal. \"In normal operation\" lebih tepat daripada \"normal\" saja untuk status mesin."
  },
  {
    id: "report-02",
    category: "reporting-team",
    en: "The root cause is a faulty power supply.",
    idText: "Akar masalahnya adalah catu daya yang rusak.",
    note: "\"Root cause\" berarti penyebab dasar, bukan gejala. Pastikan sudah diverifikasi sebelum melapor."
  },
  {
    id: "report-03",
    category: "reporting-team",
    en: "This needs further investigation, so I’m escalating it.",
    idText: "Ini perlu penyelidikan lebih lanjut, jadi saya mengeskalasinya.",
    note: "Eskalasi bukan kegagalan. Sampaikan apa yang sudah dicoba dan data yang sudah dikumpulkan."
  },
  {
    id: "report-04",
    category: "reporting-team",
    en: "I’ll prepare the report after the test.",
    idText: "Saya akan menyiapkan laporannya setelah tes.",
    note: "Laporan yang baik berisi gejala, tindakan, hasil tes, dan rekomendasi."
  },
  {
    id: "report-05",
    category: "reporting-team",
    en: "I’ll monitor it for one more hour to make sure it stays stable.",
    idText: "Saya akan memantaunya selama satu jam lagi untuk memastikan tetap stabil.",
    note: "Pemantauan setelah perbaikan penting untuk memastikan masalah tidak muncul kembali."
  },
  {
    id: "report-06",
    category: "reporting-team",
    en: "I’ll let you know if the problem happens again.",
    idText: "Saya akan memberi tahu Anda jika masalahnya terjadi lagi.",
    note: "Janji untuk melapor kembali. Catat waktu dan gejala jika masalah berulang."
  },
  {
    id: "report-07",
    category: "reporting-team",
    en: "I’ll call you back if the problem comes back.",
    idText: "Saya akan menelepon Anda kembali jika masalahnya muncul lagi.",
    note: "\"Comes back\" adalah frasa percakapan untuk masalah yang berulang."
  },

  // ── 9. Serah terima lokasi ───────────────────────────────────────────────
  {
    id: "handover-01",
    category: "site-handover",
    en: "I’ll leave the site at [time].",
    idText: "Saya akan meninggalkan lokasi pada [time].",
    note: "Ganti [time] dengan waktu sebenarnya, misalnya \"4 PM\". Sebutkan zona waktu jika tim berada di lokasi lain."
  },
  {
    id: "handover-02",
    category: "site-handover",
    en: "Team [name] will take over after I leave.",
    idText: "Tim [name] akan mengambil alih setelah saya pergi.",
    note: "Ganti [name] dengan nama tim yang benar. Pastikan tim tersebut sudah dikonfirmasi menerima handover."
  },
  {
    id: "handover-03",
    category: "site-handover",
    en: "I’ll be leaving the site at [time]. Team [name] will take over and continue the work.",
    idText: "Saya akan meninggalkan lokasi pada [time]. Tim [name] akan mengambil alih dan melanjutkan pekerjaan.",
    note: "Contoh lengkap serah terima: waktu, tim pengganti, dan kelanjutan pekerjaan."
  },
  {
    id: "handover-04",
    category: "site-handover",
    en: "I’ll let the next team know about the current machine status.",
    idText: "Saya akan memberi tahu tim berikutnya tentang status mesin saat ini.",
    note: "\"Let ... know\" berarti memberi informasi. Sebutkan status, risiko, dan langkah yang sudah dilakukan."
  },
  {
    id: "handover-05",
    category: "site-handover",
    en: "I’ll brief the next team before I leave.",
    idText: "Saya akan memberi briefing kepada tim berikutnya sebelum pergi.",
    note: "\"Brief\" sebagai kata kerja berarti memberi ringkasan penting secara singkat."
  },
  {
    id: "handover-06",
    category: "site-handover",
    en: "The machine is still under observation.",
    idText: "Mesin masih dalam pemantauan.",
    note: "Gunakan jika mesin sudah berjalan tetapi belum sepenuhnya terbukti stabil."
  },
  {
    id: "handover-07",
    category: "site-handover",
    en: "The issue has not been fully resolved yet.",
    idText: "Masalahnya belum sepenuhnya teratasi.",
    note: "\"Fully resolved\" menegaskan bahwa masih ada pekerjaan tersisa. Jangan menggunakan \"resolved\" jika belum tuntas."
  },
  {
    id: "handover-08",
    category: "site-handover",
    en: "The next team needs to continue troubleshooting.",
    idText: "Tim berikutnya perlu melanjutkan troubleshooting.",
    note: "Sebutkan langkah berikutnya yang disarankan agar tim pengganti tidak mulai dari nol."
  },
  {
    id: "handover-09",
    category: "site-handover",
    en: "I’ve informed the next team about the problem.",
    idText: "Saya sudah memberi tahu tim berikutnya tentang masalahnya.",
    note: "Gunakan present perfect karena handover sudah selesai dilakukan."
  },
  {
    id: "handover-10",
    category: "site-handover",
    en: "I’ll leave the site at 4 PM. Team B will take over and continue the work.",
    idText: "Saya akan meninggalkan lokasi pukul 4 sore. Tim B akan mengambil alih dan melanjutkan pekerjaan.",
    note: "Contoh konkret dengan waktu dan nama tim. Ganti \"4 PM\" dan \"Team B\" sesuai situasi sebenarnya."
  },

  // ── 10. Perawatan preventif ──────────────────────────────────────────────
  {
    id: "pm-01",
    category: "preventive-maintenance",
    en: "I’m doing the routine inspection on the control panel.",
    idText: "Saya sedang melakukan inspeksi rutin pada panel kontrol.",
    note: "\"Routine inspection\" berarti pemeriksaan terjadwal, bukan perbaikan karena kerusakan."
  },
  {
    id: "pm-02",
    category: "preventive-maintenance",
    en: "I cleaned the dust from the fan and the filter.",
    idText: "Saya sudah membersihkan debu dari kipas dan filter.",
    note: "Debu pada kipas dan filter dapat menyebabkan panas berlebih. Catat kondisi filter setelah dibersihkan."
  },
  {
    id: "pm-03",
    category: "preventive-maintenance",
    en: "All cable connections are secure, and no damage was found.",
    idText: "Semua koneksi kabel aman, dan tidak ditemukan kerusakan.",
    note: "\"Secure\" berarti terpasang kuat dan tidak longgar. \"No damage was found\" adalah hasil pemeriksaan."
  },
  {
    id: "pm-04",
    category: "preventive-maintenance",
    en: "Next inspection is scheduled for next month.",
    idText: "Inspeksi berikutnya dijadwalkan bulan depan.",
    note: "Sebutkan tanggal jika sudah pasti. \"Scheduled for\" menunjukkan jadwal resmi."
  },
  {
    id: "pm-05",
    category: "preventive-maintenance",
    en: "I recommend replacing this part.",
    idText: "Saya merekomendasikan penggantian bagian ini.",
    note: "\"Recommend\" dipakai untuk saran profesional. Jelaskan alasan dan kondisi part tersebut."
  },

  // ── 11. Pola pertanyaan ──────────────────────────────────────────────────
  {
    id: "qp-can-01",
    category: "question-patterns",
    en: "Can I restart the machine?",
    idText: "Bolehkah saya memulai ulang mesinnya?",
    note: "Pola Can I + verb? untuk meminta izin. Konfirmasi juga apakah mesin sedang digunakan atau ada prosedur khusus."
  },
  {
    id: "qp-can-02",
    category: "question-patterns",
    en: "Can I access the machine remotely?",
    idText: "Bolehkah saya mengakses mesin itu secara remote?",
    note: "Pola yang sama, kali ini untuk akses jarak jauh. Pastikan akun dan izin akses sudah disetujui."
  },
  {
    id: "qp-could-01",
    category: "question-patterns",
    en: "Could you check it from your side?",
    idText: "Bisakah Anda memeriksanya dari sisi Anda?",
    note: "Pola Could you + verb? untuk permintaan sopan. \"From your side\" menunjukkan pemeriksaan dilakukan di sistem engineer."
  },
  {
    id: "qp-how-01",
    category: "question-patterns",
    en: "How do I restart the machine?",
    idText: "Bagaimana cara memulai ulang mesinnya?",
    note: "Pola How do I + verb? untuk menanyakan cara. Jawabannya biasanya berupa urutan langkah."
  },
  {
    id: "qp-how-02",
    category: "question-patterns",
    en: "How do I check the sensor?",
    idText: "Bagaimana cara memeriksa sensornya?",
    note: "Gunakan pola ini saat belum tahu prosedur pemeriksaan yang benar."
  },
  {
    id: "qp-how-03",
    category: "question-patterns",
    en: "How do I access the settings?",
    idText: "Bagaimana cara mengakses pengaturannya?",
    note: "Pola How do I + verb? juga dipakai untuk menu atau pengaturan di aplikasi."
  },
  {
    id: "qp-how-04",
    category: "question-patterns",
    en: "How do I replace the PSU?",
    idText: "Bagaimana cara mengganti PSU-nya?",
    note: "Untuk pekerjaan berisiko, jawaban harus mencakup LOTO, work permit, dan verifikasi tegangan nol."
  },
  {
    id: "qp-how-05",
    category: "question-patterns",
    en: "How do I run the diagnostic test?",
    idText: "Bagaimana cara menjalankan tes diagnostik?",
    note: "\"Run a test\" adalah kolokasi umum. Sebutkan tes mana yang dimaksud."
  },
  {
    id: "qp-what-01",
    category: "question-patterns",
    en: "What is the next step?",
    idText: "Apa langkah berikutnya?",
    note: "Pola What is + noun? untuk menanyakan informasi. \"The next step\" menanyakan satu langkah berikutnya."
  },
  {
    id: "qp-what-02",
    category: "question-patterns",
    en: "What is the error message?",
    idText: "Apa pesan error-nya?",
    note: "Minta teks error persis, bukan hanya kode angkanya."
  },
  {
    id: "qp-what-03",
    category: "question-patterns",
    en: "What is causing the problem?",
    idText: "Apa yang menyebabkan masalahnya?",
    note: "Pola ini menanyakan penyebab. Jawaban yang baik didukung bukti dari pemeriksaan atau log."
  },
  {
    id: "qp-what-04",
    category: "question-patterns",
    en: "What is the status of the test?",
    idText: "Bagaimana status tesnya?",
    note: "Gunakan \"status of the test\" untuk menanyakan apakah tes berjalan, selesai, atau gagal."
  },
  {
    id: "qp-what-05",
    category: "question-patterns",
    en: "What is the problem?",
    idText: "Apa masalahnya?",
    note: "Pertanyaan pembuka yang netral. Setelah itu jelaskan gejala secara spesifik."
  },
  {
    id: "qp-should-01",
    category: "question-patterns",
    en: "What should I check after replacing the PSU?",
    idText: "Apa yang harus saya periksa setelah mengganti PSU?",
    note: "Pola What should I + verb? untuk menanyakan tindakan yang disarankan. Sebutkan konteks pekerjaan agar jawabannya tepat."
  },
  {
    id: "qp-why-01",
    category: "question-patterns",
    en: "Why is the sensor not working?",
    idText: "Mengapa sensornya tidak berfungsi?",
    note: "Pola Why is + subject? untuk menanyakan penyebab. Hindari menebak sebelum ada bukti."
  },
  {
    id: "qp-why-02",
    category: "question-patterns",
    en: "Why is the machine offline?",
    idText: "Mengapa mesinnya offline?",
    note: "\"Offline\" berarti tidak terhubung ke sistem atau jaringan, belum tentu mesin mati total."
  },
  {
    id: "qp-why-03",
    category: "question-patterns",
    en: "Why is the test taking so long?",
    idText: "Mengapa tesnya memakan waktu begitu lama?",
    note: "Pola Why is + subject + verb-ing? untuk proses yang sedang berlangsung."
  },
  {
    id: "qp-where-01",
    category: "question-patterns",
    en: "Where is the power supply?",
    idText: "Di mana catu dayanya?",
    note: "Pola Where is + noun? untuk menanyakan lokasi komponen."
  },
  {
    id: "qp-where-02",
    category: "question-patterns",
    en: "Where is the LAN port?",
    idText: "Di mana port LAN-nya?",
    note: "Sebutkan panel atau perangkat jika ada beberapa port LAN."
  },
  {
    id: "qp-where-03",
    category: "question-patterns",
    en: "Where can I find the configuration settings?",
    idText: "Di mana saya bisa menemukan pengaturan konfigurasinya?",
    note: "Pola Where can I find ...? lebih tepat untuk menu atau pengaturan di dalam aplikasi."
  },
  {
    id: "qp-is-01",
    category: "question-patterns",
    en: "Is it connected properly?",
    idText: "Apakah koneksinya sudah benar?",
    note: "Pola Is it + adjective? untuk konfirmasi. Jawab dengan yes/no lalu tambahkan bukti, misalnya lampu link menyala."
  },
  {
    id: "qp-is-02",
    category: "question-patterns",
    en: "Is the machine working now?",
    idText: "Apakah mesinnya sudah berjalan sekarang?",
    note: "Pola Is the + noun + ...? untuk menanyakan kondisi saat ini."
  },
  {
    id: "qp-is-03",
    category: "question-patterns",
    en: "Is the test complete?",
    idText: "Apakah tesnya sudah selesai?",
    note: "\"Complete\" menanyakan status proses, bukan hasil lulus atau gagal."
  }
];

/*
 * Pola pertanyaan untuk modul pengajaran.
 * `examples` berisi ID frasa yang sudah ada di PHRASES. Satu kalimat hanya
 * disimpan sekali, lalu ditampilkan di beberapa konteks pengajaran.
 */
export const QUESTION_PATTERNS = [
  {
    id: "can-i",
    pattern: "Can I …?",
    label: "Meminta izin",
    function: "permission",
    formula: "Can I + verb + object?",
    explanation: "Gunakan untuk meminta izin melakukan sesuatu. Untuk pekerjaan berisiko, izin saja tidak cukup: konfirmasi LOTO, work permit, dan prosedur yang disetujui.",
    contrast: "Bandingkan dengan Could you…? yang meminta orang lain melakukan sesuatu, bukan meminta izin untuk diri sendiri.",
    examples: ["qp-can-01", "safe-09", "safe-08", "safe-10", "qp-can-02"]
  },
  {
    id: "could-you",
    pattern: "Could you …?",
    label: "Permintaan sopan",
    function: "request",
    formula: "Could you + verb + object?",
    explanation: "Gunakan untuk meminta engineer remote memeriksa, mengirim, atau menjelaskan sesuatu dengan sopan. Could you terdengar lebih halus daripada Can you.",
    contrast: "Can you…? juga benar, tetapi Could you…? lebih sopan dalam percakapan kerja dengan tim yang belum dikenal.",
    examples: ["help-08", "help-09", "help-10", "qp-could-01", "avail-05"]
  },
  {
    id: "how-do-i",
    pattern: "How do I …?",
    label: "Menanyakan cara",
    function: "instruction",
    formula: "How do I + verb + object?",
    explanation: "Gunakan untuk menanyakan cara melakukan langkah teknis. Jawabannya biasanya berupa urutan instruksi.",
    contrast: "What should I…? menanyakan tindakan yang disarankan; How do I…? menanyakan cara melakukannya.",
    examples: ["qp-how-01", "qp-how-02", "qp-how-03", "qp-how-04", "qp-how-05"]
  },
  {
    id: "what-is",
    pattern: "What is …?",
    label: "Menanyakan informasi",
    function: "information",
    formula: "What is + noun / noun phrase?",
    explanation: "Gunakan untuk menanyakan informasi, definisi, atau status. Pertanyaan ini biasanya dijawab dengan fakta singkat.",
    contrast: "What is…? menanyakan informasi; What should I…? menanyakan tindakan.",
    examples: ["qp-what-01", "qp-what-02", "qp-what-03", "qp-what-04", "qp-what-05"]
  },
  {
    id: "what-should-i",
    pattern: "What should I …?",
    label: "Menanyakan tindakan",
    function: "instruction",
    formula: "What should I + verb + object?",
    explanation: "Gunakan untuk menanyakan langkah atau tindakan yang disarankan. Should menunjukkan saran atau langkah yang tepat, bukan kewajiban mutlak.",
    contrast: "How do I…? menanyakan cara; What should I…? menanyakan apa yang sebaiknya dilakukan.",
    examples: ["clar-03", "help-11", "help-12", "qp-should-01"]
  },
  {
    id: "why-is",
    pattern: "Why is …?",
    label: "Menanyakan penyebab",
    function: "information",
    formula: "Why is + subject + …?",
    explanation: "Gunakan untuk menanyakan penyebab masalah. Jika belum yakin, jawab dengan \"It looks like…\" atau \"It may be caused by…\", bukan menebak sebagai fakta.",
    contrast: "Why is…? menanyakan penyebab; What is…? menanyakan informasi atau status.",
    examples: ["qp-why-01", "qp-why-02", "qp-why-03"]
  },
  {
    id: "where-is",
    pattern: "Where is …?",
    label: "Menanyakan lokasi",
    function: "information",
    formula: "Where is + noun?",
    explanation: "Gunakan untuk menanyakan lokasi komponen atau port. Untuk pengaturan di dalam aplikasi, gunakan Where can I find…?",
    contrast: "Where is…? menanyakan lokasi fisik; Where can I find…? menanyakan lokasi menu atau informasi.",
    examples: ["qp-where-01", "qp-where-02", "qp-where-03"]
  },
  {
    id: "is-it",
    pattern: "Is it …?",
    label: "Konfirmasi kondisi",
    function: "confirmation",
    formula: "Is it / Is the + noun + adjective?",
    explanation: "Gunakan untuk memastikan kondisi dengan jawaban ya/tidak. Setelah yes/no, tambahkan bukti atau status yang sebenarnya.",
    contrast: "Is it…? meminta konfirmasi; What is…? meminta informasi terbuka.",
    examples: ["qp-is-01", "safe-07", "qp-is-02", "qp-is-03"]
  }
];

export const EXTRA_SCENARIOS = [
  {
    id: "initial-report",
    title: "Melaporkan masalah pertama kali",
    icon: "alert",
    level: "Pemula",
    intro: "Anda baru tiba di lokasi dan menemukan mesin berhenti dengan alarm aktif. Laporkan kondisi awal kepada engineer remote secara singkat dan berurutan.",
    steps: [
      {
        engineer: { en: "What’s the situation on site?", idText: "Bagaimana situasi di lokasi?" },
        options: [
          { en: "I’m on site now. The machine stopped at around 08:15, and the alarm is still active.", correct: true },
          { en: "The test completed successfully.", correct: false },
          { en: "I’ll leave the site at 4 PM.", correct: false }
        ],
        explanation: "Mulai dengan posisi Anda, waktu kejadian, dan status alarm. Tiga informasi ini langsung memberi konteks."
      },
      {
        engineer: { en: "What does the HMI show?", idText: "Apa yang ditampilkan HMI?" },
        options: [
          { en: "The HMI shows error code E-204.", correct: true },
          { en: "I have a spare PSU.", correct: false },
          { en: "The LAN cable is connected properly.", correct: false }
        ],
        explanation: "Sebutkan kode error persis seperti yang terlihat di layar. Jangan mengganti atau menebak kodenya."
      },
      {
        engineer: { en: "Is the machine running now?", idText: "Apakah mesinnya berjalan sekarang?" },
        options: [
          { en: "The system is running, but it’s very slow.", correct: true },
          { en: "Yes, the test is complete.", correct: false },
          { en: "No, I’m calling from Terminal 3 Jakarta.", correct: false }
        ],
        explanation: "Jawab kondisi sebenarnya. \"Running, but very slow\" memberi informasi lebih berguna daripada hanya \"yes\"."
      },
      {
        engineer: { en: "Thanks. Please check the power supply LED.", idText: "Terima kasih. Tolong periksa LED catu dayanya." },
        options: [
          { en: "Sure. I’ll check it now.", correct: true },
          { en: "The remote session is finished.", correct: false },
          { en: "I’ve sent you the test report.", correct: false }
        ],
        explanation: "Konfirmasi instruksi berikutnya dengan singkat. Setelah memeriksa, laporkan hasilnya."
      }
    ]
  },
  {
    id: "remote-availability",
    title: "Mencari engineer untuk sesi remote",
    icon: "headset",
    level: "Pemula",
    intro: "Anda membutuhkan bantuan remote, tetapi belum tahu siapa yang tersedia. Tanyakan ketersediaan dan siapkan sesi dengan sopan.",
    steps: [
      {
        engineer: { en: "Technical support. How can I help?", idText: "Dukungan teknis. Ada yang bisa saya bantu?" },
        options: [
          { en: "Who is available for a remote session?", correct: true },
          { en: "The test failed again.", correct: false },
          { en: "I’ve cleaned the sensor.", correct: false }
        ],
        explanation: "Tanyakan ketersediaan terlebih dahulu. Sebutkan lokasi dan masalah singkat setelah engineer merespons."
      },
      {
        engineer: { en: "I’m available. Can you connect your laptop?", idText: "Saya tersedia. Bisakah Anda menghubungkan laptop?" },
        options: [
          { en: "Yes. I’m ready when you are.", correct: true },
          { en: "The PSU fan is not spinning.", correct: false },
          { en: "Have a good day.", correct: false }
        ],
        explanation: "Konfirmasi bahwa Anda siap memulai sesi remote."
      },
      {
        engineer: { en: "Please share your screen so I can see the HMI.", idText: "Tolong bagikan layar Anda agar saya bisa melihat HMI." },
        options: [
          { en: "I’m sharing the screen now.", correct: true },
          { en: "I need a work permit.", correct: false },
          { en: "The machine is booting up.", correct: false }
        ],
        explanation: "Beri tahu bahwa layar sedang dibagikan. Pastikan hanya jendela yang relevan yang terlihat."
      },
      {
        engineer: { en: "I can see it. Let’s start with the network status.", idText: "Saya bisa melihatnya. Mari mulai dengan status jaringan." },
        options: [
          { en: "Understood. I’ll follow your steps.", correct: true },
          { en: "Thank you for your help. Goodbye.", correct: false },
          { en: "The sensor has been replaced.", correct: false }
        ],
        explanation: "Konfirmasi bahwa Anda siap mengikuti instruksi engineer."
      }
    ]
  },
  {
    id: "network-troubleshooting",
    title: "Troubleshooting jaringan dan LAN",
    icon: "monitor",
    level: "Menengah",
    intro: "Lampu link LAN berkedip, tetapi mesin tidak bisa terhubung ke server. Engineer menuntun Anda memeriksa kabel dan koneksi.",
    steps: [
      {
        engineer: { en: "What do you see on the LAN port?", idText: "Apa yang Anda lihat di port LAN?" },
        options: [
          { en: "The LAN link light is blinking, but there’s no connection.", correct: true },
          { en: "The test is still running.", correct: false },
          { en: "I’ve completed the checks.", correct: false }
        ],
        explanation: "Lampu berkedip menunjukkan aktivitas fisik, tetapi belum tentu data sampai ke server. Laporkan keduanya."
      },
      {
        engineer: { en: "Please reseat the LAN cable and check the link light.", idText: "Tolong cabut dan pasang kembali kabel LAN, lalu periksa lampu link." },
        options: [
          { en: "Okay, I’ll do that.", correct: true },
          { en: "I have a spare PSU.", correct: false },
          { en: "The sensor is not detecting any movement.", correct: false }
        ],
        explanation: "Konfirmasi instruksi sebelum bertindak. Setelah itu, periksa lampu link dan koneksi."
      },
      {
        engineer: { en: "Any change?", idText: "Apakah ada perubahan?" },
        options: [
          { en: "I reseated the connector, but the problem is still there.", correct: true },
          { en: "The problem has been resolved.", correct: false },
          { en: "I’m calling from Terminal 3 Jakarta.", correct: false }
        ],
        explanation: "Laporkan tindakan dan hasilnya dengan jujur. Jangan menyatakan berhasil jika masalah masih ada."
      },
      {
        engineer: { en: "Try another LAN cable and ping the server.", idText: "Coba kabel LAN lain dan ping server." },
        options: [
          { en: "I swapped the LAN cable, and the connection is stable now.", correct: true },
          { en: "The test failed again.", correct: false },
          { en: "I’ll leave the site at 4 PM.", correct: false }
        ],
        explanation: "Laporkan hasil setelah mengganti kabel. \"Stable\" berarti koneksi tidak putus-putus."
      }
    ]
  },
  {
    id: "psu-safety",
    title: "Ganti PSU dengan prosedur aman",
    icon: "shield",
    level: "Menengah",
    intro: "PSU dicurigai bermasalah. Engineer meminta penggantian, tetapi Anda harus memastikan LOTO, work permit, dan verifikasi tegangan nol sebelum bekerja.",
    steps: [
      {
        engineer: { en: "The power supply LED is off. Could you check the PSU?", idText: "LED catu daya mati. Bisakah Anda memeriksa PSU-nya?" },
        options: [
          { en: "Sure. I’ll check it now.", correct: true },
          { en: "The test passed.", correct: false },
          { en: "I’ll close the remote session now.", correct: false }
        ],
        explanation: "Konfirmasi pemeriksaan awal. Jangan langsung membuka panel atau melepas komponen."
      },
      {
        engineer: { en: "What is the voltage at the output?", idText: "Berapa tegangan di output?" },
        options: [
          { en: "I measured 0 volts at the output.", correct: true },
          { en: "I’ve cleaned the fan.", correct: false },
          { en: "The sensor is working again.", correct: false }
        ],
        explanation: "Sebutkan hasil pengukuran yang relevan. Bandingkan dengan input jika engineer memintanya."
      },
      {
        engineer: { en: "The PSU is faulty. Please replace it.", idText: "PSU-nya bermasalah. Tolong ganti." },
        options: [
          { en: "Before I replace it, can you confirm the lockout and work permit procedure?", correct: true },
          { en: "Yes, I’ll replace it immediately.", correct: false },
          { en: "I don’t need a permit for this.", correct: false }
        ],
        explanation: "Izin untuk mengganti bukan berarti pekerjaan otomatis aman. Konfirmasi LOTO, work permit, dan prosedur isolasi terlebih dahulu."
      },
      {
        engineer: { en: "Yes. Lock out the machine, confirm zero voltage, and follow the approved work permit.", idText: "Ya. Lakukan lockout, pastikan tegangan nol, dan ikuti work permit yang disetujui." },
        options: [
          { en: "Understood. I’ll follow the approved safety procedure first.", correct: true },
          { en: "Okay, I’ll skip the lockout to save time.", correct: false },
          { en: "Can I run the test again?", correct: false }
        ],
        explanation: "Jangan melewati LOTO atau work permit. Prosedur keselamatan harus dijalankan sebelum pekerjaan dimulai."
      },
      {
        engineer: { en: "Let me know when the replacement is complete.", idText: "Beri tahu saya setelah penggantian selesai." },
        options: [
          { en: "I’ve replaced the power supply, and the system is back online.", correct: true },
          { en: "The issue has not been fully resolved yet.", correct: false },
          { en: "Team B will take over after I leave.", correct: false }
        ],
        explanation: "Laporkan tindakan dan hasil akhir. Pastikan mesin benar-benar kembali beroperasi sebelum melapor."
      }
    ]
  },
  {
    id: "escalation",
    title: "Mengeskalasi masalah yang belum selesai",
    icon: "trend-up",
    level: "Menengah",
    intro: "Beberapa tindakan sudah dicoba, tetapi masalah masih berulang. Laporkan hasilnya dan eskalasikan dengan data yang jelas.",
    steps: [
      {
        engineer: { en: "Did the new LAN cable fix the problem?", idText: "Apakah kabel LAN baru menyelesaikan masalahnya?" },
        options: [
          { en: "No, the problem is still there.", correct: true },
          { en: "Yes, the machine is working normally now.", correct: false },
          { en: "The test completed successfully.", correct: false }
        ],
        explanation: "Jawab jujur. Jangan menyatakan berhasil hanya karena satu tes selesai."
      },
      {
        engineer: { en: "Please send me the full error log.", idText: "Tolong kirimkan log error lengkap." },
        options: [
          { en: "I’ll send you the log now. The error message says “Communication timeout.”", correct: true },
          { en: "The sensor has been replaced.", correct: false },
          { en: "I’ll leave the site at 4 PM.", correct: false }
        ],
        explanation: "Sertakan pesan error yang terlihat. Data yang lengkap mempercepat investigasi."
      },
      {
        engineer: { en: "I can’t find the root cause from here. I’ll escalate this to the platform team.", idText: "Saya tidak bisa menemukan akar masalahnya dari sini. Saya akan mengeskalasinya ke tim platform." },
        options: [
          { en: "Understood. I’ll keep the machine under observation and update my supervisor.", correct: true },
          { en: "The machine is working normally now.", correct: false },
          { en: "Thank you. Goodbye.", correct: false }
        ],
        explanation: "Saat masalah belum tuntas, terus pantau mesin dan beri update kepada supervisor. Jangan menutup seolah-olah selesai."
      },
      {
        engineer: { en: "Please monitor it for one more hour.", idText: "Tolong pantau selama satu jam lagi." },
        options: [
          { en: "I’ll monitor it for one more hour to make sure it stays stable.", correct: true },
          { en: "I’ve completed the checks.", correct: false },
          { en: "The test is complete.", correct: false }
        ],
        explanation: "Konfirmasi pemantauan dan janjikan update jika kondisi berubah."
      }
    ]
  },
  {
    id: "site-handover",
    title: "Serah terima ke tim berikutnya",
    icon: "users",
    level: "Menengah",
    intro: "Waktu Anda di lokasi hampir habis, tetapi masalah belum sepenuhnya selesai. Lakukan handover yang jelas kepada tim berikutnya.",
    steps: [
      {
        engineer: { en: "What is the current status before you leave?", idText: "Bagaimana status saat ini sebelum Anda pergi?" },
        options: [
          { en: "The machine is still under observation. The issue has not been fully resolved yet.", correct: true },
          { en: "The issue has been resolved, and the machine is in normal operation.", correct: false },
          { en: "The test completed successfully.", correct: false }
        ],
        explanation: "Sampaikan status sebenarnya. Jika masih ada pekerjaan tersisa, jangan katakan sudah selesai."
      },
      {
        engineer: { en: "Who will continue the work?", idText: "Siapa yang akan melanjutkan pekerjaan?" },
        options: [
          { en: "Team B will take over after I leave.", correct: true },
          { en: "I’ll close the remote session now.", correct: false },
          { en: "The sensor is working again.", correct: false }
        ],
        explanation: "Sebutkan tim pengganti dengan jelas. Pastikan tim tersebut sudah dikonfirmasi."
      },
      {
        engineer: { en: "What time are you leaving?", idText: "Jam berapa Anda pergi?" },
        options: [
          { en: "I’ll leave the site at 4 PM. Team B will take over and continue the work.", correct: true },
          { en: "I’m calling from Terminal 3 Jakarta.", correct: false },
          { en: "The test is still running.", correct: false }
        ],
        explanation: "Contoh handover lengkap: waktu pergi, tim pengganti, dan kelanjutan pekerjaan."
      },
      {
        engineer: { en: "Have you briefed the next team?", idText: "Apakah Anda sudah memberi briefing kepada tim berikutnya?" },
        options: [
          { en: "I’ve informed the next team about the problem and the current machine status.", correct: true },
          { en: "I have a spare PSU.", correct: false },
          { en: "Please reseat the LAN cable in slot zero.", correct: false }
        ],
        explanation: "Konfirmasi bahwa handover sudah dilakukan, termasuk status mesin dan masalah yang tersisa."
      },
      {
        engineer: { en: "Good. Please send a short handover note.", idText: "Bagus. Tolong kirim catatan serah terima singkat." },
        options: [
          { en: "I’ll let the next team know about the current machine status and send the note.", correct: true },
          { en: "The remote session is finished.", correct: false },
          { en: "I’ll restart the machine now.", correct: false }
        ],
        explanation: "Catatan handover harus berisi status, tindakan yang sudah dilakukan, risiko, dan langkah berikutnya."
      }
    ]
  }
];
