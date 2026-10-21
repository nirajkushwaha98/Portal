import User from '../models/User.js';
import TestAttempt from '../models/TestAttempt.js';
import JobApplication from '../models/JobApplication.js';
import CodingProblem from '../models/CodingProblem.js';

// @desc    Get current user profile
// @route   GET /api/users/profile
// @access  Private
export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('savedJobs')
      .populate('solvedProblems');

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update current user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateProfile = async (req, res, next) => {
  try {
    const allowedFields = [
      'name',
      'college',
      'branch',
      'graduationYear',
      'cgpa',
      'skills',
      'targetCompanies',
      'resumeUrl',
      'githubUrl',
      'linkedinUrl',
      'bio',
    ];

    const updates = {};
    for (const key of allowedFields) {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    }

    const updatedUser = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    })
      .populate('savedJobs')
      .populate('solvedProblems');

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle solve status of a coding problem
// @route   POST /api/users/toggle-problem/:problemId
// @access  Private
export const toggleProblemSolved = async (req, res, next) => {
  try {
    const { problemId } = req.params;
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (!Array.isArray(user.solvedProblems)) {
      user.solvedProblems = [];
    }

    const isSolved = user.solvedProblems.some(
      (id) => id.toString() === problemId.toString()
    );

    if (isSolved) {
      user.solvedProblems = user.solvedProblems.filter(
        (id) => id.toString() !== problemId.toString()
      );
    } else {
      user.solvedProblems.push(problemId);
    }

    await user.save();

    res.status(200).json({
      success: true,
      isSolved: !isSolved,
      solvedCount: user.solvedProblems.length,
      solvedProblems: user.solvedProblems,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle save/unsave a job
// @route   POST /api/users/toggle-save-job/:jobId
// @access  Private
export const toggleSaveJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (!Array.isArray(user.savedJobs)) {
      user.savedJobs = [];
    }

    const isSaved = user.savedJobs.some(
      (id) => id.toString() === jobId.toString()
    );

    if (isSaved) {
      user.savedJobs = user.savedJobs.filter(
        (id) => id.toString() !== jobId.toString()
      );
    } else {
      user.savedJobs.push(jobId);
    }

    await user.save();

    res.status(200).json({
      success: true,
      isSaved: !isSaved,
      savedJobs: user.savedJobs,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard metrics for logged in student
// @route   GET /api/users/dashboard-stats
// @access  Private
export const getDashboardStats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Fetch user with solved problems and saved jobs
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Fetch all test attempts
    const attempts = await TestAttempt.find({ user: userId })
      .populate('mockTest', 'title category durationMinutes totalMarks')
      .sort({ createdAt: -1 });

    const totalTestsTaken = attempts.length;
    const avgScore = totalTestsTaken > 0
      ? Math.round(attempts.reduce((acc, curr) => acc + curr.percentage, 0) / totalTestsTaken)
      : 0;

    // Fetch job applications
    const applications = await JobApplication.find({ user: userId })
      .populate('job', 'title company location type salaryOrStipend')
      .sort({ createdAt: -1 });

    const totalApplications = applications.length;

    // Total coding problems available
    const totalCodingProblems = await CodingProblem.countDocuments();
    const solvedCodingProblems = user.solvedProblems ? user.solvedProblems.length : 0;

    // Recent test attempts (last 5)
    const recentAttempts = attempts.slice(0, 5);

    // Performance trend by attempt
    const performanceTrend = attempts.slice(0, 7).reverse().map((att, idx) => ({
      testName: att.mockTest?.title || `Test #${idx + 1}`,
      percentage: att.percentage,
      passed: att.passed,
      date: new Date(att.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    }));

    res.status(200).json({
      success: true,
      stats: {
        totalTestsTaken,
        avgScore,
        totalApplications,
        solvedCodingProblems,
        totalCodingProblems,
        savedJobsCount: user.savedJobs ? user.savedJobs.length : 0,
      },
      recentAttempts,
      recentApplications: applications.slice(0, 5),
      performanceTrend,
    });
  } catch (error) {
    next(error);
  }
};
