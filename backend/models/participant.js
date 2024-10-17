import mongoose from "mongoose";
import { status } from "../constants/index.js";

const participantSchema = new mongoose.Schema({
  sno: { type: Number, required: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  status: { 
    type: String, 
    default: 'pending', 
    enum: status
  }
});

const Participant = mongoose.model('Participant', participantSchema)
export default Participant;