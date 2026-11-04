#!/usr/bin/env python3
"""Generate lesson MP3 audio with local Piper TTS.

The web app fetches lesson audio from paths such as
``public/audio/GO/GO-P01/sentence-01.mp3``.  The static build copies the
``public/`` directory into ``_site/public/``, so the same relative path works
locally and on GitHub Pages.

Typical usage:

    PIPER_BIN=.venv/bin/piper python3 tools/generate_audio.py --lesson GO-P01
    PIPER_BIN=.venv/bin/piper python3 tools/generate_audio.py --all
    PIPER_BIN=.venv/bin/piper python3 tools/generate_audio.py --lesson GO-P01 --force

Piper models are intentionally not committed.  Keep them in ``tools/voices/``;
``.gitignore`` excludes the ``.onnx`` and ``.onnx.json`` files.
"""

from __future__ import annotations

import argparse
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
import wave
from dataclasses import dataclass
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
LESSONS_DIR = ROOT / "data" / "lessons"
PUBLIC_DIR = ROOT / "public"
VOICES_DIR = ROOT / "tools" / "voices"

LESSON_ID_RE = re.compile(r"^[A-Z]{2,5}-P\d{2}$")
MODULE_ID_RE = re.compile(r"^[A-Z]{2,5}$")
PATTERN_LESSON_ID_RE = re.compile(r"^PAT-D\d{2}$")
EXPRESSION_LESSON_ID_RE = re.compile(r"^EXP-[A-Z0-9]+(?:-[A-Z0-9]+)*$")

TRACK_FOLDERS = {
    "patterns": "PATTERNS",
    "expressions": "EXPRESSIONS",
}

SENTENCE_GAP_SECONDS = 0.6
SAMPLE_RATE = 22050
MP3_BITRATE = "128k"


@dataclass(frozen=True)
class Voice:
    """One Piper voice profile.  Edit these values to change the voices."""

    key: str
    label: str
    model: str
    config: str
    model_card: str
    length_scale: float = 1.0


# The two American-English voices used by the app.  Model names are the exact
# names accepted by ``python -m piper.download_voices``.
VOICES: dict[str, Voice] = {
    "technician": Voice(
        key="technician",
        label="Technician",
        model="en_US-ryan-medium.onnx",
        config="en_US-ryan-medium.onnx.json",
        model_card="en_US-ryan-medium.MODEL_CARD",
    ),
    "remote_engineer": Voice(
        key="remote_engineer",
        label="Remote Engineer",
        model="en_US-hfc_female-medium.onnx",
        config="en_US-hfc_female-medium.onnx.json",
        model_card="en_US-hfc_female-medium.MODEL_CARD",
    ),
}

# Add speakers here as lessons grow.  Any speaker not listed uses
# FALLBACK_VOICE.  Change FALLBACK_VOICE to a third profile if you want a
# separate voice for narrators or other characters.
SPEAKER_VOICES: dict[str, str] = {
    "Technician": "technician",
    "Narrator": "technician",
    "Remote Engineer": "remote_engineer",
}
FALLBACK_VOICE = "technician"


def is_nonempty_file(path: Path) -> bool:
    return path.is_file() and path.stat().st_size > 0


def find_executable(environment_name: str, names: list[str], extra: list[Path]) -> str:
    configured = os.environ.get(environment_name)
    if configured:
        candidate = Path(configured).expanduser()
        if candidate.is_file() and os.access(candidate, os.X_OK):
            return str(candidate)
        found = shutil.which(configured)
        if found:
            return found
        raise SystemExit(
            f"{environment_name} is set to {configured!r}, but it is not an executable file."
        )

    for name in names:
        found = shutil.which(name)
        if found:
            return found

    for candidate in extra:
        if candidate.is_file() and os.access(candidate, os.X_OK):
            return str(candidate)

    raise SystemExit(
        f"Could not find {names[0]}. Install it or set {environment_name}.\n"
        "Piper:  python3 -m venv .venv && .venv/bin/pip install piper-tts\n"
        "ffmpeg: install the ffmpeg package for your system."
    )


def voice_license(voice: Voice) -> str:
    card = VOICES_DIR / voice.model_card
    if not card.is_file():
        return f"MODEL CARD MISSING ({card.relative_to(ROOT)})"

    for line in card.read_text(encoding="utf-8").splitlines():
        if line.strip().lower().startswith("* license:"):
            return line.split(":", 1)[1].strip()
    return "NO LICENSE FIELD IN MODEL CARD"


def print_voice_licenses() -> None:
    print("Voice licenses (read from model cards):")
    for voice in VOICES.values():
        model_path = VOICES_DIR / voice.model
        status = "found" if is_nonempty_file(model_path) else "missing"
        print(f"  {voice.label:<16} {voice.model:<30} {voice_license(voice)}  [{status}]")
    print()


def require_voice_files() -> None:
    missing: list[Path] = []
    for voice in VOICES.values():
        for filename in (voice.model, voice.config):
            path = VOICES_DIR / filename
            if not is_nonempty_file(path):
                missing.append(path)

    if not missing:
        return

    lines = ["Missing Piper voice files:"]
    lines.extend(f"  {path.relative_to(ROOT)}" for path in missing)
    lines.extend(
        [
            "",
            "Download the voices (models are local and ignored by git):",
            "  python3 -m piper.download_voices "
            + " ".join(voice.model.removesuffix(".onnx") for voice in VOICES.values())
            + " --download-dir tools/voices",
            "",
            "Download the matching MODEL_CARD files from:",
            "  https://huggingface.co/rhasspy/piper-voices/tree/main/en/en_US",
        ]
    )
    raise SystemExit("\n".join(lines))


def voice_for_speaker(speaker: str) -> Voice:
    return VOICES[SPEAKER_VOICES.get(speaker, FALLBACK_VOICE)]


def validate_voice_configuration() -> None:
    for speaker, voice_key in SPEAKER_VOICES.items():
        if voice_key not in VOICES:
            raise SystemExit(
                f"SPEAKER_VOICES maps {speaker!r} to unknown voice {voice_key!r}"
            )
    if FALLBACK_VOICE not in VOICES:
        raise SystemExit(f"FALLBACK_VOICE {FALLBACK_VOICE!r} is not defined in VOICES")


def lesson_track_id(lesson_id: str) -> str | None:
    if PATTERN_LESSON_ID_RE.fullmatch(lesson_id):
        return "patterns"
    if EXPRESSION_LESSON_ID_RE.fullmatch(lesson_id):
        return "expressions"
    if LESSON_ID_RE.fullmatch(lesson_id):
        return "verbs"
    return None


def is_lesson_id(value: object) -> bool:
    return isinstance(value, str) and lesson_track_id(value) is not None


def audio_folder_for_lesson(lesson: dict) -> str:
    lesson_id = lesson["id"]
    track = lesson_track_id(lesson_id)
    if track == "verbs":
        module_id = lesson.get("moduleId")
        if not isinstance(module_id, str) or not MODULE_ID_RE.fullmatch(module_id):
            raise SystemExit(f"{lesson_id}: invalid moduleId {module_id!r}")
        return module_id

    expected = TRACK_FOLDERS[track]
    declared = lesson.get("track")
    if declared is not None and declared != track:
        raise SystemExit(
            f"{lesson_id}: track {declared!r} does not match the lesson id (expected {track!r})"
        )
    return expected


def load_lesson(lesson_id: str) -> dict:
    path = LESSONS_DIR / f"{lesson_id}.json"
    if not path.is_file():
        raise SystemExit(f"Lesson file not found: {path.relative_to(ROOT)}")

    try:
        lesson = json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as error:
        raise SystemExit(f"{path.relative_to(ROOT)} is not valid JSON: {error}") from error

    if lesson.get("id") != lesson_id:
        raise SystemExit(
            f"{path.relative_to(ROOT)} has id {lesson.get('id')!r}, expected {lesson_id!r}"
        )

    audio_folder_for_lesson(lesson)

    dialogue = lesson.get("dialogue")
    if not isinstance(dialogue, list) or not dialogue:
        raise SystemExit(f"{lesson_id}: dialogue must be a non-empty array")

    for index, line in enumerate(dialogue):
        if not isinstance(line, dict):
            raise SystemExit(f"{lesson_id}: dialogue[{index}] is not an object")
        speaker = line.get("speaker")
        english = line.get("english")
        if not isinstance(speaker, str) or not speaker.strip():
            raise SystemExit(f"{lesson_id}: dialogue[{index}].speaker is missing")
        if not isinstance(english, str) or not english.strip():
            raise SystemExit(f"{lesson_id}: dialogue[{index}].english is missing")

    return lesson


def run_command(command: list[str], *, input_text: str | None = None) -> None:
    result = subprocess.run(
        command,
        input=input_text,
        text=True,
        capture_output=True,
        check=False,
    )
    if result.returncode != 0:
        detail = (result.stderr or result.stdout or "").strip()
        raise RuntimeError(
            f"Command failed ({result.returncode}): {' '.join(command)}"
            + (f"\n{detail}" if detail else "")
        )


def synthesize_wav(piper: str, voice: Voice, text: str, output: Path) -> None:
    command = [
        piper,
        "-m",
        str(VOICES_DIR / voice.model),
        "-c",
        str(VOICES_DIR / voice.config),
        "-f",
        str(output),
    ]
    if voice.length_scale != 1.0:
        command.extend(["--length-scale", str(voice.length_scale)])

    run_command(command, input_text=text.strip() + "\n")
    if not is_nonempty_file(output):
        raise RuntimeError(f"Piper produced no audio for: {text!r}")


def wav_to_mp3(ffmpeg: str, wav: Path, output: Path) -> None:
    output.parent.mkdir(parents=True, exist_ok=True)
    temporary = output.parent / f".{output.name}.tmp"
    command = [
        ffmpeg,
        "-hide_banner",
        "-loglevel",
        "error",
        "-y",
        "-i",
        str(wav),
        "-vn",
        "-ac",
        "1",
        "-ar",
        str(SAMPLE_RATE),
        "-c:a",
        "libmp3lame",
        "-b:a",
        MP3_BITRATE,
        "-f",
        "mp3",
        str(temporary),
    ]
    try:
        run_command(command)
        if not is_nonempty_file(temporary):
            raise RuntimeError(f"ffmpeg produced an empty MP3 for {output}")
        os.replace(temporary, output)
    finally:
        temporary.unlink(missing_ok=True)


def mp3_to_wav(ffmpeg: str, mp3: Path, output: Path) -> None:
    command = [
        ffmpeg,
        "-hide_banner",
        "-loglevel",
        "error",
        "-y",
        "-i",
        str(mp3),
        "-vn",
        "-ac",
        "1",
        "-ar",
        str(SAMPLE_RATE),
        "-sample_fmt",
        "s16",
        "-c:a",
        "pcm_s16le",
        str(output),
    ]
    run_command(command)
    if not is_nonempty_file(output):
        raise RuntimeError(f"ffmpeg could not decode {mp3}")


def concatenate_wavs(wavs: list[Path], output: Path, gap_seconds: float) -> None:
    """Join WAVs in order, inserting silence between them (not after the last)."""

    if not wavs:
        raise RuntimeError("Cannot build full audio: no sentence WAVs")

    parameters: tuple[int, int, int] | None = None
    gap = b""

    with wave.open(str(output), "wb") as destination:
        for index, wav_path in enumerate(wavs):
            with wave.open(str(wav_path), "rb") as source:
                current = (source.getnchannels(), source.getsampwidth(), source.getframerate())
                if parameters is None:
                    parameters = current
                    destination.setnchannels(current[0])
                    destination.setsampwidth(current[1])
                    destination.setframerate(current[2])
                    gap = b"\x00" * (current[0] * current[1] * int(current[2] * gap_seconds))
                elif current != parameters:
                    raise RuntimeError(
                        f"WAV format mismatch: {wav_path} is {current}, expected {parameters}"
                    )
                destination.writeframes(source.readframes(source.getnframes()))

            if index < len(wavs) - 1:
                destination.writeframes(gap)


def audio_relative_path(folder: str, lesson_id: str, filename: str) -> str:
    """Return the path used by the app and by the static build."""
    return f"public/audio/{folder}/{lesson_id}/{filename}"


def generate_lesson(
    lesson_id: str,
    *,
    force: bool,
    piper: str,
    ffmpeg: str,
) -> None:
    lesson = load_lesson(lesson_id)
    audio_folder = audio_folder_for_lesson(lesson)
    dialogue = lesson["dialogue"]
    output_dir = PUBLIC_DIR / "audio" / audio_folder / lesson_id
    output_dir.mkdir(parents=True, exist_ok=True)

    sentence_paths = [
        output_dir / f"sentence-{index + 1:02d}.mp3"
        for index in range(len(dialogue))
    ]
    full_path = output_dir / "full.mp3"

    sentence_exists = [is_nonempty_file(path) for path in sentence_paths]
    need_full = force or not is_nonempty_file(full_path) or not all(sentence_exists)

    generated: list[str] = []
    skipped: list[str] = []

    print(f"{lesson_id}: {len(dialogue)} sentences")
    print(f"  output: {output_dir.relative_to(ROOT)}")

    if need_full:
        with tempfile.TemporaryDirectory(prefix=f"piper-{lesson_id}-") as temp_name:
            temporary_dir = Path(temp_name)
            wavs: list[Path] = []

            for index, line in enumerate(dialogue):
                wav_path = temporary_dir / f"sentence-{index + 1:02d}.wav"
                mp3_path = sentence_paths[index]

                if sentence_exists[index] and not force:
                    try:
                        mp3_to_wav(ffmpeg, mp3_path, wav_path)
                        skipped.append(mp3_path.name)
                    except RuntimeError as error:
                        print(f"  warning: {mp3_path.name} could not be decoded; regenerating")
                        print(f"           {error}")
                        voice = voice_for_speaker(line["speaker"])
                        synthesize_wav(piper, voice, line["english"], wav_path)
                        wav_to_mp3(ffmpeg, wav_path, mp3_path)
                        generated.append(mp3_path.name)
                else:
                    voice = voice_for_speaker(line["speaker"])
                    print(f"  [{index + 1:02d}] {line['speaker']} -> {voice.model}")
                    synthesize_wav(piper, voice, line["english"], wav_path)
                    wav_to_mp3(ffmpeg, wav_path, mp3_path)
                    generated.append(mp3_path.name)

                wavs.append(wav_path)

            full_wav = temporary_dir / "full.wav"
            concatenate_wavs(wavs, full_wav, SENTENCE_GAP_SECONDS)
            wav_to_mp3(ffmpeg, full_wav, full_path)
            generated.append(full_path.name)
    else:
        skipped.extend(path.name for path in sentence_paths)
        skipped.append(full_path.name)

    missing = [
        path for path in [*sentence_paths, full_path] if not is_nonempty_file(path)
    ]
    if missing:
        raise RuntimeError(
            "Refusing to update lesson JSON because these files are missing: "
            + ", ".join(str(path) for path in missing)
        )

    # Update paths only for files that really exist.  If an expected file is
    # absent, remove the field so the app falls back instead of requesting a 404.
    changed = False
    for index, line in enumerate(dialogue):
        expected = audio_relative_path(
            audio_folder, lesson_id, f"sentence-{index + 1:02d}.mp3"
        )
        if is_nonempty_file(sentence_paths[index]):
            if line.get("audio") != expected:
                line["audio"] = expected
                changed = True
        elif "audio" in line:
            del line["audio"]
            changed = True

    expected_full = audio_relative_path(audio_folder, lesson_id, "full.mp3")
    if is_nonempty_file(full_path):
        if lesson.get("fullAudio") != expected_full:
            lesson["fullAudio"] = expected_full
            changed = True
    elif "fullAudio" in lesson:
        del lesson["fullAudio"]
        changed = True

    lesson_path = LESSONS_DIR / f"{lesson_id}.json"
    if changed:
        lesson_path.write_text(
            json.dumps(lesson, indent=2, ensure_ascii=False) + "\n",
            encoding="utf-8",
        )

    if generated:
        print(f"  generated: {len(generated)} file(s)")
    if skipped:
        print(f"  skipped:   {len(skipped)} existing file(s)")
    print(f"  JSON:      {'updated' if changed else 'already correct'}")


def lesson_ids_from_arguments(args: argparse.Namespace) -> list[str]:
    if args.all:
        index_path = LESSONS_DIR / "index.json"
        try:
            index = json.loads(index_path.read_text(encoding="utf-8"))
        except (OSError, json.JSONDecodeError) as error:
            raise SystemExit(f"Cannot read {index_path.relative_to(ROOT)}: {error}") from error
        if not isinstance(index, list):
            raise SystemExit(f"{index_path.relative_to(ROOT)} must contain an array")

        ids: list[str] = []
        for entry in index:
            lesson_id = entry.get("id") if isinstance(entry, dict) else None
            if not is_lesson_id(lesson_id):
                raise SystemExit(f"Invalid lesson id in {index_path.relative_to(ROOT)}: {lesson_id!r}")
            ids.append(lesson_id)
        return ids

    requested = args.lesson or []
    for lesson_id in requested:
        if not is_lesson_id(lesson_id):
            raise SystemExit(
                f"Invalid lesson id: {lesson_id!r} "
                "(expected GO-P01, PAT-D21, or EXP-… style)"
            )
    return requested


def parse_arguments() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Generate real MP3 lesson audio with local Piper TTS.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=(
            "Examples:\n"
            "  python3 tools/generate_audio.py --lesson GO-P01\n"
            "  python3 tools/generate_audio.py --all --force\n"
        ),
    )
    selection = parser.add_mutually_exclusive_group(required=True)
    selection.add_argument(
        "--lesson",
        action="append",
        metavar="ID",
        help="lesson to generate, e.g. GO-P01 or PAT-D21 (repeat for more than one)",
    )
    selection.add_argument(
        "--all",
        action="store_true",
        help="generate every lesson listed in data/lessons/index.json",
    )
    parser.add_argument(
        "--force",
        action="store_true",
        help="regenerate files that already exist",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_arguments()
    lesson_ids = lesson_ids_from_arguments(args)

    piper = find_executable(
        "PIPER_BIN",
        ["piper"],
        [ROOT / ".venv" / "bin" / "piper", ROOT / "tools" / "piper" / "piper"],
    )
    ffmpeg = find_executable("FFMPEG_BIN", ["ffmpeg"], [])

    print("Small Steps English — Piper audio generation")
    print(f"  piper:  {piper}")
    print(f"  ffmpeg: {ffmpeg}")
    print()

    print_voice_licenses()
    validate_voice_configuration()
    require_voice_files()

    for lesson_id in lesson_ids:
        generate_lesson(lesson_id, force=args.force, piper=piper, ffmpeg=ffmpeg)
        print()

    print("Done.")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except RuntimeError as error:
        print(f"Error: {error}", file=sys.stderr)
        raise SystemExit(1) from error
