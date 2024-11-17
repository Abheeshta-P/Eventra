import express from 'express'
import { handleServiceDetailsUpdate } from '../controller/serviceProvider.js';
const router = express.Router();

// update service details
router.patch('/update/serviceDetails',handleServiceDetailsUpdate);

export default router;