import jwt from 'jsonwebtoken'
import { secret } from '../conf.js';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../utils/cloudinary.js';

export function verifyToken(req, res, next) {
  const token = req.cookies.jwt;
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded; 
    next();
  } catch (error) {
    console.error('JWT verification error:', error);
    return res.status(403).json({ message: 'Failed to authenticate token' });
  }
}


const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const userEmail = req.body.email; 
    const sanitizedEmail = userEmail.replace(/[^a-zA-Z0-9]/g, '_'); 

    return {
      folder: `service_provider_gallery/${sanitizedEmail}`,
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      public_id: `${Date.now()}-${file.originalname.split('.')[0]}`,
    };
  },
});

export const upload = multer({ storage });

