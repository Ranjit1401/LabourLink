import { Link, useLocation } from 'react-router-dom';
import { BOTTOM_NAV_ITEMS } from '../utils/helpers';

const BottomNav = () => {
  const location = useLocation();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full flex justify-around items-center px-4 pb-6 pt-3 bg-white/90 backdrop-blur-xl z-50 rounded-t-3xl border-t border-slate-100 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      {BOTTOM_NAV_ITEMS.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center justify-center px-5 py-2 rounded-2xl transition-all ${
              isActive
                ? 'bg-emerald-100 text-emerald-900 scale-90'
                : 'text-slate-500'
            }`}
          >
            <span
              className="material-symbols-outlined"
              style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
            >
              {item.icon}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider mt-1">
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
};

export default BottomNav;
