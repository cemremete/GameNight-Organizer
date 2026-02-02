import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Dashboard'
import CreateEvent from './pages/CreateEvent'
import EventDetail from './pages/EventDetail'
import Analytics from './pages/Analytics'
import Login from './pages/Login'
import Register from './pages/Register'

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/events/create" element={<CreateEvent />} />
        <Route path="/events/:id" element={<EventDetail />} />
        <Route path="/analytics" element={<Analytics />} />
      </Routes>
    </AuthProvider>
  )
}

export default App
