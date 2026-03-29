import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { t } from '../utils/i18n';
import { api } from '../utils/api';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const getHeaders = (): Record<string, string> => {
  const token = localStorage.getItem('token');
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
};

export default function ContractorDashboardPage() {
  const { contractorJobs, addContractorJob, showToast } = useApp();
  const navigate = useNavigate();
  const [showPostForm, setShowPostForm] = useState(false);
  const [jobTitle, setJobTitle] = useState('');
  const [jobLocation, setJobLocation] = useState('');
  const [jobWage, setJobWage] = useState('');
  const [jobDesc, setJobDesc] = useState('');
  const [jobSkills, setJobSkills] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);
  const [myJobs, setMyJobs] = useState<any[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [applications, setApplications] = useState<any[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [loadingApplicants, setLoadingApplicants] = useState(false);
  const language = 'en';
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const userStr = localStorage.getItem('user');
        if (!userStr) return;
        const userObj = JSON.parse(userStr);

        if (userObj.email) {
          const realData = await api.getProfile(userObj.email);
          setProfileData(realData);
        }

        setLoadingJobs(true);
        const allJobs = await api.getJobs();
        const mine = allJobs.filter(
          (j: any) => j.created_by === userObj.email || j.company === userObj.name
        );
        setMyJobs(mine);
      } catch (error) {
        console.error('Failed to load dashboard data', error);
        showToast('Failed to load dashboard data', 'error');
      } finally {
        setLoadingJobs(false);
      }
    };
    fetchAll();
  }, []);

  const contractorName = profileData?.name || 'Contractor';
  const averageRating = profileData?.average_rating || 0;
  const totalHires = profileData?.jobs_done || 0;

  const handlePostJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobTitle.trim() || !jobLocation.trim() || !jobWage.trim()) {
      showToast('Please fill all required fields', 'error');
      return;
    }
    setIsSubmitting(true);
    try {
      const jobData = {
        title: jobTitle,
        company: contractorName,
        location: jobLocation,
        wage: jobWage,
        wageUnit: 'day',
        skills: jobSkills.split(',').map(s => s.trim()).filter(Boolean),
        description: jobDesc,
        status: 'open',
        icon: 'work',
        applicants: 0,
      };
      await api.createJob(jobData);
      addContractorJob({ ...jobData, wageUnit: 'day' as const, status: 'open' as const, id: 'temp-' + Date.now(), postedAt: 'Just now' });
      showToast('Job posted successfully!', 'success');
      setShowPostForm(false);
      setJobTitle(''); setJobLocation(''); setJobWage(''); setJobDesc(''); setJobSkills('');
    } catch (error: any) {
      showToast(error.message || t('en', 'failedToPostJob'), 'error'); // Replace 'en' with the appropriate language code if needed
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleManage = async (jobId: string) => {
    if (selectedJobId === jobId) {
      setSelectedJobId(null);
      return;
    }
    setSelectedJobId(jobId);
    setLoadingApplicants(true);
    try {
      const res = await fetch(`${BASE_URL}/job-applicants/${jobId}`, { headers: getHeaders() });
      const data = await res.json();
      setApplications(Array.isArray(data) ? data : []);
    } catch (error) {
      showToast(t(language, 'failedToLoadApplicants'), 'error');
    } finally {
      setLoadingApplicants(false);
    }
  };

  const copyReferralCode = () => {
    const code = `REF-${contractorName.substring(0, 4).toUpperCase()}-2024`;
    navigator.clipboard.writeText(code);
    showToast(t(language, 'referralCodeCopied').replace('{code}', code), 'success');
  };

  return (
    <div className="bg-surface font-body text-on-surface min-h-screen pb-24">
      <div className="flex pt-4 min-h-screen">

        {/* Side Nav */}
        <aside className="hidden md:flex flex-col gap-2 p-4 h-screen w-64 border-r border-slate-200 bg-slate-50 sticky top-20">
          <div className="mb-6 px-4 py-2">
            <h2 className="font-headline text-xl font-bold text-blue-700">{t(language, 'contractorPortal')}</h2>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{t(language, 'verifiedEmployer')}</p>
          </div>
          <nav className="flex flex-col gap-1">
            <div className="flex items-center gap-3 bg-blue-50 text-blue-700 rounded-lg px-4 py-2 font-semibold text-sm">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>event_note</span>
              {t(language, 'dashboard')}
            </div>
            <a href="/jobs" className="flex items-center gap-3 hover:bg-slate-200 text-slate-600 px-4 py-2 font-semibold text-sm rounded-lg transition-all">
              <span className="material-symbols-outlined">work</span> {t(language, 'postedJobs')}
            </a>
            <a href="/feed" className="flex items-center gap-3 hover:bg-slate-200 text-slate-600 px-4 py-2 font-semibold text-sm rounded-lg transition-all">
              <span className="material-symbols-outlined">dynamic_feed</span> {t(language, 'feed')}
            </a>
            <a href="/notifications" className="flex items-center gap-3 hover:bg-slate-200 text-slate-600 px-4 py-2 font-semibold text-sm rounded-lg transition-all">
              <span className="material-symbols-outlined">notifications</span> {t(language, 'notificationsTitle')}
            </a>
          </nav>
          <div className="mt-auto p-4 bg-surface-container rounded-xl">
            <p className="text-xs text-on-surface-variant mb-3">{t(language, 'needMoreHands')}</p>
            <a href="/jobs" className="block w-full text-center py-2 px-4 bg-primary text-on-primary rounded-lg font-bold text-sm">
              {t(language, 'findWorkers')}
            </a>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-10 bg-surface">
          <div className="max-w-5xl mx-auto">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
              <div>
                <h1 className="font-headline text-4xl md:text-5xl font-extrabold text-on-surface tracking-tight mb-2">
                  Welcome back, {contractorName.split(' ')[0]}!
                </h1>
                <p className="text-on-surface-variant text-lg">Manage your active recruitment and workforce operations.</p>
              </div>
              <button
                onClick={() => setShowPostForm(!showPostForm)}
                className="flex items-center gap-2 px-8 py-4 bg-primary text-white font-bold rounded-xl shadow-lg hover:opacity-90 transition-all active:scale-95"
              >
                <span className="material-symbols-outlined">{showPostForm ? 'close' : 'add'}</span>
                {showPostForm ? t(language, 'cancel') : t(language, 'postNewJob')}
              </button>
            </div>

            {/* Post Job Form */}
            {showPostForm && (
              <div className="bg-surface-container-lowest rounded-xl p-8 shadow-lg border border-outline-variant/10 mb-10">
                <h2 className="font-headline text-2xl font-bold mb-6">{t(language, 'createJobPosting')}</h2>
                <form onSubmit={handlePostJob} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold">{t(language, 'jobTitle')}</label>
                      <input className="w-full h-12 px-4 bg-surface-container-highest border-none rounded-xl focus:ring-2 focus:ring-primary text-on-surface"
                        placeholder={t(language, 'jobTitlePlaceholder')} value={jobTitle} onChange={e => setJobTitle(e.target.value)} required />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold">{t(language, 'location')}</label>
                      <input className="w-full h-12 px-4 bg-surface-container-highest border-none rounded-xl focus:ring-2 focus:ring-primary text-on-surface"
                        placeholder={t(language, 'locationPlaceholder')} value={jobLocation} onChange={e => setJobLocation(e.target.value)} required />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold">{t(language, 'wage')} *</label>
                      <input className="w-full h-12 px-4 bg-surface-container-highest border-none rounded-xl focus:ring-2 focus:ring-primary text-on-surface"
                        placeholder={t(language, 'wagePlaceholder')} value={jobWage} onChange={e => setJobWage(e.target.value)} required />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold">{t(language, 'requiredSkills')}</label>
                      <input className="w-full h-12 px-4 bg-surface-container-highest border-none rounded-xl focus:ring-2 focus:ring-primary text-on-surface"
                        placeholder={t(language, 'requiredSkillsPlaceholder')} value={jobSkills} onChange={e => setJobSkills(e.target.value)} />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold">{t(language, 'description')}</label>
                    <textarea className="w-full p-4 bg-surface-container-highest border-none rounded-xl focus:ring-2 focus:ring-primary text-on-surface"
                      rows={3} placeholder={t(language, 'jobDescriptionPlaceholder')} value={jobDesc} onChange={e => setJobDesc(e.target.value)} />
                  </div>
                  <button type="submit" disabled={isSubmitting}
                    className={`px-8 py-4 bg-primary text-white font-bold rounded-xl shadow-lg transition-all flex items-center gap-2 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:opacity-90 active:scale-95'}`}>
                    <span className="material-symbols-outlined">{isSubmitting ? 'hourglass_empty' : 'publish'}</span>
                    {isSubmitting ? t(language, 'publishing') : t(language, 'publishJob')}
                  </button>
                </form>
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-surface-container-lowest p-6 rounded-xl border-b-4 border-primary/20 flex flex-col gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary">work</span>
                </div>
                <div>
                  <span className="text-on-surface-variant text-sm font-medium uppercase tracking-widest">Active Jobs</span>
                  <h3 className="text-4xl font-extrabold text-on-surface mt-1">{contractorJobs.length}</h3>
                </div>
              </div>
              <div className="bg-surface-container-lowest p-6 rounded-xl border-b-4 border-secondary/20 flex flex-col gap-4">
                <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-secondary">star</span>
                </div>
                <div>
                  <span className="text-on-surface-variant text-sm font-medium uppercase tracking-widest">{t(language, 'avgRating')}</span>
                  <h3 className="text-4xl font-extrabold text-on-surface mt-1">{averageRating || '—'}</h3>
                </div>
              </div>
              <div className="bg-surface-container-lowest p-6 rounded-xl border-b-4 border-tertiary/20 flex flex-col gap-4">
                <div className="w-12 h-12 rounded-full bg-tertiary/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-tertiary">person_check</span>
                </div>
                <div>
                  <span className="text-on-surface-variant text-sm font-medium uppercase tracking-widest">{t(language, 'jobsDone')}</span>
                  <h3 className="text-4xl font-extrabold text-on-surface mt-1">{totalHires}</h3>
                </div>
              </div>
            </div>

            {/* Posted Jobs List */}
            <div className="bg-surface-container-lowest rounded-xl overflow-hidden border border-outline-variant/10 mb-12">
              <div className="px-6 py-4 border-b border-surface-variant/30">
                <h2 className="font-headline text-xl font-bold">{t(language, 'manageActiveRecruitment')}</h2>
              </div>
              <div className="divide-y divide-surface-variant/20">
                {loadingJobs ? (
                  <div className="p-8 text-center text-on-surface-variant">
                    <span className="material-symbols-outlined text-primary text-4xl animate-spin">progress_activity</span>
                  </div>
                ) : myJobs.length === 0 ? (
                  <div className="p-8 text-center text-on-surface-variant">
                    {t(language, 'noJobsPostedYet')}
                  </div>
                ) : (
                  myJobs.map(job => (
                    <div key={job._id || job.id}>
                      <div className="p-6 flex flex-col md:flex-row md:items-center gap-6 hover:bg-surface-container-low/50 transition-colors">
                        <div className="w-16 h-16 rounded-xl bg-surface-dim flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-primary text-2xl">{job.icon || 'work'}</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-1">
                            <h4 className="font-bold text-lg text-on-surface">{job.title}</h4>
                            <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                              job.status === 'open' ? 'bg-secondary-container text-on-secondary-container' : 'bg-surface-container text-on-surface-variant'
                            }`}>
                              {job.status === 'open' ? 'ACTIVE' : 'CLOSED'}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-4 text-sm text-on-surface-variant">
                            <span className="flex items-center gap-1">
                              <span className="material-symbols-outlined text-sm">location_on</span>{job.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <span className="material-symbols-outlined text-sm">payments</span>{job.wage}/{job.wageUnit || 'day'}
                            </span>
                            <span className="flex items-center gap-1">
                              <span className="material-symbols-outlined text-sm">calendar_today</span>{job.postedAt || 'Recently'}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleManage(job._id || job.id)}
                          className="px-4 py-2 bg-primary text-white font-semibold text-sm rounded-lg hover:opacity-90 transition-colors"
                        >
                          {selectedJobId === ((job as any)._id || job.id) ? 'Hide' : 'View Applicants'}
                        </button>
                      </div>

                      {/* Applicants Panel */}
                      {selectedJobId === (job._id || job.id) && (
                        <div className="px-6 pb-6 bg-surface-container/30">
                          <h3 className="font-bold text-on-surface mb-3 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary text-sm">group</span>
                            {t(language, 'applicantsFor').replace('{title}', job.title)}
                          </h3>
                          {loadingApplicants ? (
                            <p className="text-sm text-on-surface-variant">{t(language, 'loadingApplicants')}</p>
                          ) : applications.length === 0 ? (
                            <p className="text-sm text-on-surface-variant">{t(language, 'noApplicantsYet')}</p>
                          ) : (
                            <div className="space-y-3">
                              {applications.map((app: any, idx: number) => (
                                <div key={idx} className="flex items-center justify-between p-4 bg-surface-container-lowest rounded-xl border border-outline-variant/10">
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm">
                                      {app.user_email?.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                      <p className="font-bold text-on-surface text-sm">{app.user_email}</p>
                                      <p className="text-xs text-on-surface-variant">
                                        Applied: {new Date(app.applied_at).toLocaleDateString()}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                                      app.status === 'pending'
                                        ? 'bg-amber-100 text-amber-800'
                                        : app.status === 'accepted'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                    }`}>
                                      {app.status}
                                    </span>
                                    <button
                                      onClick={() => navigate('/rating', { state: { email: app.user_email, name: app.user_email } })}
                                      className="px-3 py-1 text-xs font-bold bg-surface-container text-primary rounded-lg hover:bg-primary/10 transition-colors"
                                    >
                                      Rate
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Reputation */}
            <div className="bg-surface-container-lowest rounded-xl p-8 shadow-sm border border-outline-variant/10 mb-12">
              <h2 className="font-headline text-2xl font-bold mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">workspace_premium</span> {t(language, 'contractorReputation')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-surface-container rounded-xl">
                  <div className="text-4xl font-extrabold text-primary mb-1">{averageRating || '—'}</div>
                  <p className="text-sm text-on-surface-variant font-medium">{t(language, 'avgRating')}</p>
                  <div className="flex justify-center gap-1 mt-2 text-amber-500">
                    {[1,2,3,4,5].map(s => (
                      <span key={s} className="material-symbols-outlined text-sm"
                        style={{ fontVariationSettings: s <= Math.round(averageRating) ? "'FILL' 1" : "'FILL' 0" }}>star</span>
                    ))}
                  </div>
                </div>
                <div className="text-center p-6 bg-surface-container rounded-xl">
                  <div className="text-4xl font-extrabold text-secondary mb-1">{contractorJobs.length}</div>
                  <p className="text-sm text-on-surface-variant font-medium">Jobs Posted</p>
                </div>
                <div className="text-center p-6 bg-surface-container rounded-xl">
                  <div className="text-4xl font-extrabold text-tertiary mb-1">{totalHires}</div>
                  <p className="text-sm text-on-surface-variant font-medium">{t(language, 'jobsDone')}</p>
                </div>
              </div>
            </div>

            {/* Referral */}
            <div className="bg-surface-container-low p-8 rounded-xl border border-primary/20 shadow-sm">
              <h2 className="font-headline text-2xl font-bold mb-2 flex items-center gap-2 text-primary">
                <span className="material-symbols-outlined">group_add</span> {t(language, 'referAndEarn')}
              </h2>
              <p className="text-on-surface-variant mb-6">
                {t(language, 'referAndEarnDesc')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <div className="flex-1 bg-surface-container-highest p-4 rounded-xl flex items-center justify-between border border-outline-variant/30 w-full">
                  <span className="font-mono font-bold text-lg tracking-wider text-on-surface">
                    REF-{contractorName.substring(0, 4).toUpperCase()}-2024
                  </span>
                </div>
                <button onClick={copyReferralCode}
                  className="w-full sm:w-auto px-6 py-4 bg-primary text-white font-bold rounded-xl shadow-lg hover:opacity-90 transition-all flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-sm">content_copy</span> {t(language, 'copyCode')}
                </button>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}