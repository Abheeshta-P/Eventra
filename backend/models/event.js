// models/Event.js
import mongoose from "mongoose";
import Service from "./service.js";
import Participant from "./participant.js";
import Todo from "./todo.js";
import { eventTypes } from "../constants/index.js";

const eventSchema = new mongoose.Schema({
  eventName: { type: String, required: true },
  location: { type: String, required: true },
  date: { type: String, required: true }, // Stored in 'YYYY-MM-DD' format
  eventType: { type: String, required: true, enum: eventTypes },
  services: [Service.schema],
  participants: [Participant.schema],
  todos: [Todo.schema],
  completed: { type: Boolean, default: false },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'eventCreator', required: true },
}, { timestamps: true });

// Middleware to auto-update `completed` based on the date
eventSchema.pre('save', function (next) {
  const today = new Date().toISOString().split('T')[0]; // Current date in 'YYYY-MM-DD' format
  if (this.date < today) {
    this.completed = true; // Mark as completed if the event date is in the past
  } else {
    this.completed = false; // Mark as not completed otherwise
  }
  next();
});

eventSchema.pre('findOneAndUpdate', function (next) {
  const today = new Date().toISOString().split('T')[0]; // Current date in 'YYYY-MM-DD' format
  const update = this.getUpdate();

  if (update.date && update.date < today) {
    this.set({ completed: true });
  } else if (update.date) {
    this.set({ completed: false });
  }
  next();
});

const Event = mongoose.model('Event', eventSchema);
export default Event;
