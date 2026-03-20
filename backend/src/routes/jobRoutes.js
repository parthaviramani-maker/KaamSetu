import express from 'express';
import { createJob, getAllJobs, getMyJobs, closeJob } from '../controllers/jobController/index.js';
import authenticateUser from '../middlewares/authMiddleware.js';
import requireRole from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.use(authenticateUser);

router.post('/', requireRole('employer'), createJob.validator, createJob.handler);
router.get('/', requireRole('worker', 'agent', 'admin'), getAllJobs.validator, getAllJobs.handler);
router.get('/my', requireRole('employer'), getMyJobs.validator, getMyJobs.handler);
router.put('/:id/close', requireRole('employer'), closeJob.validator, closeJob.handler);

export default router;
