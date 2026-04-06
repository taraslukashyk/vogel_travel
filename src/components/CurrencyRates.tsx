import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface Rate {
  cc: string;
  rate: number;
}

const CACHE_KEY = 'nbu_rates';
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

function getCached(): { usd: number; eur: number } | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { usd, eur, ts } = JSON.parse(raw);
    if (Date.now() - ts > CACHE_TTL) return null;
    return { usd, eur };
  } catch {
    return null;
  }
}

function setCache(usd: number, eur: number) {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ usd, eur, ts: Date.now() }));
  } catch {
    // ignore storage errors
  }
}

const CurrencyRates = () => {
  const [rates, setRates] = useState<{ usd?: number; eur?: number }>(() => getCached() ?? {});
  const { i18n } = useTranslation();
  const isUA = i18n.language === 'ua';

  useEffect(() => {
    const cached = getCached();
    if (cached) {
      setRates(cached);
      return;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    fetch('https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json', {
      signal: controller.signal,
    })
      .then(res => res.json())
      .then((data: Rate[]) => {
        const usd = data.find(r => r.cc === 'USD')?.rate;
        const eur = data.find(r => r.cc === 'EUR')?.rate;
        if (usd && eur) {
          setRates({ usd, eur });
          setCache(usd, eur);
        }
      })
      .catch(() => {
        // silently ignore — rates just won't display
      })
      .finally(() => clearTimeout(timeout));

    return () => {
      controller.abort();
      clearTimeout(timeout);
    };
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
