import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api, { getErrorMessage } from '../api/client';
import { StatCard } from '../components/common/StatCard';
import { StatsSkeleton, CardSkeleton } from '../components/common/SkeletonLoader';
import { EmptyState } from '../components/common/EmptyState';
import { StatusBadge } from '../components/common/Badge';
import {
  Timer,
  Award,
  Code2,
  Briefcase,
  Bookmark,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Play,
  FileText,
} from 'lucide-react';

export const StudentDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const res = await api.get('/users/dashboard-stats');
        if (res.data.success) {
          setData(res.data);
        }
      } catch (err) {
        setError(getErrorMessage(err, 'Failed to load dashboard metrics'));
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="space-y-2">
          <div className="h-8 w-64 bg-slate-200 rounded-lg animate-pulse"></div>
          <div className="h-4 w-96 bg-slate-100 rounded animate-pulse"></div>
        </div>
        <StatsSkeleton />
        <CardSkeleton count={3} />
      </div>
    );
  }

  const stats = data?.stats || {
    totalTestsTaken: 0,
    avgScore: 0,
    totalApplications: 0,
    solvedCodingProblems: 0,
    totalCodingProblems: 0,
    savedJobsCount: 0,
  };

  const performanceTrend = data?.performanceTrend || [];
  const recentAttempts = data?.recentAttempts || [];
  const recentApplications = data?.recentApplications || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-navy-950 via-navy-900 to-brand-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-white/10">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 text-xs font-semibold border border-brand-400/20">
            <span>Class of {user?.graduationYear || 2026}</span> • <span>{user?.branch || 'Engineering'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Welcome back, {user?.name || 'Aspirant'}! 👋
          </h1>
          <p className="text-sm text-slate-300 max-w-xl">
            You're currently preparing for campus recruitment drives at <span className="text-brand-300 font-semibold">{user?.college || 'National Institute of Technology'}</span>. Keep up your streak!
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <Link
            to="/mock-tests"
            className="flex-1 md:flex-none px-5 py-2.5 text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 rounded-xl transition-all shadow-md shadow-brand-600/30 flex items-center justify-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5 fill-white" /> Take Mock Test
          </Link>
          <Link
            to="/jobs"
            className="flex-1 md:flex-none px-5 py-2.5 text-xs font-bold text-slate-200 bg-white/10 hover:bg-white/15 rounded-xl transition-all border border-white/20 flex items-center justify-center gap-1.5"
          >
            Explore Drives
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Mock Tests Taken"
          value={stats.totalTestsTaken}
          subtext="diagnostic exams completed"
          icon={Timer}
          iconBg="bg-indigo-50 text-indigo-600"
        />
        <StatCard
          title="Average Score"
          value={`${stats.avgScore}%`}
          subtext={stats.avgScore >= 60 ? 'Above passing benchmark' : 'Requires practice'}
          trend={stats.avgScore >= 60 ? '+Passing' : 'Below cutoff'}
          trendType={stats.avgScore >= 60 ? 'positive' : 'negative'}
          icon={Award}
          iconBg="bg-amber-50 text-amber-600"
        />
        <StatCard
          title="DSA Problems Solved"
          value={`${stats.solvedCodingProblems} / ${stats.totalCodingProblems || 6}`}
          subtext="Placement sheet progress"
          icon={Code2}
          iconBg="bg-purple-50 text-purple-600"
        />
        <StatCard
          title="Jobs Applied"
          value={stats.totalApplications}
          subtext={`${stats.savedJobsCount} saved drives`}
          icon={Briefcase}
          iconBg="bg-emerald-50 text-emerald-600"
        />
      </div>

      {/* Analytics Chart & Performance Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Performance Chart Column */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-brand-600" /> Recent Mock Test Performance
              </h2>
              <p className="text-xs text-slate-500">Score percentage across your test attempts</p>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              Cutoff Benchmark: 60%
            </span>
          </div>

          {performanceTrend.length > 0 ? (
            <div className="space-y-4 pt-2">
              <div className="h-56 flex items-end gap-3 sm:gap-6 pt-6 pb-2 border-b border-slate-200">
                {performanceTrend.map((item, index) => {
                  const heightPercent = Math.max(10, Math.min(100, item.percentage));
                  const isPassing = item.percentage >= 60;
                  return (
                    <div key={index} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group relative">
                      {/* Tooltip on hover */}
                      <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[11px] font-bold py-1 px-2 rounded-md shadow-md pointer-events-none z-10 whitespace-nowrap">
                        {item.percentage}% ({item.testName})
                      </div>

                      <div className="w-full max-w-[40px] bg-slate-100 rounded-t-lg overflow-hidden h-full flex items-end">
                        <div
                          style={{ height: `${heightPercent}%` }}
                          className={`w-full rounded-t-lg transition-all duration-500 ${
                            isPassing ? 'bg-brand-600 group-hover:bg-brand-500' : 'bg-rose-500 group-hover:bg-rose-400'
                          }`}
                        ></div>
                      </div>
                      <span className="text-[11px] font-semibold text-slate-500 truncate max-w-[70px]">
                        {item.date}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-xs bg-brand-600 inline-block"></span> Passed (&ge;60%)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-xs bg-rose-500 inline-block"></span> Below Benchmark (&lt;60%)
                </span>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-slate-400 space-y-3">
              <Timer className="w-10 h-10 mx-auto text-slate-300" />
              <p className="text-sm">No test attempts recorded yet.</p>
              <Link
                to="/mock-tests"
                className="inline-block px-4 py-2 text-xs font-bold text-white bg-brand-600 rounded-xl"
              >
                Attempt Your First Test
              </Link>
            </div>
          )}
        </div>

        {/* Quick Placement Prep Roadmap / Profile Health */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
          <h2 className="text-base font-bold text-slate-900">Placement Readiness Health</h2>

          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">Aptitude Qualification</span>
                <span className="font-bold text-brand-600">
                  {stats.avgScore >= 60 ? 'Ready' : 'In Progress'}
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className="bg-brand-600 h-2 rounded-full"
                  style={{ width: `${Math.min(100, (stats.avgScore / 80) * 100)}%` }}
                ></div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">DSA Mastery</span>
                <span className="font-bold text-purple-600">
                  {Math.round(((stats.solvedCodingProblems || 0) / (stats.totalCodingProblems || 6)) * 100)}%
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className="bg-purple-600 h-2 rounded-full"
                  style={{
                    width: `${Math.min(100, ((stats.solvedCodingProblems || 0) / (stats.totalCodingProblems || 6)) * 100)}%`,
                  }}
                ></div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">Resume & Portfolio</span>
                <span className="font-bold text-emerald-600">
                  {user?.resumeUrl ? 'Configured' : 'Missing'}
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className="bg-emerald-600 h-2 rounded-full"
                  style={{ width: user?.resumeUrl ? '100%' : '30%' }}
                ></div>
              </div>
            </div>
          </div>

          <Link
            to="/profile"
            className="w-full py-2.5 px-4 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center justify-center gap-1.5"
          >
            Complete Student Profile
          </Link>
        </div>
      </div>

      {/* Recent Attempts & Application History Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Attempts */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Timer className="w-4 h-4 text-brand-600" /> Recent Mock Exam Scorecards
            </h2>
            <Link to="/mock-tests" className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentAttempts.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {recentAttempts.map((att) => (
                <div key={att._id} className="py-3.5 flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-slate-900">{att.mockTest?.title || 'Mock Test'}</p>
                    <p className="text-xs text-slate-400 flex items-center gap-2">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {Math.round((att.timeTakenSeconds || 0) / 60)} mins
                      </span>
                      • <span>{new Date(att.createdAt).toLocaleDateString()}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-sm font-black text-slate-900">{att.score} / {att.totalMarks}</p>
                      <span className={`text-[11px] font-bold ${att.passed ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {att.percentage}% ({att.passed ? 'PASSED' : 'NEEDS PRACTICE'})
                      </span>
                    </div>

                    <Link
                      to={`/test-result/${att._id}`}
                      className="p-2 text-slate-500 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                      title="View Analysis"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 py-6 text-center">No mock exams attempted yet.</p>
          )}
        </div>

        {/* Recent Applications */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-brand-600" /> Campus Drives Tracking
            </h2>
            <Link to="/applications" className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1">
              Tracker Kanban <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentApplications.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {recentApplications.map((app) => (
                <div key={app._id} className="py-3.5 flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-slate-900">{app.job?.title || 'Engineering Role'}</p>
                    <p className="text-xs text-slate-500">
                      {app.job?.company} • <span className="font-semibold text-slate-700">{app.job?.location}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <StatusBadge status={app.status} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 py-6 text-center">You haven't applied to any campus drives yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};
