import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Navbar   from './components/Navbar'
import Footer   from './components/Footer'
import Home     from './pages/Home'
import Register from './pages/Register'
import Gallery       from './pages/Gallery'
import PersonProfile from './pages/PersonProfile'

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/"         element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/gallery"       element={<Gallery />} />
        <Route path="/person/:id"    element={<PersonProfile />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}
