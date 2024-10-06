import express from 'express'
import cors from 'cors'
import nodemailer from 'nodemailer'
import { companyEmail,pass } from './conf.js';
const app = express();

// Configure CORS 
app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  credentials: true, 
}));

// Body parser middleware
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// ROUTES :
// contact route
app.post('/api/contact-us', async (req, res) => {
  console.log(req)
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
});


app.post('/api/signup', (req, res) => {
  // Handle signup
  console.log("Registered")
});

app.post('/api/login', (req, res) => {
  console.log("Logged in")
});

app.get('/api/currentUser', (req, res) => {
  // Assuming you're storing user data in req.user (e.g., after authenticating with a JWT or session)
  const userData = req.user; // Replace this with your logic to get the user from session or JWT
  const userType = userData ? userData.type : null; // Assuming `userData` has a `type` field
  
  if (userData) {
    // Send user data and user type
    res.status(200).json({
      userData: userData,
      userType: userType,
    });
  } else {
    // If user is not logged in, return a 401 Unauthorized response
    res.status(401).json({ message: 'User not authenticated' });
  }
});


app.post('/api/logout', (req, res) => {
  // Logout logic (e.g., clearing session, tokens, etc.)
  // req.logout(); // If using a session-based auth, for example
  res.status(200).json({ message: 'Logged out successfully' });
});


app.listen(5000, () => {
  console.log(`Server is running on port 5000 http://localhost:${5000}`);
});
 