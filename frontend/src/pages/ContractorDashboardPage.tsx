import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MOCK_STATS, MOCK_RATINGS } from '../utils/mockData';

export default function ContractorDashboardPage() {
  const { contractorJobs, addContractorJob, showToast } = useApp();
  const stats = MOCK_STATS;
  const [showPostForm, setShowPostForm] = useState(false);
  const [jobTitle, setJobTitle] = useState('');
  const [jobLocation, setJobLocation] = useState('');
  const [jobWage, setJobWage] = useState('');
  const [jobDesc, setJobDesc] = useState('');
  const [jobSkills, setJobSkills] = useState('');

  const handlePostJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobTitle.trim() || !jobLocation.trim() || !jobWage.trim()) {
      showToast('Please fill in all required fields', 'error');
      return;
    }
    const newJob = {
      id: 'cj-' + Date.now(),
      title: jobTitle,
      company: 'My Company',
      location: jobLocation,
      wage: jobWage,
      wageUnit: 'hr' as const,
      skills: jobSkills.split(',').map(s => s.trim()).filter(Boolean),
      description: jobDesc,
      postedAt: 'Just now',
      status: 'open' as const,
      icon: 'work',
      applicants: 0,
      type: 'immediate' as const,
      postedBy: 'contractor',
    };
    addContractorJob(newJob);
    showToast('Job posted successfully! It will appear in the worker feed.', 'success');
    setShowPostForm(false);
    setJobTitle(''); setJobLocation(''); setJobWage(''); setJobDesc(''); setJobSkills('');
  };

  return (
    <div className="bg-surface font-body text-on-surface min-h-screen pb-24">
      <div className="flex pt-4 min-h-screen">
        {/* Side Nav */}
        <aside className="hidden md:flex flex-col gap-2 p-4 h-screen w-64 border-r border-slate-200 bg-slate-50 sticky top-20">
          <div className="mb-6 px-4 py-2">
            <h2 className="font-headline text-xl font-bold text-blue-700">Contractor Portal</h2>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Verified Member</p>
          </div>
          <nav className="flex flex-col gap-1">
            <div className="flex items-center gap-3 bg-blue-50 text-blue-700 rounded-lg px-4 py-2 font-semibold text-sm">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>event_note</span>
              Dashboard
            </div>
            <a href="/jobs" className="flex items-center gap-3 hover:bg-slate-200 text-slate-600 px-4 py-2 font-semibold text-sm rounded-lg transition-all">
              <span className="material-symbols-outlined">work</span> Posted Jobs
            </a>
            <a href="/feed" className="flex items-center gap-3 hover:bg-slate-200 text-slate-600 px-4 py-2 font-semibold text-sm rounded-lg transition-all">
              <span className="material-symbols-outlined">payments</span> Earnings
            </a>
            <a href="/rating" className="flex items-center gap-3 hover:bg-slate-200 text-slate-600 px-4 py-2 font-semibold text-sm rounded-lg transition-all">
              <span className="material-symbols-outlined">verified_user</span> Ratings
            </a>
          </nav>
          <div className="mt-auto p-4 bg-surface-container rounded-xl">
            <p className="text-xs text-on-surface-variant mb-3">Need more hands?</p>
            <a href="/jobs" className="block w-full text-center py-2 px-4 bg-primary text-on-primary rounded-lg font-bold text-sm active:scale-95 transition-transform">
              Find Workers
            </a>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 md:ml-0 p-6 md:p-10 bg-surface">
          <div className="max-w-5xl mx-auto">
            {/* Header & CTA */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
              <div>
                <h1 className="font-headline text-4xl md:text-5xl font-extrabold text-on-surface tracking-tight mb-2">Welcome back, Marcus</h1>
                <p className="text-on-surface-variant text-lg">Manage your active recruitment and workforce operations.</p>
              </div>
              <button
                onClick={() => setShowPostForm(!showPostForm)}
                className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary to-primary-dim text-white font-headline font-bold rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-95"
              >
                <span className="material-symbols-outlined">{showPostForm ? 'close' : 'add'}</span>
                {showPostForm ? 'Cancel' : 'Post New Job'}
              </button>
            </div>

            {/* Post Job Form */}
            {showPostForm && (
              <div className="bg-surface-container-lowest rounded-xl p-8 shadow-lg border border-outline-variant/10 mb-10">
                <h2 className="font-headline text-2xl font-bold mb-6">Create Job Posting</h2>
                <form onSubmit={handlePostJob} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-on-surface">Job Title *</label>
                      <input
                        className="w-full h-12 px-4 bg-surface-container-highest border-none rounded-xl focus:ring-2 focus:ring-primary text-on-surface"
                        placeholder="e.g., Senior Site Foreman"
                        value={jobTitle} onChange={e => setJobTitle(e.target.value)} required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-on-surface">Location *</label>
                      <input
                        className="w-full h-12 px-4 bg-surface-container-highest border-none rounded-xl focus:ring-2 focus:ring-primary text-on-surface"
                        placeholder="e.g., Downtown Metro Project"
                        value={jobLocation} onChange={e => setJobLocation(e.target.value)} required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-on-surface">Wage *</label>
                      <input
                        className="w-full h-12 px-4 bg-surface-container-highest border-none rounded-xl focus:ring-2 focus:ring-primary text-on-surface"
                        placeholder="e.g., $45 - $55"
                        value={jobWage} onChange={e => setJobWage(e.target.value)} required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-on-surface">Required Skills (comma-separated)</label>
                      <input
                        className="w-full h-12 px-4 bg-surface-container-highest border-none rounded-xl focus:ring-2 focus:ring-primary text-on-surface"
                        placeholder="e.g., Carpentry, Safety, Formwork"
                        value={jobSkills} onChange={e => setJobSkills(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-on-surface">Description</label>
                    <textarea
                      className="w-full p-4 bg-surface-container-highest border-none rounded-xl focus:ring-2 focus:ring-primary text-on-surface"
                      rows={3}
                      placeholder="Describe the job requirements..."
                      value={jobDesc} onChange={e => setJobDesc(e.target.value)}
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-8 py-4 bg-gradient-to-r from-primary to-primary-dim text-white font-bold rounded-xl shadow-lg hover:opacity-90 active:scale-95 transition-all flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined">publish</span> Publish Job
                  </button>
                </form>
              </div>
            )}

            {/* Stats Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-surface-container-lowest p-6 rounded-xl border-b-4 border-primary/10 flex flex-col gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary">work</span>
                </div>
                <div>
                  <span className="text-on-surface-variant text-sm font-medium uppercase tracking-widest">Active Jobs</span>
                  <h3 className="text-4xl font-headline font-extrabold text-on-surface mt-1">{stats.activeJobs}</h3>
                </div>
                <div className="text-xs text-secondary font-semibold flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">trending_up</span> +2 from last month
                </div>
              </div>
              <div className="bg-surface-container-lowest p-6 rounded-xl border-b-4 border-secondary/10 flex flex-col gap-4">
                <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-secondary">group</span>
                </div>
                <div>
                  <span className="text-on-surface-variant text-sm font-medium uppercase tracking-widest">Applicants</span>
                  <h3 className="text-4xl font-headline font-extrabold text-on-surface mt-1">{stats.applicants}</h3>
                </div>
                <div className="text-xs text-primary font-semibold flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">pending_actions</span> 15 new today
                </div>
              </div>
              <div className="bg-surface-container-lowest p-6 rounded-xl border-b-4 border-tertiary/10 flex flex-col gap-4">
                <div className="w-12 h-12 rounded-full bg-tertiary/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-tertiary">person_check</span>
                </div>
                <div>
                  <span className="text-on-surface-variant text-sm font-medium uppercase tracking-widest">Total Hires</span>
                  <h3 className="text-4xl font-headline font-extrabold text-on-surface mt-1">{stats.totalHires}</h3>
                </div>
                <div className="text-xs text-on-surface-variant font-medium">All-time success rate: 98%</div>
              </div>
            </div>

            {/* Posted Jobs List */}
            <div className="bg-surface-container-low rounded-xl p-1 mb-12">
              <div className="bg-surface-container-lowest rounded-lg overflow-hidden">
                <div className="px-6 py-4 flex items-center justify-between border-b border-surface-variant/30">
                  <h2 className="font-headline text-xl font-bold">Manage Active Recruitment</h2>
                  <div className="flex gap-2">
                    <button className="p-2 hover:bg-surface-container rounded-lg"><span className="material-symbols-outlined text-on-surface-variant">filter_list</span></button>
                    <button className="p-2 hover:bg-surface-container rounded-lg"><span className="material-symbols-outlined text-on-surface-variant">search</span></button>
                  </div>
                </div>
                <div className="divide-y divide-surface-variant/20">
                  {contractorJobs.map(job => (
                    <div key={job.id} className="p-6 flex flex-col md:flex-row md:items-center gap-6 hover:bg-surface-container-low/50 transition-colors group">
                      <div className="w-16 h-16 rounded-xl bg-surface-dim flex items-center justify-center flex-shrink-0">
                        <span className="material-symbols-outlined text-primary text-2xl">{job.icon || 'work'}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-1">
                          <h4 className="font-headline font-bold text-lg text-on-surface">{job.title}</h4>
                          <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                            job.status === 'open' ? 'bg-secondary-container text-on-secondary-container' : 'bg-surface-container text-on-surface-variant'
                          }`}>
                            {job.status === 'open' ? 'ACTIVE' : 'CLOSED'}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm text-on-surface-variant">
                          <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">location_on</span>{job.location}</span>
                          <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">payments</span>{job.wage} /hr</span>
                          <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">calendar_today</span>{job.postedAt}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-8">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-primary font-headline">{job.applicants ?? 0}</div>
                          <div className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Applicants</div>
                        </div>
                        <button className="px-4 py-2 bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-semibold text-sm rounded-lg transition-colors">Manage</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Contractor Reputation Section */}
            <div className="bg-surface-container-lowest rounded-xl p-8 shadow-sm border border-outline-variant/10">
              <h2 className="font-headline text-2xl font-bold mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">workspace_premium</span> Contractor Reputation
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center p-6 bg-surface-container rounded-xl">
                  <div className="text-4xl font-extrabold text-primary mb-1">4.8</div>
                  <p className="text-sm text-on-surface-variant font-medium">Average Rating</p>
                  <div className="flex justify-center gap-1 mt-2 text-amber-500">
                    {[1,2,3,4,5].map(s => (
                      <span key={s} className="material-symbols-outlined text-sm" style={{ fontVariationSettings: s <= 4 ? "'FILL' 1" : "'FILL' 0" }}>star</span>
                    ))}
                  </div>
                </div>
                <div className="text-center p-6 bg-surface-container rounded-xl">
                  <div className="text-4xl font-extrabold text-secondary mb-1">98%</div>
                  <p className="text-sm text-on-surface-variant font-medium">On-Time Payment</p>
                </div>
                <div className="text-center p-6 bg-surface-container rounded-xl">
                  <div className="text-4xl font-extrabold text-tertiary mb-1">{MOCK_RATINGS.length}</div>
                  <p className="text-sm text-on-surface-variant font-medium">Worker Reviews</p>
                </div>
              </div>
              <div className="space-y-4">
                {MOCK_RATINGS.slice(0, 2).map(review => (
                  <div key={review.id} className="p-4 bg-surface-container-low rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-on-surface">{review.contractorName}</span>
                      <div className="flex items-center text-amber-500">
                        {[1,2,3,4,5].map(s => (
                          <span key={s} className="material-symbols-outlined text-xs" style={{ fontVariationSettings: s <= review.score ? "'FILL' 1" : "'FILL' 0" }}>star</span>
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-on-surface-variant">{review.comment}</p>
                    <p className="text-xs text-outline mt-2">{review.createdAt}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
