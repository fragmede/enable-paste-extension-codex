(() => {
  "use strict";

  const EDITABLE_INPUT_TYPES = new Set([
    "date",
    "datetime-local",
    "email",
    "month",
    "number",
    "password",
    "search",
    "tel",
    "text",
    "time",
    "url",
    "week"
  ]);

  const PASTE_INPUT_TYPES = new Set([
    "insertFromPaste",
    "insertFromPasteAsQuotation"
  ]);

  const PASTE_EVENTS = new Set(["paste", "beforeinput", "keydown", "keypress", "contextmenu"]);

  const hasConstructor = (name) => typeof globalThis[name] === "function";

  const isHtmlInput = (value) =>
    hasConstructor("HTMLInputElement") && value instanceof HTMLInputElement;

  const isHtmlTextArea = (value) =>
    hasConstructor("HTMLTextAreaElement") && value instanceof HTMLTextAreaElement;

  const isElement = (value) =>
    hasConstructor("Element") && value instanceof Element;

  const isTextNode = (value) =>
    hasConstructor("Text") && value instanceof Text;

  const isEditableInput = (element) => {
    if (isHtmlTextArea(element)) {
      return !element.disabled && !element.readOnly;
    }

    if (!isHtmlInput(element)) {
      return false;
    }

    return (
      !element.disabled &&
      !element.readOnly &&
      EDITABLE_INPUT_TYPES.has(element.type)
    );
  };

  const isEditableElement = (element) =>
    isEditableInput(element) || element.isContentEditable === true;

  const getEventPath = (event) => {
    if (typeof event.composedPath === "function") {
      return event.composedPath();
    }

    const path = [];
    let current = event.target;

    if (isTextNode(current)) {
      current = current.parentElement;
    }

    while (current) {
      path.push(current);
      current = current.parentElement;
    }

    return path;
  };

  const findEditableTarget = (event) => {
    for (const item of getEventPath(event)) {
      if (!isElement(item)) {
        continue;
      }

      if (isEditableElement(item)) {
        return item;
      }

      const editableAncestor = item.closest("input, textarea, [contenteditable]");
      if (editableAncestor && isEditableElement(editableAncestor)) {
        return editableAncestor;
      }
    }

    return null;
  };

  const isPasteShortcut = (event) => {
    if (event.type !== "keydown" && event.type !== "keypress") {
      return false;
    }

    const key = String(event.key || "").toLowerCase();
    const code = String(event.code || "").toLowerCase();
    const usesPasteModifier = event.ctrlKey || event.metaKey;

    return usesPasteModifier && !event.altKey && (key === "v" || code === "keyv");
  };

  const isPasteRelatedEvent = (event) => {
    if (!PASTE_EVENTS.has(event.type)) {
      return false;
    }

    if (event.type === "beforeinput") {
      return PASTE_INPUT_TYPES.has(event.inputType);
    }

    if (event.type === "keydown" || event.type === "keypress") {
      return isPasteShortcut(event);
    }

    return true;
  };

  const allowNativePaste = (event) => {
    if (!isPasteRelatedEvent(event) || !findEditableTarget(event)) {
      return;
    }

    event.stopImmediatePropagation();
  };

  for (const eventType of PASTE_EVENTS) {
    window.addEventListener(eventType, allowNativePaste, true);
  }
})();
