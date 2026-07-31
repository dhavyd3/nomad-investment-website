import Link from "next/link";

/* Contact details are the ones published on nomadinvestments.co.ug. */
const REACH = [
  ["Telephone", "+256 (0) 414 675306", "tel:+256414675306"],
  ["WhatsApp", "+256 394 525152", "https://wa.me/256394525152"],
  ["Email", "info@nomadinvestments.co.ug", "mailto:info@nomadinvestments.co.ug"],
];

const LINKS = [
  ["About Us", "/about"],
  ["Our Services", "/#services"],
  ["Contact Us", "/contact"],
];

export default function SiteFooter() {
  return (
    <footer className="site-footer wrap">
      <div className="site-footer-grid">
        <div>
          <div className="flex items-center gap-3">
            <span
              className="grid h-9 w-9 place-items-center rounded-full border-2 text-[7px] tracking-[0.08em]"
              style={{ borderColor: "var(--gold)", fontFamily: "var(--font-geist-mono)" }}
            >
              NIL
            </span>
            <span className="text-[12px] font-medium leading-[1.15] tracking-[0.02em]">
              NOMAD INVESTMENTS
              <br />
              LIMITED
            </span>
          </div>
          <p className="t-mono mt-5">Strategize · Organize · Globalize</p>
          <p className="t-body mt-5 max-w-[34ch]">
            An East African firm getting business done across eleven disciplines, under one
            operating standard.
          </p>
        </div>

        <dl>
          <dt className="t-mono">Office</dt>
          <dd className="t-body whitespace-pre-line" style={{ color: "rgba(255,255,255,.72)" }}>
            {"Plot 13, Mukwano Courts\nBuganda Road, Floor 4, Suite 401–402\nKampala, Uganda"}
          </dd>
        </dl>

        <dl>
          {REACH.map(([label, value, href]) => (
            <div key={label}>
              <dt className="t-mono">{label}</dt>
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
          © 2026 Nomad Investments Limited
        </p>
      </div>
    </footer>
  );
}
