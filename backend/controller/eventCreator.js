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
    if (!services || services.length === 0) {
      return res.status(200).json([]);
    }
    if (serviceCategory === 'Venue' && location && location.trim() !== '' && location !== 'undefined') {
      const filtered = services.filter(service => { 
        if (!service.location) return false;
        return service.location.toLowerCase().includes(location.toLowerCase()) ||
               location.toLowerCase().includes(service.location.toLowerCase());
      });
      // If venues match this location, prioritize them; otherwise keep all so user can choose
      if (filtered.length > 0) {
        services = filtered;
      }
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

export async function handleEventDeletion(req, res) {
  const deleteEventIds  = req.body;
  const { id } = req.user;
  try {
    const response = await Event.deleteMany({ _id: { $in: deleteEventIds } });

    if (response.deletedCount > 0) {
      const remainingEvents = await Event.find({creator : id});
      
      res.status(200).json({
        message: 'Events deleted successfully',
        remainingEvents,  
      });
    } else {
      res.status(404).json({ error: 'No events found to delete' });
    }
  } catch (error) {
    console.error('Error deleting events:', error);
    res.status(500).json({ error: 'Failed to delete events' });
  }
}

export async function handleUpdateServiceStatusByCreator(req, res) {
  try {
    const { id } = req.user;
    const { eventId, serviceId } = req.params;
    const { status } = req.body;

    const allowedStatuses = ['completed', 'confirmed'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status update" });
    }

    const updatedEvent = await Event.findOneAndUpdate(
      { _id: eventId, creator: id, "services._id": serviceId },
      { $set: { "services.$.status": status } },
      { new: true }
    );

    if (!updatedEvent) {
      return res.status(404).json({ error: "Event or service not found or unauthorized" });
    }

    // Find the affected service to get provider email
    const affectedService = updatedEvent.services.id(serviceId);
    if (companyEmail && pass && affectedService?.email) {
      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: { user: companyEmail, pass: pass }
        });

        const subject = status === 'completed'
          ? `Service Completed & Settled: "${updatedEvent.eventName}"`
          : `Service Status Updated: "${updatedEvent.eventName}"`;

        const text = status === 'completed'
          ? `Dear ${affectedService.name},\n\nThe event creator has confirmed completion and payment settlement for your ${affectedService.category} service for "${updatedEvent.eventName}".\n\nThank you for providing your services on Eventra!\n\nBest,\nEventra Team`
          : `Dear ${affectedService.name},\n\nThe event creator has marked your service for "${updatedEvent.eventName}" as still active/in progress.\n\nPlease connect with the client regarding any remaining deliverables or payment.\n\nBest,\nEventra Team`;

        await transporter.sendMail({
          from: `EVENTRA.SASS 📧 ${companyEmail}`,
          to: affectedService.email,
          subject,
          text
        });
      } catch (mailErr) {
        console.warn("Could not send creator status update email:", mailErr.message);
      }
    }

    res.status(200).json({
      message: `Service status updated to ${status} successfully`,
      event: updatedEvent,
      status
    });
  } catch (error) {
    console.error("Error updating service status by creator:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

