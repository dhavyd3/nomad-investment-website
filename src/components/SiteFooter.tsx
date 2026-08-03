import Link from "next/link";
import { getDictionary, getLocale } from "@/i18n/server";
import Brandmark from "@/components/Brandmark";

/* Contact details are the ones published on nomadinvestments.co.ug. */
const REACH = [
  ["Telephone", "+256 (0) 414 675306", "tel:+256414675306"],
  ["WhatsApp", "+256 394 525152", "https://wa.me/256394525152"],
  ["Email", "info@nomadinvestments.co.ug", "mailto:info@nomadinvestments.co.ug"],
];

export default async function SiteFooter() {
  const t = getDictionary(await getLocale());
  const REACH_LABELS = [t.footer.telephone, t.footer.whatsapp, t.footer.email];
  const LINKS: [string, string][] = [
    [t.nav.about, "/about"],
    [t.nav.services, "/services"],
    [t.nav.contact, "/contact"],
  ];
  return (
    <footer className="site-footer wrap">
      <div className="site-footer-grid">
        <div>
          {/* .site-footer a already carries the gold hover, so the mark picks up the same
              affordance as the links below it */}
          <Brandmark size="footer" />
          <p className="t-mono mt-5">{t.footer.tagline}</p>
          <p className="t-body mt-5 max-w-[34ch]">
            {t.footer.blurb}
          </p>
        </div>

        <dl>
          <dt className="t-mono">{t.footer.office}</dt>
          <dd className="t-body whitespace-pre-line" style={{ color: "rgba(255,255,255,.72)" }}>
            {"Plot 13, Mukwano Courts\nBuganda Road, Floor 4, Suite 401–402\nKampala, Uganda"}
          </dd>
        </dl>

        <dl>
          {REACH.map(([label, value, href], i) => (
            <div key={label}>
              <dt className="t-mono">{REACH_LABELS[i] ?? label}</dt>
              <dd className="t-body" style={{ color: "rgba(255,255,255,.72)" }}>
                <a href={href}>{value}</a>
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="site-footer-base">
        <nav className="flex flex-wrap gap-x-8 gap-y-2">
          {LINKS.map(([label, href]) => (
            <Link key={label} href={href} className="t-body">
              {label}
            </Link>
          ))}
        </nav>
        <p className="t-mono" style={{ color: "rgba(255,255,255,.32)" }}>
          {t.footer.rights}
        </p>
      </div>
    </footer>
  );
}
