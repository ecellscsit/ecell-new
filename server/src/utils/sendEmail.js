import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

export const sendEmail = async ({ to, subject, html }) => {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
    // Local development: no email service yet -> show the email in the terminal
    const links = [...html.matchAll(/href="([^"]+)"/g)].map((m) => m[1]);
    console.log(`\n📧 [EMAIL not sent, SMTP not configured]\n   To: ${to}\n   Subject: ${subject}\n   Links: ${links.join('  ') || '-'}\n`);
    return;
  }
  return transporter.sendMail({ from: process.env.MAIL_FROM, to, subject, html });
};

// Send to many people in small batches (avoids spam filters)
export async function sendBatch(recipients, build, size = 40, pauseMs = 2000) {
  for (let i = 0; i < recipients.length; i += size) {
    await Promise.allSettled(recipients.slice(i, i + size).map((u) => sendEmail({ to: u.email, ...build(u) })));
    if (i + size < recipients.length) await new Promise((r) => setTimeout(r, pauseMs));
  }
}
