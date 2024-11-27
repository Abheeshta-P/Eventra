// models/Event.js
import mongoose from "mongoose";
import Service from "./service.js";
import Participant from "./participant.js";
import Todo from "./todo.js";
import { eventTypes, status } from "../constants/index.js";

const eventSchema = new mongoose.Schema({
  eventName: { type: String, required: true },
  location: { type: String, required: true },
  date: { type: String, required: true },
  eventType: { 
    type: String, 
    required: true, 
    enum: eventTypes
  },
  services: [Service.schema], 
  participants: [Participant.schema], 
  todos: [Todo.schema], 
  completed: { 
    type: Boolean, 
    default: false, 
    enum: status
  },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'eventCreator', required: true }, 
},{ timestamps: true });

const Event = mongoose.model('Event',eventSchema);
export default Event;
