import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { api } from '../utils/api';

export default function JobDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast, addAppliedJob } = useApp();

  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [agreedToTc, setAgreedToTc] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [expectedWage, setExpectedWage] = useState('');

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const jobs = await api.getJobs();
        const found = jobs.find((j: any) => (j._id === id || j.id === id || String(j._id) === String(id)));
        if (found) setJob(found);
      } catch (e) {
        showToast('Failed to load job details', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleConfirmApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedToTc) {
      showToast('You must agree to the Terms & Conditions.', 'error');
      return;
    }
    setApplying(true);
    try {
      await api.applyJob({ job_id: id! });
      addAppliedJob({
        id: id!,
        title: job.title,
        company: job.company || job.created_by || 'Verified Contractor',
        status: 'Under Review',
        appliedAt: new Date().toLocaleDateString(),
      });
      showToast(`Successfully applied to "${job.title}"! 🎉`, 'success');
      setShowModal(false);
      navigate('/jobs');
    } catch (error: any) {
      showToast(error.message || 'Failed to apply. You might have already applied.', 'error');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="font-bold text-primary text-lg">Loading job details...</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-surface">
        <h1 className="text-2xl font-bold text-on-surface mb-4">Job Not Found</h1>
        <button
          onClick={() => navigate('/jobs')}
          className="px-6 py-3 bg-primary text-on-primary font-bold rounded-xl"
        >
          Back to Jobs
        </button>
      </div>
    );
  }

  return (
    <div className="bg-surface font-body text-on-surface min-h-screen pb-24">

      {/* Apply Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="bg-surface-container-lowest w-full max-w-md rounded-2xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-on-surface-variant hover:text-error">
              <span className="material-symbols-outlined">close</span>
            </button>
            <h2 className="text-2xl font-bold text-on-surface mb-2">Apply for Job</h2>
            <p className="text-primary font-bold mb-6">{job.title}</p>

            <form onSubmit={handleConfirmApply} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold">Your Expected Wage (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g., ₹600/day"
                  value={expectedWage}
                  onChange={e => setExpectedWage(e.target.value)}
                  className="w-full p-3 bg-surface-container rounded-xl border-none focus:ring-2 focus:ring-primary text-sm"
                />
              </div>

              <div className="bg-surface-container-highest p-4 rounded-xl text-xs text-on-surface-variant h-32 overflow-y-auto border border-outline-variant/20">
                <strong>Terms & Conditions:</strong><br />
                1. I confirm that all information in my profile is true and accurate.<br />
                2. I agree to show up on site on time if selected.<br />
                3. LabourLink is only a platform to connect; wage disputes must be handled directly with the contractor.<br />
                4. Safety gear must be strictly followed on site.
              </div>

              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreedToTc}
                  onChange={e => setAgreedToTc(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded text-primary focus:ring-primary"
                />
                <span className="text-sm text-on-surface font-medium">I have read and agree to the Terms & Conditions.</span>
              </label>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 bg-surface-container font-bold text-on-surface rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={applying || !agreedToTc}
                  className={`flex-1 py-3 text-white font-bold rounded-xl transition-all ${
                    applying || !agreedToTc ? 'bg-primary/50 cursor-not-allowed' : 'bg-primary hover:bg-primary-dim'
                  }`}
                >
                  {applying ? 'Applying...' : 'Confirm Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto pt-8 px-6">
        <button
          onClick={() => navigate('/jobs')}
          className="flex items-center gap-2 text-primary font-bold mb-8 hover:underline"
        >
          <span className="material-symbols-outlined">arrow_back</span>
          Back to Jobs
        </button>

        <div className="bg-surface-container-lowest rounded-3xl p-8 shadow-xl border border-surface-container overflow-hidden relative">
          <div className="flex flex-col md:flex-row justify-between items-start gap-6">
            <div className="flex gap-6 items-center">
              <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-5xl">
                  {job.icon || 'work'}
                </span>
              </div>
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight">{job.title}</h1>
                <p className="text-lg text-on-surface-variant font-medium">
                  {job.company || job.created_by || 'Verified Contractor'}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest ${
                job.type === 'immediate'
                  ? 'bg-secondary-container text-on-secondary-container'
                  : 'bg-surface-container-high text-on-surface-variant'
              }`}>
                {job.type === 'immediate' ? 'Immediate Start' : job.type || 'Contract'}
              </span>
              <p className="text-xs text-on-surface-variant mt-2 font-bold uppercase tracking-wider">
                Posted {job.postedAt || 'Recently'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 mb-12">
            <div className="p-6 bg-surface-container-low rounded-2xl border border-surface-container">
              <span className="material-symbols-outlined text-primary mb-2">payments</span>
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Wage</p>
              <p className="text-2xl font-extrabold text-on-surface">
                {job.wage}<span className="text-sm font-medium">/{job.wageUnit || 'day'}</span>
              </p>
            </div>
            <div className="p-6 bg-surface-container-low rounded-2xl border border-surface-container">
              <span className="material-symbols-outlined text-secondary mb-2">location_on</span>
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Location</p>
              <p className="text-2xl font-extrabold text-on-surface">{job.location || 'On Site'}</p>
            </div>
            <div className="p-6 bg-surface-container-low rounded-2xl border border-surface-container">
              <span className="material-symbols-outlined text-tertiary mb-2">group</span>
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Applicants</p>
              <p className="text-2xl font-extrabold text-on-surface">{job.applicants || 0}+ applied</p>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">description</span>
                Job Description
              </h2>
              <p className="text-on-surface-variant leading-relaxed text-lg whitespace-pre-line">
                {job.description}
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">psychology</span>
                Required Skills
              </h2>
              <div className="flex flex-wrap gap-3">
                {job.skills?.map((skill: string) => (
                  <span key={skill} className="px-5 py-2 bg-primary/10 text-primary rounded-xl font-bold text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-surface-container flex flex-col md:flex-row gap-4">
            <button
              onClick={() => setShowModal(true)}
              className="flex-1 py-4 bg-primary text-on-primary text-xl font-extrabold rounded-2xl shadow-lg shadow-primary/20 hover:opacity-90 transition-all active:scale-95"
            >
              Apply for this Job
            </button>
            <button className="px-8 py-4 bg-surface-container-high text-on-surface font-bold rounded-2xl hover:bg-surface-container-highest transition-all flex items-center justify-center gap-2">
              <span className="material-symbols-outlined">bookmark</span>
              Save Job
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}