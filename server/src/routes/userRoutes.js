import express from 'express';
import {
  getProfile,
  updateProfile,
  toggleProblemSolved,
  toggleSaveJob,
  getDashboardStats,
} from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect); // All user routes require authentication

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.get('/dashboard-stats', getDashboardStats);
router.post('/toggle-problem/:problemId', toggleProblemSolved);
router.post('/toggle-save-job/:jobId', toggleSaveJob);

export default router;
