import { Link, useLocation } from 'react-router-dom';
import { MOCK_WORKER } from '../utils/mockData';
import { NAV_ITEMS } from '../utils/helpers';

interface SidebarProps {
  showStats?: boolean;
}

const Sidebar = ({ showStats = false }: SidebarProps) => {
  const location = useLocation();

  return (
    <aside className="hidden lg:flex lg:col-span-3 flex-col sticky top-24 space-y-4 h-fit">
      {/* Profile Stats Card (Feed page) */}
      {showStats && (
        <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-16 bg-primary/10"></div>
          <div className="relative pt-4 flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-2xl bg-primary text-white flex items-center justify-center text-3xl font-extrabold shadow-md mb-4 font-headline">
              AS
            </div>
            <h2 className="text-xl font-bold text-on-surface font-headline">
              {MOCK_WORKER.name}
            </h2>
            <p className="text-sm text-secondary font-semibold">Verified Skilled Professional</p>

            {/* Mini Stats */}
            <div className="mt-5 w-full space-y-3 pt-5 border-t border-surface-container">
              <div className="flex justify-between text-sm">
                <span className="text-on-surface-variant">Profile Views</span>
                <span className="font-bold text-primary">{MOCK_WORKER.profileViews}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-on-surface-variant">Completed Jobs</span>
                <span className="font-bold text-primary">{MOCK_WORKER.jobsCompleted}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-on-surface-variant">Rating</span>
                <span className="font-bold text-secondary flex items-center gap-1">
                  {MOCK_WORKER.rating}
                  <span
                    className="material-symbols-outlined text-sm"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    star
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="bg-surface-container-lowest rounded-xl py-4 shadow-sm">
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 mx-2 rounded-xl font-semibold transition-all ${
                isActive
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Find Work CTA */}
      <Link
        to="/jobs"
        className="w-full py-4 bg-gradient-to-r from-primary to-primary-dim text-white rounded-xl font-bold shadow-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
      >
        <span className="material-symbols-outlined">add_circle</span>
        Find New Work
      </Link>
    </aside>
  );
};

export default Sidebar;
