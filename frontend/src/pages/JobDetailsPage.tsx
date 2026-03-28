import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function JobDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { jobs, showToast } = useApp();

  const job = jobs.find(j => j.id === id);

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

  const handleApply = () => {
    showToast(`Successfully applied to "${job.title}"! 🎉`, 'success');
  };

  return (
    <div className="bg-surface font-body text-on-surface min-h-screen pb-24">
      <div className="max-w-4xl mx-auto pt-8 px-6">
        <button
          onClick={() => navigate('/jobs')}
          className="flex items-center gap-2 text-primary font-bold mb-8 hover:underline"
        >
          <span className="material-symbols-outlined">arrow_back</span>
          Back to Jobs
        </button>

        <div className="bg-surface-container-lowest rounded-3xl p-8 shadow-xl border border-surface-container overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[80px] rounded-full -mr-20 -mt-20"></div>

          <div className="flex flex-col md:flex-row justify-between items-start gap-6 relative z-10">
            <div className="flex gap-6 items-center">
              <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-5xl">
                  {job.icon || 'work'}
                </span>
              </div>
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight">{job.title}</h1>
                <p className="text-lg text-on-surface-variant font-medium">{job.company}</p>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest ${
                job.type === 'immediate' ? 'bg-secondary-container text-on-secondary-container' : 'bg-surface-container-high text-on-surface-variant'
              }`}>
                {job.type === 'immediate' ? 'Immediate Start' : job.type || 'Contract'}
              </span>
              <p className="text-xs text-on-surface-variant mt-2 font-bold uppercase tracking-wider">Posted {job.postedAt}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 mb-12">
            <div className="p-6 bg-surface-container-low rounded-2xl border border-surface-container">
              <span className="material-symbols-outlined text-primary mb-2">payments</span>
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Wage</p>
              <p className="text-2xl font-extrabold text-on-surface">{job.wage}<span className="text-sm font-medium">/{job.wageUnit}</span></p>
            </div>
            <div className="p-6 bg-surface-container-low rounded-2xl border border-surface-container">
              <span className="material-symbols-outlined text-secondary mb-2">location_on</span>
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Location</p>
              <p className="text-2xl font-extrabold text-on-surface">{job.location}</p>
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
                {job.skills.map(skill => (
                  <span key={skill} className="px-5 py-2 bg-primary/10 text-primary rounded-xl font-bold text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-surface-container flex flex-col md:flex-row gap-4">
            <button
              onClick={handleApply}
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
