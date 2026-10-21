import React, { useState } from 'react';
import {
  BookOpen,
  Database,
  Cpu,
  Globe,
  FileCheck,
  Award,
  Sparkles,
  Download,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';

export const LearningResourcesPage = () => {
  const [activeTab, setActiveTab] = useState('dbms');

  const tabs = [
    { id: 'dbms', label: 'DBMS & SQL', icon: Database },
    { id: 'os', label: 'Operating Systems', icon: Cpu },
    { id: 'cn', label: 'Computer Networks', icon: Globe },
    { id: 'oops', label: 'OOP & System Design', icon: Sparkles },
    { id: 'resume', label: 'ATS Resume Checklist', icon: FileCheck },
    { id: 'hr', label: 'HR & STAR Strategy', icon: Award },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-200">
          <BookOpen className="w-3.5 h-3.5" /> High-Yield Engineering Cheatsheets
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Core Computer Science & Placement Prep Resources
        </h1>
        <p className="text-sm text-slate-500 max-w-2xl">
          Quick-revision summaries, formula guides, and interview checklists designed to help you ace your campus technical screening rounds.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-200">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <tab.icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content Panels */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        {/* DBMS Tab */}
        {activeTab === 'dbms' && (
          <div className="space-y-6 animate-slide-in">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Database Management Systems (DBMS)</h3>
                <p className="text-xs text-slate-500">Core concepts tested in technical interviews</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-600"></span> ACID Properties
                </h4>
                <ul className="space-y-2 text-xs text-slate-700 leading-relaxed">
                  <li><strong>Atomicity:</strong> All changes in a transaction are completed or none are ("all-or-nothing").</li>
                  <li><strong>Consistency:</strong> Data must remain in a valid state adhering to constraints before and after execution.</li>
                  <li><strong>Isolation:</strong> Concurrent transactions run independently without interfering with each other.</li>
                  <li><strong>Durability:</strong> Once committed, transaction results survive power failures and crashes.</li>
                </ul>
              </div>

              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-600"></span> Normalization Forms
                </h4>
                <ul className="space-y-2 text-xs text-slate-700 leading-relaxed">
                  <li><strong>1NF:</strong> Table contains atomic (indivisible) values with no repeating groups.</li>
                  <li><strong>2NF:</strong> In 1NF and no partial dependencies (all non-key attributes fully depend on candidate key).</li>
                  <li><strong>3NF:</strong> In 2NF and no transitive dependencies (non-key attributes do not depend on other non-key attributes).</li>
                  <li><strong>BCNF:</strong> For every functional dependency X &rarr; Y, X must be a super key.</li>
                </ul>
              </div>
            </div>

            {/* SQL Joins Summary */}
            <div className="p-5 bg-indigo-50/60 rounded-2xl border border-indigo-100 space-y-3">
              <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-wider">
                SQL Joins Quick Reference
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                <div className="bg-white p-3 rounded-xl border border-indigo-200/60">
                  <strong className="text-slate-900 block mb-1">INNER JOIN</strong>
                  <p className="text-slate-600">Returns rows that have matching values in both tables.</p>
                </div>
                <div className="bg-white p-3 rounded-xl border border-indigo-200/60">
                  <strong className="text-slate-900 block mb-1">LEFT JOIN</strong>
                  <p className="text-slate-600">Returns all rows from left table + matched rows from right table.</p>
                </div>
                <div className="bg-white p-3 rounded-xl border border-indigo-200/60">
                  <strong className="text-slate-900 block mb-1">RIGHT JOIN</strong>
                  <p className="text-slate-600">Returns all rows from right table + matched rows from left table.</p>
                </div>
                <div className="bg-white p-3 rounded-xl border border-indigo-200/60">
                  <strong className="text-slate-900 block mb-1">FULL OUTER</strong>
                  <p className="text-slate-600">Returns all records when there is a match in either left or right table.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Operating Systems Tab */}
        {activeTab === 'os' && (
          <div className="space-y-6 animate-slide-in">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Operating Systems (OS)</h3>
                <p className="text-xs text-slate-500">Process management, memory paging, and concurrency</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                <h4 className="text-sm font-bold text-slate-900">Process vs Thread</h4>
                <ul className="space-y-2 text-xs text-slate-700 leading-relaxed">
                  <li><strong>Process:</strong> Independent program in execution with its own dedicated virtual address space, file descriptors, and PCB. Context switching is heavier.</li>
                  <li><strong>Thread:</strong> Lightweight unit of execution within a process. Threads of the same process share heap, global variables, and code section, but maintain private stacks and registers.</li>
                </ul>
              </div>

              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                <h4 className="text-sm font-bold text-slate-900">Coffman Deadlock Conditions</h4>
                <p className="text-xs text-slate-600">All four conditions must hold simultaneously for a deadlock to exist:</p>
                <ol className="list-decimal pl-4 space-y-1 text-xs text-slate-700">
                  <li><strong>Mutual Exclusion:</strong> At least one resource held non-shareably.</li>
                  <li><strong>Hold and Wait:</strong> Process holding resources while requesting more.</li>
                  <li><strong>No Preemption:</strong> Resources can only be released voluntarily.</li>
                  <li><strong>Circular Wait:</strong> A closed chain of processes waiting on each other.</li>
                </ol>
              </div>
            </div>
          </div>
        )}

        {/* Computer Networks Tab */}
        {activeTab === 'cn' && (
          <div className="space-y-6 animate-slide-in">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Computer Networks (CN)</h3>
                <p className="text-xs text-slate-500">Protocols, routing, transport layer, and DNS</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                <h4 className="text-sm font-bold text-slate-900">TCP 3-Way Handshake</h4>
                <div className="space-y-2 text-xs font-mono bg-white p-4 rounded-xl border border-slate-200">
                  <p>1. Client &rarr; Server: <strong>SYN (seq = x)</strong></p>
                  <p>2. Server &rarr; Client: <strong>SYN-ACK (seq = y, ack = x + 1)</strong></p>
                  <p>3. Client &rarr; Server: <strong>ACK (ack = y + 1)</strong></p>
                </div>
                <p className="text-xs text-slate-500">Establishes full-duplex reliable byte stream connection.</p>
              </div>

              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                <h4 className="text-sm font-bold text-slate-900">OSI 7 Layer Hierarchy</h4>
                <ul className="text-xs space-y-1 text-slate-700">
                  <li>7. <strong>Application</strong> (HTTP, DNS, SMTP, FTP)</li>
                  <li>6. <strong>Presentation</strong> (SSL/TLS, Encryption, Compression)</li>
                  <li>5. <strong>Session</strong> (Sockets, RPC, Session Management)</li>
                  <li>4. <strong>Transport</strong> (TCP, UDP, Port numbers)</li>
                  <li>3. <strong>Network</strong> (IP, Routing, ICMP)</li>
                  <li>2. <strong>Data Link</strong> (MAC, Ethernet, Framing)</li>
                  <li>1. <strong>Physical</strong> (Cables, Bits, Radio signals)</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* OOP & System Design */}
        {activeTab === 'oops' && (
          <div className="space-y-6 animate-slide-in">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">OOP & Software Architecture</h3>
                <p className="text-xs text-slate-500">SOLID principles and design patterns</p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">SOLID Principles</h4>
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <strong className="block text-brand-700 text-sm mb-1">S</strong>
                  <strong className="block text-slate-900 mb-1">Single Responsibility</strong>
                  <p className="text-slate-600">A class should have one, and only one, reason to change.</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <strong className="block text-brand-700 text-sm mb-1">O</strong>
                  <strong className="block text-slate-900 mb-1">Open/Closed</strong>
                  <p className="text-slate-600">Software entities should be open for extension, but closed for modification.</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <strong className="block text-brand-700 text-sm mb-1">L</strong>
                  <strong className="block text-slate-900 mb-1">Liskov Substitution</strong>
                  <p className="text-slate-600">Subtypes must be substitutable for their base types without altering correctness.</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <strong className="block text-brand-700 text-sm mb-1">I</strong>
                  <strong className="block text-slate-900 mb-1">Interface Segregation</strong>
                  <p className="text-slate-600">Clients should not be forced to depend upon interfaces that they do not use.</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <strong className="block text-brand-700 text-sm mb-1">D</strong>
                  <strong className="block text-slate-900 mb-1">Dependency Inversion</strong>
                  <p className="text-slate-600">Depend upon abstractions (interfaces), not concrete implementations.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Resume Checklist Tab */}
        {activeTab === 'resume' && (
          <div className="space-y-6 animate-slide-in">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <FileCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Campus ATS Resume Master Checklist</h3>
                <p className="text-xs text-slate-500">Ensure your resume passes college T&P screenings and company ATS parsers</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                <h4 className="text-sm font-bold text-slate-900">Formatting & Structure</h4>
                <ul className="space-y-2 text-xs text-slate-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>Single page layout with clean 0.5-inch margins and standard font (Inter, Arial, Helvetica).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>Clickable GitHub, LinkedIn, and live project demo hyperlinks.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>Consistent date formatting (e.g. "Aug 2024 - Present").</span>
                  </li>
                </ul>
              </div>

              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                <h4 className="text-sm font-bold text-slate-900">Bullet Points & Impact Formula</h4>
                <p className="text-xs text-slate-600">
                  Use Google's formula: <em>"Accomplished [X] as measured by [Y], by doing [Z]"</em>
                </p>
                <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-800 space-y-1">
                  <span className="font-bold text-emerald-700 block">Strong Example:</span>
                  <p>"Engineered an asynchronous order processing pipeline using Redis and Node.js, reducing average API latency by 42% across 15,000 requests/sec."</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* HR & STAR Strategy */}
        {activeTab === 'hr' && (
          <div className="space-y-6 animate-slide-in">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">HR & Behavioral Interview Playbook</h3>
                <p className="text-xs text-slate-500">Master situational and leadership questions with structure</p>
              </div>
            </div>

            <div className="p-5 bg-brand-50/70 rounded-2xl border border-brand-100 space-y-4">
              <h4 className="text-sm font-bold text-brand-950">The STAR Method Framework</h4>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
                <div className="bg-white p-4 rounded-xl border border-brand-200/80">
                  <span className="font-bold text-brand-700 text-sm block">S - Situation</span>
                  <p className="text-slate-600 mt-1">Set the context. What project or hackathon were you working on? What was the challenge?</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-brand-200/80">
                  <span className="font-bold text-brand-700 text-sm block">T - Task</span>
                  <p className="text-slate-600 mt-1">What was your specific role and responsibility in overcoming this obstacle?</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-brand-200/80">
                  <span className="font-bold text-brand-700 text-sm block">A - Action</span>
                  <p className="text-slate-600 mt-1">What precise steps, tools, and technical trade-offs did you personally execute?</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-brand-200/80">
                  <span className="font-bold text-brand-700 text-sm block">R - Result</span>
                  <p className="text-slate-600 mt-1">Quantify the business impact, performance metric improvement, or lesson learned.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
