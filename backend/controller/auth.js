import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import eventCreator from '../models/eventCreator.js';
import serviceProvider from '../models/serviceProvider.js';
import { secret } from '../conf.js';
import Event from '../models/event.js';

export async function handleSignupEventCreator(req,res) {
    // Handle signup
    try {
      const { name, email, password } = req.body;
  
      const existingUser = await eventCreator.findOne({ email });
      if (existingUser) {
        return res.status(400).send({ error: 'Email already in use' });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const newUser = new eventCreator({ name, email, password: hashedPassword});
      await newUser.save();
      if(newUser) console.log("Registered")
      res.send({ message: 'User created successfully!' }); 
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: 'Internal server error' });
    }
}

export async function handleSignupServiceProvider(req,res) {
    // Handle signup
    try {
      const { name, email, phone, location, category, details, cost, password } = req.body;
  
      const existingUserEmail = await serviceProvider.findOne({ name, email });
      const existingUserPhone = await serviceProvider.findOne({ name , phone})
      if (existingUserEmail || existingUserPhone) {
        return res.status(400).send({ error: 'Email or Phone already in use' });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const newUser = new serviceProvider({ name, email, phone, location, category, details, cost, password: hashedPassword});
      await newUser.save();
      if(newUser) console.log("Registered")

      res.send({ message: 'User created successfully!' }); 
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: 'Internal server error' });
    }
}



export async function handleLogin(req, res) {
  console.log("try login")
  try {
    const { email, password } = req.body;

    // Check for user in both eventCreator and serviceProvider collections
    let user = await eventCreator.findOne({ email });
    let userType = 'eventCreator';
    let userEvents = [];

    if (!user) {
      user = await serviceProvider.findOne({ email });
      userType = 'serviceProvider';
    }

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if the password matches
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // If the user is an event creator, fetch their events based on the user's email
    if (userType === 'eventCreator') {
      userEvents = await Event.find({ creatorEmail: user.email }).select('eventName location date eventType');
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, userType }, // Include user type in the token
      secret,
      { expiresIn: '1h' }
    );

    // Set JWT as a cookie (with HttpOnly and Secure flags)
    res.cookie('jwt', token, {
      httpOnly: true, // Can't be accessed via JavaScript
      sameSite: 'Strict', // Prevent CSRF
      maxAge: 3600000, // Expiration time (1 hour)
    });

    // Respond with user data and events (if eventCreator)
    res.status(200).json({
      message: 'Logged in successfully',
      userType,
      userData: {
        name: user.name,
        email: user.email,
        _id: user._id,
      },
      events: userType === 'eventCreator' ? userEvents : [], // Only return events for eventCreators
      isLoggedIn: true,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
