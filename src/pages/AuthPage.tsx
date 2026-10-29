import React, { useState } from 'react';
import { Sparkles, Mail, Lock, User, GraduationCap, Building2, BookOpen, ArrowRight, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';

interface AuthPageProps {
  mode: 'login' | 'register' | 'forgot-password';
  navigate: (path: string) => void;
  onAuthSuccess: (token: string, user: any) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ mode, navigate, onAuthSuccess }) => {
  const [email, setEmail] = useState('sgorunmez@gmail.com');
  const [password, setPassword] = useState('universite2026!');
  const [name, setName] = useState('Sarp Görünmez');
  const [studentNumber, setStudentNumber] = useState('20220801045');
  const [university, setUniversity] = useState('İstanbul Teknik Üniversitesi (İTÜ)');
  const [faculty, setFaculty] = useState('Mühendislik Fakültesi');
  const [department, setDepartment] = useState('Bilgisayar Mühendisliği');

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (mode === 'login') {
        const res = await api.login(email, password);
        if (res.success && res.token) {
          setMessage({ text: 'Giriş başarılı! Yönlendiriliyorsunuz...', type: 'success' });
          setTimeout(() => {
            onAuthSuccess(res.token!, res.user);
            navigate('/dashboard');
          }, 600);
        } else {
          setMessage({ text: res.message || 'Giriş yapılamadı.', type: 'error' });
        }
      } else if (mode === 'register') {
        const res = await api.register({
          name,
          email,
          studentNumber,
          university,
          faculty,
          department,
          password,
        });
        if (res.success && res.token) {
          setMessage({ text: 'Kayıt başarılı! Hesabınız oluşturuldu.', type: 'success' });
          setTimeout(() => {
            onAuthSuccess(res.token!, res.user);
            navigate('/dashboard');
          }, 600);
        } else {
          setMessage({ text: res.message || 'Kayıt yapılamadı.', type: 'error' });
        }
      } else if (mode === 'forgot-password') {
        const res = await api.forgotPassword(email);
        setMessage({ text: res.message || 'Şifre sıfırlama bağlantısı gönderildi.', type: 'success' });
      }
    } catch (err: any) {
      setMessage({ text: err.message || 'Bir bağlantı hatası oluştu.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl border border-slate-200">
        {/* Header Icon */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-600 flex items-center justify-center text-white mx-auto shadow-md shadow-indigo-600/30 mb-3">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            {mode === 'login' && 'Öğrenci Girişi'}
            {mode === 'register' && 'Üniversite Hesabı Oluştur'}
            {mode === 'forgot-password' && 'Şifremi Unuttum'}
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            {mode === 'login' && 'UniÇözüm yapay zekâ asistanına erişmek için giriş yapın.'}
            {mode === 'register' && 'Fakültenize ve derslerinize özel müfredat ağacı oluşturun.'}
            {mode === 'forgot-password' && 'Kayıtlı e-posta adresinizi girerek şifrenizi sıfırlayın.'}
          </p>
        </div>

        {/* Feedback Message */}
        {message && (
          <div
            className={`p-3.5 rounded-2xl text-xs font-semibold mb-6 flex items-center gap-2 ${
              message.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}
          >
            {message.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
            <span>{message.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Ad Soyad</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Örn: Sarp Görünmez"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 text-xs text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Üniversite</label>
                <div className="relative">
                  <GraduationCap className="w-4 h-4 text-slate-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={university}
                    onChange={(e) => setUniversity(e.target.value)}
                    placeholder="Örn: İTÜ, ODTÜ, Boğaziçi..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 text-xs text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Fakülte</label>
                  <select
                    value={faculty}
                    onChange={(e) => setFaculty(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900"
                  >
                    <option value="Mühendislik Fakültesi">Mühendislik</option>
                    <option value="İktisadi ve İdari Bilimler">İİBF / İktisat</option>
                    <option value="Fen Fakültesi">Fen Fakültesi</option>
                    <option value="Tıp Fakültesi">Tıp Fakültesi</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Öğrenci No</label>
                  <input
                    type="text"
                    value={studentNumber}
                    onChange={(e) => setStudentNumber(e.target.value)}
                    placeholder="20220801..."
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">E-posta Adresi</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ogrenci@universite.edu.tr"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 text-xs text-slate-900"
              />
            </div>
          </div>

          {mode !== 'forgot-password' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700">Şifre</label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => navigate('/auth/forgot-password')}
                    className="text-[11px] font-semibold text-indigo-600 hover:underline"
                  >
                    Şifremi Unuttum
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 text-xs text-slate-900"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold text-xs shadow-lg shadow-indigo-600/25 transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                {mode === 'login' && 'Giriş Yap ve Devam Et'}
                {mode === 'register' && 'Hesabımı Oluştur'}
                {mode === 'forgot-password' && 'Sıfırlama Bağlantısı Gönder'}
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Switch Mode Links */}
        <div className="mt-6 pt-6 border-t border-slate-100 text-center text-xs text-slate-600">
          {mode === 'login' ? (
            <p>
              Hesabın yok mu?{' '}
              <button
                onClick={() => navigate('/auth/register')}
                className="font-bold text-indigo-600 hover:underline"
              >
                Hemen Kayıt Ol
              </button>
            </p>
          ) : (
            <p>
              Zaten hesabın var mı?{' '}
              <button
                onClick={() => navigate('/auth/login')}
                className="font-bold text-indigo-600 hover:underline"
              >
                Giriş Yap
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
