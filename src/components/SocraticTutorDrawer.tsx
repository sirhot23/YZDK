import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Send,
  GraduationCap,
  HelpCircle,
  MessageSquare,
  Lightbulb,
  ArrowRight,
  User,
  Loader2,
} from 'lucide-react';
import { QuestionSolution, TutorMessage } from '../types';
import { api } from '../services/api';

interface SocraticTutorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  solution: QuestionSolution;
  onNewMessage?: (conversation: TutorMessage[]) => void;
}

export const SocraticTutorDrawer: React.FC<SocraticTutorDrawerProps> = ({
  isOpen,
  onClose,
  solution,
  onNewMessage,
}) => {
  const [messages, setMessages] = useState<TutorMessage[]>(
    solution.tutorConversation || [
      {
        id: 'init_1',
        role: 'assistant',
        text: `Merhaba! Ben senin üniversite özel ders mentörünüm. "${solution.topicTitle}" konusundaki bu çözümün herhangi bir adımını veya kullanılan formülleri bana sorabilirsin. Hangi adımda takıldın?`,
        timestamp: new Date().toISOString(),
      },
    ]
  );

  const [inputQuery, setInputQuery] = useState('');
  const [selectedStep, setSelectedStep] = useState<number | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const quickPrompts = [
    'Bu adımda kullanılan formülün mantığı nedir?',
    'Sınavda bu soruyu çözerken en çok nerede hata yapılır?',
    'Alternatif ve daha kısa bir çözüm yolu var mı?',
    'Bu konuyu pekiştirmek için hangi teoremi çalışmalıyım?',
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim()) return;

    const userMsg: TutorMessage = {
      id: `usr_${Date.now()}`,
      role: 'user',
      text: query,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const res = await api.askTutor(solution.id, query, selectedStep);
      if (res.success && res.reply) {
        const assistantMsg: TutorMessage = {
          id: `ast_${Date.now()}`,
          role: 'assistant',
          text: res.reply,
          timestamp: new Date().toISOString(),
        };
        const updated = [...messages, userMsg, assistantMsg];
        setMessages(updated);
        if (onNewMessage) onNewMessage(updated);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex justify-end">
      <div className="bg-white w-full max-w-lg h-full shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-sm text-white">Sokratik Ders Mentörü</h3>
                <span className="text-[10px] bg-indigo-500/30 text-indigo-300 px-2 py-0.5 rounded-full font-semibold border border-indigo-400/30">
                  Canlı AI Hoca
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Adım adım soru sorma & kavram pekiştirme
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Selector Ribbon */}
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-slate-500 font-bold whitespace-nowrap text-[11px]">
            Odak Adımı:
          </span>
          <button
            onClick={() => setSelectedStep(undefined)}
            className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition ${
              selectedStep === undefined
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-slate-600 border border-slate-200'
            }`}
          >
            Genel Soru
          </button>
          {solution.steps.map((s) => (
            <button
              key={s.stepNumber}
              onClick={() => setSelectedStep(s.stepNumber)}
              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] whitespace-nowrap transition ${
                selectedStep === s.stepNumber
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {s.stepNumber}. Adım
            </button>
          ))}
        </div>

        {/* Message Thread */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4">
          {messages.map((m) => {
            const isUser = m.role === 'user';
            return (
              <div
                key={m.id}
                className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                    isUser
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gradient-to-tr from-amber-500 to-orange-500 text-white'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <GraduationCap className="w-4 h-4" />}
                </div>

                <div
                  className={`p-3.5 rounded-2xl text-xs leading-relaxed max-w-[82%] shadow-sm ${
                    isUser
                      ? 'bg-indigo-600 text-white rounded-tr-none'
                      : 'bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 p-3 rounded-2xl border border-slate-200 w-fit">
              <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
              <span>Hoca yanıt hazırlıyor...</span>
            </div>
          )}
        </div>

        {/* Quick Question Chips */}
        <div className="px-4 py-2 border-t border-slate-100 bg-slate-50/50">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
            Hızlı Sorular:
          </span>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {quickPrompts.map((qp, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(qp)}
                className="whitespace-nowrap px-2.5 py-1 bg-white hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 text-[11px] font-medium rounded-lg border border-slate-200 transition"
              >
                {qp}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-slate-200 bg-white">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder={
                selectedStep
                  ? `${selectedStep}. adım ile ilgili sorunu yaz...`
                  : 'Çözümle ilgili kafana takılan yeri sor...'
              }
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600 text-slate-900"
            />
            <button
              type="submit"
              disabled={isLoading || !inputQuery.trim()}
              className="p-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl disabled:opacity-40 transition shadow-sm"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
