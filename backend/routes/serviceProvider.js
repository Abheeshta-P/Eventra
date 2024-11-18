import express from 'express'
import { handleGetGalleryImages, handleServiceDetailsUpdate } from '../controller/serviceProvider.js';
const router = express.Router();

// update service details
router.patch('/update/serviceDetails',handleServiceDetailsUpdate);
// get gallery
router.get('/getGalleryImages',handleGetGalleryImages);

export default router;