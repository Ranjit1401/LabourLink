import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { api } from '../utils/api';

export default function LoginSignupPage() {
  const navigate = useNavigate();
  const { setUserRole, setIsLoggedIn, showToast } = useApp();
  
  const [selectedRole, setSelectedRole] = useState<'worker' | 'contractor'>('worker');
  const [isSignup, setIsSignup] = useState(false);
  
  // States
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [referralCode, setReferralCode] = useState(''); // Naya State Referral ke liye

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isSignup) {
        // Backend Signup API Call
        await api.signup({
          name: name,
          email: email,
          phone: phone,
          password: password,
          role: selectedRole === 'worker' ? 'labour' : 'contractor',
          // Note: Backend Pydantic model me referral code add hone ke baad hi bhejna
          // referral_code: referralCode 
        });
        
        showToast('Account created successfully! Please log in.', 'success');
        setIsSignup(false); 
        setPassword(''); 
      } else {
        // Backend Login API Call
        const data = await api.login({
          email: email,
          password: password
        });

        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        const mappedRole = data.user.role === 'labour' ? 'worker' : 'contractor';
        setUserRole(mappedRole);
        setIsLoggedIn(true);
        showToast(`Welcome Back! Logged in as ${mappedRole}`, 'success');
        
        if (mappedRole === 'worker') {
          navigate('/worker-profile');
        } else {
          navigate('/contractor-dashboard');
        }
      }
    } catch (error: any) {
      showToast(error.message || 'Authentication failed. Please check your details.', 'error');
    }
  };

  return (
    <div className="bg-background font-body text-on-background antialiased min-h-screen flex flex-col">
      <div className="w-full bg-secondary-fixed py-2 px-6 flex justify-center items-center space-x-2">
        <span className="material-symbols-outlined text-on-secondary-fixed text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
        <p className="font-label text-xs font-bold tracking-wide text-on-secondary-fixed uppercase">Verified Skilled Professionals Network</p>
      </div>

      <main className="flex-grow flex items-center justify-center p-6 md:p-12 relative overflow-hidden">
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
            <div className="relative rounded-2xl overflow-hidden h-48 group bg-primary/10">
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="font-bold text-primary text-lg">Empowering the Workforce</p>
              </div>
            </div>
          </div>

          {/* Right Side: Login Form */}
          <div className="w-full max-w-md mx-auto z-10">
            <div className="bg-surface-container-lowest rounded-[2rem] p-8 md:p-10 shadow-[0_12px_32px_rgba(45,51,55,0.06)] border border-outline-variant/10">
              <div className="mb-8 text-center lg:text-left">
                <h2 className="font-headline text-3xl font-bold text-on-surface tracking-tight">
                  {isSignup ? 'Create Account' : 'Welcome Back'}
                </h2>
                <p className="text-on-surface-variant mt-2">
                  {isSignup ? 'Join the verified professional network' : 'Sign in to manage your professional journey'}
                </p>
              </div>

              {isSignup && (
                <div className="mb-8">
                  <p className="font-label text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-4 ml-1">Identify Your Role</p>
                  <div className="flex gap-3">
                    <button type="button" onClick={() => setSelectedRole('worker')}
                      className={`flex-1 flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all ${
                        selectedRole === 'worker' ? 'border-primary bg-primary/5 text-primary' : 'border-outline-variant bg-surface-container-lowest text-on-surface-variant hover:border-primary/50'
                      }`}
                    >
                      <span className="material-symbols-outlined mb-1" style={{ fontVariationSettings: selectedRole === 'worker' ? "'FILL' 1" : "'FILL' 0" }}>engineering</span>
                      <span className="font-headline text-sm font-bold">Worker</span>
                    </button>
                    <button type="button" onClick={() => setSelectedRole('contractor')}
                      className={`flex-1 flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all ${
                        selectedRole === 'contractor' ? 'border-primary bg-primary/5 text-primary' : 'border-outline-variant bg-surface-container-lowest text-on-surface-variant hover:border-primary/50'
                      }`}
                    >
                      <span className="material-symbols-outlined mb-1" style={{ fontVariationSettings: selectedRole === 'contractor' ? "'FILL' 1" : "'FILL' 0" }}>domain</span>
                      <span className="font-headline text-sm font-bold">Contractor</span>
                    </button>
                  </div>
                </div>
              )}

              <form className="space-y-4" onSubmit={handleSubmit}>
                {isSignup && (
                  <div className="space-y-1.5">
                    <input className="w-full h-12 px-5 bg-surface-container-highest border-none rounded-xl focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all text-on-surface placeholder:text-outline"
                      id="name" placeholder="Full Name (e.g., John Doe)" type="text" value={name} onChange={e => setName(e.target.value)} required={isSignup} />
                  </div>
                )}

                <div className="space-y-1.5">
                  <input className="w-full h-12 px-5 bg-surface-container-highest border-none rounded-xl focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all text-on-surface placeholder:text-outline"
                    id="email" placeholder="Email Address" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                </div>

                {isSignup && (
                  <div className="space-y-1.5">
                    <input className="w-full h-12 px-5 bg-surface-container-highest border-none rounded-xl focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all text-on-surface placeholder:text-outline"
                      id="phone" placeholder="Phone Number" type="tel" value={phone} onChange={e => setPhone(e.target.value)} required={isSignup} />
                  </div>
                )}

                <div className="space-y-1.5">
                  <input className="w-full h-12 px-5 bg-surface-container-highest border-none rounded-xl focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all text-on-surface placeholder:text-outline"
                    id="password" placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                </div>

                {/* Naya Referral Code input */}
                {isSignup && (
                  <div className="space-y-1.5 pt-2">
                    <label className="text-xs font-bold text-primary ml-1 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">redeem</span> Got a Referral Code?
                    </label>
                    <input className="w-full h-12 px-5 bg-surface-container-highest border border-primary/20 rounded-xl focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all text-on-surface placeholder:text-outline"
                      id="referral" placeholder="Referral Code (Optional)" type="text" value={referralCode} onChange={e => setReferralCode(e.target.value)} />
                  </div>
                )}

                <button type="submit" className="w-full h-14 bg-gradient-to-r from-primary to-primary-dim text-on-primary font-headline font-bold text-lg rounded-xl shadow-lg shadow-primary/20 hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4">
                  {isSignup ? 'Create Account' : 'Enter Sanctuary'}
                  <span className="material-symbols-outlined">arrow_forward</span>
                </button>
              </form>

              <div className="mt-8 flex flex-col items-center space-y-4">
                <button type="button" onClick={() => { setIsSignup(!isSignup); setPassword(''); setReferralCode(''); }} className="w-full h-12 border-2 border-secondary text-secondary font-headline font-bold rounded-xl hover:bg-secondary/5 transition-colors">
                  {isSignup ? 'Sign In Instead' : 'Create Professional Account'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}