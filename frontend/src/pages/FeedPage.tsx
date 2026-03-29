import { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { t } from '../utils/i18n';
import { api } from '../utils/api';

const REAL_MARKET_NEWS = [
  { id: 1, title: "Govt announces new Smart City Phase 2 projects in tier-2 cities", time: "2 hrs ago", readers: "14.2k" },
  { id: 2, title: "Demand for certified electricians increases by 45% this quarter", time: "5 hrs ago", readers: "8.5k" },
  { id: 3, title: "New wage regulations passed for construction workers", time: "1 day ago", readers: "32k" }
];

export default function JobFeedPage() {
  const { jobs, showToast, addAppliedJob, language } = useApp();
  const [postText, setPostText] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  // File inputs ke liye refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Profile States (Real Data fetch from localStorage)
  const [userName, setUserName] = useState(t(language, 'myProfile'));
  const [userInitial, setUserInitial] = useState('U');
  const [userRoleStr, setUserRoleStr] = useState(t(language, 'readyToWork'));

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const userObj = JSON.parse(userStr);
        if (userObj.name) {
          setUserName(userObj.name);
          setUserInitial(userObj.name.charAt(0).toUpperCase());
        }
        if (userObj.role) {
          setUserRoleStr(userObj.role === 'contractor' ? t(language, 'verifiedContractor') : t(language, 'verifiedWorker'));
        }
      } catch (e) {
        console.error("Error reading user data", e);
      }
    }
  }, []);

  const [applyModal, setApplyModal] = useState<{isOpen: boolean, jobId: string, jobTitle: string, company: string}>({isOpen: false, jobId: '', jobTitle: '', company: ''});
  const [agreedToTc, setAgreedToTc] = useState(false);
  const [expectedWage, setExpectedWage] = useState('');
  const [isApplying, setIsApplying] = useState(false);

  const handleOpenApply = (jobId: string, jobTitle: string, company: string) => {
    setApplyModal({ isOpen: true, jobId, jobTitle, company });
    setAgreedToTc(false);
    setExpectedWage('');
  };

  const handleCloseApply = () => {
    setApplyModal({ isOpen: false, jobId: '', jobTitle: '', company: '' });
  };

  const handleConfirmApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedToTc) {
      showToast(t(language, 'mustAgreeTerms'), 'error');
      return;
    }
    
    setIsApplying(true);
    try {
      await api.applyJob({ job_id: applyModal.jobId });
      
      // Global State mein add kardo taaki Profile page me dikhe
      if(addAppliedJob) {
        addAppliedJob({
          id: applyModal.jobId,
          title: applyModal.jobTitle,
          company: applyModal.company || t(language, 'verifiedContractor'),
          status: 'Under Review',
          appliedAt: new Date().toLocaleDateString()
        });
      }

      showToast(t(language, 'successfullyAppliedTo', { title: applyModal.jobTitle }), 'success');
      handleCloseApply();
    } catch (error: any) {
      showToast(error.message || t(language, 'failedToApply'), 'error');
    } finally {
      setIsApplying(false);
    }
  };

  const handlePost = async () => {
    if (!postText.trim()) return;
    if (!selectedFile) {
      showToast(t(language, 'selectPhotoRequired'), 'info');
      return;
    }

    try {
      showToast(t(language, 'uploadingPost'), 'info');
      const formData = new FormData();
      formData.append('description', postText);
      formData.append('skills', 'General'); 
      formData.append('file', selectedFile);

      await api.createPost(formData);
      showToast(t(language, 'postSharedSuccessfully'), 'success');
      setPostText('');
      setSelectedFile(null);
    } catch (error: any) {
      showToast(t(language, 'failedToShare'), 'error');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // Camera + GPS Logic
  const handleCameraCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      showToast(t(language, 'photoCapturedFetchGps'), 'info');

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const lat = position.coords.latitude.toFixed(4);
            const lng = position.coords.longitude.toFixed(4);
            setPostText(prev => prev + `\n📍 [GPS Location: ${lat}, ${lng}]`);
            showToast(t(language, 'gpsLocationAdded'), 'success');
          },
          (error) => {
            showToast(t(language, 'gpsLocationFailed'), 'error');
          }
        );
      } else {
        showToast(t(language, 'geolocationUnsupported'), 'error');
      }
    }
  };

  return (
    <div className="bg-background text-on-background min-h-screen pb-32 relative">
      {/* ================= APPLY MODAL (Scrollable) ================= */}
      {applyModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="bg-surface-container-lowest w-full max-w-md rounded-2xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button onClick={handleCloseApply} className="absolute top-4 right-4 text-on-surface-variant hover:text-error">
              <span className="material-symbols-outlined">close</span>
            </button>
<h2 className="text-2xl font-headline font-bold text-on-surface mb-2">{t(language, 'applyForJob')}</h2>
            <p className="text-primary font-bold mb-6">{applyModal.jobTitle}</p>
            
            <form onSubmit={handleConfirmApply} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold">{t(language, 'expectedWage')}</label>
                <input 
                  type="text" 
                  placeholder={t(language, 'expectedWagePlaceholder')} 
                  value={expectedWage}
                  onChange={(e) => setExpectedWage(e.target.value)}
                  className="w-full p-3 bg-surface-container rounded-xl border-none focus:ring-2 focus:ring-primary text-sm"
                />
              </div>

              <div className="bg-surface-container-highest p-4 rounded-xl text-xs text-on-surface-variant h-32 overflow-y-auto mb-2 border border-outline-variant/20">
                <strong>{t(language, 'termsAndConditions')}</strong><br/>
                1. {t(language, 'tcPoint1')}<br/>
                2. {t(language, 'tcPoint2')}<br/>
                3. {t(language, 'tcPoint3')}<br/>
                4. {t(language, 'tcPoint4')}
              </div>

              <label className="flex items-start gap-2 cursor-pointer mt-4">
                <input 
                  type="checkbox" 
                  checked={agreedToTc} 
                  onChange={(e) => setAgreedToTc(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded text-primary focus:ring-primary" 
                />
                <span className="text-sm text-on-surface font-medium">{t(language, 'termsAgree')}</span>
              </label>

              <div className="pt-4 flex gap-3">
                <button type="button" onClick={handleCloseApply} className="flex-1 py-3 bg-surface-container font-bold text-on-surface rounded-xl hover:bg-surface-container-high transition-colors">
                  {t(language, 'cancel')}
                </button>
                <button type="submit" disabled={isApplying || !agreedToTc} className={`flex-1 py-3 text-white font-bold rounded-xl transition-all ${isApplying || !agreedToTc ? 'bg-primary/50 cursor-not-allowed' : 'bg-primary hover:bg-primary-dim shadow-lg'}`}>
                  {isApplying ? t(language, 'applying') : t(language, 'confirmApplication')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto pt-4 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Sidebar (Real Profile Name) */}
          <aside className="hidden lg:flex lg:col-span-3 flex-col sticky top-24 space-y-4">
            <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-16 bg-primary-container/20"></div>
              <div className="relative pt-6 flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-2xl bg-primary flex items-center justify-center text-white text-3xl font-bold shadow-md mb-4 border-4 border-surface-container-lowest uppercase">
                  {userInitial}
                </div>
                <h2 className="text-xl font-bold text-on-surface">{userName}</h2>
                <p className="text-sm text-secondary font-semibold">{userRoleStr}</p>
              </div>
            </div>
          </aside>

          {/* Main Feed */}
          <div className="lg:col-span-6 space-y-6">
            {/* Create Post with Camera */}
            <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-surface-container">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface-variant font-bold text-lg uppercase">
                  {userInitial}
                </div>
                <input
                  className="flex-1 px-5 py-3 bg-surface-container rounded-full text-on-surface-variant text-sm hover:bg-surface-container-high transition-colors font-medium border-none focus:ring-2 focus:ring-primary"
                  placeholder={t(language, 'feedPostPlaceholder')}
                  value={postText}
                  onChange={e => setPostText(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handlePost()}
                />
              </div>
              
              {/* Hidden Inputs */}
              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*,video/*" />
              {/* capture="environment" forces camera open on mobile */}
              <input type="file" ref={cameraInputRef} onChange={handleCameraCapture} className="hidden" accept="image/*" capture="environment" />
              
              <div className="flex justify-between mt-4 px-2">
                <div className="flex gap-2">
                  <button onClick={() => fileInputRef.current?.click()} className={`flex items-center gap-1 font-semibold text-sm p-2 rounded-lg transition-colors ${selectedFile ? 'text-primary bg-primary/10' : 'text-on-surface-variant hover:bg-surface-container'}`}>
                    <span className="material-symbols-outlined text-primary text-[18px]">image</span> {selectedFile ? t(language, 'added') : t(language, 'photo')}
                  </button>
                  <button onClick={() => cameraInputRef.current?.click()} className="flex items-center gap-1 text-on-surface-variant font-semibold text-sm hover:bg-surface-container p-2 rounded-lg transition-colors">
                    <span className="material-symbols-outlined text-secondary text-[18px]">photo_camera</span> {t(language, 'cameraGPS')}
                  </button>
                </div>
                <button onClick={handlePost} className="flex items-center gap-1 text-on-surface-variant font-semibold text-sm hover:bg-surface-container p-2 rounded-lg transition-colors">
                  <span className="material-symbols-outlined text-tertiary">send</span> {t(language, 'post')}
                </button>
              </div>
            </div>

            {/* Job Cards (Compact & Fits on Screen) */}
            {jobs.length === 0 ? (
              <div className="text-center p-10 bg-surface-container-lowest rounded-xl border border-surface-container">
                <span className="material-symbols-outlined text-4xl text-outline mb-2">work_off</span>
                <p className="text-on-surface-variant font-bold">{t(language, 'noJobsAvailable')}</p>
              </div>
            ) : (
              jobs.filter(j => j.status === 'open' || !j.status).map(job => (
                <article key={job._id || job.id} className="bg-surface-container-lowest rounded-xl shadow-sm border border-surface-container overflow-hidden mb-4">
                  <div className="p-4 sm:p-5">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex gap-3">
                        <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                          <span className="material-symbols-outlined">{job.icon || 'engineering'}</span>
                        </div>
                        <div>
                          <h3 className="font-bold text-on-surface leading-tight text-sm line-clamp-1">{job.created_by || job.company || t(language, 'verifiedContractor')}</h3>
                          <p className="text-xs text-on-surface-variant">{job.postedAt || t(language, 'recently')} • <span className="text-secondary font-bold">{t(language, 'verified')}</span></p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2 mb-4">
                      <h2 className="text-lg font-extrabold text-on-surface tracking-tight leading-snug">{job.title}</h2>
                      <div className="flex flex-wrap gap-2">
                        {job.skills && job.skills.map((skill: string) => (
                          <span key={skill} className="px-2.5 py-1 bg-surface-container-high rounded-full text-[10px] font-bold text-on-surface-variant">{skill}</span>
                        ))}
                      </div>
                      <p className="text-sm text-on-surface-variant leading-relaxed line-clamp-2">{job.description}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3 p-3 bg-surface-container-low rounded-xl mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container">
                          <span className="material-symbols-outlined text-sm">payments</span>
                        </div>
                        <div>
                          <p className="text-[9px] uppercase font-bold text-on-surface-variant tracking-wider">{t(language, 'wage')}</p>
                          <p className="font-bold text-on-surface text-sm">{job.wage} <span className="text-[10px] font-normal">/ {job.wageUnit || t(language, 'perDay')}</span></p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary-container/20 flex items-center justify-center text-primary">
                          <span className="material-symbols-outlined text-sm">location_on</span>
                        </div>
                        <div>
                          <p className="text-[9px] uppercase font-bold text-on-surface-variant tracking-wider">{t(language, 'locationLabel')}</p>
                          <p className="font-bold text-on-surface text-sm line-clamp-1">{job.location || t(language, 'siteLocation')}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleOpenApply(job._id || job.id || '', job.title, job.company || '')}
                        className="flex-1 py-2.5 bg-primary text-white font-bold rounded-xl hover:bg-primary-dim transition-colors text-sm"
                      >
                        {t(language, 'applyNow')}
                      </button>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>

          {/* Right Sidebar */}
          <aside className="hidden lg:block lg:col-span-3 space-y-6">
            <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-surface-container">
              <h3 className="font-bold text-on-surface mb-4">{t(language, 'labourMarketNews')}</h3>
              <ul className="space-y-4">
                {REAL_MARKET_NEWS.map(item => (
                  <li key={item.id} className="group cursor-pointer">
                    <p className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors">{item.title}</p>
                    <p className="text-xs text-on-surface-variant">{item.time} • {item.readers} readers</p>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}