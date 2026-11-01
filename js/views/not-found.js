export function notFoundView(root, options = {}) {
  const {
    eyebrow = "Page not found",
    title = "This page is not available.",
    message = "The link may be old, or the page may not exist yet. Go back to the module library to continue.",
    actionHref = "#/modules",
    actionLabel = "Back to module library"
  } = options;

  root.innerHTML = `
    <div class="view">
      <section class="empty-state panel">
        <span class="eyebrow">${eyebrow}</span>
        <h1>${title}</h1>
        <p>${message}</p>
        <div class="hero-actions">
          <a class="btn btn-primary" href="${actionHref}">${actionLabel}</a>
          <a class="btn btn-secondary" href="#/">Home</a>
        </div>
      </section>
    </div>
  `;

  return {
    title: "Not found · Small Steps English",
    cleanup: () => {}
  };
}
