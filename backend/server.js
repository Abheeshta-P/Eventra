import express from 'express'
const cors = require('cors');
const app = express();

// Configure CORS
app.use(cors({
  origin: '*', // Allow only your Next.js app to access the API
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
}));

// Your routes here
app.post('/api/signup', (req, res) => {
  // Handle signup
});

app.post('/api/login', (req, res) => {
  // Handle login
});

app.post('/api/logout', (req, res) => {
  // Handle logout
});

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
