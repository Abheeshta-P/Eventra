import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import eventCreator from '../models/eventCreator.js';
import serviceProvider from '../models/serviceProvider.js';
import { secret } from '../conf.js';
import Event from '../models/event.js';

export async function handleSignupEventCreator(req,res) {
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

export async function handleSignupServiceProvider(req, res) {
  try {
    const { name, email, phone, location, category, details, cost, password } = req.body;

    const existingUserEmail = await serviceProvider.findOne({ email });
    const existingUserPhone = await serviceProvider.findOne({ phone });
    if (existingUserEmail || existingUserPhone) {
      return res.status(400).send({ error: 'Email or Phone already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const galleryImages = req.files.map((file) => file.path) || []; // File URLs returned by Cloudinary

    const newUser = new serviceProvider({
      name,
      email,
      phone,
      location,
      category,
      details,
      cost,
      password: hashedPassword,
      gallery: galleryImages, 
    });

    await newUser.save();
    console.log('Registered');

    res.send({ message: 'User created successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Internal server error' });
  }
}

export async function handleLogin(req, res) {
  console.log("login")
  try {
    const { email, password } = req.body;
    let id;
    let user = await eventCreator.findOne({ email });
    id = user?._id;
    let userType = 'eventCreator';
    let userEvents = [];

    if (!user) {
      user = await serviceProvider.findOne({ email });
      userType = 'serviceProvider';
    }

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (userType === 'eventCreator') {
      userEvents = await Event.find({ creator: id }).select('eventName location date eventType _id');
    }

    const token = jwt.sign(
      { id: user._id, userType }, 
      secret,
      { expiresIn: '24h' }
    );

    res.cookie('jwt', token, { 
      httpOnly: true, 
      sameSite: 'Strict', 
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000, 
    });

    res.status(200).json({
      message: 'Logged in successfully',
      userType,
      userData: {
        name: user.name,
        email: user.email,
        _id: user._id,
        phone : userType === 'serviceProvider' ? user.phone : '',
        location : userType === 'serviceProvider' ? user.location : '',
        category : userType === 'serviceProvider' ? user.category : '',
        cost : userType === 'serviceProvider' ? user.cost : '',
        details : userType === 'serviceProvider' ? user.details : '',
      },
      events: userType === 'eventCreator' ? userEvents : [], 
      isLoggedIn: true,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}


export async function handleLogout(req,res){
  try {
    res.clearCookie('jwt', {
      httpOnly: true,
      sameSite: 'Strict', 
      secure: process.env.NODE_ENV === 'production', 
    });

    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Error during logout:', error);
    res.status(500).json({ message: 'Internal server error during logout' });
  }
}

// get current user
export async function handleGetCurrentUser(req,res){
    try {
      const { id, userType } = req.user;
  
      let user;
      let userEvents = [];
  
      if (userType === 'eventCreator') {
        user = await eventCreator.findById(id).select('name email');
        userEvents = await Event.find({ creator: id }).select('eventName location date eventType');
      } else if (userType === 'serviceProvider') {
        user = await serviceProvider.findById(id).select('name email phone location category cost details');
      }
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Respond with the same structure as the login response
      res.status(200).json({
        message: 'Logged in successfully',
        userType,
        userData: {
          name: user.name,
          email: user.email,
          _id: user._id,
          phone : userType === 'serviceProvider' ? user.phone : '',
          location : userType === 'serviceProvider' ? user.location : '',
          category : userType === 'serviceProvider' ? user.category : '',
          cost : userType === 'serviceProvider' ? user.cost : '',
          details : userType === 'serviceProvider' ? user.details : '',
        },
        events: userType === 'eventCreator' ? userEvents : [], // Only return events for eventCreators
        isLoggedIn: true,
      });
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ message: 'Internal server error' });
    } 
}