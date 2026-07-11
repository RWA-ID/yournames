/*
 * Every "Find your name" CTA points at the hero registry-check input —
 * scroll it into view and focus it (per the Dark Ledger handoff: buttons
 * focus the input rather than opening a separate page).
 */
export function focusNameSearch() {
  const el = document.getElementById("name-search") as HTMLInputElement | null;
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "center" });
  el.focus({ preventScroll: true });
}
