import nodemailer from 'nodemailer';
import { companyEmail, pass } from '../conf.js';

let transporterInstance = null;

export function getTransporter() {
  if (!transporterInstance && companyEmail && pass) {
    transporterInstance = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: companyEmail,
        pass: pass
      },
      connectionTimeout: 5000,
      greetingTimeout: 5000,
      socketTimeout: 8000
    });
  }
  return transporterInstance;
}

/**
 * Standard Eventra branded email HTML wrapper
 */
export function renderEmailTemplate({
  preheader = '',
  title,
  subtitle = '',
  contentHtml,
  buttonText = '',
  buttonUrl = '',
  footerNote = 'Eventra • Digital Event Management & Invitations'
}) {
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 24px 16px; background-color: #f4f4f5; border-radius: 16px;">
      <!-- Logo Header -->
      <div style="text-align: center; margin-bottom: 20px;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
          <tr>
            <td style="background-color: #03089a; border-radius: 6px; padding: 6px 14px;">
              <span style="font-family: Arial, sans-serif; font-size: 18px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;">Eventra</span>
            </td>
          </tr>
        </table>
      </div>

      <!-- Main Content Card -->
      <div style="background-color: #ffffff; padding: 26px 22px; border-radius: 12px; border: 1px solid #e4e4e7; box-shadow: 0 1px 3px rgba(0,0,0,0.04);">
        ${preheader ? `<p style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: #71717a; margin: 0 0 6px 0; letter-spacing: 0.5px;">${preheader}</p>` : ''}
        <h1 style="font-size: 20px; font-weight: 800; color: #09090b; margin: 0 0 6px 0; line-height: 1.3;">${title}</h1>
        ${subtitle ? `<p style="font-size: 13px; color: #52525b; margin: 0 0 16px 0;">${subtitle}</p>` : ''}

        <div style="font-size: 13px; color: #3f3f46; line-height: 1.6; margin-bottom: 16px;">
          ${contentHtml}
        </div>

        ${buttonText && buttonUrl ? `
          <div style="text-align: center; margin: 22px 0 10px 0;">
            <a href="${buttonUrl}" style="display: inline-block; background-color: #03089a; color: #ffffff; font-size: 13px; font-weight: 700; padding: 12px 28px; border-radius: 8px; text-decoration: none;">
              ${buttonText}
            </a>
          </div>
        ` : ''}
      </div>

      <!-- Footer -->
      <p style="text-align: center; font-size: 11px; color: #a1a1aa; margin-top: 16px; margin-bottom: 0;">
        ${footerNote}
      </p>
    </div>
  `;
}

/**
 * Universal mail dispatch helper
 */
export async function sendMail({ to, subject, text, html, attachments = [] }) {
  if (!to) return { success: false, error: 'Recipient email required' };

  const transporter = getTransporter();
  if (!transporter) {
    console.log(`[Mock Mailer] Outgoing to ${to} | Subject: ${subject}`);
    return { success: true, mock: true };
  }

  const mailOptions = {
    from: `Eventra <${companyEmail}>`,
    to,
    subject,
    text: text || '',
    html: html || undefined,
    attachments
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`Mailer error sending to ${to}:`, error.message);
    return { success: false, error: error.message };
  }
}
