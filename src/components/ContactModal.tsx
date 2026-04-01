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
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
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
    if (!name && !phone && !email) return;
    console.log('ContactModal submit, voiceRef:', voiceBlobRef.current);
    setIsSubmitting(true);
    
    // Build contact info string
    const contactParts = [];
    if (name) contactParts.push(`${isUA ? "Ім'я" : "Name"}: ${name}`);
    if (phone) contactParts.push(`${isUA ? "Телефон" : "Phone"}: ${phone}`);
    if (email) contactParts.push(`Email: ${email}`);
    const contactInfo = contactParts.join('\n');

    const telegramMessage = `
<b>📩 ${isUA ? "Новий запит на зворотній зв'язок" : "New Feedback Request"} (Modal)</b>

<b>👤 ${isUA ? 'Контактні дані' : 'Contact Data'}:</b>
${escapeHTML(contactInfo)}

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
          const voiceCaption = `${isUA ? 'Голосове повідомлення від' : 'Voice message from'}: ${name || phone || email}`;
          const voiceRes = await sendTelegramVoice(voiceCaption, base64, 'voice.ogg', result.messageId);
          if (!voiceRes.success) {
            console.error('Telegram voice error:', voiceRes.error);
          }
        } catch (err) {
          console.error('Error preparing voice message:', err);
        }
      }

      setIsSuccess(true);
      setName('');
      setPhone('');
      setEmail('');
      setMessage('');
      voiceBlobRef.current = null;
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 3000);
    } else {
      console.error('Telegram notification failed:', result.error);
      alert(isUA ? 'Помилка відправки повідомлення: ' + result.error : 'Error sending message: ' + result.error);
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
          <div className="max-w-[1440px] mx-auto px-6 md:px-12 relative z-10 w-full">
            
            {isSuccess ? (
              <div className="flex flex-col items-center justify-center py-4 animate-in fade-in zoom-in duration-500">
                <CheckCircle2 className="text-[#5cc8bd] w-16 h-16 mb-4" />
                <h2 className="text-2xl md:text-3xl font-montserrat font-bold text-white mb-2 uppercase tracking-widest text-center">{t('modals.contact.success_title')}</h2>
                <p className="text-white/60 text-center">{t('modals.contact.success_desc')}</p>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                <div className="flex-shrink-0 text-center md:text-left">
                  <h2 className="text-xl md:text-3xl font-montserrat font-bold text-white mb-2 tracking-[0.05em] uppercase leading-none">
                    {t('modals.contact.title')}
                  </h2>
                  <p className="text-white/40 text-[11px] uppercase tracking-widest font-bold">
                    {t('modals.contact.subtitle')}
                  </p>
                </div>

                <p className="text-[10px] uppercase tracking-widest text-[#5cc8bd] font-black -mb-2 border-l-2 border-[#5cc8bd] pl-3">
                  {isUA ? "Заповніть хоча б одне поле для зв'язку" : "Fill in at least one contact field"}
                </p>

                <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-4 w-full items-start">
                  <div className="flex-[3] grid grid-cols-1 md:grid-cols-3 gap-3 w-full">
                    <div className="bg-white/5 border border-white/10 rounded-[2px] p-3 px-5 relative flex flex-col justify-center focus-within:border-white/40 transition-colors h-[64px]">
                      <label className="text-[10px] uppercase text-white/60 font-montserrat font-black tracking-[0.1em] mb-1">
                        {isUA ? "Ім'я" : "Name"}
                      </label>
                      <input
                        type="text"
                        name="name"
                        autoComplete="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full outline-none text-white font-inter font-semibold text-sm md:text-base border-none p-0 bg-transparent placeholder-white/30"
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-[2px] p-3 px-5 relative flex flex-col justify-center focus-within:border-white/40 transition-colors h-[64px]">
                      <label className="text-[10px] uppercase text-white/60 font-montserrat font-black tracking-[0.1em] mb-1">
                        {isUA ? "Телефон" : "Phone"}
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        autoComplete="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+380..."
                        className="w-full outline-none text-white font-inter font-semibold text-sm md:text-base border-none p-0 bg-transparent placeholder-white/30"
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-[2px] p-3 px-5 relative flex flex-col justify-center focus-within:border-white/40 transition-colors h-[64px]">
                      <label className="text-[10px] uppercase text-white/60 font-montserrat font-black tracking-[0.1em] mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="mail@example.com"
                        className="w-full outline-none text-white font-inter font-semibold text-sm md:text-base border-none p-0 bg-transparent placeholder-white/30"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  {/* Comment Field and Voice Recorder Beside it */}
                  <div className="flex-[2] w-full flex gap-3">
                    <div className="flex-1 bg-white/5 border border-white/10 rounded-[2px] p-3 px-5 relative flex flex-col justify-center focus-within:border-white/40 transition-colors h-[64px]">
                      <label className="text-[10px] uppercase text-white/60 font-montserrat font-black tracking-[0.1em] mb-1">
                        {t('modals.contact.comment_label')}
                      </label>
                      <input
                        type="text"
                        name="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder={t('modals.contact.comment_placeholder')}
                        className="w-full outline-none text-white font-inter font-semibold text-sm border-none p-0 bg-transparent placeholder-white/30"
                        disabled={isSubmitting}
                      />
                    </div>
                    {/* Flexible Voice Recorder Block */}
                    <div className="bg-white/5 border border-white/10 rounded-[2px] min-w-[64px] px-2 h-[64px] flex items-center justify-center hover:bg-white/10 transition-all duration-300 group relative">
                      <VoiceRecorder onRecordingComplete={(blob) => { voiceBlobRef.current = blob; console.log('Modal voice recorded, size:', blob.size); }} />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button 
                    type="submit"
                    disabled={isSubmitting || (!name && !phone && !email)}
                    className="bg-white border border-white text-black font-montserrat uppercase tracking-[0.2em] font-black text-xs md:text-[13px] h-[64px] hover:bg-transparent hover:text-white transition-all duration-500 rounded-[2px] px-12 shadow-lg shrink-0 w-full lg:w-auto h-[64px] disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                  >
                    <span>{isSubmitting ? t('modals.contact.submitting') : t('modals.contact.submit')}</span>
                    <Send className="w-4 h-4" />
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
