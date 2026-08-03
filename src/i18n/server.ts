import "server-only";
import { cookies, headers } from "next/headers";
import { DEFAULT_LOCALE, LOCALE_COOKIE, LOCALES, isLocale, type Locale } from "./config";
import en, { type Dictionary } from "./dictionaries/en";
import fr from "./dictionaries/fr";
import es from "./dictionaries/es";
import nl from "./dictionaries/nl";
import zh from "./dictionaries/zh";
import sw from "./dictionaries/sw";
import ar from "./dictionaries/ar";

const DICTIONARIES: Record<Locale, Dictionary> = { en, fr, es, nl, zh, sw, ar };

/** Statically imported, so there is no async dictionary load on the render path. */
export function getDictionary(locale: Locale): Dictionary {
  return DICTIONARIES[locale];
}

/**
 * The locale for this request: the cookie if one has been set, otherwise the best
 * match from Accept-Language, otherwise English.
 *
 * Reading a cookie opts the route out of static prerendering, which is the trade for
 * getting the right language on the first paint instead of after a client swap.
 */
export async function getLocale(): Promise<Locale> {
  const store = await cookies();
  const chosen = store.get(LOCALE_COOKIE)?.value;
  if (isLocale(chosen)) return chosen;

  const header = (await headers()).get("accept-language");
  if (header) {
    // "fr-CA,fr;q=0.9,en;q=0.8" -> ["fr", "fr", "en"], best first
    const ranked = header
      .split(",")
      .map((part) => {
        const [tag, q] = part.trim().split(";q=");
        return { tag: tag.split("-")[0].toLowerCase(), q: q ? Number(q) : 1 };
      })
      .sort((a, b) => b.q - a.q);
    const match = ranked.find((r) => (LOCALES as readonly string[]).includes(r.tag));
    if (match && isLocale(match.tag)) return match.tag;
  }
  return DEFAULT_LOCALE;
}
