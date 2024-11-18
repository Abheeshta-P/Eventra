import { v2 as cloudinary } from 'cloudinary';
import { cloudinaryCloudName, cloudinaryKey, cloudinarySecret } from '../conf.js';

cloudinary.config({
  cloud_name: cloudinaryCloudName,
  api_key: cloudinaryKey,
  api_secret: cloudinarySecret,
});

export default cloudinary;