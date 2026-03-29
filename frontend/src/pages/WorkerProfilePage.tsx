import { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { t } from '../utils/i18n';
import { api } from '../utils/api';

export default function WorkerProfilePage() {
  const { workerAbout, setWorkerAbout, workerSkills, setWorkerSkills, showToast, appliedJobs, language } = useApp();
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<any>(null);
  // States for Editing
  const [editingAbout, setEditingAbout] = useState(false);
  const [aboutDraft, setAboutDraft] = useState(workerAbout);
  const [editingSkills, setEditingSkills] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  
  // Post States (Camera/Photo)
  const [postText, setPostText] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const userObj = JSON.parse(userStr);
          if (userObj.email) {
            const realData = await api.getProfile(userObj.email);
            setProfileData(realData);
          }
        }
      } catch (error) {
        console.error("Failed to load profile", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const saveAbout = () => {
    setWorkerAbout(aboutDraft);
    setEditingAbout(false);
    showToast(t(language, 'aboutUpdated'), 'success');
  };

  const addSkill = () => {
    if (newSkill.trim() && !workerSkills.includes(newSkill.trim())) {
      setWorkerSkills([...workerSkills, newSkill.trim()]);
      setNewSkill('');
      showToast(t(language, 'skillAdded'), 'success');
    }
  };

  const removeSkill = (skill: string) => {
    setWorkerSkills(workerSkills.filter(s => s !== skill));
    showToast(t(language, 'skillRemoved'), 'info');
  };

  const copyReferralCode = () => {
    const code = `REF-${profileData?.name?.substring(0,4).toUpperCase() || 'USER'}-2024`;
    navigator.clipboard.writeText(code);
    showToast(`Referral Code ${code} copied!`, 'success');
  };

  // Camera + GPS Logic for Profile Post
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

  const handlePost = async () => {
    if (!postText.trim()) return;
    if (!selectedFile) {
      showToast('Please select a photo/video (required by backend).', 'info');
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

  // Profile Data Extract
  const avgRating = profileData?.average_rating ?? '0';
  const jobsCompleted = profileData?.jobs_done ?? 0;
  const profileViews = profileData?.profile_views ?? 0;
  const connections = profileData?.total_connections ?? 0;
  const workerName = profileData?.name || 'Worker Name';
  const workerEmail = profileData?.email || 'Email missing';
  const userInitial = workerName.charAt(0).toUpperCase();

  // Helper to color code statuses
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Under Review': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'Rejected': return 'bg-red-100 text-red-800 border-red-200';
      case 'Completed': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center font-bold text-primary">{t(language, 'loadingProfile')}</div>;
  }

  return (
    <div className="bg-background text-on-background min-h-screen pb-24">
      <div className="flex max-w-7xl mx-auto pt-4 pb-24">
        
        <main className="flex-1 px-4 md:px-12 py-8 overflow-y-auto">
          {/* Trust Banner */}
          <div className="w-full bg-secondary-fixed text-on-secondary-fixed py-2 px-6 rounded-xl mb-8 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
              <span className="text-sm font-bold tracking-wide uppercase">{t(language, 'identityVerifiedSmall')}</span>
            </div>
            <span className="text-xs font-semibold opacity-80">{t(language, 'active')}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-4 space-y-8">
              {/* Profile Card */}
              <div className="bg-surface-container-lowest rounded-xl p-8 shadow-[0_12px_32px_rgba(45,51,55,0.06)] relative overflow-hidden border border-outline-variant/10">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16"></div>
                <div className="relative">
                  <div className="w-24 h-24 rounded-2xl bg-primary flex items-center justify-center text-white text-4xl font-bold mb-6 border-4 border-surface-container shadow-sm">
                    {userInitial}
                  </div>
                  <h1 className="text-3xl font-extrabold text-on-surface mb-1">{workerName}</h1>
                  <p className="text-primary font-bold mb-4 flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">mail</span> {workerEmail}
                  </p>
                  <div className="space-y-4 pt-4 border-t border-surface-container-high">
                    <div className="flex items-center justify-between">
                      <span className="text-on-surface-variant text-sm flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary-dim">visibility</span> {t(language, 'profileViews')}
                      </span>
                      <span className="font-semibold text-on-surface">{profileViews}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-on-surface-variant text-sm flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary-dim">group</span> {t(language, 'networkConnections')}
                      </span>
                      <span className="font-semibold text-on-surface">{connections}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-on-surface-variant text-sm flex items-center gap-2">
                        <span className="material-symbols-outlined text-amber-500" style={{ fontVariationSettings: "'FILL' 1" }}>star</span> {t(language, 'avgRating')}
                      </span>
                      <span className="font-bold text-on-surface">{avgRating} <span className="text-on-surface-variant font-normal">/ 5</span></span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-on-surface-variant text-sm flex items-center gap-2">
                        <span className="material-symbols-outlined text-secondary">task_alt</span> {t(language, 'jobsCompleted')}
                      </span>
                      <span className="font-bold text-on-surface">{jobsCompleted}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Referral System Card */}
              <div className="bg-surface-container-low p-6 rounded-xl border border-primary/20 shadow-sm relative overflow-hidden">
                <div className="absolute -right-4 -bottom-4 opacity-10">
                  <span className="material-symbols-outlined text-9xl text-primary">redeem</span>
                </div>
                <div className="relative z-10">
                  <h3 className="text-lg font-bold flex items-center gap-2 text-primary mb-2">
                    <span className="material-symbols-outlined">group_add</span> {t(language, 'referAndEarn')}
                  </h3>
                  <p className="text-sm text-on-surface-variant mb-4">{t(language, 'referAndEarnDesc')}</p>
                  <div className="bg-surface-container-highest p-3 rounded-lg flex items-center justify-between mb-4 border border-outline-variant/30">
                    <span className="font-mono font-bold tracking-wider text-on-surface">
                      REF-{workerName.substring(0,4).toUpperCase()}-2024
                    </span>
                    <button onClick={copyReferralCode} className="text-primary hover:text-primary-dim p-1 rounded-md bg-white/50">
                      <span className="material-symbols-outlined text-sm">content_copy</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-8 space-y-10">
              
              {/* Create Post Section in Profile */}
              <section className="bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-surface-container">
                <h2 className="text-sm font-bold text-on-surface mb-3 uppercase tracking-wider">{t(language, 'updatePortfolioPost')}</h2>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface-variant font-bold uppercase">
                    {userInitial}
                  </div>
                  <input
                    className="flex-1 px-5 py-3 bg-surface-container rounded-full text-on-surface-variant text-sm hover:bg-surface-container-high transition-colors font-medium border-none focus:ring-2 focus:ring-primary"
                    placeholder="Post a site photo or work update..."
                    value={postText}
                    onChange={e => setPostText(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handlePost()}
                  />
                </div>
                
                <input type="file" ref={fileInputRef} onChange={(e) => { if(e.target.files && e.target.files[0]) setSelectedFile(e.target.files[0]) }} className="hidden" accept="image/*,video/*" />
                <input type="file" ref={cameraInputRef} onChange={handleCameraCapture} className="hidden" accept="image/*" capture="environment" />
                
                <div className="flex justify-between mt-4 px-2">
                  <div className="flex gap-2">
                    <button onClick={() => fileInputRef.current?.click()} className={`flex items-center gap-1 font-semibold text-sm p-2 rounded-lg transition-colors ${selectedFile ? 'text-primary bg-primary/10' : 'text-on-surface-variant hover:bg-surface-container'}`}>
                      <span className="material-symbols-outlined text-primary text-[18px]">image</span> {selectedFile ? t(language, 'added') : t(language, 'gallery')}
                    </button>
                    <button onClick={() => cameraInputRef.current?.click()} className="flex items-center gap-1 text-on-surface-variant font-semibold text-sm hover:bg-surface-container p-2 rounded-lg transition-colors">
                      <span className="material-symbols-outlined text-secondary text-[18px]">photo_camera</span> {t(language, 'cameraGPS')}
                    </button>
                  </div>
                  <button onClick={handlePost} className="flex items-center gap-1 text-on-surface-variant font-semibold text-sm hover:bg-surface-container p-2 rounded-lg transition-colors">
                    <span className="material-symbols-outlined text-tertiary">send</span> {t(language, 'post')}
                  </button>
                </div>
              </section>

              {/* ================= NEW: APPLIED JOBS STATUS ================= */}
              <section>
                <h2 className="text-2xl font-extrabold text-on-surface mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">assignment</span> {t(language, 'myAppliedJobs')}
                </h2>
                
                <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/10 overflow-hidden shadow-sm">
                  {(!appliedJobs || appliedJobs.length === 0) ? (
                    <div className="p-8 text-center text-on-surface-variant">
                      <span className="material-symbols-outlined text-4xl mb-2 opacity-50">pending_actions</span>
                      <p className="font-medium">{t(language, 'noAppliedJobsYet')}</p>
                      <a href="/feed" className="text-primary font-bold hover:underline mt-2 inline-block">{t(language, 'findWork')}</a>
                    </div>
                  ) : (
                    <div className="divide-y divide-surface-variant/20">
                      {appliedJobs.map((job: any) => (
                        <div key={job.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-surface-container/30 transition-colors">
                          <div>
                            <h3 className="font-bold text-on-surface">{job.title}</h3>
                            <p className="text-sm text-on-surface-variant flex items-center gap-1">
                              <span className="material-symbols-outlined text-[14px]">domain</span> {job.company}
                            </p>
                            <p className="text-xs text-outline mt-1">{t(language, 'appliedOn')} {job.appliedAt}</p>
                          </div>
                          
                          <div className={`px-4 py-1.5 rounded-full border text-xs font-bold whitespace-nowrap ${getStatusColor(job.status)} flex items-center gap-1.5`}>
                            {job.status === 'Under Review' && <span className="material-symbols-outlined text-[14px]">schedule</span>}
                            {job.status === 'Approved' && <span className="material-symbols-outlined text-[14px]">check_circle</span>}
                            {job.status === 'Rejected' && <span className="material-symbols-outlined text-[14px]">cancel</span>}
                            {job.status === 'Completed' && <span className="material-symbols-outlined text-[14px]">done_all</span>}
                            {job.status}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </section>

              {/* Skills Section */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-extrabold text-on-surface">{t(language, 'skillsHeader')}</h2>
                  <button onClick={() => setEditingSkills(!editingSkills)} className="text-primary font-bold text-sm hover:underline flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">{editingSkills ? 'close' : 'edit'}</span>
                    {editingSkills ? t(language, 'done') : t(language, 'editSkills')}
                  </button>
                </div>
                <div className="flex flex-wrap gap-3">
                  {workerSkills.map((skill: string) => (
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
                    <input className="flex-1 px-4 py-2 bg-surface-container-highest border-none rounded-lg text-sm focus:ring-2 focus:ring-primary" placeholder={t(language, 'addNewSkill')} value={newSkill} onChange={e => setNewSkill(e.target.value)} onKeyDown={e => e.key === 'Enter' && addSkill()} />
                    <button onClick={addSkill} className="px-4 py-2 bg-primary text-white rounded-lg font-bold text-sm hover:opacity-90">{t(language, 'add')}</button>
                  </div>
                )}
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}