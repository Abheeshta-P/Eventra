import serviceProvider from '../models/serviceProvider.js';
import nodemailer from 'nodemailer'
import { companyEmail,pass } from '../conf.js';
import Event from '../models/event.js'
import { Parser } from 'json2csv';

export async function handleGetCategoryServices(req, res) {
  const { serviceCategory } = req.params;
  const { location } = req.query;
  
  try {
    let services = await serviceProvider.find({ category: serviceCategory }).select(
      'category name cost email phone location'
    );
    if (services.length === 0) {
      return res.status(404).json({ message: 'No services found in this category' });
    }
    if(serviceCategory === 'Venue') {
      services = services.filter(service => 
        service.location.toLowerCase().includes(location.toLowerCase())
      );
    }    
    
    return res.status(200).json(services);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
}

export async function handleGetServiceDetails(req,res){
    try {
      const { id } = req.params;
  
      const service = await serviceProvider.findById(id).select('-password'); 
  
      if (!service) {
        return res.status(404).json({ message: 'Service not found' });
      }
  
      res.json({
        name: service.name,
        details: service.details,
        email: service.email,
        phone: service.phone,
        category: service.category,
        location: service.location,
        estimatedCost: service.cost,
        galleryImages: service.gallery,
      });
    } catch (error) {
      console.error('Error fetching service details:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
}

export async function handleGetServicesDetailsBatch(req,res){
 try {
   const emails = req.body;  
   if (!Array.isArray(emails)) {
     return res.status(400).json({ error: "Invalid request format" });
   }
   const services = await serviceProvider.find({ email: { $in: emails } })||[];
   res.json(services);
 } catch (error) {
  console.error('Error fetching service details:', error);
  res.status(500).json({ message: 'Internal server error' });
 }
}

export async function handleCreateEvent(req, res) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: companyEmail,  
      pass: pass           
    }
  });
  try {
    const {
      eventName,
      location,
      date,
      eventType,
      services,
      participants,
      todos,
      creatorEmail
    } = req.body; 
 
    const creator = req.user.id;
    const newEvent = new Event({
      eventName,
      location,
      date,
      eventType,
      services,
      participants,
      todos: todos.length?todos:[],
      creator
    });

    const savedEvent = await newEvent.save();

    const serviceFields = ['category', 'name', 'cost', 'email', 'phone', 'location'];
    const json2csvParser = new Parser({ fields: serviceFields });
    const csvData = json2csvParser.parse(services);

    const mailOptions = {
      from: `EVENTRA.SASS 📧 ${companyEmail}`,
      to: creatorEmail, 
      subject: `Your Event "${eventName}" Has Been Created!`,
      text: `Dear User, \n\nYour event "${eventName}" scheduled for ${new Date(date).toLocaleDateString()} has been successfully created.\n\nLocation: ${location}\nEvent Type: ${eventType}\n\nPlease find attached the service details for your event.\n\nThank you for using our service!\n\nBest,\nEventra Team`,
      attachments: [
        {
          filename: 'services.csv',
          content: csvData,      
          contentType: 'text/csv' 
        }
      ]
    };

    await transporter.sendMail(mailOptions);
    for (const service of services) {
      const providerMailOptions = {
        from: `EVENTRA.SASS 📧 ${companyEmail}`,
        to: service.email,
        subject: `Upcoming Event Inquiry: "${eventName}"`,
        text: `Dear ${service.name},\n\nYou have been selected as a service provider for an event. Here are the details:\n\nEvent: ${eventName}\nDate: ${new Date(date).toLocaleDateString()}\nLocation: ${location}\nEvent Type: ${eventType}\n\nYou may be contacted by the client regarding bookings or additional inquiries. Please be prepared to provide your services as requested.\n\nThank you for being part of Eventra!\n\nBest,\nEventra Team`
      };

      await transporter.sendMail(providerMailOptions);
    }
  
    const userEvents = await Event.find({ creator: creator }).select('eventName location date eventType _id');

    res.status(201).json({
      message: "Event created successfully and notifications sent to service providers!",
      userEvents
    });
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ message: "Error creating event", error });
  }
}

export async function handleEventFetchDashBoard(req,res){
 try {
   const { id } = req.params;
   const event = await Event.findById(id);
   if (!event) {
     return res.status(404).json({ message: 'Event not found' });
   }
   res.status(200).json({ event });
 } catch (error) {
  console.error('Error fetching event details:', error);
  res.status(500).json({ message: 'Internal server error' });
 }
}

export async function handleTodoParticipantsUpdate(req, res)  {
  const { id } = req.params;
  const { participants, todos } = req.body;

  if (!todos && !participants) {
    return res.status(400).json({ success: false, message: 'No data provided for update.' });
  }

  try {
    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      { participants, todos },
      { new: true }
    );

    if (!updatedEvent) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    res.status(200).json({ success: true, event: updatedEvent });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to update event' });
}
}