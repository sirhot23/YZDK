import React from 'react';
import {
  Sparkles,
  Camera,
  BookOpen,
  Trophy,
  ArrowRight,
  Flame,
  CheckCircle2,
  FileCheck,
  Brain,
  GraduationCap,
  Layers,
  HelpCircle,
} from 'lucide-react';

interface LandingPageProps {
  navigate: (path: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ navigate }) => {
  return (
    <div className="space-y-24 py-6">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-16">
        {/* Ambient background glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center px-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-bold mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Üniversite Düzeyinde Yapay Zekâ Destekli Soru & Sınav Platformu</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
            Çözemediğin Vize & Final Sorusu Kalmasın.{' '}
            <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-800 bg-clip-text text-transparent">
              Fotoğrafını Çek, Yapay Zekâ Adım Adım Çözsün.
            </span>
          </h1>

          <p className="mt-6 text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Üniversite müfredatına tam uyumlu yapay zekâ soru çözüm merkezi. Fotoğraf kırpma, gelişmiş matematik OCR teknolojisi, çıkmış sınav soruları ve kişiselleştirilmiş hatalı sorular tekrar defteri tek ekranda.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => navigate('/solver/upload')}
              className="px-7 py-3.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold rounded-2xl shadow-xl shadow-indigo-600/25 hover:shadow-indigo-600/35 transition flex items-center gap-2.5 text-sm"
            >
              <Camera className="w-4 h-4" />
              Hemen Soru Yükle & Çöz
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-2xl border border-slate-200 shadow-sm hover:border-slate-300 transition text-sm flex items-center gap-2"
            >
              <GraduationCap className="w-4 h-4 text-indigo-600" />
              Öğrenci Paneline Git
            </button>
          </div>

          {/* Social Proof Tags */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              %98 Matematik & Fizik OCR Doğruluğu
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              İTÜ, ODTÜ, Boğaziçi Müfredat Uyumu
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Adım Adım Pedagojik Çözüm & İpuçları
            </span>
          </div>
        </div>
      </section>

      {/* 4 Core Pillars */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-xs font-bold text-indigo-600 uppercase tracking-widest">
            Sistem Nasıl Çalışır?
          </h2>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Soru Yüklemekten Sınav Başarısına 4 Adım
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-lg mb-4">
              1
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-2">Fotoğraf veya Ekran Görüntüsü</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Ders kitabından, vize kağıdından veya ekrandan sorunun fotoğrafını yükle.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg mb-4">
              2
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-2">Hassas Kırpma & Filtre</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              İnteraktif tuvalde soruyu çerçevele, parlaklığı artır ve gereksiz kısımları ayıkla.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-lg mb-4">
              3
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-2">OCR & Yapay Zekâ Analizi</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Gemini modeli matematiksel formülleri LaTeX olarak okur ve kavram haritası çıkarır.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-lg mb-4">
              4
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-2">Adım Adım Çözüm & Defter</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Sınav tuzakları, 15 saniye sağlama hilesi ve hatalı soruları tekrar havuzuna kaydetme.
            </p>
          </div>
        </div>
      </section>

      {/* Featured University Disciplines */}
      <section className="bg-slate-900 text-white py-16 -mx-4 sm:-mx-6 lg:-mx-8 px-6 lg:px-12 rounded-3xl">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">
                Fakülte & Bölüm Müfredatları
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                Desteklenen Popüler Üniversite Dersleri
              </h2>
            </div>
            <button
              onClick={() => navigate('/courses')}
              className="text-xs font-bold text-indigo-300 hover:text-white flex items-center gap-1.5 transition"
            >
              Tüm Müfredat Ağacını Gör
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div
              onClick={() => navigate('/courses/mat101')}
              className="cursor-pointer bg-slate-800/80 hover:bg-slate-800 p-6 rounded-2xl border border-slate-700 transition hover:border-indigo-500/50 group"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  MAT 101
                </span>
                <span className="text-xs text-slate-400">6 AKTS • Mühendislik</span>
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition">
                Genel Matematik I (Calculus I)
              </h3>
              <p className="text-xs text-slate-400 mt-2 line-clamp-2">
                Limit, süreklilik, türev alma kuralları, ekstremum noktaları, Riemann toplamı ve belirli integraller.
              </p>
              <div className="mt-4 pt-4 border-t border-slate-700/80 flex items-center justify-between text-xs text-slate-400">
                <span>4 Konu • 3 Deneme</span>
                <span className="text-indigo-400 font-bold group-hover:translate-x-1 transition flex items-center gap-1">
                  İncele <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>

            <div
              onClick={() => navigate('/courses/bm102')}
              className="cursor-pointer bg-slate-800/80 hover:bg-slate-800 p-6 rounded-2xl border border-slate-700 transition hover:border-purple-500/50 group"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  BM 102
                </span>
                <span className="text-xs text-slate-400">5 AKTS • Bilgisayar</span>
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition">
                Ayrık Matematik (Discrete Math)
              </h3>
              <p className="text-xs text-slate-400 mt-2 line-clamp-2">
                Önermeler mantığı, tümevarım, bağıntı ve fonksiyonlar, çizge (graph) algoritmaları ve kombinatorik.
              </p>
              <div className="mt-4 pt-4 border-t border-slate-700/80 flex items-center justify-between text-xs text-slate-400">
                <span>3 Konu • 2 Deneme</span>
                <span className="text-purple-400 font-bold group-hover:translate-x-1 transition flex items-center gap-1">
                  İncele <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>

            <div
              onClick={() => navigate('/courses/fiz101')}
              className="cursor-pointer bg-slate-800/80 hover:bg-slate-800 p-6 rounded-2xl border border-slate-700 transition hover:border-blue-500/50 group"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  FIZ 101
                </span>
                <span className="text-xs text-slate-400">6 AKTS • Temel Bilim</span>
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-blue-300 transition">
                Genel Fizik I (Mekanik)
              </h3>
              <p className="text-xs text-slate-400 mt-2 line-clamp-2">
                Vektörel kinematik, Newton hareket yasaları, sürtünmeli eğik düzlem, iş-enerji teoremi ve momentum.
              </p>
              <div className="mt-4 pt-4 border-t border-slate-700/80 flex items-center justify-between text-xs text-slate-400">
                <span>3 Konu • 2 Deneme</span>
                <span className="text-blue-400 font-bold group-hover:translate-x-1 transition flex items-center gap-1">
                  İncele <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Box */}
      <section className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-blue-700 rounded-3xl p-8 sm:p-12 text-white text-center shadow-xl">
        <h2 className="text-2xl sm:text-3xl font-extrabold">
          Soru Çözme Disiplinini Kazan, Vize ve Finalleri Garantile.
        </h2>
        <p className="mt-3 text-indigo-100 text-sm max-w-2xl mx-auto leading-relaxed">
          Zorlandığın bir vize sorusunu yükle, saniyeler içinde LaTeX formatında adım adım çözümü ve sınav hilelerini öğren.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => navigate('/solver/upload')}
            className="px-8 py-3.5 bg-white text-indigo-900 font-bold rounded-2xl shadow-lg hover:bg-indigo-50 transition flex items-center gap-2 text-sm"
          >
            <Camera className="w-4 h-4 text-indigo-600" />
            Şimdi Soru Çöz
          </button>
          <button
            onClick={() => navigate('/courses')}
            className="px-6 py-3.5 bg-indigo-500/30 hover:bg-indigo-500/40 text-white font-bold rounded-2xl border border-indigo-400/40 transition text-sm"
          >
            Dersleri İncele
          </button>
        </div>
      </section>
    </div>
  );
};
