import express from 'express'
import { handleGetCurrentUser, handleLogin, handleLogout, handleSignupEventCreator,handleSignupServiceProvider } from '../controller/auth.js';
import { upload, verifyToken } from '../middleware/index.js';

const router = express.Router();

router.post('/signup/event-creator',handleSignupEventCreator);
router.post('/signup/service-provider',upload.array('galleryImages', 8),handleSignupServiceProvider);
router.post('/login',handleLogin);
router.post('/logout',handleLogout);
router.get('/current-user',verifyToken,handleGetCurrentUser);

export default router