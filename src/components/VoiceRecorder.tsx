import { useState, useRef, useCallback } from 'react';
import { Mic, Square, Trash2, Play, Pause } from 'lucide-react';

interface VoiceRecorderProps {
  onRecordingComplete: (blob: Blob) => void;
  lang?: string;
  className?: string;
}

const VoiceRecorder = ({ onRecordingComplete, className = '' }: VoiceRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = MediaRecorder.isTypeSupported('audio/ogg; codecs=opus') 
        ? 'audio/ogg; codecs=opus' 
        : 'audio/webm; codecs=opus';
      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: mediaRecorder.mimeType });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        onRecordingComplete(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setAudioUrl(null);
      
      setRecordingTime(0);
      timerRef.current = window.setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (err) {
      console.error('Error accessing microphone:', err);
      alert('Не вдалося отримати доступ до мікрофона');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleTogglePlay = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(audioUrl!);
      audioRef.current.onended = () => setIsPlaying(false);
    }
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const clearRecording = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setAudioUrl(null);
    setIsPlaying(false);
    setRecordingTime(0);
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {!audioUrl && !isRecording && (
        <button
          type="button"
          onClick={startRecording}
          className="flex-shrink-0 p-2 rounded-full bg-white/5 hover:bg-[#5cc8bd]/20 text-white/40 hover:text-[#5cc8bd] transition-all border border-white/10"
          title="Записати голосове повідомлення"
        >
          <Mic className="w-5 h-5" />
        </button>
      )}

      {isRecording && (
        <div className="flex items-center gap-3 bg-[#5cc8bd]/10 border border-[#5cc8bd]/30 px-3 py-1.5 rounded-full animate-pulse">
          <div className="w-2 h-2 rounded-full bg-red-500" />
          <span className="text-[12px] font-mono font-bold text-[#5cc8bd]">{formatTime(recordingTime)}</span>
          <button
            type="button"
            onClick={stopRecording}
            className="p-1 hover:text-white text-[#5cc8bd]/70"
          >
            <Square className="w-4 h-4 fill-current" />
          </button>
        </div>
      )}

      {audioUrl && !isRecording && (
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
          <button type="button" onClick={handleTogglePlay} className="text-[#5cc8bd]">
            {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
          </button>
          <span className="text-[12px] font-mono text-white/60">Voice</span>
          <button type="button" onClick={clearRecording} className="text-red-400 hover:text-red-500 ml-1">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default VoiceRecorder;
