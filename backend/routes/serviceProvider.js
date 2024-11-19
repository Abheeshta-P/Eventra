import express from 'express'
import { handleGetGalleryImages, handleServiceDetailsUpdate, handleUpdateGalleryImages } from '../controller/serviceProvider.js';
import { upload } from '../middleware/index.js';
const router = express.Router();

// update service details
router.patch('/update/serviceDetails',handleServiceDetailsUpdate);
// get gallery
router.get('/getGalleryImages',handleGetGalleryImages);
// update the gallery
router.patch('/updateGalleryImages',upload.array('newImages',8),handleUpdateGalleryImages);

export default router;