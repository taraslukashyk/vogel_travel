import { Mic, MicOff } from 'lucide-react';
import { useCallback } from 'react';
import { useSpeechToText } from '../hooks/useSpeechToText';

interface SpeechButtonProps {
  onResult: (text: string) => void;
  lang?: string;
  className?: string;
}

const SpeechButton = ({ onResult, lang = 'uk-UA', className = '' }: SpeechButtonProps) => {
  const { isListening, isSupported, startListening, stopListening } = useSpeechToText({
    lang,
    onResult,
  });

  const handleClick = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  if (!isSupported) {
    return (
      <button
        type="button"
        disabled
        className={`flex-shrink-0 p-1 opacity-20 cursor-not-allowed ${className}`}
        title="Браузер не підтримує розпізнавання мови"
      >
        <MicOff className="w-[21px] h-[21px] text-white/40" />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`flex-shrink-0 p-1 rounded-sm transition-all duration-300 hover:opacity-100 ${
        isListening
          ? 'opacity-100 text-[#5cc8bd] animate-pulse'
          : 'opacity-30 hover:opacity-60 text-white'
      } ${className}`}
      title={isListening ? 'Зупинити запис' : 'Говорити'}
    >
      <Mic className="w-[21px] h-[21px]" />
    </button>
  );
};

export default SpeechButton;
