import User from '../models/User.js';
import Question from '../models/Question.js';
import MockTest from '../models/MockTest.js';
import TestAttempt from '../models/TestAttempt.js';
import Job from '../models/Job.js';
import JobApplication from '../models/JobApplication.js';

// @desc    Get aggregate platform analytics for admin dashboard
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getAdminStats = async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalStudents,
      totalAdmins,
      totalQuestions,
      totalTests,
      totalAttempts,
      totalJobs,
      activeJobs,
      totalApplications,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'student' }),
      User.countDocuments({ role: 'admin' }),
      Question.countDocuments(),
      MockTest.countDocuments(),
      TestAttempt.countDocuments(),
      Job.countDocuments(),
      Job.countDocuments({ status: 'Active' }),
      JobApplication.countDocuments(),
    ]);

    // Recent 5 test attempts across all students
    const recentAttempts = await TestAttempt.find()
      .populate('user', 'name email college branch')
      .populate('mockTest', 'title category')
      .sort({ createdAt: -1 })
      .limit(5);

    // Recent 5 job applications
    const recentApplications = await JobApplication.find()
      .populate('user', 'name email college branch')
      .populate('job', 'title company location')
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalStudents,
        totalAdmins,
        totalQuestions,
        totalTests,
        totalAttempts,
        totalJobs,
        activeJobs,
        totalApplications,
      },
      recentAttempts,
      recentApplications,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users with search and role filter
// @route   GET /api/admin/users
// @access  Private/Admin
export const getAllUsers = async (req, res, next) => {
  try {
    const { role, search, page = 1, limit = 20 } = req.query;

    const query = {};

    if (role && role !== 'All') {
      query.role = role;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { college: { $regex: search, $options: 'i' } },
        { branch: { $regex: search, $options: 'i' } },
      ];
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      totalPages: Math.ceil(total / limitNum) || 1,
      currentPage: pageNum,
      users,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user role (promote to admin or demote to student)
// @route   PUT /api/admin/users/:id/role
// @access  Private/Admin
export const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;

    if (!['student', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Must be either student or admin.',
      });
    }

    if (req.user._id.toString() === req.params.id && role !== 'admin') {
      return res.status(400).json({
        success: false,
        message: 'You cannot revoke your own admin privileges.',
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      message: `User role updated to ${role}`,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res, next) => {
  try {
    // Prevent admin from deleting themselves
    if (req.user._id.toString() === req.params.id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own admin account.',
      });
    }

    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Clean up attempts and applications
    await TestAttempt.deleteMany({ user: req.params.id });
    await JobApplication.deleteMany({ user: req.params.id });

    res.status(200).json({
      success: true,
      message: 'User and associated records removed successfully',
    });
  } catch (error) {
    next(error);
  }
};
