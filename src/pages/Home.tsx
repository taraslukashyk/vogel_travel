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
      <About />
      
      {/* Grouping Phase 1 added sections with a premium parallax background */}
      <div 
        className="relative w-full overflow-hidden bg-fixed bg-cover bg-center"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="absolute inset-0 bg-black/85 backdrop-blur-[10px] pointer-events-none" />
        <div className="relative z-10 w-full flex flex-col">
          <Advantages />
          <Partners />
          <FeaturedTours />
          <FinalQuote />
        </div>
      </div>
    </>
  )
}

export default Home
