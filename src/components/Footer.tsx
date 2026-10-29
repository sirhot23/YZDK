import React from 'react';
import { Sparkles, Shield, HelpCircle, FileText, GraduationCap, Heart } from 'lucide-react';

interface FooterProps {
  navigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ navigate }) => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-base font-bold text-white">UniÇözüm</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Üniversite öğrencileri için yapay zekâ ve multimodal OCR destekli soru çözüm merkezi, çıkmış soru arşivi ve akıllı sınav simülasyon platformu.
            </p>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
              <GraduationCap className="w-4 h-4 text-indigo-400" />
              <span>İTÜ, ODTÜ, Boğaziçi ve tüm üniversite müfredatlarıyla uyumlu.</span>
            </div>
          </div>

          {/* Soru Çözüm & Dersler */}
          <div>
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider mb-3">
              Merkez Üs & Çözücü
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => navigate('/solver/upload')}
                  className="hover:text-white transition flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  Fotoğraftan Soru Çöz
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/courses')}
                  className="hover:text-white transition"
                >
                  Fakülte & Ders Müfredatı
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/history/saved-questions')}
                  className="hover:text-white transition"
                >
                  Kayıtlı Favori Sorularım
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/history/wrong-answers')}
                  className="hover:text-white transition text-rose-400 hover:text-rose-300"
                >
                  Hatalı Çözülenler / Tekrar Defteri
                </button>
              </li>
            </ul>
          </div>

          {/* Kurumsal ve Bilgilendirme (Static Pages) */}
          <div>
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider mb-3">
              Kurumsal Bilgilendirme
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => navigate('/static-pages/about')}
                  className="hover:text-white transition flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5 text-slate-500" />
                  Hakkımızda & Sistem Nasıl Çalışır?
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/static-pages/faq')}
                  className="hover:text-white transition flex items-center gap-1.5"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
                  Sıkça Sorulan Sorular (SSS)
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/static-pages/legal')}
                  className="hover:text-white transition flex items-center gap-1.5"
                >
                  <Shield className="w-3.5 h-3.5 text-slate-500" />
                  KVKK, Kullanım Şartları & Gizlilik
                </button>
              </li>
            </ul>
          </div>

          {/* Quick Stats / Trust */}
          <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/60 space-y-2">
            <span className="text-[10px] font-bold tracking-wider uppercase text-indigo-400">
              Yapay Zekâ Altyapısı
            </span>
            <p className="text-white text-xs font-semibold">
              Gemini 3.8 Multimodal Vision & Reasoning
            </p>
            <p className="text-[11px] text-slate-400 leading-snug">
              Matematik, fizik ve mühendislik formüllerini LaTeX kalitesinde çözümler, adım adım pedagojik analiz sunar.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© 2026 UniÇözüm. Tüm hakları saklıdır.</p>
          <div className="flex items-center gap-1">
            <span>Üniversite öğrencileri için titizlikle geliştirildi</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
          </div>
        </div>
      </div>
    </footer>
  );
};
