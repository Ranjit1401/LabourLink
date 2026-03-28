import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const navLinks = [
    { label: 'Feed', path: '/feed' },
    { label: 'Jobs', path: '/jobs' },
    { label: 'Dashboard', path: '/dashboard' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/jobs?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md shadow-sm border-b border-slate-100">
      <div className="flex justify-between items-center w-full px-6 py-3 max-w-7xl mx-auto">
        {/* Logo + Nav Links */}
        <div className="flex items-center gap-8">
          <Link
            to="/feed"
            className="text-2xl font-extrabold tracking-tight text-blue-700 font-headline"
          >
            LabourLink
          </Link>
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-medium transition-colors text-sm ${
                  location.pathname === link.path
                    ? 'text-blue-700 font-bold border-b-2 border-blue-700 pb-1'
                    : 'text-slate-600 hover:text-blue-800'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Right: Search + Actions */}
        <div className="flex items-center gap-4">
          <form onSubmit={handleSearch} className="relative hidden sm:block">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search skills or locations..."
              className="pl-10 pr-4 py-2 bg-surface-container-highest border-none rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary w-56 transition-all"
            />
          </form>

          <button
            className="p-2 text-on-surface-variant hover:bg-surface-container rounded-full transition-colors relative"
            aria-label="Notifications"
          >
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full"></span>
          </button>

          <Link to="/profile">
            <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm border-2 border-primary-container cursor-pointer">
              AS
            </div>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
