import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  GraduationCap,
  ArrowRight,
  BrainCircuit,
  Timer,
  Code2,
  Briefcase,
  CheckCircle2,
  Trophy,
  Users,
  Building2,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Star,
} from 'lucide-react';

export const LandingPage = () => {
  const { isAuthenticated, demoLogin } = useAuth();

  const features = [
    {
      title: 'Topic-wise Aptitude Practice',
      description: 'Master Quantitative, Logical Reasoning, Verbal, and Core CS with detailed step-by-step pedagogical explanations and shortcut formula tips.',
      icon: BrainCircuit,
      color: 'bg-indigo-50 text-indigo-600 border-indigo-200',
      link: '/aptitude',
    },
    {
      title: 'Timed Mock Assessment Exams',
      description: 'Simulate TCS NQT, Infosys SP, and campus screening tests with live countdown timers, question palettes, and instant scorecard analytics.',
      icon: Timer,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-200',
      link: '/mock-tests',
    },
    {
      title: 'Curated Placement DSA Sheet',
      description: 'Targeted coding sheet spanning Arrays, Trees, Dynamic Programming, and Graphs with direct problem links and personalized solve tracking.',
      icon: Code2,
      color: 'bg-purple-50 text-purple-600 border-purple-200',
      link: '/coding',
    },
    {
      title: 'Active Campus Hiring Board',
      description: 'Discover full-time engineering and internship drives, check eligibility, submit applications with 1-click, and track progress on your Kanban board.',
      icon: Briefcase,
      color: 'bg-cyan-50 text-cyan-600 border-cyan-200',
      link: '/jobs',
    },
    {
      title: 'Real Interview Questions & Tips',
      description: 'Read actual interview experiences from top product and service giants, featuring STAR-method behavioral responses and technical deep-dives.',
      icon: Trophy,
      color: 'bg-amber-50 text-amber-600 border-amber-200',
      link: '/interview-prep',
    },
    {
      title: 'Core Engineering Cheatsheets',
      description: 'High-yield revision summaries for DBMS Normalization, SQL queries, OS Process Scheduling, Computer Networks, and ATS Resume checklists.',
      icon: Sparkles,
      color: 'bg-rose-50 text-rose-600 border-rose-200',
      link: '/resources',
    },
  ];

  const companies = [
    'Google',
    'Microsoft',
    'Amazon',
    'Adobe',
    'Atlassian',
    'TCS Digital',
    'Infosys',
    'Cisco',
    'Razorpay',
    'Swiggy',
  ];

  const stats = [
    { label: 'Campus Placement Rate', value: '94.8%' },
    { label: 'Recruiter Drive Partners', value: '180+' },
    { label: 'Aptitude & Tech Questions', value: '5,000+' },
    { label: 'Average CTC Achieved', value: '₹14.2 LPA' },
  ];

  return (
    <div className="space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 md:pt-20 pb-16 bg-gradient-to-b from-navy-950 via-navy-900 to-navy-950 text-white">
        {/* Background glow effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-brand-600/15 blur-[120px] pointer-events-none rounded-full"></div>
        <div className="absolute top-1/4 right-10 w-72 h-72 bg-purple-600/10 blur-[100px] pointer-events-none rounded-full"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-400/30 text-brand-300 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-brand-400" />
            <span>2025 - 2026 University Placement Preparation Suite</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white max-w-4xl mx-auto leading-tight">
            Accelerate Your Journey From <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-indigo-300 to-cyan-400">
              Campus To Dream Tech Offer
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            The all-in-one placement portal engineered for engineering undergrads. Practice high-frequency aptitude drills, simulate authentic timed company mock exams, track hiring drives, and ace technical interviews.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <Link
              to="/mock-tests"
              className="w-full sm:w-auto px-7 py-3.5 text-sm font-bold text-white bg-brand-600 hover:bg-brand-500 rounded-xl transition-all shadow-lg shadow-brand-600/30 flex items-center justify-center gap-2 group"
            >
              Start Free Mock Test
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/jobs"
              className="w-full sm:w-auto px-7 py-3.5 text-sm font-bold text-slate-200 bg-white/10 hover:bg-white/15 border border-white/20 rounded-xl transition-all backdrop-blur-sm flex items-center justify-center gap-2"
            >
              Browse Campus Drives
            </Link>
          </div>

          {/* Instant 1-Click Demo Testing Card */}
          <div className="max-w-xl mx-auto pt-6">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
              <div>
                <p className="text-xs font-bold text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-brand-400" /> Explore with Demo Accounts
                </p>
                <p className="text-xs text-slate-400">Experience both student and admin roles without signing up:</p>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => demoLogin('student')}
                  className="flex-1 sm:flex-none px-3 py-1.5 bg-brand-600 hover:bg-brand-500 text-white rounded-lg text-xs font-bold transition-colors"
                >
                  Demo Student
                </button>
                <button
                  onClick={() => demoLogin('admin')}
                  className="flex-1 sm:flex-none px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-bold transition-colors"
                >
                  Demo Admin
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Recruiter Partners Marquee / Logo Bar */}
        <div className="mt-16 pt-10 border-t border-white/10 max-w-7xl mx-auto px-4 text-center">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-6">
            Curated For Hiring Drives At Premier Tech Employers
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 opacity-75">
            {companies.map((co) => (
              <span
                key={co}
                className="text-sm sm:text-base font-bold text-slate-300 hover:text-white transition-colors"
              >
                {co}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Numerical Stats Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 sm:-mt-16 relative z-10">
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xl shadow-slate-900/5 grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          {stats.map((s, idx) => (
            <div key={idx} className="space-y-1 border-r last:border-r-0 border-slate-100">
              <p className="text-3xl sm:text-4xl font-black text-brand-700 tracking-tight">{s.value}</p>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Core Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-bold text-brand-600 uppercase tracking-wider bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
            Comprehensive Placement Ecosystem
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Everything You Need To Crack Top Campus Recruitment Rounds
          </h2>
          <p className="text-sm sm:text-base text-slate-500">
            Designed in accordance with real recruitment workflows from TCS, Infosys, Amazon, and Google.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, idx) => (
            <Link
              key={idx}
              to={feat.link}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm card-hover flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${feat.color}`}>
                  <feat.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                  {feat.title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {feat.description}
                </p>
              </div>

              <div className="pt-6 mt-4 border-t border-slate-100 flex items-center gap-1 text-xs font-bold text-brand-600 group-hover:translate-x-1 transition-transform">
                <span>Explore Module</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4-Step Placement Roadmap */}
      <section className="bg-slate-100/70 py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3 max-w-xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Your 4-Stage Preparation Roadmap
            </h2>
            <p className="text-sm text-slate-500">
              Follow this structured sequence to maximize your qualification and selection rate.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: 'Aptitude Diagnostic',
                desc: 'Practice high-frequency quantitative, logical, and verbal topics until your section accuracy surpasses 80%.',
              },
              {
                step: '02',
                title: 'Timed Mock Drills',
                desc: 'Take exam simulations with countdown timers and question palettes to master pacing under pressure.',
              },
              {
                step: '03',
                title: 'DSA & Core CS Review',
                desc: 'Complete curated high-frequency coding sheets and review DBMS, OS, and Networking essentials.',
              },
              {
                step: '04',
                title: 'Apply & Interview',
                desc: 'Submit targeted applications, prepare STAR behavioral responses, and track your interviews to offer letters.',
              },
            ].map((st, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3 relative">
                <span className="text-4xl font-black text-brand-100 leading-none">{st.step}</span>
                <h3 className="text-base font-bold text-slate-900">{st.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">Student Success Stories</span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Placed At Dream Companies
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: 'Ananya Deshmukh',
              role: 'Software Engineer @ Google',
              college: 'Batch of 2025',
              review: 'The timed mock exams perfectly modeled Google’s online assessment format. The topic-wise error breakdown helped me bridge my speed gaps in probability and dynamic programming.',
            },
            {
              name: 'Rohan Kulkarni',
              role: 'Associate SDE @ Microsoft',
              college: 'Batch of 2025',
              review: 'PlacementPro was my daily companion for 6 months. The curated DSA sheet and OS/DBMS cheatsheets were identical to what my interviewers quizzed me on during round 2.',
            },
            {
              name: 'Priya Iyer',
              role: 'Digital Specialist Engineer @ Infosys',
              college: 'Batch of 2025',
              review: 'The 1-click application tracking and company-specific interview archives gave me immense clarity. I knew exactly what behavioral questions to expect using the STAR format.',
            },
          ].map((t, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-1 text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-sm text-slate-600 leading-relaxed italic">"{t.review}"</p>
              <div className="pt-3 border-t border-slate-100">
                <p className="text-sm font-bold text-slate-900">{t.name}</p>
                <p className="text-xs text-brand-600 font-semibold">{t.role}</p>
                <p className="text-xs text-slate-400">{t.college}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Box */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-tr from-navy-950 via-brand-900 to-indigo-950 rounded-3xl p-8 sm:p-12 text-center text-white space-y-6 shadow-2xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
              Ready To Secure Your Placement?
            </h2>
            <p className="text-slate-300 text-sm sm:text-base">
              Join thousands of engineering students preparing for the 2025-2026 campus hiring season today.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/register"
                className="w-full sm:w-auto px-7 py-3 text-sm font-bold text-brand-950 bg-white hover:bg-slate-100 rounded-xl transition-all shadow-md"
              >
                Create Student Account
              </Link>
              <Link
                to="/mock-tests"
                className="w-full sm:w-auto px-7 py-3 text-sm font-bold text-white bg-brand-600 hover:bg-brand-500 rounded-xl transition-all shadow-md"
              >
                Take Diagnostic Exam
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
