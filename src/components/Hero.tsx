import heroBg from '../assets/hero-bg.jpg';
// Placeholder for the bottom right card image
import cardImg from '../assets/hero-bg.png'; // temporarily using the old hero bg for the card

const Hero = () => {
  return (
    <section className="relative h-screen w-full flex items-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      
      {/* Light gradient overlay just to ensure white text readability if needed, but keeping it minimal per reference */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
      
      {/* Left Content */}
      <div className="relative z-10 w-full px-6 md:px-10 lg:px-24 mx-auto max-w-7xl flex justify-between items-end pb-20 pt-32 h-full">
        
        {/* Main Text & CTA */}
        <div className="flex flex-col max-w-xl self-center pt-20">
          <h1 className="font-oswald text-6xl md:text-8xl lg:text-[100px] font-bold text-white/95 leading-[0.9] tracking-tight mb-8">
            Крок у Світ <br /> Відкриттів
          </h1>
          
          <p className="font-oswald text-white/90 text-sm md:text-base mb-8 max-w-md leading-snug tracking-wide uppercase">
            Унікальні туристичні напрямки чекають, щоб розпалити цікавість та надихнути на нові пригоди. 
            У Vogel Travel ми відкриваємо приховані перлини світу, включаючи чарівні міста та нестандартні маршрути, 
            готові до дослідження. Знайдіть своє натхнення та зробіть кожну подорож незабутньою.
          </p>
          
          <button className="bg-white text-black font-oswald uppercase tracking-wider font-bold py-3.5 px-8 w-max hover:bg-gray-200 transition-colors">
            Дослідити Зараз
          </button>
        </div>

        {/* Right Bottom Card (Blog preview) */}
        <div className="hidden lg:flex w-[400px] h-[140px] bg-white/90 backdrop-blur-md self-end shadow-2xl overflow-hidden rounded-sm">
          {/* Card Image */}
          <div className="w-1/2 h-full bg-cover bg-center" style={{ backgroundImage: `url(${cardImg})` }}></div>
          
          {/* Card Content */}
          <div className="w-1/2 p-4 flex flex-col justify-between font-oswald text-black">
            <div>
              <h3 className="text-lg leading-tight tracking-tight uppercase font-medium line-clamp-2 mb-1">
                10 розкішних місць для відпустки
              </h3>
              <a href="#" className="text-xs uppercase font-bold underline decoration-2 underline-offset-2 hover:text-gray-600">
                Читати зараз
              </a>
            </div>
            
            <div className="text-[10px] text-gray-500 uppercase leading-tight">
              Reiseguides <br/>
              Жовтень 27, 2024
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Hero;
