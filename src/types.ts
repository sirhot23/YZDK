export interface UserProfile {
  id: string;
  name: string;
  email: string;
  studentNumber: string;
  university: string;
  faculty: string;
  department: string;
  semester: number;
  gpa: number;
  targetGpa: number;
  streakDays: number;
  totalQuestionsSolved: number;
  accuracyRate: number;
  isEduVerified?: boolean;
  universityHub?: string;
  weeklyGoal: { target: number; current: number };
  dailyGoal: { target: number; current: number; todayDate?: string };
  badges: Array<{
    id: string;
    name: string;
    description: string;
    icon: string;
    earnedDate: string;
    rarity: string;
  }>;
  settings: {
    emailNotifications: boolean;
    dailyStudyReminder: boolean;
    solutionDetailLevel: 'standard' | 'detailed' | 'quick';
    theme: 'light' | 'dark' | 'system';
    ocrAutoEnhance: boolean;
    voiceName?: string;
  };
}

export interface Topic {
  id: string;
  title: string;
  summary: string;
  questionCount: number;
  masteryPercentage: number;
}

export interface MockExam {
  id: string;
  title: string;
  durationMinutes: number;
  questionCount: number;
  difficulty: 'Kolay' | 'Orta' | 'Zor';
  averageScore?: number;
  completed?: boolean;
}

export interface PastPaper {
  id: string;
  year: number;
  term: 'Vize' | 'Final' | 'Bütünleme';
  university: string;
  questionCount: number;
  solvedCount: number;
  hasDetailedSolutions: boolean;
  fileDownloadAvailable: boolean;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  credits: number;
  ects: number;
  color: string;
  description: string;
  instructor: string;
  topics: Topic[];
  mockExams: MockExam[];
  pastPapers: PastPaper[];
}

export interface Department {
  id: string;
  name: string;
  courses: Course[];
}

export interface Faculty {
  id: string;
  name: string;
  code: string;
  icon: string;
  departments: Department[];
}

export interface SolutionStep {
  stepNumber: number;
  title: string;
  explanation: string;
  formula?: string;
  calculation?: string;
}

export interface TutorMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export interface SpacedRepetitionInfo {
  level: number; // 1 (1 gün), 2 (3 gün), 3 (7 gün), 4 (14 gün / usta)
  nextReviewDate: string;
  lastReviewedDate?: string;
  reviewCount: number;
  status: 'due' | 'scheduled' | 'mastered';
}

export interface QuestionSolution {
  id: string;
  courseId: string;
  courseCode: string;
  topicTitle: string;
  questionText: string;
  imageUrl?: string;
  extractedFormulas?: string[];
  options?: string[];
  finalAnswer: string;
  steps: SolutionStep[];
  keyConcepts: string[];
  tipsAndPitfalls: string[];
  difficulty: 'Kolay' | 'Orta' | 'Zor' | 'İleri Düzey';
  similarTopics: string[];
  quickCheckTrick: string;
  createdAt: string;
  isBookmarked: boolean;
  isWrongRepeat: boolean;
  userSolvedCorrectly?: boolean;
  spacedRepetition?: SpacedRepetitionInfo;
  tutorConversation?: TutorMessage[];
}

export interface OcrResult {
  extractedText: string;
  mathFormulas: string[];
  detectedOptions: string[];
  diagramDescription: string;
  estimatedSubject: string;
  confidenceScore: number;
  handwritingDetected?: boolean;
}
