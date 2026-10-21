import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Question text is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Quantitative', 'Logical Reasoning', 'Verbal Ability', 'Core CS Fundamentals'],
    },
    topic: {
      type: String,
      required: [true, 'Topic is required'],
      trim: true,
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Medium',
    },
    options: [
      {
        id: { type: String, required: true }, // 'A', 'B', 'C', 'D'
        text: { type: String, required: true },
      },
    ],
    correctOption: {
      type: String,
      required: [true, 'Correct option identifier is required'],
      trim: true,
    },
    explanation: {
      type: String,
      required: [true, 'Explanation is required'],
    },
    formulaTip: {
      type: String,
      default: '',
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

const Question = mongoose.model('Question', questionSchema);
export default Question;
