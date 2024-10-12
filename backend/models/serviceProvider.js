import mongoose from "mongoose";

const categories = ['Catering', 'Decorating', 'Photography', 'Venue', 'Music', 'Emcee', 'Makeup', 'Cakeshop'];

const ProviderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true }, 
  phone: { type: Number, required: true, unique: true },
  location: { type: String, required: true },
  category: { 
    type: String, 
    required: true, 
    enum: categories 
  },
  details: { type: String, required: true },
  cost: { type: String, required: true },
  gallery: [{ type: String }], // URLs or image IDs
  about: { type: String, required: true },
  password: { type: String, required: true },
  userType: { 
    type: String, 
    default: 'serviceProvider', 
    enum: ['serviceProvider'] 
  },
}, { timestamps: true });

const serviceProvider = mongoose.model('serviceProvider', ProviderSchema);
export default serviceProvider;