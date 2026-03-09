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
      <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />
      
      {/* Container with increased max-width to push content to edges */}
      <div className="relative z-10 w-full px-6 md:px-8 lg:px-12 mx-auto max-w-[1440px] flex justify-between items-end pb-16 pt-32 h-full">
        
        {/* Left Content: Text & CTA */}
        <div className="flex flex-col max-w-[600px] self-center pt-10">
          <h1 className="font-montserrat text-5xl md:text-7xl lg:text-[80px] font-bold text-white leading-[1.05] tracking-tight mb-8">
            Відкрийте світ: <br /> ваша подорож <br /> починається
          </h1>
          
          <p className="font-inter text-white/95 text-base md:text-lg mb-10 max-w-[550px] leading-relaxed font-light">
            Vogel Family Travel — туристичний оператор, що створює індивідуальні подорожі для
            клієнтів із високими вимогами до сервісу, приватності та деталей. Ми працюємо з
            нестандартними запитами і повністю беремо на себе організацію подорожі — від ідеї до повернення.
          </p>
          
          <button className="bg-white text-black font-montserrat uppercase tracking-wider font-bold py-4 px-10 w-max hover:bg-gray-200 transition-colors rounded-sm shadow-lg">
            Дослідити Зараз
          </button>
        </div>

        {/* Right Bottom Card (Blog preview) */}
        <div className="hidden lg:flex w-[420px] h-[150px] bg-white/95 backdrop-blur-md self-end shadow-2xl overflow-hidden rounded-sm">
          {/* Card Image */}
          <div className="w-1/2 h-full bg-cover bg-center" style={{ backgroundImage: `url(${cardImg})` }}></div>
          
          {/* Card Content */}
          <div className="w-1/2 p-5 flex flex-col justify-between font-montserrat text-black">
            <div>
              <h3 className="text-base leading-snug tracking-tight uppercase font-semibold line-clamp-2 mb-2">
                10 розкішних місць для відпустки
              </h3>
              <a href="#" className="text-xs uppercase font-bold underline decoration-2 underline-offset-2 hover:text-gray-600 transition-colors">
                Читати зараз
              </a>
            </div>
            
            <div className="text-[10px] text-gray-500 uppercase leading-snug font-medium">
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
