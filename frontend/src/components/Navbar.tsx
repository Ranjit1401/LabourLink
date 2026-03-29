import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { LANGUAGES, t } from "../utils/i18n";
import { api } from "../utils/api";

export default function Navbar() {
  const navigate = useNavigate();
  const {
    isLoggedIn, setIsLoggedIn, showToast,
    token, unreadCount,
    language, setLanguage,
  } = useApp();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Notification polling
  useEffect(() => {
    if (!token) return;
    const fetchNotifications = async () => {
      try { await api.getNotifications(); }
      catch (e) { console.error("Failed to fetch notifications", e); }
    };
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30_000);
    return () => clearInterval(interval);
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    showToast("Logged out successfully", "success");
    navigate("/");
  };

  // currentLang matches against lowercase codes ("en", "hi", …)
  const currentLang = LANGUAGES.find((l) => l.code === language);

  return (
    <nav className="bg-surface-container-lowest border-b border-surface-container sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">

          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/feed")}>
            <span className="material-symbols-outlined text-primary text-3xl">handshake</span>
            <span className="font-headline font-bold text-xl text-primary tracking-tight">LabourLink</span>
          </div>

          {/* Nav Links */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="/feed" className="flex flex-col items-center text-on-surface-variant hover:text-primary transition-colors">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>home</span>
              <span className="text-[10px] font-bold mt-1">{t(language, 'home')}</span>
            </a>
            <a href="/connections" className="flex flex-col items-center text-on-surface-variant hover:text-primary transition-colors">
              <span className="material-symbols-outlined">group</span>
              <span className="text-[10px] font-bold mt-1">{t(language, 'connections')}</span>
            </a>
            <a href="/jobs" className="flex flex-col items-center text-on-surface-variant hover:text-primary transition-colors">
              <span className="material-symbols-outlined">work</span>
              <span className="text-[10px] font-bold mt-1">{t(language, 'jobs')}</span>
            </a>
            <a href="/worker-profile" className="flex flex-col items-center text-on-surface-variant hover:text-primary transition-colors">
              <span className="material-symbols-outlined">person</span>
              <span className="text-[10px] font-bold mt-1">{t(language, 'profile')}</span>
            </a>
          </div>

          {/* Right-side actions */}
          <div className="flex items-center gap-4">

            {/* Language switcher */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((prev) => !prev)}
                aria-haspopup="listbox"
                aria-expanded={dropdownOpen}
                className="flex items-center gap-1 text-on-surface-variant hover:bg-surface-container-high px-2 py-1 rounded-md transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">language</span>
                <span className="text-xs font-bold">{currentLang?.nativeLabel ?? "English"}</span>
                <span className="material-symbols-outlined text-[16px]">arrow_drop_down</span>
              </button>

              {dropdownOpen && (
                <ul
                  role="listbox"
                  className="absolute right-0 mt-2 w-36 bg-surface-container-lowest border border-surface-container rounded-lg shadow-xl py-1 z-50"
                >
                  {LANGUAGES.map((lang) => (
                    <li
                      key={lang.code}
                      role="option"
                      aria-selected={language === lang.code}
                      onClick={() => {
                        setLanguage(lang.code);   // lowercase "en","hi",… directly
                        setDropdownOpen(false);
                      }}
                      className={`px-4 py-2 text-sm cursor-pointer hover:bg-primary/10 hover:text-primary transition-colors font-medium
                        ${language === lang.code ? "text-primary bg-primary/5" : "text-on-surface"}`}
                    >
                      {lang.nativeLabel}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Notification bell */}
            <button
              onClick={() => navigate("/notifications")}
              className="relative text-on-surface-variant hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined">notifications</span>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 bg-error text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-surface-container-lowest">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            {/* Auth button */}
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="hidden md:flex items-center gap-1 text-sm font-bold text-error hover:bg-error/10 px-3 py-2 rounded-lg transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">logout</span> Logout
              </button>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="hidden md:block bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-primary-dim transition-colors"
              >
                {t(language, 'signIn')}
              </button>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}