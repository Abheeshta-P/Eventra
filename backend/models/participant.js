import mongoose from "mongoose";
import { status } from "../constants/index.js";

const participantSchema = new mongoose.Schema({
  id: { type: String, required: false },
  sno: { type: Number, required: false },
  name: { type: String, required: false },
  phone: { type: String, required: false },
  email: { type: String, required: false },
  completed: { 
    type: Boolean, 
    default: false, 
    enum: status
  },
  rsvpStatus: {
    type: String,
    enum: ['pending', 'attending', 'declined'],
    default: 'pending'
  },
  headcount: { type: Number, default: 1 },
  dietary: { type: String, default: 'None' },
  note: { type: String, default: '' },
  inviteSent: { type: Boolean, default: false },
  inviteSentAt: { type: Date }
}, { timestamps: true });

const Participant = mongoose.model('Participant', participantSchema);
export default Participant;