import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { AVAILABLE_SKILLS } from '../utils/mockData';

export default function ChooseSkillsPage() {
  const navigate = useNavigate();
  const { setWorkerSkills, showToast } = useApp();
  const [selected, setSelected] = useState<string[]>([]);

  const toggleSkill = (skill: string) => {
    setSelected(prev =>
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  const handleContinue = () => {
    if (selected.length === 0) {
      showToast('Please select at least one skill', 'error');
      return;
    }
    setWorkerSkills(selected);
    showToast(`${selected.length} skills saved to your profile!`, 'success');
    navigate('/worker-profile');
  };

  return (
    <div className="bg-surface text-on-surface min-h-screen pb-32">
      {/* Top Bar */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl shadow-sm flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-extrabold text-blue-700 tracking-tighter cursor-pointer" onClick={() => navigate('/')}>LabourLink</span>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 text-slate-500 hover:bg-slate-50 transition-colors rounded-full active:scale-95">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
        </div>
      </header>

      <main className="pt-24 px-6 max-w-5xl mx-auto">
        {/* Hero Section */}
        <section className="mb-12 relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-primary to-primary-dim p-8 md:p-12 text-on-primary shadow-xl">
          <div className="relative z-10 max-w-xl">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 leading-tight">Choose Your Skills</h1>
            <p className="text-on-primary/80 text-lg md:text-xl font-medium leading-relaxed">
              Select the skills you're proficient in to help contractors find you for the right jobs.
            </p>
          </div>
          <div className="absolute -right-12 -bottom-12 opacity-20 transform rotate-12 hidden md:block">
            <span className="material-symbols-outlined text-[15rem]" style={{ fontVariationSettings: "'FILL' 1" }}>handyman</span>
          </div>
        </section>

        {/* Skills Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {AVAILABLE_SKILLS.map(skill => (
            <button
              key={skill.name}
              onClick={() => toggleSkill(skill.name)}
              className={`group flex flex-col items-center justify-center p-6 rounded-[2rem] shadow-sm hover:shadow-md transition-all border-2 active:scale-95 ${
                selected.includes(skill.name)
                  ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                  : 'border-transparent bg-surface-container-lowest hover:border-primary/10'
              }`}
            >
              <div className={`w-16 h-16 rounded-2xl ${skill.color} flex items-center justify-center mb-4 ${selected.includes(skill.name) ? 'bg-primary !text-white' : ''} ${skill.hoverBg} transition-colors`}>
                <span className={`material-symbols-outlined text-3xl ${selected.includes(skill.name) ? 'text-white' : skill.iconColor} group-hover:text-white transition-colors`}>{skill.icon}</span>
              </div>
              <span className="font-headline font-bold text-on-surface tracking-tight">{skill.name}</span>
              {selected.includes(skill.name) && (
                <span className="material-symbols-outlined text-primary text-sm mt-2" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              )}
            </button>
          ))}
        </div>

        {/* Selected Count & Continue */}
        {selected.length > 0 && (
          <div className="mt-8 flex items-center justify-between bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/10">
            <div>
              <p className="font-bold text-on-surface">{selected.length} skill{selected.length > 1 ? 's' : ''} selected</p>
              <p className="text-sm text-on-surface-variant">{selected.join(', ')}</p>
            </div>
            <button
              onClick={handleContinue}
              className="px-8 py-4 bg-gradient-to-r from-primary to-primary-dim text-white rounded-xl font-bold shadow-lg hover:opacity-90 active:scale-95 transition-all flex items-center gap-2"
            >
              Continue
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
        )}

        {/* Featured Verification Section */}
        <section className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-secondary-container/30 rounded-[2.5rem] p-8 md:p-12">
          <div>
            <span className="inline-block px-4 py-1.5 bg-secondary text-on-secondary rounded-full text-xs font-bold uppercase tracking-widest mb-4">Safety First</span>
            <h2 className="text-3xl font-extrabold text-on-surface leading-tight mb-4">Verified Professional Excellence</h2>
            <p className="text-on-surface-variant text-lg mb-6 leading-relaxed">
              Every service provider on LabourLink undergoes a rigorous background check and skill verification process. Quality and dignity are at the core of every job.
            </p>
            <div className="flex items-center gap-3 text-secondary font-bold">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
              <span>100% Background Checked</span>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square rounded-[2rem] overflow-hidden shadow-2xl rotate-2">
              <img
                alt="Skilled tradesperson working"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAIvr9y-yOtzXbUTCrTCQK5eGJ5VE1czbaM4vEvYe9_fw3HarxSfOs3P8IXlvFhs5AwtW_MXnDbwMo2-_Drgw2pHDQbmZ-i8r3LJemhXObdzykXEqzgBcMyakKtO3qj7pl2l2nurioHHSygQpVX02beo4oxGhmJozwhb4StRAF8GkE4fZFyhBTSvXOi_dHSx_5kv8bp_RDck5hlwpnBVzhQ5WokKWIEOdKSZJcpktsi0BTDqCsxnTTLHlWCG8ewF9gOLSKnm68lB-hk"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-xl max-w-[200px]">
              <div className="flex items-center gap-1 text-amber-500 mb-1">
                {[1,2,3,4,5].map(i => (
                  <span key={i} className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                ))}
              </div>
              <p className="text-xs font-bold text-on-surface italic">"Best plumbing service I've ever had. Professional and dignified."</p>
              <p className="text-[10px] text-on-surface-variant mt-2">— Sarah J., Homeowner</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
