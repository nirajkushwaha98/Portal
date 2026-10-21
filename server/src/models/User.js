import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    role: {
      type: String,
      enum: ['student', 'admin'],
      default: 'student',
    },
    college: {
      type: String,
      trim: true,
      default: 'National Institute of Technology',
    },
    branch: {
      type: String,
      trim: true,
      default: 'Computer Science and Engineering',
    },
    graduationYear: {
      type: Number,
      default: 2026,
    },
    cgpa: {
      type: Number,
      min: 0,
      max: 10,
      default: 8.5,
    },
    skills: {
      type: [String],
      default: ['Data Structures & Algorithms', 'C++', 'Java', 'Python', 'React', 'Node.js', 'SQL'],
    },
    targetCompanies: {
      type: [String],
      default: ['Google', 'Microsoft', 'Amazon', 'Atlassian', 'TCS Digital', 'Infosys'],
    },
    resumeUrl: {
      type: String,
      trim: true,
      default: 'https://example.com/resumes/demo-resume.pdf',
    },
    githubUrl: {
      type: String,
      trim: true,
      default: 'https://github.com/placement-aspirant',
    },
    linkedinUrl: {
      type: String,
      trim: true,
      default: 'https://linkedin.com/in/placement-aspirant',
    },
    bio: {
      type: String,
      maxlength: 500,
      default: 'Final-year student preparing aggressively for software engineering and technical product roles in campus placements.',
    },
    solvedProblems: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CodingProblem',
      },
    ],
    savedJobs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
      },
    ],
    bookmarkedQuestions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'InterviewQuestion',
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Remove sensitive info on JSON transform
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

const User = mongoose.model('User', userSchema);
export default User;
