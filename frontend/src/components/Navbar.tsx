import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useEffect } from 'react';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, setIsLoggedIn, setToken, showToast, token, unreadCount, userRole } = useApp();

  const [language, setLanguage] = useState('EN');
  const [showLangMenu, setShowLangMenu] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
    setIsLoggedIn(false);
    setToken(null);
    showToast('Logged out successfully', 'success');
    navigate('/');
  };

  const languages = [
    { code: 'EN', name: 'English' },
    { code: 'HI', name: 'हिन्दी' },
    { code: 'MR', name: 'मराठी' },
    { code: 'TA', name: 'தமிழ்' },
    { code: 'TE', name: 'తెలుగు' },
    { code: 'GU', name: 'ગુજરાતી' },
    { code: 'BN', name: 'বাংলা' },
  ];

  // Role-aware nav links
  const navLinks = userRole === 'contractor'
    ? [
        { path: '/contractor-dashboard', icon: 'home', label: 'Home' },
        { path: '/my-projects', icon: 'folder_managed', label: 'My Projects' },
        { path: '/jobs', icon: 'work', label: 'Jobs' },
        { path: '/connections', icon: 'group', label: 'Connections' },
      ]
    : [
        { path: '/feed', icon: 'home', label: 'Home' },
        { path: '/connections', icon: 'group', label: 'Connections' },
        { path: '/jobs', icon: 'work', label: 'Jobs' },
        { path: '/worker-profile', icon: 'person', label: 'Profile' },
      ];

  const homePath = userRole === 'contractor' ? '/contractor-dashboard' : '/feed';

  return (
    <nav className="bg-surface-container-lowest border-b border-surface-container sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">

          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate(homePath)}>
            <span className="material-symbols-outlined text-primary text-3xl">handshake</span>
            <span className="font-headline font-bold text-xl text-primary tracking-tight">LabourLink</span>
          </div>

          {/* Nav Links */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map(({ path, icon, label }) => {
              const isActive = location.pathname === path;
              return (
                <Link
                  key={path}
                  to={path}
                  className={`flex flex-col items-center transition-colors ${isActive ? 'text-primary' : 'text-on-surface-variant hover:text-primary'}`}
                >
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>
                    {icon}
                  </span>
                  <span className="text-[10px] font-bold mt-1">{label}</span>
                </Link>
              );
            })}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-4">
            {/* Language selector */}
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
                      onClick={() => { setLanguage(lang.code); setShowLangMenu(false); }}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-primary/10 text-on-surface hover:text-primary transition-colors font-medium"
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Notifications */}
            <button onClick={() => navigate('/notifications')} className="relative text-on-surface-variant hover:text-primary transition-colors">
              <span className="material-symbols-outlined">notifications</span>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 bg-error text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-surface-container-lowest">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Logout */}
            {isLoggedIn ? (
              <button onClick={handleLogout} className="hidden md:flex items-center gap-1 text-sm font-bold text-error hover:bg-error/10 px-3 py-2 rounded-lg transition-colors">
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