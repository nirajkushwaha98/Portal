import mongoose from 'mongoose';

const mockTestSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Mock test title is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    durationMinutes: {
      type: Number,
      required: [true, 'Duration in minutes is required'],
      min: [5, 'Duration must be at least 5 minutes'],
      max: [180, 'Duration cannot exceed 180 minutes'],
    },
    totalMarks: {
      type: Number,
      default: 100,
    },
    passingMarks: {
      type: Number,
      default: 60,
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Medium',
    },
    questions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
      },
    ],
    instructions: {
      type: [String],
      default: [
        'The timer will start as soon as you begin the test.',
        'Each question has equal weightage.',
        'No negative marking unless specified.',
        'You can flag questions to review them later using the Question Palette.',
        'The test will automatically submit when the countdown expires.',
      ],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

const MockTest = mongoose.model('MockTest', mockTestSchema);
export default MockTest;
