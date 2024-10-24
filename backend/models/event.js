// models/Event.js
import mongoose from "mongoose";
import Service from "./service.js";
import Participant from "./participant.js";
import Todo from "./Todo.js";
import { eventTypes } from "../constants/index.js";

const eventSchema = new mongoose.Schema({
  eventName: { type: String, required: true },
  location: { type: String, required: true },
  date: { type: Date, required: true },
  eventType: { 
    type: String, 
    required: true, 
    enum: eventTypes
  },
  services: [Service.schema], 
  participants: [Participant.schema], 
  todo: [Todo.schema], 
  canvaTemplateLink: { type: String } ,// based on event type
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'eventCreator', required: true }, // Use ObjectId reference, 
});

const Event = mongoose.model('Event',eventSchema);
export default Event;
