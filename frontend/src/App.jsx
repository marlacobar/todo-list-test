import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login'
import Register from './pages/Register'
import Catalog from './pages/Catalog'
import Map from './pages/Map'


function App() {

  return (
    <div>
      <Toaster
        position="top-right" />
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/map" element={<Map />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
