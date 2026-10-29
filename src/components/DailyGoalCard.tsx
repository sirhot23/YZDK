import React, { useState, useEffect } from 'react';
import {
  Target,
  CheckCircle2,
  Trophy,
  Sparkles,
  Flame,
  ArrowRight,
  Plus,
  Settings2,
  Check,
  TrendingUp,
  RotateCcw,
} from 'lucide-react';
import { UserProfile } from '../types';
import { api } from '../services/api';

interface DailyGoalCardProps {
  user: UserProfile;
  navigate: (path: string) => void;
  onUserUpdated?: (updated: UserProfile) => void;
  variant?: 'compact' | 'full';
}

export const DailyGoalCard: React.FC<DailyGoalCardProps> = ({
  user,
  navigate,
  onUserUpdated,
  variant = 'full',
}) => {
  const [dailyGoal, setDailyGoal] = useState(() => {
    return user.dailyGoal || { target: 10, current: 0, todayDate: new Date().toISOString().split('T')[0] };
  });

  const [isEditingTarget, setIsEditingTarget] = useState(false);
  const [targetInput, setTargetInput] = useState<string>(String(dailyGoal.target || 10));
  const [loadingAction, setLoadingAction] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    if (user.dailyGoal) {
      setDailyGoal(user.dailyGoal);
      setTargetInput(String(user.dailyGoal.target));
    }
  }, [user.dailyGoal]);

  const target = Math.max(1, dailyGoal.target || 10);
  const current = Math.max(0, dailyGoal.current || 0);
  const percentage = Math.round((current / target) * 100);
  const visualPercentage = Math.min(100, percentage);
  const isCompleted = current >= target;
  const remaining = Math.max(0, target - current);

  const quickTargets = [5, 10, 15, 20, 30];

  const handleSelectTarget = async (newTarget: number) => {
    if (newTarget <= 0 || newTarget === dailyGoal.target) return;
    setLoadingAction(true);
    try {
      const res = await api.updateDailyGoal({ target: newTarget });
      if (res.success && res.dailyGoal) {
        setDailyGoal(res.dailyGoal);
        setTargetInput(String(res.dailyGoal.target));
        if (onUserUpdated && res.profile) {
          onUserUpdated(res.profile);
        }
        showNotification(`Günlük soru hedefi ${newTarget} soru olarak güncellendi.`);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAction(false);
      setIsEditingTarget(false);
    }
  };

  const handleCustomTargetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseInt(targetInput, 10);
    if (!isNaN(parsed) && parsed > 0) {
      await handleSelectTarget(parsed);
    }
  };

  const handleAddQuickProgress = async (delta: number = 1) => {
    setLoadingAction(true);
    try {
      const res = await api.updateDailyGoal({ increment: delta });
      if (res.success && res.dailyGoal) {
        setDailyGoal(res.dailyGoal);
        if (onUserUpdated && res.profile) {
          onUserUpdated(res.profile);
        }
        if (delta > 0) {
          showNotification(`Tebrikler! +${delta} soru günlük hedefe işlendi.`);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAction(false);
    }
  };

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 3200);
  };

  // Formatted date string in Turkish
  const todayFormatted = new Intl.DateTimeFormat('tr-TR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date());

  return (
    <div
      className={`relative overflow-hidden rounded-3xl border transition-all duration-300 ${
        isCompleted
          ? 'bg-gradient-to-br from-white via-emerald-50/40 to-teal-50/30 border-emerald-200/80 shadow-md shadow-emerald-500/5'
          : 'bg-white border-slate-200/90 shadow-sm'
      } p-6`}
    >
      {/* Decorative background glow for completion */}
      {isCompleted && (
        <div className="absolute -right-12 -top-12 w-48 h-48 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none" />
      )}

      {/* Toast Notification */}
      {notification && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 px-3.5 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-full shadow-lg flex items-center gap-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>{notification}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-11 h-11 rounded-2xl flex items-center justify-center transition shadow-sm ${
              isCompleted
                ? 'bg-emerald-500 text-white shadow-emerald-500/30'
                : 'bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-indigo-500/20'
            }`}
          >
            {isCompleted ? <Trophy className="w-5 h-5" /> : <Target className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold text-slate-900 tracking-tight">Günlük Hedef</h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 capitalize border border-slate-200">
                {todayFormatted}
              </span>
            </div>
            <p className="text-xs text-slate-600 font-medium mt-0.5">
              Günün planlanan soru kotası ve ilerleme durumu
            </p>
          </div>
        </div>

        {/* Target Edit Toggle */}
        <button
          onClick={() => setIsEditingTarget(!isEditingTarget)}
          className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border ${
            isEditingTarget
              ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-800'
          }`}
          title="Günlük hedef sayısını değiştir"
        >
          <Settings2 className="w-3.5 h-3.5" />
          <span>{isEditingTarget ? 'Kapat' : 'Hedef Ayarla'}</span>
        </button>
      </div>

      {/* Target Setting Drawer / Pill Row */}
      {isEditingTarget && (
        <div className="mb-5 p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 animate-in fade-in duration-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-indigo-950">Günlük Soru Hedefini Seç:</span>
            <span className="text-[11px] text-indigo-800 font-medium">Hedeflenen Soru / Gün</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-3">
            {quickTargets.map((q) => (
              <button
                key={q}
                onClick={() => handleSelectTarget(q)}
                disabled={loadingAction}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  target === q
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-white text-slate-700 border border-indigo-200/70 hover:bg-indigo-100/50'
                }`}
              >
                {q} Soru
              </button>
            ))}
          </div>

          <form onSubmit={handleCustomTargetSubmit} className="flex items-center gap-2">
            <input
              type="number"
              min="1"
              max="200"
              value={targetInput}
              onChange={(e) => setTargetInput(e.target.value)}
              placeholder="Özel hedef (örn: 12)"
              className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-indigo-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
            />
            <button
              type="submit"
              disabled={loadingAction || !targetInput}
              className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition flex items-center gap-1 shadow-sm disabled:opacity-50"
            >
              <Check className="w-3.5 h-3.5" />
              Kaydet
            </button>
          </form>
        </div>
      )}

      {/* Central Numbers & Status */}
      <div className="flex flex-wrap items-baseline justify-between gap-3 mb-2">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-black text-slate-900 tracking-tight">{current}</span>
          <span className="text-slate-600 font-bold text-sm">/ {target} Soru</span>
          <span
            className={`text-xs font-extrabold px-2 py-0.5 rounded-full border ${
              isCompleted
                ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                : 'bg-indigo-50 text-indigo-700 border-indigo-200'
            }`}
          >
            %{percentage}
          </span>
        </div>

        <div>
          {isCompleted ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-emerald-800 bg-emerald-100/80 px-2.5 py-1 rounded-full border border-emerald-300/60">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-800" />
              Tebrikler! Günlük Hedef Tamamlandı 🎉
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
              <Target className="w-3 h-3 text-indigo-600" />
              Hedefe <strong className="text-indigo-800">{remaining} soru</strong> kaldı
            </span>
          )}
        </div>
      </div>

      {/* Main Progress Bar Container */}
      <div className="space-y-1.5 my-3">
        <div className="relative w-full bg-slate-100 rounded-full h-4 overflow-hidden border border-slate-200/90 shadow-inner p-0.5">
          {/* Milestone markers at 25%, 50%, 75% */}
          <div className="absolute inset-0 flex justify-between px-1 pointer-events-none z-10 opacity-30">
            <div className="w-0.5 h-full bg-slate-400" style={{ left: '25%', position: 'absolute' }} />
            <div className="w-0.5 h-full bg-slate-400" style={{ left: '50%', position: 'absolute' }} />
            <div className="w-0.5 h-full bg-slate-400" style={{ left: '75%', position: 'absolute' }} />
          </div>

          <div
            className={`h-full rounded-full transition-all duration-700 relative overflow-hidden ${
              isCompleted
                ? 'bg-gradient-to-r from-teal-500 via-emerald-500 to-green-500 shadow-sm shadow-emerald-500/30'
                : 'bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 shadow-sm shadow-indigo-500/20'
            }`}
            style={{ width: `${visualPercentage}%` }}
          >
            {/* Glossy light streak highlight */}
            <div className="absolute inset-0 bg-white/20 opacity-40 bg-[linear-gradient(45deg,rgba(255,255,255,0.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.15)_50%,rgba(255,255,255,0.15)_75%,transparent_75%,transparent)] bg-[length:16px_16px]" />
          </div>
        </div>

        {/* Milestone labels */}
        <div className="flex justify-between text-[10px] text-slate-600 font-semibold px-0.5">
          <span>0 Soru (%0)</span>
          <span>%25</span>
          <span>%50</span>
          <span>%75</span>
          <span className={isCompleted ? 'text-emerald-800 font-bold' : ''}>
            {target} Soru (%100)
          </span>
        </div>
      </div>

      {/* Motivational Info / Series context */}
      <div className="mt-3 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-600">
          <Flame className="w-4 h-4 text-orange-500 fill-orange-500 flex-shrink-0" />
          <span>
            <strong className="text-slate-800 font-bold">{user.streakDays} Günlük Seri:</strong>{' '}
            {isCompleted
              ? 'Bugünkü seri korundu ve rozet puanı hanene yazıldı!'
              : 'Bugün hedefini tamamlayarak serini ve GPA hedefini güçlendir.'}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Quick simulation helper for immediate feedback */}
          <button
            onClick={() => handleAddQuickProgress(1)}
            disabled={loadingAction}
            className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1 border border-slate-200"
            title="Günün sayacına doğrudan 1 soru ekle (Test / Simülasyon)"
          >
            <Plus className="w-3.5 h-3.5 text-slate-700" />
            <span>+1 Soru Ekle</span>
          </button>

          <button
            onClick={() => navigate('/solver/upload')}
            className={`px-3.5 py-1.5 rounded-xl text-white text-xs font-bold transition shadow-sm flex items-center gap-1.5 ${
              isCompleted
                ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20'
                : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/20'
            }`}
          >
            <span>Soru Çöz</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
