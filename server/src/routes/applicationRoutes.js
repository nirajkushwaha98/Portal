import express from 'express';
import {
  applyJob,
  getMyApplications,
  updateStudentNotes,
  getJobApplicants,
  updateApplicantStatus,
} from '../controllers/applicationController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/authorize.js';

const router = express.Router();

router.use(protect); // All application routes require authentication

// Student routes
router.post('/apply/:jobId', applyJob);
router.get('/my-applications', getMyApplications);
router.put('/:id/notes', updateStudentNotes);

// Admin routes
router.get('/admin/job/:jobId', authorize('admin'), getJobApplicants);
router.put('/admin/:id/status', authorize('admin'), updateApplicantStatus);

export default router;
