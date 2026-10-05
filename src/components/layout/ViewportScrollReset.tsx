"use client";

import { useEffect } from "react";

// Mobile browsers (iOS Safari) only shrink the visual viewport when the keyboard
// opens and scroll the page. The layout is overflow-hidden, so we size the app to
// the visible height (--app-height) and keep the page itself pinned at the top.
export const ViewportScrollReset = () => {
  useEffect(() => {
    const viewport = window.visualViewport;
    if (!viewport) return;

    const update = () => {
      document.documentElement.style.setProperty("--app-height", `${viewport.height}px`);
      if (window.scrollY !== 0 || window.scrollX !== 0) window.scrollTo(0, 0);
    };

    update();
    viewport.addEventListener("resize", update);
    viewport.addEventListener("scroll", update);
    window.addEventListener("scroll", update);
    return () => {
      viewport.removeEventListener("resize", update);
      viewport.removeEventListener("scroll", update);
      window.removeEventListener("scroll", update);
      document.documentElement.style.removeProperty("--app-height");
    };
  }, []);

  return null;
};
