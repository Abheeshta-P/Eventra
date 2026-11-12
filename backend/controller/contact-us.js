import { sendMail, renderEmailTemplate } from '../utils/mailer.js';
import { companyEmail } from '../conf.js';

const handleContactUs = async (req, res) => {
  const { name, email, message } = req.body;

  // Validate input
  if (!name || !email || !message) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const html = renderEmailTemplate({
    preheader: 'New Inquiry',
    title: 'Contact Form Submission',
    subtitle: `From: <strong>${name}</strong> (${email})`,
    contentHtml: `
      <div style="background-color: #f4f4f5; padding: 14px 18px; border-radius: 8px; font-size: 13px; color: #27272a; line-height: 1.6; white-space: pre-wrap; word-break: break-word;">
        ${message}
      </div>
    `
  });

  const result = await sendMail({
    to: companyEmail,
    subject: `Contact Form Submission from ${name}`,
    text: `From ${name} (${email}):\n\n${message}`,
    html
  });

  if (!result.success) {
    return res.status(500).json({ message: 'Failed to send email', error: result.error });
  }

  res.status(200).json({ message: 'Email sent successfully!' });
};

export default handleContactUs;
