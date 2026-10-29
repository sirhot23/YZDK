import React, { useState, useEffect } from 'react';
import {
  History,
  Bookmark,
  AlertTriangle,
  Search,
  Filter,
  CheckCircle2,
  RotateCcw,
  ChevronRight,
  BookOpen,
  Sparkles,
  FileText,
  Printer,
} from 'lucide-react';
import { QuestionSolution, UserProfile } from '../types';
import { api } from '../services/api';
import { StudyBookletModal } from '../components/StudyBookletModal';

interface HistoryPageProps {
  subTab?: 'all' | 'saved' | 'wrong';
  navigate: (path: string) => void;
  user?: UserProfile | null;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({
  subTab = 'all',
  navigate,
  user,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'saved' | 'wrong'>(subTab);
  const [allSolutions, setAllSolutions] = useState<QuestionSolution[]>([]);
  const [savedSolutions, setSavedSolutions] = useState<QuestionSolution[]>([]);
  const [wrongSolutions, setWrongSolutions] = useState<QuestionSolution[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCourseFilter, setSelectedCourseFilter] = useState<string>('all');
  const [isBookletOpen, setIsBookletOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchHistory = async () => {
    try {
      const res = await api.getHistory();
      if (res.success) {
        setAllSolutions(res.allHistory);
        setSavedSolutions(res.savedQuestions);
        setWrongSolutions(res.wrongAnswers);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  useEffect(() => {
    setActiveTab(subTab);
  }, [subTab]);

  const handleTabClick = (tab: 'all' | 'saved' | 'wrong') => {
    setActiveTab(tab);
    if (tab === 'saved') navigate('/history/saved-questions');
    else if (tab === 'wrong') navigate('/history/wrong-answers');
    else navigate('/history');
  };

  const handleToggleBookmark = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await api.toggleBookmark(id);
      fetchHistory();
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveWrong = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await api.toggleWrongAnswer(id, false);
      fetchHistory();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAdvanceSpacedRepetition = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await api.submitSpacedRepetitionReview(id, true);
      fetchHistory();
    } catch (err) {
      console.error(err);
    }
  };

  // Select list based on active tab
  let targetList = allSolutions;
  if (activeTab === 'saved') targetList = savedSolutions;
  if (activeTab === 'wrong') targetList = wrongSolutions;

  // Filter list
  const filteredList = targetList.filter((sol) => {
    const matchesSearch =
      sol.questionText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sol.topicTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sol.finalAnswer.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCourse =
      selectedCourseFilter === 'all' || sol.courseId === selectedCourseFilter;

    return matchesSearch && matchesCourse;
  });

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Öğrenci Defterim & Çözüm Geçmişi
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Yapay zekâ ile çözdüğün tüm sorular, kaydettiğin favoriler ve sınav öncesi tekrar havuzun.
        </p>
      </div>

      {/* Top 3 KPI counters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          onClick={() => handleTabClick('all')}
          className={`cursor-pointer p-4 rounded-2xl border transition ${
            activeTab === 'all'
              ? 'bg-indigo-50/60 border-indigo-400 shadow-sm'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600">Toplam Çözüm</span>
            <History className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-2xl font-black text-slate-900 mt-1">{allSolutions.length}</p>
        </div>

        <div
          onClick={() => handleTabClick('saved')}
          className={`cursor-pointer p-4 rounded-2xl border transition ${
            activeTab === 'saved'
              ? 'bg-indigo-50/60 border-indigo-400 shadow-sm'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600">Favori / Kayıtlı</span>
            <Bookmark className="w-4 h-4 text-indigo-600 fill-indigo-600" />
          </div>
          <p className="text-2xl font-black text-indigo-600 mt-1">{savedSolutions.length}</p>
        </div>

        <div
          onClick={() => handleTabClick('wrong')}
          className={`cursor-pointer p-4 rounded-2xl border transition ${
            activeTab === 'wrong'
              ? 'bg-rose-50/60 border-rose-400 shadow-sm'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-700">Hatalı Soru Tekrarı</span>
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          </div>
          <p className="text-2xl font-black text-rose-600 mt-1">{wrongSolutions.length}</p>
        </div>
      </div>

      {/* Navigation Tabs and Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        {/* Sub-tabs */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleTabClick('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'all'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Tüm Geçmiş ({allSolutions.length})
          </button>

          <button
            onClick={() => handleTabClick('saved')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'saved'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            Favori Sorularım ({savedSolutions.length})
          </button>

          <button
            onClick={() => handleTabClick('wrong')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'wrong'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-slate-100 text-rose-700 hover:bg-slate-200'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            Hatalı Çözülenler ({wrongSolutions.length})
          </button>
        </div>

        <div className="flex items-center gap-3">
          {/* Generate Study Booklet Button */}
          {filteredList.length > 0 && (
            <button
              onClick={() => setIsBookletOpen(true)}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition flex items-center gap-1.5 shadow-sm whitespace-nowrap"
              title="Bu sorulardan A4 formatında çözümlü PDF çalışma fasikülü üret"
            >
              <FileText className="w-3.5 h-3.5 text-indigo-600" />
              <span>PDF Fasikül Çıkar</span>
            </button>
          )}

          {/* Search */}
          <div className="relative w-full sm:w-60">
            <Search className="w-4 h-4 text-slate-600 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Defterde ara..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-white text-xs focus:ring-1 focus:ring-indigo-600 text-slate-900"
            />
          </div>
        </div>
      </div>

      {/* Questions List */}
      {filteredList.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
          <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900">Bu Havuzda Henüz Soru Yok</h3>
          <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto">
            {activeTab === 'saved'
              ? 'Çözdüğünüz soruların sağ üstündeki favori butonuna tıklayarak buraya kaydedebilirsiniz.'
              : activeTab === 'wrong'
              ? 'Denemelerde yanlış yaptığınız veya tekrar etmek istediğiniz sorular bu havuza toplanır.'
              : 'Henüz soru çözülmedi. Hemen fotoğraf yükleyerek başlayabilirsiniz.'}
          </p>
          <button
            onClick={() => navigate('/solver/upload')}
            className="mt-4 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow transition"
          >
            Soru Çözmeye Başla
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredList.map((sol) => (
            <div
              key={sol.id}
              onClick={() => navigate(`/solver/result/${sol.id}`)}
              className="cursor-pointer bg-white p-5 rounded-2xl border border-slate-200 hover:border-indigo-400 hover:shadow-md transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-lg bg-indigo-50 text-indigo-700 font-bold text-xs">
                    {sol.courseCode}
                  </span>
                  <span className="text-xs font-semibold text-slate-700">
                    {sol.topicTitle}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      sol.difficulty === 'Kolay'
                        ? 'bg-emerald-100 text-emerald-700'
                        : sol.difficulty === 'Zor'
                        ? 'bg-rose-100 text-rose-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {sol.difficulty}
                  </span>

                  {sol.spacedRepetition && (
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-indigo-600" />
                      Leitner Seviye {sol.spacedRepetition.level} ({sol.spacedRepetition.status === 'due' ? 'Bugün Tekrar' : `${sol.spacedRepetition.nextReviewDate}`})
                    </span>
                  )}

                  {sol.isWrongRepeat && !sol.spacedRepetition && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 border border-rose-200">
                      Tekrar Bekliyor
                    </span>
                  )}
                </div>

                <p className="text-xs font-semibold text-slate-900 line-clamp-2 leading-relaxed">
                  {sol.questionText}
                </p>

                <p className="text-[11px] text-slate-600">
                  Doğru Cevap: <strong className="text-slate-800">{sol.finalAnswer}</strong>
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 flex-shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                {sol.spacedRepetition && (
                  <button
                    onClick={(e) => handleAdvanceSpacedRepetition(sol.id, e)}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 transition flex items-center gap-1"
                    title="Bu soruyu doğru çözdüm, bir sonraki aralıklı tekrar seviyesine atlat"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    Seviye Atlat
                  </button>
                )}

                {sol.isWrongRepeat && !sol.spacedRepetition && (
                  <button
                    onClick={(e) => handleRemoveWrong(sol.id, e)}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition flex items-center gap-1"
                    title="Bu soruyu kavradım, tekrar havuzundan çıkar"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Kavrandı
                  </button>
                )}

                <button
                  onClick={(e) => handleToggleBookmark(sol.id, e)}
                  className={`p-2 rounded-xl border transition ${
                    sol.isBookmarked
                      ? 'bg-indigo-50 border-indigo-200 text-indigo-600'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                  title={sol.isBookmarked ? 'Favorilerden Kaldır' : 'Favorilere Ekle'}
                >
                  <Bookmark
                    className={`w-4 h-4 ${sol.isBookmarked ? 'fill-indigo-600' : ''}`}
                  />
                </button>

                <div className="p-2 text-indigo-600 group-hover:translate-x-1 transition">
                  <ChevronRight className="w-5 h-5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Study Booklet Modal Preview & Print */}
      <StudyBookletModal
        isOpen={isBookletOpen}
        onClose={() => setIsBookletOpen(false)}
        questions={filteredList}
        user={user || null}
        bookletTitle={
          activeTab === 'wrong'
            ? 'Hatalı Sorular ve Aralıklı Tekrar Fasikülü'
            : activeTab === 'saved'
            ? 'Favori Sorularım Özel Çalışma Kitapçığı'
            : 'Üniversite Soru & Çözüm Fasikülü'
        }
      />
    </div>
  );
};
