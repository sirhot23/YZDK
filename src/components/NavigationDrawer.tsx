import React, { useEffect } from 'react';
import {
  X,
  Sparkles,
  LayoutDashboard,
  BookOpen,
  History,
  User,
  Settings,
  GraduationCap,
  RotateCcw,
  BookmarkCheck,
  Lightbulb,
  Info,
  HelpCircle,
  ShieldCheck,
  LogOut,
  ChevronRight,
  Flame,
  Award,
  Target,
  Camera,
  Cpu,
  LogIn,
  UserPlus,
} from 'lucide-react';
import { UserProfile } from '../types';

interface NavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentPath: string;
  navigate: (path: string) => void;
  user: UserProfile | null;
  onOpenRoadmap: () => void;
  onLogout?: () => void;
}

export const NavigationDrawer: React.FC<NavigationDrawerProps> = ({
  isOpen,
  onClose,
  currentPath,
  navigate,
  user,
  onOpenRoadmap,
  onLogout,
}) => {
  // Close drawer when ESC is pressed
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent background scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleNavigate = (path: string) => {
    navigate(path);
    onClose();
  };

  const isActive = (path: string) => {
    if (path === '/' && currentPath === '/') return true;
    if (path !== '/' && currentPath.startsWith(path)) return true;
    return false;
  };

  if (!isOpen) return null;

  // Calculate daily goal percentage
  const dailyCurrent = user?.dailyGoal?.current ?? 0;
  const dailyTarget = user?.dailyGoal?.target ?? 20;
  const dailyPercentage = Math.min(100, Math.round((dailyCurrent / dailyTarget) * 100));

  return (
    <div className="fixed inset-0 z-50 flex justify-start">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-300 animate-fadeIn"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div
        className="relative w-full max-w-sm sm:max-w-md bg-white h-full shadow-2xl flex flex-col z-50 transform transition-transform duration-300 ease-out border-r border-slate-200"
        role="dialog"
        aria-modal="true"
        aria-label="Ana Navigasyon Menüsü"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200/90 flex items-center justify-between bg-gradient-to-r from-slate-50 via-white to-indigo-50/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-blue-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black bg-gradient-to-r from-indigo-950 via-indigo-800 to-blue-700 bg-clip-text text-transparent">
                  UniÇözüm
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-700">
                  v1.3
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-500">
                Üniversite & Sınav Asistanı
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition focus:outline-none focus:ring-2 focus:ring-indigo-500"
            title="Menüyü Kapat (ESC)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
          {/* User Profile Card (if authenticated) */}
          {user ? (
            <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-900 via-indigo-800 to-blue-900 text-white shadow-lg shadow-indigo-900/15">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white/15 backdrop-blur-md border border-white/20 text-white font-black text-lg flex items-center justify-center shadow-inner">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-white leading-tight flex items-center gap-1.5">
                      {user.name}
                      {user.isEduVerified && (
                        <span className="inline-block px-1.5 py-0.5 bg-emerald-400/20 text-emerald-300 text-[9px] font-semibold rounded border border-emerald-400/40">
                          .EDU ONAYLI
                        </span>
                      )}
                    </h2>
                    <p className="text-[11px] text-indigo-200 line-clamp-1 mt-0.5">
                      {user.university}
                    </p>
                    <p className="text-[10px] text-indigo-300/80 line-clamp-1">
                      {user.department}
                    </p>
                  </div>
                </div>
              </div>

              {/* Mini Stats Bar */}
              <div className="grid grid-cols-3 gap-2 pt-2 pb-1 border-t border-white/10 text-center">
                <div className="bg-white/10 rounded-xl p-1.5">
                  <p className="text-[10px] text-indigo-200">GANO</p>
                  <p className="text-xs font-bold text-amber-300">{user.gpa.toFixed(2)}</p>
                </div>
                <div className="bg-white/10 rounded-xl p-1.5">
                  <p className="text-[10px] text-indigo-200">Çözülen</p>
                  <p className="text-xs font-bold text-white">{user.totalQuestionsSolved}</p>
                </div>
                <div className="bg-white/10 rounded-xl p-1.5 flex flex-col items-center justify-center">
                  <p className="text-[10px] text-indigo-200">Seri</p>
                  <p className="text-xs font-bold text-orange-300 flex items-center gap-0.5">
                    <Flame className="w-3 h-3 fill-orange-400 text-orange-400" />
                    {user.streakDays}g
                  </p>
                </div>
              </div>

              {/* Günlük Hedef Mini İlerleme */}
              <div className="mt-3 pt-2.5 border-t border-white/10">
                <div className="flex items-center justify-between text-[11px] mb-1 font-medium">
                  <span className="text-indigo-200 flex items-center gap-1">
                    <Target className="w-3 h-3 text-emerald-400" /> Günlük Hedef
                  </span>
                  <span className="text-emerald-300 font-bold">
                    {dailyCurrent}/{dailyTarget} ({dailyPercentage}%)
                  </span>
                </div>
                <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-400 to-teal-300 rounded-full transition-all duration-500"
                    style={{ width: `${dailyPercentage}%` }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100 text-center">
              <p className="text-xs font-bold text-indigo-900 mb-1">
                Öğrenci Girişi Yapın
              </p>
              <p className="text-[11px] text-indigo-700/80 mb-3">
                Çözdüğünüz soruları kaydedin, kişiselleştirilmiş ders analizinizi görün.
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleNavigate('/auth/login')}
                  className="flex-1 py-2 px-3 bg-white border border-indigo-200 rounded-xl text-xs font-bold text-indigo-700 hover:bg-indigo-50 transition flex items-center justify-center gap-1.5"
                >
                  <LogIn className="w-3.5 h-3.5" /> Giriş Yap
                </button>
                <button
                  onClick={() => handleNavigate('/auth/register')}
                  className="flex-1 py-2 px-3 bg-indigo-600 rounded-xl text-xs font-bold text-white hover:bg-indigo-700 transition flex items-center justify-center gap-1.5 shadow-sm shadow-indigo-600/30"
                >
                  <UserPlus className="w-3.5 h-3.5" /> Kayıt Ol
                </button>
              </div>
            </div>
          )}

          {/* Quick Solver CTA Button */}
          <button
            onClick={() => handleNavigate('/solver/upload')}
            className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-blue-600 text-white font-bold text-xs flex items-center justify-between shadow-md shadow-indigo-600/20 hover:shadow-indigo-600/30 hover:scale-[1.01] transition transform group"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center">
                <Camera className="w-4 h-4 text-white" />
              </div>
              <div className="text-left">
                <p className="leading-tight">Yapay Zekâ Soru Çöz</p>
                <p className="text-[10px] text-indigo-200 font-normal">Fotoğraf yükle veya kamerayla çek</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-white/80 group-hover:translate-x-0.5 transition-transform" />
          </button>

          {/* Group 1: Ana Merkez */}
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-600 px-2 mb-2">
              Ana Merkez
            </p>
            <div className="space-y-1">
              <button
                onClick={() => handleNavigate('/dashboard')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                  isActive('/dashboard') && currentPath === '/dashboard'
                    ? 'bg-indigo-50 text-indigo-700 font-bold'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <LayoutDashboard
                    className={`w-4 h-4 ${
                      isActive('/dashboard') && currentPath === '/dashboard'
                        ? 'text-indigo-600'
                        : 'text-slate-600'
                    }`}
                  />
                  <span>Öğrenci Kontrol Paneli</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              </button>

              <button
                onClick={() => handleNavigate('/solver/upload')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                  isActive('/solver')
                    ? 'bg-indigo-50 text-indigo-700 font-bold'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Sparkles
                    className={`w-4 h-4 ${
                      isActive('/solver') ? 'text-indigo-600' : 'text-slate-600'
                    }`}
                  />
                  <span>AI Çözüm & Soru Kırpma</span>
                </div>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-100 text-amber-800">
                  OCR+LLM
                </span>
              </button>
            </div>
          </div>

          {/* Group 2: Fakülteler & Müfredat */}
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-600 px-2 mb-2">
              Fakülte & Ders Müfredatı
            </p>
            <div className="space-y-1">
              <button
                onClick={() => handleNavigate('/courses')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                  isActive('/courses') && !currentPath.includes('fac_aof')
                    ? 'bg-indigo-50 text-indigo-700 font-bold'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <GraduationCap
                    className={`w-4 h-4 ${
                      isActive('/courses') ? 'text-indigo-600' : 'text-slate-600'
                    }`}
                  />
                  <span>Tüm Fakülteler & Dersler</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              </button>

              {/* Direct Link to AÖF Yapay Zeka Destekli Kodlama */}
              <button
                onClick={() => handleNavigate('/courses/yzk101/topics')}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-indigo-900 bg-indigo-50/70 border border-indigo-100/80 hover:bg-indigo-100/70 transition"
              >
                <div className="flex items-center gap-2.5">
                  <Cpu className="w-4 h-4 text-indigo-600" />
                  <div className="text-left">
                    <p className="font-bold leading-tight">AÖF Yapay Zeka Kodlama</p>
                    <p className="text-[10px] text-indigo-600 font-normal">YZK 101, 103, 105, 201...</p>
                  </div>
                </div>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-indigo-600 text-white">
                  Yeni
                </span>
              </button>
            </div>
          </div>

          {/* Group 3: Çalışma & Tekrar Odası */}
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-600 px-2 mb-2">
              Çalışma & Tekrar Odası
            </p>
            <div className="space-y-1">
              <button
                onClick={() => handleNavigate('/history/wrong-answers')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                  currentPath.includes('/wrong-answers')
                    ? 'bg-rose-50 text-rose-700 font-bold'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <RotateCcw
                    className={`w-4 h-4 ${
                      currentPath.includes('/wrong-answers')
                        ? 'text-rose-600'
                        : 'text-slate-600'
                    }`}
                  />
                  <span>Tekrar Havuzu (Hatalı Çözülenler)</span>
                </div>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-rose-100 text-rose-700">
                  Aralıklı Tekrar
                </span>
              </button>

              <button
                onClick={() => handleNavigate('/history/saved-questions')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                  currentPath.includes('/saved-questions')
                    ? 'bg-indigo-50 text-indigo-700 font-bold'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <BookmarkCheck
                    className={`w-4 h-4 ${
                      currentPath.includes('/saved-questions')
                        ? 'text-indigo-600'
                        : 'text-slate-600'
                    }`}
                  />
                  <span>Kaydedilen / Favori Sorular</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              </button>

              <button
                onClick={() => handleNavigate('/history')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                  currentPath === '/history'
                    ? 'bg-indigo-50 text-indigo-700 font-bold'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <History
                    className={`w-4 h-4 ${
                      currentPath === '/history' ? 'text-indigo-600' : 'text-slate-600'
                    }`}
                  />
                  <span>Tüm Çözüm Geçmişi</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              </button>
            </div>
          </div>

          {/* Group 4: Hesap & Sistem */}
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-600 px-2 mb-2">
              Hesap & Kurumsal
            </p>
            <div className="space-y-1">
              <button
                onClick={() => handleNavigate('/dashboard/profile')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                  currentPath === '/dashboard/profile'
                    ? 'bg-indigo-50 text-indigo-700 font-bold'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <User
                    className={`w-4 h-4 ${
                      currentPath === '/dashboard/profile'
                        ? 'text-indigo-600'
                        : 'text-slate-600'
                    }`}
                  />
                  <span>Profil ve İstatistik Yönetimi</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              </button>

              <button
                onClick={() => handleNavigate('/dashboard/profile/settings')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                  currentPath.includes('/settings')
                    ? 'bg-indigo-50 text-indigo-700 font-bold'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Settings
                    className={`w-4 h-4 ${
                      currentPath.includes('/settings')
                        ? 'text-indigo-600'
                        : 'text-slate-600'
                    }`}
                  />
                  <span>Hesap ve Bildirim Ayarları</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              </button>

              <button
                onClick={() => {
                  onClose();
                  onOpenRoadmap();
                }}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-amber-800 bg-amber-50/80 border border-amber-200/80 hover:bg-amber-100 transition"
              >
                <div className="flex items-center gap-2.5">
                  <Lightbulb className="w-4 h-4 text-amber-600" />
                  <span>Geliştirme Önerileri & Mimari</span>
                </div>
                <span className="text-[10px] bg-amber-200/80 px-1.5 py-0.5 rounded font-bold">
                  Yol Haritası
                </span>
              </button>

              <button
                onClick={() => handleNavigate('/static-pages/about')}
                className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
              >
                <div className="flex items-center gap-2.5">
                  <Info className="w-4 h-4 text-slate-600" />
                  <span>Hakkımızda & Sistem Nasıl Çalışır?</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              </button>

              <button
                onClick={() => handleNavigate('/static-pages/faq')}
                className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
              >
                <div className="flex items-center gap-2.5">
                  <HelpCircle className="w-4 h-4 text-slate-600" />
                  <span>Sıkça Sorulan Sorular (SSS)</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              </button>

              <button
                onClick={() => handleNavigate('/static-pages/legal')}
                className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
              >
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-slate-600" />
                  <span>KVKK & Kullanım Şartları</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          {user ? (
            <button
              onClick={() => {
                onClose();
                if (onLogout) onLogout();
                else navigate('/auth/login');
              }}
              className="flex items-center gap-2 text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-3 py-1.5 rounded-xl transition"
            >
              <LogOut className="w-4 h-4" />
              <span>Çıkış Yap</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleNavigate('/auth/login')}
                className="text-xs font-bold text-indigo-700 hover:underline"
              >
                Giriş Yap
              </button>
              <span className="text-slate-400">•</span>
              <button
                onClick={() => handleNavigate('/auth/register')}
                className="text-xs font-bold text-indigo-700 hover:underline"
              >
                Kayıt Ol
              </button>
            </div>
          )}

          <p className="text-[10px] text-slate-600">
            © 2025 UniÇözüm AI
          </p>
        </div>
      </div>
    </div>
  );
};
