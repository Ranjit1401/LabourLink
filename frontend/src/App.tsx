import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import Toast from './components/Toast';
import LandingPage from './pages/LandingPage';
import LoginSignupPage from './pages/LoginSignupPage';
import ChooseSkillsPage from './pages/ChooseSkillsPage';
import WorkerProfilePage from './pages/WorkerProfilePage';
import ContractorDashboardPage from './pages/ContractorDashboardPage';
import FeedPage from './pages/FeedPage';
import JobsPage from './pages/JobsPage';
import JobDetailsPage from './pages/JobDetailsPage';
import RatingPage from './pages/RatingPage';
import Connections from './pages/Connections';
import NotificationsPage from './pages/NotificationsPage';
import MyProjectsPage from './pages/MyProjectsPage';

function PrivateRoute({ children }: { children: React.ReactElement }) {
  const { isLoggedIn } = useApp();
  return isLoggedIn ? children : <Navigate to="/login" replace />;
}

// ✅ FIX 1: Moved all logic into AppContent so useApp() works inside BrowserRouter
function AppContent() {
  const { isLoggedIn } = useApp();

  return (
    <>
      {/* ✅ FIX 2: Navbar only shown when logged in */}
      {isLoggedIn && <Navbar />}

      <div className={isLoggedIn ? 'pt-20' : ''}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<LoginSignupPage />} />
          <Route path="/login" element={<LoginSignupPage />} />

          {/* Worker flow */}
          <Route path="/choose-skills" element={<PrivateRoute><ChooseSkillsPage /></PrivateRoute>} />
          <Route path="/worker-profile" element={<PrivateRoute><WorkerProfilePage /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><WorkerProfilePage /></PrivateRoute>} />

          {/* Contractor flow */}
          {/* ✅ FIX 3: Removed duplicate routes — kept only the PrivateRoute versions */}
          <Route path="/contractor-dashboard" element={<PrivateRoute><ContractorDashboardPage /></PrivateRoute>} />
          <Route path="/dashboard" element={<PrivateRoute><ContractorDashboardPage /></PrivateRoute>} />

          {/* Shared protected pages */}
          <Route path="/feed" element={<PrivateRoute><FeedPage /></PrivateRoute>} />
          <Route path="/jobs" element={<PrivateRoute><JobsPage /></PrivateRoute>} />
          <Route path="/jobs/:id" element={<PrivateRoute><JobDetailsPage /></PrivateRoute>} />
          <Route path="/rating" element={<PrivateRoute><RatingPage /></PrivateRoute>} />
          <Route path="/connections" element={<PrivateRoute><Connections /></PrivateRoute>} />
          <Route path="/notifications" element={<PrivateRoute><NotificationsPage /></PrivateRoute>} />
          <Route path="/my-projects" element={<PrivateRoute><MyProjectsPage /></PrivateRoute>} />

          {/* Fallback */}
          <Route path="*" element={<LandingPage />} />
        </Routes>
        
      </div>

      {/* ✅ FIX 4: BottomNav only shown when logged in */}
      {isLoggedIn && <BottomNav />}
      <Toast />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;