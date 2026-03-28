import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function JobDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { jobs, contractorJobs, showToast } = useApp();

  const allJobs = [...jobs, ...contractorJobs];
  const job = allJobs.find(j => j.id === id);

  if (!job) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-surface font-body">
        <h1 className="text-2xl font-bold mb-4">Job Not Found</h1>
        <button
          onClick={() => navigate('/jobs')}
          className="px-6 py-2 bg-primary text-white rounded-xl"
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
      <main className="pt-24 px-6 max-w-4xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-primary font-bold mb-8 hover:underline"
        >
          <span className="material-symbols-outlined">arrow_back</span>
          Back
        </button>

        <div className="bg-surface-container-lowest p-8 rounded-2xl shadow-sm border border-surface-container">
          <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
            <div className="flex gap-4 items-center">
              <div className="p-4 bg-primary-container/20 rounded-xl">
                <span className="material-symbols-outlined text-primary text-5xl">{job.icon || 'work'}</span>
              </div>
              <div>
                <h1 className="font-headline font-extrabold text-3xl md:text-4xl tracking-tight leading-tight">{job.title}</h1>
                <div className="flex items-center gap-2 mt-2">
                  <p className="text-on-surface-variant font-bold text-lg">{job.company}</p>
                  <span className="material-symbols-outlined text-secondary text-base" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2 items-end">
              {job.type && (
                <span className={`text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-[0.1em] ${
                  job.type === 'immediate' ? 'bg-secondary-container text-on-secondary-container' : 'bg-surface-container-high text-on-surface-variant'
                }`}>
                  {job.type.replace('-', ' ')}
                </span>
              )}
              <span className={`text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-[0.1em] ${
                job.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {job.status}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 py-8 border-y border-surface-container/50">
            <div className="flex flex-col gap-1">
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.15em]">Wage</p>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">payments</span>
                <p className="font-extrabold text-xl">{job.wage}<span className="text-sm font-medium text-on-surface-variant">/{job.wageUnit}</span></p>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.15em]">Location</p>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">location_on</span>
                <p className="font-bold text-lg">{job.location}</p>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.15em]">Posted</p>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">calendar_today</span>
                <p className="font-bold text-lg">{job.postedAt}</p>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.15em]">Applicants</p>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">group</span>
                <p className="font-bold text-lg">{job.applicants ?? 0}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-8">
              <section>
                <h2 className="font-headline font-bold text-2xl mb-4">Job Description</h2>
                <p className="text-on-surface-variant leading-relaxed text-lg">
                  {job.description}
                </p>
              </section>

              <section>
                <h2 className="font-headline font-bold text-2xl mb-4">Required Skills</h2>
                <div className="flex flex-wrap gap-3">
                  {job.skills.map(skill => (
                    <span key={skill} className="px-5 py-2.5 bg-surface-container-high rounded-xl text-sm font-bold text-on-surface-variant border border-outline-variant/30">
                      {skill}
                    </span>
                  ))}
                </div>
              </section>
            </div>

            <aside className="space-y-6">
              <div className="bg-primary-container/10 p-6 rounded-2xl border border-primary/10">
                <h3 className="font-headline font-bold text-lg mb-4">Ready to Apply?</h3>
                <p className="text-sm text-on-surface-variant mb-6">Make sure your profile is up to date before submitting your application.</p>
                <button
                  onClick={handleApply}
                  className="w-full py-4 bg-primary text-on-primary font-bold rounded-xl shadow-lg hover:shadow-xl hover:opacity-90 transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined">send</span>
                  Apply Now
                </button>
              </div>

              <div className="flex items-center justify-around p-4 border border-surface-container rounded-2xl">
                <button className="flex flex-col items-center gap-1 group">
                  <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">thumb_up</span>
                  <span className="text-[10px] font-bold text-on-surface-variant">{job.likes ?? 0}</span>
                </button>
                <button className="flex flex-col items-center gap-1 group">
                  <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">comment</span>
                  <span className="text-[10px] font-bold text-on-surface-variant">{job.comments ?? 0}</span>
                </button>
                <button className="flex flex-col items-center gap-1 group">
                  <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">bookmark</span>
                  <span className="text-[10px] font-bold text-on-surface-variant">Save</span>
                </button>
                <button className="flex flex-col items-center gap-1 group">
                  <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">share</span>
                  <span className="text-[10px] font-bold text-on-surface-variant">Share</span>
                </button>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}
