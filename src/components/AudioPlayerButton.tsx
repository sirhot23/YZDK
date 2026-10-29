import React, { useState, useRef } from 'react';
import { Volume2, VolumeX, Play, Pause, Loader2, Sparkles } from 'lucide-react';
import { api } from '../services/api';

interface AudioPlayerButtonProps {
  textToSpeak: string;
  title?: string;
  voiceName?: string;
}

export const AudioPlayerButton: React.FC<AudioPlayerButtonProps> = ({
  textToSpeak,
  title = 'Hocadan Sesli Çözüm Dinle',
  voiceName = 'Kore',
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleTogglePlay = async () => {
    if (isPlaying) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsPlaying(false);
      return;
    }

    // If audio is already loaded
    if (audioUrl && audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
      return;
    }

    setIsLoading(true);

    try {
      const res = await api.textToSpeech(textToSpeak, voiceName);

      if (res.success && res.audioBase64) {
        // Convert base64 WAV to Blob URL for pristine browser playback
        const byteCharacters = atob(res.audioBase64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: res.mimeType || 'audio/wav' });
        const url = URL.createObjectURL(blob);

        setAudioUrl(url);

        const audio = new Audio(url);
        audioRef.current = audio;

        audio.onended = () => {
          setIsPlaying(false);
        };

        audio.onerror = () => {
          fallbackWebSpeech(textToSpeak);
        };

        await audio.play();
        setIsPlaying(true);
      } else {
        // Fallback to browser SpeechSynthesis API
        fallbackWebSpeech(textToSpeak);
      }
    } catch (err) {
      console.warn('Gemini TTS çağrısı hatası, yerel seslendirici devreye giriyor:', err);
      fallbackWebSpeech(textToSpeak);
    } finally {
      setIsLoading(false);
    }
  };

  const fallbackWebSpeech = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'tr-TR';
      utterance.rate = 1.0;
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);
      window.speechSynthesis.speak(utterance);
      setIsPlaying(true);
    }
  };

  return (
    <div className="inline-flex items-center gap-2">
      <button
        type="button"
        onClick={handleTogglePlay}
        disabled={isLoading}
        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-sm ${
          isPlaying
            ? 'bg-rose-50 text-rose-700 border border-rose-200'
            : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200'
        }`}
        title="Gemini 3.8 Flash TTS ile çözümü sesli dinle"
      >
        {isLoading ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : isPlaying ? (
          <>
            <Pause className="w-3.5 h-3.5 fill-rose-600" />
            <span>Durdur</span>
          </>
        ) : (
          <>
            <Volume2 className="w-3.5 h-3.5 text-indigo-600" />
            <span>{title}</span>
          </>
        )}
      </button>

      {/* Visual wave equalizer animation when playing */}
      {isPlaying && (
        <div className="flex items-center gap-0.5 px-2 py-1 rounded-lg bg-indigo-50/80">
          <span className="w-1 h-3 bg-indigo-600 rounded-full animate-bounce" />
          <span className="w-1 h-5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.15s]" />
          <span className="w-1 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.3s]" />
          <span className="w-1 h-4 bg-indigo-600 rounded-full animate-bounce [animation-delay:0.45s]" />
          <span className="text-[10px] text-indigo-700 font-bold ml-1">Sesli Anlatım Aktif</span>
        </div>
      )}
    </div>
  );
};
