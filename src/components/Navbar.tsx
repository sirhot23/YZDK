import React, { useState } from 'react';
import {
  Sparkles,
  BookOpen,
  History,
  User,
  Camera,
  Flame,
  LayoutDashboard,
  Menu,
  X,
  LogOut,
  ChevronDown,
  Layers,
} from 'lucide-react';
import { UserProfile } from '../types';

interface NavbarProps {
  currentPath: string;
  navigate: (path: string) => void;
  user: UserProfile | null;
  onOpenRoadmap: () => void;
  onOpenDrawer: () => void;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPath,
  navigate,
  user,
  onOpenRoadmap,
  onOpenDrawer,
  onLogout,
}) => {
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navItems = [
    { label: 'Panel', path: '/dashboard', icon: LayoutDashboard },
    { label: 'AI Soru Çözücü', path: '/solver/upload', icon: Sparkles, highlight: true },
    { label: 'Derslerim', path: '/courses', icon: BookOpen },
    { label: 'Geçmiş / Defterim', path: '/history', icon: History },
  ];

  const handleNav = (path: string) => {
    navigate(path);
    setUserDropdownOpen(false);
  };

  const isActive = (path: string) => {
    if (path === '/dashboard' && currentPath === '/dashboard') return true;
    if (path !== '/' && path !== '/dashboard' && currentPath.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand + Navigation Drawer Button */}
          <div className="flex items-center gap-3 sm:gap-6">
            <button
              onClick={onOpenDrawer}
              className="p-2 sm:px-3 sm:py-2 rounded-xl text-slate-700 hover:text-indigo-600 hover:bg-indigo-50/70 border border-slate-200 hover:border-indigo-200 transition flex items-center gap-2 shadow-xs group cursor-pointer"
              title="Menü Çekmecesini Aç (Tüm Sayfalar ve Bölümler)"
              aria-label="Navigasyon Menüsü"
            >
              <Menu className="w-5 h-5 text-slate-700 group-hover:text-indigo-600 transition" />
              <span className="hidden sm:inline text-xs font-bold text-slate-700 group-hover:text-indigo-600">
                Menü
              </span>
            </button>

            <button
              onClick={() => handleNav('/')}
              className="flex items-center gap-2.5 group text-left cursor-pointer"
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-blue-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/25 group-hover:scale-105 transition transform">
                <Sparkles className="w-5 h-5 text-white animate-pulse" />
              </div>
              <div>
                <span className="text-xl font-black bg-gradient-to-r from-indigo-900 via-indigo-700 to-blue-600 bg-clip-text text-transparent">
                  UniÇözüm
                </span>
                <span className="block text-[10px] font-semibold text-slate-600 tracking-wider uppercase -mt-1">
                  AI Soru & Sınav Asistanı
                </span>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <button
                    key={item.path}
                    onClick={() => handleNav(item.path)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition ${
                      active
                        ? 'bg-indigo-50 text-indigo-700'
                        : item.highlight
                        ? 'text-indigo-600 hover:bg-indigo-50/60 font-bold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 ${
                        active
                          ? 'text-indigo-600'
                          : item.highlight
                          ? 'text-indigo-500'
                          : 'text-slate-600'
                      }`}
                    />
                    {item.label}
                    {item.highlight && (
                      <span className="w-2 h-2 rounded-full bg-indigo-600 animate-ping" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Action Icons & User Info */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                {/* Streak Badge */}
                <div
                  onClick={() => handleNav('/dashboard/profile')}
                  className="cursor-pointer flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-orange-50 border border-orange-200 text-orange-700 text-xs font-bold hover:bg-orange-100 transition"
                  title="Günlük Soru Çözme Serisi"
                >
                  <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
                  <span>{user.streakDays} Gün Seri</span>
                </div>

                {/* User Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2.5 p-1.5 pr-3 rounded-2xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 transition"
                  >
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-blue-500 text-white font-bold text-xs flex items-center justify-center shadow-sm">
                      {user.name.charAt(0)}
                    </div>
                    <div className="text-left text-xs">
                      <p className="font-bold text-slate-800 line-clamp-1">{user.name}</p>
                      <p className="text-[10px] text-slate-600 line-clamp-1">{user.department}</p>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-600" />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50">
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-xs font-bold text-slate-900">{user.name}</p>
                        <p className="text-[10px] text-slate-600 truncate">{user.university}</p>
                      </div>

                      <button
                        onClick={() => handleNav('/dashboard/profile')}
                        className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 flex items-center gap-2"
                      >
                        <User className="w-4 h-4" />
                        Profil ve İstatistikler
                      </button>

                      <button
                        onClick={() => handleNav('/dashboard/profile/settings')}
                        className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 flex items-center gap-2"
                      >
                        <Layers className="w-4 h-4" />
                        Hesap ve Bildirim Ayarları
                      </button>

                      <div className="border-t border-slate-100 my-1" />

                      <button
                        onClick={() => {
                          if (onLogout) onLogout();
                          else handleNav('/auth/login');
                        }}
                        className="w-full px-4 py-2 text-left text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-medium"
                      >
                        <LogOut className="w-4 h-4" />
                        Çıkış Yap
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleNav('/auth/login')}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition"
                >
                  Giriş Yap
                </button>
                <button
                  onClick={() => handleNav('/auth/register')}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20 transition"
                >
                  Kayıt Ol
                </button>
              </div>
            )}
          </div>

          {/* Mobile Actions: Navigation Drawer Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onOpenDrawer}
              className="p-2 rounded-xl text-slate-700 hover:text-indigo-600 hover:bg-indigo-50 border border-slate-200 transition flex items-center justify-center cursor-pointer"
              title="Navigasyon Çekmecesini Aç"
              aria-label="Menüyü Aç"
            >
              <Menu className="w-5 h-5 text-indigo-700" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
