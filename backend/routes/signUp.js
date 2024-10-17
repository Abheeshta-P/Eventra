import express from 'express'
import { handleSignupEventCreator,handleSignupServiceProvider } from '../controller/auth.js';

const router = express.Router();

router.post('/event-creator',handleSignupEventCreator);
router.post('/service-provider', handleSignupServiceProvider);

export default router