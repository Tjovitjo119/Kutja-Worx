const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export const emailConfigured = Boolean(process.env.RESEND_API_KEY && process.env.CONTACT_TO_EMAIL);

/** Branded notification email to the workshop, sent with Resend's REST API. Never throws. */
export async function notifyWorkshop(opts: { subject: string; rows: [string, string][]; message?: string; replyTo?: string }) {
  if (!emailConfigured) {
    console.warn("[email] RESEND_API_KEY / CONTACT_TO_EMAIL not set: inquiry saved but no email sent.");
    return false;
  }
  const html = `<!doctype html><html><body style="margin:0;background:#0a0a0a;font-family:Arial,sans-serif;color:#fff">
<div style="max-width:560px;margin:0 auto;background:#141414;border-top:4px solid #E60012">
  <div style="padding:20px 24px;font-size:22px;font-weight:bold;letter-spacing:1px"><span style="color:#E60012">KUTJA</span> WORX</div>
  <div style="padding:0 24px 24px">
    <h2 style="margin:0 0 12px;font-size:18px;text-transform:uppercase">${esc(opts.subject)}</h2>
    <table style="width:100%;border-collapse:collapse;font-size:14px">
      ${opts.rows.map(([k, v]) => `<tr><td style="padding:6px 0;color:#9CA3AF;width:120px;vertical-align:top">${esc(k)}</td><td style="padding:6px 0">${esc(v) || "-"}</td></tr>`).join("")}
    </table>
    ${opts.message ? `<p style="margin:16px 0 0;padding:12px;background:#0a0a0a;border-left:3px solid #E60012;white-space:pre-wrap;font-size:14px">${esc(opts.message)}</p>` : ""}
  </div>
</div></body></html>`;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM_EMAIL || "Kutja Worx <onboarding@resend.dev>",
        to: [process.env.CONTACT_TO_EMAIL],
        subject: opts.subject,
        html,
        ...(opts.replyTo ? { reply_to: opts.replyTo } : {}),
      }),
    });
    if (!res.ok) console.error("[email] Resend error", res.status, await res.text());
    return res.ok;
  } catch (e) {
    console.error("[email] send failed", e);
    return false;
  }
}
