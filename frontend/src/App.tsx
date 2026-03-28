import { BrowserRouter, Routes, Route } from 'react-router-dom';
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
          <Route path="/choose-skills" element={<ChooseSkillsPage />} />
          <Route path="/worker-profile" element={<WorkerProfilePage />} />
          <Route path="/profile" element={<WorkerProfilePage />} />
          {/* Contractor flow */}
          <Route path="/contractor-dashboard" element={<ContractorDashboardPage />} />
          <Route path="/dashboard" element={<ContractorDashboardPage />} />
          {/* Shared pages */}
          <Route path="/feed" element={<FeedPage />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/jobs/:id" element={<JobDetailsPage />} />
          <Route path="/rating" element={<RatingPage />} />
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
