import express from 'express'
const router = express.Router();
import { handleGetCategoryServices } from '../controller/eventCreator.js';

// fetch all services from serviceCategory
router.get('/:serviceCategory', handleGetCategoryServices);

export default router;