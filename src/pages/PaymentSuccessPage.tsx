import { useEffect } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../hooks/useLanguage';
import { Link } from 'react-router-dom';

const PaymentSuccessPage = () => {
  const { t } = useTranslation();
  const { l } = useLanguage();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        <div className="w-24 h-24 bg-[#5cc8bd]/10 flex items-center justify-center text-[#5cc8bd] mx-auto mb-8 rounded-full border border-[#5cc8bd]/20">
          <CheckCircle2 size={48} />
        </div>

        <h1 className="text-3xl md:text-4xl font-montserrat font-black text-white uppercase tracking-[0.15em] mb-4">
          {t('payment_success_title')}
        </h1>

        <p className="text-white/60 text-lg mb-10 leading-relaxed">
          {t('payment_success_message')}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to={l('/')}
            className="px-8 py-4 bg-white/5 border border-white/10 text-white font-montserrat font-bold uppercase tracking-[0.2em] text-sm hover:bg-white/10 transition-colors"
          >
            {t('payment_back_home')}
          </Link>
          <Link
            to={l('/services')}
            className="px-8 py-4 bg-[#5cc8bd] text-black font-montserrat font-bold uppercase tracking-[0.2em] text-sm hover:bg-[#4eb1a6] transition-colors"
          >
            {t('payment_view_services')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
