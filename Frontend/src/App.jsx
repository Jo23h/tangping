import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import SignInPage from './components/SignInPage/SignInPage'
import SignUpPage from './components/SignUpPage/SignUpPage'
import NavBar from './components/NavBar/NavBar'
import MainSection from './components/MainSection/MainSection'
import MemoSection from './components/MemoSection/MemoSection'
import { isAuthenticated } from './services/authService'

// Protected Route Component
function ProtectedRoute({ children }) {
  return isAuthenticated() ? children : <Navigate to="/signin" />
}

// Main Dashboard Component
function Dashboard() {
  return (
    <div className="app-container">
      <NavBar />
      <MainSection />
      <MemoSection />
    </div>
  )
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/signin" />} />
      </Routes>
    </Router>
  )
}

export default App
