import { loadLesson, loadLessonIndex } from "../data.js";
import { setLastLesson } from "../store.js";
import { speakingHTML, mountSpeaking } from "../components/speaking.js";
import { notFoundView } from "./not-found.js";

export async function speakingView(root, { id }) {
  const index = await loadLessonIndex();
  if (!index.some(entry => entry.id === id)) {
    return notFoundView(root, {
      eyebrow: "Coming soon",
      title: "This lesson is not available yet.",
      message: "Speaking mode opens only for finished lessons.",
      actionHref: "#/modules",
      actionLabel: "Back to module library"
    });
  }

  const lesson = await loadLesson(id);
  setLastLesson(id);
  root.innerHTML = speakingHTML(lesson);

  return {
    title: `${lesson.title} · Speaking · Small Steps English`,
    cleanup: mountSpeaking(root, lesson)
  };
}
