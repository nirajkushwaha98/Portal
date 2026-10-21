import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { ProtectedRoute } from './components/common/ProtectedRoute';

// Public Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { AptitudePracticePage } from './pages/AptitudePracticePage';
import { MockTestsPage } from './pages/MockTestsPage';
import { CodingPracticePage } from './pages/CodingPracticePage';
import { JobsPage } from './pages/JobsPage';
import { InterviewQuestionsPage } from './pages/InterviewQuestionsPage';
import { LearningResourcesPage } from './pages/LearningResourcesPage';

// Protected Student Pages
import { StudentDashboard } from './pages/StudentDashboard';
import { ProfilePage } from './pages/ProfilePage';
import { TestTakingPage } from './pages/TestTakingPage';
import { TestResultPage } from './pages/TestResultPage';
import { ApplicationsPage } from './pages/ApplicationsPage';

// Protected Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminQuestionsPage } from './pages/admin/AdminQuestionsPage';
import { AdminTestsPage } from './pages/admin/AdminTestsPage';
import { AdminJobsPage } from './pages/admin/AdminJobsPage';

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 font-sans">
      <Navbar />
      <main className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/aptitude" element={<AptitudePracticePage />} />
          <Route path="/mock-tests" element={<MockTestsPage />} />
          <Route path="/coding" element={<CodingPracticePage />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/interview-prep" element={<InterviewQuestionsPage />} />
          <Route path="/resources" element={<LearningResourcesPage />} />

          {/* Protected Student Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/take-test/:id"
            element={
              <ProtectedRoute>
                <TestTakingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/test-result/:attemptId"
            element={
              <ProtectedRoute>
                <TestResultPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/applications"
            element={
              <ProtectedRoute>
                <ApplicationsPage />
              </ProtectedRoute>
            }
          />

          {/* Protected Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute adminOnly>
                <AdminUsersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/questions"
            element={
              <ProtectedRoute adminOnly>
                <AdminQuestionsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/tests"
            element={
              <ProtectedRoute adminOnly>
                <AdminTestsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/jobs"
            element={
              <ProtectedRoute adminOnly>
                <AdminJobsPage />
              </ProtectedRoute>
            }
          />

          {/* 404 Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
