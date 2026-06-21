"use client";

import { useEffect, useState } from "react";

/*
 * Light/dark toggle. The actual theme is applied pre-paint by the inline script
 * in app/layout.tsx (reads the "yn-theme" localStorage key); this control just
 * flips the `dark` class on <html> and persists the choice. Renders a stable
 * placeholder until mounted so SSR/static markup matches the first client paint.
 */
export default function ThemeToggle() {
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
    setMounted(true);
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("yn-theme", next ? "dark" : "light");
    } catch {
      /* private mode — best effort */
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={mounted ? `Switch to ${dark ? "light" : "dark"} mode` : "Toggle theme"}
      title={mounted ? `Switch to ${dark ? "light" : "dark"} mode` : "Toggle theme"}
      className="inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-line bg-surface text-muted shadow-soft transition hover:border-brand hover:text-foreground"
    >
      {/* Sun (shown in dark mode → click to go light) / Moon (light mode) */}
      {mounted && dark ? (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
  );
}
