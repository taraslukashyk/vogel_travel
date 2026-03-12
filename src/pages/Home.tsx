import Hero from '../components/Hero'
import About from '../components/About'
import Advantages from '../components/Advantages'
import Partners from '../components/Partners'
import FeaturedTours from '../components/FeaturedTours'
import FinalQuote from '../components/FinalQuote'
import bgImage from '../assets/about-bg.png'

const Home = () => {
  return (
    <>
      <Hero />
      
      {/* ── Text Banner (Glass Strip) ── */}
      <section className="relative z-20 w-full bg-zinc-950/90 backdrop-blur-2xl border-y border-white/10 py-12 shadow-2xl">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 text-center flex justify-center">
          <p className="font-inter text-white/90 text-[16px] md:text-[18px] lg:text-[20px] max-w-[1100px] leading-relaxed font-light tracking-wide drop-shadow-sm">
            <span className="font-bold text-white tracking-widest text-lg md:text-xl lg:text-2xl mr-2">Vogel Family Travel</span> 
            — туристичний оператор, що створює індивідуальні подорожі 
            для клієнтів із високими вимогами до сервісу, приватності та деталей. 
            Ми працюємо з нестандартними запитами і повністю беремо на себе 
            організацію подорожі — від ідеї до повернення.
          </p>
        </div>
      </section>

      <div 
        className="relative w-full overflow-hidden bg-fixed bg-cover bg-center"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="absolute inset-0 bg-black/85 backdrop-blur-[10px] pointer-events-none" />
        <div className="relative z-10 w-full flex flex-col">
          <Advantages />
          <FeaturedTours />
          <About />
          <Partners />
          <FinalQuote />
        </div>
      </div>
    </>
  )
}

export default Home
