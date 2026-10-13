import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { 
  ShieldCheck, 
  Globe, 
  Sun, 
  Moon, 
  User, 
  Menu, 
  X, 
  Lock, 
  LogOut,
  Sliders,
  ChevronDown
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onOpenAuth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab, onOpenAuth }) => {
  const { language, setLanguage, t } = useLanguage();
  const { user, logout, isAdminAuthenticated } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isThemeDark, setIsThemeDark] = useState(true);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const toggleTheme = () => {
    setIsThemeDark(!isThemeDark);
    if (isThemeDark) {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  };

  const navItems = [
    { id: 'home', label: t('nav.home') },
    { id: 'features', label: t('nav.features') },
    { id: 'couriers', label: t('nav.couriers') },
    { id: 'documentation', label: t('nav.documentation') },
    { id: 'contact', label: t('nav.contact') },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#050811]/85 backdrop-blur-md border-b border-cyan-500/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        
        {/* Left: Brand Identity */}
        <div 
          onClick={() => { setCurrentTab('home'); setIsMobileMenuOpen(false); }}
          className="flex items-center gap-3 cursor-pointer group shrink-0"
        >
          {/* Futuristic X-Logo */}
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 via-blue-600/30 to-slate-900 border border-cyan-400/40 flex items-center justify-center shadow-[0_0_15px_rgba(0,240,255,0.25)] group-hover:border-cyan-400 group-hover:shadow-[0_0_22px_rgba(0,240,255,0.4)] transition-all">
            <span className="text-xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-200 to-blue-400">
              X
            </span>
            <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan-400 border-2 border-[#050811]" />
          </div>

          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-bold tracking-tight text-white group-hover:text-cyan-300 transition-colors">
                XBZ Intelligence
              </span>
              <span className="text-[10px] font-medium text-cyan-400/80">
                by Naim Xbz
              </span>
            </div>
            <span className="text-[11px] text-slate-400 tracking-wide font-medium">
              {t('brand.subtitle')}
            </span>
          </div>
        </div>

        {/* Center: Navigation Links (Desktop) */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`px-3.5 py-2 text-sm font-medium rounded-lg transition-all ${
                  isActive
                    ? 'text-cyan-300 bg-cyan-500/10 border border-cyan-500/30 shadow-[0_0_12px_rgba(0,240,255,0.15)]'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right: Actions, Language Switcher, Theme & Auth */}
        <div className="hidden sm:flex items-center gap-3">
          
          {/* Language Switcher */}
          <button
            onClick={() => setLanguage(language === 'bn' ? 'en' : 'bn')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-900/80 border border-slate-700/80 hover:border-cyan-500/40 text-slate-200 hover:text-cyan-300 transition-all shadow-sm"
            title="Switch Language"
          >
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            <span>{language === 'bn' ? 'English' : 'বাংলা'}</span>
          </button>

          {/* Theme Toggle (Dark Default) */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-slate-900/80 border border-slate-700/80 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-300 transition-all"
            title={isThemeDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle theme"
          >
            {isThemeDark ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-cyan-400" />
            )}
          </button>

          {/* Admin shortcut if logged in */}
          {isAdminAuthenticated && (
            <button
              onClick={() => setCurrentTab('admin')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 transition-all"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Admin</span>
            </button>
          )}

          {/* Login / Sign Up or Account Profile */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-cyan-500/30 text-sm font-medium text-cyan-200 hover:border-cyan-400 transition-all"
              >
                <div className="w-6 h-6 rounded-full bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-xs text-cyan-300 font-bold">
                  {user.name.charAt(0)}
                </div>
                <span className="max-w-[100px] truncate">{user.name}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl bg-[#0a1022] border border-cyan-500/30 shadow-2xl py-1.5 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-3.5 py-2 border-b border-slate-800">
                    <p className="text-xs font-semibold text-white truncate">{user.businessName}</p>
                    <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      setCurrentTab('account');
                      setIsProfileMenuOpen(false);
                    }}
                    className="w-full text-left px-3.5 py-2 text-xs font-medium text-slate-200 hover:bg-cyan-500/10 hover:text-cyan-300 flex items-center gap-2"
                  >
                    <User className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{t('nav.account')}</span>
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      setIsProfileMenuOpen(false);
                    }}
                    className="w-full text-left px-3.5 py-2 text-xs font-medium text-red-300 hover:bg-red-500/10 flex items-center gap-2"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>{t('nav.logout')}</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-semibold text-xs tracking-wide shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all hover:shadow-[0_0_22px_rgba(0,240,255,0.5)] cursor-pointer"
            >
              <User className="w-3.5 h-3.5" />
              <span>{t('nav.login')}</span>
            </button>
          )}

          {/* Admin Icon button */}
          <button
            onClick={() => setCurrentTab('admin')}
            className="p-2 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-slate-900 transition-colors"
            title="Administrator Login"
            aria-label="Admin Portal"
          >
            <Lock className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            onClick={() => setLanguage(language === 'bn' ? 'en' : 'bn')}
            className="px-2.5 py-1 text-xs font-semibold rounded bg-slate-900 border border-slate-700 text-slate-200"
          >
            {language === 'bn' ? 'EN' : 'বাং'}
          </button>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg bg-slate-900 text-slate-200 hover:text-cyan-300"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-cyan-500/20 bg-[#070c18] px-4 pt-3 pb-6 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setCurrentTab(item.id);
                setIsMobileMenuOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium ${
                currentTab === item.id
                  ? 'text-cyan-300 bg-cyan-500/10 border border-cyan-500/30'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              {item.label}
            </button>
          ))}

          <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
            {user ? (
              <>
                <button
                  onClick={() => {
                    setCurrentTab('account');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-cyan-300 font-medium"
                >
                  {t('nav.account')} ({user.name})
                </button>
                <button
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-red-400 font-medium"
                >
                  {t('nav.logout')}
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  onOpenAuth();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full py-2.5 rounded-lg bg-cyan-500 text-slate-950 font-bold text-center text-sm shadow-md"
              >
                {t('nav.login')}
              </button>
            )}

            <button
              onClick={() => {
                setCurrentTab('admin');
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left px-4 py-2 text-xs text-slate-400 hover:text-cyan-300"
            >
              {t('nav.admin')}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
