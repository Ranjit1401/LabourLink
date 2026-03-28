import { useState } from 'react';
import { MOCK_STATS, CONTRACTOR_JOBS } from '../utils/mockData';
import type { Job } from '../types';

type TabFilter = 'all' | 'open' | 'closed';

const statCards = [
  {
    label: 'Active Jobs',
    key: 'activeJobs' as const,
    icon: 'construction',
    color: 'text-primary',
    bg: 'bg-primary/10',
    badge: '+12%',
    badgeColor: 'text-secondary bg-secondary-container',
  },
  {
    label: 'Applicants',
    key: 'applicants' as const,
    icon: 'group',
    color: 'text-secondary',
    bg: 'bg-secondary/10',
    badge: '+4 today',
    badgeColor: 'text-primary bg-primary/10',
  },
  {
    label: 'Total Hires',
    key: 'totalHires' as const,
    icon: 'verified',
    color: 'text-tertiary',
    bg: 'bg-tertiary/10',
    badge: null,
    badgeColor: '',
  },
];

const DashboardPage = () => {
  const [tabFilter, setTabFilter] = useState<TabFilter>('all');
  const [showPostModal, setShowPostModal] = useState(false);
  const [newJobTitle, setNewJobTitle] = useState('');
  const [newJobLocation, setNewJobLocation] = useState('');
  const [jobs, setJobs] = useState<Job[]>(CONTRACTOR_JOBS);

  const filteredJobs = jobs.filter((job) => {
    if (tabFilter === 'all') return true;
    return job.status === tabFilter;
  });

  const handlePostJob = () => {
    if (!newJobTitle.trim()) return;
    const newJob: Job = {
      id: `new-${Date.now()}`,
      title: newJobTitle,
      company: 'My Company',
      location: newJobLocation || 'Remote',
      wage: '₹2,000',
      wageUnit: 'day',
      skills: [],
      description: '',
      postedAt: 'Just now',
      status: 'open',
      icon: 'work',
      applicants: 0,
    };
    setJobs((prev) => [newJob, ...prev]);
    setNewJobTitle('');
    setNewJobLocation('');
    setShowPostModal(false);
  };

  return (
    <div className="flex max-w-7xl mx-auto pt-20 pb-24">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col h-screen sticky top-20 py-6 space-y-2 w-64 shrink-0 border-r border-surface-container-high bg-slate-50">
        <div className="px-6 mb-8">
          <h2 className="text-xl font-bold text-blue-700 font-headline">Worker Portal</h2>
          <p className="text-xs text-on-surface-variant font-medium">Verified Skilled Professional</p>
        </div>
        {[
          { label: 'Dashboard', icon: 'dashboard', path: '/dashboard', active: true },
          { label: 'My Profile', icon: 'account_circle', path: '/profile' },
          { label: 'Job History', icon: 'work_history', path: '/jobs' },
          { label: 'Earnings', icon: 'payments', path: '/earnings' },
          { label: 'Settings', icon: 'settings', path: '/settings' },
        ].map((item) => (
          <a
            key={item.label}
            href={item.path}
            className={`flex items-center gap-3 px-4 py-3 mx-2 rounded-xl transition-all font-semibold ${
              item.active
                ? 'bg-blue-50 text-blue-700'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            {item.label}
          </a>
        ))}
        <div className="px-4 mt-auto pb-10">
          <button
            onClick={() => setShowPostModal(true)}
            className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-primary to-primary-dim text-white font-bold shadow-lg shadow-primary/20 flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform"
          >
            <span className="material-symbols-outlined">add</span>
            Find New Work
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 px-6 lg:px-10 py-8">
        {/* Hero Header */}
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold font-headline tracking-tight text-on-background mb-2">
              Contractor Dashboard
            </h1>
            <p className="text-on-surface-variant text-lg max-w-xl">
              Welcome back, Marcus. Your workforce is growing and active today.
            </p>
          </div>
          <button
            onClick={() => setShowPostModal(true)}
            className="px-8 py-4 bg-primary text-white rounded-xl font-bold flex items-center justify-center gap-3 hover:shadow-xl hover:shadow-primary/25 transition-all"
          >
            <span className="material-symbols-outlined">post_add</span>
            Post Job
          </button>
        </header>

        {/* Stats Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {statCards.map((card) => (
            <div
              key={card.key}
              className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/10 shadow-sm relative overflow-hidden group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${card.bg} ${card.color}`}>
                  <span className="material-symbols-outlined">{card.icon}</span>
                </div>
                {card.badge && (
                  <span className={`font-bold text-sm px-2 py-1 rounded-lg ${card.badgeColor}`}>
                    {card.badge}
                  </span>
                )}
              </div>
              <p className="text-on-surface-variant font-medium mb-1">{card.label}</p>
              <h3 className="text-3xl font-extrabold font-headline">
                {MOCK_STATS[card.key].toLocaleString()}
              </h3>
              <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-9xl">{card.icon}</span>
              </div>
            </div>
          ))}
        </section>

        {/* Earnings Banner */}
        <div className="bg-gradient-to-r from-primary to-primary-dim text-white rounded-2xl p-6 mb-10 flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg shadow-primary/20">
          <div>
            <p className="text-sm font-bold opacity-80 uppercase tracking-widest mb-1">Total Earnings</p>
            <p className="text-4xl font-extrabold font-headline">
              ₹{MOCK_STATS.earnings?.toLocaleString()}
            </p>
          </div>
          <div className="flex items-center gap-2 bg-white/20 rounded-xl px-5 py-3">
            <span className="material-symbols-outlined">trending_up</span>
            <span className="font-bold">+18% this month</span>
          </div>
        </div>

        {/* Posted Jobs */}
        <section className="bg-surface-container-lowest rounded-xl border border-outline-variant/10 shadow-sm p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-extrabold font-headline">Posted Jobs</h2>
              <p className="text-on-surface-variant">Manage and track your active recruitment</p>
            </div>
            {/* Tab Filter */}
            <div className="flex gap-2 bg-surface-container p-1 rounded-xl">
              {(['all', 'open', 'closed'] as TabFilter[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setTabFilter(tab)}
                  className={`px-4 py-2 rounded-lg font-bold text-sm capitalize transition-colors ${
                    tabFilter === tab
                      ? 'bg-white shadow-sm text-primary'
                      : 'text-on-surface-variant hover:bg-white/50'
                  }`}
                >
                  {tab === 'all' ? 'All Jobs' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {filteredJobs.length === 0 ? (
              <p className="text-center text-on-surface-variant py-8">No jobs in this category.</p>
            ) : (
              filteredJobs.map((job) => (
                <div
                  key={job.id}
                  className={`flex flex-col md:flex-row items-center justify-between p-6 rounded-2xl transition-all cursor-pointer border border-transparent hover:border-primary/20 ${
                    job.status === 'closed'
                      ? 'bg-surface-container-low opacity-75'
                      : 'bg-surface hover:bg-white'
                  }`}
                >
                  <div className="flex items-center gap-5 w-full md:w-auto mb-4 md:mb-0">
                    <div className="w-14 h-14 rounded-xl bg-white shadow-sm flex items-center justify-center shrink-0">
                      <span
                        className={`material-symbols-outlined text-3xl ${
                          job.status === 'closed' ? 'text-on-surface-variant' : 'text-primary'
                        }`}
                      >
                        {job.icon ?? 'work'}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">{job.title}</h4>
                      <p className="text-sm text-on-surface-variant flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">location_on</span>
                        {job.location} · Posted {job.postedAt}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-8 w-full md:w-auto">
                    <div className="flex flex-col items-end">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold mb-2 ${
                          job.status === 'open'
                            ? 'bg-secondary-container text-on-secondary-container'
                            : 'bg-surface-container-highest text-on-surface-variant'
                        }`}
                      >
                        {job.status === 'open' ? 'Open' : 'Closed'}
                      </span>
                      <span
                        className={`font-bold ${
                          job.status === 'open' ? 'text-primary' : 'text-on-surface-variant'
                        }`}
                      >
                        {job.wage}/{job.wageUnit}
                      </span>
                    </div>
                    <button className="p-2 rounded-lg hover:bg-surface-container transition-colors">
                      <span className="material-symbols-outlined">more_vert</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </main>

      {/* Post Job Modal */}
      {showPostModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-extrabold font-headline text-on-surface">Post a Job</h2>
              <button
                onClick={() => setShowPostModal(false)}
                className="p-2 rounded-full hover:bg-surface-container transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2 block">
                  Job Title
                </label>
                <input
                  type="text"
                  value={newJobTitle}
                  onChange={(e) => setNewJobTitle(e.target.value)}
                  placeholder="e.g. Senior Electrician"
                  className="w-full px-4 py-3 bg-surface-container rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2 block">
                  Location
                </label>
                <input
                  type="text"
                  value={newJobLocation}
                  onChange={(e) => setNewJobLocation(e.target.value)}
                  placeholder="e.g. Mumbai, MH"
                  className="w-full px-4 py-3 bg-surface-container rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowPostModal(false)}
                className="flex-1 py-3 rounded-xl border border-surface-container-high text-on-surface-variant font-bold hover:bg-surface-container transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handlePostJob}
                disabled={!newJobTitle.trim()}
                className="flex-1 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-dim transition-colors disabled:opacity-50"
              >
                Post Job
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile FAB */}
      <button
        onClick={() => setShowPostModal(true)}
        className="md:hidden fixed bottom-24 right-6 w-14 h-14 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center z-50"
      >
        <span className="material-symbols-outlined">add</span>
      </button>
    </div>
  );
};

export default DashboardPage;
