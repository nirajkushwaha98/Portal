import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api, { getErrorMessage } from '../api/client';
import { DifficultyBadge } from '../components/common/Badge';
import { CardSkeleton } from '../components/common/SkeletonLoader';
import { EmptyState } from '../components/common/EmptyState';
import {
  Timer,
  Clock,
  HelpCircle,
  Award,
  Play,
  CheckCircle2,
  AlertTriangle,
  History,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export const MockTestsPage = () => {
  const { isAuthenticated, demoLogin } = useAuth();
  const [tests, setTests] = useState([]);
  const [myAttempts, setMyAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTestsAndHistory();
  }, [isAuthenticated]);

  const fetchTestsAndHistory = async () => {
    try {
      setLoading(true);
      const testRes = await api.get('/mock-tests');
      if (testRes.data.success) {
        setTests(testRes.data.tests);
      }

      if (isAuthenticated) {
        const attemptRes = await api.get('/test-attempts/my-attempts');
        if (attemptRes.data.success) {
          setMyAttempts(attemptRes.data.attempts);
        }
      }
    } catch (err) {
      console.error('Failed to load mock tests:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStartTest = (testId) => {
    if (!isAuthenticated) {
      // Prompt demo student login or redirect
      demoLogin('student').then(() => {
        navigate(`/take-test/${testId}`);
      });
    } else {
      navigate(`/take-test/${testId}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-bold border border-brand-200">
          <Timer className="w-3.5 h-3.5 text-brand-600" /> Real Exam Simulation Engine
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Campus Recruitment Mock Exams
        </h1>
        <p className="text-sm text-slate-500 max-w-2xl">
          Timed mock assessments calibrated for TCS NQT, Infosys SP, and Core Software Engineering campus placement tests.
        </p>
      </div>

      {/* Available Tests Catalog */}
      <div className="space-y-6">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Award className="w-5 h-5 text-brand-600" /> Active Placement Assessment Tests
        </h2>

        {loading ? (
          <CardSkeleton count={3} />
        ) : tests.length === 0 ? (
          <EmptyState title="No active tests available right now" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tests.map((test) => (
              <div
                key={test._id}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm card-hover flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-brand-700 bg-brand-50 px-2.5 py-1 rounded-full border border-brand-200">
                      {test.category}
                    </span>
                    <DifficultyBadge difficulty={test.difficulty} />
                  </div>

                  <div>
                    <h3 className="text-lg font-black text-slate-900 tracking-tight leading-snug">
                      {test.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                      {test.description}
                    </p>
                  </div>

                  {/* Metadata Chips */}
                  <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 text-center">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Duration</p>
                      <p className="text-xs font-black text-slate-900 flex items-center justify-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3 text-slate-400" /> {test.durationMinutes}m
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Questions</p>
                      <p className="text-xs font-black text-slate-900 mt-0.5">
                        {test.questionCount} Qs
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Cutoff</p>
                      <p className="text-xs font-black text-emerald-600 mt-0.5">
                        {test.passingMarks}%
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleStartTest(test._id)}
                  className="w-full py-3 px-4 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl transition-all shadow-md shadow-brand-500/20 flex items-center justify-center gap-2 group"
                >
                  <Play className="w-3.5 h-3.5 fill-white group-hover:scale-110 transition-transform" />
                  <span>Begin Exam Simulation</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Past Test Attempts Table */}
      {isAuthenticated && myAttempts.length > 0 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <History className="w-5 h-5 text-brand-600" /> My Test Attempt History
              </h2>
              <p className="text-xs text-slate-500">Review scorecards and diagnostic performance breakdowns</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-700 font-bold uppercase tracking-wider border-y border-slate-200">
                <tr>
                  <th className="py-3 px-4">Test Title</th>
                  <th className="py-3 px-4">Date Attempted</th>
                  <th className="py-3 px-4">Score</th>
                  <th className="py-3 px-4">Accuracy / Status</th>
                  <th className="py-3 px-4 text-right">Analysis</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {myAttempts.map((attempt) => (
                  <tr key={attempt._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {attempt.mockTest?.title || 'Placement Mock Test'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">
                      {new Date(attempt.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-3.5 px-4 font-black text-slate-900">
                      {attempt.score} / {attempt.totalMarks}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 font-bold px-2.5 py-0.5 rounded-full text-xs ${
                          attempt.passed
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {attempt.passed ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                        )}
                        {attempt.percentage}% ({attempt.passed ? 'Passed' : 'Needs Practice'})
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        to={`/test-result/${attempt._id}`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-700 hover:underline"
                      >
                        Scorecard <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
