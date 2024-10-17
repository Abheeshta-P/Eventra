import nodemailer from 'nodemailer'
import { companyEmail,pass } from '../conf.js';

const handleContactUs = async (req, res) => {
  const { name, email, message } = req.body;

  // Validate input
  if (!name || !email || !message) {
    return res.status(400).json({ message: 'All fields are required' });
  }

   // Nodemailer setup
   const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
      user: companyEmail, 
      pass: pass, 
    },
  });

  const mailOptions = {
    from: `EVENTRA.SASS 📧 ${companyEmail}`,
    to: companyEmail, 
    subject: `Contact Form Submission from ${name}`,
    text: `From ${name} (${email}):\n\n${message}`,
    html: `<h1>From : ${name} (${email})</h1><br><h2>${message}</h2>`,

  };

  // Send email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      return res.status(500).json({ message: 'Failed to send email' });
    }
    res.status(200).json({ message: 'Email sent successfully!' });
  });
}

export default handleContactUs;