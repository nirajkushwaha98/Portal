import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Github, Linkedin, Heart, Shield, Sparkles } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-navy-950 text-slate-400 pt-16 pb-12 border-t border-navy-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-navy-800/80">
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
                <GraduationCap className="w-6 h-6" />
              </div>
              <span className="text-xl font-black text-white tracking-tight">
                Placement<span className="text-brand-400">Pro</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              The premier placement readiness ecosystem for college engineers. Master quantitative aptitude, conquer company-specific mock exams, track job drives, and land your dream tech offer.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-800/60 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                2026 Campus Drive Active
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Practice & Mock</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/aptitude" className="hover:text-white transition-colors">Aptitude Practice</Link>
              </li>
              <li>
                <Link to="/mock-tests" className="hover:text-white transition-colors">Timed Mock Exams</Link>
              </li>
              <li>
                <Link to="/coding" className="hover:text-white transition-colors">Curated DSA Sheet</Link>
              </li>
              <li>
                <Link to="/interview-prep" className="hover:text-white transition-colors">Interview Questions</Link>
              </li>
            </ul>
          </div>

          {/* Campus Placement */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Hiring & Careers</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/jobs" className="hover:text-white transition-colors">Job & Internship Board</Link>
              </li>
              <li>
                <Link to="/applications" className="hover:text-white transition-colors">Application Tracker</Link>
              </li>
              <li>
                <Link to="/resources" className="hover:text-white transition-colors">Resume & ATS Guide</Link>
              </li>
              <li>
                <Link to="/resources" className="hover:text-white transition-colors">CS Core Cheatsheets</Link>
              </li>
            </ul>
          </div>

          {/* College T&P Cell & Admin */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Administration</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/admin" className="hover:text-white transition-colors flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5 text-purple-400" /> T&P Admin Portal
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition-colors">Recruiter Sign In</Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-white transition-colors">Student Registration</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} PlacementPro. Built with React, Tailwind CSS, Node.js, and MongoDB.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-slate-400">
              Crafted for university placements <Sparkles className="w-3 h-3 text-amber-400" />
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
