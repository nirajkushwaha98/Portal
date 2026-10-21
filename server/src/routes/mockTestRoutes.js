import express from 'express';
import {
  getMockTests,
  getMockTestById,
  createMockTest,
  updateMockTest,
  deleteMockTest,
} from '../controllers/mockTestController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/authorize.js';

const router = express.Router();

router.get('/', getMockTests);
router.get('/:id', protect, getMockTestById);

// Admin-only management
router.post('/', protect, authorize('admin'), createMockTest);
router.put('/:id', protect, authorize('admin'), updateMockTest);
router.delete('/:id', protect, authorize('admin'), deleteMockTest);

export default router;
