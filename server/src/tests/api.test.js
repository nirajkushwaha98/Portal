import { test, before, after, describe } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../app.js';
import { connectDB, disconnectDB } from '../config/db.js';
import { seedDatabase } from '../seed/seedRunner.js';

describe('Placement Portal Backend API Test Suite', () => {
  let studentToken = '';
  let adminToken = '';
  let sampleQuestionId = '';
  let sampleTestId = '';
  let sampleJobId = '';

  before(async () => {
    process.env.NODE_ENV = 'test';
    await connectDB();
    await seedDatabase();
  });

  after(async () => {
    await disconnectDB();
  });

  test('GET /api/health should return 200 and operational status', async () => {
    const res = await request(app).get('/api/health');
    assert.equal(res.status, 200);
    assert.equal(res.body.status, 'ok');
    assert.equal(typeof res.body.uptimeSeconds, 'number');
  });

  test('POST /api/auth/login with invalid credentials should return 401', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'student@placementportal.edu', password: 'WrongPassword' });

    assert.equal(res.status, 401);
    assert.equal(res.body.success, false);
  });

  test('POST /api/auth/login for Demo Student should succeed and return JWT', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'student@placementportal.edu', password: 'Student@123' });

    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.ok(res.body.token);
    assert.equal(res.body.user.role, 'student');
    studentToken = res.body.token;
  });

  test('POST /api/auth/login for Demo Admin should succeed and return JWT', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@placementportal.edu', password: 'Admin@123' });

    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.ok(res.body.token);
    assert.equal(res.body.user.role, 'admin');
    adminToken = res.body.token;
  });

  test('GET /api/auth/me without token should return 401', async () => {
    const res = await request(app).get('/api/auth/me');
    assert.equal(res.status, 401);
  });

  test('GET /api/auth/me with valid student token should return profile', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${studentToken}`);

    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.equal(res.body.user.email, 'student@placementportal.edu');
  });

  test('GET /api/questions should return question list with categories', async () => {
    const res = await request(app).get('/api/questions');
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.ok(res.body.questions.length > 0);
    sampleQuestionId = res.body.questions[0]._id;
  });

  test('POST /api/questions by student should be forbidden (403)', async () => {
    const res = await request(app)
      .post('/api/questions')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({
        title: 'Unauthorized Question',
        category: 'Quantitative',
        topic: 'Algebra',
        options: [{ id: 'A', text: '1' }, { id: 'B', text: '2' }],
        correctOption: 'A',
        explanation: 'Test',
      });

    assert.equal(res.status, 403);
  });

  test('POST /api/questions by admin should create a new question (201)', async () => {
    const res = await request(app)
      .post('/api/questions')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'What is 15% of 240?',
        category: 'Quantitative',
        topic: 'Percentages',
        difficulty: 'Easy',
        options: [
          { id: 'A', text: '36' },
          { id: 'B', text: '32' },
          { id: 'C', text: '40' },
          { id: 'D', text: '42' },
        ],
        correctOption: 'A',
        explanation: '10% of 240 is 24, 5% is 12. 24 + 12 = 36.',
        formulaTip: '15% = 10% + 5%',
      });

    assert.equal(res.status, 201);
    assert.equal(res.body.success, true);
    assert.equal(res.body.question.title, 'What is 15% of 240?');
  });

  test('GET /api/mock-tests should return mock tests', async () => {
    const res = await request(app).get('/api/mock-tests');
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.ok(res.body.tests.length > 0);
    sampleTestId = res.body.tests[0]._id;
  });

  test('GET /api/mock-tests/:id as student should sanitize questions (no correct answers in payload)', async () => {
    const res = await request(app)
      .get(`/api/mock-tests/${sampleTestId}`)
      .set('Authorization', `Bearer ${studentToken}`);

    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.ok(res.body.test.questions.length > 0);
    // Ensure correctOption and explanation are not present for student
    assert.equal(res.body.test.questions[0].correctOption, undefined);
    assert.equal(res.body.test.questions[0].explanation, undefined);
  });

  test('POST /api/test-attempts/submit should evaluate and return score card', async () => {
    const testDetails = await request(app)
      .get(`/api/mock-tests/${sampleTestId}`)
      .set('Authorization', `Bearer ${studentToken}`);

    const q = testDetails.body.test.questions[0];

    const res = await request(app)
      .post('/api/test-attempts/submit')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({
        mockTestId: sampleTestId,
        answers: [{ questionId: q._id, selectedOption: 'A', timeSpentSeconds: 30 }],
        timeTakenSeconds: 30,
      });

    assert.equal(res.status, 201);
    assert.equal(res.body.success, true);
    assert.ok(res.body.attempt);
    assert.equal(typeof res.body.attempt.score, 'number');
    assert.ok(Array.isArray(res.body.attempt.categoryBreakdown));
  });

  test('GET /api/jobs should return list of active jobs', async () => {
    const res = await request(app).get('/api/jobs');
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.ok(res.body.jobs.length > 0);
    sampleJobId = res.body.jobs[0]._id;
  });

  test('POST /api/applications/apply/:jobId should allow student to apply', async () => {
    // Pick the second job to avoid conflict with initial seeded application
    const jobsRes = await request(app).get('/api/jobs');
    const targetJob = jobsRes.body.jobs[1];

    const res = await request(app)
      .post(`/api/applications/apply/${targetJob._id}`)
      .set('Authorization', `Bearer ${studentToken}`)
      .send({
        coverNote: 'Very interested in this role.',
      });

    assert.equal(res.status, 201);
    assert.equal(res.body.success, true);
    assert.equal(res.body.application.status, 'Applied');
  });

  test('GET /api/admin/stats as Admin should return overall metrics', async () => {
    const res = await request(app)
      .get('/api/admin/stats')
      .set('Authorization', `Bearer ${adminToken}`);

    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.ok(res.body.stats.totalUsers > 0);
    assert.ok(res.body.stats.totalQuestions > 0);
  });

  test('GET /api/admin/stats as Student should be forbidden (403)', async () => {
    const res = await request(app)
      .get('/api/admin/stats')
      .set('Authorization', `Bearer ${studentToken}`);

    assert.equal(res.status, 403);
  });
});
