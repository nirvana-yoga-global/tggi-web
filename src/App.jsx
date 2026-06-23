import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Navbar   from './components/Navbar'
import Footer   from './components/Footer'
import Home     from './pages/Home'
import Register from './pages/Register'
import Gallery       from './pages/Gallery'
import PersonProfile from './pages/PersonProfile'
import MyGarden     from './pages/MyGarden'
import PlantProfile from './pages/PlantProfile'

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/"         element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/gallery"       element={<Gallery />} />
        <Route path="/person/:id"    element={<PersonProfile />} />
        <Route path="/my-garden"     element={<MyGarden />} />
        <Route path="/plant/:id"     element={<PlantProfile />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}
