// models/Service.js
import mongoose from "mongoose";
import { serviceCategories } from "../constants/index.js";

const serviceSchema = new mongoose.Schema({
  category: { 
    type: String, 
    required: true, 
    enum: serviceCategories
  },
  name: { type: String, required: true },
  cost: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  location: { type: String, required: false },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'declined', 'completion_requested', 'completed'],
    default: 'pending'
  }
});

const Service = mongoose.model('Service', serviceSchema);
export default Service;

