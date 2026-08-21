import { useEffect } from "react";
import { CURSOR_SVG_DATA_URI } from "../lib/cursor/cursor";

export function useCustomCursor(enabled = true): void {
  useEffect(() => {
    if (!enabled) return;
    const root = document.documentElement;
    root.style.setProperty("--custom-cursor", CURSOR_SVG_DATA_URI);
    root.setAttribute("data-custom-cursor", "true");
    return () => {
      root.removeAttribute("data-custom-cursor");
      root.style.removeProperty("--custom-cursor");
    };
  }, [enabled]);
}
