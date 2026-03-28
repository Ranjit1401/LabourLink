// ──────────────────────────────────────────
//  Shared Types & Interfaces for LabourLink
// ──────────────────────────────────────────

export type UserRole = 'worker' | 'contractor' | null;

export interface AppUser {
  id: string;
  name: string;
  role: UserRole;
  avatar?: string;
  title?: string;
  location?: string;
  about?: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  location: string;
  wage: string;
  wageUnit: 'hr' | 'day' | 'week';
  skills: string[];
  description: string;
  postedAt: string;
  status: 'open' | 'closed';
  applicants?: number;
  type?: 'immediate' | 'contract' | 'featured' | 'full-time';
  icon?: string;
  likes?: number;
  comments?: number;
  postedBy?: string;
}

export interface Worker {
  id: string;
  name: string;
  title: string;
  location: string;
  trustScore: number;
  jobsCompleted: number;
  profileViews?: number;
  rating?: number;
  avatar?: string;
  verified: boolean;
  about?: string;
  skills?: string[];
  endorsements: Endorsement[];
  portfolio?: PortfolioItem[];
  recentJobs?: CompletedJob[];
  followers?: number;
  following?: number;
  referralCode?: string;
}

export interface Endorsement {
  skill: string;
  count: number;
  endorsedBy?: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  imageUrl: string;
}

export interface CompletedJob {
  id: string;
  title: string;
  completedDate: string;
  rating: number;
  ratingLabel: string;
  icon: string;
}

export interface DashboardStats {
  activeJobs: number;
  applicants: number;
  totalHires: number;
  earnings?: number;
  jobsThisWeek?: number;
}

export interface Post {
  id: string;
  author: string;
  authorTitle: string;
  authorAvatar?: string;
  content: string;
  imageUrl?: string;
  location?: string;
  postedAt: string;
  likes: number;
  comments: number;
}

export interface Rating {
  id: string;
  workerId: string;
  workerName: string;
  contractorName: string;
  score: number;
  strengths: string[];
  comment: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  type: 'job' | 'rating' | 'follower' | 'payment' | 'endorsement';
  title: string;
  message: string;
  time: string;
  read: boolean;
  icon: string;
}

export interface NavItem {
  label: string;
  icon: string;
  path: string;
}

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}
