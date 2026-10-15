import { useEffect, useState } from "react";
import { getSetting, setSetting } from "@/native/fileService";

type Theme = "light" | "dark";

export function useTheme() {
  const [theme, setTheme] = useState<Theme>("light");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    getSetting("theme").then((saved) => {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      setTheme((saved as Theme) ?? (prefersDark ? "dark" : "light"));
      setLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (!loaded) return;
    document.documentElement.classList.toggle("dark", theme === "dark");
    setSetting("theme", theme).catch(() => {});
  }, [theme, loaded]);

  const toggle = () => setTheme((t) => (t === "dark" ? "light" : "dark"));
  return { theme, toggle };
}
