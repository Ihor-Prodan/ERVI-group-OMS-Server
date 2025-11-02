import nodemailer from "nodemailer";

const host = process.env.SMTP_HOST;
const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined;
const user = process.env.SMTP_USER;
const pass = process.env.SMTP_PASS;
const secure = process.env.SMTP_SECURE;

export const transporter =
  host && port && user && pass
    ? nodemailer.createTransport({
        host: host,
        port: port,
        secure: secure === "true",
        auth: { user: user, pass: pass },
      })
    : null;

if (transporter) {
  console.log(
    `SMTP configured: ${host}:${port} (secure=${secure === "true"})`
  );
} else {
  console.warn("⚠️ SMTP not configured properly. Emails will not be sent.");
}

export const sendOrderEmail = async ({
  to,
  subject,
  text,
  attachments = [],
}) => {
  await transporter.sendMail({
    from: `"${process.env.MAIL_SENDER_NAME || "Doručovacia služba"}" <${
      process.env.SMTP_USER
    }>`,
    to,
    subject,
    text,
    attachments,
  });
};
