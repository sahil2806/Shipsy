import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Ships from './pages/Ships'
import ShipDetail from './pages/ShipDetail'
import NewShip from './pages/NewShip'
import Profile from './pages/Profile'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/ships" element={
            <ProtectedRoute>
              <Ships />
            </ProtectedRoute>
          } />
          <Route path="/ships/new" element={
            <ProtectedRoute>
              <NewShip />
            </ProtectedRoute>
          } />
          <Route path="/ships/:id" element={
            <ProtectedRoute>
              <ShipDetail />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
    </div>
  )
}

export default App 