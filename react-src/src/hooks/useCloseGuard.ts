import { useEffect, useRef } from "react";
import { exitApp, isNative, onWindowClose } from "@/native/fileService";

export function useCloseGuard(
  isDirty: boolean,
  canDiscard: () => Promise<boolean>,
) {
  const canDiscardRef = useRef(canDiscard);
  useEffect(() => {
    canDiscardRef.current = canDiscard;
  });

  // Native window: ask first, then exit only if it's safe
  useEffect(() => {
    let busy = false; // ignore repeated clicks while the dialog is open
    return onWindowClose(async () => {
      if (busy) return;
      busy = true;
      try {
        if (await canDiscardRef.current()) await exitApp();
      } finally {
        busy = false;
      }
    });
  }, []);

  // Browser tab: use the built-in "leave site?" prompt
  useEffect(() => {
    if (isNative() || !isDirty) return;
    const handler = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);
}
