
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, ShoppingBag, RefreshCcw, History, User as UserIcon, Languages, ShieldCheck } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { TRANSLATIONS } from '../constants';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { language, setLanguage, user } = useApp();
  const location = useLocation();
  const t = TRANSLATIONS[language];

  const navItems = [
    { icon: <Home size={20} />, label: t.home, path: '/' },
    { icon: <ShoppingBag size={20} />, label: t.store, path: '/store' },
    { icon: <RefreshCcw size={20} />, label: t.exchange, path: '/exchange' },
    { icon: <History size={20} />, label: t.history, path: '/history' },
    { icon: <UserIcon size={20} />, label: t.profile, path: '/profile' },
  ];

  return (
    <div className="min-h-screen pb-20 flex flex-col max-w-md mx-auto bg-white shadow-xl relative">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-emerald-100 p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="bg-emerald-600 p-1.5 rounded-lg">
            <RefreshCcw className="text-white" size={20} />
          </div>
          <span className="font-bold text-xl tracking-tight text-emerald-800">ZITO</span>
        </div>
        
        <div className="flex items-center gap-3">
          {user?.isAdmin && (
             <Link to="/admin" className="p-2 text-emerald-600 bg-emerald-50 rounded-full">
              <ShieldCheck size={20} />
             </Link>
          )}
          <button 
            onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
            className="flex items-center gap-1 text-xs font-medium bg-sky-50 text-sky-700 px-3 py-1.5 rounded-full border border-sky-100 hover:bg-sky-100 transition-colors"
          >
            <Languages size={14} />
            {language === 'en' ? 'हिन्दी' : 'English'}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-100 flex justify-around items-center h-16 px-2 z-50">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link 
              key={item.path} 
              to={item.path}
              className={`flex flex-col items-center gap-1 transition-all duration-300 ${isActive ? 'text-emerald-600 scale-110' : 'text-gray-400'}`}
            >
              {item.icon}
              <span className="text-[10px] font-medium uppercase tracking-wider">{item.label}</span>
              {isActive && <div className="w-1 h-1 bg-emerald-600 rounded-full mt-0.5"></div>}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Layout
