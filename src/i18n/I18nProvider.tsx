"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useRouteTransition } from "@/components/RouteTransition";
import type { Locale } from "./config";
import type { Dictionary } from "./dictionaries/en";

/**
 * Carries the server-resolved dictionary to the client components that need it.
 *
 * The dictionary is resolved once on the server and handed down, so a client
 * component renders the right language on its first pass — no loading state, and no
 * second copy of every string shipped to the browser for locales nobody chose.
 */

type Ctx = {
  locale: Locale;
  t: Dictionary;
  /** Persist a new locale and re-render the tree from the server in that language. */
  setLocale: (next: Locale) => void;
};

const I18nContext = createContext<Ctx | null>(null);

export function I18nProvider({
  locale,
  dictionary,
  children,
}: {
  locale: Locale;
  dictionary: Dictionary;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const transition = useRouteTransition();
  const [switching, setSwitching] = useState(false);

  /* The cookie is set by the server rather than by document.cookie, so it carries
     the right path, age and SameSite without the client having to know them. The
     refresh then re-runs the server render, which reads the new cookie.

     The loading panel covers the whole thing, so the reader never watches the page
     re-label itself string by string — it goes dark, then comes back translated. */
  const setLocale = useCallback(
    (next: Locale) => {
      if (next === locale) return;
      setSwitching(true);
      transition.begin();
      fetch("/api/locale", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale: next }),
      })
        .then(() => {
          /* refresh() has no completion callback, so the new tree is detected by the
             `locale` prop changing — see the effect below. */
          router.refresh();
        })
        .catch(() => {
          setSwitching(false);
          transition.end();
        });
    },
    [locale, router, transition]
  );

  /* The server has re-rendered in the new language: uncover. */
  useEffect(() => {
    if (!switching) return;
    setSwitching(false);
    transition.end();
    // `locale` is what actually changes when the refreshed tree arrives
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale]);

  return (
    <I18nContext.Provider value={{ locale, t: dictionary, setLocale }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside <I18nProvider>");
  return ctx;
}
