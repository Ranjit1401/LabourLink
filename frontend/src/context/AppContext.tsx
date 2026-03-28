import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { UserRole, ToastMessage, Job, Notification, Endorsement } from '../types';
import { MOCK_JOBS, CONTRACTOR_JOBS, MOCK_NOTIFICATIONS } from '../utils/mockData';

// ─── App State Context ─────────────────────
interface AppState {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (v: boolean) => void;
  // Jobs
  jobs: Job[];
  addJob: (job: Job) => void;
  contractorJobs: Job[];
  addContractorJob: (job: Job) => void;
  // Notifications
  notifications: Notification[];
  markAllRead: () => void;
  unreadCount: number;
  // Toast
  toasts: ToastMessage[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  // Worker profile editable state
  workerAbout: string;
  setWorkerAbout: (v: string) => void;
  workerSkills: string[];
  setWorkerSkills: (v: string[]) => void;
  endorsements: Endorsement[];
  addEndorsement: (skill: string, endorsedBy: string) => void;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [jobs, setJobs] = useState<Job[]>(MOCK_JOBS);
  const [contractorJobs, setContractorJobs] = useState<Job[]>(CONTRACTOR_JOBS);
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [workerAbout, setWorkerAbout] = useState(
    'Experienced Master Electrician with over 8 years of hands-on expertise in residential and industrial electrical systems. Certified in HVAC repair and advanced wiring. Committed to safety, quality, and professionalism on every project.'
  );
  const [workerSkills, setWorkerSkills] = useState([
    'Electrical Wiring', 'HVAC Repair', 'Industrial Power', 'Blueprints',
    'Panel Upgrade', 'Smart Lighting', 'Circuit Repair', 'Plumbing'
  ]);
  const [endorsements, setEndorsements] = useState<Endorsement[]>([
    { skill: 'Wiring', count: 24, endorsedBy: 'Mehta Construction' },
    { skill: 'Mason', count: 10, endorsedBy: 'BuildCorp Ltd' },
    { skill: 'HVAC Repair', count: 8, endorsedBy: 'City Works Corp' },
    { skill: 'Plumbing', count: 5, endorsedBy: 'GreenScape Designs' },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).slice(2);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const addJob = useCallback((job: Job) => {
    setJobs(prev => [job, ...prev]);
  }, []);

  const addContractorJob = useCallback((job: Job) => {
    setContractorJobs(prev => [job, ...prev]);
    // Also add to main job feed
    setJobs(prev => [job, ...prev]);
  }, []);

  const addEndorsement = useCallback((skill: string, endorsedBy: string) => {
    setEndorsements(prev => {
      const existing = prev.find(e => e.skill === skill);
      if (existing) {
        return prev.map(e => e.skill === skill ? { ...e, count: e.count + 1, endorsedBy } : e);
      }
      return [...prev, { skill, count: 1, endorsedBy }];
    });
  }, []);

  return (
    <AppContext.Provider value={{
      userRole, setUserRole, isLoggedIn, setIsLoggedIn,
      jobs, addJob, contractorJobs, addContractorJob,
      notifications, markAllRead, unreadCount,
      toasts, showToast, removeToast,
      workerAbout, setWorkerAbout,
      workerSkills, setWorkerSkills,
      endorsements, addEndorsement,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be inside AppProvider');
  return ctx;
}
