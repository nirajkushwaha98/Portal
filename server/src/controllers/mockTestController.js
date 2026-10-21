import MockTest from '../models/MockTest.js';
import Question from '../models/Question.js';

// @desc    Get all active mock tests
// @route   GET /api/mock-tests
// @access  Public / Private
export const getMockTests = async (req, res, next) => {
  try {
    const tests = await MockTest.find({ isActive: true })
      .populate('questions', 'category topic difficulty')
      .sort({ createdAt: -1 });

    // Format tests with question count summary
    const formattedTests = tests.map((test) => {
      const qCount = test.questions ? test.questions.length : 0;
      return {
        _id: test._id,
        title: test.title,
        description: test.description,
        category: test.category,
        durationMinutes: test.durationMinutes,
        totalMarks: test.totalMarks,
        passingMarks: test.passingMarks,
        difficulty: test.difficulty,
        instructions: test.instructions,
        questionCount: qCount,
        createdAt: test.createdAt,
      };
    });

    res.status(200).json({
      success: true,
      count: formattedTests.length,
      tests: formattedTests,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single mock test for taking test (secure: hides correct answers from response)
// @route   GET /api/mock-tests/:id
// @access  Private
export const getMockTestById = async (req, res, next) => {
  try {
    const test = await MockTest.findById(req.params.id).populate('questions');

    if (!test) {
      return res.status(404).json({
        success: false,
        message: 'Mock test not found',
      });
    }

    const isAdmin = req.user && req.user.role === 'admin';

    // If student, sanitize questions so correctOption and explanation are not leaked in network payload
    const sanitizedQuestions = test.questions.map((q) => {
      const base = {
        _id: q._id,
        title: q.title,
        category: q.category,
        topic: q.topic,
        difficulty: q.difficulty,
        options: q.options,
      };

      if (isAdmin) {
        base.correctOption = q.correctOption;
        base.explanation = q.explanation;
        base.formulaTip = q.formulaTip;
      }

      return base;
    });

    res.status(200).json({
      success: true,
      test: {
        _id: test._id,
        title: test.title,
        description: test.description,
        category: test.category,
        durationMinutes: test.durationMinutes,
        totalMarks: test.totalMarks,
        passingMarks: test.passingMarks,
        difficulty: test.difficulty,
        instructions: test.instructions,
        questions: sanitizedQuestions,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new mock test (Admin)
// @route   POST /api/mock-tests
// @access  Private/Admin
export const createMockTest = async (req, res, next) => {
  try {
    const {
      title,
      description,
      category,
      durationMinutes,
      totalMarks,
      passingMarks,
      difficulty,
      questions,
      instructions,
    } = req.body;

    if (!title || !category || !durationMinutes) {
      return res.status(400).json({
        success: false,
        message: 'Please provide test title, category, and duration.',
      });
    }

    const test = await MockTest.create({
      title,
      description: description || '',
      category,
      durationMinutes,
      totalMarks: totalMarks || 100,
      passingMarks: passingMarks || 60,
      difficulty: difficulty || 'Medium',
      questions: questions || [],
      instructions: instructions || [
        'The timer will start as soon as you begin the test.',
        'Each question carries equal marks.',
        'Review flagged questions before submitting.',
      ],
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: 'Mock test created successfully',
      test,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update mock test (Admin)
// @route   PUT /api/mock-tests/:id
// @access  Private/Admin
export const updateMockTest = async (req, res, next) => {
  try {
    const test = await MockTest.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!test) {
      return res.status(404).json({
        success: false,
        message: 'Mock test not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Mock test updated successfully',
      test,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete mock test (Admin)
// @route   DELETE /api/mock-tests/:id
// @access  Private/Admin
export const deleteMockTest = async (req, res, next) => {
  try {
    const test = await MockTest.findByIdAndDelete(req.params.id);

    if (!test) {
      return res.status(404).json({
        success: false,
        message: 'Mock test not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Mock test deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
