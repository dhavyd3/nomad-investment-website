import type { Metadata, Viewport } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import Nav from "@/components/Nav";

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

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${geistMono.variable}`}>
        <SmoothScroll />
        <Nav />
        {children}
      </body>
    </html>
  );
}
