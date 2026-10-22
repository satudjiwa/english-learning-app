/* Small Steps English — logika aplikasi.
 *
 * Data materi TIDAK ditulis di file ini. File ini memuat "./lessons.json",
 * yang dihasilkan oleh sync_materials_to_app.mjs dari raw store
 * ~/outputs/english_learning_library_mvp/materials.json
 * (materi hasil scrape BrowserOS neo).
 *
 * Untuk menambah materi: ubah materials.json di raw store, lalu jalankan
 * node ~/sync_materials_to_app.mjs
 */

const LESSONS_FILE = "./lessons.json?v=original-audio-20261022";
const KNOWN_CATEGORIES = ["Everyday Conversation", "Workplace English", "Listening Focus"];
const GRAMMAR_FALLBACK = "Lihat bentuk kata kerja dan kata bantu pada kalimat ini.";

let lessons = [];
let categories = ["Semua"];
let loadError = null;

function refreshCategories(){
  const used = [...new Set(lessons.map(l => l.category))];
  const ordered = [...KNOWN_CATEGORIES.filter(c => used.includes(c)), ...used.filter(c => !KNOWN_CATEGORIES.includes(c)).sort()];
  categories = ["Semua", ...ordered];
}

function validateLesson(m){
  const problems = [];
  if (!m || typeof m !== "object") return ["bukan objek"];
  for (const k of ["id","title","category","level","topic","objective","url","transcript","vocab"])
    if (typeof m[k] !== "string" || !m[k].trim()) problems.push('field "'+k+'" kosong');
  if (!Array.isArray(m.expressions) || !m.expressions.length) problems.push('"expressions" harus array berisi minimal 1 pasangan [inggris, indonesia]');
  else m.expressions.forEach((pair,i) => { if (!Array.isArray(pair) || pair.length < 2 || !pair[0] || !pair[1]) problems.push('expressions['+i+'] harus pasangan [inggris, indonesia]') });
  if (!m.exercise || typeof m.exercise !== "object") problems.push('"exercise" wajib ada');
  else for (const k of ["prompt","answer","hint"]) if (typeof m.exercise[k] !== "string" || !m.exercise[k].trim()) problems.push('exercise.'+k+' kosong');
  if (!KNOWN_CATEGORIES.includes(m.category)) problems.push('category "'+m.category+'" di luar daftar yang dikenal');
  return problems;
}

async function loadLessons(){
  try {
    const res = await fetch(LESSONS_FILE);
    if (!res.ok) throw new Error("HTTP " + res.status + " untuk " + LESSONS_FILE);
    const data = await res.json();
    if (!Array.isArray(data)) throw new Error("format lessons.json bukan array");
    const valid = [];
    for (const m of data) {
      const problems = validateLesson(m);
      if (problems.length) { console.warn('Materi "' + (m && m.id || "?") + '" dilewati: ' + problems.join("; ")); continue; }
      valid.push(m);
    }
    if (!valid.length) throw new Error("tidak ada materi valid di " + LESSONS_FILE);
    lessons = valid;
    loadError = null;
    refreshCategories();
    render();
  } catch (err) {
    loadError = err;
    console.error("Gagal memuat materi:", err);
    render();
  }
}




const STORE_KEY = "small-steps-english-v1";
const state = {view:"home",filter:"Semua",search:"",lessonId:null};
const content = document.querySelector("#app-content");
const breadcrumb = document.querySelector("#breadcrumb");

let store = loadStore();

function loadStore(){try{return JSON.parse(localStorage.getItem(STORE_KEY))||{completed:{},reviews:{}}}catch{return {completed:{},reviews:{}}}}
function saveStore(){localStorage.setItem(STORE_KEY,JSON.stringify(store));updateReviewCount()}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function categoryClass(c){return c==="Workplace English"?"work":c==="Listening Focus"?"listen":""}
function categoryLabel(c){return c==="Everyday Conversation"?"Everyday":c==="Workplace English"?"Workplace":c==="Listening Focus"?"Listening":c}
function card(l){const done=!!store.completed[l.id];return `<article class="lesson-card" tabindex="0" role="button" data-lesson="${l.id}" aria-label="Buka materi ${esc(l.title)}"><div class="card-top"><span class="pill ${categoryClass(l.category)}">${categoryLabel(l.category)}</span>${done?'<span class="card-check" aria-label="Selesai">✓</span>':''}</div><h3>${esc(l.title)}</h3><p>${esc(l.topic)}</p><div class="card-foot"><span>${esc(l.level)}</span><span>${done?"Sudah dipelajari":"12–15 menit"}</span></div></article>`}
function getDueReviews(){const now=Date.now();return lessons.filter(l=>(store.reviews[l.id]?.due||0)<=now&&store.reviews[l.id]?.due)}
function updateReviewCount(){document.querySelectorAll("#lesson-nav-count").forEach(el=>el.textContent=lessons.length);const n=getDueReviews().length;document.querySelectorAll("#review-nav-count").forEach(el=>el.textContent=n);document.querySelector("#mobile-review-dot")?.classList.toggle("visible",n>0)}
function setView(view){state.view=view;state.lessonId=null;render()}
function openLesson(id){state.view="lesson";state.lessonId=id;render()}
function render(){if(loadError)return renderLoadError(loadError);if(!lessons.length)return renderLoading();updateReviewCount();document.querySelectorAll(".nav-item[data-view]").forEach(b=>b.classList.toggle("active",b.dataset.view===state.view||(state.view==="lesson"&&b.dataset.view==="library")));if(state.view==="lesson")return renderLesson();if(state.view==="library")return renderLibrary();if(state.view==="review")return renderReview();return renderHome()}
function renderHome(){breadcrumb.innerHTML='Ruang belajar <span>/</span> Beranda';const done=Object.keys(store.completed).length;const review=getDueReviews();const next=lessons.find(l=>!store.completed[l.id])||lessons[0];content.innerHTML=`<section class="hero"><div class="hero-copy"><div class="eyebrow">BELAJAR BAHASA INGGRIS · LEVEL PEMULA</div><h1>Bahasa Inggris tumbuh dari langkah kecil.</h1><p>Latihan 15 menit untuk mendengar, memahami, mengulang, lalu memakai kalimat dalam kehidupan sehari-hari dan pekerjaan.</p><button class="hero-button" data-open="${next.id}">Mulai belajar <span aria-hidden="true">→</span></button></div><div class="hero-art" aria-hidden="true"><div class="art-card"><span>ENGLISH · EVERY DAY</span><strong>Listen.<br>Repeat.<br>Keep going.</strong><i>✓</i></div></div></section>
<section class="stats-row"><div class="stat-card"><div class="stat-icon">▤</div><div><div class="stat-num">${lessons.length}</div><div class="stat-label">materi singkat</div></div></div><div class="stat-card"><div class="stat-icon">✳</div><div><div class="stat-num">${done}<span style="font-size:11px;color:#89958e;font-weight:500"> / ${lessons.length}</span></div><div class="stat-label">materi selesai</div></div></div><div class="stat-card"><div class="stat-icon">↻</div><div><div class="stat-num">${review.length}</div><div class="stat-label">kalimat siap diulang</div></div></div></section>
<div class="section-head"><div><div class="eyebrow">SESI HARI INI</div><h2>Mulai dengan satu materi</h2></div><button class="text-button" data-view="library">Lihat semua →</button></div>
<section class="today-card"><div class="today-left"><div class="play-badge">▶</div><div><div class="today-meta">${esc(next.category)} · ${esc(next.level)}</div><h3>${esc(next.title)}</h3><p>${esc(next.objective)}</p><span class="duration">◷ &nbsp;12–15 menit</span></div></div><button class="small-primary" data-open="${next.id}">Buka pelajaran</button></section>
<div class="section-head"><div><div class="eyebrow">PILIHAN UNTUKMU</div><h2>Belajar sesuai kebutuhan</h2></div><button class="text-button" data-view="library">Perpustakaan →</button></div><section class="lesson-grid">${lessons.slice(0,3).map(card).join("")}</section>`;bindCommon()}
function renderLibrary(){breadcrumb.innerHTML='Ruang belajar <span>/</span> Materi belajar';const filtered=lessons.filter(l=>(state.filter==="Semua"||l.category===state.filter)&&`${l.title} ${l.topic} ${l.category}`.toLowerCase().includes(state.search.toLowerCase()));content.innerHTML=`<div class="section-head" style="margin-top:0"><div><div class="eyebrow">PERPUSTAKAAN MATERI</div><h2>Belajar satu topik setiap kali</h2><p>Kalimat dan terjemahan tampil di sini; audio asli diputar di dalam pelajaran bila tersedia.</p></div></div><div class="filter-row">${categories.map(c=>`<button class="filter-chip ${state.filter===c?"active":""}" data-filter="${c}">${c=== "Semua"?`Semua materi (${lessons.length})`:`${categoryLabel(c)} (${lessons.filter(l=>l.category===c).length})`}</button>`).join("")}<label class="search-box"><input id="lesson-search" type="search" placeholder="Cari topik atau materi…" value="${esc(state.search)}" aria-label="Cari materi"></label></div><section class="lesson-grid">${filtered.length?filtered.map(card).join(""):'<div class="empty-state">Materi tidak ditemukan. Coba kata kunci lain.</div>'}</section>`;bindCommon();document.querySelectorAll("[data-filter]").forEach(b=>b.onclick=()=>{state.filter=b.dataset.filter;renderLibrary()});document.querySelector("#lesson-search").oninput=e=>{state.search=e.target.value;const pos=e.target.selectionStart;renderLibrary();const input=document.querySelector("#lesson-search");input.focus();input.setSelectionRange(pos,pos)}}
function safeMediaUrl(value){try{const url=new URL(value);return url.protocol==="https:"?url.href:""}catch{return ""}}
function audioBlock(l){const url=safeMediaUrl(l.audio_url);if(l.audio_embed_allowed===true&&url)return `<div class="official-media"><span class="media-label">Audio asli · ${esc(l.source_website||"sumber resmi")}</span><audio controls preload="none" src="${esc(url)}">Browser Anda tidak mendukung pemutar audio.</audio>${l.audio_duration&&l.audio_duration!=="Unknown"?`<small>Durasi: ${esc(l.audio_duration)}</small>`:""}</div>`;const frame=safeMediaUrl(l.frame_url);if(l.frame_embed_allowed===true&&frame)return `<div class="official-media"><span class="media-label">Pemutar audio asli dari sumber</span><div class="official-frame"><iframe src="${esc(frame)}" title="Pemutar audio dan transkrip di halaman sumber" loading="lazy"></iframe></div></div>`;return `<div class="audio-controls"><p>Audio asli tidak dapat diputar tertanam untuk materi ini. Gunakan pemutar resmi di halaman sumber.</p><a class="source-link" href="${esc(l.url)}" target="_blank" rel="noopener noreferrer">▶ Buka audio asli di situs sumber <span aria-hidden="true">↗</span></a></div>`}
function transcriptBlock(l){if(l.transcript_embed_allowed!==true||typeof l.transcript_text!=="string"||!l.transcript_text.trim())return "";const text=esc(l.transcript_text).replace(/\r?\n/g,"<br>");return `<details class="official-transcript"><summary>Transkrip resmi</summary><div class="transcript-text">${text}</div></details>`}
function renderLesson(){const l=lessons.find(x=>x.id===state.lessonId);if(!l)return setView("home");breadcrumb.innerHTML=`Ruang belajar <span>/</span> ${categoryLabel(l.category)} <span>/</span> ${esc(l.title)}`;const done=!!store.completed[l.id];const reviewDue=!!store.reviews[l.id]&&store.reviews[l.id].due<=Date.now();content.innerHTML=`<section class="lesson-detail"><button class="back-link" data-view="library">← Kembali ke materi</button><div class="detail-banner"><div><span class="pill">${categoryLabel(l.category)}</span><h1>${esc(l.title)}</h1><p>${esc(l.objective)}</p></div><span class="level-tag">${esc(l.level)} &nbsp;·&nbsp; 12–15 menit</span></div><div class="detail-columns"><div><section class="panel"><div class="eyebrow">KALIMAT LATIHAN & TERJEMAHAN</div><h2>Listen, then repeat</h2>${audioBlock(l)}<div class="phrase-list">${l.expressions.map(([en,id])=>`<div class="phrase-row"><div><strong>${esc(en)}</strong><small>${esc(id)}</small><small class="phrase-tense"><b>Tata bahasa:</b> ${esc(l.tenseNotes?.[en]||GRAMMAR_FALLBACK)}</small></div></div>`).join("")}</div>${transcriptBlock(l)}</section><section class="panel" style="margin-top:14px"><div class="eyebrow">KOSAKATA DALAM KONTEKS</div><h2>Ingat beberapa kata saja</h2><p style="font-size:11px;color:#647168;line-height:1.7;margin:0">${esc(l.vocab)}</p></section><section class="panel" style="margin-top:14px"><div class="eyebrow">RUTINITAS BELAJAR</div><h2>Ikuti lima langkah</h2><div class="steps-list"><div class="step-row"><span class="step-number">1</span><span><b>Listen</b> — dengarkan materi tanpa membaca dulu.</span></div><div class="step-row"><span class="step-number">2</span><span><b>Understand</b> — buka transkrip dan cek makna.</span></div><div class="step-row"><span class="step-number">3</span><span><b>Repeat</b> — tirukan 2–3 kalimat dengan suara keras.</span></div><div class="step-row"><span class="step-number">4</span><span><b>Use</b> — ganti nama, waktu, atau benda dengan informasi sendiri.</span></div><div class="step-row"><span class="step-number">5</span><span><b>Review</b> — coba jawab latihan, lalu ulangi lagi nanti.</span></div></div></section></div><div><section class="panel source-panel"><div class="eyebrow">MATERI SUMBER</div><h2>Audio asli & sumber resmi</h2><p>Jika pemutar audio asli tersedia, Anda bisa memutarnya langsung di sini. Materi lainnya membuka pemutar resmi di situs sumber.</p><a class="source-link" href="${esc(l.url)}" target="_blank" rel="noopener noreferrer">▶ &nbsp;Buka pelajaran resmi <span aria-hidden="true">↗</span></a><br><a class="source-link" href="${esc(l.transcript)}" target="_blank" rel="noopener noreferrer">▤ &nbsp;Buka transkrip / script resmi <span aria-hidden="true">↗</span></a></section><section class="exercise-box"><div class="eyebrow">CEK PEMAHAMAN</div><p><b>Lengkapi kalimat:</b><br>${esc(l.exercise.prompt)}</p><form id="answer-form" class="answer-line"><input id="answer-input" autocomplete="off" aria-label="Jawaban" placeholder="Tulis jawabanmu…"><button class="small-primary" type="submit">Cek</button></form><div id="answer-feedback" class="answer-feedback" aria-live="polite"></div><button class="text-button" id="hint-button" style="padding-left:0">Lihat petunjuk</button><div id="hint" hidden style="font-size:10px;color:#806943;margin-top:5px">${esc(l.exercise.hint)}</div></section>${l.roleplay?`<section class="panel" style="margin-top:14px"><div class="eyebrow">LATIHAN BICARA</div><h2>Praktik bersama teman</h2><p>${esc(l.roleplay)}</p></section>`:""}<section class="panel" style="margin-top:14px"><div class="eyebrow">SELESAIKAN SESI</div><h2>Sudah mencoba?</h2><div class="complete-row"><p>${done?reviewDue?"Review ini sudah jatuh tempo. Ulangi kalimat, lalu tandai selesai untuk menjadwalkan review berikutnya.":"Materi ini sudah selesai. Kalimat berikutnya akan muncul sesuai jadwal review.":"Tandai selesai untuk menjadwalkan review besok."}</p><button class="done-button ${done?"completed":""}" id="complete-button" ${done&&!reviewDue?"disabled":""}>${done?reviewDue?"Selesaikan review":"✓ Sudah dipelajari":"Tandai selesai"}</button></div></section><section class="panel" style="margin-top:14px"><div class="eyebrow">CATATAN KECIL</div><p style="font-size:10px;line-height:1.6;color:#77837d;margin:0">Jika audio tidak bisa diputar, coba buka dari halaman sumber. Materi ini tidak diunduh oleh aplikasi.</p></section></div></div></section>`;
document.querySelector("#hint-button").onclick=()=>document.querySelector("#hint").hidden=!document.querySelector("#hint").hidden;document.querySelector("#answer-form").onsubmit=e=>{e.preventDefault();const value=document.querySelector("#answer-input").value.trim().toLowerCase().replace(/[.!?]/g,"");const fb=document.querySelector("#answer-feedback");if(value===l.exercise.answer.toLowerCase()){fb.textContent="Betul! Bagus, coba ucapkan kalimatnya.";fb.style.color="#33764f"}else{fb.textContent=value?"Belum tepat. Coba lagi atau lihat petunjuk.":"Tulis jawaban dulu, ya.";fb.style.color="#a05f2b"}};document.querySelector("#complete-button").onclick=()=>completeLesson(l.id);bindCommon()}
function renderReview(){breadcrumb.innerHTML='Ruang belajar <span>/</span> Ulangi kalimat';const due=getDueReviews();content.innerHTML=`<div class="section-head" style="margin-top:0"><div><div class="eyebrow">REVIEW BERSELA</div><h2>Ulangi agar makin ingat</h2><p>Kalimat dari materi selesai dijadwalkan kembali secara bertahap.</p></div></div>${due.length?`<section class="review-list">${due.map(l=>`<article class="review-row"><div><span class="review-date">SIAP DIULANG SEKARANG</span><strong style="display:block;margin-top:5px">${esc(l.title)}</strong><p>${esc(l.expressions[0][0])}<br>${esc(l.expressions[0][1])}</p></div><button class="small-primary" data-review="${l.id}">Ulangi</button></article>`).join("")}</section>`:'<div class="empty-state"><strong>Belum ada review yang jatuh tempo.</strong><br><br>Selesaikan satu materi, lalu kalimatnya akan dijadwalkan untuk besok.</div>'}<div class="panel" style="margin-top:16px"><div class="eyebrow">JADWAL PENGULANGAN</div><h2>Ulangi setelah 1, 3, 7, 14, dan 28 hari</h2><p style="font-size:11px;line-height:1.6;color:#738077;margin:0">Tandai materi selesai. Aplikasi menyimpan progres di perangkat ini dan menampilkan materi yang siap diulang.</p></div>`;bindCommon();document.querySelectorAll("[data-review]").forEach(b=>b.onclick=()=>openLesson(b.dataset.review))}
function completeLesson(id){const now=Date.now(),existing=store.reviews[id],day=24*60*60*1000;store.completed[id]=now;if(!existing){store.reviews[id]={stage:0,due:now+day}}else if(existing.due<=now){const stage=Math.min(existing.stage+1,4),interval=[1,3,7,14,28][stage];store.reviews[id]={stage,due:now+interval*day}}saveStore();toast(existing?"Review selesai — jadwal berikutnya sudah diperbarui.":"Sesi selesai — kalimatnya muncul lagi besok.");renderLesson()}
function bindCommon(){document.querySelectorAll("[data-view]").forEach(b=>b.onclick=()=>setView(b.dataset.view));document.querySelectorAll("[data-open]").forEach(b=>b.onclick=()=>openLesson(b.dataset.open));document.querySelectorAll("[data-lesson]").forEach(c=>{c.onclick=()=>openLesson(c.dataset.lesson);c.onkeydown=e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();openLesson(c.dataset.lesson)}}})}
function renderLoading(){breadcrumb.innerHTML='Ruang belajar <span>/</span> <span>Memuat…</span>';content.innerHTML='<div class="empty-state"><strong>Memuat materi…</strong></div>'}
function renderLoadError(err){breadcrumb.innerHTML='Ruang belajar <span>/</span> <span>Gagal memuat</span>';content.innerHTML='<div class="empty-state"><strong>Materi tidak bisa dimuat.</strong><br><br><span style="font-size:11px;color:#77837d">'+esc(String((err&&err.message)||err))+'</span><br><br><button class="small-primary" id="retry-button">Coba lagi</button></div>';document.querySelector("#retry-button").onclick=()=>{loadError=null;render();loadLessons()}}

let toastTimer;function toast(message){const el=document.querySelector("#toast");el.textContent=message;el.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove("show"),2600)}
render();
loadLessons();
if("serviceWorker"in navigator&&location.protocol.startsWith("http")){navigator.serviceWorker.register("./sw.js").catch(()=>{})}
