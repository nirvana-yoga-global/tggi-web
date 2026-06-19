import './App.css'
import Hero        from './components/Hero'
import Story       from './components/Story'
import Pillars     from './components/Pillars'
import Lifecycle   from './components/Lifecycle'
import ImpactStats from './components/ImpactStats'
import ClosingCTA  from './components/ClosingCTA'
import Footer      from './components/Footer'

export default function App() {
  return (
    <>
      <main>
        <Hero />
        <Story />
        <Pillars />
        <Lifecycle />
        <ImpactStats />
        <ClosingCTA />
      </main>
      <Footer />
    </>
  )
}
