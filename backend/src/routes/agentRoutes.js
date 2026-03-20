import express from 'express';
import { getWorkers, getPlacements, getCommission } from '../controllers/agentController/index.js';
import authenticateUser from '../middlewares/authMiddleware.js';
import requireRole from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.use(authenticateUser, requireRole('agent'));

router.get('/workers',    getWorkers.validator,    getWorkers.handler);
router.get('/placements', getPlacements.validator, getPlacements.handler);
router.get('/commission', getCommission.validator, getCommission.handler);

export default router;
