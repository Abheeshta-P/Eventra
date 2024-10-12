// models/Service.js
import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
  category: { 
    type: String, 
    required: true, 
    enum: ['Catering', 'Decorating', 'Photography', 'Venue', 'Music', 'Emcee', 'Makeup', 'Cakeshop'] 
  },
  name: { type: String, required: true },
  cost: { type: Number, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true }
});

const Service = mongoose.model('Service', serviceSchema)
export default Service;
