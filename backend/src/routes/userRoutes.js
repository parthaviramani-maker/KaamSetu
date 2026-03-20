import express from 'express';
import { getMe, updateMe, deleteMe } from '../controllers/userController/index.js';
import authenticateUser from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(authenticateUser);

router.get('/me',    getMe.validator,    getMe.handler);
router.put('/me',    updateMe.validator, updateMe.handler);
router.delete('/me', deleteMe.handler);

export default router;
