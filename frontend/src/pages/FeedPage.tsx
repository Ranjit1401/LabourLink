import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { NEWS_ITEMS } from '../utils/mockData';

export default function JobFeedPage() {
  const { jobs, showToast } = useApp();
  const [postText, setPostText] = useState('');

  const handlePost = () => {
    if (postText.trim()) {
      showToast('Post shared successfully!', 'success');
      setPostText('');
    }
  };

  return (
    <div className="bg-background text-on-background min-h-screen pb-24">
      <main className="max-w-7xl mx-auto pt-4 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Sidebar */}
          <aside className="hidden lg:flex lg:col-span-3 flex-col sticky top-24 space-y-4">
            <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-16 bg-primary-container/20"></div>
              <div className="relative pt-6 flex flex-col items-center text-center">
                <img
                  alt="Worker Profile"
                  className="w-20 h-20 rounded-2xl object-cover border-4 border-surface-container-lowest shadow-md mb-4"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuC6Kwzkyk0nBkSvfYUOZNNARuB1jQX67QmBbf2eJQ77AFbASsyOw4PYWFiaJT8IdhPfEagy9HTYlOYsxea8YiPIb2qX9I6vxq1JvpCwQXSTVXA9hTN2Lt4ksFH_30nEqmls9E_4LZm9FrEr-0pjSt1NkRo06FumCmj9IsBPfBCTdterIKzE2hgCg5pkkxMo2GvMduLI7P32bN3_jrn7NyjzYFt6PGcOgi8sIq7YDZ16hY0PdJWUqm_j9geELMM2P3tDZYBIbiaFQw9O"
                />
                <h2 className="text-xl font-bold text-on-surface">Arjun Sharma</h2>
                <p className="text-sm text-secondary font-semibold">Verified Skilled Professional</p>
                <div className="mt-6 w-full space-y-3 pt-6 border-t border-surface-container">
                  <div className="flex justify-between text-sm">
                    <span className="text-on-surface-variant">Profile Views</span>
                    <span className="font-bold text-primary">142</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-on-surface-variant">Completed Jobs</span>
                    <span className="font-bold text-primary">28</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-on-surface-variant">Rating</span>
                    <span className="font-bold text-secondary flex items-center gap-1">4.9 <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>star</span></span>
                  </div>
                </div>
              </div>
            </div>
            <a href="/jobs" className="w-full py-4 bg-gradient-to-r from-primary to-primary-dim text-white rounded-xl font-bold shadow-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
              <span className="material-symbols-outlined">add_circle</span> Find New Work
            </a>
          </aside>

          {/* Main Feed */}
          <div className="lg:col-span-6 space-y-6">
            {/* Create Post */}
            <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-surface-container">
              <div className="flex gap-4">
                <img alt="User" className="w-12 h-12 rounded-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAKlaYbv-BOJFd_RwuWyaeTmP4znRNxVJ7Kc-PuEgivpCyMBpI9ts8F7OwT_dEkgodqEuRkZk--vXzYLhcoMGC__-jsCOBlnlhayqutVC1G1D7kAnnQ33sE4frdz8KtzvOSPvBOtrmRo5il31Mey6l1r_JsLBkqotXsIHYq-dEM8vsv_rZQHwZJlAdUImPlK-InvfLJI8UWDYy-0xeQsDhuhU6NZrtusx28CJEx5FcU5srtGDK3z31Epc5ElVeSbYesmYxtzDWWVRtI" />
                <input
                  className="flex-1 px-5 py-3 bg-surface-container rounded-full text-on-surface-variant text-sm hover:bg-surface-container-high transition-colors font-medium border-none focus:ring-2 focus:ring-primary"
                  placeholder="Share a work update or ask for a skill..."
                  value={postText}
                  onChange={e => setPostText(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handlePost()}
                />
              </div>
              <div className="flex justify-between mt-4 px-2">
                <button className="flex items-center gap-2 text-on-surface-variant font-semibold text-sm hover:bg-surface-container p-2 rounded-lg transition-colors">
                  <span className="material-symbols-outlined text-primary">image</span> Photo
                </button>
                <button className="flex items-center gap-2 text-on-surface-variant font-semibold text-sm hover:bg-surface-container p-2 rounded-lg transition-colors">
                  <span className="material-symbols-outlined text-secondary">video_library</span> Video
                </button>
                <button onClick={handlePost} className="flex items-center gap-2 text-on-surface-variant font-semibold text-sm hover:bg-surface-container p-2 rounded-lg transition-colors">
                  <span className="material-symbols-outlined text-tertiary">send</span> Post
                </button>
              </div>
            </div>

            {/* Job Feed Cards */}
            {jobs.filter(j => j.status === 'open').map(job => (
              <article key={job.id} className="bg-surface-container-lowest rounded-xl shadow-sm border border-surface-container overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined">{job.icon || 'work'}</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-on-surface leading-tight">{job.company}</h3>
                        <p className="text-xs text-on-surface-variant">{job.postedAt} • <span className="text-secondary font-bold">Verified Employer</span></p>
                      </div>
                    </div>
                    <button className="text-outline hover:text-primary transition-colors">
                      <span className="material-symbols-outlined">more_horiz</span>
                    </button>
                  </div>
                  <div className="space-y-3 mb-6">
                    <Link to={`/jobs/${job.id}`}>
                      <h2 className="text-lg font-extrabold text-on-surface tracking-tight hover:text-primary transition-colors cursor-pointer">{job.title}</h2>
                    </Link>
                    <div className="flex flex-wrap gap-2">
                      {job.skills.map(skill => (
                        <span key={skill} className="px-3 py-1 bg-surface-container-high rounded-full text-xs font-bold text-on-surface-variant">{skill}</span>
                      ))}
                    </div>
                    <p className="text-sm text-on-surface-variant leading-relaxed">{job.description}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 p-4 bg-surface-container-low rounded-xl mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container">
                        <span className="material-symbols-outlined">payments</span>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">Wage</p>
                        <p className="font-bold text-on-surface">{job.wage} <span className="text-xs font-normal">/ {job.wageUnit}</span></p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary-container/20 flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined">location_on</span>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">Location</p>
                        <p className="font-bold text-on-surface">{job.location}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Link
                      to={`/jobs/${job.id}`}
                      className="flex-1 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dim transition-colors text-center"
                    >
                      View Details
                    </Link>
                    <button className="px-4 py-3 bg-surface-container-highest text-on-surface font-bold rounded-xl hover:bg-surface-container-high transition-colors">
                      <span className="material-symbols-outlined">bookmark</span>
                    </button>
                  </div>
                </div>
                <div className="px-6 py-3 border-t border-surface-container flex items-center justify-between text-on-surface-variant">
                  <div className="flex items-center gap-6">
                    <button className="flex items-center gap-2 text-sm font-semibold hover:text-primary transition-colors">
                      <span className="material-symbols-outlined text-xl">thumb_up</span> {job.likes ?? 0}
                    </button>
                    <button className="flex items-center gap-2 text-sm font-semibold hover:text-primary transition-colors">
                      <span className="material-symbols-outlined text-xl">comment</span> {job.comments ?? 0}
                    </button>
                  </div>
                  <button className="flex items-center gap-2 text-sm font-semibold hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-xl">share</span> Share
                  </button>
                </div>
              </article>
            ))}
          </div>

          {/* Right Sidebar */}
          <aside className="hidden lg:block lg:col-span-3 space-y-6">
            <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-surface-container">
              <h3 className="font-bold text-on-surface mb-4">LabourLink News</h3>
              <ul className="space-y-4">
                {NEWS_ITEMS.map(item => (
                  <li key={item.id} className="group cursor-pointer">
                    <p className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors">{item.title}</p>
                    <p className="text-xs text-on-surface-variant">{item.time} • {item.readers} readers</p>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-surface-container rounded-xl p-6 relative overflow-hidden">
              <div className="relative z-10">
                <p className="text-[10px] uppercase font-bold text-secondary tracking-[0.2em] mb-2">Promoted</p>
                <h3 className="text-lg font-extrabold text-on-surface leading-tight mb-2">Get Certified in Scaffolding</h3>
                <p className="text-sm text-on-surface-variant mb-4">Increase your daily wage by up to 40% with our weekend course.</p>
                <button className="w-full py-2 bg-on-surface text-surface rounded-lg text-sm font-bold">Learn More</button>
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-secondary-container rounded-full opacity-30"></div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
