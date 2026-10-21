import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api, { getErrorMessage } from '../../api/client';
import { StatCard } from '../../components/common/StatCard';
import { StatsSkeleton, CardSkeleton } from '../../components/common/SkeletonLoader';
import { StatusBadge } from '../../components/common/Badge';
import {
  ShieldCheck,
  Users,
  BrainCircuit,
  Timer,
  Briefcase,
  Layers,
  ArrowRight,
  Plus,
  TrendingUp,
  FileText,
} from 'lucide-react';

export const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAdminStats();
  }, []);

  const fetchAdminStats = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/stats');
      if (res.data.success) {
        setData(res.data);
      }
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to load admin stats'));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <StatsSkeleton />
        <CardSkeleton count={2} />
      </div>
    );
  }

  const stats = data?.stats || {
    totalUsers: 0,
    totalStudents: 0,
    totalAdmins: 0,
    totalQuestions: 0,
    totalTests: 0,
    totalAttempts: 0,
    totalJobs: 0,
    activeJobs: 0,
    totalApplications: 0,
  };

  const recentAttempts = data?.recentAttempts || [];
  const recentApplications = data?.recentApplications || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-navy-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-purple-500/20">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-400/20">
            <ShieldCheck className="w-4 h-4 text-purple-400" /> Training & Placement Officer Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Placement Administration Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Manage question banks, schedule campus mock tests, post recruiter drives, and monitor student performance.
          </p>
        </div>

        {/* Quick Admin Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            to="/admin/questions"
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" /> Add Question
          </Link>
          <Link
            to="/admin/jobs"
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 border border-white/20"
          >
            <Plus className="w-3.5 h-3.5" /> Post Job Drive
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Registered Students"
          value={stats.totalStudents}
          subtext={`${stats.totalAdmins} placement officers`}
          icon={Users}
          iconBg="bg-blue-50 text-blue-600"
        />
        <StatCard
          title="Question Bank"
          value={stats.totalQuestions}
          subtext="Aptitude & Core CS items"
          icon={BrainCircuit}
          iconBg="bg-indigo-50 text-indigo-600"
        />
        <StatCard
          title="Active Mock Exams"
          value={stats.totalTests}
          subtext={`${stats.totalAttempts} total attempts evaluated`}
          icon={Timer}
          iconBg="bg-amber-50 text-amber-600"
        />
        <StatCard
          title="Campus Job Drives"
          value={stats.activeJobs}
          subtext={`${stats.totalApplications} student applications`}
          icon={Briefcase}
          iconBg="bg-emerald-50 text-emerald-600"
        />
      </div>

      {/* Admin Modules Quick Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Link
          to="/admin/users"
          className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm card-hover space-y-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
            Manage Students & Users
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Review registered students, inspect CGPAs, and configure admin permissions.
          </p>
          <span className="text-xs font-bold text-brand-600 flex items-center gap-1 pt-2">
            Open Users <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </Link>

        <Link
          to="/admin/questions"
          className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm card-hover space-y-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
            Aptitude Questions CRUD
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Create, edit, and categorize questions with multi-choice options and formula hints.
          </p>
          <span className="text-xs font-bold text-brand-600 flex items-center gap-1 pt-2">
            Question Bank <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </Link>

        <Link
          to="/admin/tests"
          className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm card-hover space-y-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Timer className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
            Mock Tests & Exams
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Assemble timed mock exams, adjust passing cutoff %, and link questions.
          </p>
          <span className="text-xs font-bold text-brand-600 flex items-center gap-1 pt-2">
            Manage Tests <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </Link>

        <Link
          to="/admin/jobs"
          className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm card-hover space-y-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Briefcase className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
            Campus Jobs & Applicants
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Post new recruitment drives, view applicant resumes, and update hiring stages.
          </p>
          <span className="text-xs font-bold text-brand-600 flex items-center gap-1 pt-2">
            Manage Jobs <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </Link>
      </div>

      {/* Recent Activity Across Campus */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Attempts */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Timer className="w-4 h-4 text-brand-600" /> Recent Student Mock Submissions
            </h3>
          </div>

          {recentAttempts.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {recentAttempts.map((att) => (
                <div key={att._id} className="py-3 flex items-center justify-between gap-3 text-xs">
                  <div>
                    <p className="font-bold text-slate-900">{att.user?.name || 'Student'}</p>
                    <p className="text-slate-400">
                      {att.mockTest?.title} • {att.user?.branch || 'Engineering'}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`font-black ${att.passed ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {att.score}/{att.totalMarks} ({att.percentage}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 py-6 text-center">No recent submissions recorded.</p>
          )}
        </div>

        {/* Recent Job Applications */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-brand-600" /> Recent Campus Drive Applications
            </h3>
          </div>

          {recentApplications.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {recentApplications.map((app) => (
                <div key={app._id} className="py-3 flex items-center justify-between gap-3 text-xs">
                  <div>
                    <p className="font-bold text-slate-900">{app.user?.name || 'Applicant'}</p>
                    <p className="text-slate-500">
                      Applied for <span className="font-semibold">{app.job?.title}</span> ({app.job?.company})
                    </p>
                  </div>
                  <StatusBadge status={app.status} />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 py-6 text-center">No recent applications.</p>
          )}
        </div>
      </div>
    </div>
  );
};
