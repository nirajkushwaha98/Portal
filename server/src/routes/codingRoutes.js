import express from 'express';
import {
  getCodingProblems,
  createCodingProblem,
  deleteCodingProblem,
} from '../controllers/codingController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/authorize.js';

const router = express.Router();

router.get('/', getCodingProblems);

// Admin-only management
router.post('/', protect, authorize('admin'), createCodingProblem);
router.delete('/:id', protect, authorize('admin'), deleteCodingProblem);

export default router;
