import mongoose from 'mongoose';

const interviewQuestionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    company: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ['Technical', 'HR / Behavioral', 'System Design', 'DBMS & SQL', 'Computer Networks & OS'],
      default: 'Technical',
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Medium',
    },
    question: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
    keyTips: {
      type: [String],
      default: [],
    },
    tags: {
      type: [String],
      default: [],
    },
    frequency: {
      type: String,
      enum: ['Very High', 'High', 'Medium'],
      default: 'High',
    },
    upvotes: {
      type: Number,
      default: 12,
    },
  },
  {
    timestamps: true,
  }
);

const InterviewQuestion = mongoose.model('InterviewQuestion', interviewQuestionSchema);
export default InterviewQuestion;
