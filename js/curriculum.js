/*
 * Kurikulum program "Service Engineer".
 *
 * Setiap hari berisi lima frasa dari bank frasa utama. Progres hari tidak
 * disimpan sebagai data baru: status selesai dihitung dari catatan learnedAt
 * yang sudah ada di store. Dengan begitu, data belajar lama tetap valid.
 */

export const PROGRAM_PATTERNS = [
  {
    id: "pc",
    name: "Present continuous",
    formula: "Subject + am/is/are + verb-ing (+ object)",
    explanation: "Dipakai untuk kegiatan yang sedang berlangsung sekarang. Dalam pekerjaan lapangan, pola ini sering muncul saat kamu sedang memeriksa, mengirim foto, atau menunggu proses selesai.",
    forms: ["I am / I’m + verb-ing", "You are / You’re + verb-ing", "He/She/It is + verb-ing", "We/They are + verb-ing"]
  },
  {
    id: "ps",
    name: "Present simple",
    formula: "Subject + verb (-s/-es) + object",
    explanation: "Dipakai untuk fakta, kebiasaan, atau hal yang terjadi berulang. Tambahkan -s/-es jika subjeknya he, she, atau it.",
    forms: ["I/You/We/They + verb", "He/She/It + verb-s"]
  },
  {
    id: "be",
    name: "Be + complement",
    formula: "Subject + is/are + adjective / past participle / place",
    explanation: "Dipakai untuk menyebut kondisi atau posisi, bukan tindakan. “Connected”, “switched off”, dan “powered on” adalah past participle yang berfungsi seperti kata sifat.",
    forms: ["I am / I’m", "You/We/They are", "He/She/It is"]
  },
  {
    id: "past",
    name: "Simple past",
    formula: "Subject + past verb (+ object / time)",
    explanation: "Dipakai untuk kejadian yang sudah selesai. Kata kerja beraturan mendapat -ed; beberapa kata kerja umum tidak beraturan, seperti see → saw, make → made, dan go → went.",
    forms: ["I/You/He/She/We/They + past verb"]
  },
  {
    id: "pp",
    name: "Present perfect",
    formula: "Subject + have/has + past participle",
    explanation: "Dipakai untuk tindakan yang sudah selesai tetapi hasilnya masih penting sekarang. Gunakan have untuk I/you/we/they dan has untuk he/she/it.",
    forms: ["I/You/We/They have + past participle", "He/She/It has + past participle", "Negative: haven’t / hasn’t + past participle"]
  },
  {
    id: "ppp",
    name: "Present perfect passive",
    formula: "Subject + has/have been + past participle",
    explanation: "Dipakai saat tindakan sudah selesai dan kita ingin menekankan hasilnya, bukan siapa pelakunya. Sering dipakai dalam laporan status.",
    forms: ["The problem has been + past participle", "The checks have been + past participle"]
  },
  {
    id: "pastpass",
    name: "Past passive",
    formula: "Subject + was/were + past participle",
    explanation: "Dipakai untuk melaporkan tindakan atau temuan pada masa lalu tanpa harus menyebut pelakunya. Gunakan was untuk subjek tunggal dan were untuk subjek jamak.",
    forms: ["The damage was + past participle", "The cables were + past participle"]
  },
  {
    id: "can",
    name: "Can / cannot + base verb",
    formula: "Subject + can/cannot (can’t) + base verb",
    explanation: "Dipakai untuk kemampuan, kemungkinan, atau ketidakmampuan. Setelah can atau cannot, kata kerja tetap dalam bentuk dasar.",
    forms: ["I can + base verb", "I cannot / can’t + base verb"]
  },
  {
    id: "canq",
    name: "Can I/we ...?",
    formula: "Can I/we + base verb (+ object)?",
    explanation: "Dipakai untuk menanyakan izin atau kemungkinan melakukan sesuatu. Ini pertanyaan, bukan izin otomatis: untuk pekerjaan berisiko, izin verbal tetap bukan pengganti LOTO, work permit, atau verifikasi keselamatan.",
    forms: ["Can I + base verb?", "Can we + base verb?"],
    safety: "Pertanyaan “Can I…?” tidak memberi izin keselamatan. Ikuti LOTO, work permit, dan prosedur lokasi."
  },
  {
    id: "could",
    name: "Can/Could for requests",
    formula: "Can/Could + you/I/we/someone + base verb (+ object)?",
    explanation: "Dipakai untuk permintaan atau izin. “Could” terasa lebih sopan daripada “can”. Setelah can/could, gunakan kata kerja bentuk dasar. Untuk pekerjaan berisiko, persetujuan engineer remote atau pelanggan tidak menggantikan prosedur keselamatan lokasi.",
    forms: ["Could you + base verb?", "Can you + base verb?", "Could I/we + base verb?"],
    safety: "Persetujuan remote atau pelanggan bukan pengganti LOTO, work permit, atau otorisasi teknis."
  },
  {
    id: "should",
    name: "Should I ...?",
    formula: "Should I + base verb (+ object)?",
    explanation: "Dipakai untuk meminta rekomendasi atau memastikan tindakan yang sebaiknya diambil. Jawaban “should” tetap harus mengikuti prosedur dan otorisasi di lokasi.",
    forms: ["Should I + base verb?", "Should we + base verb?"]
  },
  {
    id: "wh",
    name: "Wh- question",
    formula: "Wh-word + auxiliary + subject + main verb ...?",
    explanation: "Dipakai untuk menanyakan informasi tertentu. Auxiliary bisa is/are, do/does, can, will, atau should, tergantung kalimatnya.",
    forms: ["What + should I + base verb?", "Why + is + subject + ...?", "When + can + we + base verb?"]
  },
  {
    id: "how",
    name: "How do I ...?",
    formula: "How do I + base verb (+ object)?",
    explanation: "Dipakai untuk menanyakan cara melakukan suatu langkah. Setelah “How do I”, gunakan kata kerja bentuk dasar.",
    forms: ["How do I + base verb?", "How do I + base verb + object?"]
  },
  {
    id: "needto",
    name: "Need to + base verb",
    formula: "Subject + need(s) to + base verb",
    explanation: "Dipakai untuk menyatakan kebutuhan atau kewajiban melakukan sesuatu. Gunakan needs to untuk he, she, atau it.",
    forms: ["I/You/We/They need to + base verb", "He/She/It needs to + base verb"]
  },
  {
    id: "neednoun",
    name: "Need + noun",
    formula: "Subject + need(s) + noun",
    explanation: "Dipakai saat yang dibutuhkan adalah benda atau dokumen, bukan tindakan. Contohnya permission, work permit, atau spare part.",
    forms: ["We need + noun", "The machine needs + noun"]
  },
  {
    id: "letme",
    name: "Let me + base verb",
    formula: "Let me + base verb (+ object)",
    explanation: "Dipakai untuk menawarkan diri melakukan sesuatu atau meminta waktu sebelum mengambil keputusan. Nada kalimatnya sopan dan tidak memaksa.",
    forms: ["Let me + base verb", "Let me check / confirm / explain"]
  },
  {
    id: "please",
    name: "Please + imperative",
    formula: "Please + base verb (+ object)",
    explanation: "Dipakai untuk memberi instruksi atau permintaan yang sopan. Kata kerja tetap dalam bentuk dasar karena ini kalimat perintah.",
    forms: ["Please + base verb", "Please + base verb + object"]
  },
  {
    id: "confirm",
    name: "Confirming understanding",
    formula: "Let me confirm: + clause. Is that correct?",
    explanation: "Dipakai untuk mengulang instruksi dengan kata sendiri lalu meminta konfirmasi. Ini membantu mencegah kesalahan saat mengikuti langkah teknis.",
    forms: ["Let me confirm: I should + base verb, then + base verb. Is that correct?", "Let me confirm: should I + base verb first?"]
  },
  {
    id: "still",
    name: "Still + ongoing condition",
    formula: "Subject + is/are + still + complement / verb-ing",
    explanation: "Dipakai untuk mengatakan bahwa suatu kondisi belum berubah atau masih berlangsung. “Still” biasanya diletakkan setelah be dan sebelum kata sifat, past participle, keterangan, atau kata kerja -ing.",
    forms: ["The alarm is still active.", "The machine is still running.", "I’m still working on it."]
  },
  {
    id: "will",
    name: "Will + base verb",
    formula: "Subject + will + base verb",
    explanation: "Dipakai untuk rencana, janji, atau tindakan yang akan dilakukan. Setelah will, kata kerja selalu dalam bentuk dasar.",
    forms: ["I will / I’ll + base verb", "We will / We’ll + base verb", "Team B will + base verb"]
  },
  {
    id: "if",
    name: "If + present, will + base verb",
    formula: "If + present simple, + subject + will + base verb",
    explanation: "Dipakai untuk menyebut kemungkinan di masa depan. Bagian “if” memakai present simple, bukan will.",
    forms: ["If the problem happens again, I’ll call you.", "If the alarm returns, we’ll stop the test."]
  },
  {
    id: "time",
    name: "Time clause",
    formula: "Main clause + once/before/until/as soon as + present simple",
    explanation: "Dipakai untuk mengatur urutan waktu. Setelah once, before, until, atau as soon as, gunakan present simple walaupun kejadiannya di masa depan.",
    forms: ["I’ll + base verb + once + present simple", "I need to + base verb + before + present simple", "I’ll let you know as soon as + present simple"]
  },
  {
    id: "while",
    name: "While + ongoing action",
    formula: "Main clause + while + subject + present verb",
    explanation: "Dipakai untuk dua kejadian yang berlangsung pada waktu yang sama, atau untuk meminta seseorang menunggu selama proses berjalan.",
    forms: ["Please wait while + subject + present verb.", "Do not open the panel while the machine is running."]
  },
  {
    id: "theres",
    name: "There is/are",
    formula: "There is/are + noun (+ place)",
    explanation: "Dipakai untuk menyebut keberadaan sesuatu. Gunakan there is untuk satu benda dan there are untuk benda jamak.",
    forms: ["There is + singular noun", "There are + plural noun", "There is no + noun"]
  },
  {
    id: "lookslike",
    name: "It looks like ...",
    formula: "It looks like + noun / clause",
    explanation: "Dipakai untuk menyampaikan dugaan berdasarkan apa yang terlihat. Ini belum tentu diagnosis akhir, jadi sampaikan sebagai kemungkinan.",
    forms: ["It looks like + noun", "It looks like + subject + verb"]
  },
  {
    id: "lookadj",
    name: "Look + adjective",
    formula: "Subject + looks + adjective",
    explanation: "Dipakai untuk menjelaskan kesan visual. “Looks” diikuti kata sifat, bukan kata keterangan.",
    forms: ["The cable looks + adjective", "Everything looks + adjective"]
  },
  {
    id: "needpassq",
    name: "Will ... need to be ...?",
    formula: "Will + subject + need to be + past participle?",
    explanation: "Dipakai untuk menanyakan apakah suatu benda atau sistem harus dikenai tindakan tertentu. Fokusnya pada tindakan yang perlu dilakukan, bukan pada pelakunya.",
    forms: ["Will the machine need to be stopped?", "Will the system need to be restarted?"]
  },
  {
    id: "measure",
    name: "Reporting a measurement",
    formula: "I measured + value + at + location",
    explanation: "Dipakai untuk melaporkan hasil pengukuran secara singkat dan jelas. Sebutkan nilai, satuan, dan titik pengukurannya.",
    forms: ["I measured + value + at + location", "I measured 24 volts at the input."]
  },
  {
    id: "comparative",
    name: "Comparative adjective",
    formula: "A + is + comparative adjective + than + B",
    explanation: "Dipakai untuk membandingkan dua kondisi. Untuk kata sifat pendek, tambahkan -er; untuk kata sifat panjang, gunakan more.",
    forms: ["higher than normal", "hotter than usual", "more stable than before"]
  },
  {
    id: "recommend",
    name: "Recommend + verb-ing",
    formula: "I recommend + verb-ing / noun",
    explanation: "Dipakai untuk memberi saran. Setelah recommend, gunakan verb-ing atau kata benda, bukan bentuk dasar tanpa perubahan.",
    forms: ["I recommend replacing this part.", "I recommend a follow-up inspection."]
  },
  {
    id: "available",
    name: "Availability",
    formula: "Who is / Is anyone / Are you available + to + base verb?",
    explanation: "Dipakai untuk menanyakan apakah seseorang tersedia untuk membantu. “Available” berarti sedang bisa dihubungi atau punya waktu.",
    forms: ["Who is available for + noun?", "Is anyone available to + base verb?", "Are you available for + noun?"]
  },
  {
    id: "ready",
    name: "Ready to + base verb",
    formula: "Subject + is/are + ready to + base verb",
    explanation: "Dipakai untuk menyatakan bahwa sesuatu sudah siap untuk langkah berikutnya. Setelah “ready to”, gunakan kata kerja bentuk dasar.",
    forms: ["The machine is ready to + base verb", "We are ready to + base verb"]
  },
  {
    id: "under",
    name: "Under observation",
    formula: "Subject + is + still under + noun",
    explanation: "Dipakai untuk mengatakan bahwa sesuatu masih dipantau. “Under observation” berarti dalam pengawasan, belum tentu sudah selesai.",
    forms: ["The machine is still under observation.", "The system is under review."]
  },
  {
    id: "scheduled",
    name: "Scheduled for + time",
    formula: "Subject + is + scheduled for + time",
    explanation: "Dipakai untuk menyebut jadwal yang sudah direncanakan. Gunakan “for” sebelum waktu atau tanggal.",
    forms: ["The inspection is scheduled for next month.", "The test is scheduled for Monday."]
  },
  {
    id: "letknow",
    name: "Let me know + before/if",
    formula: "Please let me know + before/if + clause",
    explanation: "Dipakai untuk meminta seseorang memberi kabar sebelum atau jika sesuatu terjadi. Setelah before, gunakan verb-ing atau klausa; setelah if, gunakan present simple.",
    forms: ["Please let me know before + verb-ing.", "Please let me know if + present simple."]
  },
  {
    id: "may",
    name: "May I ...?",
    formula: "May I + base verb (+ object)?",
    explanation: "Bentuk yang lebih formal untuk meminta izin. Seperti “Can I…?”, pertanyaan ini tidak otomatis memenuhi prosedur keselamatan.",
    forms: ["May I + base verb?"],
    safety: "Izin formal tetap bukan pengganti LOTO, work permit, atau verifikasi keselamatan."
  },
  {
    id: "cannot",
    name: "Cannot + base verb",
    formula: "Subject + cannot + base verb",
    explanation: "Dipakai untuk menyatakan ketidakmampuan atau larangan. “Cannot” lebih formal daripada “can’t”; keduanya diikuti kata kerja dasar.",
    forms: ["We cannot + base verb", "I cannot + base verb"]
  },
  {
    id: "notyet",
    name: "Has not been ... yet",
    formula: "Subject + has/have not been + past participle + yet",
    explanation: "Dipakai untuk mengatakan bahwa suatu tindakan atau hasil belum selesai sampai sekarang. “Yet” biasanya diletakkan di akhir kalimat.",
    forms: ["The issue has not been + past participle + yet.", "The checks have not been + past participle + yet."]
  },
  {
    id: "rootcause",
    name: "The root cause is ...",
    formula: "The root cause is + noun / noun phrase",
    explanation: "Dipakai untuk menyebut penyebab utama suatu masalah. Gunakan hanya setelah penyebabnya cukup yakin, bukan sekadar dugaan.",
    forms: ["The root cause is + noun", "The root cause was + noun"]
  },
  {
    id: "thisneeds",
    name: "This needs + noun",
    formula: "This needs + noun",
    explanation: "Dipakai untuk menyatakan bahwa suatu hal memerlukan tindakan atau sumber daya tambahan. Setelah needs, gunakan kata benda.",
    forms: ["This needs further investigation.", "This needs a follow-up test."]
  },
  {
    id: "dymean",
    name: "Do you mean ...?",
    formula: "Do you mean (that) + clause?",
    explanation: "Dipakai untuk memastikan maksud lawan bicara dengan mengulang pemahamanmu. Ini lebih sopan daripada hanya mengatakan tidak mengerti.",
    forms: ["Do you mean I should + base verb?", "Do you mean the + noun + is + adjective?"]
  },
  {
    id: "yesno",
    name: "Yes/no question",
    formula: "Auxiliary + subject + main verb ...?",
    explanation: "Dipakai untuk pertanyaan yang jawabannya ya atau tidak. Letakkan auxiliary (is/are/do/does/can/will) di depan subjek.",
    forms: ["Is it + adjective / past participle?", "Will + subject + base verb?", "Can + subject + base verb?"]
  },
  {
    id: "isthere",
    name: "Is there ...?",
    formula: "Is there + noun + ...?",
    explanation: "Dipakai untuk menanyakan apakah ada sesuatu. Gunakan is there untuk benda tunggal atau tidak terhitung, dan are there untuk benda jamak.",
    forms: ["Is there + singular noun?", "Are there + plural noun?"]
  },
  {
    id: "willtherebe",
    name: "Will there be ...?",
    formula: "Will there be + noun ...?",
    explanation: "Dipakai untuk menanyakan apakah akan ada suatu dampak atau kejadian di masa depan. Setelah “Will there be”, gunakan kata benda.",
    forms: ["Will there be + noun?", "Will there be any + noun?"]
  },
  {
    id: "doneed",
    name: "Do we need to ...?",
    formula: "Do we need to + base verb ...?",
    explanation: "Dipakai untuk menanyakan apakah suatu tindakan memang diperlukan. Setelah “need to”, gunakan kata kerja bentuk dasar.",
    forms: ["Do we need to + base verb?", "Do I need to + base verb?"]
  },
  {
    id: "futurecont",
    name: "Future continuous",
    formula: "Subject + will be + verb-ing",
    explanation: "Dipakai untuk menyebut kegiatan yang akan sedang berlangsung pada waktu tertentu di masa depan, termasuk saat serah terima shift.",
    forms: ["I will be + verb-ing", "Team B will be + verb-ing"]
  }
];

export const PROGRAM_DAYS = [
  {
    day: 1,
    phase: "Fondasi",
    title: "Menghubungi remote support",
    goal: "Memperkenalkan diri, menjelaskan masalah awal, dan meminta sesi remote.",
    items: [
      {
        id: "rs-01",
        pattern: "pc",
        focus: "“I’m calling” memakai present continuous karena panggilan sedang berlangsung saat kamu berbicara.",
        context: "Kamu menelepon engineer remote dari lokasi bandara dan mulai dengan memperkenalkan asal panggilan.",
        examples: ["I’m calling from the control room.","I’m calling about the conveyor alarm.","I’m calling from Terminal 2."],
        prompt: "Perkenalkan diri bahwa kamu sedang menelepon dari Terminal 1."
      },
      {
        id: "rs-02",
        pattern: "pc",
        focus: "“I’m having an issue” menjelaskan masalah yang sedang kamu alami, bukan masalah yang sudah selesai.",
        context: "Kamu ingin langsung menyampaikan bahwa ada masalah pada mesin sebelum menjelaskan detailnya.",
        examples: ["I’m having trouble with the HMI.","We’re having a problem with the network.","The controller is having trouble communicating."],
        prompt: "Katakan bahwa kamu sedang mengalami masalah pada panel kontrol."
      },
      {
        id: "rs-03",
        pattern: "could",
        focus: "“Could you help me” adalah permintaan sopan; setelah could, “help” tetap bentuk dasar.",
        context: "Kamu membutuhkan bantuan engineer remote dan ingin memintanya dengan sopan.",
        examples: ["Could you help me with this alarm?","Could you help me check the connection?","Could you help me understand this error?"],
        prompt: "Minta bantuan engineer remote untuk memeriksa alarm yang aktif."
      },
      {
        id: "rs-04",
        pattern: "could",
        focus: "“Could we start” mengajukan kemungkinan memulai sesi bersama, bukan memberi perintah.",
        context: "Kamu sudah siap dan ingin mengajak engineer remote memulai sesi remote.",
        examples: ["Could we start the session now?","Could we schedule the session for 2 PM?","Could I share my screen first?"],
        prompt: "Tanyakan apakah kalian bisa memulai sesi remote sekarang."
      },
      {
        id: "rs-05",
        pattern: "be",
        focus: "“I’m ready” memakai be + adjective. Bagian “when you are” adalah bentuk singkat dari “when you are ready”.",
        context: "Kamu sudah menyiapkan laptop dan koneksi, lalu memberi tahu engineer remote bahwa kamu siap.",
        examples: ["The machine is ready when the line stops.","We’re ready when the customer approves."],
        prompt: "Katakan bahwa kamu siap kapan pun engineer remote siap."
      }
    ]
  },
  {
    day: 2,
    phase: "Fondasi",
    title: "Laporan awal di lokasi",
    goal: "Menyampaikan posisi, aktivitas, waktu kejadian, dan kode alarm.",
    items: [
      {
        id: "rs-06",
        pattern: "please",
        focus: "“Please give me a moment” adalah imperatif sopan; “to connect” menjelaskan tujuan permintaan itu.",
        context: "Kamu perlu waktu sebentar untuk menghubungkan laptop sebelum sesi remote dimulai.",
        examples: ["Please give me a minute to open the panel.","Please give me a moment to check the cable.","Please give me time to take a photo."],
        prompt: "Minta waktu sebentar untuk menghubungkan laptop ke jaringan."
      },
      {
        id: "init-01",
        pattern: "be",
        focus: "“I’m on site” memakai be + keterangan tempat untuk menyatakan posisi saat ini.",
        context: "Kamu baru tiba di lokasi dan memberi tahu remote engineer bahwa kamu sudah berada di sana.",
        examples: ["I’m in the control room now.","The technician is at the machine now.","We’re on site and ready to start."],
        prompt: "Katakan bahwa kamu sudah berada di lokasi sekarang."
      },
      {
        id: "init-02",
        pattern: "pc",
        focus: "“I’m checking” menunjukkan pemeriksaan sedang berlangsung, jadi jawabannya cocok saat engineer bertanya apa yang sedang kamu lakukan.",
        context: "Engineer remote bertanya apa aktivitasmu saat ini di depan mesin.",
        examples: ["I’m checking the power supply.","I’m testing the sensor.","I’m inspecting the cable."],
        prompt: "Jawab bahwa kamu sedang memeriksa mesin."
      },
      {
        id: "init-03",
        pattern: "past",
        focus: "“Stopped” adalah simple past karena mesin sudah berhenti. Bagian “is still active” memakai present karena alarm belum hilang.",
        context: "Kamu melaporkan waktu mesin berhenti sekaligus menegaskan bahwa alarm masih aktif.",
        examples: ["The line stopped at around 09:00, and the alarm is still active.","The machine stopped this morning, and the error is still showing.","The conveyor stopped ten minutes ago, and the warning light is still on."],
        prompt: "Laporkan bahwa mesin berhenti sekitar pukul 08.15 dan alarmnya masih aktif."
      },
      {
        id: "init-04",
        pattern: "ps",
        focus: "“Shows” memakai -s karena subjeknya HMI (it). Ini fakta yang terlihat di layar saat ini.",
        context: "Kamu membaca kode error di layar HMI dan menyampaikannya kepada engineer remote.",
        examples: ["The panel shows error code E-101.","The HMI displays a communication warning.","The screen shows the same alarm again."],
        prompt: "Katakan bahwa HMI menampilkan kode error E-204."
      }
    ]
  },
  {
    day: 3,
    phase: "Fondasi",
    title: "Gejala dan akses awal",
    goal: "Menjelaskan performa mesin, akses server, lampu indikator, dan sensor.",
    items: [
      {
        id: "init-05",
        pattern: "pc",
        focus: "“Is running” menyatakan sistem masih beroperasi, sedangkan “but it’s very slow” menambahkan kondisi yang menyimpang.",
        context: "Mesin tidak mati, tetapi operator melaporkan responsnya jauh lebih lambat dari biasanya.",
        examples: ["The conveyor is running, but it’s very slow.","The system is online, but it’s unstable.","The motor is working, but it’s overheating."],
        prompt: "Laporkan bahwa sistem berjalan tetapi sangat lambat."
      },
      {
        id: "init-06",
        pattern: "can",
        focus: "“Can’t access” menyatakan ketidakmampuan. Kalimat kedua memakai present simple karena server tidak merespons secara konsisten.",
        context: "Kamu mencoba membuka server dari laptop, tetapi tidak ada respons sama sekali.",
        examples: ["I can’t open the HMI page.","I can’t connect to the controller.","The server doesn’t respond to ping."],
        prompt: "Katakan bahwa kamu tidak bisa mengakses server dan server tidak merespons ping."
      },
      {
        id: "init-07",
        pattern: "be",
        focus: "“Is off” memakai be + adjective untuk menyebut kondisi LED, bukan tindakan mematikan.",
        context: "Kamu memeriksa indikator catu daya dan melihat lampunya tidak menyala.",
        examples: ["The status LED is off.","The power light is off.","The display is dark."],
        prompt: "Laporkan bahwa LED catu daya mati."
      },
      {
        id: "init-08",
        pattern: "pc",
        focus: "“Is blinking” menunjukkan lampu berkedip, tetapi “there’s no connection” menegaskan koneksi tetap tidak tersedia.",
        context: "Lampu link LAN berkedip, namun laptop tetap tidak mendapat koneksi ke jaringan.",
        examples: ["The link light is blinking, but the network is still down.","The port light is on, but there’s no traffic.","The LED is flashing, but the connection is not stable."],
        prompt: "Laporkan bahwa lampu link LAN berkedip tetapi tidak ada koneksi."
      },
      {
        id: "pr-01",
        pattern: "pc",
        focus: "Bentuk negatif present continuous: is + not + working. “Properly” menjelaskan bahwa sensor tidak berfungsi sebagaimana mestinya.",
        context: "Kamu menjelaskan masalah sensor kepada engineer remote tanpa menyebut penyebabnya terlebih dahulu.",
        examples: ["The sensor is not responding properly.","The camera is not working correctly.","The limit switch is not operating normally."],
        prompt: "Katakan bahwa sensor tidak berfungsi dengan baik."
      }
    ]
  },
  {
    day: 4,
    phase: "Fondasi",
    title: "Menjelaskan riwayat masalah",
    goal: "Menyampaikan kapan masalah terjadi, seberapa sering, dan apa yang ditampilkan sistem.",
    items: [
      {
        id: "pr-02",
        pattern: "past",
        focus: "“Stopped” adalah simple past karena mesin sudah berhenti pagi ini. Waktu “this morning” memperjelas kapan kejadiannya.",
        context: "Kamu melaporkan kejadian yang sudah selesai terjadi pada pagi hari.",
        examples: ["The pump stopped this morning.","The line stopped after the alarm.","The system shut down at 07:40."],
        prompt: "Katakan bahwa mesin berhenti bekerja pagi ini."
      },
      {
        id: "pr-03",
        pattern: "ps",
        focus: "“Happens” memakai -s karena subjeknya the problem (it). “Every time” menunjukkan kejadian berulang.",
        context: "Masalah muncul lagi setiap kali mesin dinyalakan, jadi kamu menjelaskan polanya.",
        examples: ["The alarm happens every time we start the line.","The error appears every time we reset the controller.","The machine stops every time we run the test."],
        prompt: "Jelaskan bahwa masalah terjadi setiap kali mesin dinyalakan."
      },
      {
        id: "pr-04",
        pattern: "ps",
        focus: "“Says” dipakai karena pesan error adalah teks yang ditampilkan sistem. Kutipan pesan tetap dipertahankan apa adanya.",
        context: "Kamu membacakan pesan error dari layar agar engineer remote tahu teks persisnya.",
        examples: ["The error message says “Connection lost.”","The display says “Sensor not detected.”","The log says “Communication timeout.”"],
        prompt: "Sampaikan bahwa pesan kesalahan berbunyi “Communication timeout.”"
      },
      {
        id: "pr-05",
        pattern: "past",
        focus: "“Worked” adalah simple past. Bagian “but not today” adalah bentuk singkat dari “but it did not work today”, sehingga perbandingannya tetap jelas.",
        context: "Kamu memberi tahu engineer remote bahwa mesin sebelumnya normal, sehingga perubahan perilakunya lebih mudah dilacak.",
        examples: ["It worked fine last week, but not today.","The sensor worked yesterday, but it failed this morning.","The connection was stable before, but not now."],
        prompt: "Katakan bahwa kemarin mesin berjalan normal, tetapi hari ini tidak."
      },
      {
        id: "pr-06",
        pattern: "pc",
        focus: "“Is making” memakai present continuous karena suara tidak biasa itu sedang terdengar saat kamu melaporkannya.",
        context: "Saat berdiri di dekat mesin, kamu mendengar suara yang berbeda dari biasanya dan melaporkannya.",
        examples: ["The pump is making a strange noise.","The motor is making a clicking sound.","The fan is making a loud noise."],
        prompt: "Laporkan bahwa mesin sedang mengeluarkan suara yang tidak biasa."
      }
    ]
  },
  {
    day: 5,
    phase: "Fondasi",
    title: "Pemeriksaan visual",
    goal: "Memeriksa kabel, konektor, dan tanda kerusakan yang terlihat.",
    items: [
      {
        id: "cab-01",
        pattern: "be",
        focus: "“Is connected” adalah be + past participle yang berfungsi seperti kata sifat: kabel berada dalam kondisi terhubung.",
        context: "Kamu memastikan kabel sudah terpasang dengan benar sebelum melanjutkan troubleshooting.",
        examples: ["The sensor cable is connected properly.","The power cable is connected securely.","The network cable is connected to the switch."],
        prompt: "Katakan bahwa kabel sudah terpasang dengan benar."
      },
      {
        id: "cab-05",
        pattern: "be",
        focus: "“Is plugged into” memakai be + past participle untuk menyebut posisi konektor. “Into” menunjukkan tujuan colokan.",
        context: "Kamu memeriksa apakah kabel LAN berada di porta yang benar, bukan di porta lain.",
        examples: ["The cable is plugged into port 2.","The connector is plugged into the correct socket.","The power cord is plugged into the UPS."],
        prompt: "Katakan bahwa kabel sudah dicolokkan ke porta yang benar."
      },
      {
        id: "cab-06",
        pattern: "lookadj",
        focus: "“Looks damaged” memakai look + adjective. Ini kesan visual, jadi belum tentu hasil pengukuran.",
        context: "Kamu melihat kondisi fisik kabel dan ingin melaporkan kemungkinan kerusakan.",
        examples: ["The connector looks damaged.","The cable jacket looks cracked.","The terminal looks loose."],
        prompt: "Laporkan bahwa kabel LAN tampak rusak."
      },
      {
        id: "obs-01",
        pattern: "can",
        focus: "“Can see” menyatakan kemampuan melihat. Setelah can, “see” tetap bentuk dasar.",
        context: "Kamu menemukan tanda terbakar pada konektor saat memeriksa panel.",
        examples: ["I can see a crack on the connector.","I can see some dust inside the panel.","I can see a loose wire near the terminal."],
        prompt: "Katakan bahwa kamu melihat bekas terbakar pada konektor."
      },
      {
        id: "obs-02",
        pattern: "lookadj",
        focus: "“Looks loose” memakai look + adjective untuk menyampaikan dugaan berdasarkan tampilan kabel di terminal.",
        context: "Kabel tampak tidak terpasang rapat, tetapi kamu belum menarik atau mengencangkannya.",
        examples: ["The wire looks loose at the terminal.","The connector looks loose.","The grounding cable looks loose."],
        prompt: "Katakan bahwa kabel tampak longgar di terminal."
      }
    ]
  },
  {
    day: 6,
    phase: "Fondasi",
    title: "Suara, suhu, dan pengukuran",
    goal: "Melaporkan gejala fisik dan hasil pengukuran dengan angka yang jelas.",
    items: [
      {
        id: "obs-03",
        pattern: "theres",
        focus: "“There’s” adalah singkatan dari “there is” karena noise tidak terhitung (uncountable).",
        context: "Kamu mendengar suara tidak biasa dari arah motor dan melaporkannya sebagai gejala.",
        examples: ["There’s a strange noise coming from the pump.","There’s a vibration from the motor.","There’s a clicking sound near the relay."],
        prompt: "Laporkan bahwa ada suara tidak biasa dari motor."
      },
      {
        id: "obs-04",
        pattern: "comparative",
        focus: "“Higher than normal” membandingkan suhu saat ini dengan kondisi normal. “Higher” adalah bentuk comparative dari high.",
        context: "Kamu memeriksa suhu di dalam panel dan melihat angkanya lebih tinggi dari biasanya.",
        examples: ["The temperature inside the cabinet is higher than normal.","The motor is hotter than usual.","The pressure is higher than the set point."],
        prompt: "Katakan bahwa suhu di dalam panel lebih tinggi dari normal."
      },
      {
        id: "obs-05",
        pattern: "measure",
        focus: "“Measured 24 volts at the input” menyebut nilai, satuan, dan titik pengukuran. “Which is normal” menambahkan penilaian.",
        context: "Kamu mengukur tegangan input dan hasilnya sesuai dengan nilai yang diharapkan.",
        examples: ["I measured 12 volts at the sensor, which is correct.","I measured 230 volts at the main supply."],
        prompt: "Laporkan bahwa kamu mengukur 24 volt di input dan itu normal."
      },
      {
        id: "obs-06",
        pattern: "measure",
        focus: "Pola yang sama dipakai untuk hasil nol. “Measured 0 volts” langsung menunjukkan tidak ada tegangan di titik itu.",
        context: "Kamu mengukur output catu daya dan tidak menemukan tegangan sama sekali.",
        examples: ["I measured 0 volts at terminal 3.","I measured no voltage at the output."],
        prompt: "Laporkan bahwa kamu mengukur 0 volt di output."
      },
      {
        id: "obs-07",
        pattern: "theres",
        focus: "“There is no voltage” memakai there is + no + noun untuk menyatakan tidak ada tegangan.",
        context: "Kamu memeriksa terminal catu daya dan tidak menemukan tegangan sama sekali.",
        examples: ["There is no voltage at the output terminal.","There is no power at the socket.","There is no signal from the sensor."],
        prompt: "Katakan bahwa tidak ada tegangan di terminal catu daya."
      }
    ]
  },
  {
    day: 7,
    phase: "Fondasi",
    title: "Memeriksa catu daya",
    goal: "Membaca kondisi PSU, kipas, cadangan, dan hasil pengukuran tegangan.",
    items: [
      {
        id: "psu-01",
        pattern: "be",
        focus: "“Is switched off” adalah be + past participle. Fokusnya pada kondisi PSU, bukan siapa yang mematikannya.",
        context: "Kamu menemukan PSU dalam kondisi mati saat memeriksa panel.",
        examples: ["The main breaker is switched off.","The control circuit is switched off."],
        prompt: "Katakan bahwa catu daya dalam keadaan mati."
      },
      {
        id: "psu-02",
        pattern: "still",
        focus: "“Is still powered on” berarti mesin belum benar-benar mati. “Still” ditempatkan sebelum powered on.",
        context: "Kamu memeriksa mesin dan mendapati indikator serta perangkat masih menyala.",
        examples: ["The controller is still powered on.","The panel is still energized."],
        prompt: "Katakan bahwa mesin masih dalam keadaan menyala."
      },
      {
        id: "psu-03",
        pattern: "ps",
        focus: "“I have” adalah present simple dari have. Di sini have berarti memiliki, bukan tindakan yang sedang berlangsung.",
        context: "Kamu memeriksa stok dan menemukan satu PSU cadangan yang bisa digunakan.",
        examples: ["I have a spare fuse.","We have one spare PSU in the store.","The site has a replacement fan."],
        prompt: "Katakan bahwa kamu punya PSU cadangan."
      },
      {
        id: "psu-05",
        pattern: "pp",
        focus: "“I’ve checked” adalah present perfect: pemeriksaan sudah selesai dan hasilnya relevan untuk langkah berikutnya.",
        context: "Kamu sudah mengukur tegangan catu daya dan siap melaporkan hasilnya.",
        examples: ["I’ve checked the input voltage.","I’ve measured the output voltage.","I’ve tested the power supply."],
        prompt: "Katakan bahwa kamu sudah memeriksa tegangan catu daya."
      },
      {
        id: "psu-06",
        pattern: "pc",
        focus: "Bentuk negatif present continuous: is + not + spinning. Ini menunjukkan kipas tidak berputar saat mesin diperiksa.",
        context: "Kamu melihat kipas PSU diam, padahal seharusnya berputar saat unit menyala.",
        examples: ["The cooling fan is not spinning.","The PSU fan is not turning.","The fan is not running at full speed."],
        prompt: "Laporkan bahwa kipas PSU tidak berputar."
      }
    ]
  },
  {
    day: 8,
    phase: "Fondasi",
    title: "Tindakan pada kabel",
    goal: "Meminta reseat, melaporkan hasil, dan mengganti kabel dengan aman.",
    items: [
      {
        id: "cab-02",
        pattern: "please",
        focus: "“Please reseat” adalah imperatif sopan. “Reseat” berarti mencabut lalu memasang kembali konektor pada tempatnya.",
        context: "Engineer remote meminta kamu memasang ulang kabel LAN di slot yang sudah ditentukan.",
        examples: ["Please reseat the connector on port 1.","Please reseat the power cable.","Please reseat the sensor plug."],
        prompt: "Minta agar kabel LAN di slot nol dicabut dan dipasang kembali."
      },
      {
        id: "cab-03",
        pattern: "pp",
        focus: "“I’ve reseated” memakai present perfect karena tindakan sudah selesai dan hasilnya sekarang bisa diperiksa.",
        context: "Kamu sudah melakukan reseat kabel LAN dan memberi tahu engineer remote bahwa langkah itu selesai.",
        examples: ["I’ve reseated the connector.","I’ve reconnected the sensor cable.","I’ve plugged the cable back in."],
        prompt: "Katakan bahwa kamu sudah mencabut dan memasang kembali kabel LAN."
      },
      {
        id: "cab-04",
        pattern: "past",
        focus: "“Checked” adalah simple past. “Both ends” menunjukkan kedua ujung kabel sudah diperiksa.",
        context: "Kamu memeriksa koneksi di kedua ujung kabel sebelum melanjutkan ke langkah berikutnya.",
        examples: ["I inspected the connector at the panel.","I tested the cable with a tester."],
        prompt: "Katakan bahwa kamu sudah memeriksa kedua ujung kabel."
      },
      {
        id: "cab-07",
        pattern: "pp",
        focus: "“I’ve replaced” menekankan bahwa penggantian sudah selesai. “With a new one” menjelaskan benda penggantinya.",
        context: "Kabel lama sudah diganti dengan kabel baru, dan kamu melaporkan hasil tindakan itu.",
        examples: ["I’ve replaced the sensor cable with a new one.","I’ve swapped the patch cable.","I’ve installed a new LAN cable."],
        prompt: "Katakan bahwa kamu sudah mengganti kabel LAN dengan yang baru."
      },
      {
        id: "cab-08",
        pattern: "be",
        focus: "“Is on” memakai be + adverb untuk menyebut kondisi lampu. “Now” menunjukkan perubahan setelah tindakan.",
        context: "Setelah kabel diganti, kamu melihat lampu link menyala dan melaporkan perubahan itu.",
        examples: ["The status LED is green now.","The port light is active again."],
        prompt: "Laporkan bahwa lampu koneksi sekarang menyala."
      }
    ]
  },
  {
    day: 9,
    phase: "Fondasi",
    title: "Pemeriksaan sensor",
    goal: "Menjelaskan gejala sensor, membersihkan, dan memeriksa koneksinya.",
    items: [
      {
        id: "sen-01",
        pattern: "pc",
        focus: "“Is not detecting” adalah present continuous negatif. Sensor sedang tidak mendeteksi gerakan saat diuji.",
        context: "Kamu menguji sensor dengan menggerakkan objek di depannya, tetapi tidak ada respons.",
        examples: ["The sensor is not detecting the box.","The photoelectric sensor is not sensing any object.","The proximity sensor is not detecting metal."],
        prompt: "Katakan bahwa sensor tidak mendeteksi gerakan apa pun."
      },
      {
        id: "sen-02",
        pattern: "pc",
        focus: "“Is not turning on” menunjukkan lampu sensor tidak menyala saat diberi daya atau saat objek lewat.",
        context: "Kamu memeriksa indikator sensor dan tidak melihat lampu yang biasanya menyala.",
        examples: ["The sensor LED is not turning on.","The indicator light is not lighting up.","The output light is not coming on."],
        prompt: "Laporkan bahwa lampu sensor tidak menyala."
      },
      {
        id: "sen-03",
        pattern: "pc",
        focus: "“Is giving” memakai present continuous karena sensor terus menghasilkan pembacaan yang salah saat diamati.",
        context: "Nilai sensor berubah-ubah atau tidak sesuai walaupun tidak ada objek di depannya.",
        examples: ["The sensor is giving an unstable reading.","The temperature probe is giving a false value.","The encoder is giving incorrect feedback."],
        prompt: "Katakan bahwa sensor memberikan pembacaan yang salah."
      },
      {
        id: "sen-04",
        pattern: "pp",
        focus: "“I’ve cleaned” menyatakan pembersihan sudah selesai; hasilnya masih perlu diuji.",
        context: "Kamu membersihkan lensa sensor dari debu sebelum menguji ulang.",
        examples: ["I’ve cleaned the sensor lens.","I’ve wiped the dust off the sensor.","I’ve cleaned the reflector."],
        prompt: "Katakan bahwa kamu sudah membersihkan sensor."
      },
      {
        id: "sen-05",
        pattern: "pp",
        focus: "“I’ve checked” menekankan pemeriksaan koneksi sudah dilakukan dan hasilnya siap dilaporkan.",
        context: "Kamu memeriksa konektor dan kabel sensor untuk memastikan tidak ada koneksi yang longgar.",
        examples: ["I’ve checked the sensor cable.","I’ve inspected the sensor connector.","I’ve verified the sensor wiring."],
        prompt: "Katakan bahwa kamu sudah memeriksa koneksi sensor."
      }
    ]
  },
  {
    day: 10,
    phase: "Fondasi",
    title: "Perangkat lunak dan jaringan",
    goal: "Menjelaskan dugaan masalah software, akses jaringan, dan tindakan instalasi.",
    items: [
      {
        id: "net-01",
        pattern: "ps",
        focus: "“I suspect” adalah present simple. Setelah suspect, kamu bisa menambahkan klausa “it might be…” untuk menyampaikan dugaan.",
        context: "Kamu belum menemukan bukti fisik, tetapi gejala mengarah ke masalah perangkat lunak.",
        examples: ["I suspect it might be a network issue.","I suspect the controller is not responding.","I think it might be a configuration problem."],
        prompt: "Katakan bahwa kamu menduga ini mungkin masalah perangkat lunak."
      },
      {
        id: "net-02",
        pattern: "cannot",
        focus: "“Cannot connect” memakai cannot + base verb. Ini menyatakan komputer tidak mampu membuka koneksi.",
        context: "Komputer di panel tidak bisa terhubung ke jaringan walaupun kabel sudah terpasang.",
        examples: ["The laptop cannot connect to the network.","The HMI cannot reach the server.","The controller cannot join the network."],
        prompt: "Katakan bahwa komputer tidak bisa terhubung ke jaringan."
      },
      {
        id: "net-03",
        pattern: "pp",
        focus: "“I’ve checked” menunjukkan pemeriksaan alamat IP sudah selesai. Hasilnya bisa dibandingkan dengan konfigurasi yang benar.",
        context: "Kamu memeriksa alamat IP komputer untuk memastikan berada di subnet yang sama dengan perangkat lain.",
        examples: ["I’ve verified the subnet mask.","I’ve confirmed the gateway address."],
        prompt: "Katakan bahwa kamu sudah memeriksa alamat IP."
      },
      {
        id: "net-04",
        pattern: "pc",
        focus: "“Is not responding” menjelaskan software yang sedang tidak merespons saat kamu mencoba membukanya.",
        context: "Aplikasi di HMI macet dan tidak bereaksi terhadap klik atau perintah.",
        examples: ["The HMI software is not responding.","The application is not responding.","The control program is frozen."],
        prompt: "Laporkan bahwa perangkat lunak tidak merespons."
      },
      {
        id: "net-05",
        pattern: "pp",
        focus: "“I’ve reinstalled” menyatakan instalasi ulang sudah selesai. Langkah berikutnya biasanya memeriksa hasilnya.",
        context: "Kamu memasang ulang aplikasi untuk mengatasi masalah software dan melaporkan tindakan itu.",
        examples: ["I’ve reinstalled the HMI software.","I’ve reinstalled the driver.","I’ve restored the backup configuration."],
        prompt: "Katakan bahwa kamu sudah memasang ulang perangkat lunak."
      }
    ]
  },
  {
    day: 11,
    phase: "Fondasi",
    title: "Menutup pemeriksaan jaringan",
    goal: "Melaporkan hasil ping, koneksi stabil, dan meminta pemeriksaan dari sisi remote.",
    items: [
      {
        id: "net-06",
        pattern: "pp",
        focus: "“I’ve pinged” memakai present perfect karena hasil ping masih relevan sekarang. “It responded” memakai simple past untuk respons yang sudah selesai.",
        context: "Kamu melakukan ping ke server dan mendapat respons, sehingga jalur jaringan dasar bisa dipastikan hidup.",
        examples: ["I’ve pinged the server, and it has responded.","I’ve tested the gateway, and it replied.","I’ve pinged the controller, and the request succeeded."],
        prompt: "Katakan bahwa kamu sudah melakukan ping ke server dan server merespons."
      },
      {
        id: "net-07",
        pattern: "be",
        focus: "“Is stable” memakai be + adjective untuk menyatakan kondisi koneksi saat ini, bukan tindakan.",
        context: "Setelah kabel atau konfigurasi diperbaiki, koneksi jaringan tidak lagi terputus-putus.",
        examples: ["The connection is stable now.","The network link is stable.","The signal is stable after the reset."],
        prompt: "Katakan bahwa koneksi jaringan sekarang stabil."
      },
      {
        id: "net-08",
        pattern: "could",
        focus: "“Could you check” meminta engineer remote memeriksa sisi mereka. Setelah could, “check” tetap bentuk dasar.",
        context: "Kamu ingin memastikan konfigurasi di sisi server juga benar sebelum menyimpulkan masalahnya.",
        examples: ["Could you check the firewall rules?","Could you check the DHCP settings?","Could you check the server logs?"],
        prompt: "Minta engineer remote memeriksa pengaturan jaringan di sisi mereka."
      },
      {
        id: "help-07",
        pattern: "could",
        focus: "“Could you check the logs” adalah permintaan sopan untuk melihat data yang hanya bisa diakses dari sisi remote.",
        context: "Kamu membutuhkan catatan log server yang tidak tersedia di laptop lokasi.",
        examples: ["Could you check the event log?","Could you review the connection log?"],
        prompt: "Minta engineer remote memeriksa log dari sisi mereka."
      },
      {
        id: "help-09",
        pattern: "could",
        focus: "Pola permintaan yang sama dipakai untuk koneksi. “The connection” membuat objeknya jelas.",
        context: "Kamu meminta engineer remote memeriksa status koneksi dari sisi server.",
        examples: ["Could you check the connection from your side?","Could you check the network status?","Could you verify the link?"],
        prompt: "Minta engineer remote memeriksa koneksinya."
      }
    ]
  },
  {
    day: 12,
    phase: "Komunikasi",
    title: "Meminta klarifikasi",
    goal: "Mengulang, menjelaskan ulang, dan memastikan maksud instruksi.",
    items: [
      {
        id: "clar-01",
        pattern: "could",
        focus: "“Could you repeat” adalah permintaan langsung tetapi sopan. “That” merujuk pada ucapan sebelumnya.",
        context: "Kamu tidak menangkap instruksi dengan jelas dan ingin mengulanginya sebelum bertindak.",
        examples: ["Could you repeat the last step, please?","Could you repeat the error code?","Could you repeat that a little louder?"],
        prompt: "Minta engineer remote mengulang instruksinya."
      },
      {
        id: "clar-02",
        pattern: "could",
        focus: "“Could you explain that again” meminta penjelasan ulang, bukan sekadar pengulangan kata.",
        context: "Kamu mendengar instruksinya, tetapi belum memahami alasan atau urutannya.",
        examples: ["Could you explain the procedure again?","Could you explain that step again?","Could you explain how the sensor works?"],
        prompt: "Minta engineer remote menjelaskan instruksinya lagi."
      },
      {
        id: "clar-03",
        pattern: "wh",
        focus: "“What should I do next?” memakai what + should + I + base verb untuk menanyakan langkah berikutnya.",
        context: "Kamu sudah menyelesaikan satu langkah dan perlu tahu apa yang harus dilakukan setelahnya.",
        examples: ["What should I check next?","What should I do after the reset?","What should I test now?"],
        prompt: "Tanyakan apa yang harus kamu lakukan selanjutnya."
      },
      {
        id: "clar-04",
        pattern: "isthere",
        focus: "“Is there anything else” menanyakan keberadaan hal lain. “I need to check” menjelaskan hal yang dimaksud.",
        context: "Kamu hampir menyelesaikan pemeriksaan dan ingin memastikan tidak ada langkah yang terlewat.",
        examples: ["Is there anything else I need to inspect?","Is there anything else I should check?","Is there another test I need to run?"],
        prompt: "Tanyakan apakah ada hal lain yang perlu kamu periksa."
      },
      {
        id: "clar-05",
        pattern: "dymean",
        focus: "“Do you mean I should…” mengulang pemahaman dalam bentuk pertanyaan. “Should” tetap diikuti kata kerja dasar.",
        context: "Kamu ingin memastikan bahwa instruksi remote benar-benar berarti restart mesin, bukan hanya layanannya.",
        examples: ["Do you mean I should restart the controller?","Do you mean I should replace the cable?","Do you mean the alarm is still active?"],
        prompt: "Tanyakan apakah maksud engineer remote adalah kamu harus memulai ulang mesin."
      }
    ]
  },
  {
    day: 13,
    phase: "Komunikasi",
    title: "Lebih lambat dan dengan cara lain",
    goal: "Meminta pengulangan yang lebih lambat, menjelaskan ulang, dan meminta diagram.",
    items: [
      {
        id: "clar-06",
        pattern: "could",
        focus: "“Could you speak more slowly” menempatkan “more slowly” setelah verb untuk menjelaskan caranya.",
        context: "Engineer remote berbicara terlalu cepat, sehingga kamu meminta tempo yang lebih lambat.",
        examples: ["Could you speak more clearly?","Could you slow down a little?"],
        prompt: "Minta engineer remote berbicara sedikit lebih lambat."
      },
      {
        id: "clar-07",
        pattern: "past",
        focus: "“Didn’t catch” adalah simple past negatif dari catch. Artinya kamu belum menangkap atau memahami ucapan tadi.",
        context: "Kamu melewatkan sebagian instruksi karena suara atau koneksi kurang jelas.",
        examples: ["Sorry, I didn’t catch the last part.","Sorry, I didn’t hear the error code.","Sorry, I didn’t get the step number."],
        prompt: "Katakan maaf kamu tidak menangkap maksud ucapan tadi."
      },
      {
        id: "help-01",
        pattern: "could",
        focus: "“Could you repeat that more slowly” menggabungkan permintaan mengulang dengan keterangan cara.",
        context: "Kamu perlu mendengar instruksi yang sama sekali lagi dengan tempo lebih lambat.",
        examples: ["Could you repeat the procedure more slowly, please?","Could you repeat the code more slowly?","Could you say the terminal number again?"],
        prompt: "Minta engineer remote mengulanginya lebih lambat."
      },
      {
        id: "help-02",
        pattern: "past",
        focus: "“Didn’t understand” menyatakan pemahaman belum tercapai. Kalimat kedua memakai “Could you explain…” untuk meminta cara lain.",
        context: "Kamu sudah mendengar instruksi, tetapi masih belum mengerti langkahnya dan butuh penjelasan berbeda.",
        examples: ["Sorry, I didn’t understand the step. Could you explain it another way?","I didn’t understand the diagram. Could you describe it again?","We didn’t understand the alarm. Could you explain the cause?"],
        prompt: "Katakan maaf kamu tidak mengerti, lalu minta penjelasan dengan cara lain."
      },
      {
        id: "help-03",
        pattern: "could",
        focus: "“Can you send” adalah permintaan dengan can. “Send me” menunjukkan penerima dokumennya.",
        context: "Kamu membutuhkan diagram kabel untuk memastikan terminal yang harus diperiksa.",
        examples: ["Could you send me the manual?","Can you share the configuration file?"],
        prompt: "Minta engineer remote mengirimkan diagram kabel."
      }
    ]
  },
  {
    day: 14,
    phase: "Komunikasi",
    title: "Bertanya apa dan di mana",
    goal: "Menanyakan urutan pemeriksaan, bantuan menelusuri proses, dan langkah jika masalah berlanjut.",
    items: [
      {
        id: "help-04",
        pattern: "wh",
        focus: "“Which terminal should I check first?” memakai which + noun + should + I. “First” menunjukkan urutan.",
        context: "Kamu melihat beberapa terminal dan ingin tahu mana yang harus diperiksa lebih dulu.",
        examples: ["Which connector should I check first?","Which cable should I test first?","Which port should I inspect first?"],
        prompt: "Tanyakan terminal mana yang harus kamu periksa dulu."
      },
      {
        id: "help-08",
        pattern: "could",
        focus: "“Could you check the sensor” meminta pemeriksaan sensor dari sisi remote atau meminta konfirmasi hasilnya.",
        context: "Kamu ingin engineer remote memeriksa status sensor di sistem mereka.",
        examples: ["Could you check the sensor reading?","Could you check the sensor status?","Could you verify the sensor signal?"],
        prompt: "Minta engineer remote memeriksa sensor."
      },
      {
        id: "help-10",
        pattern: "could",
        focus: "“Guide me through” berarti menuntun langkah demi langkah. Setelah could, “guide” tetap bentuk dasar.",
        context: "Kamu belum pernah melakukan prosedur ini dan ingin dipandu dari awal sampai akhir.",
        examples: ["Could you guide me through the reset procedure?","Could you guide me through the test?","Could you walk me through the wiring check?"],
        prompt: "Minta engineer remote menuntunmu melalui prosesnya."
      },
      {
        id: "help-11",
        pattern: "wh",
        focus: "“What should I check first?” adalah versi tanpa objek spesifik. Fokusnya pada urutan pemeriksaan.",
        context: "Kamu berada di lokasi dan perlu arahan awal sebelum membuka atau mengukur apa pun.",
        examples: ["What should I inspect first?","What should I test first?","What should I confirm before we continue?"],
        prompt: "Tanyakan apa yang harus kamu periksa dulu."
      },
      {
        id: "help-12",
        pattern: "wh",
        focus: "“What should I do if…” menggabungkan pertanyaan utama dengan klausa syarat. Bagian if memakai present simple.",
        context: "Kamu ingin menyiapkan langkah cadangan jika masalah tidak hilang setelah tindakan pertama.",
        examples: ["What should I do if the alarm returns?","What should I check if the sensor fails again?","What should I do if the connection is still unstable?"],
        prompt: "Tanyakan apa yang harus kamu lakukan jika masalahnya berlanjut."
      }
    ]
  },
  {
    day: 15,
    phase: "Komunikasi",
    title: "Mencari bantuan remote",
    goal: "Menanyakan siapa yang tersedia dan meminta sesi remote dimulai.",
    items: [
      {
        id: "avail-01",
        pattern: "available",
        focus: "“Who is available” menanyakan orang yang tersedia. Setelah who is, gunakan “available for + noun”.",
        context: "Kamu membutuhkan engineer yang bisa bergabung, tetapi belum tahu siapa yang sedang bertugas.",
        examples: ["Who is available for support this afternoon?","Who is available to check the server?"],
        prompt: "Tanyakan siapa yang tersedia untuk sesi remote."
      },
      {
        id: "avail-02",
        pattern: "available",
        focus: "“Is anyone available” adalah pertanyaan yes/no tentang ketersediaan seseorang. “To provide” menjelaskan bantuan yang diminta.",
        context: "Kamu menghubungi tim support dan menanyakan apakah ada seseorang yang bisa membantu.",
        examples: ["Is anyone available to check the logs?","Is anyone available to guide me?"],
        prompt: "Tanyakan apakah ada yang tersedia untuk memberikan dukungan remote."
      },
      {
        id: "avail-03",
        pattern: "available",
        focus: "“Are you available” langsung menanyakan kesediaan lawan bicara. “For a remote session” menyebut kegiatannya.",
        context: "Kamu sudah berbicara dengan engineer tertentu dan ingin tahu apakah dia bisa memulai sesi sekarang.",
        examples: ["Are you available for a quick check?","Are you available to review the alarm?"],
        prompt: "Tanyakan apakah engineer remote tersedia untuk sesi remote."
      },
      {
        id: "avail-04",
        pattern: "could",
        focus: "“Could someone assist me” meminta bantuan secara umum tanpa menunjuk satu orang. “Remotely” menjelaskan caranya.",
        context: "Kamu tidak yakin siapa engineer yang tepat, jadi kamu meminta bantuan dari tim secara umum.",
        examples: ["Could someone assist me with the setup?","Could someone help me remotely?","Could someone check this alarm?"],
        prompt: "Tanyakan apakah seseorang bisa membantumu secara remote."
      },
      {
        id: "avail-05",
        pattern: "could",
        focus: "“Could you start a remote session” meminta engineer memulai sesi. Ini permintaan, bukan perintah.",
        context: "Kamu sudah siap di lokasi dan ingin engineer remote memulai koneksi.",
        examples: ["Could you start a remote session now?","Could you start the screen sharing?","Could you open a support session?"],
        prompt: "Minta engineer remote memulai sesi remote."
      }
    ]
  },
  {
    day: 16,
    phase: "Troubleshooting",
    title: "Memastikan instruksi",
    goal: "Mengulang urutan, menanyakan langkah berikutnya, dan meminta instruksi tertulis.",
    items: [
      {
        id: "follow-02",
        pattern: "confirm",
        focus: "“Let me confirm” diikuti ringkasan dua langkah, lalu “Is that correct?” untuk meminta validasi.",
        context: "Engineer remote memberi dua langkah berurutan dan kamu ingin memastikan urutannya sebelum bertindak.",
        examples: ["Let me confirm: I should reseat the cable, then restart the switch. Is that correct?","Let me confirm: I should check the input first, then the output. Is that correct?","Let me confirm: I should replace the fuse and run the test. Is that correct?"],
        prompt: "Ulangi instruksi mengganti kabel LAN lalu reboot switch, dan minta konfirmasi."
      },
      {
        id: "follow-03",
        pattern: "pp",
        focus: "“I’ve done” menyatakan langkah 3 sudah selesai. “What’s next?” adalah pertanyaan singkat untuk melanjutkan.",
        context: "Kamu mengikuti instruksi bernomor dan sudah menyelesaikan langkah ketiga.",
        examples: ["I’ve done step 2. What’s next?","I’ve finished the first check. What should I do now?","I’ve completed the reset. What’s the next step?"],
        prompt: "Katakan bahwa kamu sudah menyelesaikan langkah 3, lalu tanyakan apa selanjutnya."
      },
      {
        id: "follow-08",
        pattern: "could",
        focus: "“Could you show me which cable” meminta petunjuk spesifik. “I need to check” menjelaskan tujuan pertanyaannya.",
        context: "Ada beberapa kabel di panel dan kamu ingin engineer remote menunjukkan kabel yang tepat.",
        examples: ["Could you show me which connector I need to check?","Could you show me which port to use?","Could you point out the cable for the sensor?"],
        prompt: "Minta engineer remote menunjukkan kabel mana yang perlu kamu periksa."
      },
      {
        id: "ins-04",
        pattern: "confirm",
        focus: "Versi pertanyaan dari konfirmasi: “should I + base verb” memastikan urutan sebelum melepas kabel.",
        context: "Kamu menerima instruksi untuk melepas kabel, tetapi ingin memastikan itu langkah pertama.",
        examples: ["Let me confirm: should I unplug the power cable first?","Let me confirm: should I stop the line before the reset?","Let me confirm: should I remove the connector now?"],
        prompt: "Pastikan apakah kamu harus melepas kabelnya terlebih dahulu."
      },
      {
        id: "ins-06",
        pattern: "could",
        focus: "“Can you send me the instructions in writing” meminta salinan tertulis agar langkah tidak berubah selama dikerjakan.",
        context: "Instruksi diberikan secara lisan dan cukup panjang, jadi kamu meminta versi tertulis.",
        examples: ["Can you send me the steps in writing?","Could you send the procedure by email?","Can you share the checklist in the chat?"],
        prompt: "Minta engineer remote mengirimkan instruksinya secara tertulis."
      }
    ]
  },
  {
    day: 17,
    phase: "Troubleshooting",
    title: "Mengikuti langkah demi langkah",
    goal: "Merespons instruksi dan menyatakan tindakan yang akan dilakukan.",
    items: [
      {
        id: "ins-01",
        pattern: "will",
        focus: "“I’ll do that” adalah janji untuk melakukan instruksi. “That” merujuk pada langkah yang baru dijelaskan.",
        context: "Engineer remote memberi instruksi singkat dan kamu mengonfirmasi bahwa kamu akan melakukannya.",
        examples: ["Okay, I’ll do that now.","All right, I’ll try that.","Understood, I’ll follow that step."],
        prompt: "Katakan baik, kamu akan melakukannya."
      },
      {
        id: "ins-02",
        pattern: "pp",
        focus: "“I’ve done that” menunjukkan langkah sudah selesai. Pertanyaan “What’s next?” meminta langkah lanjutan.",
        context: "Kamu sudah menyelesaikan instruksi pertama dan menunggu arahan berikutnya.",
        examples: ["I’ve finished that step. What should I check now?","I’ve completed the check. What’s the next instruction?"],
        prompt: "Katakan kamu sudah melakukannya, lalu tanyakan apa selanjutnya."
      },
      {
        id: "ins-03",
        pattern: "will",
        focus: "“I’ll try it now” memakai will untuk tindakan yang langsung akan dilakukan. “Try” berarti mencoba.",
        context: "Kamu mengerti instruksi dan akan mencobanya saat itu juga.",
        examples: ["Okay. I’ll test it now.","All right. I’ll check it now."],
        prompt: "Katakan mengerti dan kamu akan mencobanya sekarang."
      },
      {
        id: "ins-05",
        pattern: "will",
        focus: "“I’ll follow the steps” menyatakan komitmen mengikuti urutan yang dikirim. “You sent me” menjelaskan sumber instruksinya.",
        context: "Kamu menerima daftar langkah tertulis dan akan mengikutinya satu per satu.",
        examples: ["I’ll use the checklist you shared.","I’ll follow the procedure in the manual."],
        prompt: "Katakan bahwa kamu akan mengikuti langkah-langkah yang dikirim engineer remote."
      },
      {
        id: "follow-01",
        pattern: "will",
        focus: "“I’ll do it now” adalah respons singkat dan jelas. “Now” menunjukkan tindakan dilakukan segera.",
        context: "Engineer remote meminta kamu melakukan satu tindakan dan kamu merespons dengan tegas.",
        examples: ["Okay. I’ll check it now.","All right. I’ll replace it now."],
        prompt: "Katakan mengerti dan kamu akan melakukannya sekarang."
      }
    ]
  },
  {
    day: 18,
    phase: "Troubleshooting",
    title: "Memberi kabar saat bekerja",
    goal: "Melaporkan progres, meminta waktu, dan mengirim bukti visual.",
    items: [
      {
        id: "follow-04",
        pattern: "time",
        focus: "“I’ll let you know as soon as I finish” memakai will di klausa utama dan present simple setelah as soon as.",
        context: "Kamu sedang mengerjakan langkah yang butuh waktu dan berjanji memberi kabar segera setelah selesai.",
        examples: ["I’ll let you know as soon as I finish the check.","I’ll call you as soon as the test is complete.","I’ll update you as soon as the machine restarts."],
        prompt: "Katakan kamu akan memberi tahu engineer remote segera setelah selesai."
      },
      {
        id: "follow-05",
        pattern: "please",
        focus: "“Please wait a moment” adalah imperatif sopan. Kalimat kedua “I’m opening” menjelaskan aktivitas yang sedang berlangsung.",
        context: "Kamu perlu membuka panel dan meminta engineer remote menunggu sebentar.",
        examples: ["Please wait a moment. I’m opening the cabinet now.","Please wait a moment. I’m checking the terminal now.","Please give me a second. I’m taking a photo."],
        prompt: "Minta engineer remote menunggu sebentar karena kamu sedang membuka panel."
      },
      {
        id: "follow-06",
        pattern: "pc",
        focus: "“I’m sending” menunjukkan foto sedang dikirim saat kamu berbicara. “Now” menegaskan waktunya.",
        context: "Kamu menemukan konektor yang mencurigakan dan mengirim foto agar engineer remote bisa melihat kondisinya.",
        examples: ["I’m sending you a photo of the cable now.","I’m sending the picture of the HMI.","I’m sharing a close-up of the connector."],
        prompt: "Katakan bahwa kamu sedang mengirim foto konektor sekarang."
      },
      {
        id: "follow-07",
        pattern: "pc",
        focus: "“I’m sharing” menjelaskan layar sedang dibagikan. “So you can see” menunjukkan tujuan berbagi layar.",
        context: "Kamu membagikan layar HMI agar engineer remote dapat membaca alarm dan nilai secara langsung.",
        examples: ["I’m sharing my desktop so you can check the settings.","I’m showing the live screen now."],
        prompt: "Katakan bahwa kamu sedang membagikan layar agar engineer remote bisa melihat HMI."
      },
      {
        id: "status-02",
        pattern: "pp",
        focus: "“I’ve finished” menyatakan pemeriksaan pertama sudah selesai dan hasilnya siap dibahas.",
        context: "Kamu menyelesaikan pemeriksaan awal dan memberi tahu engineer remote bahwa langkah itu sudah tuntas.",
        examples: ["I’ve completed the visual inspection.","I’ve finished checking the cable."],
        prompt: "Katakan bahwa kamu sudah menyelesaikan pemeriksaan pertama."
      }
    ]
  },
  {
    day: 19,
    phase: "Troubleshooting",
    title: "Memutuskan restart",
    goal: "Menanyakan pilihan restart, meminta izin, dan memperingatkan proses yang sedang berjalan.",
    items: [
      {
        id: "help-05",
        pattern: "should",
        focus: "“Should I restart the server or only the service?” menawarkan dua pilihan. “Or” memisahkan pilihan yang perlu dikonfirmasi.",
        context: "Kamu tidak yakin apakah harus memulai ulang seluruh server atau hanya layanan aplikasinya.",
        examples: ["Should I restart the HMI or only the application?","Should I reboot the controller or just the service?","Should I restart the switch or check the cable first?"],
        prompt: "Tanyakan apakah kamu harus memulai ulang server atau hanya layanannya."
      },
      {
        id: "rst-02",
        pattern: "could",
        focus: "“Could I restart” meminta izin dengan sopan. Izin ini tetap harus mengikuti prosedur operasi dan keselamatan.",
        context: "Kamu ingin memulai ulang mesin, tetapi perlu persetujuan sebelum melakukannya.",
        examples: ["Could I restart the controller now?","Could I reboot the HMI?","Could I restart the service after the check?"],
        prompt: "Minta izin untuk memulai ulang mesin sekarang."
      },
      {
        id: "rst-03",
        pattern: "pc",
        focus: "“I’m restarting” menunjukkan proses restart sedang berlangsung. Ini memberi tahu lawan bicara bahwa mesin sedang tidak tersedia.",
        context: "Kamu sudah mendapat persetujuan dan sedang menjalankan restart, jadi kamu memberi tahu engineer remote.",
        examples: ["I’m restarting the controller now.","I’m rebooting the HMI now.","I’m restarting the service now."],
        prompt: "Katakan bahwa kamu sedang memulai ulang mesin sekarang."
      },
      {
        id: "rst-04",
        pattern: "pc",
        focus: "“Is booting up” menjelaskan tahap awal setelah restart, saat sistem masih memuat.",
        context: "Setelah restart, layar menyala dan sistem sedang memuat; kamu melaporkan tahap ini.",
        examples: ["The controller is starting up.","The HMI is loading the system."],
        prompt: "Katakan bahwa mesin sedang menyala dan memuat sistem."
      },
      {
        id: "rst-06",
        pattern: "while",
        focus: "“Please wait while…” meminta seseorang menunggu selama proses berlangsung. Setelah while, gunakan present simple untuk proses tersebut.",
        context: "Kamu meminta engineer remote menunggu selama sistem restart dan belum bisa diperiksa.",
        examples: ["Please wait while the controller reboots.","Please wait while the HMI loads."],
        prompt: "Minta engineer remote menunggu sementara sistem dimulai ulang."
      }
    ]
  },
  {
    day: 20,
    phase: "Troubleshooting",
    title: "Hasil setelah restart",
    goal: "Melaporkan apakah restart berhasil dan apakah masalah masih muncul.",
    items: [
      {
        id: "rst-01",
        pattern: "pp",
        focus: "“I’ve restarted” menyatakan restart sudah dilakukan. “But the problem is still there” menunjukkan hasilnya belum berhasil.",
        context: "Kamu menyelesaikan restart, tetapi alarm atau masalah yang sama masih muncul.",
        examples: ["I’ve restarted the controller, but the alarm is still there.","I’ve rebooted the HMI, but the error is still showing.","I’ve restarted the service, but the connection is still down."],
        prompt: "Katakan bahwa kamu sudah memulai ulang mesin, tetapi masalahnya masih ada."
      },
      {
        id: "rst-05",
        pattern: "pp",
        focus: "“Has restarted successfully” memakai present perfect untuk hasil restart yang sudah berhasil.",
        context: "Restart selesai tanpa error dan sistem kembali menyala normal.",
        examples: ["The controller has restarted successfully.","The HMI has rebooted successfully.","The service has started successfully."],
        prompt: "Katakan bahwa mesin berhasil dimulai ulang."
      },
      {
        id: "status-01",
        pattern: "still",
        focus: "“Is still there” menegaskan bahwa masalah belum hilang. “Still” ditempatkan sebelum “there”.",
        context: "Kamu sudah mencoba beberapa langkah, tetapi gejala yang sama tetap ada.",
        examples: ["The alarm is still there.","The error is still there after the reset."],
        prompt: "Katakan bahwa masalahnya masih ada."
      },
      {
        id: "status-06",
        pattern: "pc",
        focus: "Dua present continuous “is running” dan “is still showing” membandingkan mesin yang hidup dengan error yang tetap muncul.",
        context: "Mesin sudah menyala kembali, tetapi pesan error masih terlihat di layar.",
        examples: ["The line is moving, but the alarm is still active.","The HMI is on, but the warning is still visible."],
        prompt: "Laporkan bahwa mesin menyala, tetapi pesan kesalahannya masih muncul."
      },
      {
        id: "delay-03",
        pattern: "still",
        focus: "“I’m still working on it” memakai be + still + verb-ing. Artinya pekerjaan belum selesai dan masih berlangsung.",
        context: "Engineer remote menanyakan progres, dan kamu menjelaskan bahwa kamu masih mengerjakannya.",
        examples: ["I’m still working on the cable.","We’re still checking the connection.","The technician is still testing the sensor."],
        prompt: "Katakan bahwa kamu masih mengerjakannya."
      }
    ]
  },
  {
    day: 21,
    phase: "Perbaikan",
    title: "Mengganti PSU dengan aman",
    goal: "Meminta izin, memastikan keselamatan, dan melaporkan hasil penggantian.",
    items: [
      {
        id: "psu-04",
        pattern: "may",
        focus: "“May I replace the PSU?” adalah permintaan izin formal. Penggantian tetap memerlukan LOTO, work permit, dan verifikasi aman.",
        context: "Kamu menemukan PSU yang rusak dan ingin meminta izin sebelum menggantinya.",
        examples: ["May I replace the power supply now?","May I open the panel to check the PSU?","May I install the spare PSU?"],
        prompt: "Minta izin secara formal untuk mengganti PSU.",
      },
      {
        id: "safe-09",
        pattern: "canq",
        focus: "“Can I replace the PSU?” menanyakan izin atau kemungkinan. Jangan anggap jawaban “yes” sebagai izin keselamatan.",
        context: "Kamu berdiskusi dengan engineer remote tentang penggantian PSU dan ingin memastikan apakah tindakan itu boleh dilakukan.",
        examples: ["Can I replace the PSU now?","Can we replace the module during the shutdown?","Can I install the spare part?"],
        prompt: "Tanyakan apakah kamu boleh mengganti PSU.",
      },
      {
        id: "help-06",
        pattern: "yesno",
        focus: "“Is it safe to power off” adalah pertanyaan yes/no dengan “it” sebagai subjek. Jawaban tetap harus diverifikasi dengan prosedur lokasi.",
        context: "Sebelum mematikan sistem, kamu meminta konfirmasi apakah kondisi saat ini aman.",
        examples: ["Is it safe to open the panel?","Is it safe to restart the controller?"],
        prompt: "Tanyakan apakah aman mematikan sistem sekarang.",
      },
      {
        id: "repair-01",
        pattern: "past",
        focus: "“I replaced” adalah simple past untuk tindakan yang sudah selesai. “Is back online” melaporkan hasilnya saat ini.",
        context: "Kamu mengganti PSU, lalu sistem menyala dan kembali terhubung.",
        examples: ["I replaced the fuse, and the panel is back online.","I swapped the PSU, and the controller is running again."],
        prompt: "Katakan bahwa kamu sudah mengganti catu daya dan sistem kembali online.",
      },
      {
        id: "repair-08",
        pattern: "pp",
        focus: "“I’ve checked” menyatakan pemeriksaan kabel dan PSU sudah selesai sebelum kamu melaporkan hasil.",
        context: "Sebelum menyimpulkan PSU adalah penyebabnya, kamu memeriksa kabel dan catu daya.",
        examples: ["I’ve inspected the connector and the fuse.","I’ve tested the input and the output."],
        prompt: "Katakan bahwa kamu sudah memeriksa kabel dan catu daya.",
      }
    ]
  },
  {
    day: 22,
    phase: "Perbaikan",
    title: "Hasil perbaikan kabel",
    goal: "Melaporkan reseat, pengencangan, penggantian, dan dugaan penyebab.",
    items: [
      {
        id: "repair-02",
        pattern: "past",
        focus: "“I reseated” dan “the problem is still there” menunjukkan tindakan sudah dilakukan, tetapi hasilnya belum berubah.",
        context: "Kamu memasang kembali konektor dan menguji mesin, tetapi masalah yang sama tetap muncul.",
        examples: ["I reseated the sensor connector, but the alarm is still there.","I reconnected the cable, but the error is still showing.","I reseated the module, but the machine is still offline."],
        prompt: "Katakan bahwa kamu sudah memasang kembali konektor, tetapi masalahnya masih ada."
      },
      {
        id: "repair-03",
        pattern: "past",
        focus: "“Tightened” adalah simple past dari tighten. “All the terminal screws” menunjukkan seluruh sekrup diperiksa, bukan satu saja.",
        context: "Kamu menemukan beberapa sekrup terminal longgar dan mengencangkannya sebelum pengujian.",
        examples: ["I tightened the grounding connection.","I checked and tightened the input terminals."],
        prompt: "Katakan bahwa kamu sudah mengencangkan semua sekrup terminal."
      },
      {
        id: "repair-04",
        pattern: "past",
        focus: "“I swapped” menyatakan kabel sudah ditukar. “The connection is stable now” melaporkan kondisi setelah tindakan.",
        context: "Kamu mengganti kabel LAN dengan kabel lain dan koneksi menjadi stabil.",
        examples: ["I replaced the patch cord, and the link is stable.","I changed the cable, and the network is working again."],
        prompt: "Katakan bahwa kamu sudah menukar kabel LAN dan koneksinya stabil sekarang."
      },
      {
        id: "repair-05",
        pattern: "pc",
        focus: "“Is running again” memakai present continuous untuk layanan yang sudah kembali aktif setelah restart.",
        context: "Setelah restart, layanan aplikasi berjalan kembali dan kamu melaporkan statusnya.",
        examples: ["The application is working again.","The controller is online again after the reboot."],
        prompt: "Katakan bahwa layanan berjalan lagi setelah restart."
      },
      {
        id: "repair-07",
        pattern: "lookslike",
        focus: "“It looks like” memperkenalkan dugaan. “Was caused by” adalah past passive yang menjelaskan kemungkinan penyebab.",
        context: "Setelah memeriksa kabel, kamu menduga masalahnya berasal dari koneksi yang longgar.",
        examples: ["It looks like the problem was caused by a loose connector.","It looks like the alarm was caused by a bad cable.","It looks like the issue came from the power supply."],
        prompt: "Katakan bahwa sepertinya masalahnya disebabkan oleh kabel yang longgar."
      }
    ]
  },
  {
    day: 23,
    phase: "Perbaikan",
    title: "Menjalankan pengujian",
    goal: "Menjelaskan tes yang sedang berjalan, tes ulang, dan cara menjalankan diagnostik.",
    items: [
      {
        id: "repair-06",
        pattern: "pc",
        focus: "“I’m running a test” menunjukkan pengujian sedang berlangsung. “To make sure” menjelaskan tujuan tes.",
        context: "Setelah perbaikan, kamu menjalankan tes untuk memastikan mesin bekerja dengan benar.",
        examples: ["I’m testing the sensor to confirm the repair.","We’re running a diagnostic to check the controller."],
        prompt: "Katakan bahwa kamu sedang menjalankan tes untuk memastikan semuanya bekerja dengan baik."
      },
      {
        id: "repair-12",
        pattern: "needto",
        focus: "“We need to run” memakai need to + base verb. “Another test” berarti satu tes tambahan diperlukan.",
        context: "Hasil tes pertama belum cukup, jadi kamu mengusulkan tes lain sebelum menyimpulkan perbaikan.",
        examples: ["We need to repeat the diagnostic.","We need to test the machine under load."],
        prompt: "Katakan bahwa kita perlu menjalankan tes lain."
      },
      {
        id: "test-01",
        pattern: "be",
        focus: "“Is complete” memakai be + adjective untuk menyatakan status tes, bukan tindakan yang sedang dilakukan.",
        context: "Tes sudah selesai dan kamu memberi tahu engineer remote bahwa prosesnya tidak lagi berjalan.",
        examples: ["The inspection is complete.","The diagnostic is finished."],
        prompt: "Katakan bahwa tes sudah selesai."
      },
      {
        id: "test-02",
        pattern: "still",
        focus: "“Is still running” menunjukkan tes belum selesai. “Still” menegaskan prosesnya masih berlangsung.",
        context: "Engineer remote bertanya apakah tes sudah selesai, dan kamu menjawab bahwa tes masih berjalan.",
        examples: ["The diagnostic is still in progress.","The machine is still running the test."],
        prompt: "Katakan bahwa tesnya masih berjalan."
      },
      {
        id: "qp-how-05",
        pattern: "how",
        focus: "“How do I run” memakai how do I + base verb untuk menanyakan cara menjalankan tes.",
        context: "Kamu belum familiar dengan menu diagnostik dan meminta engineer remote menjelaskan caranya.",
        examples: ["How do I start the self-test?","How do I check the test log?"],
        prompt: "Tanyakan bagaimana cara menjalankan tes diagnostik."
      }
    ]
  },
  {
    day: 24,
    phase: "Perbaikan",
    title: "Membaca hasil tes",
    goal: "Melaporkan tes yang berhasil, gagal, dan hasil yang belum berubah.",
    items: [
      {
        id: "test-03",
        pattern: "past",
        focus: "“Completed successfully” adalah simple past dari complete. “Successfully” menjelaskan hasilnya.",
        context: "Tes selesai tanpa error dan kamu melaporkan bahwa pengujian berhasil.",
        examples: ["The diagnostic completed without errors.","The self-test passed successfully."],
        prompt: "Katakan bahwa tes berhasil diselesaikan."
      },
      {
        id: "test-04",
        pattern: "past",
        focus: "“Failed again” memakai simple past. “Again” menunjukkan kegagalan yang sama pernah terjadi sebelumnya.",
        context: "Tes diulang setelah perbaikan, tetapi hasilnya tetap gagal.",
        examples: ["The diagnostic failed at the same step.","The sensor test failed again."],
        prompt: "Katakan bahwa tes gagal lagi."
      },
      {
        id: "test-05",
        pattern: "be",
        focus: "“Is the same as before” memakai be + the same as untuk membandingkan hasil sekarang dengan hasil sebelumnya.",
        context: "Kamu membandingkan hasil tes terbaru dengan tes sebelumnya dan tidak melihat perubahan.",
        examples: ["The reading is the same as the last test.","The error is the same as yesterday."],
        prompt: "Katakan bahwa hasilnya sama seperti sebelumnya."
      },
      {
        id: "test-06",
        pattern: "pp",
        focus: "“I’ve sent” menyatakan laporan sudah dikirim. “The test report” adalah objek yang dikirim.",
        context: "Kamu menyelesaikan laporan tes dan mengirimkannya kepada engineer remote.",
        examples: ["I’ve emailed the diagnostic result.","I’ve shared the test log with you."],
        prompt: "Katakan bahwa kamu sudah mengirimkan laporan tes."
      },
      {
        id: "repair-10",
        pattern: "past",
        focus: "“Passed” adalah simple past dari pass. Ini pernyataan singkat bahwa tes memenuhi kriteria.",
        context: "Tes selesai dan hasilnya memenuhi kriteria yang diharapkan.",
        examples: ["The diagnostic passed.","The sensor test passed after the replacement."],
        prompt: "Katakan bahwa tesnya lulus."
      }
    ]
  },
  {
    day: 25,
    phase: "Perbaikan",
    title: "Mengonfirmasi perbaikan",
    goal: "Menyatakan pemeriksaan selesai, mesin normal, dan masalah teratasi.",
    items: [
      {
        id: "repair-09",
        pattern: "lookadj",
        focus: "“Looks normal” memakai look + adjective. Ini penilaian visual, jadi tetap perlu dikonfirmasi dengan tes.",
        context: "Setelah perbaikan, kamu melihat tampilan mesin dan indikatornya kembali seperti biasa.",
        examples: ["The panel looks normal.","The readings look normal."],
        prompt: "Katakan bahwa semuanya tampak normal sekarang."
      },
      {
        id: "done-01",
        pattern: "pp",
        focus: "“I’ve completed” menekankan seluruh pemeriksaan sudah selesai, bukan hanya satu langkah.",
        context: "Kamu menyelesaikan daftar pemeriksaan dan siap melaporkan hasilnya.",
        examples: ["I’ve finished all the inspections.","I’ve completed the repair checklist."],
        prompt: "Katakan bahwa kamu sudah menyelesaikan semua pemeriksaan."
      },
      {
        id: "done-02",
        pattern: "pc",
        focus: "“Is working normally” memakai present continuous untuk kondisi mesin yang sedang berjalan normal saat dilaporkan.",
        context: "Setelah perbaikan dan tes, mesin kembali beroperasi seperti biasa.",
        examples: ["The conveyor is running normally now.","The controller is operating normally."],
        prompt: "Katakan bahwa mesin sekarang berjalan normal."
      },
      {
        id: "done-03",
        pattern: "ppp",
        focus: "“Has been resolved” adalah present perfect passive. Fokusnya pada masalah yang sudah teratasi, bukan siapa yang mengatasinya.",
        context: "Kamu melaporkan bahwa masalah utama sudah tidak ada setelah perbaikan dan pengujian.",
        examples: ["The alarm has been cleared.","The network issue has been resolved."],
        prompt: "Katakan bahwa masalahnya sudah teratasi."
      },
      {
        id: "done-04",
        pattern: "pc",
        focus: "“Is working as expected” memakai present continuous + as expected untuk menyatakan hasil sesuai standar.",
        context: "Semua fungsi diuji dan hasilnya sesuai dengan perilaku yang diharapkan.",
        examples: ["The sensor is working as expected.","The system is running as expected."],
        prompt: "Katakan bahwa semuanya berjalan sesuai harapan."
      }
    ]
  },
  {
    day: 26,
    phase: "Pelanggan",
    title: "Menanyakan dampak operasi",
    goal: "Menjelaskan dampak sesi remote, downtime, dan kebutuhan offline.",
    items: [
      {
        id: "cust-01",
        pattern: "yesno",
        focus: "“Will the remote session affect…?” adalah pertanyaan yes/no dengan will + base verb. “Affect” berarti memengaruhi.",
        context: "Sebelum sesi dimulai, kamu ingin tahu apakah operasi normal akan terganggu.",
        examples: ["Will the update affect the conveyor?","Will this test affect the production line?"],
        prompt: "Tanyakan apakah sesi remote akan memengaruhi operasi normal."
      },
      {
        id: "cust-02",
        pattern: "needpassq",
        focus: "“Will the machine need to be stopped” memakai will + need to be + past participle. Fokusnya pada mesin yang mungkin harus dihentikan.",
        context: "Kamu perlu tahu apakah sesi remote mengharuskan mesin berhenti, bukan hanya apakah sesinya berjalan.",
        examples: ["Will the line need to be stopped during the test?","Will the controller need to be restarted?","Will the system need to be taken offline?"],
        prompt: "Tanyakan apakah mesin perlu dihentikan selama sesi."
      },
      {
        id: "cust-03",
        pattern: "canq",
        focus: "“Can we perform…?” menanyakan kemungkinan melakukan sesi. Klausa “while the machine is running” menjelaskan kondisi yang diinginkan.",
        context: "Kamu ingin mengetahui apakah sesi remote bisa dilakukan tanpa menghentikan mesin.",
        examples: ["Can we perform the check while the line is running?","Can we run the test while the machine is operating?","Can we update the software without stopping production?"],
        prompt: "Tanyakan apakah sesi remote bisa dilakukan saat mesin berjalan."
      },
      {
        id: "cust-04",
        pattern: "willtherebe",
        focus: "“Will there be” menanyakan keberadaan sesuatu di masa depan. “Any downtime” berarti apakah akan ada waktu henti.",
        context: "Kamu meminta perkiraan apakah proses perbaikan akan menyebabkan downtime.",
        examples: ["Will there be any interruption to operations?","Will there be a short stop during the test?"],
        prompt: "Tanyakan apakah akan ada downtime selama proses ini."
      },
      {
        id: "cust-05",
        pattern: "doneed",
        focus: "“Do we need to take the system offline?” memakai do we need to + base verb untuk menanyakan kebutuhan tindakan.",
        context: "Kamu belum tahu apakah sistem harus dilepas dari jaringan atau cukup diperiksa saat online.",
        examples: ["Do we need to stop the line for this check?","Do we need to disconnect the controller?"],
        prompt: "Tanyakan apakah kalian perlu mematikan sistem dari jaringan."
      }
    ]
  },
  {
    day: 27,
    phase: "Pelanggan",
    title: "Persetujuan dan jadwal",
    goal: "Membahas dengan pelanggan, mendapatkan persetujuan, dan menyepakati waktu.",
    items: [
      {
        id: "cust-06",
        pattern: "needto",
        focus: "“I need to discuss this” memakai need to + base verb. “With the customer” menunjukkan pihak yang perlu diajak bicara.",
        context: "Ada perubahan lingkup atau dampak yang perlu dibicarakan dengan pelanggan sebelum melanjutkan.",
        examples: ["I need to discuss the schedule with the operations team.","We need to discuss the downtime with the customer."],
        prompt: "Katakan bahwa kamu perlu membahas ini dengan pelanggan."
      },
      {
        id: "cust-07",
        pattern: "needto",
        focus: "“I need to get the customer’s approval” menyatakan persetujuan pelanggan sebagai prasyarat. Ini berbeda dari izin keselamatan.",
        context: "Pekerjaan akan berdampak pada operasi, jadi kamu perlu persetujuan pelanggan terlebih dahulu.",
        examples: ["We need to get approval for the downtime.","I need to get the supervisor’s approval before the test."],
        prompt: "Katakan bahwa kamu perlu mendapatkan persetujuan pelanggan terlebih dahulu."
      },
      {
        id: "cust-08",
        pattern: "letme",
        focus: "“Let me check with the customer first” menunda keputusan dengan sopan sampai kondisi pelanggan dikonfirmasi.",
        context: "Kamu belum bisa memastikan jadwal karena perlu menanyakan pelanggan lebih dulu.",
        examples: ["Let me confirm the schedule with operations.","Let me ask the customer about the downtime."],
        prompt: "Katakan bahwa kamu cek dulu dengan pelanggan."
      },
      {
        id: "cust-10",
        pattern: "needto",
        focus: "“The customer needs to approve” memakai needs to karena subjeknya customer (he/she). Ini menyebut pihak yang harus menyetujui downtime.",
        context: "Downtime membutuhkan persetujuan pelanggan sebelum dijadwalkan.",
        examples: ["The operations team needs to approve the schedule.","The supervisor needs to approve the overtime."],
        prompt: "Katakan bahwa pelanggan perlu menyetujui downtime-nya."
      },
      {
        id: "cust-13",
        pattern: "wh",
        focus: "“When can we start” memakai when + can + we + base verb untuk menanyakan waktu yang memungkinkan.",
        context: "Kamu sudah mendapat persetujuan awal dan ingin menyepakati waktu mulai sesi remote.",
        examples: ["When can we schedule the test?","When can the team start the repair?"],
        prompt: "Tanyakan kapan kalian bisa memulai sesi remote."
      }
    ]
  },
  {
    day: 28,
    phase: "Pelanggan",
    title: "Koordinasi dengan operasi",
    goal: "Berkoordinasi, memberi tahu pelanggan, dan meminta izin sebelum melanjutkan.",
    items: [
      {
        id: "cust-09",
        pattern: "needto",
        focus: "“I need to coordinate with” menyatakan perlunya bekerja sama dengan tim lain. “Operations team” adalah pihak yang mengatur operasi.",
        context: "Perubahan pada mesin perlu dikoordinasikan dengan tim operasi agar tidak mengganggu jadwal.",
        examples: ["We need to coordinate with the control room.","I need to coordinate the test with production."],
        prompt: "Katakan bahwa kamu perlu berkoordinasi dengan tim operasi."
      },
      {
        id: "cust-11",
        pattern: "time",
        focus: "“I’ll inform the customer before we start” memakai will di klausa utama dan present simple setelah before.",
        context: "Sebelum sesi dimulai, kamu berjanji memberi tahu pelanggan lebih dulu.",
        examples: ["I’ll notify operations before the test begins.","We’ll update the customer before the restart."],
        prompt: "Katakan bahwa kamu akan memberi tahu pelanggan sebelum kalian mulai."
      },
      {
        id: "cust-12",
        pattern: "neednoun",
        focus: "“We need permission” memakai need + noun. “Before proceeding” menjelaskan kapan izin itu diperlukan.",
        context: "Kamu belum boleh melanjutkan karena persetujuan yang diperlukan belum diterima.",
        examples: ["We need approval before the shutdown.","The team needs authorization before the repair."],
        prompt: "Katakan bahwa kalian perlu izin sebelum melanjutkan."
      },
      {
        id: "cust-14",
        pattern: "wh",
        focus: "“How long will … take?” menanyakan durasi. Polanya how long + will + subject + base verb.",
        context: "Tim operasi ingin mengetahui berapa lama sesi remote akan berlangsung.",
        examples: ["How long will the test take?","How long will the repair take?"],
        prompt: "Tanyakan berapa lama sesi remote akan berlangsung."
      },
      {
        id: "cust-15",
        pattern: "canq",
        focus: "“Can we schedule” menanyakan kemungkinan menjadwalkan. “After operating hours” menyebut waktu yang diusulkan.",
        context: "Kamu mengusulkan sesi dilakukan setelah jam operasi agar tidak mengganggu pelanggan.",
        examples: ["Can we schedule the test for tonight?","Can we move the work to the weekend?"],
        prompt: "Tanyakan apakah kalian bisa menjadwalkan sesi setelah jam operasi."
      }
    ]
  },
  {
    day: 29,
    phase: "Pelanggan",
    title: "Menjaga operasi tetap berjalan",
    goal: "Menyampaikan batas waktu, mengonfirmasi ulang, dan menyesuaikan langkah dengan kondisi operasi.",
    items: [
      {
        id: "cust-16",
        pattern: "ps",
        focus: "“We have” adalah present simple untuk menyatakan kepemilikan atau kondisi. “A limited time window” berarti waktu yang tersedia terbatas.",
        context: "Tim operasi memberi tahu bahwa pekerjaan hanya bisa dilakukan dalam rentang waktu tertentu.",
        examples: ["We have a short window before the next flight.","The team has a two-hour window for the test."],
        prompt: "Katakan bahwa kalian punya waktu terbatas untuk pekerjaan ini."
      },
      {
        id: "cust-17",
        pattern: "time",
        focus: "“Before we proceed” adalah klausa waktu dengan present simple. Klausa utamanya “I need to confirm” menyatakan tindakan yang harus dilakukan lebih dulu.",
        context: "Ada perubahan kondisi atau dampak, jadi kamu perlu mengonfirmasi ulang dengan pelanggan sebelum melanjutkan.",
        examples: ["Before we start, I need to check the permit.","Before we restart, I need to confirm the schedule."],
        prompt: "Katakan bahwa sebelum lanjut, kamu perlu mengonfirmasi ini dengan pelanggan."
      },
      {
        id: "cust-18",
        pattern: "be",
        focus: "“Is currently in operation” memakai be + adverb + prepositional phrase untuk menyatakan mesin sedang dipakai.",
        context: "Kamu memberi tahu engineer remote bahwa mesin sedang beroperasi dan tidak bisa diganggu sembarangan.",
        examples: ["The line is currently in use.","The system is currently running production."],
        prompt: "Katakan bahwa mesin saat ini sedang beroperasi."
      },
      {
        id: "cust-19",
        pattern: "cannot",
        focus: "“We cannot stop” memakai cannot + base verb. “At the moment” membatasi bahwa larangan atau kendalanya berlaku sekarang.",
        context: "Pelanggan tidak mengizinkan mesin dihentikan pada saat itu, jadi kamu menyampaikan kendalanya.",
        examples: ["We cannot take the line offline now.","We cannot restart the system during production."],
        prompt: "Katakan bahwa kalian tidak bisa menghentikan mesin saat ini."
      },
      {
        id: "cust-20",
        pattern: "could",
        focus: "“Could we do this step without interrupting operations?” meminta alternatif yang aman. Jangan gunakan alasan ini untuk melewati prosedur keselamatan.",
        context: "Kamu mencari cara menyelesaikan langkah tertentu tanpa menghentikan operasi, jika memang aman.",
        examples: ["Could we check it while the line is running?","Could we run the test without stopping production?"],
        prompt: "Tanyakan apakah langkah ini bisa dilakukan tanpa mengganggu operasi."
      }
    ]
  },
  {
    day: 30,
    phase: "Pelanggan",
    title: "Setelah sesi selesai",
    goal: "Meminta konfirmasi sebelum restart, melanjutkan setelah izin, dan melaporkan dampak.",
    items: [
      {
        id: "cust-21",
        pattern: "letknow",
        focus: "“Please let me know before restarting” memakai before + verb-ing. Kamu meminta kabar sebelum tindakan dilakukan.",
        context: "Kamu ingin memastikan tidak ada restart mendadak dari sisi remote yang bisa mengganggu operasi.",
        examples: ["Please let me know before you change the settings.","Please inform me before stopping the service."],
        prompt: "Minta engineer remote memberi tahu sebelum memulai ulang sistem."
      },
      {
        id: "cust-22",
        pattern: "time",
        focus: "“I’ll proceed once we get…” memakai will di klausa utama dan present simple setelah once. Artinya tindakan menunggu persetujuan.",
        context: "Kamu belum melanjutkan pekerjaan karena persetujuan pelanggan belum diterima.",
        examples: ["We’ll start once the permit is approved.","I’ll continue once operations confirms the window."],
        prompt: "Katakan bahwa kamu akan melanjutkan setelah mendapat persetujuan pelanggan."
      },
      {
        id: "cust-23",
        pattern: "pp",
        focus: "“We haven’t noticed” adalah present perfect negatif. Artinya belum ada dampak yang terlihat sampai sekarang, bukan jaminan tidak ada dampak.",
        context: "Setelah sesi selesai, tim operasi belum melihat gangguan pada layanan.",
        examples: ["We haven’t seen any errors since the update.","The team hasn’t reported any issues so far."],
        prompt: "Katakan bahwa kalian belum melihat dampak pada operasi."
      },
      {
        id: "cust-24",
        pattern: "will",
        focus: "“I’ll monitor the machine” menyatakan rencana pemantauan setelah sesi. “After the session” menjelaskan waktunya.",
        context: "Sesi remote selesai, tetapi kamu akan memantau mesin untuk memastikan tetap stabil.",
        examples: ["I’ll watch the alarm for the next hour.","We’ll monitor the line after the restart."],
        prompt: "Katakan bahwa kamu akan memantau mesin setelah sesi."
      },
      {
        id: "cust-25",
        pattern: "will",
        focus: "“I’ll update the customer on the results” memakai update + person + on + noun untuk memberi kabar hasil.",
        context: "Kamu akan menyampaikan hasil sesi dan status mesin kepada pelanggan.",
        examples: ["I’ll inform operations about the test result.","I’ll brief the supervisor on the repair."],
        prompt: "Katakan bahwa kamu akan memberi tahu pelanggan tentang hasilnya."
      }
    ]
  },
  {
    day: 31,
    phase: "Perawatan",
    title: "Kembali normal dan inspeksi rutin",
    goal: "Menyatakan mesin siap beroperasi dan memulai pemeriksaan preventif.",
    items: [
      {
        id: "cust-26",
        pattern: "ready",
        focus: "“Is ready to return” memakai ready to + base verb. Gunakan setelah kondisi mesin dikonfirmasi aman oleh pihak yang berwenang.",
        context: "Tes selesai dan mesin sudah dikonfirmasi aman untuk dikembalikan ke operasi normal.",
        examples: ["The line is ready to return to service.","The system is ready to run again."],
        prompt: "Katakan bahwa mesin siap dikembalikan ke operasi normal."
      },
      {
        id: "pm-01",
        pattern: "pc",
        focus: "“I’m doing” menunjukkan inspeksi rutin sedang berlangsung. “Routine inspection” adalah pemeriksaan terjadwal.",
        context: "Kamu sedang melakukan inspeksi preventif pada panel kontrol sesuai jadwal.",
        examples: ["I’m checking the panel during the scheduled maintenance.","I’m performing the monthly inspection."],
        prompt: "Katakan bahwa kamu sedang melakukan inspeksi rutin pada panel kontrol."
      },
      {
        id: "pm-02",
        pattern: "past",
        focus: "“I cleaned” adalah simple past karena pembersihan sudah selesai. “Dust from” menjelaskan sumber debu yang dibersihkan.",
        context: "Saat inspeksi, kamu membersihkan debu dari kipas dan filter pendingin panel.",
        examples: ["I cleaned the air filter.","I removed dust from the cooling fan."],
        prompt: "Katakan bahwa kamu sudah membersihkan debu dari fan dan filter."
      },
      {
        id: "pm-03",
        pattern: "pastpass",
        focus: "“Are secure” memakai be + adjective untuk kondisi koneksi saat ini. “No damage was found” adalah past passive; kamu melaporkan temuan pemeriksaan tanpa menyebut siapa yang memeriksa.",
        context: "Setelah memeriksa koneksi kabel, kamu menyimpulkan tidak ada kerusakan yang ditemukan.",
        examples: ["No loose terminals were found.","No signs of overheating were found."],
        prompt: "Katakan bahwa semua koneksi kabel aman dan tidak ditemukan kerusakan."
      },
      {
        id: "pm-04",
        pattern: "scheduled",
        focus: "“Is scheduled for next month” memakai be + scheduled for + waktu untuk menyebut jadwal inspeksi berikutnya.",
        context: "Inspeksi rutin selesai dan kamu menyampaikan jadwal pemeriksaan berikutnya.",
        examples: ["The next service is scheduled for Monday.","The follow-up check is scheduled for next week."],
        prompt: "Katakan bahwa inspeksi berikutnya dijadwalkan bulan depan."
      }
    ]
  },
  {
    day: 32,
    phase: "Laporan",
    title: "Rekomendasi dan eskalasi",
    goal: "Memberi rekomendasi, menyebut akar masalah, dan mengeskalasi bila perlu.",
    items: [
      {
        id: "pm-05",
        pattern: "recommend",
        focus: "“I recommend replacing” memakai recommend + verb-ing. Ini saran, bukan izin untuk langsung mengganti parts.",
        context: "Kamu menemukan bagian yang mulai aus dan merekomendasikan penggantian pada perawatan berikutnya.",
        examples: ["I recommend checking the fan every month.","I recommend installing a new filter."],
        prompt: "Katakan bahwa kamu merekomendasikan penggantian bagian ini."
      },
      {
        id: "report-01",
        pattern: "ppp",
        focus: "“Has been resolved” adalah present perfect passive. “Is in normal operation” melaporkan status akhir mesin.",
        context: "Kamu menyampaikan laporan penutup bahwa masalah sudah teratasi dan mesin beroperasi normal.",
        examples: ["The alarm has been cleared, and the line is running normally.","The fault has been repaired, and the system is back in service."],
        prompt: "Laporkan bahwa masalah sudah teratasi dan mesin beroperasi normal."
      },
      {
        id: "report-02",
        pattern: "rootcause",
        focus: "“The root cause is” diikuti kata benda. Gunakan hanya jika penyebab utama sudah cukup terbukti.",
        context: "Setelah penggantian dan pengujian, kamu menyimpulkan bahwa PSU yang rusak adalah penyebab utama.",
        examples: ["The root cause is a loose connector.","The root cause was a damaged LAN cable."],
        prompt: "Katakan bahwa akar masalahnya adalah catu daya yang rusak."
      },
      {
        id: "report-03",
        pattern: "thisneeds",
        focus: "“This needs further investigation” memakai needs + noun. “So I’m escalating it” menjelaskan tindakan yang kamu ambil.",
        context: "Masalah belum bisa diselesaikan di lokasi dan perlu keterlibatan tim yang lebih ahli.",
        examples: ["This needs a specialist, so I’m reporting it.","This needs more testing, so I’m asking for support."],
        prompt: "Katakan bahwa ini perlu penyelidikan lebih lanjut, jadi kamu mengeskalasinya."
      },
      {
        id: "report-04",
        pattern: "will",
        focus: "“I’ll prepare the report after the test” menyatakan rencana setelah tes selesai. “After the test” adalah keterangan waktu.",
        context: "Kamu belum bisa menyelesaikan laporan karena data tes belum lengkap.",
        examples: ["I’ll send the report after the inspection.","I’ll complete the checklist after the final check."],
        prompt: "Katakan bahwa kamu akan menyiapkan laporan setelah tes."
      }
    ]
  },
  {
    day: 33,
    phase: "Laporan",
    title: "Pemantauan dan awal handover",
    goal: "Menjanjikan pemantauan, melaporkan jika masalah kembali, dan menyiapkan serah terima.",
    items: [
      {
        id: "report-05",
        pattern: "will",
        focus: "“I’ll monitor it for one more hour” memakai will + monitor + durasi. “To make sure” menjelaskan tujuan pemantauan.",
        context: "Mesin sudah normal, tetapi kamu akan memantau selama satu jam lagi untuk memastikan stabil.",
        examples: ["I’ll watch the alarm for another 30 minutes.","We’ll monitor the line until the end of the shift."],
        prompt: "Katakan bahwa kamu akan memantaunya satu jam lagi untuk memastikan tetap stabil."
      },
      {
        id: "report-06",
        pattern: "if",
        focus: "“If the problem happens again, I’ll let you know” memakai present simple setelah if dan will di klausa utama.",
        context: "Kamu berjanji memberi kabar jika masalah yang sama muncul kembali setelah pemantauan.",
        examples: ["I’ll call you if the alarm returns.","I’ll send an update if the test fails."],
        prompt: "Katakan bahwa kamu akan memberi tahu jika masalahnya terjadi lagi."
      },
      {
        id: "report-07",
        pattern: "if",
        focus: "Pola kondisional yang sama dipakai untuk menelepon balik. “Comes back” adalah present simple untuk kemungkinan di masa depan.",
        context: "Kamu akan meninggalkan lokasi, tetapi berjanji menelepon kembali jika masalah muncul lagi.",
        examples: ["I’ll contact you if the alarm returns.","I’ll message you if the machine stops again."],
        prompt: "Katakan bahwa kamu akan menelepon kembali jika masalahnya muncul lagi."
      },
      {
        id: "handover-01",
        pattern: "will",
        focus: "“I’ll leave the site at [time]” menyatakan rencana meninggalkan lokasi pada waktu tertentu. Placeholder [time] diganti waktu sebenarnya.",
        context: "Kamu memberi tahu supervisor atau tim berikutnya kapan kamu akan meninggalkan lokasi.",
        examples: ["I’ll leave the site at 4 PM.","We’ll leave the site after the handover."],
        prompt: "Katakan bahwa kamu akan meninggalkan lokasi pada pukul 4 sore."
      },
      {
        id: "handover-02",
        pattern: "will",
        focus: "“Team [name] will take over” menyatakan pihak yang akan menggantikanmu. “After I leave” menjelaskan waktunya.",
        context: "Kamu memperkenalkan tim yang akan melanjutkan pekerjaan setelah shiftmu selesai.",
        examples: ["Team B will take over after the handover.","The next shift will continue the work."],
        prompt: "Katakan bahwa Tim B akan mengambil alih setelah kamu pergi."
      }
    ]
  },
  {
    day: 34,
    phase: "Handover",
    title: "Memberi briefing serah terima",
    goal: "Menyampaikan status, rencana, dan pekerjaan yang belum selesai kepada tim berikutnya.",
    items: [
      {
        id: "handover-03",
        pattern: "futurecont",
        focus: "“I’ll be leaving” adalah future continuous untuk kegiatan yang akan berlangsung pada waktu tertentu. Kalimat kedua memakai will + base verb untuk rencana pengambilalihan yang lebih singkat.",
        context: "Kamu memberi briefing lengkap tentang waktu keberangkatan dan tim yang akan melanjutkan pekerjaan.",
        examples: ["I’ll be leaving at 4 PM. Team B will continue the inspection.","We’ll be handing over the site at 6 PM."],
        prompt: "Katakan bahwa kamu akan meninggalkan lokasi pukul 4 sore dan Tim B akan melanjutkan pekerjaan."
      },
      {
        id: "handover-04",
        pattern: "will",
        focus: "“I’ll let the next team know” memakai let + person + know untuk menyampaikan informasi kepada tim berikutnya.",
        context: "Sebelum pergi, kamu akan memberi tahu tim berikutnya tentang status mesin saat ini.",
        examples: ["I’ll tell the next shift about the alarm.","I’ll inform the supervisor about the open issue."],
        prompt: "Katakan bahwa kamu akan memberi tahu tim berikutnya tentang status mesin saat ini."
      },
      {
        id: "handover-05",
        pattern: "time",
        focus: "“I’ll brief the next team before I leave” memakai will + before + present simple. Briefing dilakukan sebelum keberangkatan.",
        context: "Kamu merencanakan briefing singkat dengan tim berikutnya sebelum meninggalkan lokasi.",
        examples: ["I’ll explain the open issue before the handover.","I’ll review the checklist before I go."],
        prompt: "Katakan bahwa kamu akan memberi briefing kepada tim berikutnya sebelum pergi."
      },
      {
        id: "handover-07",
        pattern: "notyet",
        focus: "“Has not been fully resolved yet” memakai present perfect negatif + yet. Artinya masalah belum tuntas sampai sekarang.",
        context: "Kamu menyerahkan pekerjaan yang masih berlangsung dan ingin menyampaikan statusnya dengan jujur.",
        examples: ["The alarm has not been cleared yet.","The repair has not been completed yet."],
        prompt: "Katakan bahwa masalahnya belum sepenuhnya teratasi."
      },
      {
        id: "handover-08",
        pattern: "needto",
        focus: "“The next team needs to continue” memakai needs to + base verb karena subjeknya team (it). Ini menjelaskan tugas lanjutan.",
        context: "Kamu memberi tahu tim berikutnya bahwa troubleshooting belum selesai dan harus dilanjutkan.",
        examples: ["The next shift needs to check the alarm.","The maintenance team needs to replace the fan."],
        prompt: "Katakan bahwa tim berikutnya perlu melanjutkan troubleshooting."
      }
    ]
  },
  {
    day: 35,
    phase: "Handover",
    title: "Menutup pekerjaan dan sesi",
    goal: "Menyerahkan status pemantauan, mengonfirmasi briefing, dan menutup sesi remote.",
    items: [
      {
        id: "handover-06",
        pattern: "under",
        focus: "“Is still under observation” berarti mesin masih dipantau. Ini bukan pernyataan bahwa masalah sudah selesai.",
        context: "Kamu menyerahkan mesin yang sudah stabil tetapi masih perlu dipantau oleh tim berikutnya.",
        examples: ["The line is still under close observation.","The system is still under review."],
        prompt: "Katakan bahwa mesin masih dalam pemantauan."
      },
      {
        id: "handover-09",
        pattern: "pp",
        focus: "“I’ve informed” menyatakan briefing sudah dilakukan. “About the problem” menjelaskan isi informasinya.",
        context: "Kamu sudah memberi tahu tim berikutnya tentang masalah dan status pekerjaan.",
        examples: ["I’ve briefed the next shift about the alarm.","I’ve updated the supervisor about the open issue."],
        prompt: "Katakan bahwa kamu sudah memberi tahu tim berikutnya tentang masalahnya."
      },
      {
        id: "handover-10",
        pattern: "will",
        focus: "Dua kalimat dengan will menyatakan rencana keberangkatan dan pengambilalihan. Sebutkan waktu serta nama tim secara jelas.",
        context: "Kamu memberikan contoh handover konkret dengan waktu dan tim yang akan melanjutkan.",
        examples: ["I’ll leave at 6 PM. Team A will continue the inspection.","We’ll hand over at 8 PM. The night shift will monitor the machine."],
        prompt: "Katakan bahwa kamu akan meninggalkan lokasi pukul 4 sore dan Tim B akan mengambil alih."
      },
      {
        id: "end-02",
        pattern: "will",
        focus: "“I’ll close the remote session now” menyatakan tindakan penutup yang akan segera dilakukan.",
        context: "Pekerjaan dan briefing selesai, lalu kamu menutup sesi remote dengan engineer.",
        examples: ["I’ll end the screen sharing now.","We’ll close the support session after the summary."],
        prompt: "Katakan bahwa kamu akan menutup sesi remote sekarang."
      },
      {
        id: "end-05",
        pattern: "will",
        focus: "“I’ll send you a summary” menjanjikan ringkasan setelah sesi. “Of what we did” menjelaskan isi ringkasannya.",
        context: "Sesi remote selesai dan kamu berjanji mengirim ringkasan pekerjaan kepada engineer remote.",
        examples: ["I’ll email you a summary of the repair.","I’ll share the handover notes with you."],
        prompt: "Katakan bahwa kamu akan mengirimkan ringkasan tentang apa yang telah kalian lakukan."
      }
    ]
  }
];

export const PROGRAM_PATTERN_BY_ID = Object.fromEntries(
  PROGRAM_PATTERNS.map(pattern => [pattern.id, pattern])
);

export const PROGRAM_DAY_BY_NUMBER = Object.fromEntries(
  PROGRAM_DAYS.map(day => [day.day, day])
);

export const PROGRAM_TOTAL_DAYS = PROGRAM_DAYS.length;

export const PROGRAM_TOTAL_PHRASES = PROGRAM_DAYS.reduce(
  (total, day) => total + day.items.length,
  0
);

export const PROGRAM_PHRASE_IDS = new Set(
  PROGRAM_DAYS.flatMap(day => day.items.map(item => item.id))
);

export const PROGRAM_ITEM_BY_ID = Object.fromEntries(
  PROGRAM_DAYS.flatMap(day => day.items.map(item => [
    item.id,
    { ...item, day: day.day, dayTitle: day.title }
  ]))
);

