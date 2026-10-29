/*
 * Text-to-speech memakai Web Speech API.
 *
 * Ini bukan rekaman narator profesional. Modul ini sengaja dipisahkan supaya
 * nanti bisa ditambah audio rekaman tanpa mengubah seluruh tampilan.
 */

import { getSettings } from "./store.js";
import { clamp } from "./utils.js";

const synth = typeof window !== "undefined" ? window.speechSynthesis : null;
const Utterance = typeof window !== "undefined" ? window.SpeechSynthesisUtterance : null;
const supported = Boolean(synth && Utterance);
const VOICE_PRIORITY = [
  "Google US English",
  "Samantha",
  "Ava",
  "Allison",
  "Aria",
  "Jenny",
  "Guy",
  "Alex",
  "Microsoft Aria",
  "Microsoft Jenny",
  "Microsoft Guy"
];

let voices = [];
let listeners = new Set();
let active = null;

function voiceScore(voice) {
  let score = 0;
  const lang = String(voice.lang || "").replace("_", "-").toLowerCase();
  if (lang === "en-us") score += 100;
  else if (lang.startsWith("en")) score += 40;
  const name = String(voice.name || "").toLowerCase();
  const priority = VOICE_PRIORITY.findIndex(item => name.includes(item.toLowerCase()));
  if (priority >= 0) score += 50 - priority;
  if (voice.localService) score += 5;
  return score;
}

function refreshVoices(emit = true) {
  if (!supported) return voices;
  try {
    voices = synth.getVoices()
      .filter(voice => /^en([-_]|$)/i.test(String(voice.lang || "")))
      .sort((a, b) => voiceScore(b) - voiceScore(a));
  } catch {
    voices = [];
  }
  if (emit) listeners.forEach(listener => listener(voices));
  return voices;
}

if (supported) {
  refreshVoices(false);
  if (typeof synth.addEventListener === "function") {
    synth.addEventListener("voiceschanged", () => refreshVoices(true));
  } else {
    synth.onvoiceschanged = () => refreshVoices(true);
  }
}

export function isSpeechSupported() {
  return supported;
}

export function getEnglishVoices() {
  if (!voices.length) refreshVoices(false);
  return [...voices];
}

export function getRecommendedVoice() {
  const list = getEnglishVoices();
  if (!list.length) return null;
  return list.find(voice => /^en-US$/i.test(String(voice.lang).replace("_", "-"))) || list[0];
}

function resolveVoice(voiceURI) {
  const list = getEnglishVoices();
  if (voiceURI) {
    const saved = list.find(voice => voice.voiceURI === voiceURI);
    if (saved) return saved;
  }
  return getRecommendedVoice();
}

/**
 * Putar kalimat. Mengembalikan status langsung supaya pemanggil bisa
 * menampilkan pesan ramah saat browser tidak mendukung.
 */
export function speak(text, options = {}) {
  if (!supported) return { ok: false, reason: "unsupported" };
  if (!text || typeof text !== "string") return { ok: false, reason: "empty" };

  try {
    synth.cancel();
    if (synth.paused) synth.resume();

    const settings = getSettings();
    const voice = resolveVoice(options.voiceURI ?? settings.voiceURI);
    const baseRate = Number(options.rate ?? settings.rate) || settings.rate;
    const rate = clamp(options.slow ? baseRate * 0.68 : baseRate, 0.5, 1.5);
    const spokenText = text
      .replace(/\[time\]/gi, "the agreed time")
      .replace(/\bTeam\s+\[name\]/gi, "The next team")
      .replace(/\[name\]/gi, "the next team");

    const utterance = new Utterance(spokenText);
    utterance.lang = voice?.lang || "en-US";
    if (voice) utterance.voice = voice;
    utterance.rate = rate;
    utterance.pitch = 1;
    utterance.volume = 1;
    utterance.onstart = () => {
      active = utterance;
      options.onStart?.();
    };
    utterance.onend = () => {
      if (active === utterance) active = null;
      options.onEnd?.();
    };
    utterance.onerror = event => {
      if (active === utterance) active = null;
      if (event.error === "interrupted" || event.error === "canceled") return;
      console.warn("Speech synthesis gagal:", event.error);
      options.onError?.(event.error || "unknown");
    };

    active = utterance;
    synth.speak(utterance);
    return { ok: true, voice: voice?.name || "default", rate };
  } catch (error) {
    console.warn("Speech synthesis tidak dapat dimulai:", error);
    return { ok: false, reason: "error" };
  }
}

export function stopSpeaking() {
  if (!supported) return;
  try {
    synth.cancel();
  } catch {
    // Tidak ada yang perlu dilakukan.
  }
  active = null;
}

export function subscribeVoices(listener) {
  listeners.add(listener);
  if (listener) listener(getEnglishVoices());
  return () => listeners.delete(listener);
}

export function speechErrorID(code) {
  if (code === "not-allowed") return "Browser memblokir pemutaran suara. Coba tekan tombol putar sekali lagi.";
  if (code === "language-unavailable" || code === "voice-unavailable") {
    return "Suara bahasa Inggris tidak tersedia di perangkat ini. Coba pilih suara lain di Pengaturan.";
  }
  if (code === "audio-busy") return "Perangkat audio sedang dipakai. Coba lagi sebentar.";
  return "Audio tidak dapat diputar di browser ini. Kamu tetap bisa membaca kalimatnya dengan suara keras.";
}
