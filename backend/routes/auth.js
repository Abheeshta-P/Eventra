import express from 'express'
import { handleLogin, handleSignupEventCreator,handleSignupServiceProvider } from '../controller/auth.js';

const router = express.Router();

router.post('/signup/event-creator',handleSignupEventCreator);
router.post('/signup/service-provider', handleSignupServiceProvider);
router.post('/login',handleLogin);

export default router