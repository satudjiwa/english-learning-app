/*
 * Konten belajar English for Service Engineer.
 *
 * Semua frasa memakai ID stabil. Jangan mengubah ID yang sudah dipakai
 * pengguna karena ID itu tersimpan di localStorage sebagai kunci jadwal review.
 * Jika perlu mengubah teks, pertahankan ID lama atau buat frasa baru.
 */

export const CATEGORIES = [
  {
    id: "starting-session",
    label: "Memulai sesi remote",
    short: "Sesi remote",
    icon: "headset",
    description: "Membuka panggilan dan menyiapkan bantuan jarak jauh."
  },
  {
    id: "explaining-problem",
    label: "Menjelaskan masalah",
    short: "Masalah teknis",
    icon: "alert",
    description: "Menyampaikan gejala masalah dengan jelas dan singkat."
  },
  {
    id: "cables",
    label: "Kabel dan koneksi",
    short: "Kabel",
    icon: "link",
    description: "Memeriksa, melepas, dan memasang kembali kabel."
  },
  {
    id: "sensors",
    label: "Sensor",
    short: "Sensor",
    icon: "radio",
    description: "Memeriksa sensor yang tidak mendeteksi atau salah membaca."
  },
  {
    id: "power",
    label: "Catu daya dan PSU",
    short: "PSU",
    icon: "zap",
    description: "Memeriksa daya, PSU cadangan, dan izin penggantian."
  },
  {
    id: "restart",
    label: "Memulai ulang mesin",
    short: "Restart",
    icon: "rotate",
    description: "Meminta izin, memulai ulang, dan melaporkan hasilnya."
  },
  {
    id: "software-network",
    label: "Perangkat lunak dan jaringan",
    short: "Software & LAN",
    icon: "monitor",
    description: "Membahas IP, koneksi jaringan, dan aplikasi yang bermasalah."
  },
  {
    id: "instructions",
    label: "Mengikuti instruksi",
    short: "Instruksi",
    icon: "list",
    description: "Mengonfirmasi instruksi dan menanyakan langkah berikutnya."
  },
  {
    id: "test-results",
    label: "Melaporkan hasil tes",
    short: "Hasil tes",
    icon: "check-square",
    description: "Melaporkan tes yang selesai, berjalan, lulus, atau gagal."
  },
  {
    id: "delays",
    label: "Menjelaskan keterlambatan",
    short: "Waktu",
    icon: "clock",
    description: "Memberi tahu bahwa pekerjaan masih berlangsung."
  },
  {
    id: "clarification",
    label: "Meminta klarifikasi",
    short: "Klarifikasi",
    icon: "help",
    description: "Meminta pengulangan atau memastikan maksud instruksi."
  },
  {
    id: "status-updates",
    label: "Update status",
    short: "Status",
    icon: "activity",
    description: "Melaporkan posisi, kemajuan, dan kondisi terkini."
  },
  {
    id: "completion",
    label: "Mengonfirmasi selesai",
    short: "Selesai",
    icon: "check-circle",
    description: "Menyatakan pemeriksaan selesai dan mesin kembali normal."
  },
  {
    id: "ending-session",
    label: "Menutup sesi remote",
    short: "Penutup",
    icon: "phone-off",
    description: "Mengakhiri panggilan dengan sopan dan jelas."
  }
];

/*
 * Struktur frasa:
 * - id       : stabil, dipakai sebagai kunci progres
 * - en       : kalimat Inggris lengkap (American English)
 * - idText   : terjemahan Indonesia yang natural (bukan literal)
 * - category : id kategori di atas
 * - note     : kapan kalimat ini dipakai
 * - dialogue : opsional, contoh percakapan singkat
 */
export const PHRASES = [
  // ── 1. Memulai sesi remote ────────────────────────────────────────────────
  {
    id: "rs-01",
    category: "starting-session",
    en: "Good morning. I’m calling from Terminal 3 Jakarta.",
    idText: "Selamat pagi. Saya menelepon dari Terminal 3 Jakarta.",
    note: "Dipakai saat membuka panggilan ke tim support. Sebutkan lokasi dengan jelas agar engineer tahu konteksnya.",
    dialogue: [
      { speaker: "engineer", en: "Good morning, technical support.", idText: "Selamat pagi, dukungan teknis." },
      { speaker: "technician", en: "Good morning. I’m calling from Terminal 3 Jakarta.", idText: "Selamat pagi. Saya menelepon dari Terminal 3 Jakarta." }
    ]
  },
  {
    id: "rs-02",
    category: "starting-session",
    en: "I’m having an issue with the machine.",
    idText: "Saya mengalami masalah pada mesin ini.",
    note: "Pembuka yang netral sebelum menjelaskan detail. Kata \"issue\" lebih umum dan sopan daripada \"problem\".",
    dialogue: [
      { speaker: "engineer", en: "How can I help you?", idText: "Ada yang bisa saya bantu?" },
      { speaker: "technician", en: "I’m having an issue with the machine.", idText: "Saya mengalami masalah pada mesin ini." }
    ]
  },
  {
    id: "rs-03",
    category: "starting-session",
    en: "Could you help me, please?",
    idText: "Bisakah Anda membantu saya?",
    note: "\"Could you\" adalah cara sopan meminta bantuan. Tambahkan \"please\" di akhir untuk nada yang ramah."
  },
  {
    id: "rs-04",
    category: "starting-session",
    en: "Could we start a remote session?",
    idText: "Bisakah kita memulai sesi remote?",
    note: "Gunakan setelah masalah dijelaskan. \"Remote session\" adalah istilah umum untuk bantuan jarak jauh.",
    dialogue: [
      { speaker: "technician", en: "Could we start a remote session?", idText: "Bisakah kita memulai sesi remote?" },
      { speaker: "engineer", en: "Sure. Please connect your laptop to the network.", idText: "Tentu. Silakan hubungkan laptop Anda ke jaringan." }
    ]
  },
  {
    id: "rs-05",
    category: "starting-session",
    en: "I’m ready when you are.",
    idText: "Saya siap saat Anda siap.",
    note: "Menandakan laptop, koneksi, dan Anda sudah siap. Kalimat ini terdengar santai tetapi tetap sopan."
  },
  {
    id: "rs-06",
    category: "starting-session",
    en: "Please give me a moment to connect my laptop.",
    idText: "Tolong beri saya waktu sebentar untuk menghubungkan laptop.",
    note: "Dipakai saat butuh waktu menyiapkan perangkat. \"A moment\" berarti sebentar, bukan waktu yang lama."
  },

  // ── 2. Menjelaskan masalah ───────────────────────────────────────────────
  {
    id: "pr-01",
    category: "explaining-problem",
    en: "The sensor is not working properly.",
    idText: "Sensor tidak berfungsi dengan baik.",
    note: "\"Not working properly\" berarti tidak bekerja sebagaimana mestinya. Lebih spesifik daripada hanya \"rusak\".",
    dialogue: [
      { speaker: "engineer", en: "What seems to be the problem?", idText: "Sepertinya masalahnya apa?" },
      { speaker: "technician", en: "The sensor is not working properly.", idText: "Sensor tidak berfungsi dengan baik." }
    ]
  },
  {
    id: "pr-02",
    category: "explaining-problem",
    en: "The machine stopped working this morning.",
    idText: "Mesin berhenti bekerja pagi ini.",
    note: "Gunakan past simple (\"stopped\") karena kejadiannya sudah terjadi dan waktunya disebutkan."
  },
  {
    id: "pr-03",
    category: "explaining-problem",
    en: "The problem happens every time we start the machine.",
    idText: "Masalah ini terjadi setiap kali kami menyalakan mesin.",
    note: "\"Every time\" menunjukkan masalah berulang, sehingga engineer tahu ini bukan kejadian sekali saja."
  },
  {
    id: "pr-04",
    category: "explaining-problem",
    en: "The error message says ’Communication timeout.’",
    idText: "Pesan kesalahan berbunyi ’Communication timeout’.",
    note: "Sebutkan pesan error persis seperti yang muncul di layar. Jangan menerjemahkan teks error-nya.",
    dialogue: [
      { speaker: "engineer", en: "What does the screen say?", idText: "Apa yang tertulis di layar?" },
      { speaker: "technician", en: "The error message says ’Communication timeout.’", idText: "Pesan kesalahan berbunyi ’Communication timeout’." }
    ]
  },
  {
    id: "pr-05",
    category: "explaining-problem",
    en: "It worked fine yesterday, but not today.",
    idText: "Kemarin mesin berjalan normal, tetapi hari ini tidak.",
    note: "Kalimat ini membantu engineer membandingkan kondisi sebelum dan sesudah masalah muncul."
  },
  {
    id: "pr-06",
    category: "explaining-problem",
    en: "The machine is making an unusual noise.",
    idText: "Mesin mengeluarkan suara yang tidak biasa.",
    note: "\"Unusual noise\" cocok untuk suara aneh yang belum bisa Anda pastikan penyebabnya."
  },

  // ── 3. Kabel dan koneksi ─────────────────────────────────────────────────
  {
    id: "cab-01",
    category: "cables",
    en: "The cable is connected properly.",
    idText: "Kabel sudah terpasang dengan benar.",
    note: "\"Properly\" berarti terpasang pada tempatnya dan terkunci dengan baik, bukan sekadar menempel.",
    dialogue: [
      { speaker: "engineer", en: "Is the cable connected?", idText: "Apakah kabelnya terhubung?" },
      { speaker: "technician", en: "Yes, the cable is connected properly.", idText: "Ya, kabel sudah terpasang dengan benar." }
    ]
  },
  {
    id: "cab-02",
    category: "cables",
    en: "Please reseat the LAN cable in slot zero.",
    idText: "Tolong cabut dan pasang kembali kabel LAN di slot nol.",
    note: "\"Reseat\" berarti mencabut lalu memasang kembali sampai benar-benar terkunci. Ini instruksi yang umum dari engineer.",
    dialogue: [
      { speaker: "engineer", en: "Please reseat the LAN cable in slot zero.", idText: "Tolong cabut dan pasang kembali kabel LAN di slot nol." },
      { speaker: "technician", en: "Okay, I’ll do that.", idText: "Baik, saya akan melakukannya." }
    ]
  },
  {
    id: "cab-03",
    category: "cables",
    en: "I’ve reseated the LAN cable.",
    idText: "Saya sudah mencabut dan memasang kembali kabel LAN.",
    note: "\"I’ve\" + past participle dipakai untuk melaporkan tindakan yang baru saja selesai dan hasilnya masih relevan.",
    dialogue: [
      { speaker: "technician", en: "I’ve reseated the LAN cable.", idText: "Saya sudah mencabut dan memasang kembali kabel LAN." },
      { speaker: "engineer", en: "Great. You can check it now.", idText: "Bagus. Anda bisa memeriksanya sekarang." }
    ]
  },
  {
    id: "cab-04",
    category: "cables",
    en: "I checked both ends of the cable.",
    idText: "Saya sudah memeriksa kedua ujung kabel.",
    note: "Dipakai untuk memastikan engineer bahwa pemeriksaan tidak hanya di satu sisi."
  },
  {
    id: "cab-05",
    category: "cables",
    en: "The cable is plugged into the correct port.",
    idText: "Kabel sudah dicolokkan ke porta yang benar.",
    note: "Gunakan \"port\" untuk lubang koneksi di perangkat. \"Plugged into\" adalah ungkapan yang tepat."
  },
  {
    id: "cab-06",
    category: "cables",
    en: "The LAN cable looks damaged.",
    idText: "Kabel LAN tampak rusak.",
    note: "\"Looks damaged\" berarti dari tampilannya tampak rusak; Anda belum tentu sudah menguji secara elektrik."
  },
  {
    id: "cab-07",
    category: "cables",
    en: "I’ve replaced the LAN cable with a new one.",
    idText: "Saya sudah mengganti kabel LAN dengan yang baru.",
    note: "\"Replace A with B\" adalah pola yang berguna: mengganti A dengan B."
  },
  {
    id: "cab-08",
    category: "cables",
    en: "The link light is on now.",
    idText: "Lampu koneksi sekarang menyala.",
    note: "\"Link light\" adalah lampu indikator koneksi di porta jaringan. Ini bukti koneksi fisik sudah terdeteksi."
  },

  // ── 4. Sensor ────────────────────────────────────────────────────────────
  {
    id: "sen-01",
    category: "sensors",
    en: "The sensor is not detecting any movement.",
    idText: "Sensor tidak mendeteksi gerakan apa pun.",
    note: "Gunakan \"detect\" untuk sensor yang seharusnya menangkap gerakan atau objek."
  },
  {
    id: "sen-02",
    category: "sensors",
    en: "The sensor light is not turning on.",
    idText: "Lampu sensor tidak menyala.",
    note: "\"Is not turning on\" menjelaskan kondisi saat ini. \"Won’t turn on\" juga bisa, tetapi lebih kuat."
  },
  {
    id: "sen-03",
    category: "sensors",
    en: "The sensor is giving a false reading.",
    idText: "Sensor memberikan pembacaan yang salah.",
    note: "\"False reading\" berarti sensor mendeteksi sesuatu yang sebenarnya tidak ada."
  },
  {
    id: "sen-04",
    category: "sensors",
    en: "I’ve cleaned the sensor.",
    idText: "Saya sudah membersihkan sensor.",
    note: "Langkah sederhana yang sering diminta engineer sebelum mengganti sensor."
  },
  {
    id: "sen-05",
    category: "sensors",
    en: "I’ve checked the sensor connection.",
    idText: "Saya sudah memeriksa koneksi sensor.",
    note: "Gunakan \"connection\" untuk jalur kabel dan konektor, bukan hanya kabelnya."
  },
  {
    id: "sen-06",
    category: "sensors",
    en: "The sensor is working again.",
    idText: "Sensor sudah berfungsi lagi.",
    note: "Kalimat singkat untuk mengabarkan bahwa masalah sensor sudah teratasi."
  },

  // ── 5. Catu daya dan PSU ─────────────────────────────────────────────────
  {
    id: "psu-01",
    category: "power",
    en: "The power supply is switched off.",
    idText: "Catu daya (PSU) dalam keadaan mati.",
    note: "\"Switched off\" berarti sakelar berada pada posisi mati. Periksa sakelar sebelum menyimpulkan PSU rusak.",
    dialogue: [
      { speaker: "engineer", en: "Is the power supply switched on?", idText: "Apakah catu dayanya menyala?" },
      { speaker: "technician", en: "No. The power supply is switched off.", idText: "Tidak. Catu dayanya dalam keadaan mati." }
    ]
  },
  {
    id: "psu-02",
    category: "power",
    en: "The machine is still powered on.",
    idText: "Mesin masih dalam keadaan menyala.",
    note: "\"Powered on\" berarti mendapat daya dan menyala; tidak sama dengan \"working\" yang berarti berfungsi normal.",
    dialogue: [
      { speaker: "engineer", en: "Is the machine still powered on?", idText: "Apakah mesin masih menyala?" },
      { speaker: "technician", en: "Yes, the machine is still powered on.", idText: "Ya, mesin masih dalam keadaan menyala." }
    ]
  },
  {
    id: "psu-03",
    category: "power",
    en: "I have a spare PSU.",
    idText: "Saya punya PSU cadangan.",
    note: "\"Spare\" berarti cadangan yang tersedia di lokasi. Engineer biasanya langsung menanyakan ini."
  },
  {
    id: "psu-04",
    category: "power",
    en: "May I replace the PSU?",
    idText: "Bolehkah saya mengganti PSU?",
    note: "\"May I\" adalah cara paling sopan untuk meminta izin, terutama untuk tindakan yang mengubah perangkat.",
    dialogue: [
      { speaker: "technician", en: "May I replace the PSU?", idText: "Bolehkah saya mengganti PSU?" },
      { speaker: "engineer", en: "Yes, go ahead. Please let me know when it’s done.", idText: "Ya, silakan. Beri tahu saya setelah selesai." }
    ]
  },
  {
    id: "psu-05",
    category: "power",
    en: "I’ve checked the power supply voltage.",
    idText: "Saya sudah memeriksa tegangan catu daya.",
    note: "\"Voltage\" adalah tegangan listrik. Sebutkan angkanya jika engineer memintanya."
  },
  {
    id: "psu-06",
    category: "power",
    en: "The PSU fan is not spinning.",
    idText: "Kipas PSU tidak berputar.",
    note: "\"Spinning\" dipakai khusus untuk benda yang berputar seperti kipas."
  },

  // ── 6. Memulai ulang mesin ───────────────────────────────────────────────
  {
    id: "rst-01",
    category: "restart",
    en: "I’ve restarted the machine, but the problem is still there.",
    idText: "Saya sudah memulai ulang mesin, tetapi masalahnya masih ada.",
    note: "Pola \"I’ve ..., but ...\" sangat berguna untuk melaporkan usaha yang sudah dilakukan beserta hasilnya.",
    dialogue: [
      { speaker: "engineer", en: "Have you restarted the machine?", idText: "Apakah Anda sudah memulai ulang mesin?" },
      { speaker: "technician", en: "I’ve restarted the machine, but the problem is still there.", idText: "Saya sudah memulai ulang mesin, tetapi masalahnya masih ada." }
    ]
  },
  {
    id: "rst-02",
    category: "restart",
    en: "Could I restart the machine now?",
    idText: "Bolehkah saya memulai ulang mesin sekarang?",
    note: "Selalu minta izin sebelum restart jika mesin sedang dipakai atau dalam pengawasan engineer."
  },
  {
    id: "rst-03",
    category: "restart",
    en: "I’m restarting the machine now.",
    idText: "Saya sedang memulai ulang mesin sekarang.",
    note: "Present continuous dipakai untuk tindakan yang sedang berlangsung saat Anda berbicara."
  },
  {
    id: "rst-04",
    category: "restart",
    en: "The machine is booting up.",
    idText: "Mesin sedang menyala dan memuat sistem.",
    note: "\"Booting up\" berarti proses menyalakan komputer atau mesin sampai sistem siap."
  },
  {
    id: "rst-05",
    category: "restart",
    en: "The machine has restarted successfully.",
    idText: "Mesin berhasil dimulai ulang.",
    note: "Gunakan \"successfully\" untuk menegaskan proses selesai tanpa error."
  },
  {
    id: "rst-06",
    category: "restart",
    en: "Please wait while the system restarts.",
    idText: "Mohon tunggu sementara sistem dimulai ulang.",
    note: "Kalimat ini cocok diucapkan kepada rekan di lokasi atau engineer yang menunggu."
  },

  // ── 7. Perangkat lunak dan jaringan ───────────────────────────────────────
  {
    id: "net-01",
    category: "software-network",
    en: "I suspect it might be a software issue.",
    idText: "Saya menduga ini mungkin masalah perangkat lunak.",
    note: "\"Suspect\" + \"might be\" membuat dugaan terdengar hati-hati, bukan sebagai kepastian.",
    dialogue: [
      { speaker: "technician", en: "I suspect it might be a software issue.", idText: "Saya menduga ini mungkin masalah perangkat lunak." },
      { speaker: "engineer", en: "Let’s check the logs together.", idText: "Mari kita periksa log bersama." }
    ]
  },
  {
    id: "net-02",
    category: "software-network",
    en: "The computer cannot connect to the network.",
    idText: "Komputer tidak bisa terhubung ke jaringan.",
    note: "\"Cannot connect\" adalah cara paling langsung menjelaskan kegagalan koneksi."
  },
  {
    id: "net-03",
    category: "software-network",
    en: "I’ve checked the IP address.",
    idText: "Saya sudah memeriksa alamat IP.",
    note: "Gunakan \"IP address\" dalam bahasa Inggris; jangan diterjemahkan menjadi \"alamat IP\" saat berbicara."
  },
  {
    id: "net-04",
    category: "software-network",
    en: "The software is not responding.",
    idText: "Perangkat lunak tidak merespons.",
    note: "Dipakai saat aplikasi macet atau tidak bereaksi terhadap klik dan perintah."
  },
  {
    id: "net-05",
    category: "software-network",
    en: "I’ve reinstalled the software.",
    idText: "Saya sudah memasang ulang perangkat lunak.",
    note: "\"Reinstall\" berarti memasang ulang. Sebutkan versi aplikasi jika engineer menanyakannya."
  },
  {
    id: "net-06",
    category: "software-network",
    en: "I’ve pinged the server, and it responded.",
    idText: "Saya sudah melakukan ping ke server, dan server merespons.",
    note: "\"Ping\" dipakai sebagai kata kerja dalam percakapan teknis sehari-hari."
  },
  {
    id: "net-07",
    category: "software-network",
    en: "The network connection is stable now.",
    idText: "Koneksi jaringan sekarang stabil.",
    note: "Gunakan setelah koneksi kembali normal dan tidak putus-putus."
  },
  {
    id: "net-08",
    category: "software-network",
    en: "Could you check the network settings on your side?",
    idText: "Bisakah Anda memeriksa pengaturan jaringan di sisi Anda?",
    note: "\"On your side\" berarti di lokasi atau sistem engineer, bukan di sisi Anda."
  },

  // ── 8. Mengikuti instruksi ───────────────────────────────────────────────
  {
    id: "ins-01",
    category: "instructions",
    en: "Okay, I’ll do that.",
    idText: "Baik, saya akan melakukannya.",
    note: "Konfirmasi singkat yang jelas. \"That\" merujuk pada instruksi yang baru saja diberikan.",
    dialogue: [
      { speaker: "engineer", en: "Please reseat the LAN cable in slot zero.", idText: "Tolong cabut dan pasang kembali kabel LAN di slot nol." },
      { speaker: "technician", en: "Okay, I’ll do that.", idText: "Baik, saya akan melakukannya." }
    ]
  },
  {
    id: "ins-02",
    category: "instructions",
    en: "I’ve done that. What’s next?",
    idText: "Saya sudah melakukannya. Apa selanjutnya?",
    note: "Dipakai untuk memberi tahu bahwa langkah selesai dan siap menerima instruksi berikutnya."
  },
  {
    id: "ins-03",
    category: "instructions",
    en: "Understood. I’ll try it now.",
    idText: "Mengerti. Saya akan mencobanya sekarang.",
    note: "\"Understood\" adalah konfirmasi pemahaman yang singkat dan profesional."
  },
  {
    id: "ins-04",
    category: "instructions",
    en: "Let me confirm: should I unplug the cable first?",
    idText: "Saya pastikan dulu: apakah saya harus melepas kabelnya terlebih dahulu?",
    note: "Gunakan \"Let me confirm\" untuk mengulang urutan instruksi sebelum bertindak."
  },
  {
    id: "ins-05",
    category: "instructions",
    en: "I’ll follow the steps you sent me.",
    idText: "Saya akan mengikuti langkah-langkah yang Anda kirim.",
    note: "Cocok ketika instruksi dikirim lewat email atau pesan, bukan diucapkan langsung."
  },
  {
    id: "ins-06",
    category: "instructions",
    en: "Can you send me the instructions in writing?",
    idText: "Bisakah Anda mengirimkan instruksinya secara tertulis?",
    note: "\"In writing\" berarti lewat teks atau email agar tidak mudah salah dengar."
  },

  // ── 9. Melaporkan hasil tes ──────────────────────────────────────────────
  {
    id: "test-01",
    category: "test-results",
    en: "The test is complete.",
    idText: "Tes sudah selesai.",
    note: "\"Complete\" di sini berarti seluruh proses tes sudah selesai, belum tentu hasilnya lulus.",
    dialogue: [
      { speaker: "engineer", en: "How is the test going?", idText: "Bagaimana tesnya?" },
      { speaker: "technician", en: "The test is complete.", idText: "Tes sudah selesai." }
    ]
  },
  {
    id: "test-02",
    category: "test-results",
    en: "The test is still running.",
    idText: "Tesnya masih berjalan.",
    note: "Gunakan \"still running\" untuk proses yang belum selesai pada saat Anda melapor."
  },
  {
    id: "test-03",
    category: "test-results",
    en: "The test passed successfully.",
    idText: "Tes berhasil lulus.",
    note: "\"Passed\" adalah hasil tes yang memenuhi kriteria. Hindari \"success\" saja untuk hasil tes."
  },
  {
    id: "test-04",
    category: "test-results",
    en: "The test failed again.",
    idText: "Tes gagal lagi.",
    note: "\"Again\" menunjukkan masalah berulang dan penting untuk keputusan engineer berikutnya."
  },
  {
    id: "test-05",
    category: "test-results",
    en: "The result is the same as before.",
    idText: "Hasilnya sama seperti sebelumnya.",
    note: "Kalimat ini memberi tahu bahwa tindakan terakhir belum mengubah hasil."
  },
  {
    id: "test-06",
    category: "test-results",
    en: "I’ve sent you the test report.",
    idText: "Saya sudah mengirimkan laporan tes kepada Anda.",
    note: "Sebutkan lewat channel apa laporan dikirim jika perlu: \"by email\" atau \"in the chat\"."
  },

  // ── 10. Menjelaskan keterlambatan ────────────────────────────────────────
  {
    id: "delay-01",
    category: "delays",
    en: "This will take some time.",
    idText: "Ini akan memakan waktu.",
    note: "Beri tahu sejak awal agar engineer tidak menunggu tanpa kepastian.",
    dialogue: [
      { speaker: "technician", en: "This will take some time.", idText: "Ini akan memakan waktu." },
      { speaker: "engineer", en: "No problem. Please keep me updated.", idText: "Tidak masalah. Tolong terus beri saya kabar." }
    ]
  },
  {
    id: "delay-02",
    category: "delays",
    en: "It may take a while.",
    idText: "Ini mungkin memerlukan waktu cukup lama.",
    note: "\"May\" membuat perkiraan terdengar lebih hati-hati. \"A while\" berarti cukup lama, bukan sebentar."
  },
  {
    id: "delay-03",
    category: "delays",
    en: "I’m still working on it.",
    idText: "Saya masih mengerjakannya.",
    note: "Update singkat saat engineer bertanya apakah pekerjaan sudah selesai."
  },
  {
    id: "delay-04",
    category: "delays",
    en: "I’ll let you know when it’s done.",
    idText: "Saya akan memberi tahu Anda setelah selesai.",
    note: "Janji yang jelas untuk menghubungi kembali. Pastikan benar-benar menepatinya."
  },
  {
    id: "delay-05",
    category: "delays",
    en: "I’ll keep you updated.",
    idText: "Saya akan terus memberi kabar.",
    note: "Cocok untuk pekerjaan panjang. \"Updated\" di sini berarti memberi informasi terbaru."
  },
  {
    id: "delay-06",
    category: "delays",
    en: "Sorry for the delay. We’re still checking the machine.",
    idText: "Maaf atas keterlambatannya. Kami masih memeriksa mesin.",
    note: "Minta maaf singkat lalu langsung beri status. Hindari menjelaskan terlalu banyak alasan."
  },

  // ── 11. Meminta klarifikasi ──────────────────────────────────────────────
  {
    id: "clar-01",
    category: "clarification",
    en: "Could you repeat that, please?",
    idText: "Bisakah Anda mengulanginya?",
    note: "Cara sopan meminta pengulangan tanpa menyalahkan lawan bicara.",
    dialogue: [
      { speaker: "technician", en: "Could you repeat that, please?", idText: "Bisakah Anda mengulanginya?" },
      { speaker: "engineer", en: "Of course. I said, reseat the cable in slot zero.", idText: "Tentu. Saya tadi bilang, cabut dan pasang kembali kabel di slot nol." }
    ]
  },
  {
    id: "clar-02",
    category: "clarification",
    en: "Could you explain that again?",
    idText: "Bisakah Anda menjelaskannya lagi?",
    note: "Dipakai ketika Anda mendengar kalimatnya tetapi belum memahami langkah atau maksudnya."
  },
  {
    id: "clar-03",
    category: "clarification",
    en: "What should I do next?",
    idText: "Apa yang harus saya lakukan selanjutnya?",
    note: "Pertanyaan langsung setelah menyelesaikan satu langkah. \"Should\" terdengar sopan."
  },
  {
    id: "clar-04",
    category: "clarification",
    en: "Is there anything else I need to check?",
    idText: "Apakah ada hal lain yang perlu saya periksa?",
    note: "Gunakan sebelum menutup sesi agar tidak ada pemeriksaan yang terlewat."
  },
  {
    id: "clar-05",
    category: "clarification",
    en: "Do you mean I should restart the machine?",
    idText: "Apakah maksud Anda saya harus memulai ulang mesin?",
    note: "Mengulang instruksi dengan kata-kata sendiri membantu memastikan pemahaman."
  },
  {
    id: "clar-06",
    category: "clarification",
    en: "Could you speak a little more slowly, please?",
    idText: "Bisakah Anda berbicara sedikit lebih lambat?",
    note: "Sangat berguna saat engineer berbicara cepat. \"A little more slowly\" lebih sopan daripada \"slowly\"."
  },
  {
    id: "clar-07",
    category: "clarification",
    en: "Sorry, I didn’t catch that.",
    idText: "Maaf, saya tidak menangkap maksudnya.",
    note: "\"Catch\" dalam percakapan berarti mendengar atau memahami. Kalimat ini santai tetapi sopan."
  },

  // ── 12. Update status ────────────────────────────────────────────────────
  {
    id: "status-01",
    category: "status-updates",
    en: "The problem is still there.",
    idText: "Masalahnya masih ada.",
    note: "Kalimat tegas bahwa masalah belum hilang. Bisa ditambahkan \"after the restart\" bila perlu."
  },
  {
    id: "status-02",
    category: "status-updates",
    en: "I’ve finished the first check.",
    idText: "Saya sudah menyelesaikan pemeriksaan pertama.",
    note: "Memberi tahu bahwa satu tahap selesai, tanpa mengklaim seluruh masalah beres."
  },
  {
    id: "status-03",
    category: "status-updates",
    en: "I’m at the exit section now.",
    idText: "Saya sekarang berada di bagian pintu keluar.",
    note: "Sebutkan lokasi dengan istilah yang dipakai di bandara, misalnya \"exit section\" atau \"gate 4\"."
  },
  {
    id: "status-04",
    category: "status-updates",
    en: "The sensor has been replaced.",
    idText: "Sensor sudah diganti.",
    note: "Bentuk pasif \"has been replaced\" menekankan hasil, bukan siapa yang mengganti."
  },
  {
    id: "status-05",
    category: "status-updates",
    en: "The replacement is in progress.",
    idText: "Penggantian sedang berlangsung.",
    note: "\"In progress\" adalah cara formal dan singkat untuk mengatakan pekerjaan sedang dikerjakan."
  },
  {
    id: "status-06",
    category: "status-updates",
    en: "The machine is running, but the error is still showing.",
    idText: "Mesin menyala, tetapi pesan kesalahannya masih muncul.",
    note: "Membedakan \"running\" (menyala/beroperasi) dari \"error is still showing\" sangat penting saat troubleshooting."
  },
  {
    id: "status-07",
    category: "status-updates",
    en: "I’m waiting for the maintenance team to arrive.",
    idText: "Saya menunggu tim pemeliharaan datang.",
    note: "Gunakan \"waiting for ... to arrive\" untuk menjelaskan bahwa Anda menunggu orang, bukan menunggu barang."
  },

  // ── 13. Mengonfirmasi selesai ────────────────────────────────────────────
  {
    id: "done-01",
    category: "completion",
    en: "I’ve completed the checks.",
    idText: "Saya sudah menyelesaikan semua pemeriksaan.",
    note: "\"Checks\" adalah pemeriksaan rutin. \"Completed\" menegaskan semuanya sudah dilakukan."
  },
  {
    id: "done-02",
    category: "completion",
    en: "The machine is working normally now.",
    idText: "Mesin sekarang berjalan normal.",
    note: "\"Normally\" berarti sesuai kondisi normal, bukan \"normal\" dalam arti biasa saja.",
    dialogue: [
      { speaker: "engineer", en: "Is the machine working now?", idText: "Apakah mesin sudah berjalan sekarang?" },
      { speaker: "technician", en: "Yes, the machine is working normally now.", idText: "Ya, mesin sekarang berjalan normal." }
    ]
  },
  {
    id: "done-03",
    category: "completion",
    en: "The problem has been resolved.",
    idText: "Masalahnya sudah teratasi.",
    note: "\"Resolved\" lebih profesional daripada \"fixed\" dan sering dipakai dalam laporan teknis."
  },
  {
    id: "done-04",
    category: "completion",
    en: "Everything is working as expected.",
    idText: "Semuanya berjalan sesuai harapan.",
    note: "\"As expected\" berarti hasilnya sesuai dengan yang seharusnya."
  },
  {
    id: "done-05",
    category: "completion",
    en: "You can check it now.",
    idText: "Anda bisa memeriksanya sekarang.",
    note: "Dipakai setelah Anda menyelesaikan tindakan dan siap engineer memverifikasi hasilnya.",
    dialogue: [
      { speaker: "technician", en: "I’ve reseated the LAN cable. You can check it now.", idText: "Saya sudah memasang kembali kabel LAN. Anda bisa memeriksanya sekarang." },
      { speaker: "engineer", en: "I can see the connection. Thank you.", idText: "Saya bisa melihat koneksinya. Terima kasih." }
    ]
  },
  {
    id: "done-06",
    category: "completion",
    en: "The system is back to normal.",
    idText: "Sistem sudah kembali normal.",
    note: "\"Back to normal\" adalah ungkapan umum untuk kondisi yang pulih setelah gangguan."
  },
  {
    id: "done-07",
    category: "completion",
    en: "I’ve confirmed that the sensor is working.",
    idText: "Saya sudah memastikan bahwa sensor berfungsi.",
    note: "Gunakan \"confirmed\" setelah Anda benar-benar menguji, bukan hanya melihat lampunya."
  },

  // ── 14. Menutup sesi remote ──────────────────────────────────────────────
  {
    id: "end-01",
    category: "ending-session",
    en: "Thank you for your help.",
    idText: "Terima kasih atas bantuan Anda.",
    note: "Penutup sederhana yang selalu tepat setelah bantuan teknis."
  },
  {
    id: "end-02",
    category: "ending-session",
    en: "I’ll close the remote session now.",
    idText: "Saya akan menutup sesi remote sekarang.",
    note: "Beri tahu sebelum memutus koneksi agar engineer tidak mengira koneksi terputus tiba-tiba."
  },
  {
    id: "end-03",
    category: "ending-session",
    en: "Please let me know if you need anything else.",
    idText: "Beri tahu saya jika Anda memerlukan hal lain.",
    note: "Bisa diucapkan oleh teknisi maupun engineer untuk menutup percakapan dengan ramah."
  },
  {
    id: "end-04",
    category: "ending-session",
    en: "Have a good day. Goodbye.",
    idText: "Semoga harimu menyenangkan. Sampai jumpa.",
    note: "Penutup santai dan sopan untuk panggilan kerja."
  },
  {
    id: "end-05",
    category: "ending-session",
    en: "I’ll send you a summary of what we did.",
    idText: "Saya akan mengirimkan ringkasan tentang apa yang telah kita lakukan.",
    note: "\"What we did\" merujuk pada tindakan yang sudah selesai selama sesi."
  },
  {
    id: "end-06",
    category: "ending-session",
    en: "The remote session is finished.",
    idText: "Sesi remote sudah selesai.",
    note: "Kalimat netral untuk memastikan kedua pihak tahu sesi sudah berakhir."
  }
];

/*
 * Skenario roleplay.
 * Setiap langkah berisi satu instruksi engineer dan beberapa pilihan jawaban.
 * Tepat satu opsi memiliki correct: true.
 */
export const SCENARIOS = [
  {
    id: "lan-reseat",
    title: "Kabel LAN longgar di slot nol",
    icon: "link",
    level: "Pemula",
    intro: "Seorang engineer remote meminta Anda memeriksa kabel LAN pada mesin di Terminal 3. Jawab dengan singkat dan laporkan hasilnya.",
    steps: [
      {
        engineer: { en: "Please reseat the LAN cable in slot zero.", idText: "Tolong cabut dan pasang kembali kabel LAN di slot nol." },
        options: [
          { en: "Okay, I’ll do that.", correct: true },
          { en: "The test is still running.", correct: false },
          { en: "I have a spare PSU.", correct: false }
        ],
        explanation: "Konfirmasi singkat bahwa Anda memahami instruksi. Setelah itu baru lakukan tindakannya."
      },
      {
        engineer: { en: "Let me know when you’re done.", idText: "Beri tahu saya setelah selesai." },
        options: [
          { en: "The problem is still there.", correct: false },
          { en: "I’ve reseated the LAN cable.", correct: true },
          { en: "Could you explain that again?", correct: false }
        ],
        explanation: "Gunakan present perfect (\"I’ve reseated...\") untuk melaporkan tindakan yang baru selesai."
      },
      {
        engineer: { en: "I can see the link light now. Please check the machine.", idText: "Saya bisa melihat lampu koneksi sekarang. Silakan periksa mesinnya." },
        options: [
          { en: "The machine is working normally now.", correct: true },
          { en: "I need a new laptop.", correct: false },
          { en: "This will take some time.", correct: false }
        ],
        explanation: "Laporkan hasil akhir dengan jelas. \"Working normally\" berarti mesin kembali berfungsi."
      }
    ]
  },
  {
    id: "sensor-problem",
    title: "Sensor tidak berfungsi",
    icon: "radio",
    level: "Pemula",
    intro: "Sensor di area bagasi tidak mendeteksi gerakan. Engineer akan menuntun Anda memeriksa koneksi dan kebersihan sensor.",
    steps: [
      {
        engineer: { en: "What seems to be the problem?", idText: "Sepertinya masalahnya apa?" },
        options: [
          { en: "The sensor is not working properly.", correct: true },
          { en: "Thank you for your help.", correct: false },
          { en: "The remote session is finished.", correct: false }
        ],
        explanation: "Mulai dengan masalah utamanya. \"Not working properly\" adalah ungkapan yang jelas dan tidak berlebihan."
      },
      {
        engineer: { en: "Is the sensor light on?", idText: "Apakah lampu sensornya menyala?" },
        options: [
          { en: "No, the sensor light is not turning on.", correct: true },
          { en: "I’ve sent you the test report.", correct: false },
          { en: "Okay, I’ll do that.", correct: false }
        ],
        explanation: "Jawab pertanyaan yes/no terlebih dahulu, lalu jelaskan kondisinya."
      },
      {
        engineer: { en: "Please check the connection and clean the sensor.", idText: "Tolong periksa koneksinya dan bersihkan sensornya." },
        options: [
          { en: "Understood. I’ll try it now.", correct: true },
          { en: "The machine is booting up.", correct: false },
          { en: "Have a good day.", correct: false }
        ],
        explanation: "Konfirmasi bahwa Anda akan melakukan kedua langkah tersebut sekarang."
      },
      {
        engineer: { en: "Any change?", idText: "Apakah ada perubahan?" },
        options: [
          { en: "The sensor is working again.", correct: true },
          { en: "I’m calling from Terminal 3 Jakarta.", correct: false },
          { en: "I have a spare PSU.", correct: false }
        ],
        explanation: "Beri hasil yang spesifik. Jika sudah pulih, katakan bahwa sensor berfungsi lagi."
      }
    ]
  },
  {
    id: "restart-persists",
    title: "Sudah restart, masalah tetap ada",
    icon: "rotate",
    level: "Pemula",
    intro: "Anda sudah memulai ulang mesin, tetapi masalahnya masih muncul. Engineer ingin memastikan kondisinya sebelum melanjutkan.",
    steps: [
      {
        engineer: { en: "Have you restarted the machine?", idText: "Apakah Anda sudah memulai ulang mesin?" },
        options: [
          { en: "I’ve restarted the machine, but the problem is still there.", correct: true },
          { en: "This will take some time.", correct: false },
          { en: "The cable is connected properly.", correct: false }
        ],
        explanation: "Laporkan tindakan dan hasilnya dalam satu kalimat. Pola \"I’ve ..., but ...\" sangat efisien."
      },
      {
        engineer: { en: "Is the machine still powered on?", idText: "Apakah mesin masih menyala?" },
        options: [
          { en: "Yes, the machine is still powered on.", correct: true },
          { en: "No, I’m waiting for the maintenance team.", correct: false },
          { en: "The test passed successfully.", correct: false }
        ],
        explanation: "\"Powered on\" berarti mesin mendapat daya dan menyala, walaupun mungkin belum berfungsi normal."
      },
      {
        engineer: { en: "Okay. Could we start a remote session?", idText: "Baik. Bisakah kita memulai sesi remote?" },
        options: [
          { en: "Yes. I’m ready when you are.", correct: true },
          { en: "The sensor has been replaced.", correct: false },
          { en: "I’ll close the remote session now.", correct: false }
        ],
        explanation: "Setujui sesi remote dan beri tahu bahwa Anda siap."
      }
    ]
  },
  {
    id: "psu-exit-section",
    title: "Memeriksa PSU di exit section",
    icon: "zap",
    level: "Pemula",
    intro: "Engineer meminta Anda mengecek catu daya di area pintu keluar. Anda menemukan tegangannya terlalu rendah.",
    steps: [
      {
        engineer: { en: "Can you check the power supply at the exit section?", idText: "Bisakah Anda memeriksa catu daya di bagian pintu keluar?" },
        options: [
          { en: "Okay, I’ll check it now.", correct: true },
          { en: "The test is complete.", correct: false },
          { en: "Thank you for your help.", correct: false }
        ],
        explanation: "Konfirmasi lokasi dan tindakan. \"Okay, I’ll check it now\" cukup singkat dan jelas."
      },
      {
        engineer: { en: "What is the voltage reading?", idText: "Berapa bacaan tegangannya?" },
        options: [
          { en: "I’ve checked the power supply voltage. It’s too low.", correct: true },
          { en: "I’ve reseated the LAN cable.", correct: false },
          { en: "The sensor is giving a false reading.", correct: false }
        ],
        explanation: "Sebutkan hasil pengukuran. Jika angkanya diketahui, tambahkan nilainya, misalnya \"It’s 18 volts.\""
      },
      {
        engineer: { en: "The PSU needs to be replaced. Do you have a spare?", idText: "PSU perlu diganti. Apakah Anda punya cadangan?" },
        options: [
          { en: "Yes, I have a spare PSU.", correct: true },
          { en: "No, the machine is working normally now.", correct: false },
          { en: "The error message says ’Communication timeout.’", correct: false }
        ],
        explanation: "Jawab langsung pertanyaan engineer tentang ketersediaan suku cadang."
      }
    ]
  },
  {
    id: "psu-switched-off",
    title: "PSU ternyata mati",
    icon: "power",
    level: "Pemula",
    intro: "Mesin tidak menyala. Sebelum mengganti PSU, engineer meminta Anda memeriksa sakelar catu daya.",
    steps: [
      {
        engineer: { en: "Is the power supply switched on?", idText: "Apakah catu dayanya dalam posisi menyala?" },
        options: [
          { en: "The power supply is switched off.", correct: true },
          { en: "The test is still running.", correct: false },
          { en: "I’ve completed the checks.", correct: false }
        ],
        explanation: "Periksa sakelar terlebih dahulu. \"Switched off\" berarti sakelar berada di posisi mati."
      },
      {
        engineer: { en: "Please switch it on and check the machine.", idText: "Tolong nyalakan dan periksa mesinnya." },
        options: [
          { en: "Okay, I’ll do that.", correct: true },
          { en: "Could you repeat that, please?", correct: false },
          { en: "I’ll send you a summary.", correct: false }
        ],
        explanation: "Konfirmasi instruksi. Anda bisa menambahkan \"I’ll check the machine after that.\""
      },
      {
        engineer: { en: "Is the machine working now?", idText: "Apakah mesin sudah berjalan sekarang?" },
        options: [
          { en: "Yes, the machine is working normally now.", correct: true },
          { en: "No, I have a spare PSU.", correct: false },
          { en: "The LAN cable looks damaged.", correct: false }
        ],
        explanation: "Laporkan hasil setelah sakelar dinyalakan. Jangan langsung menyimpulkan PSU rusak."
      }
    ]
  },
  {
    id: "replace-psu",
    title: "Mengganti PSU dengan izin",
    icon: "wrench",
    level: "Pemula",
    intro: "PSU sudah dipastikan bermasalah. Engineer meminta Anda menggantinya, tetapi Anda ingin memastikan izin dan melaporkan prosesnya.",
    steps: [
      {
        engineer: { en: "The PSU is faulty. Please replace it.", idText: "PSU-nya bermasalah. Tolong ganti." },
        options: [
          { en: "May I replace the PSU?", correct: true },
          { en: "The test is complete.", correct: false },
          { en: "I’m calling from Terminal 3 Jakarta.", correct: false }
        ],
        explanation: "Meskipun engineer sudah meminta, meminta izin secara eksplisit menunjukkan Anda mengikuti prosedur."
      },
      {
        engineer: { en: "Yes, go ahead. Let me know when it’s done.", idText: "Ya, silakan. Beri tahu saya setelah selesai." },
        options: [
          { en: "Thank you. I’ll let you know when it’s done.", correct: true },
          { en: "The sensor is not detecting any movement.", correct: false },
          { en: "Could you speak more slowly?", correct: false }
        ],
        explanation: "Konfirmasi izin dan janjikan update setelah pekerjaan selesai."
      },
      {
        engineer: { en: "How is it going?", idText: "Bagaimana perkembangannya?" },
        options: [
          { en: "The replacement is in progress.", correct: true },
          { en: "I’ve cleaned the sensor.", correct: false },
          { en: "The test failed again.", correct: false }
        ],
        explanation: "\"In progress\" adalah update singkat bahwa penggantian masih berlangsung."
      },
      {
        engineer: { en: "Is the machine working now?", idText: "Apakah mesin sudah berjalan sekarang?" },
        options: [
          { en: "Yes, the machine is working normally now.", correct: true },
          { en: "No, I’m still waiting for the PSU.", correct: false },
          { en: "The cable is plugged into the correct port.", correct: false }
        ],
        explanation: "Setelah penggantian, laporkan hasil akhir dan pastikan mesin benar-benar normal."
      }
    ]
  },
  {
    id: "long-test",
    title: "Tes yang memakan waktu lama",
    icon: "clock",
    level: "Pemula",
    intro: "Anda harus menjalankan tes penuh. Engineer perlu tahu bahwa prosesnya lama dan Anda akan memberi update.",
    steps: [
      {
        engineer: { en: "Please run the full test.", idText: "Tolong jalankan tes penuh." },
        options: [
          { en: "Okay, I’ll start the test now.", correct: true },
          { en: "The problem has been resolved.", correct: false },
          { en: "I’ll close the remote session now.", correct: false }
        ],
        explanation: "Konfirmasi bahwa tes akan segera dimulai."
      },
      {
        engineer: { en: "How long will it take?", idText: "Berapa lama prosesnya?" },
        options: [
          { en: "It may take a while.", correct: true },
          { en: "The sensor is working again.", correct: false },
          { en: "I’ve reseated the LAN cable.", correct: false }
        ],
        explanation: "Jika belum tahu pasti, gunakan \"It may take a while\" atau \"This will take some time.\""
      },
      {
        engineer: { en: "Please keep me updated.", idText: "Tolong terus beri saya kabar." },
        options: [
          { en: "I’ll keep you updated.", correct: true },
          { en: "The test passed successfully.", correct: false },
          { en: "Could you repeat that?", correct: false }
        ],
        explanation: "Janjikan update secara berkala. \"Keep you updated\" adalah ungkapan yang natural."
      },
      {
        engineer: { en: "Is the test finished?", idText: "Apakah tesnya sudah selesai?" },
        options: [
          { en: "The test is still running. I’ll let you know when it’s done.", correct: true },
          { en: "Yes, the machine is still powered on.", correct: false },
          { en: "No, the problem is still there.", correct: false }
        ],
        explanation: "Beri status yang akurat dan janjikan kabar setelah selesai."
      }
    ]
  },
  {
    id: "ask-clarification",
    title: "Meminta engineer mengulang",
    icon: "help",
    level: "Pemula",
    intro: "Engineer memberi instruksi panjang dengan cepat. Anda belum yakin urutannya, jadi minta klarifikasi dengan sopan.",
    steps: [
      {
        engineer: { en: "Reseat the LAN cable in slot zero and restart the controller.", idText: "Cabut dan pasang kembali kabel LAN di slot nol, lalu mulai ulang controller." },
        options: [
          { en: "Sorry, I didn’t catch that. Could you repeat that, please?", correct: true },
          { en: "The machine is working normally now.", correct: false },
          { en: "I’ve sent you the test report.", correct: false }
        ],
        explanation: "Minta pengulangan dengan sopan. Jangan berpura-pura paham jika urutannya belum jelas."
      },
      {
        engineer: { en: "Of course. Reseat the cable first, then restart the controller.", idText: "Tentu. Pasang kembali kabelnya dulu, lalu mulai ulang controller." },
        options: [
          { en: "Do you mean I should restart the controller after reseating the cable?", correct: true },
          { en: "I have a spare PSU.", correct: false },
          { en: "This will take some time.", correct: false }
        ],
        explanation: "Ulangi urutan dengan kata-kata sendiri untuk memastikan Anda memahaminya dengan benar."
      },
      {
        engineer: { en: "Yes, that’s correct.", idText: "Ya, itu benar." },
        options: [
          { en: "Understood. I’ll do that now.", correct: true },
          { en: "The test failed again.", correct: false },
          { en: "Thank you for your help.", correct: false }
        ],
        explanation: "Konfirmasi akhir sebelum bertindak. \"I’ll do that now\" menunjukkan Anda siap."
      }
    ]
  },
  {
    id: "resolved",
    title: "Masalah sudah teratasi",
    icon: "check-circle",
    level: "Pemula",
    intro: "Setelah beberapa pemeriksaan, mesin kembali normal. Laporkan penyelesaian dengan jelas dan tutup sesi.",
    steps: [
      {
        engineer: { en: "Is the problem still there?", idText: "Apakah masalahnya masih ada?" },
        options: [
          { en: "No, the problem has been resolved.", correct: true },
          { en: "Yes, the test is still running.", correct: false },
          { en: "The PSU fan is not spinning.", correct: false }
        ],
        explanation: "\"Has been resolved\" adalah cara profesional untuk menyatakan masalah sudah teratasi."
      },
      {
        engineer: { en: "Can you confirm that the machine is working?", idText: "Bisakah Anda memastikan mesinnya berjalan?" },
        options: [
          { en: "Yes, the machine is working normally now.", correct: true },
          { en: "I’m still waiting for the maintenance team.", correct: false },
          { en: "The cable looks damaged.", correct: false }
        ],
        explanation: "Konfirmasi dengan kondisi yang bisa diverifikasi, bukan hanya \"yes\"."
      },
      {
        engineer: { en: "Great. Thank you for your help. I’ll close the session.", idText: "Bagus. Terima kasih atas bantuan Anda. Saya akan menutup sesinya." },
        options: [
          { en: "Thank you for your help. Have a good day.", correct: true },
          { en: "The test failed again.", correct: false },
          { en: "Please reseat the LAN cable.", correct: false }
        ],
        explanation: "Akhiri percakapan dengan sopan. \"Have a good day\" adalah penutup yang natural."
      }
    ]
  },
  {
    id: "persists",
    title: "Masalah masih berlanjut",
    icon: "alert",
    level: "Pemula",
    intro: "Restart dan pengecekan kabel belum menyelesaikan masalah. Laporkan bahwa masalah masih ada dan minta langkah berikutnya.",
    steps: [
      {
        engineer: { en: "Did the restart fix the problem?", idText: "Apakah restart menyelesaikan masalahnya?" },
        options: [
          { en: "No, the problem is still there.", correct: true },
          { en: "Yes, the machine is working normally now.", correct: false },
          { en: "The sensor has been replaced.", correct: false }
        ],
        explanation: "Jawab jujur dan langsung. Jangan menyatakan berhasil jika masalah masih muncul."
      },
      {
        engineer: { en: "Please send me the error message.", idText: "Tolong kirimkan pesan error-nya." },
        options: [
          { en: "The error message says ’Communication timeout.’", correct: true },
          { en: "I’ve completed the checks.", correct: false },
          { en: "The cable is connected properly.", correct: false }
        ],
        explanation: "Sebutkan pesan error persis seperti yang terlihat di layar."
      },
      {
        engineer: { en: "I’ll check the logs and call you back.", idText: "Saya akan memeriksa log dan menelepon Anda kembali." },
        options: [
          { en: "Okay. What should I do next?", correct: true },
          { en: "The remote session is finished.", correct: false },
          { en: "Thank you for your help. Goodbye.", correct: false }
        ],
        explanation: "Tanyakan langkah berikutnya sebelum menutup percakapan. Masalah belum selesai."
      }
    ]
  },
  {
    id: "status-update",
    title: "Memberi update saat pekerjaan berlangsung",
    icon: "activity",
    level: "Pemula",
    intro: "Perbaikan masih berjalan dan engineer menanyakan status. Beri update singkat, jujur, dan tetap sopan.",
    steps: [
      {
        engineer: { en: "What’s the status?", idText: "Bagaimana statusnya?" },
        options: [
          { en: "I’m still working on it.", correct: true },
          { en: "The problem has been resolved.", correct: false },
          { en: "I’ve sent you the test report.", correct: false }
        ],
        explanation: "\"Still working on it\" adalah update singkat bahwa pekerjaan belum selesai."
      },
      {
        engineer: { en: "How much longer will it take?", idText: "Berapa lama lagi?" },
        options: [
          { en: "It may take a while. I’ll let you know when it’s done.", correct: true },
          { en: "The sensor is not detecting any movement.", correct: false },
          { en: "I’m calling from Terminal 3 Jakarta.", correct: false }
        ],
        explanation: "Jika belum bisa memastikan waktu, gunakan perkiraan yang hati-hati dan janjikan update."
      },
      {
        engineer: { en: "Please also check the sensor connection.", idText: "Tolong periksa juga koneksi sensornya." },
        options: [
          { en: "Okay, I’ll do that. I’ll keep you updated.", correct: true },
          { en: "The test passed successfully.", correct: false },
          { en: "I’ve closed the remote session.", correct: false }
        ],
        explanation: "Konfirmasi instruksi tambahan dan beri komitmen untuk memberi kabar."
      }
    ]
  }
];

export const CATEGORY_BY_ID = Object.fromEntries(CATEGORIES.map(category => [category.id, category]));
export const PHRASE_BY_ID = Object.fromEntries(PHRASES.map(phrase => [phrase.id, phrase]));
export const SCENARIO_BY_ID = Object.fromEntries(SCENARIOS.map(scenario => [scenario.id, scenario]));
