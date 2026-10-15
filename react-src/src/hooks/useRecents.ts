import { useCallback, useEffect, useState } from "react";
import { getRecents, isNative, saveRecents } from "@/native/fileService";

const MAX_RECENTS = 10;

export function useRecents() {
  const [recents, setRecents] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Load once. Merge instead of replace, in case add() ran first.
  useEffect(() => {
    if (!isNative()) return;
    getRecents().then((stored) => {
      setRecents((prev) => [
        ...prev,
        ...stored.filter((p) => !prev.includes(p)),
      ]);
      setLoaded(true);
    });
  }, []);

  // Persist on change, but only after the initial load so we never overwrite saved data with []
  useEffect(() => {
    if (loaded) saveRecents(recents).catch(() => {});
  }, [recents, loaded]);

  const add = useCallback((path: string) => {
    if (!isNative()) return; // in the browser, "path" is just a file name
    setRecents((prev) =>
      [path, ...prev.filter((p) => p !== path)].slice(0, MAX_RECENTS),
    );
  }, []);

  const remove = useCallback((path: string) => {
    setRecents((prev) => prev.filter((p) => p !== path));
  }, []);

  const clear = useCallback(() => setRecents([]), []);

  return { recents, add, remove, clear };
}
