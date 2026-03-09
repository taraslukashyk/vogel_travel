import Header from './components/Header'
import Hero from './components/Hero'
import About from './components/About'
import TopBar from './components/TopBar'

function App() {
  return (
    <div className="min-h-screen bg-background relative selection:bg-primary/30">
      <TopBar />
      <Header />
      <Hero />
      <About />
    </div>
  )
}

export default App
