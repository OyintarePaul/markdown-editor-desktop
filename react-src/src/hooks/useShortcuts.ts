import { useEffect, useRef } from "react";

type Handlers = {
  onNew: () => void;
  onOpen: () => void;
  onSave: () => void;
  onSaveAs: () => void;
};

export function useShortcuts(handlers: Handlers) {
  // Keep the latest handlers in a ref so the listener is attached only once
  const ref = useRef(handlers);
  useEffect(() => {
    ref.current = handlers;
  });

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!(e.ctrlKey || e.metaKey) || e.altKey) return;

      const key = e.key.toLowerCase();
      let action: (() => void) | undefined;

      if (key === "s")
        action = e.shiftKey ? ref.current.onSaveAs : ref.current.onSave;
      else if (key === "o" && !e.shiftKey) action = ref.current.onOpen;
      else if (key === "n" && !e.shiftKey) action = ref.current.onNew;

      if (!action) return;
      e.preventDefault();
      action();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);
}
