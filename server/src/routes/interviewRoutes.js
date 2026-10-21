import express from 'express';
import {
  getInterviewQuestions,
  upvoteQuestion,
  createInterviewQuestion,
  deleteInterviewQuestion,
} from '../controllers/interviewController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/authorize.js';

const router = express.Router();

router.get('/', getInterviewQuestions);
router.post('/:id/upvote', upvoteQuestion);

// Admin-only management
router.post('/', protect, authorize('admin'), createInterviewQuestion);
router.delete('/:id', protect, authorize('admin'), deleteInterviewQuestion);

export default router;
