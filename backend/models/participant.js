import mongoose from "mongoose";

const participantSchema = new mongoose.Schema({
  sno: { type: Number, required: true },
  name: { type: String, required: true },
  phone: { type: String, required: true }
});

const Participant = mongoose.model('Participant', participantSchema)
export default Participant;