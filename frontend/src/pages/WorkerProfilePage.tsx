import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MOCK_WORKER } from '../utils/mockData';

export default function WorkerProfilePage() {
  const { workerAbout, setWorkerAbout, workerSkills, setWorkerSkills, endorsements, addEndorsement, showToast } = useApp();
  const worker = MOCK_WORKER;
  const [editingAbout, setEditingAbout] = useState(false);
  const [aboutDraft, setAboutDraft] = useState(workerAbout);
  const [editingSkills, setEditingSkills] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [endorseSkill, setEndorseSkill] = useState('');
  const [endorseName, setEndorseName] = useState('');
  const [showEndorseForm, setShowEndorseForm] = useState(false);

  const saveAbout = () => {
    setWorkerAbout(aboutDraft);
    setEditingAbout(false);
    showToast('About section updated!', 'success');
  };

  const addSkill = () => {
    if (newSkill.trim() && !workerSkills.includes(newSkill.trim())) {
      setWorkerSkills([...workerSkills, newSkill.trim()]);
      setNewSkill('');
      showToast('Skill added!', 'success');
    }
  };

  const removeSkill = (skill: string) => {
    setWorkerSkills(workerSkills.filter(s => s !== skill));
    showToast('Skill removed', 'info');
  };

  const handleEndorse = () => {
    if (endorseSkill.trim() && endorseName.trim()) {
      addEndorsement(endorseSkill.trim(), endorseName.trim());
      setEndorseSkill('');
      setEndorseName('');
      setShowEndorseForm(false);
      showToast('Endorsement added!', 'success');
    }
  };

  // Calculate average rating
  const avgRating = worker.recentJobs
    ? (worker.recentJobs.reduce((sum, j) => sum + j.rating, 0) / worker.recentJobs.length).toFixed(1)
    : '0';

  return (
    <div className="bg-background text-on-background min-h-screen pb-24">
      <div className="flex max-w-7xl mx-auto pt-4 pb-24">
        {/* Side Nav (Desktop) */}
        <aside className="hidden md:flex flex-col h-screen sticky top-20 py-6 space-y-2 w-64 border-r bg-slate-50">
          <div className="px-6 mb-6">
            <p className="text-xl font-bold text-blue-700">Worker Portal</p>
            <p className="text-xs text-on-surface-variant font-medium">Verified Skilled Professional</p>
          </div>
          <a href="/dashboard" className="text-slate-600 px-4 py-3 mx-2 hover:bg-slate-100 transition-all flex items-center gap-3 rounded-xl">
            <span className="material-symbols-outlined">dashboard</span> Dashboard
          </a>
          <div className="bg-blue-50 text-blue-700 rounded-xl px-4 py-3 mx-2 flex items-center gap-3 translate-x-1">
            <span className="material-symbols-outlined">account_circle</span> My Profile
          </div>
          <a href="/jobs" className="text-slate-600 px-4 py-3 mx-2 hover:bg-slate-100 transition-all flex items-center gap-3 rounded-xl">
            <span className="material-symbols-outlined">work_history</span> Job History
          </a>
          <a href="/feed" className="text-slate-600 px-4 py-3 mx-2 hover:bg-slate-100 transition-all flex items-center gap-3 rounded-xl">
            <span className="material-symbols-outlined">payments</span> Earnings
          </a>
          <div className="mt-auto px-4">
            <a href="/jobs" className="block w-full text-center bg-primary text-on-primary py-3 rounded-xl font-bold hover:opacity-90 transition-opacity">Find New Work</a>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 px-4 md:px-12 py-8 overflow-y-auto">
          {/* Trust Banner */}
          <div className="w-full bg-secondary-fixed text-on-secondary-fixed py-2 px-6 rounded-xl mb-8 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
              <span className="text-sm font-bold tracking-wide uppercase">Identity Verified &amp; Background Checked</span>
            </div>
            <span className="text-xs font-semibold opacity-80">Last check: Oct 2023</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-4 space-y-8">
              {/* Profile Card */}
              <div className="bg-surface-container-lowest rounded-xl p-8 shadow-[0_12px_32px_rgba(45,51,55,0.06)] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16"></div>
                <div className="relative">
                  <img
                    alt={worker.name}
                    className="w-24 h-24 rounded-2xl object-cover mb-6 border-4 border-surface-container shadow-sm"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCMUFLdV7yF_CvkrTv3RO4QgU9TDvuwODHBG0RqY72TgdLn7ZaLcBj1HdYQeSqnlj4tAxK1aqWPzgzRt_Lcw1fVqB5otieynRcf9iMxxvbehpLY8g8W8UkEs07jW1jXvbAnlUBKzCealoLh3oHDzmehqdjtZrAFfRkWFx4k4jzv2e8OQSMMfpKhAi-0UNfDfIBqY-Zd6onDKbM9ko1FrOp3V5IetBf9GgnG2b5ZBqS5SdpNKSayPOu9iatPqiYuCO1oAGqW-O9j8blR"
                  />
                  <h1 className="text-3xl font-extrabold text-on-surface mb-1">{worker.name}</h1>
                  <p className="text-primary font-bold mb-4 flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">electric_bolt</span> {worker.title}
                  </p>
                  <div className="space-y-4 pt-4 border-t border-surface-container-high">
                    <div className="flex items-center justify-between">
                      <span className="text-on-surface-variant text-sm flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary-dim">location_on</span> Location
                      </span>
                      <span className="font-semibold text-on-surface">{worker.location}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-on-surface-variant text-sm flex items-center gap-2">
                        <span className="material-symbols-outlined text-amber-500" style={{ fontVariationSettings: "'FILL' 1" }}>star</span> Avg Rating
                      </span>
                      <span className="font-bold text-on-surface">{avgRating} <span className="text-on-surface-variant font-normal">/ 5</span></span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-on-surface-variant text-sm flex items-center gap-2">
                        <span className="material-symbols-outlined text-secondary">task_alt</span> Jobs Completed
                      </span>
                      <span className="font-bold text-on-surface">{worker.jobsCompleted}</span>
                    </div>
                  </div>
                  <a
                    href="/rating"
                    className="w-full mt-8 bg-primary text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform"
                  >
                    <span className="material-symbols-outlined">star</span> Rate This Worker
                  </a>
                </div>
              </div>

              {/* Endorsements Section */}
              <div className="bg-surface-container p-6 rounded-xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">military_tech</span> Skill Endorsements
                  </h3>
                  <button
                    onClick={() => setShowEndorseForm(!showEndorseForm)}
                    className="text-primary text-sm font-bold hover:underline flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-sm">add</span> Endorse
                  </button>
                </div>

                {showEndorseForm && (
                  <div className="mb-4 p-4 bg-surface-container-lowest rounded-xl border border-outline-variant/10 space-y-3">
                    <input
                      className="w-full px-4 py-2 bg-surface-container-highest border-none rounded-lg text-sm focus:ring-2 focus:ring-primary"
                      placeholder="Skill name (e.g., Welding)"
                      value={endorseSkill}
                      onChange={e => setEndorseSkill(e.target.value)}
                    />
                    <input
                      className="w-full px-4 py-2 bg-surface-container-highest border-none rounded-lg text-sm focus:ring-2 focus:ring-primary"
                      placeholder="Your name / company"
                      value={endorseName}
                      onChange={e => setEndorseName(e.target.value)}
                    />
                    <button
                      onClick={handleEndorse}
                      className="w-full py-2 bg-primary text-white rounded-lg font-bold text-sm hover:opacity-90 transition-all"
                    >
                      Add Endorsement
                    </button>
                  </div>
                )}

                <div className="flex flex-wrap gap-3">
                  {endorsements.map(e => (
                    <div key={e.skill} className="bg-surface-container-lowest px-4 py-2 rounded-full flex items-center gap-2 border border-outline-variant/10">
                      <span className="text-sm font-bold text-on-surface">{e.skill}</span>
                      <span className="flex items-center text-amber-500 font-bold text-xs">
                        <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>star</span> {e.count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-8 space-y-10">
              {/* About Section */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-extrabold text-on-surface">About</h2>
                  <button
                    onClick={() => { setEditingAbout(!editingAbout); setAboutDraft(workerAbout); }}
                    className="text-primary font-bold text-sm hover:underline flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-sm">{editingAbout ? 'close' : 'edit'}</span>
                    {editingAbout ? 'Cancel' : 'Edit'}
                  </button>
                </div>
                {editingAbout ? (
                  <div className="space-y-3">
                    <textarea
                      className="w-full p-4 bg-surface-container-highest border-none rounded-xl focus:ring-2 focus:ring-primary text-on-surface"
                      rows={4}
                      value={aboutDraft}
                      onChange={e => setAboutDraft(e.target.value)}
                    />
                    <button
                      onClick={saveAbout}
                      className="px-6 py-2 bg-primary text-white rounded-lg font-bold text-sm hover:opacity-90 transition-all"
                    >
                      Save Changes
                    </button>
                  </div>
                ) : (
                  <p className="text-on-surface-variant leading-relaxed bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/10">{workerAbout}</p>
                )}
              </section>

              {/* Skills Section */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-extrabold text-on-surface">Skills</h2>
                  <button
                    onClick={() => setEditingSkills(!editingSkills)}
                    className="text-primary font-bold text-sm hover:underline flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-sm">{editingSkills ? 'close' : 'edit'}</span>
                    {editingSkills ? 'Done' : 'Edit Skills'}
                  </button>
                </div>
                <div className="flex flex-wrap gap-3">
                  {workerSkills.map(skill => (
                    <div key={skill} className="bg-surface-container-lowest px-4 py-2 rounded-full flex items-center gap-2 border border-outline-variant/10">
                      <span className="text-sm font-bold text-on-surface">{skill}</span>
                      {editingSkills && (
                        <button onClick={() => removeSkill(skill)} className="text-error hover:text-error-dim">
                          <span className="material-symbols-outlined text-sm">close</span>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                {editingSkills && (
                  <div className="mt-4 flex gap-2">
                    <input
                      className="flex-1 px-4 py-2 bg-surface-container-highest border-none rounded-lg text-sm focus:ring-2 focus:ring-primary"
                      placeholder="Add new skill..."
                      value={newSkill}
                      onChange={e => setNewSkill(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && addSkill()}
                    />
                    <button
                      onClick={addSkill}
                      className="px-4 py-2 bg-primary text-white rounded-lg font-bold text-sm hover:opacity-90"
                    >
                      Add
                    </button>
                  </div>
                )}
              </section>

              {/* Portfolio Grid */}
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-extrabold text-on-surface">Past Work Portfolio</h2>
                  <span className="text-primary font-bold text-sm hover:underline cursor-pointer">View All</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {worker.portfolio?.map(item => (
                    <div key={item.id} className="relative group aspect-square rounded-2xl overflow-hidden shadow-sm">
                      <img alt={item.title} className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500" src={item.imageUrl} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                        <span className="text-white text-xs font-bold uppercase tracking-widest">{item.title}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Recent Performance */}
              <section>
                <h2 className="text-2xl font-extrabold text-on-surface mb-6">Recent Performance</h2>
                <div className="space-y-4">
                  {worker.recentJobs?.map(job => (
                    <div key={job.id} className="bg-surface-container-lowest p-6 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-outline-variant/10 shadow-sm">
                      <div className="flex gap-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-primary shrink-0">
                          <span className="material-symbols-outlined">{job.icon}</span>
                        </div>
                        <div>
                          <h4 className="font-bold text-on-surface">{job.title}</h4>
                          <p className="text-xs text-on-surface-variant font-medium">Completed {job.completedDate}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-8">
                        <div className="text-right">
                          <div className="flex items-center text-amber-500 justify-end mb-1">
                            {[1,2,3,4,5].map(s => (
                              <span key={s} className="material-symbols-outlined text-sm" style={{ fontVariationSettings: s <= job.rating ? "'FILL' 1" : "'FILL' 0" }}>star</span>
                            ))}
                          </div>
                          <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">{job.ratingLabel}</p>
                        </div>
                        <span className="material-symbols-outlined text-outline-variant cursor-pointer hover:text-primary transition-colors">chevron_right</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
