import { useState, useEffect, useRef } from 'react';
import { Send, CheckCircle2, X } from 'lucide-react';
import VoiceRecorder from './VoiceRecorder';
import { sendTelegramNotification, sendTelegramVoice } from '../lib/notifications';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../hooks/useLanguage';
import { escapeHTML } from '../lib/utils/html';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMessage?: string;
}

const ContactModal = ({ isOpen, onClose, initialMessage = '' }: ContactModalProps) => {
  const { t } = useTranslation();
  const { currentLang } = useLanguage();
  const isUA = currentLang === 'ua';
  const [contact, setContact] = useState('');
  const [message, setMessage] = useState(initialMessage);
  const voiceBlobRef = useRef<Blob | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Update message when initialMessage changes (e.g. when opening from different offer)
  useEffect(() => {
    if (isOpen) {
      setMessage(initialMessage);
      voiceBlobRef.current = null;
      setIsSuccess(false);
    }
  }, [isOpen, initialMessage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contact) return;
    console.log('ContactModal submit, voiceRef:', voiceBlobRef.current);
    setIsSubmitting(true);
    
    const telegramMessage = `
<b>📩 ${isUA ? "Новий запит на зворотній зв'язок" : "New Feedback Request"} (Modal)</b>

<b>👤 ${isUA ? 'Контакт' : 'Contact'}:</b> ${escapeHTML(contact)}
<b>💬 ${isUA ? 'Повідомлення' : 'Message'}:</b> ${message ? escapeHTML(message) : (isUA ? 'Без повідомлення' : 'No message')}
    `.trim();

    const result = await sendTelegramNotification(telegramMessage);
    
    if (result.success) {
      // Send voice if exists
      if (voiceBlobRef.current) {
        const blob = voiceBlobRef.current;
        try {
          const base64 = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
              const r = reader.result as string;
              resolve(r.split(',')[1]);
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          });

          console.log('Sending modal voice, base64 length:', base64?.length);
          const voiceRes = await sendTelegramVoice(`${isUA ? 'Запит (аудіо)' : 'Feedback (audio)'}`, base64, 'voice.ogg');
          if (!voiceRes.success) {
            console.error('Telegram voice error:', voiceRes.error);
          }
        } catch (err) {
          console.error('Error preparing voice message:', err);
        }
      }

      setIsSuccess(true);
      setContact('');
      setMessage('');
      voiceBlobRef.current = null;
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 3000);
    }
    
    setIsSubmitting(false);
  };

  return (
    <div className={`fixed inset-0 z-[100] flex items-start justify-center pt-[88px] pointer-events-none transition-all duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 delay-100'}`}>
      <div
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      <div className={`relative w-full transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] origin-top ${isOpen ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto' : 'opacity-0 scale-y-0 scale-x-[0.9] -translate-y-4 pointer-events-none'}`}>
        <div className="bg-black/90 backdrop-blur-3xl border-y border-white/10 py-12 shadow-2xl relative w-full">
          <div className="max-w-[1440px] mx-auto px-6 md:px-12 relative z-10">
            
            {isSuccess ? (
              <div className="flex flex-col items-center justify-center py-4 animate-in fade-in zoom-in duration-500">
                <CheckCircle2 className="text-[#5cc8bd] w-16 h-16 mb-4" />
                <h2 className="text-2xl md:text-3xl font-montserrat font-bold text-white mb-2 uppercase tracking-widest text-center">{t('modals.contact.success_title')}</h2>
                <p className="text-white/60 text-center">{t('modals.contact.success_desc')}</p>
              </div>
            ) : (
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex-shrink-0 text-center md:text-left">
                  <h2 className="text-xl md:text-3xl font-montserrat font-bold text-white mb-2 tracking-[0.05em] uppercase">
                    {t('modals.contact.title')}
                  </h2>
                  <p className="text-white/40 text-[11px] uppercase tracking-widest font-bold">
                    {t('modals.contact.subtitle')}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="flex-grow flex flex-col lg:flex-row gap-4 w-full">
                  <div className="flex-[1.5] bg-white/5 border border-white/10 rounded-[2px] p-3 px-5 relative flex flex-col justify-center focus-within:border-white/30 transition-colors h-[64px]">
                    <label className="text-[10px] uppercase text-white/40 font-montserrat font-bold tracking-[0.1em] mb-1">
                      {t('modals.contact.contact_label')}
                    </label>
                    <input
                      type="text"
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                      placeholder={t('modals.contact.contact_placeholder')}
                      className="w-full outline-none text-white font-inter font-semibold text-sm md:text-base border-none p-0 bg-transparent placeholder-white/20"
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="flex-[2] bg-white/5 border border-white/10 rounded-[2px] p-3 px-5 relative flex flex-col justify-center focus-within:border-white/30 transition-colors h-[64px]">
                    <label className="text-[10px] uppercase text-white/40 font-montserrat font-bold tracking-[0.1em] mb-1">
                      {t('modals.contact.comment_label')}
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder={t('modals.contact.comment_placeholder')}
                        className="w-full outline-none text-white font-inter font-semibold text-sm border-none p-0 bg-transparent placeholder-white/20"
                        disabled={isSubmitting}
                      />
                      <div className="flex items-center border-l border-white/10 pl-2">
                        <VoiceRecorder onRecordingComplete={(blob) => { voiceBlobRef.current = blob; console.log('Modal voice recorded, size:', blob.size); }} />
                      </div>
                    </div>
                  </div>

                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-white border border-white text-black font-montserrat uppercase tracking-[0.2em] font-bold text-sm md:text-[13px] hover:bg-transparent hover:text-white transition-all duration-500 rounded-[2px] px-10 py-5 lg:py-0 shadow-lg shrink-0 w-full lg:w-auto h-[64px] disabled:opacity-50"
                  >
                    <div className="flex items-center justify-center gap-3">
                      <span>{isSubmitting ? t('modals.contact.submitting') : t('modals.contact.submit')}</span>
                      <Send className="w-4 h-4" />
                    </div>
                  </button>
                </form>
              </div>
            )}
            
            <button 
              onClick={onClose}
              className="absolute top-0 right-0 p-2 text-white/20 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactModal;
