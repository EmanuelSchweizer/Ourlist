"use client";

import { useEffect } from "react";

// Mobile browsers scroll the page when the keyboard opens. The layout is
// overflow-hidden, so it would never scroll back and content stays under the NavBar.
export const ViewportScrollReset = () => {
  useEffect(() => {
    const viewport = window.visualViewport;
    if (!viewport) return;

    const reset = () => {
      if (window.scrollY !== 0 || window.scrollX !== 0) window.scrollTo(0, 0);
    };

    viewport.addEventListener("resize", reset);
    viewport.addEventListener("scroll", reset);
    window.addEventListener("scroll", reset);
    return () => {
      viewport.removeEventListener("resize", reset);
      viewport.removeEventListener("scroll", reset);
      window.removeEventListener("scroll", reset);
    };
  }, []);

  return null;
};
