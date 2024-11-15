import mongoose from "mongoose";
import { status } from "../constants/index.js";

const participantSchema = new mongoose.Schema({
  sno: { type: Number, required: false },
  name: { type: String, required: false },
  phone: { type: String, required: false },
  status: { 
    type: String, 
    default: 'pending', 
    enum: status
  }
});

const Participant = mongoose.model('Participant', participantSchema)
export default Participant;