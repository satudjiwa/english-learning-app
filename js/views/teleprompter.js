import { loadLesson, loadLessonIndex } from "../data.js";
import { setLastLesson } from "../store.js";
import { teleprompterHTML, mountTeleprompter } from "../components/teleprompter.js";
import { notFoundView } from "./not-found.js";

export async function teleprompterView(root, { id }) {
  const index = await loadLessonIndex();
  if (!index.some(entry => entry.id === id)) {
    return notFoundView(root, {
      eyebrow: "Coming soon",
      title: "This lesson is not available yet.",
      message: "The Teleprompter opens only for finished lessons.",
      actionHref: "#/modules",
      actionLabel: "Back to module library"
    });
  }

  const lesson = await loadLesson(id);
  setLastLesson(id);
  root.innerHTML = teleprompterHTML(lesson);

  return {
    title: `${lesson.title} · Teleprompter · Small Steps English`,
    cleanup: mountTeleprompter(root, lesson)
  };
}
