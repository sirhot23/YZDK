import { UserProfile, Faculty, QuestionSolution, OcrResult, SpacedRepetitionInfo, TutorMessage } from '../types';

const API_BASE = '/api';

export const api = {
  // Auth
  async login(email: string, password: string): Promise<{ success: boolean; token?: string; user?: any; message?: string }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return res.json();
  },

  async register(data: any): Promise<{ success: boolean; token?: string; user?: any; message?: string }> {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${API_BASE}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    return res.json();
  },

  // Student Profile
  async getProfile(): Promise<{ success: boolean; profile: UserProfile }> {
    const res = await fetch(`${API_BASE}/student/profile`);
    return res.json();
  },

  async updateProfile(updates: Partial<UserProfile>): Promise<{ success: boolean; profile: UserProfile; message: string }> {
    const res = await fetch(`${API_BASE}/student/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    return res.json();
  },

  // Daily Goal (Günlük Hedef)
  async updateDailyGoal(params: { target?: number; increment?: number; current?: number }): Promise<{
    success: boolean;
    dailyGoal: { target: number; current: number; todayDate?: string };
    profile: UserProfile;
    message?: string;
  }> {
    const res = await fetch(`${API_BASE}/student/daily-goal`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    return res.json();
  },

  // Education Faculties
  async getFaculties(): Promise<{ success: boolean; faculties: Faculty[] }> {
    const res = await fetch(`${API_BASE}/education/faculties`);
    return res.json();
  },

  // AI & OCR (with Handwriting mode)
  async analyzeOcr(
    imageBase64: string,
    mimeType: string = 'image/png',
    handwritingMode: boolean = false
  ): Promise<{ success: boolean; data: OcrResult }> {
    const res = await fetch(`${API_BASE}/ai/ocr/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageBase64, mimeType, handwritingMode }),
    });
    return res.json();
  },

  async solveQuestion(
    questionText: string,
    courseId?: string,
    subject?: string,
    imageUrl?: string
  ): Promise<{ success: boolean; solution: QuestionSolution }> {
    const res = await fetch(`${API_BASE}/ai/solve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ questionText, courseId, subject, imageUrl }),
    });
    return res.json();
  },

  // Gemini TTS Audio Narration
  async textToSpeech(text: string, voiceName?: string): Promise<{
    success: boolean;
    audioBase64?: string;
    mimeType?: string;
    useWebSpeechFallback?: boolean;
    spokenText?: string;
  }> {
    const res = await fetch(`${API_BASE}/ai/tts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, voiceName }),
    });
    return res.json();
  },

  // Socratic Ask-Tutor Mentorship
  async askTutor(
    solutionId: string,
    userQuery: string,
    currentStepNumber?: number
  ): Promise<{
    success: boolean;
    reply: string;
    conversation: TutorMessage[];
  }> {
    const res = await fetch(`${API_BASE}/ai/ask-tutor`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ solutionId, userQuery, currentStepNumber }),
    });
    return res.json();
  },

  // Spaced Repetition (Leitner)
  async submitSpacedRepetitionReview(
    questionId: string,
    mastered: boolean
  ): Promise<{ success: boolean; spacedRepetition: SpacedRepetitionInfo; message: string }> {
    const res = await fetch(`${API_BASE}/student/spaced-repetition/review`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ questionId, mastered }),
    });
    return res.json();
  },

  async getDueReviews(): Promise<{ success: boolean; totalDue: number; dueQuestions: QuestionSolution[] }> {
    const res = await fetch(`${API_BASE}/student/due-reviews`);
    return res.json();
  },

  async findSimilarQuestions(
    queryText: string,
    courseId?: string
  ): Promise<{ success: boolean; totalFound: number; questions: any[] }> {
    const res = await fetch(`${API_BASE}/questions/find`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ queryText, courseId }),
    });
    return res.json();
  },

  // Bookmark & Mistakes
  async toggleBookmark(questionId: string, bookmarked?: boolean): Promise<{ success: boolean; isBookmarked: boolean; message: string }> {
    const res = await fetch(`${API_BASE}/student/bookmark`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ questionId, bookmarked }),
    });
    return res.json();
  },

  async toggleWrongAnswer(questionId: string, isWrong?: boolean): Promise<{ success: boolean; isWrongRepeat: boolean; message: string }> {
    const res = await fetch(`${API_BASE}/student/wrong-answers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ questionId, isWrong }),
    });
    return res.json();
  },

  async getHistory(): Promise<{
    success: boolean;
    allHistory: QuestionSolution[];
    savedQuestions: QuestionSolution[];
    wrongAnswers: QuestionSolution[];
    stats: { totalSolved: number; savedCount: number; wrongCount: number };
  }> {
    const res = await fetch(`${API_BASE}/student/history`);
    return res.json();
  },

  async getSolution(id: string): Promise<{ success: boolean; solution: QuestionSolution }> {
    const res = await fetch(`${API_BASE}/ai/solution/${id}`);
    return res.json();
  },
};
