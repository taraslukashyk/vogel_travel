import { lazy, Suspense } from 'react'
import Hero from '../components/Hero'
import SEOHead from '../components/SEOHead'
import bgImage from '../assets/about-bg.webp'
import OptimizedImage from '../components/OptimizedImage'
import { useLanguage } from '../hooks/useLanguage'
import { useTranslation } from 'react-i18next'

const About = lazy(() => import('../components/About'))
const Advantages = lazy(() => import('../components/Advantages'))
const Partners = lazy(() => import('../components/Partners'))
const FeaturedTours = lazy(() => import('../components/FeaturedTours'))
const FinalQuote = lazy(() => import('../components/FinalQuote'))
const BlogCarousel = lazy(() => import('../components/BlogCarousel'))

const Home = () => {
  const { currentLang } = useLanguage();
  const { t } = useTranslation();

  return (
    <>
      <SEOHead 
        pagePath={`/${currentLang}`} 
        fallbackTitle={t('home.hero_title') + " — " + (currentLang === 'ua' ? 'Преміальні подорожі' : 'Premium Travel')} 
      />
      <Hero />
      
      {/* ── Text Banner (Glass Strip) ── */}
      <section className="relative z-20 w-full bg-zinc-950/90 backdrop-blur-2xl border-y border-white/10 py-12 shadow-2xl">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 text-center flex justify-center">
          <p className="font-inter text-white/90 text-[16px] md:text-[18px] lg:text-[20px] max-w-[1100px] leading-relaxed font-light tracking-wide drop-shadow-sm">
            <span className="font-bold text-white tracking-widest text-lg md:text-xl lg:text-2xl mr-2">Vogel Family Travel</span> 
            {currentLang === 'ua' 
              ? "— туристичний оператор, що створює індивідуальні подорожі для клієнтів із високими вимогами до сервісу, приватності та деталей. Ми працюємо з нестандартними запитами і повністю беремо на себе організацію подорожі — від ідеї до повернення."
              : "— a travel operator creating tailormade journeys for clients with high requirements for service, privacy, and details. We work with non-standard requests and take full responsibility for organizing the trip — from the idea to the return."}
          </p>
        </div>
      </section>

      <div className="relative w-full overflow-hidden">
        {/* Background image replaces backgroundImage style for lazy loading support */}
        <OptimizedImage 
          src={bgImage} 
          alt="Background Decor" 
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/85 pointer-events-none" />
        <div className="relative z-10 w-full flex flex-col">
          <Suspense fallback={null}>
            <Advantages />
            <FeaturedTours />
            <About />
            <Partners />
            <BlogCarousel />
            <FinalQuote />
          </Suspense>
        </div>
      </div>
    </>
  )
}

export default Home
