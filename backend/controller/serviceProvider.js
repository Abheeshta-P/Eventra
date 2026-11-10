import serviceProvider from '../models/serviceProvider.js';
import cloudinary from '../utils/cloudinary.js';
import Event from '../models/event.js';
import nodemailer from 'nodemailer';
import { companyEmail, pass } from '../conf.js';

export async function handleServiceDetailsUpdate(req, res) {
  const { id } = req.user; 
  const { details } = req.body; 

  try {
    const serviceDetails = await serviceProvider.findByIdAndUpdate(
      id, 
      { details }, 
      { new: true } 
    ).select('details'); 

    if (!serviceDetails) {
      return res.status(404).json({ message: 'Service provider not found' });
    }
    return res.status(200).json(serviceDetails);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
}

export async function handleGetGalleryImages(req,res){
  try {
    const { id } = req.user; 

    const provider = await serviceProvider.findById(id);

    if (!provider) {
      return res.status(404).send({ error: 'Service provider not found' });
    }

    res.send({ gallery: provider.gallery });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Internal server error' });
  }
}

export async function handleUpdateGalleryImages(req,res){

  function getPublicId(imageUrl) {
    const parts = imageUrl.split("/");
    const versionIndex = parts.findIndex(part => part.startsWith("v")); // Find the "v{number}" part
    const folderAndFile = parts.slice(versionIndex + 1).join("/"); // Get everything after the version
    return folderAndFile.split(".")[0]; // Remove the file extension
  }

  try {
    const { deletedImages } = req.body;
    const { id } = req.user;

    const provider = await serviceProvider.findById(id);
    if (!provider) {
      return res.status(404).json({ error: "Service provider not found" });
    }

    if (deletedImages) {
      const imagesToDelete = JSON.parse(deletedImages);
      for (const image of imagesToDelete) {
        const publicId = getPublicId(image); 
        const result = await cloudinary.uploader.destroy(publicId, {invalidate : true});
        if (result.result !== "ok") {
          console.error(`Failed to delete image with public_id: ${publicId}`);
        } else {
          console.log(`Image with public_id: ${publicId} deleted successfully.`);
        }
      }

      provider.gallery = provider.gallery.filter((img) => !imagesToDelete.includes(img));
    }

    if (req.files) {
      const newImagePaths = req.files.map((file) => file.path); 
      provider.gallery = [...provider.gallery, ...newImagePaths];
    }

    await provider.save();

    res.status(200).json({ message: "Gallery updated successfully", gallery: provider.gallery });
  } catch (error) {
    console.error("Error updating gallery:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function handleGetProviderBookings(req, res) {
  try {
    const { id } = req.user;
    const provider = await serviceProvider.findById(id);
    if (!provider) {
      return res.status(404).json({ error: "Service provider not found" });
    }

    const events = await Event.find({ "services.email": provider.email })
      .populate('creator', 'name email')
      .sort({ createdAt: -1 });

    const bookings = [];
    events.forEach(event => {
      event.services.forEach(service => {
        if (service.email === provider.email) {
          bookings.push({
            bookingId: service._id,
            eventId: event._id,
            eventName: event.eventName,
            eventType: event.eventType,
            date: event.date,
            location: event.location,
            creator: {
              name: event.creator?.name || 'Client',
              email: event.creator?.email || ''
            },
            serviceName: service.name,
            category: service.category,
            cost: service.cost,
            status: service.status || 'pending',
            completed: event.completed,
            createdAt: event.createdAt
          });
        }
      });
    });

    res.status(200).json({ bookings });
  } catch (error) {
    console.error("Error fetching provider bookings:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function handleUpdateBookingStatus(req, res) {
  try {
    const { id } = req.user;
    const { eventId, serviceId } = req.params;
    const { status } = req.body;

    const allowedStatuses = ['pending', 'confirmed', 'declined', 'completion_requested', 'completed'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid booking status" });
    }

    const provider = await serviceProvider.findById(id);
    if (!provider) {
      return res.status(404).json({ error: "Service provider not found" });
    }

    const event = await Event.findById(eventId).populate('creator', 'name email');
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    const targetService = event.services.find(
      (s) =>
        s._id?.toString() === serviceId.toString() &&
        s.email?.toLowerCase().trim() === provider.email?.toLowerCase().trim()
    );

    if (!targetService) {
      return res.status(404).json({ error: "Booking not found or not assigned to this provider" });
    }

    const today = new Date().toISOString().split('T')[0];
    if (status === 'confirmed' && event.date < today) {
      return res.status(400).json({ error: "Cannot accept a booking for an event whose date has already passed" });
    }

    targetService.status = status;
    await event.save();

    // Try sending email notification to the creator
    if (companyEmail && pass && event.creator?.email) {
      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: { user: companyEmail, pass: pass }
        });

        const statusLabel = status.toUpperCase();
        await transporter.sendMail({
          from: `Eventra <${companyEmail}>`,
          to: event.creator.email,
          subject: `Booking Update: ${provider.name} has marked your request as ${statusLabel}`,
          text: `Dear ${event.creator.name},\n\nYour service provider ${provider.name} (${provider.category}) for event "${event.eventName}" has updated their booking status to: ${statusLabel}.\n\nEvent Date: ${event.date}\nLocation: ${event.location}\n\nYou can review your full event status on your Eventra dashboard.\n\nBest,\nEventra Team`
        });
      } catch (mailErr) {
        console.warn("Could not send status update email:", mailErr.message);
      }
    }

    res.status(200).json({ message: "Booking status updated successfully", status });
  } catch (error) {
    console.error("Error updating booking status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

