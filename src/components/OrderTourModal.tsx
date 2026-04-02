import { useState, useEffect, useRef } from 'react';
import { Send, CheckCircle2, X, ChevronRight, ChevronLeft } from 'lucide-react';
import VoiceRecorder from './VoiceRecorder';
import { sendTelegramNotification, sendTelegramVoice } from '../lib/notifications';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../hooks/useLanguage';
import { useOffers } from '../lib/queries/offers';
import { useLanguageContent } from '../hooks/useLanguageContent';
import { escapeHTML } from '../lib/utils/html';
import OptimizedImage from './OptimizedImage';
import { useNavigate } from 'react-router-dom';

interface OrderTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  tourTitle?: string;
}

const OrderTourModal = ({ isOpen, onClose, tourTitle: initialTourTitle = '' }: OrderTourModalProps) => {
  const { t } = useTranslation();
  const { currentLang } = useLanguage();
  const { t: tc } = useLanguageContent();
  const { data: offers = [] } = useOffers();
  const { l } = useLanguage();
  const navigate = useNavigate();
  const isUA = currentLang === 'ua';

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [selectedTour, setSelectedTour] = useState(initialTourTitle);
  const [voiceBlob, setVoiceBlob] = useState<Blob | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setIsSuccess(false);
      setName('');
      setPhone('');
      setEmail('');
      setMessage('');
      setVoiceBlob(null);
      setSelectedTour(initialTourTitle);
    }
  }, [isOpen, initialTourTitle]);

  const handleTourClick = (offer: any) => {
    const slug = tc(offer, 'slug');
    onClose();
    navigate(l(`/contacts?service=offer-${slug}&payment=card`));
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth * 0.8 : scrollLeft + clientWidth * 0.8;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const phoneRegex = /^[+]?[\d\s\-\(\).]{10,20}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const isPValid = !phone || phoneRegex.test(phone);
    const isEValid = !email || emailRegex.test(email);
    const hasContact = phone || email;

    if (!hasContact || !isPValid || !isEValid) return;

    setIsSubmitting(true);

    const contactParts = [];
    if (name) contactParts.push(`${isUA ? "Ім'я" : "Name"}: ${name}`);
    if (phone) contactParts.push(`${isUA ? "Телефон" : "Phone"}: ${phone}`);
    if (email) contactParts.push(`Email: ${email}`);
    const contactInfo = contactParts.join('\n');

    const telegramMessage = `
<b>🔥 ${isUA ? 'Нове замовлення туру' : 'New Tour Order'}</b>

<b>📍 ${isUA ? 'Тур' : 'Tour'}:</b> ${selectedTour || (isUA ? 'Обрано з актуальних' : 'Selected from actual')}

<b>👤 ${isUA ? 'Контактні дані' : 'Contact Data'}:</b>
${escapeHTML(contactInfo)}

<b>💬 ${isUA ? 'Коментар' : 'Comment'}:</b> ${message || (isUA ? 'Без коментарів' : 'No comments')}
    `.trim();

    const result = await sendTelegramNotification(telegramMessage);

    if (result.success) {
      if (voiceBlob) {
        try {
          const reader = new FileReader();
          reader.readAsDataURL(voiceBlob);
          reader.onloadend = async () => {
            const base64data = reader.result as string;
            const base64 = base64data.split(',')[1];
            const voiceCaption = `${isUA ? 'Голосове повідомлення від' : 'Voice message from'}: ${name || phone || email}`;
            await sendTelegramVoice(voiceCaption, base64, 'voice.ogg', result.messageId);
          };
        } catch (err) {
          console.error('Error preparing voice message:', err);
        }
      }

      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 3000);
    } else {
      alert(isUA ? 'Помилка відправки: ' + result.error : 'Error sending: ' + result.error);
    }

    setIsSubmitting(false);
  };

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center pointer-events-none transition-all duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 delay-100'}`}>
      <div
        className={`absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-500 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      <div className={`relative w-full max-w-[1440px] transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] ${isOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-8 pointer-events-none'}`}>
        <div className="bg-black/90 backdrop-blur-3xl border-y border-white/10 py-8 md:py-12 shadow-2xl relative w-full overflow-hidden">
          <div className="mx-auto px-6 md:px-12 relative z-10 w-full">
            
            <button onClick={onClose} className="absolute -top-4 right-6 md:right-12 p-2 text-white/20 hover:text-white transition-colors z-50">
              <X size={24} />
            </button>

            {isSuccess ? (
              <div className="flex flex-col items-center justify-center py-12 animate-in fade-in zoom-in duration-500">
                <CheckCircle2 className="text-[#5cc8bd] w-20 h-20 mb-6" />
                <h2 className="text-2xl md:text-4xl font-montserrat font-bold text-white mb-4 uppercase tracking-widest text-center">{t('modals.order_tour.success_title')}</h2>
                <p className="text-white/60 text-center text-lg">{t('modals.order_tour.success_desc')}</p>
              </div>
            ) : (
              <div className="flex flex-col gap-6 w-full">
                <div className="text-center md:text-left">
                  <h2 className="text-xl md:text-3xl font-montserrat font-bold text-white mb-1 tracking-[0.05em] uppercase leading-none">
                    {selectedTour ? selectedTour : t('modals.order_tour.title')}
                  </h2>
                  <p className="text-white/40 text-xs md:text-sm uppercase tracking-widest font-black">
                    {selectedTour ? t('modals.order_tour.wish_subtitle') : t('modals.order_tour.subtitle')}
                  </p>
                </div>

                {/* Actual Offers Slider */}
                {!initialTourTitle && offers.length > 0 && (
                  <div className="relative group/slider">
                    <div 
                      ref={scrollRef}
                      className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 snap-x"
                      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                      {offers.map((offer: any) => {
                        const hotel = tc(offer, 'hotel');
                        return (
                          <div 
                            key={offer.id}
                            onClick={() => handleTourClick(offer)}
                            className="flex-shrink-0 w-[240px] md:w-[320px] aspect-[4/3] relative rounded-sm overflow-hidden cursor-pointer transition-all duration-300 snap-start h-[180px] md:h-[240px] group opacity-90 hover:opacity-100 hover:scale-[1.02]"
                          >
                            <OptimizedImage 
                              src={offer.image} 
                              alt={hotel} 
                              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            
                            {offer.discount && (
                              <div className="absolute top-3 right-3 bg-[#5cc8bd] text-black font-montserrat font-black text-[10px] px-2 py-1 rounded-sm shadow-xl tracking-tighter z-10 animate-pulse">
                                {offer.discount}
                              </div>
                            )}

                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 transition-opacity group-hover:opacity-60" />
                            <div className="absolute bottom-4 left-4 right-4 transform transition-transform group-hover:-translate-y-1">
                              <p className="text-white font-montserrat font-bold text-sm md:text-lg leading-tight uppercase tracking-wide drop-shadow-lg">{hotel}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <div className="w-4 h-px bg-[#5cc8bd]" />
                                <p className="text-[#5cc8bd] text-[9px] md:text-[10px] uppercase tracking-[0.2em] font-black">{tc(offer, 'location')}</p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    
                    <button 
                      onClick={() => scroll('left')}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-[#5cc8bd] text-white p-2 rounded-full backdrop-blur-md opacity-0 group-hover/slider:opacity-100 transition-all duration-300 z-20"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button 
                      onClick={() => scroll('right')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-[#5cc8bd] text-white p-2 rounded-full backdrop-blur-md opacity-0 group-hover/slider:opacity-100 transition-all duration-300 z-20"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                )}

                <p className="text-[10px] uppercase tracking-widest text-[#5cc8bd] font-black -mb-2 border-l-2 border-[#5cc8bd] pl-3">
                  {isUA ? "Заповніть номер телефону або пошту для зв'язку" : "Fill in phone or email to contact you"}
                </p>

                {/* Unified Form Layout */}
                <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-4 w-full bg-white/5 border border-white/10 p-6 md:p-8 rounded-sm items-start">
                  <div className="flex-[3] grid grid-cols-1 md:grid-cols-3 gap-3 w-full">
                    <div className="bg-white/5 border border-white/10 rounded-[2px] p-3 px-5 focus-within:border-white/40 transition-colors h-[64px] flex flex-col justify-center">
                      <label className="text-[10px] uppercase text-white/60 font-montserrat font-black tracking-[0.1em] mb-1">{isUA ? "Ім'я" : "Name"}</label>
                      <input
                        type="text"
                        name="name"
                        autoComplete="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full bg-transparent border-none outline-none text-white font-inter font-semibold text-sm placeholder-white/30 p-0"
                        disabled={isSubmitting}
                      />
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-[2px] p-3 px-5 focus-within:border-white/40 transition-colors h-[64px] flex flex-col justify-center">
                      <label className="text-[10px] uppercase text-white/60 font-montserrat font-black tracking-[0.1em] mb-1">{isUA ? "Телефон" : "Phone"}</label>
                      <input
                        type="tel"
                        name="phone"
                        autoComplete="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+380..."
                        className="w-full bg-transparent border-none outline-none text-white font-inter font-semibold text-sm placeholder-white/30 p-0"
                        disabled={isSubmitting}
                      />
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-[2px] p-3 px-5 focus-within:border-white/40 transition-colors h-[64px] flex flex-col justify-center">
                      <label className="text-[10px] uppercase text-white/60 font-montserrat font-black tracking-[0.1em] mb-1">Email</label>
                      <input
                        type="email"
                        name="email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="mail@example.com"
                        className="w-full bg-transparent border-none outline-none text-white font-inter font-semibold text-sm placeholder-white/30 p-0"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  <div className="flex-[2] w-full flex gap-3">
                    <div className="flex-1 bg-white/5 border border-white/10 rounded-[2px] p-3 px-5 focus-within:border-white/40 transition-colors h-[64px] flex flex-col justify-center text-left">
                      <label className="text-[10px] uppercase text-white/60 font-montserrat font-black tracking-[0.1em] mb-1">{t('modals.order_tour.comment_label')}</label>
                      <input
                        type="text"
                        name="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder={t('modals.order_tour.comment_placeholder')}
                        className="w-full bg-transparent border-none outline-none text-white font-inter font-semibold text-sm placeholder-white/30 p-0"
                        disabled={isSubmitting}
                      />
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-[2px] min-w-[64px] px-2 h-[64px] flex items-center justify-center hover:bg-white/10 transition-all duration-300 group relative">
                      <VoiceRecorder onRecordingComplete={setVoiceBlob} />
                    </div>
                  </div>

                  <button 
                    type="submit"
                    disabled={
                      !!isSubmitting || 
                      (!phone && !email) || 
                      (!!phone && !/^[+]?[\d\s\-\(\).]{10,20}$/.test(phone)) || 
                      (!!email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
                    }
                    className="bg-white border border-white text-black font-montserrat uppercase tracking-[0.2em] font-black text-xs md:text-[13px] h-[64px] hover:bg-transparent hover:text-white transition-all duration-500 rounded-[2px] px-12 shadow-lg flex items-center justify-center gap-3 disabled:opacity-30 disabled:cursor-not-allowed group w-full lg:w-auto shrink-0"
                  >
                    <span>{isSubmitting ? t('modals.order_tour.submitting') : t('modals.order_tour.submit')}</span>
                    <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTourModal;
