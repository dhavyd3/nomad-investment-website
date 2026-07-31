import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import SiteFooter from "@/components/SiteFooter";
import { RevealWords } from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Contact — Nomad Investments Limited",
  description:
    "Send Nomad Investments Limited a project brief, or reach the Kampala office directly by phone, WhatsApp or email.",
};

export default function ContactPage() {
  return (
    <main>
      <section className="wrap pt-[clamp(140px,20vh,240px)]">
        <span className="t-mono block">Contact</span>
        <RevealWords
          as="h1"
          className="t-h2 mt-7 max-w-[18ch]"
          text="Let's get the work done."
        />
        <p className="t-body mt-6 max-w-[46ch]">
          Tell us what you need delivered and which discipline it sits in. We will come back
          to you from Kampala.
        </p>
      </section>

      <section className="wrap contact-shell">
        <ContactForm />
      </section>

      <SiteFooter />
    </main>
  );
}
