import { useState, useEffect } from 'react';
import { Send, CheckCircle2, X } from 'lucide-react';
import { sendTelegramNotification } from '../lib/notifications';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMessage?: string;
}

const ContactModal = ({ isOpen, onClose, initialMessage = '' }: ContactModalProps) => {
  const [contact, setContact] = useState('');
  const [message, setMessage] = useState(initialMessage);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Update message when initialMessage changes (e.g. when opening from different offer)
  useEffect(() => {
    if (isOpen) {
      setMessage(initialMessage);
      setIsSuccess(false);
    }
  }, [isOpen, initialMessage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contact) return;

    setIsSubmitting(true);
    
    const telegramMessage = `
<b>📩 Новий запит на зворотній зв'язок (Модальне вікно)</b>

<b>👤 Контакт:</b> ${contact}
<b>💬 Повідомлення:</b> ${message || 'Без повідомлення'}
    `.trim();

    const result = await sendTelegramNotification(telegramMessage);
    
    if (result.success) {
      setIsSuccess(true);
      setContact('');
      setMessage('');
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
                <h2 className="text-2xl md:text-3xl font-montserrat font-bold text-white mb-2 uppercase tracking-widest text-center">Дякуємо!</h2>
                <p className="text-white/60 text-center">Запит отримано. Ми зв'яжемося з вами найближчим часом.</p>
              </div>
            ) : (
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex-shrink-0 text-center md:text-left">
                  <h2 className="text-xl md:text-3xl font-montserrat font-bold text-white mb-2 tracking-[0.05em] uppercase">
                    Зв'язок
                  </h2>
                  <p className="text-white/40 text-[11px] uppercase tracking-widest font-bold">
                    Залиште запит і ми зв'яжемося з вами
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="flex-grow flex flex-col lg:flex-row gap-4 w-full">
                  <div className="flex-[1.5] bg-white/5 border border-white/10 rounded-[2px] p-3 px-5 relative flex flex-col justify-center focus-within:border-white/30 transition-colors">
                    <label className="text-[10px] uppercase text-white/40 font-montserrat font-bold tracking-[0.1em] mb-1">
                      Контактні дані
                    </label>
                    <input
                      type="text"
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                      placeholder="Номер, e-mail, або нікнейм у соцмережі"
                      className="w-full outline-none text-white font-inter font-semibold text-sm md:text-base border-none p-0 bg-transparent placeholder-white/20"
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="flex-[2] bg-white/5 border border-white/10 rounded-[2px] p-3 px-5 relative flex flex-col justify-center focus-within:border-white/30 transition-colors">
                    <label className="text-[10px] uppercase text-white/40 font-montserrat font-bold tracking-[0.1em] mb-1">
                      Коментар до звернення
                    </label>
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Ваше повідомлення..."
                      className="w-full outline-none text-white font-inter font-semibold text-sm border-none p-0 bg-transparent placeholder-white/20"
                      disabled={isSubmitting}
                    />
                  </div>

                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-white border border-white text-black font-montserrat uppercase tracking-[0.2em] font-bold text-sm md:text-[13px] hover:bg-transparent hover:text-white transition-all duration-500 rounded-[2px] px-10 py-5 lg:py-0 shadow-lg shrink-0 w-full lg:w-auto h-[64px] disabled:opacity-50"
                  >
                    <div className="flex items-center justify-center gap-3">
                      <span>{isSubmitting ? 'Надсилаємо...' : 'Надіслати'}</span>
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

