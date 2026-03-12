import { useEffect, useRef } from 'react';
import { Building2, Compass, PhoneCall, Users, Gem } from 'lucide-react';

/* ─── Service data (ready for future dynamic loading from admin DB) ─── */
const services = [
  {
    id: 1,
    num: '01',
    icon: <Building2 className="w-8 h-8" strokeWidth={1} />,
    title: 'Преміальний відпочинок і оренда приватних об\'єктів',
    description:
      'Ексклюзивні вілли, шато та шале по всьому світу. Ідеальні для сімей, романтичних поїздок чи камерних корпоративних заходів. Ми забезпечуємо максимальний комфорт і приватність, яких неможливо досягти стандартними бронюваннями.',
    image:
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=1000',
    items: null,
  },
  {
    id: 2,
    num: '02',
    icon: <Compass className="w-8 h-8" strokeWidth={1} />,
    title: 'Індивідуальні маршрути та тематичні подорожі',
    description: null,
    image:
      'https://images.unsplash.com/photo-1503220317375-aaad61436b1b?auto=format&fit=crop&q=80&w=1000',
    items: [
      { label: 'Пляжний відпочинок', text: 'ретельно підібрані курорти з балансом комфорту, сервісу і релаксу.' },
      { label: 'Сімейні подорожі', text: 'продумані маршрути з безпечними локаціями і логістикою, цікаві дітям і дорослим.' },
      { label: 'Романтичні поїздки', text: 'приватність, атмосфера та деталі, що роблять спільний відпочинок унікальним.' },
      { label: 'Пригодницькі подорожі', text: 'активні маршрути з контролем ризиків, екстремальні експедиції з безпекою на першому місці.' },
      { label: 'Культурні подорожі та екскурсії', text: 'локальні гіди, закриті формати, занурення в традиції та історію.' },
    ],
  },
  {
    id: 3,
    num: '03',
    icon: <PhoneCall className="w-8 h-8" strokeWidth={1} />,
    title: 'Професійний супровід і аудит подорожей',
    description: null,
    image:
      'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=1000',
    items: [
      { label: 'Travel Audit', text: 'перевірка і оптимізація вашого маршруту, таймінгів та бюджету для максимальної ефективності і комфорту.' },
      { label: '24/7 підтримка', text: 'конкретний менеджер знає всі деталі вашої поїздки і має повноваження вирішувати будь-які питання оперативно.' },
    ],
  },
  {
    id: 4,
    num: '04',
    icon: <Users className="w-8 h-8" strokeWidth={1} />,
    title: 'MICE та корпоративні рішення',
    description:
      'Організація бізнес-подій: конференції, мотиваційні тури, виставки і зустрічі. Ми контролюємо всі етапи від ідеї до реалізації, відповідно до високих міжнародних стандартів.',
    image:
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1000',
    items: null,
  },
  {
    id: 5,
    num: '05',
    icon: <Gem className="w-8 h-8" strokeWidth={1} />,
    title: 'Ексклюзивні привілеї і доступи',
    description:
      'Апгрейди номерів, пізній виїзд, спеціальні бонуси та закриті досвіди, які неможливо забронювати онлайн. Кожна подорож отримує додаткову цінність завдяки нашим партнерським відносинам.',
    image:
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=1000',
    items: null,
  },
];

/* ─── Scroll-reveal hook ─── */
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
          obs.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

/* ─── Single Service Block ─── */
const ServiceBlock = ({ service, idx }: { service: typeof services[0]; idx: number }) => {
  const ref = useScrollReveal();
  const isReversed = idx % 2 !== 0;
  return (
    <div
      ref={ref}
      className="opacity-0 translate-y-10 transition-all duration-700 ease-out"
      style={{ transitionDelay: `${idx * 80}ms` }}
    >
      <article
        className={`group flex flex-col ${
          isReversed ? 'md:flex-row-reverse' : 'md:flex-row'
        } bg-white/5 border border-white/10 rounded-sm overflow-hidden hover:bg-white/10 hover:-translate-y-1 transition-all duration-500`}
      >
        {/* Image */}
        <div className="md:w-[45%] h-64 md:h-auto min-h-[300px] overflow-hidden relative">
          {/* Large faded service number */}
          <span className="absolute top-4 left-5 font-montserrat text-8xl font-extrabold text-white/10 select-none z-10 leading-none">
            {service.num}
          </span>
          <img
            src={service.image}
            alt={service.title}
            className="w-full h-full object-cover opacity-60 group-hover:opacity-75 transition-all duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
        </div>

        {/* Text */}
        <div className="flex-1 p-8 md:p-10 lg:p-14 flex flex-col justify-center">
          {/* Icon block */}
          <div className="mb-6 p-4 bg-white/5 border border-white/10 inline-block rounded-sm transition-transform duration-500 group-hover:scale-110 text-white/80">
            {service.icon}
          </div>

          <h2 className="font-montserrat font-bold text-2xl lg:text-[26px] text-white leading-tight tracking-tight mb-5 group-hover:text-primary transition-colors duration-300">
            {service.title}
          </h2>

          {service.description && (
            <p className="font-inter text-white/60 text-[15px] leading-relaxed">
              {service.description}
            </p>
          )}

          {service.items && (
            <ul className="space-y-4 mt-1">
              {service.items.map((item, i) => (
                <li key={i} className="flex items-start gap-4">
                  <span className="mt-[7px] w-4 h-px bg-primary/60 shrink-0" />
                  <p className="font-inter text-[15px] text-white/60 leading-relaxed">
                    <strong className="text-white/90 font-medium">{item.label}:</strong> {item.text}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </article>
    </div>
  );
};

/* ─── Page Component ─── */
const ServicesPage = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  const introRef = useScrollReveal();

  return (
    <main className="w-full bg-zinc-950/95 text-white selection:bg-primary/30 min-h-screen overflow-hidden relative">

      {/* Background video (same as AboutPage) */}
      <div className="fixed inset-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <video
          className="w-full h-full object-cover opacity-15"
          src="about-video.mp4"
          autoPlay muted loop playsInline
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
      </div>

      {/* ── Hero Banner ── */}
      <section className="relative w-full h-[70vh] min-h-[480px] overflow-hidden flex items-end">
        <img
          src="https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=1920"
          alt="Services hero"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent" />

        <div className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-12 pb-20 w-full">
          <h1 className="font-montserrat font-extrabold uppercase tracking-tight leading-none">
            <span className="block text-white/30 text-2xl md:text-3xl mb-2">Vogel Family Travel</span>
            <span className="block text-5xl md:text-7xl lg:text-[88px] text-white">
              Сервіси
            </span>
          </h1>
        </div>
      </section>

      {/* ── Intro / description card ── */}
      <section className="relative z-10 bg-white/5 backdrop-blur-xl border-y border-white/10 py-14">
        <div
          ref={introRef}
          className="opacity-0 translate-y-10 transition-all duration-700 ease-out max-w-[1440px] mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
        >
          <div>
            <h2 className="font-montserrat font-bold text-3xl md:text-4xl text-white flex items-center gap-4 mb-6">
              <span className="w-8 h-px bg-white/30" />
              Гнучкий формат
            </h2>
            <p className="font-inter text-white/70 text-lg leading-relaxed">
              Ми працюємо як з повними подорожами «під ключ», так і з окремими запитами — бронювання
              готелів, авіаперельотів, трансферів, екскурсій чи оренди вілл.
            </p>
          </div>
          <div>
            <p className="font-inter text-white/50 text-base leading-relaxed border-l border-white/10 pl-8">
              Ви обираєте рівень залученості — ми забезпечуємо результат і контроль над кожним
              етапом. Кожен клієнт отримує персонального менеджера, який веде весь маршрут від
              першого запиту до повернення додому.
            </p>
          </div>
        </div>
      </section>

      {/* ── Service blocks ── */}
      <section className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-12 py-24">
        <div className="flex flex-col gap-6">
          {services.map((service, idx) => (
            <ServiceBlock key={service.id} service={service} idx={idx} />
          ))}
        </div>
      </section>

    </main>
  );
};

export default ServicesPage;
