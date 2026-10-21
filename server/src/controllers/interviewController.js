import InterviewQuestion from '../models/InterviewQuestion.js';

// @desc    Get all interview questions with search and company filter
// @route   GET /api/interview-questions
// @access  Public / Private
export const getInterviewQuestions = async (req, res, next) => {
  try {
    const { company, category, difficulty, search, page = 1, limit = 20 } = req.query;

    const query = {};

    if (company && company !== 'All') {
      query.company = { $regex: company, $options: 'i' };
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    if (difficulty && difficulty !== 'All') {
      query.difficulty = difficulty;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { question: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
      ];
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const total = await InterviewQuestion.countDocuments(query);
    const questions = await InterviewQuestion.find(query)
      .sort({ upvotes: -1, createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    // Get list of distinct companies for filter dropdown
    const distinctCompanies = await InterviewQuestion.distinct('company');

    res.status(200).json({
      success: true,
      count: questions.length,
      total,
      totalPages: Math.ceil(total / limitNum) || 1,
      currentPage: pageNum,
      distinctCompanies,
      questions,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upvote an interview question
// @route   POST /api/interview-questions/:id/upvote
// @access  Public / Private
export const upvoteQuestion = async (req, res, next) => {
  try {
    const question = await InterviewQuestion.findByIdAndUpdate(
      req.params.id,
      { $inc: { upvotes: 1 } },
      { new: true }
    );

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Interview question not found',
      });
    }

    res.status(200).json({
      success: true,
      upvotes: question.upvotes,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create interview question (Admin)
// @route   POST /api/interview-questions
// @access  Private/Admin
export const createInterviewQuestion = async (req, res, next) => {
  try {
    const { title, company, category, difficulty, question, answer, keyTips, tags, frequency } = req.body;

    if (!title || !company || !question || !answer) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, company, question text, and model answer.',
      });
    }

    const item = await InterviewQuestion.create({
      title,
      company,
      category: category || 'Technical',
      difficulty: difficulty || 'Medium',
      question,
      answer,
      keyTips: keyTips || [],
      tags: tags || [],
      frequency: frequency || 'High',
    });

    res.status(201).json({
      success: true,
      message: 'Interview question added successfully',
      question: item,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete interview question (Admin)
// @route   DELETE /api/interview-questions/:id
// @access  Private/Admin
export const deleteInterviewQuestion = async (req, res, next) => {
  try {
    const item = await InterviewQuestion.findByIdAndDelete(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Question not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Interview question deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
