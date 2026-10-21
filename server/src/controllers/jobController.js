import Job from '../models/Job.js';

// @desc    Get all jobs and internships with search, type, and pagination
// @route   GET /api/jobs
// @access  Public / Private
export const getJobs = async (req, res, next) => {
  try {
    const { search, type, location, status, page = 1, limit = 15 } = req.query;

    const query = {};

    // By default, non-admins only see Active jobs
    if (status) {
      query.status = status;
    } else {
      query.status = 'Active';
    }

    if (type && type !== 'All') {
      query.type = type;
    }

    if (location && location !== 'All') {
      query.location = { $regex: location, $options: 'i' };
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { skillsRequired: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const total = await Job.countDocuments(query);
    const jobs = await Job.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      count: jobs.length,
      total,
      totalPages: Math.ceil(total / limitNum) || 1,
      currentPage: pageNum,
      jobs,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single job by ID
// @route   GET /api/jobs/:id
// @access  Public / Private
export const getJobById = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    res.status(200).json({
      success: true,
      job,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new job / internship (Admin)
// @route   POST /api/jobs
// @access  Private/Admin
export const createJob = async (req, res, next) => {
  try {
    const {
      title,
      company,
      logo,
      type,
      location,
      salaryOrStipend,
      experience,
      batch,
      description,
      requirements,
      responsibilities,
      skillsRequired,
      eligibilityCriteria,
      applicationDeadline,
      applyUrl,
      status,
    } = req.body;

    if (!title || !company || !location || !salaryOrStipend || !description) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required job fields: title, company, location, salary, and description.',
      });
    }

    const job = await Job.create({
      title,
      company,
      logo: logo || '',
      type: type || 'Full-time',
      location,
      salaryOrStipend,
      experience: experience || 'Freshers (2025/2026 Batch)',
      batch: batch || '2025, 2026',
      description,
      requirements: requirements || [],
      responsibilities: responsibilities || [],
      skillsRequired: skillsRequired || [],
      eligibilityCriteria: eligibilityCriteria || 'B.Tech / B.E. / M.C.A. with minimum 7.0 CGPA',
      applicationDeadline: applicationDeadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      applyUrl: applyUrl || '',
      status: status || 'Active',
      postedBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: 'Job posted successfully!',
      job,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update job (Admin)
// @route   PUT /api/jobs/:id
// @access  Private/Admin
export const updateJob = async (req, res, next) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Job updated successfully',
      job,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete job (Admin)
// @route   DELETE /api/jobs/:id
// @access  Private/Admin
export const deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Job deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
