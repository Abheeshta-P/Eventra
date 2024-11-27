import express from 'express'
const router = express.Router();
import { handleCreateEvent, handleEventDeletion, handleEventFetchDashBoard, handleGetCategoryServices, handleGetServiceDetails, handleGetServicesDetailsBatch, handleTodoParticipantsUpdate } from '../controller/eventCreator.js';

// fetch all services from serviceCategory
router.get('/categoryServices/:serviceCategory', handleGetCategoryServices);
// fetch details about perticular service using service id
router.get('/service/:id', handleGetServiceDetails);
// batch fetch details of service provider
router.post('/services/batch',handleGetServicesDetailsBatch);
// on confirm event create event as well send email
router.post('/event/createEvent',handleCreateEvent);
// based on event id get the event details
router.get('/event/:id',handleEventFetchDashBoard);
// update todo & participants
router.patch('/event/updateTodoParticipants/:id',handleTodoParticipantsUpdate);
// delete the events
router.delete('/event/deleteEvents',handleEventDeletion);


export default router;