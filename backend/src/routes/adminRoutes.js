import express from 'express';
import { getStats, getAllUsers, getAllJobs, getAllAgents, getReports } from '../controllers/adminController/index.js';
import authenticateUser from '../middlewares/authMiddleware.js';
import requireRole from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.use(authenticateUser, requireRole('admin'));

router.get('/stats',   getStats.validator,    getStats.handler);
router.get('/users',   getAllUsers.validator,  getAllUsers.handler);
router.get('/jobs',    getAllJobs.validator,   getAllJobs.handler);
router.get('/agents',  getAllAgents.validator, getAllAgents.handler);
router.get('/reports', getReports.validator,  getReports.handler);

export default router;
