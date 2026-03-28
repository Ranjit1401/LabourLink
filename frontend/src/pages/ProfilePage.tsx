import { useState, useEffect } from 'react';
import { MOCK_WORKER } from '../utils/mockData';
import type { CompletedJob, Endorsement } from '../types';
import { api } from '../utils/api';

const StarRating = ({ count }: { count: number }) => (
  <div className="flex items-center text-amber-500 justify-end mb-1">
    {[1, 2, 3, 4, 5].map((n) => (
      <span
        key={n}
        className="material-symbols-outlined text-sm"
        style={{ fontVariationSettings: n <= count ? "'FILL' 1" : "'FILL' 0" }}
      >
        star
      </span>
    ))}
  </div>
);

const ProfilePage = () => {
  const [worker, setWorker] = useState(MOCK_WORKER);

useEffect(() => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    try {
      const { email } = JSON.parse(userStr);
      api.getProfile(email).then(setWorker).catch(console.error);
    } catch (e) {
      console.error('Failed to parse user', e);
    }
  }
}, []);
  const [referralCopied, setReferralCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'portfolio' | 'history'>('portfolio');

  const handleCopyReferral = () => {
    navigator.clipboard.writeText(worker.referralCode ?? '');
    setReferralCopied(true);
    setTimeout(() => setReferralCopied(false), 2000);
  };

  return (
    <div className="flex max-w-7xl mx-auto pt-20 pb-24 px-4 sm:px-6">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col h-screen sticky top-20 py-6 space-y-2 w-64 shrink-0 border-r border-surface-container-high bg-slate-50">
        <div className="px-6 mb-6">
          <p className="text-xl font-bold text-blue-700 font-headline">Worker Portal</p>
          <p className="text-xs text-on-surface-variant font-medium">Verified Skilled Professional</p>
        </div>
        {[
          { label: 'Dashboard', icon: 'dashboard', path: '/dashboard' },
          { label: 'My Profile', icon: 'account_circle', path: '/profile', active: true },
          { label: 'Job History', icon: 'work_history', path: '/jobs' },
          { label: 'Earnings', icon: 'payments', path: '/earnings' },
          { label: 'Settings', icon: 'settings', path: '/settings' },
        ].map((item) => (
          <a
            key={item.label}
            href={item.path}
            className={`flex items-center gap-3 px-4 py-3 mx-2 rounded-xl transition-all ${
              item.active
                ? 'bg-blue-50 text-blue-700 font-semibold'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            {item.label}
          </a>
        ))}
        <div className="mt-auto px-4 pt-6">
          <a
            href="/jobs"
            className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:opacity-90 transition-opacity flex items-center justify-center"
          >
            Find New Work
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 px-4 md:px-10 py-8 overflow-y-auto">
        {/* Trust Banner */}
        <div className="w-full bg-secondary-fixed text-on-secondary-fixed py-2 px-6 rounded-xl mb-8 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <span
              className="material-symbols-outlined text-lg"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              verified
            </span>
            <span className="text-sm font-bold uppercase tracking-wide">
              Identity Verified &amp; Background Checked
            </span>
          </div>
          <span className="text-xs font-semibold opacity-80">Last check: Oct 2023</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-4 space-y-6">
            {/* Profile Card */}
            <div className="bg-surface-container-lowest rounded-xl p-8 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16" />
              <div className="relative">
                <div className="w-24 h-24 rounded-2xl bg-primary text-white flex items-center justify-center text-4xl font-extrabold mb-6 shadow-sm font-headline">
                  AS
                </div>
                <h1 className="text-3xl font-extrabold text-on-surface mb-1 font-headline">
                  {worker.name}
                </h1>
                <p className="text-primary font-bold mb-4 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">electric_bolt</span>
                  {worker.title}
                </p>

                <div className="space-y-4 pt-4 border-t border-surface-container-high">
                  <div className="flex items-center justify-between">
                    <span className="text-on-surface-variant text-sm flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary">location_on</span>
                      Location
                    </span>
                    <span className="font-semibold text-on-surface">{worker.location}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-on-surface-variant text-sm flex items-center gap-2">
                      <span
                        className="material-symbols-outlined text-amber-500"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        star
                      </span>
                      Trust Score
                    </span>
                    <span className="font-bold text-on-surface">
                      {worker.trustScore}{' '}
                      <span className="text-on-surface-variant font-normal">/ 5</span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-on-surface-variant text-sm flex items-center gap-2">
                      <span className="material-symbols-outlined text-secondary">task_alt</span>
                      Jobs Completed
                    </span>
                    <span className="font-bold text-on-surface">{worker.jobsCompleted}</span>
                  </div>
                  {/* Followers */}
                  <div className="flex gap-6 pt-2 border-t border-surface-container">
                    <div className="text-center">
                      <p className="font-extrabold text-on-surface text-lg">{worker.followers}</p>
                      <p className="text-xs text-on-surface-variant">Followers</p>
                    </div>
                    <div className="text-center">
                      <p className="font-extrabold text-on-surface text-lg">{worker.following}</p>
                      <p className="text-xs text-on-surface-variant">Following</p>
                    </div>
                  </div>
                </div>

                <button className="w-full mt-8 bg-primary text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform">
                  <span className="material-symbols-outlined">message</span>
                  Hire {worker.name.split(' ')[0]}
                </button>
              </div>
            </div>

            {/* Referral Code Section */}
            <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl p-6 border border-primary/20">
              <div className="flex items-center gap-2 mb-3">
                <span className="material-symbols-outlined text-primary">card_giftcard</span>
                <h3 className="font-bold text-on-surface font-headline">Referral Code</h3>
              </div>
              <p className="text-sm text-on-surface-variant mb-4">
                Share your code and earn ₹500 for every verified hire!
              </p>
              <div className="flex items-center gap-2 bg-white rounded-xl p-3 border border-primary/20">
                <code className="flex-1 font-mono text-primary font-bold tracking-widest text-sm">
                  {worker.referralCode}
                </code>
                <button
                  onClick={handleCopyReferral}
                  className="px-3 py-1.5 bg-primary text-white rounded-lg text-sm font-bold flex items-center gap-1 hover:bg-primary-dim transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">
                    {referralCopied ? 'check' : 'content_copy'}
                  </span>
                  {referralCopied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>

            {/* Endorsements */}
            <div className="bg-surface-container p-6 rounded-xl">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2 font-headline">
                <span className="material-symbols-outlined text-primary">military_tech</span>
                Skill Endorsements
              </h3>
              <div className="flex flex-wrap gap-3">
                {worker.endorsements.map((e: Endorsement) => (
                  <div
                    key={e.skill}
                    className="bg-surface-container-lowest px-4 py-2 rounded-full flex items-center gap-2 border border-outline-variant/10"
                  >
                    <span className="text-sm font-bold text-on-surface">{e.skill}</span>
                    <span className="flex items-center text-amber-500 font-bold text-xs">
                      <span
                        className="material-symbols-outlined text-xs"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        star
                      </span>
                      {e.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-8 space-y-10">
            {/* Tabs */}
            <div className="flex gap-2 bg-surface-container p-1 rounded-xl w-fit">
              {(['portfolio', 'history'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-2 rounded-lg font-bold text-sm transition-colors capitalize ${
                    activeTab === tab
                      ? 'bg-white shadow-sm text-primary'
                      : 'text-on-surface-variant hover:bg-white/50'
                  }`}
                >
                  {tab === 'portfolio' ? 'Portfolio' : 'Job History'}
                </button>
              ))}
            </div>

            {/* Portfolio */}
            {activeTab === 'portfolio' && (
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-extrabold text-on-surface font-headline">
                    Past Work Portfolio
                  </h2>
                  <a href="#" className="text-primary font-bold text-sm hover:underline">
                    View All
                  </a>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {worker.portfolio?.map((item) => (
                    <div
                      key={item.id}
                      className="relative group aspect-square rounded-2xl overflow-hidden shadow-sm"
                    >
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                        <span className="text-white text-xs font-bold uppercase tracking-widest">
                          {item.title}
                        </span>
                      </div>
                    </div>
                  ))}

                  {/* Add Project CTA */}
                  <div className="col-span-2 md:col-span-3 bg-surface-container-low rounded-2xl p-6 flex items-center justify-between border-2 border-dashed border-outline-variant/30">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined">add_photo_alternate</span>
                      </div>
                      <div>
                        <p className="font-bold text-on-surface">Have a specific project in mind?</p>
                        <p className="text-sm text-on-surface-variant">
                          {worker.name.split(' ')[0]} has handled 40+ customised requests.
                        </p>
                      </div>
                    </div>
                    <button className="text-primary font-bold hover:scale-105 transition-transform">
                      Inquire Now
                    </button>
                  </div>
                </div>
              </section>
            )}

            {/* Job History */}
            {activeTab === 'history' && (
              <section>
                <h2 className="text-2xl font-extrabold text-on-surface mb-6 font-headline">
                  Recent Performance
                </h2>
                <div className="space-y-4">
                  {worker.recentJobs?.map((job: CompletedJob) => (
                    <div
                      key={job.id}
                      className="bg-surface-container-lowest p-6 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-outline-variant/10 shadow-sm"
                    >
                      <div className="flex gap-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-primary shrink-0">
                          <span className="material-symbols-outlined">{job.icon}</span>
                        </div>
                        <div>
                          <h4 className="font-bold text-on-surface">{job.title}</h4>
                          <p className="text-xs text-on-surface-variant font-medium">
                            Completed {job.completedDate}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-8">
                        <div className="text-right">
                          <StarRating count={job.rating} />
                          <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">
                            {job.ratingLabel}
                          </p>
                        </div>
                        <span className="material-symbols-outlined text-outline-variant cursor-pointer hover:text-primary transition-colors">
                          chevron_right
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
