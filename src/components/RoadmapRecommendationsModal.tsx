import React from 'react';
import { X, Lightbulb, Sparkles, CheckCircle2, ArrowRight, ShieldCheck, Database, Smartphone, Users, FileSpreadsheet } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const RoadmapRecommendationsModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const recommendations = [
    {
      category: 'Yapay Zekâ ve OCR İyileştirmeleri',
      icon: Sparkles,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
      items: [
        {
          title: 'El Yazısı (Handwriting) Matematik OCR İyileştirmesi',
          desc: 'Öğrencinin defterine yazdığı el yazısı matematik notları ve karmaşık integral/türev sembollerini ayrıştırmak için özel el yazısı optimizasyon modu sisteme eklendi.',
          status: 'Uygulandı & Aktif',
        },
        {
          title: 'Sesli Soru Çözüm Anlatımı (Gemini 3.8 Flash TTS)',
          desc: 'Gemini 3.8 Flash TTS modeli ile çözüm adımları Türkçe hoca ses tonuyla ("Sesli Hoca Anlatımı") dinlenebilir hale getirildi.',
          status: 'Uygulandı & Aktif',
        },
        {
          title: 'Sokratik Etkileşimli İpucu & Mentör Modu',
          desc: 'Çözüm ekranında öğrencinin takıldığı adımı seçip hocaya soru sorabileceği "Hocaya Sor" canlı diyalog paneli entegre edildi.',
          status: 'Uygulandı & Aktif',
        },
      ],
    },
    {
      category: 'Çalışma Araçları ve Akıllı Tekrar Algoritması',
      icon: FileSpreadsheet,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
      items: [
        {
          title: 'Aralıklı Tekrar Algoritması (Leitner / Spaced Repetition)',
          desc: 'Yanlış çözülen sorular 1, 3, 7 ve 14 gün aralıklarla seviye atlatmalı olarak öğrencinin "Günün Tekrarı" paneline taşındı.',
          status: 'Uygulandı & Aktif',
        },
        {
          title: 'Kişiselleştirilmiş PDF Vize/Final Çalışma Fasikülü',
          desc: 'Hatalı ve favori sorulardan tek tıkla A4 formatında çözümlü ve sınav taktikli PDF çalışma kitapçığı üretilip yazdırılabilir hale getirildi.',
          status: 'Uygulandı & Aktif',
        },
        {
          title: 'Resmi Üniversite EDU E-posta Doğrulaması',
          desc: '.edu.tr ve .edu uzantılı öğrenci e-postaları için otomatik "Doğrulanmış Öğrenci" rozeti ve üniversite özel arşivi aktif edildi.',
          status: 'Uygulandı & Aktif',
        },
      ],
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-900 to-slate-900 text-white p-6 flex items-center justify-between border-b border-indigo-950">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-500/20 rounded-2xl border border-indigo-400/30 text-indigo-300">
              <Lightbulb className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                Kalan Eksikler & Gelecek Geliştirme Önerileri
              </h2>
              <p className="text-xs text-indigo-200 mt-0.5">
                Proje yönergesine ek olarak sisteme entegre edilebilecek ileri seviye mimari öneriler
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-indigo-200 hover:text-white hover:bg-white/10 rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900 flex items-start gap-3">
            <Sparkles className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-bold">Mimari Durum:</span> Yönergede talep edilen tüm
              çekirdek modüller (Auth, Dashboard, Profile, Courses/Topics/Exams/Past-Papers, Solver/Upload/Crop/Result, History/Bookmarks/Wrong-Answers, Static Pages, Gemini OCR ve LLM Solver API'leri)
              eksiksiz geliştirilmiştir. Aşağıdaki liste projenin bir sonraki aşamaya taşınması için tavsiye niteliğindedir.
            </div>
          </div>

          <div className="space-y-6">
            {recommendations.map((group, gIdx) => {
              const Icon = group.icon;
              return (
                <div key={gIdx} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className={`p-1.5 rounded-lg border text-xs ${group.color}`}>
                      <Icon className="w-4 h-4" />
                    </span>
                    <h3 className="text-sm font-bold text-slate-900">{group.category}</h3>
                  </div>

                  <div className="grid grid-cols-1 gap-2.5">
                    {group.items.map((item, iIdx) => (
                      <div
                        key={iIdx}
                        className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-emerald-50/30 hover:border-emerald-200 transition"
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            {item.title}
                          </h4>
                          {item.status && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                              {item.status}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-600 mt-1 pl-5.5 leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow transition"
          >
            Anladım, Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
