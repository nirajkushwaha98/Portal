import TestAttempt from '../models/TestAttempt.js';
import MockTest from '../models/MockTest.js';
import Question from '../models/Question.js';

// @desc    Submit mock test answers and generate scorecard
// @route   POST /api/test-attempts/submit
// @access  Private
export const submitTest = async (req, res, next) => {
  try {
    const { mockTestId, answers, timeTakenSeconds } = req.body;

    if (!mockTestId || !answers || !Array.isArray(answers)) {
      return res.status(400).json({
        success: false,
        message: 'Valid test ID and answers array are required.',
      });
    }

    const test = await MockTest.findById(mockTestId).populate('questions');
    if (!test) {
      return res.status(404).json({
        success: false,
        message: 'Mock test not found.',
      });
    }

    // Map answers by question ID
    const answerMap = new Map();
    answers.forEach((ans) => {
      const qId = ans.questionId || ans.question;
      answerMap.set(qId?.toString(), {
        selectedOption: ans.selectedOption || null,
        timeSpentSeconds: ans.timeSpentSeconds || 0,
      });
    });

    let correctCount = 0;
    const evaluatedAnswers = [];
    const categoryStats = {};

    const validQuestions = (test.questions || []).filter(Boolean);

    validQuestions.forEach((q) => {
      const qIdStr = q._id.toString();
      const studentAns = answerMap.get(qIdStr);
      const selectedOption = studentAns ? studentAns.selectedOption : null;
      const timeSpentSeconds = studentAns ? studentAns.timeSpentSeconds : 0;
      const isCorrect = selectedOption === q.correctOption;

      if (isCorrect) {
        correctCount += 1;
      }

      evaluatedAnswers.push({
        question: q._id,
        selectedOption,
        isCorrect,
        timeSpentSeconds,
      });

      // Category breakdown
      const cat = q.category || 'General';
      if (!categoryStats[cat]) {
        categoryStats[cat] = { total: 0, correct: 0 };
      }
      categoryStats[cat].total += 1;
      if (isCorrect) {
        categoryStats[cat].correct += 1;
      }
    });

    const totalQuestions = validQuestions.length || 1;
    const totalMarks = test.totalMarks || 100;
    const score = Math.round((correctCount / totalQuestions) * totalMarks);
    const percentage = Math.round((correctCount / totalQuestions) * 100);
    const passed = percentage >= (test.passingMarks || 60);

    const categoryBreakdown = Object.keys(categoryStats).map((cat) => ({
      category: cat,
      total: categoryStats[cat].total,
      correct: categoryStats[cat].correct,
      accuracy: Math.round((categoryStats[cat].correct / categoryStats[cat].total) * 100),
    }));

    const attempt = await TestAttempt.create({
      user: req.user._id,
      mockTest: test._id,
      answers: evaluatedAnswers,
      score,
      totalMarks,
      percentage,
      passed,
      timeTakenSeconds: timeTakenSeconds || 0,
      status: 'completed',
      categoryBreakdown,
    });

    // Populate question details for instant feedback
    const populatedAttempt = await TestAttempt.findById(attempt._id)
      .populate('mockTest', 'title category durationMinutes totalMarks passingMarks')
      .populate({
        path: 'answers.question',
        select: 'title category topic difficulty options correctOption explanation formulaTip',
      });

    res.status(201).json({
      success: true,
      message: 'Test submitted successfully!',
      attempt: populatedAttempt,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user's past attempts
// @route   GET /api/test-attempts/my-attempts
// @access  Private
export const getMyAttempts = async (req, res, next) => {
  try {
    const attempts = await TestAttempt.find({ user: req.user._id })
      .populate('mockTest', 'title category durationMinutes totalMarks passingMarks difficulty')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: attempts.length,
      attempts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get detailed test attempt result by ID
// @route   GET /api/test-attempts/:id
// @access  Private
export const getAttemptById = async (req, res, next) => {
  try {
    const attempt = await TestAttempt.findById(req.params.id)
      .populate('mockTest', 'title category durationMinutes totalMarks passingMarks instructions')
      .populate({
        path: 'answers.question',
        select: 'title category topic difficulty options correctOption explanation formulaTip',
      });

    if (!attempt) {
      return res.status(404).json({
        success: false,
        message: 'Test attempt not found.',
      });
    }

    // Verify ownership unless admin
    if (
      attempt.user.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this test attempt.',
      });
    }

    res.status(200).json({
      success: true,
      attempt,
    });
  } catch (error) {
    next(error);
  }
};
