import { normalize } from "viem/ens";

/**
 * ENSIP-15 name normalization + validation for the search/register flow.
 * viem's `normalize` wraps @adraffy/ens-normalize (the reference impl).
 */

export type NameCheck =
  | { ok: true; label: string; name: string }
  | { ok: false; reason: string };

/** Strip a trailing .eth, lowercase, normalize. Returns label (no suffix). */
export function checkLabel(raw: string): NameCheck {
  let input = raw.trim().toLowerCase();
  if (!input) return { ok: false, reason: "Type a name to get started" };
  input = input.replace(/\.eth$/u, "");
  if (input.includes(".")) {
    return { ok: false, reason: "Just the name itself — no dots. Subnames are created from the manage page." };
  }
  let label: string;
  try {
    label = normalize(input);
  } catch {
    return { ok: false, reason: "That name contains characters ENS doesn't allow" };
  }
  // Registrar minimum: 3 characters. Count code points, not UTF-16 units.
  if ([...label].length < 3) {
    return { ok: false, reason: "Names must be at least 3 characters" };
  }
  return { ok: true, label, name: `${label}.eth` };
}

export function safeNormalize(name: string): string | null {
  try {
    return normalize(name);
  } catch {
    return null;
  }
}
