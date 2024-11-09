import express from 'express'
const router = express.Router();
import { handleGetCategoryServices, handleGetServiceDetails } from '../controller/eventCreator.js';

// fetch all services from serviceCategory
router.get('/categoryServices/:serviceCategory', handleGetCategoryServices);
// fetch details about perticular service using service id
router.get('/service/:id', handleGetServiceDetails);


export default router;