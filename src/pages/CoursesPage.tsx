import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  GraduationCap,
  Layers,
  Clock,
  FileCheck,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
  Award,
  Play,
  Download,
  Search,
  Filter,
} from 'lucide-react';
import { Faculty, Course, MockExam, PastPaper, Topic } from '../types';
import { api } from '../services/api';
import { MockExamModal } from '../components/MockExamModal';

interface CoursesPageProps {
  courseIdParam?: string;
  subTabParam?: 'topics' | 'mock-exams' | 'past-papers';
  navigate: (path: string) => void;
}

export const CoursesPage: React.FC<CoursesPageProps> = ({
  courseIdParam,
  subTabParam = 'topics',
  navigate,
}) => {
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedFacultyId, setSelectedFacultyId] = useState<string>('fac_eng');
  const [activeExam, setActiveExam] = useState<MockExam | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    async function fetchFaculties() {
      try {
        const res = await api.getFaculties();
        if (res.success) {
          setFaculties(res.faculties);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchFaculties();
  }, []);

  // Find all courses across all faculties
  const allCourses: Course[] = faculties.flatMap((f) =>
    f.departments.flatMap((d) => d.courses)
  );

  // Selected course or default if param provided
  const currentCourse = courseIdParam
    ? allCourses.find((c) => c.id.toLowerCase() === courseIdParam.toLowerCase())
    : null;

  const currentFaculty = faculties.find((f) => f.id === selectedFacultyId) || faculties[0];

  const handleSelectCourse = (courseId: string) => {
    navigate(`/courses/${courseId}/topics`);
  };

  const handleTabChange = (tab: 'topics' | 'mock-exams' | 'past-papers') => {
    if (currentCourse) {
      navigate(`/courses/${currentCourse.id}/${tab}`);
    }
  };

  // Filtered courses in faculty view
  const currentCourses = currentFaculty?.departments.flatMap((d) => d.courses) || [];
  const filteredCourses = currentCourses.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-16">
      {/* If specific course is chosen: Detail View */}
      {currentCourse ? (
        <div className="space-y-6">
          {/* Breadcrumb & Navigation */}
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <button
              onClick={() => navigate('/courses')}
              className="hover:text-indigo-600 transition font-semibold"
            >
              Fakülteler & Dersler
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="font-bold text-slate-900">{currentCourse.code}</span>
          </div>

          {/* Course Hero Banner */}
          <div
            className={`rounded-3xl p-6 sm:p-8 text-white bg-gradient-to-r ${currentCourse.color} shadow-xl relative overflow-hidden`}
          >
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-bold border border-white/30">
                    {currentCourse.code}
                  </span>
                  <span className="text-xs text-indigo-100 font-medium">
                    {currentCourse.credits} Kredi • {currentCourse.ects} ECTS (AKTS)
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                  {currentCourse.name}
                </h1>
                <p className="text-xs sm:text-sm text-indigo-100 mt-2 max-w-2xl leading-relaxed">
                  {currentCourse.description}
                </p>
                <div className="mt-4 text-xs text-indigo-200">
                  Ders Sorumlusu: <strong className="text-white">{currentCourse.instructor}</strong>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate(`/solver/upload?courseId=${currentCourse.id}`)}
                  className="px-5 py-3 rounded-2xl bg-white text-slate-900 hover:bg-indigo-50 font-bold text-xs shadow-lg transition flex items-center gap-2"
                >
                  <BookOpen className="w-4 h-4 text-indigo-600" />
                  Bu Dersten Soru Çöz
                </button>
              </div>
            </div>
          </div>

          {/* Sub Navigation Tabs */}
          <div className="flex border-b border-slate-200 gap-6 text-sm font-semibold">
            <button
              onClick={() => handleTabChange('topics')}
              className={`pb-3 border-b-2 transition flex items-center gap-2 ${
                subTabParam === 'topics'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-4 h-4" />
              Konu Başlıkları ({currentCourse.topics.length})
            </button>

            <button
              onClick={() => handleTabChange('mock-exams')}
              className={`pb-3 border-b-2 transition flex items-center gap-2 ${
                subTabParam === 'mock-exams'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Clock className="w-4 h-4" />
              Deneme Sınavları ({currentCourse.mockExams.length})
            </button>

            <button
              onClick={() => handleTabChange('past-papers')}
              className={`pb-3 border-b-2 transition flex items-center gap-2 ${
                subTabParam === 'past-papers'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileCheck className="w-4 h-4" />
              Çıkmış Sorular & Arşiv ({currentCourse.pastPapers.length})
            </button>
          </div>

          {/* Tab 1: Topics */}
          {subTabParam === 'topics' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentCourse.topics.map((topic) => (
                <div
                  key={topic.id}
                  className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-indigo-300 transition space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-slate-900 text-sm">{topic.title}</h3>
                    <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                      %{topic.masteryPercentage} Hakimiyet
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">{topic.summary}</p>

                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div
                      className="bg-indigo-600 h-2 rounded-full"
                      style={{ width: `${topic.masteryPercentage}%` }}
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-between text-xs text-slate-600">
                    <span>{topic.questionCount} Havuz Sorusu</span>
                    <button
                      onClick={() =>
                        navigate(`/solver/upload?courseId=${currentCourse.id}&topic=${encodeURIComponent(topic.title)}`)
                      }
                      className="font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition"
                    >
                      Konu Sorusu Çöz <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab 2: Mock Exams */}
          {subTabParam === 'mock-exams' && (
            <div className="space-y-4">
              <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4 text-xs text-indigo-900 flex items-center justify-between">
                <div>
                  <strong className="font-bold">Gerçek Sınav Simülasyonu:</strong> Geri sayımlı süre, otomatik puanlama ve her sorunun adım adım analizi mevcuttur.
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {currentCourse.mockExams.map((exam) => (
                  <div
                    key={exam.id}
                    className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-indigo-400 transition flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            exam.difficulty === 'Kolay'
                              ? 'bg-emerald-100 text-emerald-700'
                              : exam.difficulty === 'Zor'
                              ? 'bg-rose-100 text-rose-700'
                              : 'bg-amber-100 text-amber-700'
                          }`}
                        >
                          {exam.difficulty} Seviye
                        </span>
                        <span className="text-xs text-slate-600 font-medium flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {exam.durationMinutes} Dakika
                        </span>
                      </div>

                      <h3 className="font-bold text-slate-900 text-sm mb-2">{exam.title}</h3>
                      <p className="text-xs text-slate-600">
                        {exam.questionCount} Üniversite Düzeyi Çoktan Seçmeli & Klasik Soru
                      </p>
                    </div>

                    <div className="mt-5 pt-4 border-t border-slate-100">
                      <button
                        onClick={() => setActiveExam(exam)}
                        className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-600/20 transition flex items-center justify-center gap-2"
                      >
                        <Play className="w-3.5 h-3.5 fill-white" />
                        Sınavı Başlat
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: Past Papers */}
          {subTabParam === 'past-papers' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentCourse.pastPapers.map((paper) => (
                  <div
                    key={paper.id}
                    className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-indigo-300 transition space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-lg bg-slate-900 text-white text-xs font-bold">
                          {paper.year}
                        </span>
                        <span className="px-2 py-0.5 rounded-lg bg-indigo-100 text-indigo-800 text-xs font-bold">
                          {paper.term}
                        </span>
                      </div>
                      <span className="text-xs text-slate-600 font-medium">
                        {paper.university}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-600 pt-2 border-t border-slate-100">
                      <span>
                        Çözülen: <strong className="text-indigo-600">{paper.solvedCount}</strong> / {paper.questionCount} Soru
                      </span>
                      <span className="text-emerald-600 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Çözümler Hazır
                      </span>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => navigate(`/solver/result/sol_1001`)}
                        className="flex-1 py-2 px-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-xl transition text-center"
                      >
                        Çözümleri İncele
                      </button>
                      <button
                        onClick={() => alert(`${paper.year} ${paper.term} PDF kitapçığı hazırlanıyor.`)}
                        className="p-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl transition"
                        title="PDF İndir"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Faculty and Courses Catalog View */
        <div className="space-y-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Fakülte ve Ders Müfredatı
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Fakülteni ve bölümünü seçerek ilgili dersin konu başlıklarına, çıkmış sınavlarına ve denemelerine ulaş.
            </p>
          </div>

          {/* Search and Faculty Tabs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            {/* Faculty selector pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {faculties.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setSelectedFacultyId(f.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                    selectedFacultyId === f.id
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {f.name}
                </button>
              ))}
            </div>

            {/* Course search input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-600 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ders adı veya kodu ara..."
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-white text-xs focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600 text-slate-900"
              />
            </div>
          </div>

          {/* Departments and Courses Grid */}
          <div className="space-y-8">
            {currentFaculty?.departments.map((dept) => (
              <div key={dept.id} className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                  <GraduationCap className="w-5 h-5 text-indigo-600" />
                  <h2 className="text-base font-bold text-slate-900">{dept.name}</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {dept.courses.map((course) => (
                    <div
                      key={course.id}
                      onClick={() => handleSelectCourse(course.id)}
                      className="cursor-pointer bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-lg hover:border-indigo-400 transition flex flex-col justify-between group"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-100">
                            {course.code}
                          </span>
                          <span className="text-xs text-slate-600 font-medium">
                            {course.ects} AKTS
                          </span>
                        </div>

                        <h3 className="font-bold text-slate-900 text-base group-hover:text-indigo-600 transition">
                          {course.name}
                        </h3>

                        <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                          {course.description}
                        </p>
                      </div>

                      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                        <span>{course.topics.length} Konu • {course.pastPapers.length} Çıkmış Sınav</span>
                        <span className="font-bold text-indigo-600 group-hover:translate-x-1 transition flex items-center gap-1">
                          İncele <ChevronRight className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active Mock Exam Modal */}
      {activeExam && currentCourse && (
        <MockExamModal
          exam={activeExam}
          courseName={currentCourse.name}
          onClose={() => setActiveExam(null)}
        />
      )}
    </div>
  );
};
