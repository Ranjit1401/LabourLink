import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function LoginSignupPage() {
  const navigate = useNavigate();
  const { setUserRole, setIsLoggedIn, showToast } = useApp();
  const [selectedRole, setSelectedRole] = useState<'worker' | 'contractor'>('worker');
  const [tab, setTab] = useState<'phone' | 'email'>('phone');
  const [isSignup, setIsSignup] = useState(false);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUserRole(selectedRole);
    setIsLoggedIn(true);
    showToast(`Welcome! Logged in as ${selectedRole === 'worker' ? 'Worker' : 'Contractor'}`, 'success');
    if (selectedRole === 'worker') {
      navigate('/worker-profile');
    } else {
      navigate('/contractor-dashboard');
    }
  };

  return (
    <div className="bg-background font-body text-on-background antialiased min-h-screen flex flex-col">
      {/* Trust Banner */}
      <div className="w-full bg-secondary-fixed py-2 px-6 flex justify-center items-center space-x-2">
        <span className="material-symbols-outlined text-on-secondary-fixed text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
        <p className="font-label text-xs font-bold tracking-wide text-on-secondary-fixed uppercase">Verified Skilled Professionals Network</p>
      </div>

      <main className="flex-grow flex items-center justify-center p-6 md:p-12 relative overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[40rem] h-[40rem] bg-primary-container/10 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[30rem] h-[30rem] bg-secondary-container/20 rounded-full blur-3xl -z-10"></div>

        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side: Branding */}
          <div className="hidden lg:block space-y-8">
            <div className="space-y-4">
              <h1 className="text-primary font-headline text-6xl font-extrabold tracking-tight cursor-pointer" onClick={() => navigate('/')}>LabourLink</h1>
              <p className="text-on-surface-variant font-headline text-2xl leading-relaxed max-w-md">
                Your professional <span className="text-secondary font-bold">Sanctuary</span> for dignified, high-quality labor connections.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-surface-container-low p-6 rounded-xl border border-outline-variant/15">
                <span className="material-symbols-outlined text-primary text-3xl mb-3">handshake</span>
                <p className="font-headline font-bold text-on-surface">Mutual Trust</p>
                <p className="text-sm text-on-surface-variant mt-1">Verified identities for every single interaction.</p>
              </div>
              <div className="bg-surface-container-low p-6 rounded-xl border border-outline-variant/15">
                <span className="material-symbols-outlined text-secondary text-3xl mb-3">payments</span>
                <p className="font-headline font-bold text-on-surface">Fair Wages</p>
                <p className="text-sm text-on-surface-variant mt-1">Direct payments with transparent earnings tracking.</p>
              </div>
            </div>
            <div className="relative rounded-2xl overflow-hidden h-48 group">
              <img
                alt="Skilled workers"
                className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAxQRxjbiRbpZQQKn9W7t8Du2z0brCirtEiceothuj_SbnyGTYOqRoxDT0HJNUDCvBl29oM2uloH7F3_bQtJ7y_3-N3r8GMmSbr5y5eoHHIvpumMlZqURgaydBuLkKMitZ7qSHcyPxUvPJ-UrATSEKd-6dmvLZdB6_M6HBd2d_ikIsCiMt2DLnWHHICOa-uPKslBAuW9M63RSiuYfRXZ4LEkAjRHJ2bX_-Dy7CxxPlLVJ7A6Sio8IIDuSzyO9Kr5kJA8uVSPtRiAym6"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent"></div>
            </div>
          </div>

          {/* Right Side: Login Form */}
          <div className="w-full max-w-md mx-auto">
            <div className="bg-surface-container-lowest rounded-[2rem] p-8 md:p-10 shadow-[0_12px_32px_rgba(45,51,55,0.06)] border border-outline-variant/10">
              <div className="mb-8 text-center lg:text-left">
                <h2 className="font-headline text-3xl font-bold text-on-surface tracking-tight">
                  {isSignup ? 'Create Account' : 'Welcome Back'}
                </h2>
                <p className="text-on-surface-variant mt-2">
                  {isSignup ? 'Join the verified professional network' : 'Sign in to manage your professional journey'}
                </p>
              </div>

              {/* Role Selection */}
              <div className="mb-8">
                <p className="font-label text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-4 ml-1">Identify Your Role</p>
                <div className="flex gap-3">
                  <button
                    id="role-worker-btn"
                    onClick={() => setSelectedRole('worker')}
                    className={`flex-1 flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all ${
                      selectedRole === 'worker'
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-outline-variant bg-surface-container-lowest text-on-surface-variant hover:border-primary/50'
                    }`}
                  >
                    <span className="material-symbols-outlined mb-1" style={{ fontVariationSettings: selectedRole === 'worker' ? "'FILL' 1" : "'FILL' 0" }}>engineering</span>
                    <span className="font-headline text-sm font-bold">I'm a Worker</span>
                  </button>
                  <button
                    id="role-contractor-btn"
                    onClick={() => setSelectedRole('contractor')}
                    className={`flex-1 flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all ${
                      selectedRole === 'contractor'
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-outline-variant bg-surface-container-lowest text-on-surface-variant hover:border-primary/50'
                    }`}
                  >
                    <span className="material-symbols-outlined mb-1" style={{ fontVariationSettings: selectedRole === 'contractor' ? "'FILL' 1" : "'FILL' 0" }}>domain</span>
                    <span className="font-headline text-sm font-bold">I'm a Contractor</span>
                  </button>
                </div>
              </div>

              {/* Login Options Tabs */}
              <div className="mb-6 flex space-x-6 border-b border-surface-container-high">
                <button
                  onClick={() => setTab('phone')}
                  className={`pb-3 border-b-2 text-sm font-bold ${tab === 'phone' ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant hover:text-on-surface'}`}
                >
                  Phone Number
                </button>
                <button
                  onClick={() => setTab('email')}
                  className={`pb-3 border-b-2 text-sm font-medium ${tab === 'email' ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant hover:text-on-surface'}`}
                >
                  Email Address
                </button>
              </div>

              {/* Input Fields */}
              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-sm font-semibold text-on-surface ml-1" htmlFor="login-input">
                    <span className="material-symbols-outlined text-[18px] text-primary">
                      {tab === 'phone' ? 'smartphone' : 'email'}
                    </span>
                    {tab === 'phone' ? 'Phone Number' : 'Email Address'}
                  </label>
                  <input
                    className="w-full h-14 px-5 bg-surface-container-highest border-none rounded-xl focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all text-on-surface placeholder:text-outline"
                    id="login-input"
                    placeholder={tab === 'phone' ? '+91 99999 00000' : 'you@example.com'}
                    type={tab === 'phone' ? 'tel' : 'email'}
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-sm font-semibold text-on-surface ml-1" htmlFor="password">
                    <span className="material-symbols-outlined text-[18px] text-primary">lock</span>
                    Security Pin / Password
                  </label>
                  <input
                    className="w-full h-14 px-5 bg-surface-container-highest border-none rounded-xl focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all text-on-surface"
                    id="password"
                    placeholder="••••••••"
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                  />
                </div>
                {!isSignup && (
                  <div className="flex items-center justify-between px-1">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary" type="checkbox" />
                      <span className="text-sm text-on-surface-variant">Remember me</span>
                    </label>
                    <button type="button" className="text-sm font-semibold text-primary hover:underline underline-offset-4">Forgot access?</button>
                  </div>
                )}
                <button
                  id="submit-login-btn"
                  type="submit"
                  className="w-full h-14 bg-gradient-to-r from-primary to-primary-dim text-on-primary font-headline font-bold text-lg rounded-xl shadow-lg shadow-primary/20 hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  {isSignup ? 'Create Account' : 'Enter Sanctuary'}
                  <span className="material-symbols-outlined">arrow_forward</span>
                </button>
              </form>

              <div className="mt-10 flex flex-col items-center space-y-4">
                <div className="flex items-center w-full gap-4">
                  <div className="h-px bg-surface-container-high flex-grow"></div>
                  <span className="text-xs font-bold text-outline-variant uppercase tracking-tighter">
                    {isSignup ? 'Already have an account?' : 'New to LabourLink?'}
                  </span>
                  <div className="h-px bg-surface-container-high flex-grow"></div>
                </div>
                <button
                  onClick={() => setIsSignup(!isSignup)}
                  className="w-full h-12 border-2 border-secondary text-secondary font-headline font-bold rounded-xl hover:bg-secondary/5 transition-colors"
                >
                  {isSignup ? 'Sign In Instead' : 'Create Professional Account'}
                </button>
              </div>
            </div>

            <p className="mt-8 text-center text-sm text-on-surface-variant flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-sm">support_agent</span>
              Need help? <button className="font-bold text-primary underline underline-offset-4">Contact Support</button>
            </p>
          </div>
        </div>
      </main>

      <footer className="py-8 px-6 border-t border-surface-container">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-on-surface-variant">
          <p>© 2024 LabourLink. Empowering the global workforce with dignity.</p>
          <div className="flex gap-6">
            <span className="hover:text-primary transition-colors cursor-pointer">Privacy Policy</span>
            <span className="hover:text-primary transition-colors cursor-pointer">Terms of Service</span>
            <span className="hover:text-primary transition-colors cursor-pointer">Accessibility Standards</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
