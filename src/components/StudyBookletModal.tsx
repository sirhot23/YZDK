import React from 'react';
import { X, Printer, Download, BookOpen, CheckCircle2, GraduationCap, FileText } from 'lucide-react';
import { QuestionSolution, UserProfile } from '../types';

interface StudyBookletModalProps {
  isOpen: boolean;
  onClose: () => void;
  questions: QuestionSolution[];
  user: UserProfile | null;
  bookletTitle?: string;
}

export const StudyBookletModal: React.FC<StudyBookletModalProps> = ({
  isOpen,
  onClose,
  questions,
  user,
  bookletTitle = 'Vize & Final Öncesi Özel Çalışma Fasikülü',
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Header - Not printed */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800 print:hidden">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-500/20 text-indigo-300 rounded-2xl border border-indigo-400/30">
              <FileText className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Kişiselleştirilmiş Çalışma Fasikülü & Sınav Kitapçığı
              </h2>
              <p className="text-xs text-slate-400">
                A4 standartlarında çözümlü çalışma fasikülü önizlemesi ve PDF çıktısı
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              PDF Olarak Kaydet / Yazdır
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Booklet Preview Document */}
        <div className="p-8 sm:p-12 overflow-y-auto flex-1 bg-slate-50 print:bg-white print:p-0">
          <div className="max-w-3xl mx-auto bg-white p-8 sm:p-12 rounded-2xl shadow-sm border border-slate-200 print:border-none print:shadow-none print:p-0">
            {/* Booklet University Header */}
            <div className="border-b-2 border-slate-900 pb-6 mb-8 flex items-start justify-between">
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-indigo-700">
                  {user?.university || 'Üniversite Akademik Havuzu'}
                </span>
                <h1 className="text-2xl font-black text-slate-900 mt-1">{bookletTitle}</h1>
                <p className="text-xs text-slate-600 mt-1">
                  {user?.faculty || 'Mühendislik Fakültesi'} • {user?.department || 'Bilgisayar Mühendisliği'}
                </p>
              </div>

              <div className="text-right text-xs text-slate-600">
                <p className="font-bold text-slate-900">{user?.name || 'Öğrenci'}</p>
                <p>Öğrenci No: {user?.studentNumber || '2026'}</p>
                <p className="text-[10px] text-slate-400 mt-1">
                  Düzenlenme Tarihi: {new Date().toLocaleDateString('tr-TR')}
                </p>
              </div>
            </div>

            {/* Questions Collection */}
            <div className="space-y-10">
              {questions.map((sol, qIdx) => (
                <div
                  key={sol.id}
                  className="space-y-4 pb-8 border-b border-slate-200 last:border-b-0 break-inside-avoid"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-extrabold text-sm text-indigo-900 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-md bg-slate-900 text-white flex items-center justify-center text-xs">
                        {qIdx + 1}
                      </span>
                      {sol.courseCode} — {sol.topicTitle}
                    </span>
                    <span className="text-slate-500 font-semibold">
                      Zorluk: {sol.difficulty}
                    </span>
                  </div>

                  {/* Question Prompt */}
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 font-medium text-xs text-slate-900 leading-relaxed">
                    {sol.questionText}
                  </div>

                  {/* Answer Key & Final Answer */}
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs">
                    <span className="font-bold text-emerald-900 block mb-0.5">
                      ✓ Doğru Yanıt / Nihai Sonuç:
                    </span>
                    <span className="font-bold text-emerald-700">{sol.finalAnswer}</span>
                  </div>

                  {/* Step by Step Breakdown */}
                  <div className="space-y-2 pt-2">
                    <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                      Açıklamalı Çözüm Adımları:
                    </span>
                    {sol.steps.map((st) => (
                      <div
                        key={st.stepNumber}
                        className="text-xs p-3 rounded-lg border border-slate-100 bg-white"
                      >
                        <span className="font-bold text-slate-900">
                          {st.stepNumber}. {st.title}:
                        </span>
                        <p className="text-slate-600 mt-1">{st.explanation}</p>
                        {st.formula && (
                          <div className="mt-1.5 p-1.5 bg-slate-50 rounded font-mono text-[11px] text-indigo-800">
                            {st.formula}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Quick Tip / Trap */}
                  {sol.tipsAndPitfalls && sol.tipsAndPitfalls.length > 0 && (
                    <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-950">
                      <strong className="text-amber-900">Sınav Püf Noktası: </strong>
                      {sol.tipsAndPitfalls[0]}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Formula Cheat Sheet Footer */}
            <div className="mt-12 pt-6 border-t-2 border-slate-900 text-center text-xs text-slate-500">
              <p className="font-bold text-slate-900">
                UniÇözüm Yapay Zekâ Akademik Destek Platformu
              </p>
              <p className="text-[10px] mt-0.5">
                Bu fasikül öğrencinin hatalı ve eksik kaldığı konulardaki sorular taranarak kişiye özel üretilmiştir.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
