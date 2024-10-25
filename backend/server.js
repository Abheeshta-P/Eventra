import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser';

import { mongoDB } from './conf.js';
import { connectMongoDB } from './connection.js';
import authRouter from './routes/auth.js'
import handleContactUs from './controller/contact-us.js'

const app = express();

// there is a need to upload images

// Configure CORS 
app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  credentials: true, 
}));

// Body parser middleware
app.use(express.json());
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }));

connectMongoDB(mongoDB);

// ROUTES :
// contact route
app.post('/api/contact-us', handleContactUs);

app.use('/api/auth',authRouter)

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
 