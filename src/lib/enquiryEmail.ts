/**
 * The enquiry notification that lands in Nomad's inbox.
 *
 * Built as a table with inline styles rather than a stylesheet: mail clients strip
 * <style> blocks, drop flex and grid, and Outlook still lays out on tables. Anything
 * cleverer than this renders beautifully in a browser and badly where it matters.
 */

export type Enquiry = {
  name: string;
  organisation: string;
  email: string;
  discipline: string;
  message: string;
};

const NAVY = "#060644";
const GOLD = "#ffde59";
const INK = "#202020";
const MUTED = "#6b6b6b";
const LINE = "#e4e4e0";

/** Subject line — says it is a lead, and which discipline, before it is opened. */
export function enquirySubject(e: Enquiry) {
  return `New enquiry for Nomad Investments Limited — ${e.discipline}`;
}

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string
  );

/** Message body, with the sender's own line breaks kept. */
const paragraphs = (s: string) =>
  escapeHtml(s)
    .split(/\n{2,}/)
    .map((p) => `<p style="margin:0 0 14px;">${p.replace(/\n/g, "<br />")}</p>`)
    .join("");

function row(label: string, value: string, href?: string) {
  const inner = href
    ? `<a href="${href}" style="color:${NAVY};text-decoration:none;">${escapeHtml(value)}</a>`
    : escapeHtml(value);
  return `
    <tr>
      <td style="padding:14px 0 4px;font:400 11px/1.4 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.14em;text-transform:uppercase;color:${MUTED};">
        ${escapeHtml(label)}
      </td>
    </tr>
    <tr>
      <td style="padding:0 0 14px;border-bottom:1px solid ${LINE};font:400 16px/1.45 -apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:${INK};">
        ${inner}
      </td>
    </tr>`;
}

export function enquiryHtml(e: Enquiry, receivedAt: Date) {
  const when = receivedAt.toLocaleString("en-GB", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "Africa/Kampala",
  });

  return `<!doctype html>
<html lang="en">
<body style="margin:0;padding:0;background:#f4f4f2;">
  <!-- shown in the inbox preview line, then hidden -->
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">
    ${escapeHtml(e.name)}${e.organisation ? ` (${escapeHtml(e.organisation)})` : ""} — ${escapeHtml(e.discipline)}
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f2;padding:28px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:14px;overflow:hidden;">

          <tr>
            <td style="background:${NAVY};padding:26px 30px;">
              <div style="font:500 12px/1.4 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.16em;text-transform:uppercase;color:${GOLD};">
                New enquiry
              </div>
              <div style="margin-top:8px;font:300 24px/1.2 -apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;letter-spacing:-.02em;color:#ffffff;">
                Nomad Investments Limited
              </div>
            </td>
          </tr>

          <tr>
            <td style="padding:8px 30px 30px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                ${row("Name", e.name)}
                ${e.organisation ? row("Organisation", e.organisation) : ""}
                ${row("Email", e.email, `mailto:${e.email}`)}
                ${row("Discipline", e.discipline)}
              </table>

              <div style="margin:22px 0 8px;font:400 11px/1.4 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.14em;text-transform:uppercase;color:${MUTED};">
                Brief
              </div>
              <div style="font:400 16px/1.6 -apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:${INK};">
                ${paragraphs(e.message)}
              </div>

              <table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:26px;">
                <tr>
                  <td style="background:${GOLD};border-radius:6px;">
                    <a href="mailto:${e.email}?subject=${encodeURIComponent("Re: your enquiry — Nomad Investments Limited")}"
                       style="display:inline-block;padding:13px 22px;font:500 13px/1 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.06em;text-transform:uppercase;color:${NAVY};text-decoration:none;">
                      Reply to ${escapeHtml(e.name)}
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:18px 30px 26px;border-top:1px solid ${LINE};font:400 12px/1.5 ui-monospace,SFMono-Regular,Menlo,monospace;color:${MUTED};">
              Received ${escapeHtml(when)} (EAT) via the website contact form.<br />
              Replying to this message goes straight to the sender.
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/** Plain-text alternative, for clients that will not render HTML. */
export function enquiryText(e: Enquiry, receivedAt: Date) {
  const when = receivedAt.toLocaleString("en-GB", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "Africa/Kampala",
  });
  return [
    "NEW ENQUIRY — NOMAD INVESTMENTS LIMITED",
    "",
    `Name:         ${e.name}`,
    e.organisation ? `Organisation: ${e.organisation}` : null,
    `Email:        ${e.email}`,
    `Discipline:   ${e.discipline}`,
    "",
    "Brief",
    "-----",
    e.message,
    "",
    `Received ${when} (EAT) via the website contact form.`,
    "Replying to this message goes straight to the sender.",
  ]
    .filter((l) => l !== null)
    .join("\n");
}
