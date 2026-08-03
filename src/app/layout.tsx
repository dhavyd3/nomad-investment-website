import type { Metadata, Viewport } from "next";
import { Inter, Geist_Mono, IBM_Plex_Sans_Arabic } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import Nav from "@/components/Nav";
import RouteTransition from "@/components/RouteTransition";
import CursorTip from "@/components/CursorTip";
import { I18nProvider } from "@/i18n/I18nProvider";
import { getDictionary, getLocale } from "@/i18n/server";
import { getDir } from "@/i18n/config";

/* Univers Next Pro / SuisseIntl are licensed — Inter 300/400/500 is the closest free
   neo-grotesque, and at -0.04em tracking it reads very close to on.energy. */
const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-inter",
  display: "swap",
});

/* stand-in for ABC Monument Grotesk Mono */
const geistMono = Geist_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-geist-mono",
  display: "swap",
});

/* Neither Inter nor Geist Mono carries Arabic, so Arabic would otherwise land on
   whatever the browser picked first. Plex Sans Arabic is the closest grotesque to
   Inter's tone and shares its 300/400/500 weights, so the two sit together in one
   stack without the Arabic lines reading heavier than the Latin ones. */
const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["300", "400", "500"],
  variable: "--font-arabic",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nomad Investments Limited — Strategize. Organize. Globalize.",
  description:
    "A Ugandan consulting company operating across ICT and cybersecurity, engineering and infrastructure, agriculture, energy, environment, labour and business consulting. Founded 2016, Kampala.",
};

/* Pinning the scale would block zoom, so only the width is fixed. `themeColor` paints
   the phone's own chrome navy instead of leaving a white bar above the navy hero. */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#060644",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  /* Resolved per request from the cookie (falling back to Accept-Language), so the
     first paint is already in the visitor's language and `lang` is right for screen
     readers and browser translation. */
  const locale = await getLocale();
  const dictionary = getDictionary(locale);

  return (
    /* `dir` is set here rather than on a wrapper so it reaches portals and the
       scrollbar too — Arabic flips the whole document, not just the copy. */
    <html lang={locale} dir={getDir(locale)}>
      <body className={`${inter.variable} ${geistMono.variable} ${plexArabic.variable}`}>
        {/* RouteTransition wraps the provider because the language switcher inside it
            needs to raise the loading panel before the refresh starts. */}
        <RouteTransition>
          <I18nProvider locale={locale} dictionary={dictionary}>
            <SmoothScroll />
            <Nav />
            {children}
            <CursorTip />
          </I18nProvider>
        </RouteTransition>
      </body>
    </html>
  );
}
