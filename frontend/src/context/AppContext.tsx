import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react';
import type { UserRole, ToastMessage, Job, Notification, Endorsement } from '../types';
import { api } from '../utils/api';
import type { Language } from '../utils/i18n';

export interface AppliedJob {
  id: string;
  title: string;
  company: string;
  status: 'Under Review' | 'Approved' | 'Rejected' | 'Completed';
  appliedAt: string;
}

interface AppState {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (v: boolean) => void;
  jobs: Job[];
  token: string | null;
  setToken: (t: string | null) => void;
  addJob: (job: Job) => void;
  contractorJobs: Job[];
  addContractorJob: (job: Job) => void;
  notifications: Notification[];
  markAllRead: () => void;
  unreadCount: number;
  toasts: ToastMessage[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  workerAbout: string;
  setWorkerAbout: (v: string) => void;
  workerSkills: string[];
  setWorkerSkills: (v: string[]) => void;
  endorsements: Endorsement[];
  addEndorsement: (skill: string, endorsedBy: string) => void;
  appliedJobs: AppliedJob[];
  addAppliedJob: (job: AppliedJob) => void;
  // ── Language ──
  language: Language;
  setLanguage: (lang: Language) => void;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [userRole, setUserRole] = useState<UserRole>(
    localStorage.getItem('userRole') as UserRole ?? null
  );
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

  const [jobs, setJobs] = useState<Job[]>([]);
  const [contractorJobs, setContractorJobs] = useState<Job[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [appliedJobs, setAppliedJobs] = useState<AppliedJob[]>([]);

  const [workerAbout, setWorkerAbout] = useState(
    'Experienced Master Electrician with over 8 years of hands-on expertise...'
  );
  const [workerSkills, setWorkerSkills] = useState([
    'Electrical Wiring',
    'HVAC Repair',
    'Plumbing',
  ]);
  const [endorsements, setEndorsements] = useState<Endorsement[]>([]);

// ── Language ──────────────────────────────────────────────────────
const [language, setLanguage] = useState<Language>(
  (localStorage.getItem('language') as Language) ?? 'en'
);

const handleSetLanguage = useCallback((lang: Language) => {
  localStorage.setItem('language', lang);
  setLanguage(lang);
}, []);

  // ── Fetch jobs ────────────────────────────────────────────────────
  useEffect(() => {
    const fetchAllJobs = async () => {
      try {
        const data = await api.getJobs();
        setJobs(data);
      } catch (error) {
        console.error('Failed to fetch jobs from backend:', error);
      }
    };
    fetchAllJobs();
  }, []);

  // ── Fetch notifications ───────────────────────────────────────────
  useEffect(() => {
    if (!token) return;

    const fetchNotifications = async () => {
      try {
        const data = await api.getNotifications();
        const mapped = data.map((n: any) => ({
          id: n._id || Math.random().toString(),
          type: n.type || 'job',
          title: n.message,
          message: n.message,
          time: new Date(n.created_at).toLocaleString(),
          read: n.seen,
          icon: n.type === 'job' ? 'work' : 'dynamic_feed',
        }));
        setNotifications(mapped);
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30_000);
    return () => clearInterval(interval);
  }, [token]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const showToast = useCallback(
    (message: string, type: 'success' | 'error' | 'info' = 'success') => {
      const id = Date.now().toString() + Math.random().toString(36).slice(2);
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4000);
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addJob = useCallback((job: Job) => {
    setJobs((prev) => [job, ...prev]);
  }, []);

  const addContractorJob = useCallback((job: Job) => {
    setContractorJobs((prev) => [job, ...prev]);
    setJobs((prev) => [job, ...prev]);
  }, []);

  const addEndorsement = useCallback((skill: string, endorsedBy: string) => {
    setEndorsements((prev) => {
      const existing = prev.find((e) => e.skill === skill);
      if (existing) {
        return prev.map((e) =>
          e.skill === skill ? { ...e, count: e.count + 1, endorsedBy } : e
        );
      }
      return [...prev, { skill, count: 1, endorsedBy }];
    });
  }, []);

  const addAppliedJob = useCallback((job: AppliedJob) => {
    setAppliedJobs((prev) => [job, ...prev]);
  }, []);

  return (
    <AppContext.Provider
      value={{
        userRole, setUserRole,
        isLoggedIn, setIsLoggedIn,
        token, setToken,
        jobs, addJob,
        contractorJobs, addContractorJob,
        notifications, markAllRead, unreadCount,
        toasts, showToast, removeToast,
        workerAbout, setWorkerAbout,
        workerSkills, setWorkerSkills,
        endorsements, addEndorsement,
        appliedJobs, addAppliedJob,
        language, setLanguage: handleSetLanguage,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be inside AppProvider');
  return ctx;
}

// Alias so components using useAppContext() also work without changes
export const useAppContext = useApp;