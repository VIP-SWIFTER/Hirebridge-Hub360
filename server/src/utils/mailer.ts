// Optional email alerts. If SMTP_* variables are not set, this does nothing and the
// app works exactly the same (data is still saved to MongoDB).
import nodemailer, { Transporter } from "nodemailer";
import type { FormDef, FormRecord } from "../forms";

let transporter: Transporter | false | undefined; // undefined = not created yet, false = not configured

function getTransport(): Transporter | false {
  if (transporter !== undefined) return transporter;
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    transporter = false;
    return transporter;
  }
  const port = Number(SMTP_PORT) || 587;
  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure: port === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
  return transporter;
}

const oneLine = (s: string) => s.replace(/[\r\n]+/g, " ").trim();

function describe(form: FormDef, doc: FormRecord): string {
  const lines: string[] = [];
  for (const [key, f] of Object.entries(form.spec)) {
    const v = doc[key];
    if (v === undefined || v === "" || (Array.isArray(v) && v.length === 0)) continue;
    lines.push(`${f.label}: ${Array.isArray(v) ? v.join(", ") : String(v)}`);
  }
  return lines.join("\n");
}

/** Sends (1) an alert to the manager and (2) a confirmation to the client. */
export async function notify(form: FormDef, doc: FormRecord): Promise<void> {
  const t = getTransport();
  if (!t) return;

  const from = process.env.SMTP_FROM || process.env.SMTP_USER;
  const manager = process.env.NOTIFY_EMAIL || process.env.SMTP_USER;

  await t.sendMail({
    from,
    to: manager,
    replyTo: doc.email,
    subject: `[Hirebridge] New ${form.label} - ${doc.ref}`,
    text: `New ${form.label}\nReference: ${doc.ref}\n\n${describe(form, doc)}\n`,
  });

  if (doc.email) {
    await t.sendMail({
      from,
      to: doc.email,
      subject: oneLine(`We received your ${form.label} - ${doc.ref}`),
      text:
        `Hi ${oneLine(doc.name)},\n\n` +
        `Thank you for contacting Hirebridge Hub360°. We have received your ${form.label.toLowerCase()}.\n` +
        `Your reference number is ${doc.ref}.\n\n` +
        `Our team will get back to you shortly.\n\n` +
        `Hirebridge Hub360°\nBridging Hires, Building Brands\n` +
        `Phone: +91 78456 20360 | Email: hirebridgehub360@gmail.com\n`,
    });
  }
}
