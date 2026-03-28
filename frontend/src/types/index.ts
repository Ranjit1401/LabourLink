// ──────────────────────────────────────────
//  Shared Types & Interfaces for LabourLink
// ──────────────────────────────────────────

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

export interface NavItem {
  label: string;
  icon: string;
  path: string;
}
