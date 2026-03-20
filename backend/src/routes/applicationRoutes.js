import express from 'express';
import { apply, getMyApplications, getJobApplicants, updateStatus } from '../controllers/applicationController/index.js';
import authenticateUser from '../middlewares/authMiddleware.js';
import requireRole from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.use(authenticateUser);

router.post('/',               requireRole('worker'),   apply.validator,             apply.handler);
router.get('/my',              requireRole('worker'),   getMyApplications.validator, getMyApplications.handler);
router.get('/job/:jobId',      requireRole('employer'), getJobApplicants.validator,  getJobApplicants.handler);
router.put('/:id/status',      requireRole('employer'), updateStatus.validator,      updateStatus.handler);

export default router;
