import { useState, useEffect } from 'react';
import { CheckCircle2, X, CreditCard, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../hooks/useLanguage';
import { supabase } from '../lib/supabase';
import { escapeHTML } from '../lib/utils/html';
import { sendTelegramNotification } from '../lib/notifications';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceTitle: string;
  price: number;
  serviceSlug: string;
}

const PaymentModal = ({ isOpen, onClose, serviceTitle, price, serviceSlug }: PaymentModalProps) => {
  const { t } = useTranslation();
  const { currentLang } = useLanguage();
  const isUA = currentLang === 'ua';
  
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setIsSuccess(false);
      setError(null);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // 1. Notify Telegram about payment attempt
      const telegramMessage = `
<b>💳 СПРОБА ОПЛАТИ СЕРВІСУ</b>
<b>Сервіс:</b> ${escapeHTML(serviceTitle)}
<b>Сума:</b> ${price} грн

<b>👤 Клієнт:</b>
Ім'я: ${escapeHTML(form.firstName)} ${escapeHTML(form.lastName)}
Телефон: ${escapeHTML(form.phone)}
Email: ${escapeHTML(form.email)}
      `.trim();

      await sendTelegramNotification(telegramMessage);

      // 2. Create Monobank Invoice via Edge Function
      // Note: We'll need to create this function. If it doesn't exist, we'll show a message for now.
      const { data, error: funcError } = await supabase.functions.invoke('create-monobank-invoice', {
        body: {
          amount: price * 100, // in kopecks
          ccy: 980, // UAH
          merchantPaymInfo: {
            destination: `Оплата за сервіс: ${serviceTitle}`,
            comment: `Client: ${form.firstName} ${form.lastName}`,
            reference: `service_${serviceSlug}_${Date.now()}`,
          },
          redirectUrl: window.location.origin + '/' + currentLang + '/services/' + serviceSlug + '?payment=success',
          webHookUrl: 'https://nuzljtexciclocgcinjh.supabase.co/functions/v1/monobank-webhook',
        }
      });

      if (funcError) {
        // Fallback if function is not yet deployed or fails
        console.error('Payment function error:', funcError);
        throw new Error(isUA ? 'Сервіс оплати тимчасово недоступний. Наш менеджер звʼяжеться з вами для надання реквізитів.' : 'Payment service is temporarily unavailable. Our manager will contact you with payment details.');
      }

      if (data?.pageUrl) {
        window.location.href = data.pageUrl;
      } else {
        throw new Error('No payment URL returned');
      }

    } catch (err: any) {
      setError(err.message);
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative w-full max-w-lg bg-zinc-900 border border-white/10 p-8 md:p-10 shadow-2xl animate-in zoom-in-95 duration-300">
        <button onClick={onClose} className="absolute top-4 right-4 text-white/20 hover:text-white transition-colors">
          <X size={24} />
        </button>

        {isSuccess ? (
          <div className="text-center py-10">
            <div className="w-20 h-20 bg-[#5cc8bd]/10 flex items-center justify-center text-[#5cc8bd] mx-auto mb-6 rounded-full border border-[#5cc8bd]/20">
              <CheckCircle2 size={40} />
            </div>
            <h3 className="text-white font-montserrat font-black uppercase tracking-[0.2em] text-2xl mb-4">
              {isUA ? 'ДЯКУЄМО' : 'THANK YOU'}
            </h3>
            <p className="text-white/60">
              {isUA ? 'Ваш запит прийнято. Перенаправляємо на сторінку оплати...' : 'Your request is accepted. Redirecting to payment page...'}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="text-center md:text-left mb-8">
              <div className="flex items-center gap-3 text-[#5cc8bd] text-[10px] font-black uppercase tracking-[0.4em] mb-3">
                <CreditCard size={14} />
                <span>{isUA ? 'Оплата сервісу' : 'Service Payment'}</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-montserrat font-bold text-white mb-2 uppercase tracking-tight">
                {serviceTitle}
              </h2>
              <div className="text-3xl font-serif italic text-[#5cc8bd]">
                {price} {t('common.currency')}
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-sm rounded-sm">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase text-white/40 font-black tracking-widest">{isUA ? 'Імʼя' : 'First Name'}</label>
                <input
                  required
                  type="text"
                  value={form.firstName}
                  onChange={e => setForm({...form, firstName: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 px-4 py-3 text-white outline-none focus:border-[#5cc8bd] transition-colors"
                  placeholder="John"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase text-white/40 font-black tracking-widest">{isUA ? 'Прізвище' : 'Last Name'}</label>
                <input
                  required
                  type="text"
                  value={form.lastName}
                  onChange={e => setForm({...form, lastName: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 px-4 py-3 text-white outline-none focus:border-[#5cc8bd] transition-colors"
                  placeholder="Doe"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase text-white/40 font-black tracking-widest">{isUA ? 'Телефон' : 'Phone'}</label>
              <input
                required
                type="tel"
                value={form.phone}
                onChange={e => setForm({...form, phone: e.target.value})}
                className="w-full bg-white/5 border border-white/10 px-4 py-3 text-white outline-none focus:border-[#5cc8bd] transition-colors"
                placeholder="+380..."
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase text-white/40 font-black tracking-widest">Email</label>
              <input
                required
                type="email"
                value={form.email}
                onChange={e => setForm({...form, email: e.target.value})}
                className="w-full bg-white/5 border border-white/10 px-4 py-3 text-white outline-none focus:border-[#5cc8bd] transition-colors"
                placeholder="john@example.com"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#5cc8bd] hover:bg-[#4eb1a6] text-black font-montserrat font-black uppercase tracking-[0.3em] py-5 mt-4 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>{isUA ? 'ОБРОБКА...' : 'PROCESSING...'}</span>
                </>
              ) : (
                <>
                  <CreditCard size={20} />
                  <span>{isUA ? 'ОПЛАТИТИ ЗАРАЗ' : 'PAY NOW'}</span>
                </>
              )}
            </button>

            <p className="text-[9px] text-white/30 text-center uppercase tracking-widest leading-relaxed">
              {isUA 
                ? 'Натискаючи кнопку, ви погоджуєтесь з умовами публічної оферти та політикою конфіденційності' 
                : 'By clicking the button, you agree to the terms of the public offer and privacy policy'}
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;
