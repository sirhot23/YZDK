import React, { useState, useEffect } from 'react';
import { X, Clock, CheckCircle2, AlertCircle, ArrowRight, ArrowLeft, Trophy, RotateCcw, BookOpen } from 'lucide-react';
import { MockExam } from '../types';

interface MockExamModalProps {
  exam: MockExam;
  courseName: string;
  onClose: () => void;
  onSaveToHistory?: (results: any) => void;
}

interface ExamQuestion {
  id: string;
  questionText: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  formula?: string;
}

const sampleExamQuestions: ExamQuestion[] = [
  {
    id: 'eq_1',
    questionText: 'lim(x -> 0) [sin(5x) / (3x + tan(2x))] limitinin değeri kaçtır?',
    options: ['5/3', '1', '5/5 (yani 1)', '5/4', '0'],
    correctIndex: 1,
    explanation: 'x -> 0 iken sin(5x)/x -> 5, 3x/x -> 3 ve tan(2x)/x -> 2 olduğundan pay 5, payda 3+2=5 olur. 5/5 = 1.',
    formula: '\\lim_{x \\to 0} \\frac{5}{3 + 2} = 1',
  },
  {
    id: 'eq_2',
    questionText: 'f(x) = x^3 - 3x + 2 fonksiyonunun yerel minimum değeri kaçtır?',
    options: ['-1', '0', '2', '4', '-2'],
    correctIndex: 1,
    explanation: "f'(x) = 3x^2 - 3 = 0 => x = ±1. f''(x) = 6x. f''(1) = 6 > 0 (minimum). x = 1 için f(1) = 1 - 3 + 2 = 0.",
    formula: 'f(1) = 1^3 - 3(1) + 2 = 0',
  },
  {
    id: 'eq_3',
    questionText: '∫_0^2 (3x^2 - 2x + 1) dx integralinin sonucu kaçtır?',
    options: ['5', '6', '7', '8', '9'],
    correctIndex: 1,
    explanation: 'İlkel fonksiyon: [x^3 - x^2 + x]. 0\'dan 2\'ye: (2^3 - 2^2 + 2) - 0 = (8 - 4 + 2) = 6.',
    formula: '[x^3 - x^2 + x]_0^2 = 8 - 4 + 2 = 6',
  },
  {
    id: 'eq_4',
    questionText: 'y = e^(2x) fonksiyonunun teğetinin x = 0 noktasındaki eğimi kaçtır?',
    options: ['1', '2', 'e', '2e', '0'],
    correctIndex: 1,
    explanation: "y' = 2 e^(2x). x = 0 için y'(0) = 2 * e^0 = 2 * 1 = 2.",
    formula: "y'(0) = 2",
  },
  {
    id: 'eq_5',
    questionText: 'Aşağıdakilerden hangisi f(x) = 1/x fonksiyonunun x = 0 noktasında sürekli olmamasının nedenidir?',
    options: [
      'f(0) tanımlı değildir ve limit sonsuza gider',
      'Türevi sıfırdır',
      'Fonksiyon çift fonksiyondur',
      'Sadece negatif sayılarda süreklidir',
      'Kökü yoktur',
    ],
    correctIndex: 0,
    explanation: 'Süreklilik için lim_{x->a} f(x) = f(a) şartı aranır. x=0\'da fonksiyon tanımsızdır ve sağdan +∞, soldan -∞ limitine sahiptir.',
  },
];

export const MockExamModal: React.FC<MockExamModalProps> = ({
  exam,
  courseName,
  onClose,
  onSaveToHistory,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(exam.durationMinutes * 60);

  // Timer
  useEffect(() => {
    if (isSubmitted) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsSubmitted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isSubmitted]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (optIdx: number) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentIndex]: optIdx,
    }));
  };

  const handleFinishExam = () => {
    setIsSubmitted(true);
  };

  // Score calculations
  const totalQuestions = sampleExamQuestions.length;
  let correctCount = 0;
  let wrongCount = 0;
  let emptyCount = 0;

  sampleExamQuestions.forEach((q, idx) => {
    const ans = selectedAnswers[idx];
    if (ans === undefined) {
      emptyCount++;
    } else if (ans === q.correctIndex) {
      correctCount++;
    } else {
      wrongCount++;
    }
  });

  const scorePercentage = Math.round((correctCount / totalQuestions) * 100);
  const currentQ = sampleExamQuestions[currentIndex];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Top Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/30 text-indigo-300 border border-indigo-400/30">
                {courseName}
              </span>
              <span className="text-xs text-slate-400">Deneme Simülasyonu</span>
            </div>
            <h2 className="text-lg font-bold text-white mt-1">{exam.title}</h2>
          </div>

          <div className="flex items-center gap-4">
            {!isSubmitted ? (
              <div
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl font-mono text-sm font-semibold ${
                  timeLeft < 300 ? 'bg-rose-500/20 text-rose-300 animate-pulse' : 'bg-slate-800 text-slate-200'
                }`}
              >
                <Clock className="w-4 h-4 text-indigo-400" />
                <span>{formatTime(timeLeft)}</span>
              </div>
            ) : (
              <span className="text-xs bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-xl font-semibold">
                Sınav Tamamlandı
              </span>
            )}

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto flex-1">
          {!isSubmitted ? (
            <div>
              {/* Question Navigation Bar */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                  Soru {currentIndex + 1} / {totalQuestions}
                </span>

                <div className="flex items-center gap-1.5">
                  {sampleExamQuestions.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentIndex(idx)}
                      className={`w-7 h-7 rounded-lg text-xs font-semibold transition ${
                        currentIndex === idx
                          ? 'bg-indigo-600 text-white'
                          : selectedAnswers[idx] !== undefined
                          ? 'bg-indigo-100 text-indigo-700 font-bold'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question Text */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 mb-6">
                <p className="text-base font-semibold text-slate-900 leading-relaxed">
                  {currentQ.questionText}
                </p>
                {currentQ.formula && (
                  <div className="mt-3 p-2.5 bg-white rounded-xl border border-slate-200 font-mono text-sm text-indigo-700">
                    {currentQ.formula}
                  </div>
                )}
              </div>

              {/* Options */}
              <div className="space-y-3">
                {currentQ.options.map((opt, optIdx) => {
                  const isSelected = selectedAnswers[currentIndex] === optIdx;
                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectOption(optIdx)}
                      className={`w-full p-4 rounded-2xl border text-left font-medium text-sm transition flex items-center justify-between ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-950 shadow-sm'
                          : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold ${
                            isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span>{opt}</span>
                      </div>
                      {isSelected && <CheckCircle2 className="w-5 h-5 text-indigo-600" />}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Results Screen */
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-6 rounded-3xl border border-indigo-100 text-center">
                <div className="inline-flex p-3 rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 mb-3">
                  <Trophy className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black text-slate-900">
                  Tebrikler, Deneme Tamamlandı!
                </h3>
                <p className="text-sm text-slate-600 mt-1">
                  Sonuçların ve başarı yüzdesi yapay zekâ başarı karnene eklendi.
                </p>

                <div className="grid grid-cols-4 gap-3 mt-6">
                  <div className="bg-white p-3 rounded-2xl border border-slate-200">
                    <span className="text-xs text-slate-500 font-medium">Başarı</span>
                    <p className="text-2xl font-black text-indigo-600">%{scorePercentage}</p>
                  </div>
                  <div className="bg-white p-3 rounded-2xl border border-slate-200">
                    <span className="text-xs text-slate-500 font-medium">Doğru</span>
                    <p className="text-2xl font-black text-emerald-600">{correctCount}</p>
                  </div>
                  <div className="bg-white p-3 rounded-2xl border border-slate-200">
                    <span className="text-xs text-slate-500 font-medium">Yanlış</span>
                    <p className="text-2xl font-black text-rose-600">{wrongCount}</p>
                  </div>
                  <div className="bg-white p-3 rounded-2xl border border-slate-200">
                    <span className="text-xs text-slate-500 font-medium">Boş</span>
                    <p className="text-2xl font-black text-slate-600">{emptyCount}</p>
                  </div>
                </div>
              </div>

              {/* Question-by-Question Solution Breakdown */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-indigo-600" />
                  Soru ve Çözüm Analizi:
                </h4>

                {sampleExamQuestions.map((q, idx) => {
                  const userAns = selectedAnswers[idx];
                  const isCorrect = userAns === q.correctIndex;
                  return (
                    <div
                      key={q.id}
                      className={`p-4 rounded-2xl border ${
                        isCorrect
                          ? 'border-emerald-200 bg-emerald-50/40'
                          : 'border-rose-200 bg-rose-50/40'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="font-bold text-slate-900">Soru {idx + 1}</span>
                        <span
                          className={`px-2 py-0.5 rounded-full font-bold ${
                            isCorrect ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                          }`}
                        >
                          {isCorrect ? '✓ Doğru' : '✗ Yanlış'}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-slate-800 mb-2">{q.questionText}</p>
                      <div className="text-xs text-slate-600 bg-white p-2.5 rounded-xl border border-slate-200">
                        <span className="font-semibold text-indigo-900">Açıklamalı Çözüm: </span>
                        {q.explanation}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          {!isSubmitted ? (
            <>
              <button
                type="button"
                onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentIndex === 0}
                className="px-4 py-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-200 font-medium text-xs flex items-center gap-1.5 disabled:opacity-40 transition"
              >
                <ArrowLeft className="w-4 h-4" />
                Önceki Soru
              </button>

              <div className="flex items-center gap-3">
                {currentIndex < totalQuestions - 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentIndex((prev) => Math.min(totalQuestions - 1, prev + 1))}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-indigo-600/20 transition"
                  >
                    Sonraki Soru
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleFinishExam}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Sınavı Bitir ve Notlandır
                  </button>
                )}
              </div>
            </>
          ) : (
            <div className="w-full flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setSelectedAnswers({});
                  setIsSubmitted(false);
                  setCurrentIndex(0);
                  setTimeLeft(exam.durationMinutes * 60);
                }}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-xl transition flex items-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4" />
                Tekrar Dene
              </button>

              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow transition"
              >
                Kapat ve Ders Sayfasına Dön
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
