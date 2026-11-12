import express from 'express'
const router = express.Router();
import { 
  handleCreateEvent, 
  handleEventDeletion, 
  handleEventFetchDashBoard, 
  handleGetCategoryServices, 
  handleGetServiceDetails, 
  handleGetServicesDetailsBatch, 
  handleTodoParticipantsUpdate,
  handleUpdateServiceStatusByCreator,
  handleGetCreatorPendingRequests,
  handleSendEventInvites
} from '../controller/eventCreator.js';

// pending delivery & payment requests for creator dashboard
router.get('/pending-requests', handleGetCreatorPendingRequests);

// send email invitations to event participants
router.post('/event/:eventId/send-invites', handleSendEventInvites);

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
// update service status by event creator (confirm/acknowledge completion)
router.patch('/event/:eventId/service/:serviceId/status', handleUpdateServiceStatusByCreator);
// delete the events
router.delete('/event/deleteEvents',handleEventDeletion);

export default router;
