import Hero         from '../components/Hero'
import Story        from '../components/Story'
import Pillars      from '../components/Pillars'
import Lifecycle    from '../components/Lifecycle'
import ImpactStats  from '../components/ImpactStats'
import GalleryPreview from '../components/GalleryPreview'
import ClosingCTA   from '../components/ClosingCTA'

export default function Home() {
  return (
    <main>
      <Hero />
      <Story />
      <Pillars />
      <Lifecycle />
      <ImpactStats />
      <GalleryPreview />
      <ClosingCTA />
    </main>
  )
}
