import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Camera,
  Upload,
  Crop as CropIcon,
  CheckCircle2,
  AlertTriangle,
  Bookmark,
  Share2,
  Printer,
  ArrowRight,
  RotateCcw,
  BookOpen,
  HelpCircle,
  Search,
  Sliders,
  Flame,
  Lightbulb,
  MessageSquare,
  PenTool,
} from 'lucide-react';
import { api } from '../services/api';
import { QuestionSolution, OcrResult, TutorMessage } from '../types';
import { CropCanvas } from '../components/CropCanvas';
import { AudioPlayerButton } from '../components/AudioPlayerButton';
import { SocraticTutorDrawer } from '../components/SocraticTutorDrawer';

interface SolverPageProps {
  subRoute?: 'upload' | 'crop' | 'result';
  solutionIdParam?: string;
  navigate: (path: string) => void;
}

// Sample preloaded questions for immediate 1-click test
const sampleQuestions = [
  {
    title: 'Kalkülüs: 0/0 Trigonometrik Limit',
    course: 'MAT 101',
    text: 'lim(x -> 0) [sin(5x) / (3x + tan(2x))] limitinin değerini bulunuz.',
    sampleImg: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=700&q=80',
    subject: 'Genel Matematik I',
  },
  {
    title: 'İntegral: İki Eğri Arasında Kalan Alan',
    course: 'MAT 101',
    text: 'f(x) = x^2 parabolü ile y = 4 doğrusu arasında kalan kapalı bölgenin alanını integral yardımıyla bulunuz.',
    sampleImg: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=700&q=80',
    subject: 'Genel Matematik I',
  },
  {
    title: 'Fizik I: Sürtünmeli Eğik Düzlem İvmesi',
    course: 'FIZ 101',
    text: 'Eğik düzlem açısı 30° ve kütlesi m = 4 kg olan bir cisim sürtünmeli yüzeyde serbest bırakılıyor. Kinetik sürtünme katsayısı μ_k = 0.2 olduğuna göre cismin ivmesini (g = 10 m/s^2) hesaplayınız.',
    sampleImg: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=700&q=80',
    subject: 'Genel Fizik I (Mekanik)',
  },
  {
    title: 'Ayrık Matematik: Mantıksal Denklik İspatı',
    course: 'BM 102',
    text: 'Önermeler mantığında ¬(p ∧ q) ≡ (¬p ∨ ¬q) De Morgan kuralının doğruluk tablosu yardımıyla ispatını gösteriniz.',
    sampleImg: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=700&q=80',
    subject: 'Ayrık Matematik',
  },
  {
    title: 'AÖF YZK: Few-Shot vs Zero-Shot İstemleme',
    course: 'YZK 101',
    text: 'Büyük Dil Modellerinde (LLM) kod üretimi yaptırırken "Few-Shot Prompting" tekniği nedir? "Zero-Shot" yöntemine kıyasla kodun biçimsel ve mantıksal doğruluğunu nasıl artırır? Örnekle açıklayınız.',
    sampleImg: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=700&q=80',
    subject: 'Yapay Zeka Destekli Kodlamaya Giriş',
  },
  {
    title: 'AÖF Python: List Comprehension & Big-O',
    course: 'YZK 103',
    text: 'Python dilinde sayilar = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] listesinden sadece çift sayıların küplerini alan tek satırlık bir "List Comprehension" ifadesini yazınız ve zaman karmaşıklığını belirtiniz.',
    sampleImg: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=700&q=80',
    subject: 'Python ile Programlama ve Algoritma Geliştirme',
  },
];

export const SolverPage: React.FC<SolverPageProps> = ({
  subRoute = 'upload',
  solutionIdParam,
  navigate,
}) => {
  const [activeStep, setActiveStep] = useState<'upload' | 'crop' | 'ocr' | 'result'>(
    subRoute === 'result' ? 'result' : subRoute === 'crop' ? 'crop' : 'upload'
  );

  // Uploaded raw image
  const [uploadedImageSrc, setUploadedImageSrc] = useState<string>('');
  const [croppedImageSrc, setCroppedImageSrc] = useState<string>('');

  // OCR result
  const [ocrResult, setOcrResult] = useState<OcrResult | null>(null);
  const [editableQuestionText, setEditableQuestionText] = useState<string>('');
  const [subjectInput, setSubjectInput] = useState<string>('Genel Matematik I');
  const [handwritingMode, setHandwritingMode] = useState<boolean>(false);

  // Solution and Socratic Tutor
  const [currentSolution, setCurrentSolution] = useState<QuestionSolution | null>(null);
  const [isTutorOpen, setIsTutorOpen] = useState<boolean>(false);

  // Loading states
  const [isOcrLoading, setIsOcrLoading] = useState<boolean>(false);
  const [isSolving, setIsSolving] = useState<boolean>(false);

  // Similar questions search
  const [similarQuestions, setSimilarQuestions] = useState<any[]>([]);

  // Load solution if solutionIdParam is given
  useEffect(() => {
    if (solutionIdParam) {
      api.getSolution(solutionIdParam).then((res) => {
        if (res.success && res.solution) {
          setCurrentSolution(res.solution);
          setActiveStep('result');
        }
      });
    }
  }, [solutionIdParam]);

  // Handle local file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setUploadedImageSrc(base64);
        setActiveStep('crop');
        navigate('/solver/crop');
      };
      reader.readAsDataURL(file);
    }
  };

  // Select preloaded sample question
  const handleSelectSample = (sample: typeof sampleQuestions[0]) => {
    setUploadedImageSrc(sample.sampleImg);
    setEditableQuestionText(sample.text);
    setSubjectInput(sample.subject);
    setActiveStep('crop');
    navigate('/solver/crop');
  };

  // Confirm crop and execute OCR
  const handleConfirmCrop = async (croppedBase64: string) => {
    setCroppedImageSrc(croppedBase64);
    setIsOcrLoading(true);
    setActiveStep('ocr');

    try {
      const res = await api.analyzeOcr(croppedBase64, 'image/jpeg', handwritingMode);
      if (res.success) {
        setOcrResult(res.data);
        setEditableQuestionText(res.data.extractedText);
        if (res.data.estimatedSubject) {
          setSubjectInput(res.data.estimatedSubject);
        }

        // Also search if similar questions exist
        api.findSimilarQuestions(res.data.extractedText).then((simRes) => {
          if (simRes.success) {
            setSimilarQuestions(simRes.questions);
          }
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsOcrLoading(false);
    }
  };

  // Execute AI Solve
  const handleSolveQuestion = async () => {
    if (!editableQuestionText.trim()) return;
    setIsSolving(true);

    try {
      const res = await api.solveQuestion(
        editableQuestionText,
        'mat101',
        subjectInput,
        croppedImageSrc || uploadedImageSrc
      );

      if (res.success && res.solution) {
        setCurrentSolution(res.solution);
        setActiveStep('result');
        navigate(`/solver/result/${res.solution.id}`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSolving(false);
    }
  };

  // Toggle bookmark on current solution
  const handleToggleBookmark = async () => {
    if (!currentSolution) return;
    try {
      const res = await api.toggleBookmark(currentSolution.id);
      if (res.success) {
        setCurrentSolution((prev) => (prev ? { ...prev, isBookmarked: res.isBookmarked } : null));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Toggle wrong answer status
  const handleToggleWrongAnswer = async () => {
    if (!currentSolution) return;
    try {
      const res = await api.toggleWrongAnswer(currentSolution.id, !currentSolution.isWrongRepeat);
      if (res.success) {
        setCurrentSolution((prev) =>
          prev ? { ...prev, isWrongRepeat: res.isWrongRepeat } : null
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Step Progress Tracker */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center justify-between max-w-3xl mx-auto">
        <div
          onClick={() => {
            setActiveStep('upload');
            navigate('/solver/upload');
          }}
          className={`cursor-pointer flex items-center gap-2 text-xs font-bold transition ${
            activeStep === 'upload'
              ? 'text-indigo-600'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span
            className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs ${
              activeStep === 'upload'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            1
          </span>
          <span>Fotoğraf Yükle</span>
        </div>

        <div className="h-px bg-slate-200 flex-1 mx-3" />

        <div
          className={`flex items-center gap-2 text-xs font-bold transition ${
            activeStep === 'crop' ? 'text-indigo-600' : 'text-slate-600'
          }`}
        >
          <span
            className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs ${
              activeStep === 'crop'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            2
          </span>
          <span>Kırp & Odakla</span>
        </div>

        <div className="h-px bg-slate-200 flex-1 mx-3" />

        <div
          className={`flex items-center gap-2 text-xs font-bold transition ${
            activeStep === 'ocr' ? 'text-indigo-600' : 'text-slate-600'
          }`}
        >
          <span
            className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs ${
              activeStep === 'ocr'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            3
          </span>
          <span>OCR & Doğrulama</span>
        </div>

        <div className="h-px bg-slate-200 flex-1 mx-3" />

        <div
          className={`flex items-center gap-2 text-xs font-bold transition ${
            activeStep === 'result' ? 'text-indigo-600' : 'text-slate-600'
          }`}
        >
          <span
            className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs ${
              activeStep === 'result'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            4
          </span>
          <span>Yapay Zekâ Çözümü</span>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* STEP 1: UPLOAD                                       */}
      {/* ---------------------------------------------------- */}
      {activeStep === 'upload' && (
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Yapay Zekâ Soru Çözüm Merkezi
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl mx-auto">
              Soru fotoğrafını yükleyin, kırpma aracıyla soruyu odaklayın. Gemini multimodal vision modeli soruyu okuyup adım adım çözsün.
            </p>
          </div>

          {/* Upload Dropzone */}
          <div className="bg-white rounded-3xl p-8 border-2 border-dashed border-indigo-200 hover:border-indigo-500 transition text-center shadow-sm relative group">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
            <div className="w-16 h-16 rounded-3xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition">
              <Camera className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Soru Görselini Buraya Sürükleyin veya Dosya Seçin
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              PNG, JPG veya WebP formatında sınav kağıdı, ders notu veya ekran görüntüsü
            </p>
            <button
              type="button"
              className="mt-4 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition pointer-events-none"
            >
              Fotoğraf Seç
            </button>
          </div>

          {/* Quick Preloaded Exam Questions */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                Veya Hazır Üniversite Soru Örneklerinden Birini Dene:
              </h2>
              <span className="text-xs text-slate-600">Tek tıkla test et</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {sampleQuestions.map((q, idx) => (
                <div
                  key={idx}
                  onClick={() => handleSelectSample(q)}
                  className="cursor-pointer p-4 bg-white rounded-2xl border border-slate-200 hover:border-indigo-400 hover:shadow-md transition space-y-2 group"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">
                      {q.course}
                    </span>
                    <span className="text-slate-600 font-medium">{q.subject}</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs group-hover:text-indigo-600 transition">
                    {q.title}
                  </h4>
                  <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                    {q.text}
                  </p>
                  <div className="pt-2 text-right">
                    <span className="text-xs font-bold text-indigo-600 flex items-center justify-end gap-1 group-hover:translate-x-1 transition">
                      Bu Soruyu Çöz <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* STEP 2: CROP                                         */}
      {/* ---------------------------------------------------- */}
      {activeStep === 'crop' && uploadedImageSrc && (
        <div className="max-w-4xl mx-auto space-y-4">
          <CropCanvas
            imageSrc={uploadedImageSrc}
            onConfirmCrop={handleConfirmCrop}
            onCancel={() => {
              setActiveStep('upload');
              navigate('/solver/upload');
            }}
          />
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* STEP 3: OCR RESULT & VERIFICATION                   */}
      {/* ---------------------------------------------------- */}
      {activeStep === 'ocr' && (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-lg space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-2xl">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Multimodal OCR & Metin Okuma
                  </h2>
                  <p className="text-xs text-slate-600">
                    Görselden çıkarılan soru metnini ve matematiksel formülleri onaylayın.
                  </p>
                </div>
              </div>

              {ocrResult && (
                <span className="text-xs font-bold px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full">
                  %{ocrResult.confidenceScore} Doğruluk
                </span>
              )}
            </div>

            {isOcrLoading ? (
              <div className="py-16 text-center space-y-3">
                <div className="w-10 h-10 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin mx-auto" />
                <p className="text-xs font-bold text-slate-700">
                  Görseldeki Matematik ve Fizik Formülleri Çözümleniyor...
                </p>
                <p className="text-[11px] text-slate-600">
                  Gemini Vision OCR ile LaTeX ayrıştırması yapılıyor.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Editable Question Text */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Okunan Soru Metni:
                  </label>
                  <textarea
                    rows={4}
                    value={editableQuestionText}
                    onChange={(e) => setEditableQuestionText(e.target.value)}
                    className="w-full p-3.5 rounded-2xl border border-slate-200 text-xs text-slate-900 font-medium focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600"
                  />
                </div>

                {/* Detected formulas pill */}
                {ocrResult?.mathFormulas && ocrResult.mathFormulas.length > 0 && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Algılanan Matematiksel Denklemler (LaTeX):
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {ocrResult.mathFormulas.map((f, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-slate-100 rounded-xl font-mono text-xs text-indigo-800 border border-slate-200"
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Subject / Course Select */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Ders / Konu Kategorisi:
                  </label>
                  <input
                    type="text"
                    value={subjectInput}
                    onChange={(e) => setSubjectInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900"
                  />
                </div>

                {/* Handwriting Mode Switch */}
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-indigo-50/50 border border-indigo-100">
                  <div className="flex items-center gap-2.5">
                    <PenTool className="w-4 h-4 text-indigo-600" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">
                        El Yazısı & Defter Notu İyileştirmesi
                      </h4>
                      <p className="text-[11px] text-slate-600">
                        Deftere kurşun/tükenmez kalemle yazılmış formülleri ve el çizimlerini yüksek doğrulukla ayrıştır.
                      </p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={handwritingMode}
                    onChange={(e) => setHandwritingMode(e.target.checked)}
                    className="w-5 h-5 text-indigo-600 rounded-lg cursor-pointer"
                  />
                </div>

                {/* Similar Questions Found In Bank */}
                {similarQuestions.length > 0 && (
                  <div className="bg-indigo-50/70 p-4 rounded-2xl border border-indigo-100 space-y-2">
                    <span className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
                      <Search className="w-3.5 h-3.5 text-indigo-600" />
                      Arşivde Benzer {similarQuestions.length} Soru Bulundu:
                    </span>
                    <div className="space-y-1.5">
                      {similarQuestions.slice(0, 2).map((sim) => (
                        <div
                          key={sim.id}
                          onClick={() => navigate(`/solver/result/${sim.id}`)}
                          className="cursor-pointer text-xs p-2 bg-white rounded-xl border border-indigo-200 flex items-center justify-between hover:bg-indigo-50 transition"
                        >
                          <span className="truncate max-w-[80%] text-slate-700 font-medium">
                            {sim.questionSnippet}
                          </span>
                          <span className="text-indigo-600 font-bold text-[11px]">
                            Mevcut Çözümü Gör
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Button */}
                <div className="pt-4 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveStep('crop')}
                    className="px-4 py-2.5 text-xs text-slate-600 hover:text-slate-900 transition"
                  >
                    Tekrar Kırp
                  </button>

                  <button
                    type="button"
                    onClick={handleSolveQuestion}
                    disabled={isSolving}
                    className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/25 transition flex items-center gap-2 disabled:opacity-50"
                  >
                    {isSolving ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Yapay Zekâ Adım Adım Çözüyor...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Yapay Zekâ Çözümünü Başlat
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* STEP 4: RESULT SCREEN (/solver/result/{solutionId}) */}
      {/* ---------------------------------------------------- */}
      {activeStep === 'result' && currentSolution && (
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header Controls & Badges */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-xs font-bold">
                  {currentSolution.courseCode}
                </span>
                <span className="text-xs text-slate-600 font-semibold">
                  {currentSolution.topicTitle}
                </span>
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                    currentSolution.difficulty === 'Kolay'
                      ? 'bg-emerald-100 text-emerald-700'
                      : currentSolution.difficulty === 'Zor'
                      ? 'bg-rose-100 text-rose-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  {currentSolution.difficulty} Düzey
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Çözüm Kimliği: <code className="font-mono">{currentSolution.id}</code>
              </p>
            </div>

            {/* Quick Actions & AI Audio & Socratic Mentor */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Gemini TTS Audio Player */}
              <AudioPlayerButton
                textToSpeak={`Soru Çözümü: ${currentSolution.finalAnswer}. Adımlar şöyle: ${currentSolution.steps.map((s) => `${s.stepNumber}. adım: ${s.explanation}`).join(' ')}`}
                title="Sesli Hoca Anlatımı"
              />

              {/* Socratic Tutor Trigger */}
              <button
                onClick={() => setIsTutorOpen(true)}
                className="px-3 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-sm transition flex items-center gap-1.5"
                title="Hocaya Takıldığın Adımı Sor"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Hocaya Sor</span>
              </button>

              <button
                onClick={handleToggleBookmark}
                className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition ${
                  currentSolution.isBookmarked
                    ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
                title="Favorilere / Kayıtlı Sorularıma Ekle"
              >
                <Bookmark
                  className={`w-4 h-4 ${
                    currentSolution.isBookmarked ? 'fill-indigo-600 text-indigo-600' : ''
                  }`}
                />
                <span>{currentSolution.isBookmarked ? 'Kayıtlı' : 'Kaydet'}</span>
              </button>

              <button
                onClick={handleToggleWrongAnswer}
                className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition ${
                  currentSolution.isWrongRepeat
                    ? 'bg-rose-50 border-rose-300 text-rose-700'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
                title="Tekrar Çözülmesi Gereken Hatalı Soru Olarak Deftere Ekle"
              >
                <AlertTriangle className="w-4 h-4 text-rose-500" />
                <span>{currentSolution.isWrongRepeat ? 'Tekrar Havuzunda' : 'Tekrar Defterine Ekle'}</span>
              </button>

              <button
                onClick={() => window.print()}
                className="p-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50"
                title="Yazdır / PDF Kaydet"
              >
                <Printer className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Question Text Box */}
          <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-lg border border-slate-800 space-y-3">
            <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider">
              Çözülen Soru
            </span>
            <p className="text-sm sm:text-base font-semibold leading-relaxed">
              {currentSolution.questionText}
            </p>
          </div>

          {/* Final Answer Banner */}
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-5 rounded-2xl shadow-md flex items-center justify-between">
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-emerald-100">
                Nihai Sonuç / Doğru Cevap
              </span>
              <p className="text-xl font-extrabold mt-0.5">{currentSolution.finalAnswer}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-white" />
            </div>
          </div>

          {/* Step-by-Step Pedagogical Solutions */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              Adım Adım Pedagojik Çözüm:
            </h3>

            {currentSolution.steps.map((step) => (
              <div
                key={step.stepNumber}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3"
              >
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-700 font-black text-xs flex items-center justify-center">
                    {step.stepNumber}
                  </span>
                  <h4 className="font-bold text-slate-900 text-sm">{step.title}</h4>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed pl-9">
                  {step.explanation}
                </p>

                {step.formula && (
                  <div className="ml-9 p-3 bg-slate-50 rounded-xl border border-slate-200 font-mono text-xs text-indigo-900">
                    <span className="text-[10px] uppercase font-bold text-slate-600 block mb-1">
                      Kullanılan Formül:
                    </span>
                    {step.formula}
                  </div>
                )}

                {step.calculation && (
                  <div className="ml-9 p-3 bg-indigo-50/50 rounded-xl border border-indigo-100 font-mono text-xs text-slate-900">
                    <span className="text-[10px] uppercase font-bold text-indigo-600 block mb-1">
                      İşlem Adımı:
                    </span>
                    {step.calculation}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Concepts and Pitfalls Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Key Concepts */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                Kullanılan Temel Kavramlar & Teoremler
              </h4>
              <div className="flex flex-wrap gap-2">
                {currentSolution.keyConcepts.map((c, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-indigo-50 text-indigo-800 text-xs font-semibold rounded-xl border border-indigo-100"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>

            {/* Quick Check Trick */}
            <div className="bg-amber-50/70 p-5 rounded-2xl border border-amber-200 shadow-sm space-y-2">
              <h4 className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-amber-600" />
                15 Saniyelik Sağlama Hilesi (Sınav Taktiği)
              </h4>
              <p className="text-xs text-amber-950 leading-relaxed font-medium">
                {currentSolution.quickCheckTrick}
              </p>
            </div>
          </div>

          {/* Tips and Pitfalls Warning */}
          {currentSolution.tipsAndPitfalls && currentSolution.tipsAndPitfalls.length > 0 && (
            <div className="bg-rose-50/70 p-5 rounded-2xl border border-rose-200 space-y-2">
              <h4 className="text-xs font-bold text-rose-900 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                Sık Yapılan Hatalar & Sınav Tuzakları:
              </h4>
              <ul className="space-y-1.5 pl-5 list-disc text-xs text-rose-950">
                {currentSolution.tipsAndPitfalls.map((tip, idx) => (
                  <li key={idx} className="leading-relaxed">
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Bottom Action Footer */}
          <div className="pt-6 border-t border-slate-200 flex items-center justify-between">
            <button
              onClick={() => {
                setActiveStep('upload');
                navigate('/solver/upload');
              }}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 transition"
            >
              <RotateCcw className="w-4 h-4" />
              Farklı Bir Soru Çöz
            </button>

            <button
              onClick={() => navigate('/history')}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow transition"
            >
              Defterime Git
            </button>
          </div>
        </div>
      )}

      {/* Socratic AI Tutor Drawer */}
      {currentSolution && (
        <SocraticTutorDrawer
          isOpen={isTutorOpen}
          onClose={() => setIsTutorOpen(false)}
          solution={currentSolution}
          onNewMessage={(conv) => {
            setCurrentSolution((prev) => (prev ? { ...prev, tutorConversation: conv } : null));
          }}
        />
      )}
    </div>
  );
};
