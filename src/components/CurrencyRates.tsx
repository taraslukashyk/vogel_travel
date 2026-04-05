import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface Rate {
  cc: string;
  rate: number;
}

const CurrencyRates = () => {
  const [rates, setRates] = useState<{ usd?: number; eur?: number }>({});
  const { i18n } = useTranslation();
  const isUA = i18n.language === 'ua';

  useEffect(() => {
    fetch('https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json')
      .then(res => res.json())
      .then((data: Rate[]) => {
        const usd = data.find(r => r.cc === 'USD')?.rate;
        const eur = data.find(r => r.cc === 'EUR')?.rate;
        setRates({ usd, eur });
      })
      .catch(err => console.error('Failed to fetch NBU rates:', err));
  }, []);

  if (!rates.usd || !rates.eur) return null;

  return (
    <div className="flex items-center gap-3 text-[11px] lg:text-[11px] font-semibold tracking-normal text-white/40 normal-case lowercase whitespace-nowrap">
      <span>{isUA ? 'курс нбу:' : 'nbu rates:'}</span>
      <div className="flex items-center gap-2">
        <span className="flex items-center gap-1 leading-none">
          <span className="text-white/50">usd</span> 
          <span className="text-white/60">{rates.usd.toFixed(2)} ₴</span>
        </span>
        <span className="w-px h-2 bg-white/10 shrink-0"></span>
        <span className="flex items-center gap-1 leading-none">
          <span className="text-white/50">eur</span> 
          <span className="text-white/60">{rates.eur.toFixed(2)} ₴</span>
        </span>
      </div>
    </div>
  );
};

export default CurrencyRates;
