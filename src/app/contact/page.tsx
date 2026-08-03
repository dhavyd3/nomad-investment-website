import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import SiteFooter from "@/components/SiteFooter";
import { getDictionary, getLocale } from "@/i18n/server";
import { RevealWords } from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Contact — Nomad Investments Limited",
  description:
    "Send Nomad Investments Limited a project brief, or reach the Kampala office directly by phone, WhatsApp or email.",
};

export default async function ContactPage() {
  const t = getDictionary(await getLocale());
  return (
    <main>
      <section className="wrap pt-[clamp(140px,20vh,240px)]">
        <span className="t-mono block">{t.contactPage.label}</span>
        <RevealWords
          as="h1"
          className="t-h2 mt-7 max-w-[18ch]"
          text={t.contactPage.title}
        />
        <p className="t-body mt-6 max-w-[46ch]">{t.contactPage.body}</p>
      </section>

      <section className="wrap contact-shell">
        <ContactForm />
      </section>

      <SiteFooter />
    </main>
  );
}
