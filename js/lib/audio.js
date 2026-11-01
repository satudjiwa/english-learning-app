const hasSpeech = typeof window !== "undefined" &&
  "speechSynthesis" in window &&
  "SpeechSynthesisUtterance" in window;

const probeCache = new Map();

function clampRate(value) {
  const rate = Number(value);
  if (!Number.isFinite(rate)) return 1;
  return Math.min(1.5, Math.max(0.5, rate));
}

function pickEnglishVoice() {
  if (!hasSpeech) return null;
  const voices = window.speechSynthesis.getVoices?.() || [];
  return voices.find(voice => /^en-US$/i.test(voice.lang))
    || voices.find(voice => /^en[-_]/i.test(voice.lang))
    || null;
}

async function probeAudio(path) {
  if (!path) return false;
  if (probeCache.has(path)) return probeCache.get(path);

  const promise = (async () => {
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 2500);
    try {
      const response = await fetch(path, {
        method: "HEAD",
        cache: "no-store",
        signal: controller.signal
      });
      return response.ok;
    } catch {
      return false;
    } finally {
      window.clearTimeout(timer);
    }
  })();

  probeCache.set(path, promise);
  return promise;
}

export function speechAvailable() {
  return hasSpeech;
}

export class LessonAudio {
  constructor() {
    this.generation = 0;
    this.audio = null;
    this.utterance = null;
    this.finishCurrent = null;
  }

  stop() {
    this.generation += 1;
    if (this.finishCurrent) {
      const finish = this.finishCurrent;
      this.finishCurrent = null;
      finish("cancelled");
    }
    if (this.audio) {
      this.audio.pause();
      this.audio.remove();
      this.audio.removeAttribute("src");
      this.audio.load();
      this.audio = null;
    }
    if (hasSpeech) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // Browser speech synthesis may fail silently.
      }
    }
    this.utterance = null;
  }

  async playLine(line, { rate = 1, onSource = () => {} } = {}) {
    this.stop();
    const generation = this.generation;
    const path = line?.audio;

    if (path && await probeAudio(path)) {
      if (generation !== this.generation) return "cancelled";
      onSource("mp3");
      const result = await this._playFile(path, rate, generation);
      if (result !== "failed") return result;
      if (generation !== this.generation) return "cancelled";
    }

    if (generation !== this.generation) return "cancelled";
    if (!hasSpeech || !line?.english) {
      onSource("unavailable");
      return "unavailable";
    }

    onSource("tts");
    return this._speak(line.english, rate, generation);
  }

  async playFull(lesson, { rate = 1, onSource = () => {} } = {}) {
    this.stop();
    const generation = this.generation;

    if (lesson?.fullAudio && await probeAudio(lesson.fullAudio)) {
      if (generation !== this.generation) return "cancelled";
      onSource("mp3");
      const result = await this._playFile(lesson.fullAudio, rate, generation);
      if (result !== "failed") return result;
      if (generation !== this.generation) return "cancelled";
    }

    if (generation !== this.generation) return "cancelled";
    if (!hasSpeech || !Array.isArray(lesson?.dialogue)) {
      onSource("unavailable");
      return "unavailable";
    }

    onSource("tts");
    for (const line of lesson.dialogue) {
      if (generation !== this.generation) return "cancelled";
      const result = await this._speak(line.english, rate, generation);
      if (result !== "ended") return result;
    }
    return "ended";
  }

  _playFile(path, rate, generation) {
    return new Promise(resolve => {
      const audio = new Audio();
      this.audio = audio;
      audio.preload = "auto";
      audio.src = path;
      audio.playbackRate = clampRate(rate);
      audio.setAttribute("aria-hidden", "true");
      audio.style.display = "none";
      document.body.append(audio);

      let settled = false;
      let started = false;

      const cleanup = () => {
        audio.onended = null;
        audio.onerror = null;
        audio.onplaying = null;
        audio.pause();
        audio.remove();
        if (this.audio === audio) this.audio = null;
      };

      const finish = status => {
        if (settled) return;
        settled = true;
        cleanup();
        if (this.finishCurrent === stopPlayback) this.finishCurrent = null;
        resolve(status);
      };

      const stopPlayback = status => finish(status);
      this.finishCurrent = stopPlayback;

      audio.onplaying = () => {
        started = true;
      };

      audio.onended = () => {
        finish(generation !== this.generation ? "cancelled" : "ended");
      };

      audio.onerror = () => {
        finish(generation !== this.generation ? "cancelled" : "failed");
      };

      audio.play().then(() => {
        started = true;
      }).catch(() => {
        if (generation !== this.generation) {
          finish("cancelled");
          return;
        }
        // Some browsers reject play() while the media still starts, and media
        // elements can reject before enough data is available. Give the real
        // playback events a moment before falling back to speech synthesis.
        window.setTimeout(() => {
          if (settled) return;
          if (started || !audio.paused || audio.currentTime > 0) return;
          finish("failed");
        }, 800);
      });
    });
  }

  _speak(text, rate, generation) {
    return new Promise(resolve => {
      if (!hasSpeech || !text) {
        resolve("unavailable");
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      utterance.rate = clampRate(rate);
      utterance.pitch = 1;
      utterance.volume = 1;
      const voice = pickEnglishVoice();
      if (voice) utterance.voice = voice;

      const finish = status => {
        this.finishCurrent = null;
        this.utterance = null;
        resolve(status);
      };

      this.finishCurrent = status => finish(status);
      this.utterance = utterance;

      utterance.onend = () => {
        if (generation !== this.generation) return resolve("cancelled");
        finish("ended");
      };

      utterance.onerror = event => {
        if (generation !== this.generation || event.error === "interrupted" || event.error === "canceled") {
          return resolve("cancelled");
        }
        finish("unavailable");
      };

      try {
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utterance);
      } catch {
        finish("unavailable");
      }
    });
  }
}
