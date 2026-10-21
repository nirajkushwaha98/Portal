import mongoose from 'mongoose';

const testAttemptSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    mockTest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MockTest',
      required: true,
    },
    answers: [
      {
        question: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Question',
          required: true,
        },
        selectedOption: {
          type: String,
          default: null,
        },
        isCorrect: {
          type: Boolean,
          default: false,
        },
        timeSpentSeconds: {
          type: Number,
          default: 0,
        },
      },
    ],
    score: {
      type: Number,
      required: true,
      default: 0,
    },
    totalMarks: {
      type: Number,
      required: true,
      default: 0,
    },
    percentage: {
      type: Number,
      default: 0,
    },
    passed: {
      type: Boolean,
      default: false,
    },
    timeTakenSeconds: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['in-progress', 'completed', 'timed-out'],
      default: 'completed',
    },
    categoryBreakdown: [
      {
        category: String,
        total: Number,
        correct: Number,
        accuracy: Number,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const TestAttempt = mongoose.model('TestAttempt', testAttemptSchema);
export default TestAttempt;
