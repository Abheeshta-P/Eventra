import serviceProvider from '../models/serviceProvider.js';
import mongoose from 'mongoose';
import { companyEmail, pass } from '../conf.js';
import Event from '../models/event.js';
import { Parser } from 'json2csv';
import { renderEmailTemplate, getTransporter, sendMail } from '../utils/mailer.js';

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
      let service = null;

      if (mongoose.Types.ObjectId.isValid(id)) {
        service = await serviceProvider.findById(id).select('-password'); 
      }

      if (!service) {
        const decoded = decodeURIComponent(id);
        service = await serviceProvider.findOne({
          $or: [{ email: decoded }, { email: id }]
        }).select('-password');
      }

      if (!service) {
        return res.status(404).json({ message: 'Service not found' });
      }

      res.json({
        _id: service._id,
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

    if (creatorEmail) {
      const creatorHtml = renderEmailTemplate({
        preheader: 'Event Confirmed',
        title: `"${eventName}" Has Been Created!`,
        subtitle: `Scheduled for ${new Date(date).toLocaleDateString()}`,
        contentHtml: `
          <div style="background-color: #f4f4f5; padding: 12px 16px; border-radius: 8px; margin-bottom: 14px; font-size: 12px; color: #27272a; line-height: 1.6;">
            <p style="margin: 0;"><strong>Event Type:</strong> ${eventType}</p>
            <p style="margin: 4px 0 0 0;"><strong>Location:</strong> ${location}</p>
            <p style="margin: 4px 0 0 0;"><strong>Booked Services:</strong> ${services.length} service(s) selected</p>
          </div>
          <p style="margin: 0; color: #52525b;">Your service provider roster is attached as a CSV for your records. You can manage invitees, checklist items, and bookings anytime on your Eventra dashboard.</p>
        `
      });

      sendMail({
        to: creatorEmail,
        subject: `Your Event "${eventName}" Has Been Created!`,
        text: `Dear User,\n\nYour event "${eventName}" scheduled for ${new Date(date).toLocaleDateString()} has been successfully created.\nLocation: ${location}\nEvent Type: ${eventType}\n\nPlease find attached the service details for your event.\n\nBest,\nEventra Team`,
        html: creatorHtml,
        attachments: [
          {
            filename: 'services.csv',
            content: csvData,      
            contentType: 'text/csv' 
          }
        ]
      }).catch(err => console.warn('Could not send creator event confirmation mail:', err.message));
    }

    for (const service of services) {
      if (!service.email) continue;
      const providerHtml = renderEmailTemplate({
        preheader: 'New Service Booking',
        title: `Upcoming Event Inquiry`,
        subtitle: `Event: <strong>${eventName}</strong>`,
        contentHtml: `
          <p style="margin: 0 0 10px 0;">Dear <strong>${service.name}</strong>,</p>
          <p style="margin: 0 0 12px 0;">You have been selected as a <strong>${service.category}</strong> provider for an upcoming event:</p>
          <div style="background-color: #f4f4f5; padding: 12px 16px; border-radius: 8px; font-size: 12px; color: #27272a; line-height: 1.6;">
            <p style="margin: 0;"><strong>Event:</strong> ${eventName}</p>
            <p style="margin: 4px 0 0 0;"><strong>Date:</strong> ${new Date(date).toLocaleDateString()}</p>
            <p style="margin: 4px 0 0 0;"><strong>Location:</strong> ${location}</p>
          </div>
          <p style="margin: 12px 0 0 0; color: #52525b;">The client may contact you regarding bookings or questions. You can manage your booking status anytime on your Eventra provider portal.</p>
        `
      });

      sendMail({
        to: service.email,
        subject: `Upcoming Event Inquiry: "${eventName}"`,
        text: `Dear ${service.name},\n\nYou have been selected as a service provider for "${eventName}".\nDate: ${new Date(date).toLocaleDateString()}\nLocation: ${location}\n\nBest,\nEventra Team`,
        html: providerHtml
      }).catch(err => console.warn('Could not send provider booking mail:', err.message));
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
    const updatePayload = {};
    if (participants !== undefined) updatePayload.participants = participants;
    if (todos !== undefined) updatePayload.todos = todos;

    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      updatePayload,
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
    if (affectedService?.email) {
      const subject = status === 'completed'
        ? `Service Completed & Settled: "${updatedEvent.eventName}"`
        : `Service Status Updated: "${updatedEvent.eventName}"`;

      const text = status === 'completed'
        ? `Dear ${affectedService.name},\n\nThe event creator has confirmed completion and payment settlement for your ${affectedService.category} service for "${updatedEvent.eventName}".\n\nThank you for providing your services on Eventra!\n\nBest,\nEventra Team`
        : `Dear ${affectedService.name},\n\nThe event creator has marked your service for "${updatedEvent.eventName}" as still active/in progress.\n\nPlease connect with the client regarding any remaining deliverables or payment.\n\nBest,\nEventra Team`;

      const html = renderEmailTemplate({
        preheader: 'Service Settlement Update',
        title: status === 'completed' ? 'Service Completed & Settled' : 'Service Status Updated',
        subtitle: `Event: <strong>${updatedEvent.eventName}</strong>`,
        contentHtml: `
          <p style="margin: 0 0 10px 0;">Dear <strong>${affectedService.name}</strong>,</p>
          <p style="margin: 0 0 12px 0;">The event creator has updated the status of your <strong>${affectedService.category}</strong> service to: <strong style="color: #03089a;">${status.toUpperCase()}</strong>.</p>
          <div style="background-color: #f4f4f5; padding: 12px 16px; border-radius: 8px; font-size: 12px; color: #27272a; line-height: 1.6;">
            <p style="margin: 0;"><strong>Event:</strong> ${updatedEvent.eventName}</p>
            <p style="margin: 4px 0 0 0;"><strong>Date:</strong> ${updatedEvent.date}</p>
            <p style="margin: 4px 0 0 0;"><strong>Location:</strong> ${updatedEvent.location}</p>
          </div>
        `
      });

      sendMail({
        to: affectedService.email,
        subject,
        text,
        html
      }).catch(mailErr => console.warn("Could not send creator status update email:", mailErr.message));
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

export async function handleGetCreatorPendingRequests(req, res) {
  try {
    const creatorId = req.user.id;
    // Find all events created by this creator with services awaiting completion/settlement acknowledgment
    const events = await Event.find({
      creator: creatorId,
      "services.status": "completion_requested"
    }).select("eventName eventType date location services");

    const pendingRequests = [];
    events.forEach(event => {
      event.services.forEach(service => {
        if (service.status === 'completion_requested') {
          pendingRequests.push({
            eventId: event._id,
            eventName: event.eventName,
            eventType: event.eventType,
            eventDate: event.date,
            location: event.location,
            serviceId: service._id,
            serviceName: service.name,
            serviceCategory: service.category,
            cost: service.cost,
            phone: service.phone,
            email: service.email,
            status: service.status
          });
        }
      });
    });

    res.status(200).json({ pendingRequests });
  } catch (error) {
    console.error("Error fetching creator pending requests:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function handleSendEventInvites(req, res) {
  try {
    const { eventId } = req.params;
    const { recipientIds } = req.body || {};

    const event = await Event.findById(eventId).populate('creator', 'name email');
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    if (event.creator._id.toString() !== req.user.id && event.creator.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized to send invites for this event' });
    }

    // Determine target participants with valid email addresses
    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let targets = event.participants.filter(p => p.email && EMAIL_REGEX.test(p.email.trim()));
    if (Array.isArray(recipientIds) && recipientIds.length > 0) {
      const normalizedIds = recipientIds.map(id => String(id).toLowerCase());
      targets = targets.filter(p => 
        (p.id && normalizedIds.includes(String(p.id).toLowerCase())) || 
        (p._id && normalizedIds.includes(p._id.toString().toLowerCase())) ||
        (p.email && normalizedIds.includes(p.email.toLowerCase()))
      );
    } else {
      // By default send to all who haven't received an invite yet
      targets = targets.filter(p => !p.inviteSent);
    }

    if (targets.length === 0) {
      return res.status(200).json({
        message: 'No pending email invites to send.',
        sentCount: 0,
        remainingCount: 0,
        participants: event.participants
      });
    }

    // Safety limit: Cap at 50 emails per request to prevent SMTP throttling or timeout
    const BATCH_LIMIT = 50;
    const batchTargets = targets.slice(0, BATCH_LIMIT);
    const remainingCount = targets.length - batchTargets.length;

    const frontendBase = process.env.FRONTEND_URL || 'http://localhost:3000';
    let sentCount = 0;

    const getHtmlContent = (p) => {
      const pId = p.id || p._id || '';
      const queryParams = new URLSearchParams({
        guestId: pId.toString(),
        email: p.email || '',
        name: p.name || ''
      }).toString();
      const personalRsvpUrl = `${frontendBase}/rsvp/${event._id}?${queryParams}`;

      return renderEmailTemplate({
        preheader: 'Official Invitation',
        title: event.eventName,
        subtitle: `Hosted by <strong>${event.creator?.name || 'Your Host'}</strong>`,
        contentHtml: `
          <div style="background-color: #f4f4f5; padding: 12px 16px; border-radius: 8px; margin-bottom: 16px; font-size: 12px; color: #27272a; line-height: 1.6;">
            <p style="margin: 0;"><strong>Date:</strong> ${event.date}</p>
            <p style="margin: 4px 0 0 0;"><strong>Location:</strong> ${event.location}</p>
          </div>
          <p style="margin: 0; color: #52525b;">Hi <strong>${p.name || 'there'}</strong>, please let your host know if you will be attending:</p>
        `,
        buttonText: 'Confirm Your RSVP',
        buttonUrl: personalRsvpUrl
      });
    };

    const transporter = getTransporter();
    if (transporter) {
      // Send in fast parallel batches of 5 to avoid hanging or timing out
      const CHUNK_SIZE = 5;
      for (let i = 0; i < batchTargets.length; i += CHUNK_SIZE) {
        const chunk = batchTargets.slice(i, i + CHUNK_SIZE);
        await Promise.allSettled(chunk.map(async (participant) => {
          try {
            await transporter.sendMail({
              from: `Eventra <${companyEmail}>`,
              to: participant.email,
              subject: `Invitation: ${event.eventName}`,
              html: getHtmlContent(participant)
            });
            participant.inviteSent = true;
            participant.inviteSentAt = new Date();
            sentCount++;
          } catch (mailError) {
            console.error(`Failed to send invite to ${participant.email}:`, mailError.message);
          }
        }));
      }

      await event.save();
    } else {
      // Mock / fallback if no SMTP configured in local environment
      for (const participant of batchTargets) {
        participant.inviteSent = true;
        participant.inviteSentAt = new Date();
        sentCount++;
      }
      await event.save();
    }

    res.status(200).json({
      success: true,
      sentCount,
      remainingCount,
      sentEmails: batchTargets.map(t => (t.email || '').toLowerCase()),
      message: `Successfully dispatched ${sentCount} invitation(s).${remainingCount > 0 ? ` (${remainingCount} remaining in queue - send next batch anytime)` : ''}`,
      participants: event.participants
    });
  } catch (error) {
    console.error('Error sending event invites:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}


