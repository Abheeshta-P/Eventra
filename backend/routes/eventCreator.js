import express from 'express'
const router = express.Router();
import { handleGetCategoryServices, handleGetServiceDetails, handleGetServicesDetailsBatch } from '../controller/eventCreator.js';

// fetch all services from serviceCategory
router.get('/categoryServices/:serviceCategory', handleGetCategoryServices);
// fetch details about perticular service using service id
router.get('/service/:id', handleGetServiceDetails);
// batch fetch details of service provider
router.post('/services/batch',handleGetServicesDetailsBatch);


export default router;