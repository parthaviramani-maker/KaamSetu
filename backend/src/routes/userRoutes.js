import express from 'express';
import { getMe, updateMe, deleteMe, setPassword, getAuthorizedEmails, updateAuthorizedEmails } from '../controllers/userController/index.js';
import authenticateUser from '../middlewares/authMiddleware.js';
import requireRole from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.use(authenticateUser);

router.get('/me',                    getMe.validator,       getMe.handler);
router.put('/me',                    updateMe.validator,    updateMe.handler);
router.delete('/me',                 deleteMe.handler);
router.post('/set-password',         setPassword.validator, setPassword.handler);

// Admin-only: manage 2FA authorized emails
router.get('/me/authorized-emails',  requireRole('admin'), getAuthorizedEmails.handler);
router.put('/me/authorized-emails',  requireRole('admin'), updateAuthorizedEmails.handler);

export default router;
