const FOCUSABLE = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])'
].join(",");

/**
 * Wire up a bottom sheet. Markup owns the layer, dialog, and close buttons;
 * this helper owns visibility, focus, Escape, and scroll locking.
 */
export function mountSheet({ layer, openButton, onOpen, onClose }) {
  if (!layer) {
    return { open() {}, close() {}, dispose() {} };
  }

  const dialog = layer.querySelector('[role="dialog"]');
  if (!dialog) {
    return { open() {}, close() {}, dispose() {} };
  }

  let lastFocus = null;
  let isOpen = false;

  function focusableItems() {
    return [...dialog.querySelectorAll(FOCUSABLE)]
      .filter(node => !node.hidden && node.offsetParent !== null);
  }

  function open() {
    if (isOpen) return;
    isOpen = true;
    lastFocus = document.activeElement;
    layer.hidden = false;
    document.body.classList.add("sheet-open");

    requestAnimationFrame(() => {
      if (!isOpen) return;
      const target = dialog.querySelector("[data-sheet-focus]") || focusableItems()[0] || dialog;
      target.focus?.({ preventScroll: true });
      onOpen?.();
    });
  }

  function close() {
    if (!isOpen) return;
    isOpen = false;
    layer.hidden = true;
    document.body.classList.remove("sheet-open");
    onClose?.();
    if (lastFocus instanceof HTMLElement && lastFocus.isConnected) {
      lastFocus.focus?.({ preventScroll: true });
    }
    lastFocus = null;
  }

  function onLayerClick(event) {
    if (event.target === layer || event.target.closest("[data-sheet-close]")) {
      close();
    }
  }

  function onKeydown(event) {
    if (!isOpen) return;

    if (event.key === "Escape") {
      event.preventDefault();
      close();
      return;
    }

    if (event.key !== "Tab") return;
    const items = focusableItems();
    if (!items.length) {
      event.preventDefault();
      dialog.focus();
      return;
    }

    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  openButton?.addEventListener("click", open);
  layer.addEventListener("click", onLayerClick);
  document.addEventListener("keydown", onKeydown);

  return {
    open,
    close,
    dispose() {
      if (isOpen) {
        isOpen = false;
        layer.hidden = true;
        document.body.classList.remove("sheet-open");
      }
      openButton?.removeEventListener("click", open);
      layer.removeEventListener("click", onLayerClick);
      document.removeEventListener("keydown", onKeydown);
    }
  };
}
