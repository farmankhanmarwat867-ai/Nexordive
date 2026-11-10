import nodemailer, { Transporter } from 'nodemailer';
import { env } from '../config/env.js';
import { ILead } from '../models/Lead.js';

let cachedTransporter: Transporter | null = null;

function isMailConfigured(): boolean {
  return Boolean(env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS);
}

function getTransporter(): Transporter | null {
  if (!isMailConfigured()) return null;
  if (!cachedTransporter) {
    cachedTransporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_SECURE,
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
      },
    });
  }
  return cachedTransporter;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export async function sendNewLeadNotification(lead: ILead): Promise<{ sent: boolean }> {
  const transporter = getTransporter();
  const recipient = env.LEADS_NOTIFY_EMAIL;

  if (!transporter || !recipient) {
    return { sent: false };
  }

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #0f172a;">
      <h2 style="color: #004d6a;">New Client Inquiry (${escapeHtml(lead.referenceCode)})</h2>
      <p><strong>Name:</strong> ${escapeHtml(lead.name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(lead.email)}</p>
      <p><strong>WhatsApp:</strong> ${escapeHtml(lead.whatsapp)}</p>
      <p><strong>Service:</strong> ${escapeHtml(lead.service)}</p>
      <p><strong>Budget:</strong> ${escapeHtml(lead.budget)}</p>
      ${lead.notes ? `<p><strong>Notes:</strong><br/>${escapeHtml(lead.notes)}</p>` : ''}
      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
      <p style="font-size: 12px; color: #64748b;">Sent automatically by NexorDive Backend CRM.</p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: env.SMTP_FROM,
      to: recipient,
      replyTo: lead.email,
      subject: `[NexorDive Lead] ${lead.referenceCode} — ${lead.service} (${lead.name})`,
      html,
    });
    return { sent: true };
  } catch (err) {
    console.warn('[NexorDive Mail] Failed to send lead alert email:', (err as Error).message);
    return { sent: false };
  }
}

export async function sendSecurityNotification(
  recipientEmail: string,
  subject: string,
  bodyText: string
): Promise<{ sent: boolean }> {
  const transporter = getTransporter();
  if (!transporter || !recipientEmail) {
    return { sent: false };
  }

  try {
    await transporter.sendMail({
      from: env.SMTP_FROM,
      to: recipientEmail,
      subject,
      text: bodyText,
    });
    return { sent: true };
  } catch (err) {
    console.warn('[NexorDive Mail] Failed to send security email:', (err as Error).message);
    return { sent: false };
  }
}
