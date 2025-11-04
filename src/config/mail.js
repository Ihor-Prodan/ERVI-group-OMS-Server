import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendOrderEmail = async ({
  to,
  subject,
  text,
  attachments = [],
}) => {

  try {
    await resend.emails.send({
      from: `${process.env.MAIL_SENDER_NAME || "Doručovacia služba"} <${process.env.SMTP_USER}>`,
      to,
      subject,
      text,
      attachments,
    });

    console.log(`✅ Email sent to ${to}`);
  } catch (err) {
    console.error('❌ Chyba pri odosielaní emailu cez Resend:', err);
  }
};

