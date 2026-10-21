import CodingProblem from '../models/CodingProblem.js';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

// @desc    Get all coding problems grouped by topic with optional solved status for auth user
// @route   GET /api/coding-problems
// @access  Public / Private
export const getCodingProblems = async (req, res, next) => {
  try {
    const { topic, difficulty, search } = req.query;

    const query = {};

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
        { companies: { $regex: search, $options: 'i' } },
      ];
    }

    const problems = await CodingProblem.find(query).sort({ order: 1, createdAt: 1 });

    // Optional user token check to mark solved
    let solvedSet = new Set();
    let authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.split(' ')[1];
        const secret = process.env.JWT_SECRET || 'dev_jwt_secret_placement_portal_2026_dev_key';
        const decoded = jwt.verify(token, secret);
        const user = await User.findById(decoded.id);
        if (user && user.solvedProblems) {
          user.solvedProblems.forEach((pId) => solvedSet.add(pId.toString()));
        }
      } catch (e) {
        // Continue unauthenticated
      }
    }

    const formattedProblems = problems.map((p) => ({
      _id: p._id,
      title: p.title,
      topic: p.topic,
      difficulty: p.difficulty,
      companies: p.companies,
      description: p.description,
      problemUrl: p.problemUrl,
      solutionHint: p.solutionHint,
      order: p.order,
      isSolved: solvedSet.has(p._id.toString()),
    }));

    const distinctTopics = await CodingProblem.distinct('topic');

    res.status(200).json({
      success: true,
      count: formattedProblems.length,
      topics: distinctTopics,
      problems: formattedProblems,
      totalSolved: solvedSet.size,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create coding problem (Admin)
// @route   POST /api/coding-problems
// @access  Private/Admin
export const createCodingProblem = async (req, res, next) => {
  try {
    const { title, topic, difficulty, companies, description, problemUrl, solutionHint, order } = req.body;

    if (!title || !topic || !problemUrl) {
      return res.status(400).json({
        success: false,
        message: 'Title, topic, and problem URL are required.',
      });
    }

    const problem = await CodingProblem.create({
      title,
      topic,
      difficulty: difficulty || 'Medium',
      companies: companies || ['Google', 'Amazon', 'Microsoft'],
      description: description || '',
      problemUrl,
      solutionHint: solutionHint || '',
      order: order || 0,
    });

    res.status(201).json({
      success: true,
      message: 'Coding problem added successfully',
      problem,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete coding problem (Admin)
// @route   DELETE /api/coding-problems/:id
// @access  Private/Admin
export const deleteCodingProblem = async (req, res, next) => {
  try {
    const problem = await CodingProblem.findByIdAndDelete(req.params.id);

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: 'Problem not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Coding problem deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
