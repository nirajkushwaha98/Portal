import Question from '../models/Question.js';

// @desc    Get all questions with optional category, difficulty, search filter
// @route   GET /api/questions
// @access  Public / Private
export const getQuestions = async (req, res, next) => {
  try {
    const { category, topic, difficulty, search, page = 1, limit = 20 } = req.query;

    const query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (topic && topic !== 'All') {
      query.topic = topic;
    }

    if (difficulty && difficulty !== 'All') {
      query.difficulty = difficulty;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { topic: { $regex: search, $options: 'i' } },
      ];
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const total = await Question.countDocuments(query);
    const questions = await Question.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      count: questions.length,
      total,
      totalPages: Math.ceil(total / limitNum) || 1,
      currentPage: pageNum,
      questions,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get question category summaries & topics
// @route   GET /api/questions/categories
// @access  Public
export const getCategories = async (req, res, next) => {
  try {
    const categories = await Question.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          topics: { $addToSet: '$topic' },
        },
      },
      {
        $project: {
          category: '$_id',
          count: 1,
          topics: 1,
          _id: 0,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      categories,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single question by ID
// @route   GET /api/questions/:id
// @access  Public / Private
export const getQuestionById = async (req, res, next) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found',
      });
    }

    res.status(200).json({
      success: true,
      question,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new question (Admin)
// @route   POST /api/questions
// @access  Private/Admin
export const createQuestion = async (req, res, next) => {
  try {
    const { title, category, topic, difficulty, options, correctOption, explanation, formulaTip } = req.body;

    if (!title || !category || !topic || !options || !correctOption || !explanation) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required question fields.',
      });
    }

    const question = await Question.create({
      title,
      category,
      topic,
      difficulty: difficulty || 'Medium',
      options,
      correctOption,
      explanation,
      formulaTip: formulaTip || '',
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: 'Question created successfully',
      question,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update question (Admin)
// @route   PUT /api/questions/:id
// @access  Private/Admin
export const updateQuestion = async (req, res, next) => {
  try {
    const question = await Question.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Question updated successfully',
      question,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete question (Admin)
// @route   DELETE /api/questions/:id
// @access  Private/Admin
export const deleteQuestion = async (req, res, next) => {
  try {
    const question = await Question.findByIdAndDelete(req.params.id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Question deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
