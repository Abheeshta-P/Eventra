// models/Event.js
import mongoose from "mongoose";
import Service from "./service.js";
import Participant from "./participant.js";
import Todo from "./Todo.js";

const eventSchema = new mongoose.Schema({
  eventName: { type: String, required: true },
  location: { type: String, required: true },
  date: { type: Date, required: true },
  eventType: { 
    type: String, 
    required: true, 
    enum: ['Wedding', 'Party', 'Entertainment']
  },
  services: [Service.schema], 
  participants: [Participant.schema], 
  todo: [Todo.schema], 
  canvaTemplateLink: { type: String } // based on event type
});

const Event = mongoose.model('Event',eventSchema);
export default Event;
