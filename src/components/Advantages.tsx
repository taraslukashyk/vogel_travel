
import { useEffect, useRef } from 'react';

/* ─── Scroll-reveal hook for fade in/out on scroll ─── */
function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('opacity-100', 'translate-y-0');
          el.classList.remove('opacity-0', 'translate-y-10');
        } else {
          el.classList.add('opacity-0', 'translate-y-10');
          el.classList.remove('opacity-100', 'translate-y-0');
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -100px 0px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

const AdvantageItem = ({ num, title, text, delayIdx }: { num: string; title: React.ReactNode; text: string; delayIdx: number }) => {
  const ref = useScrollReveal();
  return (
    <div
      ref={ref}
      className="flex flex-col gap-6 items-center text-center opacity-0 translate-y-10 transition-all duration-1000 ease-out"
      style={{ transitionDelay: `${delayIdx * 150}ms` }}
    >
      <div className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center bg-white/5 backdrop-blur-sm">
        <span className="font-montserrat text-xl font-light text-white/50 tracking-widest">{num}</span>
      </div>
      <h3 className="font-montserrat font-bold text-xl uppercase tracking-widest leading-snug">
        {title}
      </h3>
      <p className="font-inter text-sm md:text-base text-white/70 font-light leading-relaxed max-w-sm">
        {text}
      </p>
    </div>
  );
};

const Advantages = () => {
  return (
    <section className="w-full py-24 bg-transparent text-white relative flex flex-col items-center justify-center border-t border-white/10 px-6 sm:px-12 object-contain">
      <div className="max-w-[1440px] w-full grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-20 relative z-10">
        
        <AdvantageItem 
          num="01" 
          delayIdx={0}
          title={<>Подорожі з<br />продуманим змістом</>}
          text="Ми проєктуємо подорожі, виходячи з ритму життя, цілей і контексту клієнта. Не перевантажуємо маршрутами й активностями заради галочки. Наш критерій якості — стан, у якому людина повертається, і відчуття, що подорож була доречною саме зараз." 
        />

        <AdvantageItem 
          num="02" 
          delayIdx={1}
          title={<>Комфорт як результат<br />уваги до деталей</>}
          text="Кожна подорож для нас — індивідуальний проєкт. Ми продумуємо не лише напрямок і готель, а й логіку пересувань, таймінг, паузи та дрібні деталі, які знімають напругу в дорозі. Ми не працюємо за шаблонами й завжди тримаємо процес під контролем." 
        />

        <AdvantageItem 
          num="03" 
          delayIdx={2}
          title={<>Довіра через<br />передбачуваний результат</>}
          text="Ми будуємо довгострокові відносини, а не разові поїздки. Довіра для нас — це чіткі процеси, чесні рекомендації та відповідальність за результат. Клієнти повертаються до нас, бо знають: їхній час, бюджет і очікування будуть враховані." 
        />

      </div>
    </section>
  );
};

export default Advantages;
