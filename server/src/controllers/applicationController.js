import JobApplication from '../models/JobApplication.js';
import Job from '../models/Job.js';

// @desc    Apply for a job or internship
// @route   POST /api/applications/apply/:jobId
// @access  Private (Student)
export const applyJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const { resumeUrl, portfolioUrl, coverNote } = req.body;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job posting not found.',
      });
    }

    if (job.status !== 'Active') {
      return res.status(400).json({
        success: false,
        message: 'This job posting is no longer accepting applications.',
      });
    }

    // Check if already applied
    const existing = await JobApplication.findOne({
      user: req.user._id,
      job: jobId,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied to this position.',
      });
    }

    const application = await JobApplication.create({
      user: req.user._id,
      job: jobId,
      resumeUrl: resumeUrl || req.user.resumeUrl || '',
      portfolioUrl: portfolioUrl || req.user.githubUrl || '',
      coverNote: coverNote || '',
      status: 'Applied',
    });

    const populatedApp = await JobApplication.findById(application._id).populate('job');

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully!',
      application: populatedApp,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in student's job applications
// @route   GET /api/applications/my-applications
// @access  Private
export const getMyApplications = async (req, res, next) => {
  try {
    const applications = await JobApplication.find({ user: req.user._id })
      .populate('job')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update student personal notes on an application
// @route   PUT /api/applications/:id/notes
// @access  Private
export const updateStudentNotes = async (req, res, next) => {
  try {
    const { studentNotes } = req.body;
    const application = await JobApplication.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    application.studentNotes = studentNotes || '';
    await application.save();

    res.status(200).json({
      success: true,
      message: 'Notes updated successfully',
      application,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all applicants for a specific job (Admin)
// @route   GET /api/applications/admin/job/:jobId
// @access  Private/Admin
export const getJobApplicants = async (req, res, next) => {
  try {
    const applications = await JobApplication.find({ job: req.params.jobId })
      .populate('user', 'name email college branch graduationYear cgpa skills resumeUrl linkedinUrl githubUrl')
      .populate('job', 'title company location type')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update applicant status (Admin)
// @route   PUT /api/applications/admin/:id/status
// @access  Private/Admin
export const updateApplicantStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const validStatuses = ['Applied', 'Shortlisted', 'Interviewing', 'Offered', 'Rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const application = await JobApplication.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )
      .populate('user', 'name email college branch graduationYear cgpa')
      .populate('job', 'title company');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    res.status(200).json({
      success: true,
      message: `Applicant status updated to '${status}'`,
      application,
    });
  } catch (error) {
    next(error);
  }
};
