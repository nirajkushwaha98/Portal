import mongoose from 'mongoose';

const codingProblemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    topic: {
      type: String,
      required: true,
      trim: true,
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Medium',
    },
    companies: {
      type: [String],
      default: ['Amazon', 'Microsoft', 'Google'],
    },
    description: {
      type: String,
      default: '',
    },
    problemUrl: {
      type: String,
      required: true,
    },
    solutionHint: {
      type: String,
      default: '',
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const CodingProblem = mongoose.model('CodingProblem', codingProblemSchema);
export default CodingProblem;
