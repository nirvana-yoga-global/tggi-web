import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import { AuthProvider }   from './contexts/AuthContext'
import ProtectedRoute     from './components/ProtectedRoute'
import Navbar             from './components/Navbar'
import Footer             from './components/Footer'
import Home               from './pages/Home'
import Register           from './pages/Register'
import Login              from './pages/Login'
import RegisterPlant      from './pages/RegisterPlant'
import Gallery            from './pages/Gallery'
import PersonProfile      from './pages/PersonProfile'
import MyGarden           from './pages/MyGarden'
import PlantProfile       from './pages/PlantProfile'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/"         element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login"    element={<Login />} />
          <Route path="/gallery"  element={<Gallery />} />
          <Route path="/person/:id"  element={<PersonProfile />} />
          <Route path="/plant/:id"   element={<PlantProfile />} />

          <Route path="/my-garden" element={
            <ProtectedRoute><MyGarden /></ProtectedRoute>
          } />
          <Route path="/register-plant" element={
            <ProtectedRoute><RegisterPlant /></ProtectedRoute>
          } />
        </Routes>
        <Footer />
      </AuthProvider>
    </BrowserRouter>
  )
}
