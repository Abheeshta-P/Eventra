import { config } from 'dotenv';
config(); 

//process.env.VARIABLE_NAME
export const companyEmail = String(process.env.EMAIL);
export const pass = String(process.env.PASS);
export const mongoDB = String(process.env.MONGODB);
export const secret = String(process.env.JWT_SECRET);
export const cloudinaryCloudName = String(process.env.CLOUDINARY_CLOUD_NAME);
export const cloudinaryKey = String(process.env.CLOUDINARY_API_KEY);
export const cloudinarySecret = String(process.env.CLOUDINARY_API_SECRET);