import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function Navbar() {
  const location = useLocation();
  const { isLoggedIn, userRole, notifications, markAllRead, unreadCount } = useApp();
  const [showNotifs, setShowNotifs] = useState(false);

  // Hide navbar on landing and auth pages
  if (location.pathname === '/' || location.pathname === '/signup') return null;

  const navLinks = userRole === 'contractor'
    ? [
        { label: 'Dashboard', path: '/contractor-dashboard' },
        { label: 'Jobs', path: '/jobs' },
        { label: 'Feed', path: '/feed' },
      ]
    : [
        { label: 'Feed', path: '/feed' },
        { label: 'Jobs', path: '/jobs' },
        { label: 'Profile', path: '/worker-profile' },
      ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md shadow-sm">
      <div className="flex justify-between items-center w-full px-6 py-3 max-w-7xl mx-auto">
        <div className="flex items-center gap-8">
          <Link to={isLoggedIn ? '/feed' : '/'} className="text-2xl font-extrabold tracking-tight text-blue-700">LabourLink</Link>
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-body text-sm transition-colors ${
                  location.pathname === link.path
                    ? 'text-blue-700 font-bold border-b-2 border-blue-700 pb-1'
                    : 'text-slate-600 font-medium hover:text-blue-800'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4 relative">
          {/* Search (desktop) */}
          <div className="relative hidden sm:block">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
            <input
              className="pl-10 pr-4 py-2 bg-surface-container-highest border-none rounded-xl text-sm focus:ring-2 focus:ring-primary w-56"
              placeholder="Search..."
              type="text"
            />
          </div>

          {/* Notifications */}
          <button
            onClick={() => setShowNotifs(!showNotifs)}
            className="relative p-2 text-on-surface-variant hover:bg-surface-container rounded-full transition-colors"
          >
            <span className="material-symbols-outlined">notifications</span>
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-error rounded-full ring-2 ring-white"></span>
            )}
          </button>

          {/* Notification Dropdown */}
          {showNotifs && (
            <div className="absolute right-0 top-full mt-3 w-80 md:w-96 bg-surface-container-lowest rounded-xl shadow-[0_12px_32px_rgba(45,51,55,0.06)] border border-outline-variant/15 overflow-hidden z-50">
              <div className="px-5 py-4 flex items-center justify-between bg-surface-container-low/50">
                <h3 className="text-base font-bold text-on-surface font-headline">Notifications</h3>
                <button onClick={() => { markAllRead(); }} className="text-xs font-semibold text-primary hover:underline">Mark all as read</button>
              </div>
              <div className="max-h-[480px] overflow-y-auto">
                {notifications.map(notif => (
                  <div key={notif.id} className="p-4 flex gap-4 hover:bg-surface-container-low transition-colors cursor-pointer border-b border-outline-variant/5">
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                      notif.type === 'job' ? 'bg-primary/10 text-primary' :
                      notif.type === 'rating' ? 'bg-secondary-container text-on-secondary-container' :
                      notif.type === 'payment' ? 'bg-emerald-100 text-secondary' :
                      'bg-surface-container text-on-surface-variant'
                    }`}>
                      <span className="material-symbols-outlined" style={{ fontVariationSettings: notif.type === 'rating' ? "'FILL' 1" : "'FILL' 0" }}>{notif.icon}</span>
                    </div>
                    <div className="flex-grow">
                      <p className="text-sm font-semibold text-on-surface leading-tight">{notif.title}</p>
                      <p className="text-xs text-on-surface-variant mt-1 line-clamp-2">{notif.message}</p>
                      <p className="text-[10px] text-outline font-bold mt-2 uppercase tracking-wide">{notif.time}</p>
                    </div>
                    {!notif.read && <div className="flex-shrink-0 w-2 h-2 mt-1.5 bg-primary rounded-full"></div>}
                  </div>
                ))}
              </div>
              <div className="px-5 py-3 text-center bg-surface-container-highest/20 border-t border-outline-variant/10">
                <button onClick={() => setShowNotifs(false)} className="text-xs font-bold text-on-surface hover:text-primary transition-colors">Close</button>
              </div>
            </div>
          )}

          {/* Profile Avatar */}
          <Link to={userRole === 'contractor' ? '/contractor-dashboard' : '/worker-profile'}>
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/10">
              <img
                alt="User Profile"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAhYAUd-Xkb2uzh7CUW5Y_lBGZrPz_zgSgELrLt_LFj3uk5wC0JnRezY0zKcHN9IGrmj0-KsZ7NWWNvzK-x27RNFIJufJO12Z3kB-hxqqaX2WDjnlV6uGX7XIyQsEJZ1luVRfjXdFn7NINF0kmcrk7801CqpPxDoIKjsIL_mRwv-NufAyEIg6MK1lZcO2Fgov7uhrX7803-Z_EtnluZQx91WY7abVnYUyjql2pQ7hEIRuXaZtU3SqRaQ6aYZ6V67SRAyA3I5BoZ3zKv"
              />
            </div>
          </Link>
        </div>
      </div>
    </nav>
  );
}
