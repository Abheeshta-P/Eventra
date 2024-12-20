import mongoose from "mongoose";

const eventCreatorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  userType: { 
    type: String, 
    default: 'eventCreator', 
    enum: ['eventCreator'] 
  },
}, { timestamps: true });

const eventCreator = mongoose.model('eventCreator',eventCreatorSchema);
export default eventCreator;