// @ts-nocheck
/* eslint-env browser */
/* eslint-disable no-console */
import "./design/classic.css";
import "./design/floating_label.css";
import "./design/ifta_label.css";
import { Veli, FormValidator, Watcher, validate, Scanner } from "./Js/FormValidation.js";

// Helper: apply color config to CSS variables
function applyColorConfig(colorConfig) {
  if (window) {
    if (!colorConfig || typeof colorConfig !== "object") return;

    const root = document.documentElement;
    const colorMap = {
      error: "--veli-error-color",
      success: "--veli-success-color",
      warning: "--veli-warning-color",
      info: "--veli-info-color",
    };

    Object.entries(colorMap).forEach(([key, varName]) => {
      if (Object.prototype.hasOwnProperty.call(colorConfig, key)) {
        root.style.setProperty(varName, colorConfig[key]);
      }
    });
  }
}

// Public: Configure Veli colors and options
// Usage: VeliConfig({ colors: { error: "blue", success: "#0f0", ... } })
export function VeliConfig(config = {}) {
  if (window) {
    if (typeof document === "undefined") {
      console.warn(
        "Veli: VeliConfig() called in non-browser environment, skipping"
      );
      return;
    }

    if (config.colors) {
      applyColorConfig(config.colors);
      console.log("✓ Veli configured with", config);
    } else {
      console.log("Veli: configured with default colors");
    }
  }
}

export function buildWatcherFieldFromElement(el) {
  if (!el) return null;

  // Must have the data-veli-rules attribute
  const attr = el.getAttribute("data-veli-rules");
  if (!attr) {
    console.warn("Element missing data-veli-rules attribute, skipping", el);
    return null;
  }

  let specifications;
  try {
    specifications = JSON.parse(attr);
  } catch (err) {
    console.error("Invalid JSON in data-veli-rules, skipping element", el, err);
    return null;
  }

  // Ensure name exists (use element name/id as fallback)
  if (!specifications.name) {
    const fallbackName = el.name || el.id || null;
    if (!fallbackName) {
      console.error(
        'data-veli-rules missing "name" and element has no name/id — skipping',
        el
      );
      return null;
    }
    specifications.name = fallbackName;
  }

  // Ensure type exists; infer from element when possible
  if (!specifications.type) {
    specifications.type =
      el.tagName.toLowerCase() === "textarea" ? "text" : el.type || "text";
  }

  // Validate that element's actual type matches the declared type in specifications
  const declared = String(specifications.type).toLowerCase();
  const elType =
    el.tagName.toLowerCase() === "textarea" ? "text" : el.type || "text";
  const typeCompatibility = {
    text: ["text", "textarea"],
    password: ["password"],
    email: ["email"],
    tel: ["tel"],
    number: ["number"],
    checkbox: ["checkbox"],
  };

  const allowed = typeCompatibility[declared] || [];
  if (allowed.length && !allowed.includes(elType)) {
    console.error(
      `data-veli-rules type mismatch: declared "${declared}" but element is "${elType}" — skipping`,
      el
    );
    return null;
  }

  // Do not attempt to query wrapper or error DOM nodes here; keep helper DOM-agnostic
  return {
    specifications,
    field: el,
    errorField: null,
  };
}

// Helper: create a Watcher instance from an array (or NodeList) of elements
export function createWatcherFromElements(elements, initialData) {
  const arr = Array.from(elements || [])
    .map((el) => buildWatcherFieldFromElement(el))
    .filter(Boolean);
  if (!arr.length) throw new Error("No valid fields found to create Watcher");
  return new Watcher(arr, initialData);
}

// Helper: bind a Watcher instance to a button so the button.disabled is kept
// in sync with the Watcher's dirty state. Returns an unsubscribe function.
export function bindDirtyToButton(watcher, button, options = {}) {
  if (!watcher || !button) throw new Error("watcher and button are required");

  const { fieldNames = null } = options; // optional array of field names to watch

  // Ensure watcher exposes fields; try best-effort otherwise
  const fields = Array.isArray(watcher.fields) ? watcher.fields : [];

  const targets = fields.filter((f) => {
    try {
      const name = f && f.specifications && f.specifications.name;
      return !fieldNames || (name && fieldNames.includes(name));
    } catch (e) {
      return false;
    }
  });

  function update() {
    try {
      const isDirty = fieldNames
        ? targets.some((f) => watcher.isFieldDirty(f.specifications.name))
        : watcher.isDirty();
      button.disabled = !!isDirty;
    } catch (err) {
      // fallback: leave button enabled
      console.warn("bindDirtyToButton: failed to read watcher state", err);
    }
  }

  // Attach listeners to all target input elements
  const listeners = [];
  targets.forEach((f) => {
    const el = f && f.field;
    if (el && el.addEventListener) {
      const handler = update;
      el.addEventListener("input", handler);
      el.addEventListener("change", handler);
      listeners.push({ el, handler });
    }
  });

  // Initialize immediately
  update();

  // Return cleanup function
  return function unsubscribe() {
    listeners.forEach(({ el, handler }) => {
      try {
        el.removeEventListener("input", handler);
        el.removeEventListener("change", handler);
      } catch (e) { }
    });
  };
}

// General helper: call callbacks when the watcher or specific fields become dirty/clean.
// Options:
// - fieldNames: optional array of field names to watch (if omitted, watches whole watcher)
// - onDirty: function called when watched target becomes dirty
// - onClean: function called when watched target becomes clean
// - debounceMs: optional debounce in ms for callback invocation
export function bindDirty(watcher, options = {}) {
  if (!watcher) throw new Error("watcher is required");
  const {
    fieldNames = null,
    onDirty = () => { },
    onClean = () => { },
    debounceMs = 100,
  } = options;

  const fields = Array.isArray(watcher.fields) ? watcher.fields : [];
  const targets = fieldNames
    ? fields.filter(
      (f) =>
        f && f.specifications && fieldNames.includes(f.specifications.name)
    )
    : fields.slice();

  // If no fields and we're watching whole watcher, allow using watcher.isDirty()
  const watchingWhole = !fieldNames;

  let timer = null;
  let lastState = null; // null => unknown, true => dirty, false => clean

  function emitState() {
    try {
      const isDirty = watchingWhole
        ? !!watcher.isDirty()
        : targets.some((f) => watcher.isFieldDirty(f.specifications.name));
      if (lastState === null) {
        // initialize, call appropriate callback
        if (isDirty) onDirty();
        else onClean();
      } else if (isDirty && !lastState) {
        onDirty();
      } else if (!isDirty && lastState) {
        onClean();
      }
      lastState = isDirty;
    } catch (err) {
      console.warn("bindDirty: failed to evaluate state", err);
    }
  }

  function scheduleEmit() {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      emitState();
    }, debounceMs);
  }

  // Attach listeners to target elements
  const listeners = [];
  targets.forEach((f) => {
    const el = f && f.field;
    if (el && el.addEventListener) {
      const handler = scheduleEmit;
      el.addEventListener("input", handler);
      el.addEventListener("change", handler);
      listeners.push({ el, handler });
    }
  });

  // If there are no targets but we are watching whole, attempt to listen to fields if available
  if (!targets.length && watchingWhole && fields.length) {
    fields.forEach((f) => {
      const el = f && f.field;
      if (el && el.addEventListener) {
        const handler = scheduleEmit;
        el.addEventListener("input", handler);
        el.addEventListener("change", handler);
        listeners.push({ el, handler });
      }
    });
  }

  // initialize
  scheduleEmit();

  return function unsubscribe() {
    if (timer) clearTimeout(timer);
    listeners.forEach(({ el, handler }) => {
      try {
        el.removeEventListener("input", handler);
        el.removeEventListener("change", handler);
      } catch (e) { }
    });
  };
}

// Provide a new ergonomic factory `createWatch` that returns the Watcher augmented with event helpers.
/**
 * Creates a Watcher instance for a form or set of fields.
 * 
 * @param {string|HTMLElement|HTMLFormElement|NodeList|Array} source - The form ID, form element, or list of fields to watch.
 * @param {Object.<string, string>} [initialData] - Initial values for the fields. Keys match field names.
 * @param {Object} [options] - Configuration options.
 * @param {string[]} [options.fieldNames] - Array of specific field names to watch. If omitted, watches all fields.
 * @param {number} [options.debounceMs=100] - Debounce time in milliseconds for event emission.
 * @returns {Watcher} The Watcher instance with added .on() and .off() methods for event handling.
 */
export function createWatch(source, initialData, options = {}) {
  let elements = source;
  let isAsyncPending = false;
  let targetId = null;

  // If source is a string, try to find the element by ID
  if (typeof source === "string") {
    const el = document.getElementById(source);
    if (el) {
      elements = el;
    } else {
      // Element not found, enable async mode
      isAsyncPending = true;
      targetId = source;
      elements = []; // Initialize with empty list
      console.log(`createWatch: Element "${source}" not found, waiting for it to appear...`);
    }
  }

  // If we have a form element (either passed directly or found by ID), extract fields
  if (elements instanceof HTMLFormElement) {
    elements = elements.querySelectorAll("[data-veli-rules]");
  }

  let watcher;
  if (isAsyncPending) {
    watcher = new Watcher([], initialData);
  } else {
    watcher = createWatcherFromElements(elements, initialData);
  }

  // Simple event emitter map
  const handlers = { dirty: new Set(), clean: new Set(), ready: new Set() };

  function emit(name) {
    const s = handlers[name];
    if (s)
      s.forEach((cb) => {
        try {
          cb();
        } catch (e) {
          console.error("createWatch handler error", e);
        }
      });
  }

  // If async pending, setup MutationObserver
  if (isAsyncPending && targetId && typeof document !== "undefined") {
    const observer = new MutationObserver((mutations, obs) => {
      const el = document.getElementById(targetId);
      if (el) {
        // Element found!
        obs.disconnect();

        // Extract fields
        let newElements = el;
        if (newElements instanceof HTMLFormElement) {
          newElements = newElements.querySelectorAll("[data-veli-rules]");
        }

        // Build fields list
        const fields = Array.from(newElements || [])
          .map((e) => buildWatcherFieldFromElement(e))
          .filter(Boolean);

        // Update watcher
        if (watcher.updateFields) {
          watcher.updateFields(fields);
        }

        // Re-bind dirty listeners
        // We need to re-run bindDirty because the old one bound to nothing
        // But bindDirty returns an unsubscribe, and we can't easily swap it inside the closure.
        // However, bindDirty listens to 'fields' which we just updated in the watcher instance.
        // The issue is bindDirty extracts 'targets' at the BEGINNING.
        // So we need to manually re-attach listeners or make bindDirty dynamic.
        // For simplicity, let's just manually attach the emit logic to the new fields here, 
        // effectively duplicating what bindDirty does but for the new fields.

        // Better approach: We can't easily re-run bindDirty without refactoring it.
        // But since we are inside createWatch, we can just call bindDirty AGAIN and store the new unsubscribe.
        // We'll need to manage the unsubscribe function reference.

        if (watcher._asyncUnsubscribe) watcher._asyncUnsubscribe();
        watcher._asyncUnsubscribe = bindDirty(watcher, {
          fieldNames: options.fieldNames || null,
          debounceMs: options.debounceMs || 100,
          onDirty: () => emit("dirty"),
          onClean: () => emit("clean"),
        });

        emit("ready");
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Cleanup observer on destroy
    const originalDestroy = watcher.destroy;
    watcher.destroy = function () {
      observer.disconnect();
      if (watcher._asyncUnsubscribe) watcher._asyncUnsubscribe();
      if (originalDestroy) originalDestroy.call(watcher);
    };
  } else {
    // Normal synchronous binding
    watcher._asyncUnsubscribe = bindDirty(watcher, {
      fieldNames: options.fieldNames || null,
      debounceMs: options.debounceMs || 100,
      onDirty: () => emit("dirty"),
      onClean: () => emit("clean"),
    });
  }

  // subscribe/unsubscribe
  watcher.on = function (eventName, cb) {
    if (!handlers[eventName]) handlers[eventName] = new Set();
    handlers[eventName].add(cb);
    return () => handlers[eventName].delete(cb);
  };
  watcher.off = function (eventName, cb) {
    if (handlers[eventName]) handlers[eventName].delete(cb);
  };

  // provide cleanup
  watcher.destroy = watcher.destroy || function () {
    try {
      if (watcher._asyncUnsubscribe) watcher._asyncUnsubscribe();
    } catch (e) { }
    if (watcher && typeof watcher.reset === "function") {
      try {
        watcher.reset();
      } catch (e) { }
    }
    // remove helpers
    try {
      delete watcher.on;
      delete watcher.off;
      delete watcher.destroy;
    } catch (e) { }
  };

  // Keep backwards compatibility: also expose the original factory name as an alias
  watcher.createWatcherFromElements = createWatcherFromElements;

  return watcher;
}

// Export for external use
export { Veli, FormValidator, Watcher, validate, Scanner };

if (window) {
  window.validationResponse = {};

  function start() {
    const forms = document.querySelectorAll("form[id]");

    forms.forEach((form) => {
      if (form.dataset.validated) return; // Prevent re-initialization
      form.dataset.validated = "true";

      let language =
        form.getAttribute("data-veli-lang") || form.getAttribute("gdev_lang");
      if (!language || (language !== "fr" && language !== "en")) {
        language = "en"; // Default to English if the language is invalid
      }

      // Set default form design if missing
      if (!form.hasAttribute("data-veli-design")) {
        form.setAttribute("data-veli-design", "classic");
      }

      // Apply design classes
      const design =
        form.getAttribute("data-veli-design") ||
        form.getAttribute("form_validator_design") ||
        "classic";
      form.classList.add(
        design === "floating-label" ? "floating-label" : "classic"
      );

      // Initialize Veli
      const validator = new Veli(form, language);
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        window.validationResponse[form.id] = validator.validate();
        form.dispatchEvent(new Event("onCompleteValidation"));
      });

      validator.validateEach();
    });
  }

  // Run validation on initial page load
  window.addEventListener("load", start);

  // Watch for dynamically added forms
  const observer = new MutationObserver(() => start());
  observer.observe(document.body, { childList: true, subtree: true });
}
