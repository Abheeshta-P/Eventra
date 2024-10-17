import bcrypt from 'bcrypt'
import eventCreator from '../models/eventCreator.js';
import serviceProvider from '../models/serviceProvider.js';
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