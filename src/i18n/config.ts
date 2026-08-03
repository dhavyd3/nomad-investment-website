/**
 * Locale configuration.
 *
 * The chosen locale lives in a cookie and is read on the server, so pages render in
 * the right language on the first paint — no flash of English, and `<html lang>` is
 * correct for screen readers and translation tools.
 *
 * The alternative is a `/[locale]/…` URL segment, which additionally gives each
 * language its own shareable, indexable URL. That is a better answer for SEO and worth
 * moving to before launch; it is a routing refactor rather than a change here, and
 * the dictionaries below carry over untouched.
 */

export const LOCALES = ["en", "fr", "es", "nl", "zh", "sw"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

/** Cookie name Next.js itself uses for locale, so it stays familiar. */
export const LOCALE_COOKIE = "NEXT_LOCALE";

/** Label shown in the switcher, and the endonym for the language menu. */
export const LOCALE_LABELS: Record<Locale, { short: string; name: string }> = {
  en: { short: "EN", name: "English" },
  fr: { short: "FR", name: "Français" },
  es: { short: "ES", name: "Español" },
  nl: { short: "NL", name: "Nederlands" },
  zh: { short: "ZH", name: "中文" },
  sw: { short: "SW", name: "Kiswahili" },
};

export function isLocale(v: unknown): v is Locale {
  return typeof v === "string" && (LOCALES as readonly string[]).includes(v);
}
