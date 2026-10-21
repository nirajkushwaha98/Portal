import mongoose from 'mongoose';

const jobApplicationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
    },
    status: {
      type: String,
      enum: ['Applied', 'Shortlisted', 'Interviewing', 'Offered', 'Rejected'],
      default: 'Applied',
    },
    resumeUrl: {
      type: String,
      default: '',
    },
    portfolioUrl: {
      type: String,
      default: '',
    },
    coverNote: {
      type: String,
      default: '',
    },
    studentNotes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate applications for same user + job
jobApplicationSchema.index({ user: 1, job: 1 }, { unique: true });

const JobApplication = mongoose.model('JobApplication', jobApplicationSchema);
export default JobApplication;
