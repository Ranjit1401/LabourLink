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

function PrivateRoute({ children }: { children: React.ReactElement }) {
  const { isLoggedIn } = useApp();
  return isLoggedIn ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="pt-20">
        <Routes>
          {/* Landing as default route */}
          <Route path="/" element={<LandingPage />} />
          {/* Auth */}
          <Route path="/signup" element={<LoginSignupPage />} />
          <Route path="/login" element={<LoginSignupPage />} />
          {/* Worker flow */}
          <Route path="/choose-skills" element={<PrivateRoute><ChooseSkillsPage /></PrivateRoute>} />
          <Route path="/worker-profile" element={<PrivateRoute><WorkerProfilePage /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><WorkerProfilePage /></PrivateRoute>} />

          {/* Contractor flow */}
          <Route path="/contractor-dashboard" element={<PrivateRoute><ContractorDashboardPage /></PrivateRoute>} />
          <Route path="/dashboard" element={<PrivateRoute><ContractorDashboardPage /></PrivateRoute>} />

          {/* Shared pages */}
          <Route path="/feed" element={<FeedPage />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/jobs/:id" element={<JobDetailsPage />} />
          <Route path="/rating" element={<RatingPage />} />
          <Route path="/connections" element={<Connections />} />
          <Route path="/feed" element={<PrivateRoute><FeedPage /></PrivateRoute>} />
          <Route path="/jobs" element={<PrivateRoute><JobsPage /></PrivateRoute>} />
          <Route path="/jobs/:id" element={<PrivateRoute><JobDetailsPage /></PrivateRoute>} />
          <Route path="/rating" element={<PrivateRoute><RatingPage /></PrivateRoute>} />
          <Route path="/notifications" element={<PrivateRoute><NotificationsPage /></PrivateRoute>} />
          {/* Fallback */}
          <Route path="*" element={<LandingPage />} />
          
        </Routes>
        
      </div>
      <BottomNav />
      <Toast />
    </BrowserRouter>
  );
}

export default App;
