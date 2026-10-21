import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { connectDB, disconnectDB } from '../config/db.js';
import User from '../models/User.js';
import Question from '../models/Question.js';
import MockTest from '../models/MockTest.js';
import TestAttempt from '../models/TestAttempt.js';
import Job from '../models/Job.js';
import JobApplication from '../models/JobApplication.js';
import InterviewQuestion from '../models/InterviewQuestion.js';
import CodingProblem from '../models/CodingProblem.js';

import {
  demoUsers,
  sampleQuestions,
  sampleMockTests,
  sampleJobs,
  sampleInterviewQuestions,
  sampleCodingProblems,
} from './seedData.js';

export const seedDatabase = async () => {
  try {
    console.log('[Seed] Starting database seeding process...');

    // Clear existing collections
    await Promise.all([
      User.deleteMany(),
      Question.deleteMany(),
      MockTest.deleteMany(),
      TestAttempt.deleteMany(),
      Job.deleteMany(),
      JobApplication.deleteMany(),
      InterviewQuestion.deleteMany(),
      CodingProblem.deleteMany(),
    ]);
    console.log('[Seed] Cleared existing data collections.');

    // 1. Insert Users (pre-save hook hashes passwords)
    const createdUsers = [];
    for (const u of demoUsers) {
      const user = await User.create(u);
      createdUsers.push(user);
    }
    const studentUser = createdUsers.find((u) => u.role === 'student');
    const adminUser = createdUsers.find((u) => u.role === 'admin');
    console.log(`[Seed] Seeded ${createdUsers.length} users (Student & Admin).`);

    // 2. Insert Questions
    const questionsWithCreator = sampleQuestions.map((q) => ({
      ...q,
      createdBy: adminUser._id,
    }));
    const createdQuestions = await Question.insertMany(questionsWithCreator);
    console.log(`[Seed] Seeded ${createdQuestions.length} aptitude questions.`);

    // 3. Insert Mock Tests and link questions
    const mockTestsWithQuestions = sampleMockTests.map((test, index) => {
      // Assign questions in rotating chunks
      const testQuestions = createdQuestions.slice(index * 3, index * 3 + 6);
      return {
        ...test,
        questions: testQuestions.length > 0 ? testQuestions.map((q) => q._id) : createdQuestions.map((q) => q._id),
        createdBy: adminUser._id,
      };
    });
    const createdMockTests = await MockTest.insertMany(mockTestsWithQuestions);
    console.log(`[Seed] Seeded ${createdMockTests.length} mock tests.`);

    // 4. Insert Jobs
    const jobsWithCreator = sampleJobs.map((j) => ({
      ...j,
      postedBy: adminUser._id,
    }));
    const createdJobs = await Job.insertMany(jobsWithCreator);
    console.log(`[Seed] Seeded ${createdJobs.length} job postings.`);

    // 5. Insert Interview Questions
    const createdInterviewQs = await InterviewQuestion.insertMany(sampleInterviewQuestions);
    console.log(`[Seed] Seeded ${createdInterviewQs.length} interview questions.`);

    // 6. Insert Coding Problems
    const createdCodingProblems = await CodingProblem.insertMany(sampleCodingProblems);
    console.log(`[Seed] Seeded ${createdCodingProblems.length} coding problems.`);

    // 7. Seed initial student interactions (Saved Jobs, Solved Problems, Initial Test Attempt)
    if (studentUser && createdJobs.length > 0 && createdCodingProblems.length > 0) {
      // Student solved 2 problems and saved 2 jobs
      studentUser.solvedProblems = [createdCodingProblems[0]._id, createdCodingProblems[1]._id];
      studentUser.savedJobs = [createdJobs[0]._id, createdJobs[2]._id];
      await studentUser.save();

      // Create an initial completed test attempt for analytics preview
      if (createdMockTests.length > 0 && createdQuestions.length >= 3) {
        const testToAttempt = createdMockTests[0];
        const attemptAnswers = createdQuestions.slice(0, 4).map((q, idx) => ({
          question: q._id,
          selectedOption: idx === 0 ? q.correctOption : idx === 1 ? q.correctOption : 'C',
          isCorrect: idx < 2,
          timeSpentSeconds: 45,
        }));

        await TestAttempt.create({
          user: studentUser._id,
          mockTest: testToAttempt._id,
          answers: attemptAnswers,
          score: 75,
          totalMarks: 100,
          percentage: 75,
          passed: true,
          timeTakenSeconds: 780,
          status: 'completed',
          categoryBreakdown: [
            { category: 'Quantitative', total: 2, correct: 2, accuracy: 100 },
            { category: 'Logical Reasoning', total: 2, correct: 0, accuracy: 0 },
          ],
        });
      }

      // Create an initial job application
      await JobApplication.create({
        user: studentUser._id,
        job: createdJobs[0]._id,
        status: 'Interviewing',
        resumeUrl: studentUser.resumeUrl,
        portfolioUrl: studentUser.githubUrl,
        coverNote: 'Excited about Google campus graduate software engineering opportunities.',
        studentNotes: 'First technical interview scheduled for next Monday at 10 AM.',
      });
      console.log('[Seed] Seeded demo student initial progress and application history.');
    }

    console.log('----------------------------------------------------');
    console.log(' Database Seeding Completed Successfully! ');
    console.log(' Demo Student Credentials:');
    console.log('   Email    : student@placementportal.edu');
    console.log('   Password : Student@123');
    console.log(' Demo Admin Credentials:');
    console.log('   Email    : admin@placementportal.edu');
    console.log('   Password : Admin@123');
    console.log('----------------------------------------------------');
  } catch (error) {
    console.error('[Seed] Error during seeding:', error);
    throw error;
  }
};

// If run directly from CLI (e.g. `npm run seed`)
if (process.argv[1] && process.argv[1].endsWith('seedRunner.js')) {
  (async () => {
    try {
      await connectDB();
      await seedDatabase();
      await disconnectDB();
      process.exit(0);
    } catch (err) {
      console.error('[Seed CLI] Failed:', err);
      process.exit(1);
    }
  })();
}
