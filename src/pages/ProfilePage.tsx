import React, { useState } from 'react';
import {
  User,
  Settings,
  Award,
  GraduationCap,
  Sparkles,
  Flame,
  CheckCircle2,
  TrendingUp,
  Bell,
  Sliders,
  Shield,
  Save,
} from 'lucide-react';
import { UserProfile } from '../types';
import { api } from '../services/api';

interface ProfilePageProps {
  user: UserProfile;
  subTab?: 'overview' | 'settings';
  navigate: (path: string) => void;
  onProfileUpdated: (updated: UserProfile) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  user,
  subTab = 'overview',
  navigate,
  onProfileUpdated,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'settings'>(subTab);

  // Form states for settings
  const [name, setName] = useState(user.name);
  const [university, setUniversity] = useState(user.university);
  const [faculty, setFaculty] = useState(user.faculty);
  const [department, setDepartment] = useState(user.department);
  const [targetGpa, setTargetGpa] = useState(user.targetGpa.toString());

  // Settings switches
  const [emailNotifications, setEmailNotifications] = useState(
    user.settings.emailNotifications
  );
  const [dailyStudyReminder, setDailyStudyReminder] = useState(
    user.settings.dailyStudyReminder
  );
  const [solutionDetailLevel, setSolutionDetailLevel] = useState(
    user.settings.solutionDetailLevel
  );

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);

    try {
      const res = await api.updateProfile({
        name,
        university,
        faculty,
        department,
        targetGpa: parseFloat(targetGpa) || user.targetGpa,
        settings: {
          ...user.settings,
          emailNotifications,
          dailyStudyReminder,
          solutionDetailLevel,
        },
      });

      if (res.success && res.profile) {
        onProfileUpdated(res.profile);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2500);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 pb-16 max-w-4xl mx-auto">
      {/* Header Profile Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-indigo-600 to-blue-600 text-white font-extrabold text-2xl flex items-center justify-center shadow-lg shadow-indigo-600/25">
            {user.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900">{user.name}</h1>
              <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-bold border border-indigo-200">
                {user.studentNumber}
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              {user.university} • {user.faculty}
            </p>
            <p className="text-[11px] text-slate-600">{user.department} • 4. Yarıyıl</p>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl">
          <button
            onClick={() => {
              setActiveTab('overview');
              navigate('/dashboard/profile');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'overview'
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Award className="w-4 h-4" />
            İstatistik & Rozetler
          </button>

          <button
            onClick={() => {
              setActiveTab('settings');
              navigate('/dashboard/profile/settings');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'settings'
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Settings className="w-4 h-4" />
            Ayarlar
          </button>
        </div>
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200">
              <span className="text-xs text-slate-600 font-medium">Günlük Seri</span>
              <p className="text-2xl font-black text-orange-600 mt-1 flex items-center gap-1.5">
                <Flame className="w-5 h-5 fill-orange-500" />
                {user.streakDays} Gün
              </p>
              <span className="text-[10px] text-slate-600">Aralıksız devam</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200">
              <span className="text-xs text-slate-600 font-medium">Çözülen Soru</span>
              <p className="text-2xl font-black text-slate-900 mt-1">
                {user.totalQuestionsSolved}
              </p>
              <span className="text-[10px] text-emerald-600 font-semibold">Tüm dönem</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200">
              <span className="text-xs text-slate-600 font-medium">Doğruluk Oranı</span>
              <p className="text-2xl font-black text-indigo-600 mt-1">%{user.accuracyRate}</p>
              <span className="text-[10px] text-indigo-600 font-semibold">Deneme ortalaması</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200">
              <span className="text-xs text-slate-600 font-medium">GPA Durumu</span>
              <p className="text-2xl font-black text-purple-600 mt-1">{user.gpa}</p>
              <span className="text-[10px] text-slate-600">Hedef: {user.targetGpa}</span>
            </div>
          </div>

          {/* Achievement Badges Section */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Award className="w-5 h-5 text-indigo-600" />
                Kazanılan Başarı Rozetleri
              </h2>
              <p className="text-xs text-slate-600 mt-0.5">
                Soru çözme disiplini, deneme sınavı skorları ve düzenli çalışmayla açılan rozetler.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {user.badges.map((badge) => (
                <div
                  key={badge.id}
                  className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 flex items-start gap-3.5 hover:border-indigo-300 transition"
                >
                  <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center flex-shrink-0 shadow-sm">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-slate-900">{badge.name}</h4>
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200">
                        {badge.rarity}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {badge.description}
                    </p>
                    <span className="text-[10px] text-slate-600 block mt-2">
                      Kazanılma Tarihi: {badge.earnedDate}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Settings */}
      {activeTab === 'settings' && (
        <form onSubmit={handleSaveSettings} className="space-y-6">
          {saveSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Ayarlarınız başarıyla kaydedildi ve senkronize edildi.</span>
            </div>
          )}

          {/* Academic Info */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-indigo-600" />
              Akademik Bilgiler
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Ad Soyad</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Üniversite</label>
                <input
                  type="text"
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Fakülte</label>
                <input
                  type="text"
                  value={faculty}
                  onChange={(e) => setFaculty(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Bölüm</label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Hedef Not Ortalaması (Target GPA)
                </label>
                <input
                  type="number"
                  step="0.05"
                  min="2.00"
                  max="4.00"
                  value={targetGpa}
                  onChange={(e) => setTargetGpa(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900"
                />
              </div>
            </div>
          </div>

          {/* AI and Solution Preferences */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sliders className="w-5 h-5 text-indigo-600" />
              Yapay Zekâ Çözüm ve Bildirim Tercihleri
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Günlük Çalışma Hatırlatıcısı</h4>
                  <p className="text-[11px] text-slate-600">
                    Çözüm serinizi kaybetmemeniz için her gün çalışma bildirimi gönder.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={dailyStudyReminder}
                  onChange={(e) => setDailyStudyReminder(e.target.checked)}
                  className="w-5 h-5 text-indigo-600 rounded-lg"
                />
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">E-posta Bildirimleri</h4>
                  <p className="text-[11px] text-slate-600">
                    Haftalık ilerleme karnesi ve çözülmemiş hatalı soru hatırlatmaları.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={emailNotifications}
                  onChange={(e) => setEmailNotifications(e.target.checked)}
                  className="w-5 h-5 text-indigo-600 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Yapay Zekâ Çözüm Detay Seviyesi
                </label>
                <select
                  value={solutionDetailLevel}
                  onChange={(e) =>
                    setSolutionDetailLevel(e.target.value as 'standard' | 'detailed' | 'quick')
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900"
                >
                  <option value="detailed">
                    Derinlemesine & Pedagojik (Tüm Teoremler, Tuzaklar, İpuçları)
                  </option>
                  <option value="standard">Standart Adım Adım Çözüm</option>
                  <option value="quick">Yalnızca Hızlı Sonuç ve Kritik Formül</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
