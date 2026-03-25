import express from 'express';
import { getMe, updateMe, deleteMe, setPassword, getAuthorizedEmails, updateAuthorizedEmails, getBankDetails, updateBankDetails, getUsers } from '../controllers/userController/index.js';
import authenticateUser from '../middlewares/authMiddleware.js';
import requireRole from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.use(authenticateUser);

router.get('/list',                  getUsers.handler);
router.get('/me',                    getMe.validator,       getMe.handler);
router.put('/me',                    updateMe.validator,    updateMe.handler);
router.delete('/me',                 deleteMe.handler);
router.post('/set-password',         setPassword.validator, setPassword.handler);

// Bank details for withdrawal
router.get('/me/bank-details',       getBankDetails.validator,    getBankDetails.handler);
router.put('/me/bank-details',       updateBankDetails.validator, updateBankDetails.handler);

// Admin-only: manage 2FA authorized emails
router.get('/me/authorized-emails',  requireRole('admin'), getAuthorizedEmails.handler);
router.put('/me/authorized-emails',  requireRole('admin'), updateAuthorizedEmails.handler);

export default router;
