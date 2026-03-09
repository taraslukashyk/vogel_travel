import Header from './components/Header'
import Hero from './components/Hero'
import About from './components/About'

function App() {
  return (
    <div className="min-h-screen bg-background relative selection:bg-primary/30">
      <Header />
      <Hero />
      <About />
    </div>
  )
}

export default App
