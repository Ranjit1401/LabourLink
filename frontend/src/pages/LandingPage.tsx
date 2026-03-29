import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { t } from '../utils/i18n';

export default function LandingPage() {
  const navigate = useNavigate();
  const { language } = useApp();

  return (
    <div className="bg-background text-on-background">
      {/* Hero Section */}
      <section className="relative px-6 py-20 md:py-32 max-w-7xl mx-auto overflow-hidden">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="z-10">
            <span className="inline-block px-4 py-1.5 mb-6 text-sm font-bold tracking-wider text-on-secondary-container bg-secondary-container rounded-full">
              THE FUTURE OF WORK
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.1] mb-8 text-on-background tracking-tight">
              We are not digitizing resumes — we are digitizing <span className="text-primary italic">trust.</span>
            </h1>
            <p className="text-lg md:text-xl text-on-surface-variant mb-10 max-w-xl leading-relaxed">
              The dignified marketplace where skilled labor meets professional contractors through verified reputation and transparent opportunity.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                id="join-worker-btn"
                onClick={() => navigate('/signup')}
                className="px-8 py-5 bg-gradient-to-r from-primary to-primary-dim text-white rounded-xl font-bold text-lg shadow-lg hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                {t(language, 'joinAsWorker')}
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
              <button
                id="hire-contractor-btn"
                onClick={() => navigate('/signup')}
                className="px-8 py-5 bg-secondary-container text-on-secondary-container rounded-xl font-bold text-lg hover:bg-secondary-fixed transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                {t(language, 'hireAsContractor')}
                <span className="material-symbols-outlined">engineering</span>
              </button>
            </div>
          </div>
          <div className="relative lg:block">
            <div className="relative">
              <div className="absolute -top-12 -left-12 w-64 h-64 bg-secondary/10 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
              <div className="relative grid grid-cols-2 gap-4">
                <div className="space-y-4 pt-12">
                  <div className="rounded-xl overflow-hidden shadow-xl aspect-square">
                    <img
                      className="w-full h-full object-cover"
                      alt="Skilled electrician working"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBvVy0orytlIPRue_iq0W8U1fIuOAhtBdpD4qSxsN5l2AmSKraB2uXMrWiXAag2MWbiXm-0Gu3QsUgeQy6TUmcZlYaozdHpanUU9ushyyah7LU4R-nPr-elXZ9sMZMMGf-2DpQu-kjeEJ-ZJi3w2jMEJJGWPfG93XaMumyz71tCCLSnypJMdwEOVyeaTE6xI2FYiC52WGGLroRKtedH2qP-9O8UHBdcLCRjdxL2jyA0GNRVEwbEV_Y9J0jWa96gdjZGwtRccLL1KE-j"
                    />
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-outline-variant/10">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center">
                        <span className="material-symbols-outlined text-secondary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                      </div>
                      <span className="text-xs font-bold text-on-surface-variant">TRUST SCORE: 98%</span>
                    </div>
                    <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
                      <div className="h-full w-[98%] bg-secondary"></div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="rounded-xl overflow-hidden shadow-xl aspect-[3/4]">
                    <img
                      className="w-full h-full object-cover"
                      alt="Professional carpenter"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBiW3QpyvJhoR4RlmWKB6ceaDwppV3auFehQXWpZ-jgu27V__M2R08lfi4imXDflf4okMqdcKo79r-rlPRHfoV9-AdWE_9nRsohUtK4xygeARWx87wEYL9n7jY4JhBEstzJDJfEqlpsQeUuBbMiEjdv5JgU7woQksb4hJrQTY9eP3OdDgyNrGv0cvHklnvCLNZ_BQK3lF4vApdIXEpG414KNmql8McFDoHcuiWgZe-bBx1CGCJKtjsJxhgJ3vu1edBhqhb6mCB98BKX"
                    />
                  </div>
                  <div className="bg-primary p-6 rounded-xl shadow-xl text-white">
                    <div className="text-3xl font-bold mb-1">12k+</div>
                    <div className="text-xs opacity-80 font-medium">VERIFIED JOBS COMPLETED</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3-Step Section */}
      <section className="bg-surface-container-low py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight">Simple. Transparent. Dignified.</h2>
            <p className="text-on-surface-variant max-w-2xl mx-auto">Our platform removes the friction of traditional job hunting, focusing on your skills and verified work history.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: 'search', title: 'Find Work', desc: 'Browse curated projects that match your specific skill set and local availability without the noise.', num: '01' },
              { icon: 'handyman', title: 'Complete Jobs', desc: 'Work with verified contractors on professional sites. Use our built-in tools for seamless check-ins.', num: '02' },
              { icon: 'verified_user', title: 'Build Trust', desc: 'Every completed job builds your digital reputation, opening doors to higher-tier projects and pay.', num: '03' },
            ].map(step => (
              <div key={step.num} className="group relative bg-surface-container-lowest p-8 rounded-xl shadow-[0_12px_32px_rgba(45,51,55,0.03)] border border-outline-variant/5 hover:border-primary/20 transition-all duration-300">
                <div className="mb-8 w-16 h-16 rounded-xl bg-primary/5 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                  <span className="material-symbols-outlined text-3xl">{step.icon}</span>
                </div>
                <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                <p className="text-on-surface-variant leading-relaxed mb-6">{step.desc}</p>
                <div className="flex items-center gap-2 text-primary font-bold text-sm tracking-wide">
                  {t(language, 'learnMore')} <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </div>
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-surface text-on-surface-variant/20 font-black text-4xl flex items-center justify-center rounded-full italic">{step.num}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bento Grid Trust Section */}
      <section className="px-6 py-24 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[240px]">
          <div className="md:col-span-8 bg-surface-container rounded-xl p-10 flex flex-col justify-end overflow-hidden relative">
            <img
              className="absolute inset-0 w-full h-full object-cover opacity-20"
              alt="Construction site"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAjmUmGWAfQ7hDArKgj-JOCQHPx7tHneK5EVlX80knYGayZbW4i6OdQmoAzp_VZU9XzMaBNSHIddHFfQmRzNY_xMYhJSMy_MEn1WSgy3g06nGDWVFRn9PWfZ5K5EYmqoC5zqbbKDAmTy2A1ytUXE4yuxq-9e2S945omyPLuT8TVYnbjJ4UY8B6hLMOsGe5Ng_LeVs3a7BW6jjVkFgxHBOgAdJz7rQvXl9NfoZvqyBP8rBTmPSGXF_D3sklMNwLrhHkYw-PjoQiN5tao"
            />
            <div className="relative z-10">
              <h3 className="text-3xl font-bold mb-4">{t(language, 'newStandardSafetyTitle')}</h3>
              <p className="text-on-surface-variant max-w-md">{t(language, 'newStandardSafetyDesc')}</p>
            </div>
          </div>
          <div className="md:col-span-4 bg-primary text-white rounded-xl p-8 flex flex-col justify-between">
            <span className="material-symbols-outlined text-4xl">payments</span>
            <div>
              <h3 className="text-xl font-bold mb-2">Instant Earnings</h3>
              <p className="text-sm opacity-80">Withdraw your funds as soon as the job is marked complete by the site manager. No more waiting 30 days for payment.</p>
            </div>
          </div>
          <div className="md:col-span-4 bg-secondary-container text-on-secondary-container rounded-xl p-8 flex flex-col justify-center items-center text-center">
            <div className="text-5xl font-black mb-2 tracking-tighter">4.9/5</div>
            <p className="font-bold text-sm mb-4">AVG. WORKER RATING</p>
            <div className="flex gap-1 text-secondary">
              {[1,2,3,4,5].map(s => (
                <span key={s} className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              ))}
            </div>
          </div>
          <div className="md:col-span-8 bg-surface-container-high rounded-xl p-10 flex items-center gap-8 group">
            <div className="hidden sm:block w-48 h-full rounded-lg overflow-hidden shrink-0">
              <img
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                alt="Worker hands"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB7ssA1b0X5icGJ9Vn_9aM6ATtHipnc6T_Zl-Sh-ISoUAdlLclcYiPRLSZYY3zKfZCv9830jgstMxbUePTmHZmLFVOy6M5gFeNRvyE995I4K_ILrl9rHWcUUFMuPvRoyiy45_TwI7okjAIWRePfkmIqclrtiI8LWQWnkSAeDcDD6wjOAYMstOJoJMsK7pabgcdTXdul0FjopWHxdJzMiKKmnEfxUykrEfh966hjZl4ENKtz-lLsFTBh052Kn8ysidBHWK9AU97tfF_A"
              />
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-2">Verified Skill Profiles</h3>
              <p className="text-on-surface-variant leading-relaxed">Showcase your certifications and work history in a beautiful, standardized format that contractors love.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-6 mb-24">
        <div className="bg-surface-container-highest rounded-3xl p-12 md:p-20 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
          <h2 className="text-4xl md:text-6xl font-extrabold mb-8 tracking-tight">{t(language, 'readyToBuildLegacy')}</h2>
          <div className="flex flex-col sm:flex-row justify-center gap-6 relative z-10">
            <button
              id="get-started-btn"
              onClick={() => navigate('/signup')}
              className="px-10 py-6 bg-primary text-white rounded-2xl font-bold text-xl shadow-xl hover:scale-105 transition-transform active:scale-95"
            >
              {t(language, 'getStartedToday')}
            </button>
            <button className="px-10 py-6 bg-white border-2 border-primary/10 rounded-2xl font-bold text-xl hover:bg-slate-50 transition-colors active:scale-95">
              {t(language, 'contactSupport')}
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-surface-container py-16 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12">
          <div className="col-span-2 md:col-span-1">
            <div className="text-xl font-extrabold text-primary mb-6">LabourLink</div>
            <p className="text-sm text-on-surface-variant leading-relaxed">The architectural foundation for modern skilled labor management and trust.</p>
          </div>
          <div>
            <h4 className="font-bold mb-6">{t(language, 'platform')}</h4>
            <ul className="space-y-4 text-sm text-on-surface-variant">
              <li><button onClick={() => navigate('/jobs')} className="hover:text-primary">{t(language, 'findJobsFooter')}</button></li>
              <li><button onClick={() => navigate('/signup')} className="hover:text-primary">{t(language, 'hireWorkersFooter')}</button></li>
              <li><span className="hover:text-primary cursor-pointer">{t(language, 'howItWorks')}</span></li>
              <li><span className="hover:text-primary cursor-pointer">{t(language, 'pricing')}</span></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6">{t(language, 'companySection')}</h4>
            <ul className="space-y-4 text-sm text-on-surface-variant">
              <li><span className="hover:text-primary cursor-pointer">{t(language, 'aboutUs')}</span></li>
              <li><span className="hover:text-primary cursor-pointer">{t(language, 'careers')}</span></li>
              <li><span className="hover:text-primary cursor-pointer">{t(language, 'contact')}</span></li>
              <li><span className="hover:text-primary cursor-pointer">{t(language, 'privacy')}</span></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6">{t(language, 'supportSection')}</h4>
            <ul className="space-y-4 text-sm text-on-surface-variant">
              <li><span className="hover:text-primary cursor-pointer">{t(language, 'helpCenter')}</span></li>
              <li><span className="hover:text-primary cursor-pointer">{t(language, 'safety')}</span></li>
              <li><span className="hover:text-primary cursor-pointer">{t(language, 'community')}</span></li>
              <li><span className="hover:text-primary cursor-pointer">{t(language, 'status')}</span></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-16 mt-16 border-t border-outline-variant/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-on-surface-variant">{t(language, 'copyrightFoot')}</p>
          <div className="flex gap-6">
            <span className="material-symbols-outlined text-on-surface-variant text-xl cursor-pointer hover:text-primary">public</span>
            <span className="material-symbols-outlined text-on-surface-variant text-xl cursor-pointer hover:text-primary">share</span>
            <span className="material-symbols-outlined text-on-surface-variant text-xl cursor-pointer hover:text-primary">settings</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
