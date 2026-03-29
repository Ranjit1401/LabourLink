import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { api } from '../utils/api';
import { useEffect } from 'react';

export default function Navbar() {
  const navigate = useNavigate();
  const { isLoggedIn, setIsLoggedIn, showToast, token, unreadCount } = useApp();

  useEffect(() => {
    if (!token) return;
  
    const fetchNotifications = async () => {
      try {
        await api.getNotifications();
      } catch (e) {
        console.error('Failed to fetch notifications', e);
      }
    };
  
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30_000);
    return () => clearInterval(interval);
  }, [token]);
  
  
  // Language State
  const [language, setLanguage] = useState('EN');
  const [showLangMenu, setShowLangMenu] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    showToast('Logged out successfully', 'success');
    navigate('/');
  };

  // Replace the previous 'languages' array with this more comprehensive list
const languages = [
  { code: 'EN', name: 'English' },
  { code: 'HI', name: 'हिन्दी' },
  { code: 'MR', name: 'मराठी' },
  { code: 'TA', name: 'தமிழ்' },
  { code: 'TE', name: 'తెలుగు' },
  { code: 'GU', name: 'ગુજરાતી' },
  { code: 'BN', name: 'বাংলা' }
];

  return (
    <nav className="bg-surface-container-lowest border-b border-surface-container sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/feed')}>
            <span className="material-symbols-outlined text-primary text-3xl">handshake</span>
            <span className="font-headline font-bold text-xl text-primary tracking-tight">LabourLink</span>
          </div>

          {/* Navigation Items */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="/feed" className="flex flex-col items-center text-on-surface-variant hover:text-primary transition-colors">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>home</span>
              <span className="text-[10px] font-bold mt-1">Home</span>
            </a>

            {/* Added: Connections */}
            <a href="/connections" className="flex flex-col items-center text-on-surface-variant hover:text-primary transition-colors">
              <span className="material-symbols-outlined">group</span>
              <span className="text-[10px] font-bold mt-1">Connections</span>
            </a>

            <a href="/jobs" className="flex flex-col items-center text-on-surface-variant hover:text-primary transition-colors">
              <span className="material-symbols-outlined">work</span>
              <span className="text-[10px] font-bold mt-1">Jobs</span>
            </a>
            
            <a href="/worker-profile" className="flex flex-col items-center text-on-surface-variant hover:text-primary transition-colors">
              <span className="material-symbols-outlined">person</span>
              <span className="text-[10px] font-bold mt-1">Profile</span>
            </a>
          </div>

          {/* User & Actions */}
          <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/notifications')}
            className="relative text-on-surface-variant hover:text-primary transition-colors"
          >
          </button>
            
            {/* Added: Language Selection */}
            <div className="relative">
              <button 
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="flex items-center gap-1 text-on-surface-variant hover:bg-surface-container-high px-2 py-1 rounded-md transition-all"
              >
                <span className="material-symbols-outlined text-[20px]">language</span>
                <span className="text-xs font-bold">{language}</span>
                <span className="material-symbols-outlined text-[16px]">arrow_drop_down</span>
              </button>

              {showLangMenu && (
                <div className="absolute right-0 mt-2 w-32 bg-surface-container-lowest border border-surface-container rounded-lg shadow-xl py-1 z-50">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code);
                        setShowLangMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-primary/10 text-on-surface hover:text-primary transition-colors font-medium"
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button className="relative text-on-surface-variant hover:text-primary transition-colors">
              <span className="material-symbols-outlined">notifications</span>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 bg-error text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-surface-container-lowest">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
            
            {isLoggedIn ? (
              <button 
                onClick={handleLogout} 
                className="hidden md:flex items-center gap-1 text-sm font-bold text-error hover:bg-error/10 px-3 py-2 rounded-lg transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">logout</span> Logout
              </button>
            ) : (
              <button onClick={() => navigate('/login')} className="hidden md:block bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-primary-dim transition-colors">
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}