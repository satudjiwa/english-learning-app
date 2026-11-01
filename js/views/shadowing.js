import { loadLesson, loadLessonIndex } from "../data.js";
import { setLastLesson } from "../store.js";
import { shadowingHTML, mountShadowing } from "../components/shadowing.js";
import { notFoundView } from "./not-found.js";

export async function shadowingView(root, { id }) {
  const index = await loadLessonIndex();
  if (!index.some(entry => entry.id === id)) {
    return notFoundView(root, {
      eyebrow: "Coming soon",
      title: "This lesson is not available yet.",
      message: "Shadowing opens only for finished lessons.",
      actionHref: "#/modules",
      actionLabel: "Back to module library"
    });
  }

  const lesson = await loadLesson(id);
  setLastLesson(id);
  root.innerHTML = shadowingHTML(lesson);

  return {
    title: `${lesson.title} · Shadowing · Small Steps English`,
    cleanup: mountShadowing(root, lesson)
  };
}
