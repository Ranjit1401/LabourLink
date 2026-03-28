import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';

const HIDDEN_PATHS = ['/', '/signup', '/login'];

export default function BottomNav() {
  const location = useLocation();
  const { userRole } = useApp();
const token = localStorage.getItem('token'); // read directly from localStorage
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch unread notification count
  useEffect(() => {
    if (!token) return;

    const fetchNotifications = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/notifications`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        const unseen = data.filter((n: { seen: boolean }) => !n.seen).length;
        setUnreadCount(unseen);
      } catch {
        // silently fail — badge is non-critical
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30_000); // poll every 30s
    return () => clearInterval(interval);
  }, [token]);

  if (HIDDEN_PATHS.includes(location.pathname)) return null;
  if (!userRole) return null; // guard against null before context loads

  const links =
    userRole === 'contractor'
      ? [
          { label: 'Home', icon: 'home', path: '/contractor-dashboard' },
          { label: 'Jobs', icon: 'work', path: '/jobs' },
          { label: 'Feed', icon: 'dynamic_feed', path: '/feed' },
          { label: 'Profile', icon: 'person', path: '/contractor-profile' }, // ✅ fixed
        ]
      : [
          { label: 'Home', icon: 'home', path: '/feed' },
          { label: 'Jobs', icon: 'search', path: '/jobs' },
          { label: 'Rate', icon: 'star', path: '/rating' },
          { label: 'Profile', icon: 'person', path: '/worker-profile' },
        ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full flex justify-around items-center px-4 pb-6 pt-3 bg-white/90 backdrop-blur-xl z-50 rounded-t-3xl shadow-[0_-4px_20px_rgba(0,0,0,0.05)] border-t border-slate-100">
      {links.map((link) => {
        const isActive = location.pathname === link.path;
        const showBadge = link.icon === 'dynamic_feed' || link.icon === 'home'; // adjust to whichever tab shows notifications

        return (
          <Link
            key={link.path + link.label}
            to={link.path}
            className={`relative flex flex-col items-center justify-center px-5 py-2 transition-all ${
              isActive
                ? 'bg-emerald-100 text-emerald-900 rounded-2xl scale-90'
                : 'text-slate-500'
            }`}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
            >
              {link.icon}
            </span>

            {/* Notification badge */}
            {showBadge && unreadCount > 0 && (
              <span className="absolute top-1 right-3 min-w-[16px] h-4 px-1 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}

            <span className="text-[10px] font-bold uppercase tracking-wider mt-1">
              {link.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}