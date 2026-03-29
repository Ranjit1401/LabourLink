import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../utils/api';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

type AppStatus = 'pending' | 'approved' | 'rejected';

interface Applicant {
  user_email: string;
  status: AppStatus;
  applied_at: string;
}

interface Project {
  _id: string;
  title: string;
  location: string;
  wage: string;
  wageUnit: string;
  status: string;
  postedAt: string;
  applicants?: Applicant[];
}

type TabFilter = 'all' | 'pending' | 'approved' | 'completed';

const getHeaders = (): Record<string, string> => {
    const token = localStorage.getItem('token');
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return headers;
  };

export default function MyProjectsPage() {
  const { showToast } = useApp();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<TabFilter>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Bulk rating state
  const [ratingProjectId, setRatingProjectId] = useState<string | null>(null);
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [submittingRatings, setSubmittingRatings] = useState(false);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const jobs = await api.getJobs();
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      // Filter only this contractor's jobs
      const mine = jobs.filter((j: any) => j.created_by === user.email || j.company === user.name);
      // Fetch applicants for each job
      const withApplicants = await Promise.all(
        mine.map(async (job: any) => {
          try {
            const applicants = await fetch(`${BASE_URL}/job-applicants/${job._id}`, { headers: getHeaders() }).then(r => r.json());
            return { ...job, applicants: Array.isArray(applicants) ? applicants : [] };
          } catch {
            return { ...job, applicants: [] };
          }
        })
      );
      setProjects(withApplicants);
    } catch (e) {
      showToast('Failed to load projects', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (jobId: string, workerEmail: string, status: 'approved' | 'rejected') => {
    try {
      await fetch(`${BASE_URL}/approve-applicant`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify({ job_id: jobId, worker_email: workerEmail, status }),
      });
      showToast(`Worker ${status === 'approved' ? 'approved ✅' : 'rejected'}`, status === 'approved' ? 'success' : 'info');
      // Update local state
      setProjects(prev => prev.map(p =>
        p._id === jobId
          ? { ...p, applicants: p.applicants?.map(a => a.user_email === workerEmail ? { ...a, status } : a) }
          : p
      ));
    } catch {
      showToast('Failed to update status', 'error');
    }
  };

  const handleBulkRate = async (jobId: string) => {
    const project = projects.find(p => p._id === jobId);
    const approvedWorkers = project?.applicants?.filter(a => a.status === 'approved') || [];
    if (approvedWorkers.length === 0) {
      showToast('No approved workers to rate', 'error');
      return;
    }
    // Initialize all workers with 5 stars default
    const init: Record<string, number> = {};
    approvedWorkers.forEach(w => { init[w.user_email] = 5; });
    setRatings(init);
    setRatingProjectId(jobId);
  };

  const submitBulkRatings = async () => {
    if (!ratingProjectId) return;
    setSubmittingRatings(true);
    try {
      const ratingsArr = Object.entries(ratings).map(([email, rating]) => ({ email, rating }));
      await fetch(`${BASE_URL}/bulk-rate`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ job_id: ratingProjectId, ratings: ratingsArr }),
      });
      showToast('All workers rated & project marked complete! 🎉', 'success');
      setRatingProjectId(null);
      setRatings({});
      loadProjects();
    } catch {
      showToast('Failed to submit ratings', 'error');
    } finally {
      setSubmittingRatings(false);
    }
  };

  const tabs: { key: TabFilter; label: string; icon: string }[] = [
    { key: 'all', label: 'All Projects', icon: 'folder' },
    { key: 'pending', label: 'Pending Approvals', icon: 'pending' },
    { key: 'approved', label: 'Active / Approved', icon: 'check_circle' },
    { key: 'completed', label: 'Completed', icon: 'task_alt' },
  ];

  const filteredProjects = projects.filter(p => {
    if (tab === 'all') return true;
    if (tab === 'pending') return p.applicants?.some(a => a.status === 'pending');
    if (tab === 'approved') return p.applicants?.some(a => a.status === 'approved') && p.status !== 'completed';
    if (tab === 'completed') return p.status === 'completed';
    return true;
  });

  const pendingCount = projects.reduce((sum, p) => sum + (p.applicants?.filter(a => a.status === 'pending').length || 0), 0);

  const ratingProject = projects.find(p => p._id === ratingProjectId);
  const approvedForRating = ratingProject?.applicants?.filter(a => a.status === 'approved') || [];

  return (
    <div className="bg-surface font-body text-on-surface min-h-screen pb-24">
      <div className="max-w-5xl mx-auto px-6 pt-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="font-headline text-4xl font-extrabold tracking-tight mb-1">My Projects</h1>
          <p className="text-on-surface-variant">Manage your posted jobs, approve workers, and rate completed projects.</p>
        </div>

        {/* Tab Bar */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-1">
          {tabs.map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${
                tab === key
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">{icon}</span>
              {label}
              {key === 'pending' && pendingCount > 0 && (
                <span className="bg-error text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                  {pendingCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <span className="material-symbols-outlined text-primary text-5xl animate-spin">progress_activity</span>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-20 text-on-surface-variant">
            <span className="material-symbols-outlined text-6xl mb-4 block">folder_open</span>
            <p className="font-bold text-lg">No projects here yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredProjects.map(project => {
              const pending = project.applicants?.filter(a => a.status === 'pending') || [];
              const approved = project.applicants?.filter(a => a.status === 'approved') || [];
              const isExpanded = expandedId === project._id;

              return (
                <div key={project._id} className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 overflow-hidden shadow-sm">

                  {/* Project Header */}
                  <div
                    className="p-6 flex items-center gap-4 cursor-pointer hover:bg-surface-container/40 transition-colors"
                    onClick={() => setExpandedId(isExpanded ? null : project._id)}
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-primary">work</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-lg truncate">{project.title}</h3>
                      <div className="flex gap-4 text-sm text-on-surface-variant flex-wrap">
                        <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">location_on</span>{project.location}</span>
                        <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">payments</span>{project.wage}/{project.wageUnit || 'day'}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      {pending.length > 0 && (
                        <span className="flex items-center gap-1 bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full">
                          <span className="material-symbols-outlined text-sm">schedule</span>{pending.length} pending
                        </span>
                      )}
                      {approved.length > 0 && (
                        <span className="flex items-center gap-1 bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full">
                          <span className="material-symbols-outlined text-sm">group</span>{approved.length} approved
                        </span>
                      )}
                      <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                        project.status === 'completed' ? 'bg-surface-container text-on-surface-variant' :
                        project.status === 'open' ? 'bg-secondary-container text-on-secondary-container' :
                        'bg-surface-container text-on-surface-variant'
                      }`}>
                        {project.status === 'completed' ? 'COMPLETED' : 'ACTIVE'}
                      </span>
                      <span className={`material-symbols-outlined text-on-surface-variant transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                        expand_more
                      </span>
                    </div>
                  </div>

                  {/* Expanded: Worker List */}
                  {isExpanded && (
                    <div className="border-t border-outline-variant/10 px-6 pb-6 pt-4">

                      {project.applicants?.length === 0 ? (
                        <p className="text-sm text-on-surface-variant text-center py-4">No applicants yet for this project.</p>
                      ) : (
                        <>
                          {/* Pending Workers */}
                          {pending.length > 0 && (
                            <div className="mb-6">
                              <h4 className="font-bold text-sm uppercase tracking-widest text-amber-700 mb-3 flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">pending</span>
                                Pending Approval ({pending.length})
                              </h4>
                              <div className="space-y-2">
                                {pending.map(worker => (
                                  <div key={worker.user_email} className="flex items-center justify-between p-4 bg-amber-50 rounded-xl border border-amber-100">
                                    <div className="flex items-center gap-3">
                                      <div className="w-9 h-9 rounded-full bg-amber-500 flex items-center justify-center text-white font-bold text-sm">
                                        {worker.user_email.charAt(0).toUpperCase()}
                                      </div>
                                      <div>
                                        <p className="font-bold text-sm">{worker.user_email}</p>
                                        <p className="text-xs text-on-surface-variant">Applied {new Date(worker.applied_at).toLocaleDateString()}</p>
                                      </div>
                                    </div>
                                    <div className="flex gap-2">
                                      <button
                                        onClick={() => handleApprove(project._id, worker.user_email, 'approved')}
                                        className="flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white text-xs font-bold rounded-lg hover:bg-green-600 transition-colors"
                                      >
                                        <span className="material-symbols-outlined text-sm">check</span> Approve
                                      </button>
                                      <button
                                        onClick={() => handleApprove(project._id, worker.user_email, 'rejected')}
                                        className="flex items-center gap-1 px-3 py-1.5 bg-surface-container text-error text-xs font-bold rounded-lg hover:bg-error/10 transition-colors"
                                      >
                                        <span className="material-symbols-outlined text-sm">close</span> Reject
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Approved Workers */}
                          {approved.length > 0 && (
                            <div className="mb-6">
                              <h4 className="font-bold text-sm uppercase tracking-widest text-green-700 mb-3 flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">check_circle</span>
                                Approved Workers ({approved.length})
                              </h4>
                              <div className="space-y-2">
                                {approved.map(worker => (
                                  <div key={worker.user_email} className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-100">
                                    <div className="flex items-center gap-3">
                                      <div className="w-9 h-9 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-sm">
                                        {worker.user_email.charAt(0).toUpperCase()}
                                      </div>
                                      <div>
                                        <p className="font-bold text-sm">{worker.user_email}</p>
                                        <p className="text-xs text-green-700 font-semibold">✓ Approved for this project</p>
                                      </div>
                                    </div>
                                    <span className="text-xs font-bold text-green-700 bg-green-100 px-3 py-1 rounded-full">ACTIVE</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Complete Project Button */}
                          {approved.length > 0 && project.status !== 'completed' && (
                            <button
                              onClick={() => handleBulkRate(project._id)}
                              className="w-full py-3 bg-primary text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-md"
                            >
                              <span className="material-symbols-outlined">star</span>
                              Mark Complete & Rate All Workers
                            </button>
                          )}

                          {project.status === 'completed' && (
                            <div className="text-center py-3 text-green-700 font-bold flex items-center justify-center gap-2">
                              <span className="material-symbols-outlined">task_alt</span>
                              Project Completed & Workers Rated
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ───── BULK RATING MODAL ───── */}
      {ratingProjectId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-surface-container-lowest w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">

            <div className="bg-primary px-6 py-5">
              <h2 className="text-white font-bold text-xl">Rate Your Team</h2>
              <p className="text-white/80 text-sm mt-1">
                {ratingProject?.title} — Rate all {approvedForRating.length} workers at once
              </p>
            </div>

            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
              {approvedForRating.map(worker => (
                <div key={worker.user_email} className="flex items-center justify-between p-4 bg-surface-container rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                      {worker.user_email.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-sm">{worker.user_email}</p>
                      <p className="text-xs text-on-surface-variant">Tap stars to rate</p>
                    </div>
                  </div>
                  {/* Star Rating */}
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        onClick={() => setRatings(prev => ({ ...prev, [worker.user_email]: star }))}
                        className="transition-transform hover:scale-110 active:scale-95"
                      >
                        <span
                          className="material-symbols-outlined text-2xl"
                          style={{
                            color: star <= (ratings[worker.user_email] || 5) ? '#f59e0b' : '#d1d5db',
                            fontVariationSettings: star <= (ratings[worker.user_email] || 5) ? "'FILL' 1" : "'FILL' 0"
                          }}
                        >
                          star
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="px-6 pb-6 flex gap-3">
              <button
                onClick={() => { setRatingProjectId(null); setRatings({}); }}
                className="flex-1 py-3 bg-surface-container font-bold rounded-xl text-on-surface"
              >
                Cancel
              </button>
              <button
                onClick={submitBulkRatings}
                disabled={submittingRatings}
                className="flex-1 py-3 bg-primary text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-60"
              >
                <span className="material-symbols-outlined text-sm">send</span>
                {submittingRatings ? 'Submitting...' : 'Submit All Ratings'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}