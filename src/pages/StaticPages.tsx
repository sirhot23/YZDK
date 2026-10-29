import React from 'react';
import {
  FileText,
  HelpCircle,
  Shield,
  Sparkles,
  CheckCircle2,
  ChevronDown,
  Layers,
  GraduationCap,
  Lock,
} from 'lucide-react';

interface StaticPagesProps {
  page: 'about' | 'faq' | 'legal';
  navigate: (path: string) => void;
}

export const StaticPages: React.FC<StaticPagesProps> = ({ page, navigate }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-20">
      {/* Top Page Selector Tabs */}
      <div className="flex border-b border-slate-200 gap-4 text-xs font-bold">
        <button
          onClick={() => navigate('/static-pages/about')}
          className={`pb-3 border-b-2 transition flex items-center gap-1.5 ${
            page === 'about'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          Hakkımızda & Sistem Nasıl Çalışır?
        </button>

        <button
          onClick={() => navigate('/static-pages/faq')}
          className={`pb-3 border-b-2 transition flex items-center gap-1.5 ${
            page === 'faq'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          Sıkça Sorulan Sorular (SSS)
        </button>

        <button
          onClick={() => navigate('/static-pages/legal')}
          className={`pb-3 border-b-2 transition flex items-center gap-1.5 ${
            page === 'legal'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Shield className="w-4 h-4" />
          KVKK, Kullanım Şartları & Gizlilik
        </button>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 1. ABOUT PAGE                                        */}
      {/* ---------------------------------------------------- */}
      {page === 'about' && (
        <div className="space-y-8">
          <div>
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">
              Kurumsal & Vizyon
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              Hakkımızda: Üniversite Eğitimi İçin Yeni Nesil Yapay Zekâ
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
              UniÇözüm; Türkiye'deki üniversite öğrencilerinin vize, final ve laboratuvar derslerinde karşılaştıkları karmaşık matematik, fizik ve mühendislik problemlerini adım adım pedagojik yöntemlerle kavrayabilmesi için geliştirilmiş yapay zekâ asistanıdır.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Multimodal Vision OCR</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Yalnızca düz metinleri değil; integral, limit, matris ve devre şemalarını LaTeX formatında yüksek doğrulukla okur.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Akademik Müfredat Ağacı</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                İTÜ, ODTÜ ve Boğaziçi gibi lider kurumların ders izlenceleri ile uyumlu konu ve çıkmış soru tasnifi sunar.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Akıllı Tekrar Defteri</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Hatalı çözülen veya takılınan sorular otomatik olarak tekrar havuzuna alınır ve sınav öncesi pekiştirilir.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 2. FAQ PAGE                                          */}
      {/* ---------------------------------------------------- */}
      {page === 'faq' && (
        <div className="space-y-6">
          <div>
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">
              Merak Edilenler
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              Sıkça Sorulan Sorular
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Sistem işleyişi, OCR teknolojisi ve sınav simülasyonları hakkında en sık sorulan sorular.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: 'Yüklediğim soru fotoğrafındaki el yazısı formüller okunabiliyor mu?',
                a: 'Evet. UniÇözüm, Gemini multimodal vision mimarisini kullanır. El yazısı matematiksel denklemler, türev/integral sembolleri ve grafikler yüksek hassasiyetle LaTeX notation formatında dijitalleştirilir.',
              },
              {
                q: 'Deneme sınavı süreleri gerçek sınav formatında mı?',
                a: 'Evet. Vize provası (50 dk), hızlı tarama (25 dk) veya kapsamlı final denemeleri (90 dk) olarak gerçek akademik süreler ve puanlama baremleri uygulanmaktadır.',
              },
              {
                q: 'Hatalı çözülen sorular tekrar havuzundan nasıl çıkar?',
                a: 'Soruyu "Hatalı Çözülenler" defterinde tekrar çözüp "Kavrandı" butonuna bastığınızda veya denemede doğru işaretlediğinizde soru başarıyla arşive taşınır.',
              },
              {
                q: 'Üniversite çıkmış sorularının çözümleri güvenilir mi?',
                a: 'Platformdaki çözümler akademik pedagojik standartlara göre adım adım formüller, dikkat edilmesi gereken sınav tuzakları ve 15 saniyelik pratik sağlama hileleriyle birlikte sunulur.',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2"
              >
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                  {item.q}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed pl-6">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 3. LEGAL / KVKK / PRIVACY                           */}
      {/* ---------------------------------------------------- */}
      {page === 'legal' && (
        <div className="space-y-6">
          <div>
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">
              Yasal & Güvenlik
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              KVKK, Kullanım Şartları ve Gizlilik Sözleşmesi
            </h1>
            <p className="text-xs text-slate-600 mt-1">
              6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) ve etik yapay zekâ ilkeleri uyum metnidir.
            </p>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6 text-xs text-slate-700 leading-relaxed">
            <div>
              <h3 className="font-bold text-slate-900 text-sm mb-2 flex items-center gap-2">
                <Lock className="w-4 h-4 text-indigo-600" />
                1. Kişisel Verilerin İşlenmesi ve KVKK Aydınlatma Metni
              </h3>
              <p>
                UniÇözüm olarak öğrenci kullanıcılarımızın e-posta adresi, ad-soyad, üniversite ve bölüm bilgileri yalnızca akademik gelişim takibi, deneme sınavı karnesi oluşturma ve oturum doğrulama amaçlarıyla işlenmektedir. Verileriniz hiçbir üçüncü taraf pazarlama kuruluşuyla paylaşılmaz.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-slate-900 text-sm mb-2 flex items-center gap-2">
                <Shield className="w-4 h-4 text-indigo-600" />
                2. Yapay Zekâ ve Görsel Güvenliği
              </h3>
              <p>
                Soru çözümü amacıyla sisteme yüklenen soru fotoğrafları ve ekran görüntüleri yalnızca OCR ve çözümleme motoru tarafından işlenir. Kullanıcının kimliğini açığa çıkaracak özel görüntüler (vesikalık, kimlik vb.) sisteme yüklenmemelidir; tespit edildiğinde otomatik olarak silinir.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-slate-900 text-sm mb-2">
                3. Akademik Dürüstlük ve Kullanım Şartları
              </h3>
              <p>
                UniÇözüm, öğrencilerin konuları pekiştirmesi ve çalışma verimini artırması amacıyla tasarlanmış bir çalışma aracıdır. Devam eden resmi bir canlı sınav sırasında hile amacıyla kullanılması akademik dürüstlük ilkelerine ve kullanıcı sözleşmesine aykırıdır.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
