import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function JobsPage() {
  const navigate = useNavigate();
  const { jobs } = useApp();
  const [search, setSearch] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  const allSkills = ['Carpentry', 'Plumbing', 'Electrical', 'HVAC', 'Masonry', 'Painting'];

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev => prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]);
  };

  const filtered = Array.isArray(jobs) ? jobs.filter(job => {
    const matchSearch = !search || job.title.toLowerCase().includes(search.toLowerCase()) || job.company.toLowerCase().includes(search.toLowerCase());
    const matchSkills = selectedSkills.length === 0 || job.skills.some(s => selectedSkills.some(sel => s.toLowerCase().includes(sel.toLowerCase())));
    return matchSearch && matchSkills && job.status === 'open';
  }) : [];


  return (
    <div className="bg-surface font-body text-on-surface min-h-screen pb-24">
      <main className="pt-4 px-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Filter Sidebar */}
        <aside className="hidden lg:block lg:col-span-3 space-y-8 sticky top-24 h-fit">
          <div className="bg-surface-container-low p-6 rounded-xl space-y-6">
            <h2 className="font-headline font-bold text-lg">Refine Search</h2>
            <div className="space-y-3">
              <label className="font-label text-xs font-bold uppercase tracking-widest text-on-surface-variant">Skillset</label>
              <div className="space-y-2">
                {allSkills.map(skill => (
                  <label key={skill} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      checked={selectedSkills.includes(skill)}
                      onChange={() => toggleSkill(skill)}
                      className="rounded border-outline-variant text-primary focus:ring-primary h-5 w-5"
                      type="checkbox"
                    />
                    <span className="text-sm font-medium group-hover:text-primary transition-colors">{skill}</span>
                  </label>
                ))}
              </div>
            </div>
            <button
              onClick={() => setSelectedSkills([])}
              className="w-full py-3 bg-primary text-on-primary font-bold rounded-xl hover:opacity-90 transition-all active:scale-95"
            >
              Clear Filters
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <div className="lg:col-span-9 space-y-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h1 className="font-headline font-extrabold text-3xl md:text-4xl tracking-tight">Available Jobs</h1>
                <p className="text-on-surface-variant mt-1">{filtered.length} roles found matching your criteria.</p>
              </div>
              <div className="relative w-full md:w-96">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary">search</span>
                <input
                  className="w-full pl-12 pr-4 py-3 bg-surface-container-highest border-none rounded-xl focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary transition-all shadow-sm"
                  placeholder="Search by job title or company..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="bg-secondary-fixed text-on-secondary-fixed p-3 rounded-lg flex items-center gap-3 shadow-sm">
              <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
              <p className="text-xs font-bold uppercase tracking-wider">Your profile is verified. You have access to Premium listings.</p>
            </div>
          </div>

          {/* Job Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((job, idx) => {
              // Featured card for first item
              if (idx === 0) {
                return (
                  <div key={(job as any)._id || job.id} className="md:col-span-2 group relative overflow-hidden bg-inverse-surface text-white p-8 rounded-2xl shadow-xl flex flex-col md:flex-row gap-8 items-center">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] rounded-full -mr-20 -mt-20"></div>
                    <div className="flex-1 z-10">
                      <span className="bg-primary px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4 inline-block">Featured</span>
                      <h2 className="font-headline font-extrabold text-3xl mb-2">{job.title}</h2>
                      <p className="text-slate-300 text-sm max-w-md">{job.description}</p>
                      <div className="flex gap-8 mt-8">
                        <div>
                          <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Wage</span>
                          <span className="text-2xl font-bold text-secondary-fixed">{job.wage}+</span>
                        </div>
                        <div>
                          <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Location</span>
                          <span className="text-2xl font-bold">{job.location}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => navigate(`/jobs/${job.id}`)}
                        className="mt-6 px-8 py-3 bg-white text-primary font-bold rounded-xl hover:opacity-90 transition-all active:scale-95"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                );
              }
              return (
                <div key={(job as any)._id || job.id} className="group bg-surface-container-lowest p-6 rounded-xl shadow-[0_12px_32px_rgba(45,51,55,0.06)] hover:translate-y-[-4px] transition-all duration-300">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-primary-container/20 rounded-lg">
                      <span className="material-symbols-outlined text-primary text-3xl">{job.icon || 'work'}</span>
                    </div>
                    {job.type && (
                      <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest ${
                        job.type === 'immediate' ? 'bg-secondary-container text-on-secondary-container' : 'bg-surface-container-high text-on-surface-variant'
                      }`}>
                        {job.type === 'immediate' ? 'Immediate Start' : 'Contract'}
                      </span>
                    )}
                  </div>
                  <h3 className="font-headline font-bold text-xl group-hover:text-primary transition-colors">{job.title}</h3>
                  <p className="text-on-surface-variant text-sm mt-2 line-clamp-2">{job.description}</p>
                  <div className="mt-6 flex items-center justify-between border-t border-surface-container pt-4">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Wage</span>
                      <span className="text-xl font-extrabold text-primary">{job.wage}<span className="text-xs font-medium">/{job.wageUnit}</span></span>
                    </div>
                    <div className="flex flex-col text-right">
                      <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Location</span>
                      <span className="font-semibold text-on-surface flex items-center gap-1 justify-end">
                        <span className="material-symbols-outlined text-sm">near_me</span>{job.location}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate(`/jobs/${job.id}`)}
                    className="w-full mt-4 py-3 bg-surface-container text-on-surface font-bold rounded-lg group-hover:bg-primary group-hover:text-on-primary transition-colors"
                  >
                    View Details
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
