# Small Steps English

English for Service Engineers — calm, mobile-first speaking practice for Indonesian
airport service engineers.

The app is rebuilt around **verb modules**: one everyday verb, five short parts, and
two reusable practice modes (Teleprompter and Shadowing). The old 35-day / 224-phrase
app is preserved by the `backup-before-rebuild` tag.

## Current state

- **13 verb modules** — GO, COME, HAVE, BRING, GIVE, TAKE, MAKE, GET, DO, PUT, WORK,
  SEE, and KEEP — with five planned parts each (65 parts total).
- **5 finished parts**, all in the HAVE module: `HAVE-P01` through `HAVE-P05`.
- **Real MP3 audio** for all five finished parts: 25 sentence files plus five
  `full.mp3` files, generated with Piper TTS (neural, not human).
- **60 “Coming soon” parts** that are visible but not openable.
- **Teleprompter** and **Shadowing** are reusable components driven by lesson JSON.
- No backend, no login, no paid API, and no build framework.
- Static vanilla ES modules, hash routing, and GitHub Pages deployment.

### Curriculum

| # | Module | Focus | Parts |
| --- | --- | --- | --- |
| 01 | GO | go to work, go home, go back, go wrong, go through | Coming soon |
| 02 | COME | come in, come back, come from, come up with, come across | Coming soon |
| 03 | **HAVE** | meals, meetings, time, problems, questions, obligation, a look, a rest | **Complete (5/5)** |
| 04 | BRING | bring things, bring back, bring up, bring out, bring together | Coming soon |
| 05 | GIVE | give a hand, an update, instructions, feedback, give up | Coming soon |
| 06 | TAKE | take a break, a look, care of, take off/out, take over | Coming soon |
| 07 | MAKE | make coffee, a plan, a decision, a mistake, progress | Coming soon |
| 08 | GET | get to work, get a part, get ready, get better, get back | Coming soon |
| 09 | DO | do the job, a check, paperwork, do well, do without | Coming soon |
| 10 | PUT | put away, put on, put back, put together, put off | Coming soon |
| 11 | WORK | work at a job, work on, work with, work out, a machine works | Coming soon |
| 12 | SEE | see things, see a problem, see if, see you later, I see | Coming soon |
| 13 | KEEP | keep going, keep calm, keep a record, keep in touch, keep up | Coming soon |

The module list and part titles live in `data/modules.json`.

## Pages and routes

| Page | Route |
| --- | --- |
| Home | `#/` |
| Module Library | `#/modules` |
| Lesson | `#/lesson/HAVE-P01` |
| Teleprompter | `#/lesson/HAVE-P01/teleprompter` |
| Shadowing | `#/lesson/HAVE-P01/shadowing` |

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
  audio/HAVE/HAVE-P01/         real MP3s (sentence-01…05.mp3, full.mp3)
  audio/HAVE/HAVE-P02/ … P05/  real MP3s for the finished module

data/
  modules.json                 13 verb modules with five planned parts each
  lessons/
    index.json                 manifest of finished, openable parts
    HAVE-P01.json … P05.json   finished lessons

js/
  app.js                       hash router, route chrome, error states
  data.js                      JSON loading, part slots, progress math
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

Lesson JSON is separate from the UI. Each file is one part of a verb module:

```json
{
  "id": "HAVE-P01",
  "moduleId": "HAVE",
  "title": "Have Breakfast & Have Lunch",
  "partTitle": "Have Breakfast & Have Lunch",
  "level": "Beginner (A1–A2)",
  "situation": "Meals around a morning shift at the airport.",
  "objective": "Use have breakfast and have lunch to talk about your daily meals at work.",
  "dialogue": [
    {
      "speaker": "Narrator",
      "english": "I have breakfast at home before my morning shift.",
      "indonesian": "Saya sarapan di rumah sebelum shift pagi.",
      "audio": "public/audio/HAVE/HAVE-P01/sentence-01.mp3"
    }
  ],
  "keyExpressions": [
    {
      "english": "have breakfast",
      "indonesian": "sarapan"
    }
  ],
  "learningNotes": [
    "Kata kerja have dipakai untuk makan: have breakfast, have lunch, have dinner."
  ],
  "fullAudio": "public/audio/HAVE/HAVE-P01/full.mp3"
}
```

`data/lessons/index.json` is the source of truth for which parts can be opened.
Adding a part means adding its JSON file, its index entry, and an entry in the
`parts` list of `data/modules.json` (the list is already complete for all 65 parts).

### Validation rules

`npm run validate:lessons` checks:

- 13 modules with unique IDs, sequential numbers, and exactly five parts each;
- every part id is `<MODULE>-P01` … `<MODULE>-P05` and declared once in `modules.json`;
- unique lesson IDs in both the lesson files and `index.json`;
- every index entry has a matching lesson file with the same title and module;
- every dialogue line has `speaker`, `english`, and `indonesian`;
- each part has **3–8 short sentences**;
- optional audio paths match
  `public/audio/<MODULE>/<MODULE>-Pnn/sentence-nn.mp3` or `.../full.mp3`,
  belong to the same lesson, and point to a real file;
- each part has key expressions and learning notes.

## Audio behavior

Audio paths come only from lesson data. Components do not hard-code file names.

1. If a sentence or full-conversation MP3 path exists, the app verifies it with a
   `HEAD` request (2.5 second timeout) and plays it first.
2. If the MP3 is missing or fails, the app uses the browser’s `en-US` speech
   synthesis and shows **“Computer voice — temporary”**.
3. If speech synthesis also fails, the app shows **“Audio unavailable”**.

`HAVE-P01` through `HAVE-P05` ship with real audio:

```text
public/audio/HAVE/HAVE-P01/
  sentence-01.mp3 … sentence-05.mp3
  full.mp3
public/audio/HAVE/HAVE-P02/ … P05/
  sentence-01.mp3 … sentence-05.mp3
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
python3 tools/generate_audio.py --all
```

Voice mapping is editable at the top of `tools/generate_audio.py`:

| Speaker | Piper voice | Model-card license |
| --- | --- | --- |
| Technician | `en_US-ryan-medium` | CC BY-NC-SA 4.0 |
| Narrator | `en_US-ryan-medium` | CC BY-NC-SA 4.0 |
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
python3 tools/generate_audio.py --lesson HAVE-P01
python3 tools/generate_audio.py --all
python3 tools/generate_audio.py --lesson HAVE-P01 --force
```

The model cards are at `tools/voices/*.MODEL_CARD`. Both current voices use
non-commercial dataset licenses; review them before any commercial use. Piper
prints each voice’s license from its model card on every generator run.

## Progress and preferences

Stored under the single localStorage key:

```text
small-steps-english.v3
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

When the app sees the retired `small-steps-english.v2` payload, it keeps the user’s
practice preferences but starts a fresh progress list, because the old `M1-L01`
lesson IDs no longer exist.

## Practice modes

### Teleprompter

- Auto-scrolls the script at speed 1–10, with adjustable text size and line spacing.
- Current-sentence highlight, sentence counter, progress bar, transcript jump links.
- Optional Indonesian translation.

### Shadowing

- Five-step guide: Listen → Listen & Read → Repeat → Shadow → Without translation.
- Audio speeds 0.75×, 0.85×, and 1.0×, with optional Indonesian translation.
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
python3 tools/generate_audio.py --lesson HAVE-P01
```

There are no npm dependencies to install. A local server is required because the app
loads lesson JSON with `fetch`; opening `index.html` with `file://` will not work.

## Deploy to GitHub Pages

The workflow validates lesson data, builds `_site/`, verifies required files, and
deploys the artifact. It runs on pushes to `main` and on manual dispatch.

```bash
npm run check
git push origin main
```

Then confirm **Settings → Pages → Source** is set to **GitHub Actions**. All paths are
relative and routing is hash-based, so the app works from the repository subpath
without a base-path setting.

The pre-rebuild state is available at tag `backup-before-rebuild`. The verb
curriculum now lives on `main`; the older `rebuild-v2` branch is no longer used.

## Known limitations

- Only `HAVE-P01` through `HAVE-P05` are written; the other 60 parts are
  intentionally “Coming soon”.
- Only the finished HAVE parts have generated MP3s. Parts added without audio fall
  back to browser speech synthesis.
- Piper audio is neural, not human; pronunciation and prosody are synthetic.
- Computer voice quality varies by device and browser; some environments have no
  speech engine and correctly show “Audio unavailable”.
- Shadowing is self-practice only: there is no microphone recording, pronunciation
  scoring, or speech recognition.
- Wake Lock and fullscreen depend on browser support and may be unavailable.
- Progress is device-local. Clearing browser data removes it.
- No migration of old `v1`/`v2` progress, only of practice preferences.

## Safety

The lessons are language practice, not a maintenance procedure. They do not invent
electrical steps. For real work, follow site isolation/LOTO, work permits, and
authorization rules.
