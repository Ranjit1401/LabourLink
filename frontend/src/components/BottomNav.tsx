import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function BottomNav() {
  const location = useLocation();
  const { userRole } = useApp();

  // Hide on landing and auth pages
  if (location.pathname === '/' || location.pathname === '/signup') return null;

  const links = userRole === 'contractor'
    ? [
        { label: 'Home', icon: 'home', path: '/contractor-dashboard' },
        { label: 'Jobs', icon: 'work', path: '/jobs' },
        { label: 'Feed', icon: 'dynamic_feed', path: '/feed' },
        { label: 'Profile', icon: 'person', path: '/contractor-dashboard' },
      ]
    : [
        { label: 'Home', icon: 'home', path: '/feed' },
        { label: 'Jobs', icon: 'search', path: '/jobs' },
        { label: 'Rate', icon: 'star', path: '/rating' },
        { label: 'Profile', icon: 'person', path: '/worker-profile' },
      ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full flex justify-around items-center px-4 pb-6 pt-3 bg-white/90 backdrop-blur-xl z-50 rounded-t-3xl shadow-[0_-4px_20px_rgba(0,0,0,0.05)] border-t border-slate-100">
      {links.map(link => {
        const isActive = location.pathname === link.path;
        return (
          <Link
            key={link.path + link.label}
            to={link.path}
            className={`flex flex-col items-center justify-center px-5 py-2 transition-all ${
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
            <span className="text-[10px] font-bold uppercase tracking-wider mt-1">{link.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
