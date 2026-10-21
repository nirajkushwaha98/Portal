import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    logo: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      enum: ['Full-time', 'Internship', 'Contract'],
      default: 'Full-time',
    },
    location: {
      type: String,
      required: [true, 'Job location is required'],
      trim: true,
    },
    salaryOrStipend: {
      type: String,
      required: [true, 'Salary or stipend details are required'],
      trim: true,
    },
    experience: {
      type: String,
      default: 'Freshers (2025/2026 Batch)',
    },
    batch: {
      type: String,
      default: '2025, 2026',
    },
    description: {
      type: String,
      required: [true, 'Job description is required'],
    },
    requirements: {
      type: [String],
      default: [],
    },
    responsibilities: {
      type: [String],
      default: [],
    },
    skillsRequired: {
      type: [String],
      default: [],
    },
    eligibilityCriteria: {
      type: String,
      default: 'B.Tech / B.E. / M.C.A. with minimum 7.0 CGPA and no active backlogs',
    },
    applicationDeadline: {
      type: Date,
    },
    applyUrl: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['Active', 'Closed'],
      default: 'Active',
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

const Job = mongoose.model('Job', jobSchema);
export default Job;
