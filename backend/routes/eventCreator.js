import express from 'express'
const router = express.Router();
import { handleCreateEvent, handleGetCategoryServices, handleGetServiceDetails, handleGetServicesDetailsBatch } from '../controller/eventCreator.js';

// fetch all services from serviceCategory
router.get('/categoryServices/:serviceCategory', handleGetCategoryServices);
// fetch details about perticular service using service id
router.get('/service/:id', handleGetServiceDetails);
// batch fetch details of service provider
router.post('/services/batch',handleGetServicesDetailsBatch);
// on confirm event create event as well send email
router.post('/event/createEvent',handleCreateEvent);


export default router;