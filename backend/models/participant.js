import mongoose from "mongoose";
import { status } from "../constants/index.js";

const participantSchema = new mongoose.Schema({
  id : { type: String, required: false },
  sno: { type: Number, required: false },
  name: { type: String, required: false },
  phone: { type: String, required: false },
  completed: { 
    type: Boolean, 
    default: false, 
    enum: status
  }
});

const Participant = mongoose.model('Participant', participantSchema)
export default Participant;