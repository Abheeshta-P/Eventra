import { config } from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
config({ path: path.join(__dirname, '.env') });

//process.env.VARIABLE_NAME
export const companyEmail = String(process.env.EMAIL || '').trim();
export const pass = String(process.env.PASS || '').trim();
export const mongoDB = String(process.env.MONGODB || '').trim();
export const secret = String(process.env.JWT_SECRET || 'eventra_default_jwt_secret_key_2026').trim();
export const cloudinaryCloudName = String(process.env.CLOUDINARY_CLOUD_NAME || '').trim();
export const cloudinaryKey = String(process.env.CLOUDINARY_API_KEY || '').trim();
export const cloudinarySecret = String(process.env.CLOUDINARY_API_SECRET || '').trim();
