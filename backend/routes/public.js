import express from 'express';
import Event from '../models/event.js';

const router = express.Router();

// Get public event details for the RSVP page
router.get('/event/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { guestId, email } = req.query;
    const event = await Event.findById(id).populate('creator', 'name email');

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const validGuestId = guestId && guestId !== 'undefined' && guestId !== 'null' ? guestId.toString() : null;
    const validEmail = email && email !== 'undefined' && email !== 'null' ? email.trim().toLowerCase() : null;

    let guest = null;
    if (validGuestId || validEmail) {
      const match = event.participants?.find(p => 
        (validGuestId && ((p.id && p.id.toString() === validGuestId) || (p._id && p._id.toString() === validGuestId))) ||
        (validEmail && p.email && p.email.trim().toLowerCase() === validEmail)
      );
      if (match) {
        guest = {
          id: match.id || match._id,
          name: match.name,
          email: match.email || '',
          phone: match.phone || '',
          rsvpStatus: match.rsvpStatus || 'pending',
          headcount: match.headcount || 1,
          dietary: match.dietary || 'None',
          note: match.note || ''
        };
      }
    }

    res.status(200).json({
      event: {
        _id: event._id,
        eventName: event.eventName,
        eventType: event.eventType,
        date: event.date,
        location: event.location,
        creatorName: event.creator?.name || 'The Host',
        completed: event.completed
      },
      guest
    });
  } catch (error) {
    console.error('Error fetching public event details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Submit a guest RSVP
router.post('/event/:id/rsvp', async (req, res) => {
  try {
    const { id } = req.params;
    const { guestId, name, phone, email, rsvpStatus, headcount, dietary, note } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Name is required to RSVP' });
    }

    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const validGuestId = guestId && guestId !== 'undefined' && guestId !== 'null' ? guestId.toString() : null;
    const validEmail = email && email !== 'undefined' && email !== 'null' ? email.trim().toLowerCase() : null;
    const validPhone = phone && phone !== 'undefined' && phone !== 'null' ? phone.trim() : null;
    const validName = name && name.trim() ? name.trim().toLowerCase() : null;

    // Check if participant already exists: priority guestId -> email -> phone -> name
    let participantIndex = -1;
    if (validGuestId) {
      participantIndex = event.participants.findIndex(
        p => (p.id && p.id.toString() === validGuestId) ||
             (p._id && p._id.toString() === validGuestId)
      );
    }
    if (participantIndex === -1 && validEmail) {
      participantIndex = event.participants.findIndex(
        p => p.email && p.email.trim().toLowerCase() === validEmail
      );
    }
    if (participantIndex === -1 && validPhone) {
      participantIndex = event.participants.findIndex(
        p => p.phone && p.phone.trim() === validPhone
      );
    }
    if (participantIndex === -1 && validName) {
      participantIndex = event.participants.findIndex(
        p => p.name && p.name.trim().toLowerCase() === validName
      );
    }

    const statusValue = rsvpStatus === 'declined' ? 'declined' : 'attending';
    const numGuests = statusValue === 'declined' ? 0 : (parseInt(headcount, 10) || 1);
    const cleanNote = note !== undefined && note !== null ? note.toString().trim().slice(0, 250) : '';

    if (participantIndex !== -1) {
      // Update existing participant
      event.participants[participantIndex].rsvpStatus = statusValue;
      event.participants[participantIndex].completed = statusValue === 'attending';
      event.participants[participantIndex].headcount = numGuests;
      if (dietary) event.participants[participantIndex].dietary = dietary;
      if (note !== undefined) event.participants[participantIndex].note = cleanNote;
      if (validEmail && !event.participants[participantIndex].email) {
        event.participants[participantIndex].email = validEmail;
      }
      if (validPhone && !event.participants[participantIndex].phone) {
        event.participants[participantIndex].phone = validPhone;
      }
    } else {
      // Add as new participant to the event invitees list
      event.participants.push({
        id: Date.now().toString(),
        sno: event.participants.length + 1,
        name: name.trim().slice(0, 80),
        phone: validPhone || '',
        email: validEmail || '',
        completed: statusValue === 'attending',
        rsvpStatus: statusValue,
        headcount: numGuests,
        dietary: dietary || 'None',
        note: cleanNote,
        inviteSent: false
      });
    }

    await event.save();

    res.status(200).json({
      message: 'RSVP submitted successfully!',
      rsvpStatus: statusValue,
      headcount: numGuests,
      isNewGuest: participantIndex === -1
    });
  } catch (error) {
    console.error('Error submitting RSVP:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
