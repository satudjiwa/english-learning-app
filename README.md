# Small Steps English

English for Service Engineers — calm, mobile-first speaking practice for Indonesian
airport service engineers.

This repository is the `rebuild-v2` foundation: six planned modules, **one complete
sample lesson**, and two reusable practice modes. The old 35-day / 224-phrase app is
preserved by the `backup-before-rebuild` tag.

## Current state

- **6 modules** with titles, levels, descriptions, and five planned lesson slots each.
- **1 finished lesson**: `M1-L01 — Introducing Yourself as a Service Engineer`.
- **Real MP3 audio** for `M1-L01`: 16 sentence files plus `full.mp3`, generated
  with Piper TTS (neural, not human).
- **29 “Coming soon” slots** that are visible but not clickable.
- **Teleprompter** and **Shadowing** are reusable components driven by lesson JSON.
- No backend, no login, no paid API, and no build framework.
- Static vanilla ES modules, hash routing, and GitHub Pages deployment.

## Pages and routes

| Page | Route |
| --- | --- |
| Home | `#/` |
| Module Library | `#/modules` |
| Lesson | `#/lesson/M1-L01` |
| Teleprompter | `#/lesson/M1-L01/teleprompter` |
| Shadowing | `#/lesson/M1-L01/shadowing` |

Unknown routes and lessons that are not in `data/lessons/index.json` show a clear
not-found or “Coming soon” page.

## Project structure

```text
index.html                     app shell and navigation
styles.css                     mobile-first design system and mode layouts
manifest.webmanifest           installable PWA metadata
sw.js                          offline app shell and runtime cache
icon.svg                       app icon

public/
  audio/M1/M1-L01/             real MP3s (sentence-01…16.mp3, full.mp3)

data/
  modules.json                 six modules and planned lesson counts
  lessons/
    index.json                 manifest of finished, openable lessons
    M1-L01.json                complete sample lesson

js/
  app.js                       hash router, route chrome, error states
  data.js                      JSON loading, lesson-slot generation, progress math
  store.js                     localStorage schema and preferences
  lib/audio.js                 MP3 probe, browser TTS fallback, sequential playback
  components/
    teleprompter.js            auto-scroll reader
    shadowing.js               five-step audio practice player
  views/                       home, modules, lesson, teleprompter, shadowing, 404
  icons.js                     inline icon set
  utils.js                     HTML escaping

scripts/
  validate-lessons.mjs         lesson/schema validation
  build.mjs                    static `_site/` build
  serve.mjs                    dependency-free local server

tools/
  generate_audio.py            local Piper → MP3 generator
  voices/                      local Piper models and tracked model cards

.github/workflows/pages.yml    validate -> build -> deploy to GitHub Pages
```

## Lesson data

Lesson JSON is separate from the UI. A lesson contains:

```json
{
  "id": "M1-L01",
  "moduleId": "M1",
  "title": "Introducing Yourself as a Service Engineer",
  "difficulty": "Beginner",
  "situation": "...",
  "objective": "...",
  "dialogue": [
    {
      "speaker": "Technician",
      "english": "Good morning, and my name is Alex.",
      "indonesian": "Selamat pagi, dan nama saya Alex.",
      "audio": "public/audio/M1/M1-L01/sentence-01.mp3"
    }
  ],
  "keyExpressions": [],
  "sentencePatterns": [],
  "learningNotes": [],
  "pronunciationNotes": [],
  "fullAudio": "public/audio/M1/M1-L01/full.mp3"
}
```

`data/lessons/index.json` is the source of truth for which lessons can be opened.
Adding a lesson means adding its JSON file **and** its index entry.

### Validation rules

`npm run validate:lessons` checks:

- six modules with unique IDs, correct module numbers, and five lessons each;
- unique lesson IDs in both the lesson files and `index.json`;
- every index entry has a matching lesson file, title, difficulty, and module;
- every dialogue line has `speaker`, `english`, and `indonesian`;
- dialogue length is inside the range for the lesson difficulty:
  - Beginner: 12–16
  - Beginner–Elementary: 12–18
  - Elementary: 12–18
  - Elementary–Intermediate: 14–20
  - Intermediate: 14–20
- optional audio paths match
  `public/audio/M{1-6}/M{1-6}-L{NN}/sentence-{NN}.mp3` or `.../full.mp3`,
  belong to the same lesson, and point to a real file;
- each lesson has key expressions, sentence patterns, learning notes, and 1–2
  pronunciation notes.

## Audio behavior

Audio paths come only from lesson data. Components do not hard-code file names.

1. If a sentence or full-conversation MP3 path exists, the app verifies it with a
   `HEAD` request (2.5 second timeout) and plays it first.
2. If the MP3 is missing or fails, the app uses the browser’s `en-US` speech
   synthesis and shows **“Computer voice — temporary”**.
3. If speech synthesis also fails, the app shows **“Audio unavailable”**.

`M1-L01` ships with real audio:

```text
public/audio/M1/M1-L01/
  sentence-01.mp3 … sentence-16.mp3
  full.mp3
```

The build copies `public/` into `_site/public/`, so the app requests
`public/audio/...` relative to the deployed root. There is no separate `audio/`
folder on the deployed site.

Generated with Piper TTS (neural, not human).

### Generate audio with Piper

Requirements: Python 3.10+, `ffmpeg`, and local Piper voices. Models are large and
stay local; `.gitignore` excludes `*.onnx` and `*.onnx.json`. The small
`*.MODEL_CARD` files are tracked so the voice licenses remain visible.

```bash
python3 -m venv .venv
.venv/bin/pip install piper-tts
.venv/bin/python -m piper.download_voices \
  en_US-ryan-medium en_US-hfc_female-medium --download-dir tools/voices

export PIPER_BIN=.venv/bin/piper
python3 tools/generate_audio.py --lesson M1-L01
```

Voice mapping is editable at the top of `tools/generate_audio.py`:

| Speaker | Piper voice | Model-card license |
| --- | --- | --- |
| Technician | `en_US-ryan-medium` | CC BY-NC-SA 4.0 |
| Remote Engineer | `en_US-hfc_female-medium` | CC BY-NC-SA 4.0 |
| any other speaker | fallback to the Technician voice | — |

The generator:

- reads `data/lessons/index.json` when using `--all`;
- synthesizes each dialogue line with Piper;
- converts WAV to mono 128 kbps MP3 with ffmpeg;
- writes `sentence-01.mp3` … and `full.mp3` with 0.6 seconds of silence between
  sentences;
- skips files that already exist unless `--force` is passed;
- updates each lesson JSON only for files that really exist.

```bash
python3 tools/generate_audio.py --lesson M1-L01
python3 tools/generate_audio.py --all
python3 tools/generate_audio.py --lesson M1-L01 --force
```

The model cards are at `tools/voices/*.MODEL_CARD`. Both current voices use
non-commercial dataset licenses; review them before any commercial use. Piper
prints each voice’s license from its model card on every generator run.

## Progress and preferences

Stored under the single localStorage key:

```text
small-steps-english.v2
```

Saved values:

- `lastLessonId`
- `completedLessons`
- `preferences.teleprompter.speed` (1–10)
- `preferences.teleprompter.fontSize` (18–36 px)
- `preferences.teleprompter.lineSpacing` (1.2–2.2)
- `preferences.teleprompter.showIndonesian`
- `preferences.shadowing.speed` (0.75, 0.85, 1.0)
- `preferences.shadowing.showIndonesian`

Progress is local to the browser. There is no migration from the old app and no
sync between devices. Storage failures are handled silently so the app remains
usable in private browsing.

## Practice modes

### Teleprompter

- Starts paused, at the top, with the sentence crossing the center line highlighted.
- Play/Pause, restart, manual scroll (which pauses), fullscreen, and Wake Lock while
  playing. Wake Lock and fullscreen fail silently when unsupported.
- Speed 1–10, text 18–36 px, line spacing 1.2–2.2, English only / English + Indonesian.
- Dark reading surface with mobile controls and safe-area padding.

### Shadowing

- Play/Pause, replay current sentence, whole conversation, sentence-by-sentence,
  repeat sentence, repeat lesson.
- Current-sentence highlight, sentence counter, progress bar, transcript jump links.
- Speeds 0.75×, 0.85×, 1.0× and optional Indonesian translation.
- Five-step guide: Listen → Listen & Read → Repeat → Shadow → Without translation.
- Whole-conversation mode advances sequentially through sentence audio so the
  highlight and progress stay accurate.

## Commands

```bash
npm run validate:lessons   # validate modules, lessons, IDs, languages, audio paths
npm run build              # build _site/
npm run check              # validate + build
npm test                   # validate only
npm run serve              # local server at http://localhost:8080/
```

Audio generation is separate from npm:

```bash
python3 tools/generate_audio.py --lesson M1-L01
```

There are no npm dependencies to install. A local server is required because the app
loads lesson JSON with `fetch`; opening `index.html` with `file://` will not work.

## Deploy to GitHub Pages

The workflow validates lesson data, builds `_site/`, verifies required files, and
deploys the artifact. It runs on pushes to `main` and on manual dispatch.

```bash
git switch main
git merge --no-ff rebuild-v2
git push origin main
```

Then confirm **Settings → Pages → Source** is set to **GitHub Actions**. All paths are
relative and routing is hash-based, so the app works from the repository subpath
without a base-path setting.

The pre-rebuild state is available at tag `backup-before-rebuild`. The rebuild work
lives on branch `rebuild-v2` until it is merged.

## Known limitations

- Only `M1-L01` is written; the other 29 lesson slots are intentionally “Coming soon”.
- Only `M1-L01` has generated MP3s. Lessons added without audio fall back to browser
  speech synthesis.
- Piper audio is neural, not human; pronunciation and prosody are synthetic.
- Computer voice quality varies by device and browser; some environments have no
  speech engine and correctly show “Audio unavailable”.
- Shadowing is self-practice only: there is no microphone recording, pronunciation
  scoring, or speech recognition.
- Wake Lock and fullscreen depend on browser support and may be unavailable.
- Progress is device-local. Clearing browser data removes it.
- No migration from the old `v1` app.

## Safety

The lesson is language practice, not a maintenance procedure. It does not invent
electrical steps. For real work, follow site isolation/LOTO, work permits, and
authorization rules.
