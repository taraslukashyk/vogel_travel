import aboutBg from '../assets/about-bg.png';

const About = () => {
  return (
    <section className="w-full relative py-20 md:py-28 overflow-hidden">
      {/* Blurred exotic background */}
      <div
        className="absolute inset-0 bg-cover bg-center scale-110"
        style={{
          backgroundImage: `url(${aboutBg})`,
          filter: 'blur(8px)',
          WebkitFilter: 'blur(8px)',
        }}
      />
      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Content */}
      <div className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-8 lg:px-12 flex flex-col lg:flex-row gap-12 lg:gap-20 items-start">

        {/* Left: Photo placeholder */}
        <div className="w-full lg:w-[380px] xl:w-[440px] flex-shrink-0">
          <div className="w-full aspect-[3/4] bg-white/10 backdrop-blur-sm border border-white/20 rounded-sm overflow-hidden flex items-center justify-center">
            <span className="text-white/50 font-montserrat text-sm uppercase tracking-wider text-center px-4">
              Фото засновниці
            </span>
          </div>
        </div>

        {/* Right: Quote + Mission */}
        <div className="flex flex-col gap-12 flex-1 pt-2">

          {/* Blockquote */}
          <div className="border-l-4 border-white/70 pl-6 md:pl-8">
            <span className="block font-serif text-5xl text-white/80 leading-none mb-3 select-none">&ldquo;</span>

            <blockquote className="font-inter text-white text-lg md:text-xl leading-relaxed font-light">
              За роки роботи в туристичному бізнесі я зрозуміла
              головне: якісна подорож&nbsp;— це не набір локацій, а
              продумане рішення, за яке хтось несе відповідальність.
              У&nbsp;<strong className="font-semibold">Vogel Family Travel</strong> ми працюємо з клієнтами, для яких
              важливі контроль, передбачуваність і увага до деталей.
              Я особисто задаю стандарти сервісу і формую команду
              фахівців, які вміють працювати зі складними запитами
              та нестандартними ситуаціями. Нам довіряють подорожі,
              бо знають: кожне рішення буде зваженим, а результат
              &nbsp;— відповідатиме очікуванням
            </blockquote>

            <cite className="block mt-5 text-white/70 font-inter text-sm not-italic">
              <em>Вікторія Шелюжко, засновниця Vogel Family Travel.</em>
            </cite>
          </div>

          {/* Mission */}
          <div>
            <h2 className="font-montserrat font-bold text-3xl md:text-4xl text-white mb-4">
              Наша місія
            </h2>
            <p className="font-inter text-white/80 text-base md:text-lg leading-relaxed">
              Створювати подорожі, які органічно вписуються в життя клієнта і залишають відчуття цілісного, добре
              продуманого досвіду. Ми працюємо не з напрямками, а з запитами, беручи на себе відповідальність за
              якість, конфіденційність і кінцевий результат.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default About;
