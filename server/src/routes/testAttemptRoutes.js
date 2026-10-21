import express from 'express';
import {
  submitTest,
  getMyAttempts,
  getAttemptById,
} from '../controllers/testAttemptController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect); // All test attempt routes require authentication

router.post('/submit', submitTest);
router.get('/my-attempts', getMyAttempts);
router.get('/:id', getAttemptById);

export default router;
