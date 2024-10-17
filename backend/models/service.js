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
  cost: { type: Number, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true }
});

const Service = mongoose.model('Service', serviceSchema)
export default Service;
