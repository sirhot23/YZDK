import React, { useEffect, useState } from 'react';
import {
  Sparkles,
  Camera,
  Flame,
  Award,
  BookOpen,
  ArrowRight,
  Target,
  CheckCircle2,
  AlertTriangle,
  Bookmark,
  TrendingUp,
  FileQuestion,
  ChevronRight,
  Clock,
} from 'lucide-react';
import { UserProfile, QuestionSolution, Faculty } from '../types';
import { api } from '../services/api';
import { CourseProgressChart } from '../components/CourseProgressChart';
import { DailyGoalCard } from '../components/DailyGoalCard';

interface DashboardPageProps {
  user: UserProfile;
  navigate: (path: string) => void;
  onUserUpdated?: (updated: UserProfile) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ user, navigate, onUserUpdated }) => {
  const [history, setHistory] = useState<QuestionSolution[]>([]);
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [dueReviews, setDueReviews] = useState<QuestionSolution[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [histRes, facRes, dueRes] = await Promise.all([
          api.getHistory(),
          api.getFaculties(),
          api.getDueReviews(),
        ]);
        if (histRes.success) setHistory(histRes.allHistory);
        if (facRes.success) setFaculties(facRes.faculties);
        if (dueRes.success) setDueReviews(dueRes.dueQuestions);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const dailyTarget = user.dailyGoal?.target || 10;
  const dailyCurrent = user.dailyGoal?.current || 0;
  const dailyPercentage = Math.round((dailyCurrent / dailyTarget) * 100);
  const dailyVisualPercentage = Math.min(100, dailyPercentage);

  const weeklyPercentage = Math.min(
    100,
    Math.round((user.weeklyGoal.current / user.weeklyGoal.target) * 100)
  );

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner & Student Hero */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl border border-indigo-950">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-indigo-500/10 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 text-xs font-semibold">
                {user.university}
              </span>
              <span className="text-xs text-indigo-300 font-medium">
                {user.faculty} • {user.department}
              </span>
              {user.isEduVerified && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  Doğrulanmış Öğrenci
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Hoş Geldin, {user.name} 👋
            </h1>
            <p className="text-xs sm:text-sm text-indigo-200 mt-1 max-w-xl">
              Bugün hedefine ulaşmak için{' '}
              <strong className="text-white font-bold">
                {dailyCurrent >= dailyTarget ? 'günlük hedefini tamamladın!' : `${dailyTarget - dailyCurrent} soru kaldı.`}
              </strong>{' '}
              {user.streakDays} günlük çalışma serin aralıksız sürüyor!
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigate('/solver/upload')}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white font-bold text-xs shadow-lg shadow-indigo-500/30 transition flex items-center gap-2"
            >
              <Camera className="w-4 h-4" />
              Soru Fotoğrafı Yükle
            </button>
            <button
              onClick={() => navigate('/history/wrong-answers')}
              className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs border border-white/20 transition flex items-center gap-2"
            >
              <AlertTriangle className="w-4 h-4 text-amber-300" />
              Hatalı Soru Defteri
            </button>
          </div>
        </div>

        {/* Dual Progress: Daily Goal & Weekly Goal */}
        <div className="mt-6 pt-6 border-t border-indigo-700/50 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {/* Daily Goal Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-indigo-950/40 p-3 rounded-2xl border border-indigo-500/20">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-lg bg-emerald-500/20 text-emerald-300">
                <Target className="w-3.5 h-3.5" />
              </span>
              <div>
                <span className="font-bold text-white block">
                  Günlük Hedef: {dailyCurrent} / {dailyTarget} Soru
                </span>
                <span className="text-[11px] text-indigo-300">
                  {dailyCurrent >= dailyTarget ? 'Günün hedefine ulaşıldı 🎉' : `${Math.max(0, dailyTarget - dailyCurrent)} soru kaldı (%${dailyPercentage})`}
                </span>
              </div>
            </div>
            <div className="w-full sm:w-32 bg-slate-800 rounded-full h-2 overflow-hidden border border-indigo-400/20">
              <div
                className="bg-gradient-to-r from-emerald-400 to-teal-300 h-2 rounded-full transition-all duration-500"
                style={{ width: `${dailyVisualPercentage}%` }}
              />
            </div>
          </div>

          {/* Weekly Goal Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-indigo-950/40 p-3 rounded-2xl border border-indigo-500/20">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-lg bg-indigo-500/20 text-indigo-300">
                <Flame className="w-3.5 h-3.5 text-orange-400 fill-orange-400" />
              </span>
              <div>
                <span className="font-bold text-white block">
                  Haftalık Hedef: {user.weeklyGoal.current} / {user.weeklyGoal.target} Soru
                </span>
                <span className="text-[11px] text-indigo-300">
                  {Math.max(0, user.weeklyGoal.target - user.weeklyGoal.current)} soru kaldı (%{weeklyPercentage})
                </span>
              </div>
            </div>
            <div className="w-full sm:w-32 bg-slate-800 rounded-full h-2 overflow-hidden border border-indigo-400/20">
              <div
                className="bg-gradient-to-r from-indigo-400 to-blue-400 h-2 rounded-full transition-all duration-500"
                style={{ width: `${weeklyPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Streak */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-600">Çözüm Serisi</span>
            <p className="text-2xl font-black text-slate-900 mt-1">{user.streakDays} Gün</p>
            <span className="text-[11px] text-orange-600 font-bold flex items-center gap-1 mt-0.5">
              <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
              Aralıksız Devam
            </span>
          </div>
          <div className="p-3 bg-orange-50 rounded-2xl border border-orange-100 text-orange-600">
            <Flame className="w-6 h-6 fill-orange-500" />
          </div>
        </div>

        {/* Total Solved */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-600">Toplam Çözülen</span>
            <p className="text-2xl font-black text-slate-900 mt-1">{user.totalQuestionsSolved}</p>
            <span className="text-[11px] text-indigo-600 font-medium">Soru & Analiz</span>
          </div>
          <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-100 text-indigo-600">
            <FileQuestion className="w-6 h-6" />
          </div>
        </div>

        {/* Accuracy */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-600">Başarı Yüzdesi</span>
            <p className="text-2xl font-black text-slate-900 mt-1">%{user.accuracyRate}</p>
            <span className="text-[11px] text-emerald-600 font-bold">Yüksek Performans</span>
          </div>
          <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100 text-emerald-600">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* GPA */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-600">Akademik GPA</span>
            <p className="text-2xl font-black text-slate-900 mt-1">{user.gpa} / 4.00</p>
            <span className="text-[11px] text-purple-600 font-bold">
              Hedef: {user.targetGpa}
            </span>
          </div>
          <div className="p-3 bg-purple-50 rounded-2xl border border-purple-100 text-purple-600">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Content 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: D3 Chart, Active Courses & Shortcuts */}
        <div className="lg:col-span-2 space-y-6">
          {/* D3-based Course Progress Visualization (Donut & Bar chart) */}
          <CourseProgressChart onCourseClick={(courseId) => navigate(`/courses/${courseId}`)} />

          {/* Active Courses Box */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-base font-bold text-slate-900">Aktif Derslerim</h2>
                <p className="text-xs text-slate-600">
                  Müfredat konuları, deneme sınavları ve çıkmış sorular
                </p>
              </div>
              <button
                onClick={() => navigate('/courses')}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                Tümünü Gör <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                onClick={() => navigate('/courses/mat101')}
                className="cursor-pointer p-4 rounded-2xl border border-slate-200 hover:border-indigo-400 bg-slate-50/60 hover:bg-indigo-50/30 transition group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 rounded-lg bg-blue-100 text-blue-800 font-bold text-xs">
                    MAT 101
                  </span>
                  <span className="text-[11px] text-slate-600 font-medium">%82 Hakimiyet</span>
                </div>
                <h3 className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 transition">
                  Genel Matematik I
                </h3>
                <div className="w-full bg-slate-200 rounded-full h-1.5 mt-3">
                  <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: '82%' }} />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-600 mt-2">
                  <span>4 Konu</span>
                  <span>3 Deneme Sınavı</span>
                </div>
              </div>

              <div
                onClick={() => navigate('/courses/bm102')}
                className="cursor-pointer p-4 rounded-2xl border border-slate-200 hover:border-purple-400 bg-slate-50/60 hover:bg-purple-50/30 transition group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 rounded-lg bg-purple-100 text-purple-800 font-bold text-xs">
                    BM 102
                  </span>
                  <span className="text-[11px] text-slate-600 font-medium">%78 Hakimiyet</span>
                </div>
                <h3 className="font-bold text-slate-900 text-sm group-hover:text-purple-600 transition">
                  Ayrık Matematik
                </h3>
                <div className="w-full bg-slate-200 rounded-full h-1.5 mt-3">
                  <div className="bg-purple-600 h-1.5 rounded-full" style={{ width: '78%' }} />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-600 mt-2">
                  <span>3 Konu</span>
                  <span>1 Deneme Sınavı</span>
                </div>
              </div>

              <div
                onClick={() => navigate('/courses/fiz101')}
                className="cursor-pointer p-4 rounded-2xl border border-slate-200 hover:border-cyan-400 bg-slate-50/60 hover:bg-cyan-50/30 transition group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 rounded-lg bg-cyan-100 text-cyan-800 font-bold text-xs">
                    FIZ 101
                  </span>
                  <span className="text-[11px] text-slate-600 font-medium">%88 Hakimiyet</span>
                </div>
                <h3 className="font-bold text-slate-900 text-sm group-hover:text-cyan-600 transition">
                  Genel Fizik I (Mekanik)
                </h3>
                <div className="w-full bg-slate-200 rounded-full h-1.5 mt-3">
                  <div className="bg-cyan-600 h-1.5 rounded-full" style={{ width: '88%' }} />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-600 mt-2">
                  <span>3 Konu</span>
                  <span>1 Deneme Sınavı</span>
                </div>
              </div>

              <div
                onClick={() => navigate('/courses/yzk101')}
                className="cursor-pointer p-4 rounded-2xl border border-slate-200 hover:border-violet-400 bg-slate-50/60 hover:bg-violet-50/30 transition group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 rounded-lg bg-violet-100 text-violet-800 font-bold text-xs">
                    YZK 101
                  </span>
                  <span className="text-[11px] text-slate-600 font-medium">%86 Hakimiyet</span>
                </div>
                <h3 className="font-bold text-slate-900 text-sm group-hover:text-violet-600 transition">
                  Yapay Zeka Destekli Kodlama
                </h3>
                <div className="w-full bg-slate-200 rounded-full h-1.5 mt-3">
                  <div className="bg-violet-600 h-1.5 rounded-full" style={{ width: '86%' }} />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-600 mt-2">
                  <span>4 Konu</span>
                  <span>3 Çıkmış Sınav (AÖF)</span>
                </div>
              </div>

              <div
                onClick={() => navigate('/courses')}
                className="cursor-pointer p-4 rounded-2xl border border-dashed border-slate-300 hover:border-indigo-400 hover:bg-slate-50 transition flex flex-col items-center justify-center text-center group sm:col-span-2"
              >
                <BookOpen className="w-6 h-6 text-slate-600 group-hover:text-indigo-600 mb-1 transition" />
                <span className="text-xs font-bold text-slate-700 group-hover:text-indigo-600 transition">
                  AÖF ve Tüm Fakülte Müfredatını Gör
                </span>
                <span className="text-[10px] text-slate-600">Açıköğretim ve Mühendislik havuzu</span>
              </div>
            </div>
          </div>

          {/* Recent Solutions Activity */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900">Son Çözülen Sorular & Analizler</h2>
              <button
                onClick={() => navigate('/history')}
                className="text-xs font-bold text-indigo-600 hover:underline"
              >
                Tüm Defteri Aç
              </button>
            </div>

            <div className="space-y-3">
              {history.slice(0, 3).map((sol) => (
                <div
                  key={sol.id}
                  onClick={() => navigate(`/solver/result/${sol.id}`)}
                  className="cursor-pointer p-4 rounded-2xl border border-slate-200 hover:border-indigo-300 hover:bg-slate-50 transition flex items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                        {sol.courseCode}
                      </span>
                      <span className="text-xs text-indigo-600 font-semibold">
                        {sol.topicTitle}
                      </span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          sol.difficulty === 'Kolay'
                            ? 'bg-emerald-100 text-emerald-700'
                            : sol.difficulty === 'Zor'
                            ? 'bg-rose-100 text-rose-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {sol.difficulty}
                      </span>
                    </div>
                    <p className="text-xs font-medium text-slate-800 line-clamp-1">
                      {sol.questionText}
                    </p>
                    <p className="text-[11px] text-slate-600">
                      Sonuç: <strong className="text-slate-700">{sol.finalAnswer}</strong>
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {sol.isBookmarked && (
                      <Bookmark className="w-4 h-4 text-indigo-600 fill-indigo-600" />
                    )}
                    <ChevronRight className="w-5 h-5 text-slate-600" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Column: Daily Goal Module, Spaced Repetition & Badges */}
        <div className="space-y-6">
          {/* Günlük Hedef (Daily Goal) Modülü */}
          <DailyGoalCard
            user={user}
            navigate={navigate}
            onUserUpdated={onUserUpdated}
          />

          {/* Spaced Repetition (Aralıklı Tekrar) Widget */}
          <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-3xl p-6 text-white shadow-lg border border-indigo-950">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Aralıklı Tekrar (Leitner)
              </span>
              <span className="px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 text-[10px] font-bold border border-indigo-400/30">
                Günün Tekrarı
              </span>
            </div>

            <h3 className="text-base font-bold text-white">
              Bugün Tekrar Edilecek: {dueReviews.length} Soru
            </h3>
            <p className="text-xs text-indigo-200 mt-1 leading-relaxed">
              Hafızada kalıcılığı artırmak için 1, 3 ve 7 gün aralıklarla planlanan sorular.
            </p>

            {dueReviews.length > 0 ? (
              <div className="mt-4 p-3 bg-white/10 rounded-2xl border border-white/10 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white line-clamp-1">
                    {dueReviews[0].courseCode} - {dueReviews[0].topicTitle}
                  </span>
                  <span className="text-amber-300 font-bold text-[10px]">
                    Seviye {dueReviews[0].spacedRepetition?.level || 1}
                  </span>
                </div>
                <button
                  onClick={() => navigate(`/solver/result/${dueReviews[0].id}`)}
                  className="w-full py-2 bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-xs rounded-xl shadow transition"
                >
                  Şimdi Tekrar Et
                </button>
              </div>
            ) : (
              <div className="mt-3 text-xs text-emerald-300 flex items-center gap-1.5 font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                Bugün için bekleyen tekrar yok!
              </div>
            )}
          </div>

          {/* Badges Preview */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-indigo-600" />
                Başarı Rozetlerim
              </h3>
              <button
                onClick={() => navigate('/dashboard/profile')}
                className="text-xs font-semibold text-indigo-600 hover:underline"
              >
                Tümü
              </button>
            </div>

            <div className="space-y-3">
              {user.badges.slice(0, 3).map((badge) => (
                <div
                  key={badge.id}
                  className="p-3 rounded-2xl border border-slate-100 bg-slate-50/70 flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">{badge.name}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200">
                        {badge.rarity}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5 line-clamp-1">
                      {badge.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
