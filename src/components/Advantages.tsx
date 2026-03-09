

const Advantages = () => {
  return (
    <section className="w-full py-24 bg-transparent text-white relative flex flex-col items-center justify-center border-t border-white/10 px-6 sm:px-12 object-contain">
      <div className="max-w-[1440px] w-full grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-20 relative z-10">
        
        {/* Item 1 */}
        <div className="flex flex-col gap-6 items-center text-center">
          <div className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center bg-white/5 backdrop-blur-sm">
            <span className="font-montserrat text-xl font-light text-white/50 tracking-widest">01</span>
          </div>
          <h3 className="font-montserrat font-bold text-xl uppercase tracking-widest leading-snug">
            Подорожі з<br />продуманим змістом
          </h3>
          <p className="font-inter text-sm md:text-base text-white/70 font-light leading-relaxed max-w-sm">
            Ми проєктуємо подорожі, виходячи з ритму життя, цілей і контексту клієнта. Не перевантажуємо маршрутами й активностями заради галочки. Наш критерій якості — стан, у якому людина повертається, і відчуття, що подорож була доречною саме зараз.
          </p>
        </div>

        {/* Item 2 */}
        <div className="flex flex-col gap-6 items-center text-center">
          <div className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center bg-white/5 backdrop-blur-sm">
             <span className="font-montserrat text-xl font-light text-white/50 tracking-widest">02</span>
          </div>
          <h3 className="font-montserrat font-bold text-xl uppercase tracking-widest leading-snug">
            Комфорт як результат<br />уваги до деталей
          </h3>
          <p className="font-inter text-sm md:text-base text-white/70 font-light leading-relaxed max-w-sm">
            Кожна подорож для нас — індивідуальний проєкт. Ми продумуємо не лише напрямок і готель, а й логіку пересувань, таймінг, паузи та дрібні деталі, які знімають напругу в дорозі. Ми не працюємо за шаблонами й завжди тримаємо процес під контролем.
          </p>
        </div>

        {/* Item 3 */}
        <div className="flex flex-col gap-6 items-center text-center">
          <div className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center bg-white/5 backdrop-blur-sm">
             <span className="font-montserrat text-xl font-light text-white/50 tracking-widest">03</span>
          </div>
          <h3 className="font-montserrat font-bold text-xl uppercase tracking-widest leading-snug">
            Довіра через<br />передбачуваний результат
          </h3>
          <p className="font-inter text-sm md:text-base text-white/70 font-light leading-relaxed max-w-sm">
            Ми будуємо довгострокові відносини, а не разові поїздки. Довіра для нас — це чіткі процеси, чесні рекомендації та відповідальність за результат. Клієнти повертаються до нас, бо знають: їхній час, бюджет і очікування будуть враховані.
          </p>
        </div>

      </div>
    </section>
  );
};

export default Advantages;
