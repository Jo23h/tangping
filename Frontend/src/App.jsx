import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import SignInPage from './components/SignInPage/SignInPage'
import NavBar from './components/NavBar/NavBar'
import MainSection from './components/MainSection/MainSection'
import MemoSection from './components/MemoSection/MemoSection'
import Projects from './components/Projects/Projects'
import ProjectView from './components/Projects/ProjectView'
import Inbox from './components/Inbox/Inbox'
import Trash from './components/Trash/Trash'
import AuthCallback from './components/AuthCallback/AuthCallback'
import { isAuthenticated } from './services/authService'

function ProtectedRoute({ children }) {
  return isAuthenticated() ? children : <Navigate to="/signin" />
}

function Dashboard() {
  const [selectedTask, setSelectedTask] = useState(null);

  const handleTaskUpdate = (updatedTask) => {
    // Update the selected task if it's the one being edited
    if (selectedTask && selectedTask._id === updatedTask._id) {
      setSelectedTask(updatedTask);
    }
  };

  return (
    <div className="app-container">
      <NavBar />
      <MainSection
        onTaskSelect={setSelectedTask}
        onTaskUpdate={handleTaskUpdate}
      />
      <MemoSection
        selectedTask={selectedTask}
        onTaskUpdate={handleTaskUpdate}
        onTaskSelect={setSelectedTask}
      />
    </div>
  )
}

function ProjectsPage() {
  return (
    <div className="app-container">
      <NavBar />
      <Projects />
      <div className="memo-section-placeholder"></div>
    </div>
  )
}

function ProjectViewPage() {
  const [selectedTask, setSelectedTask] = useState(null);

  const handleTaskUpdate = (updatedTask) => {
    if (selectedTask && selectedTask._id === updatedTask._id) {
      setSelectedTask(updatedTask);
    }
  };

  return (
    <div className="app-container">
      <NavBar />
      <ProjectView
        onTaskSelect={setSelectedTask}
        onTaskUpdate={handleTaskUpdate}
      />
      <MemoSection
        selectedTask={selectedTask}
        onTaskUpdate={handleTaskUpdate}
        onTaskSelect={setSelectedTask}
      />
    </div>
  )
}

function InboxPage() {
  const [selectedTask, setSelectedTask] = useState(null);

  const handleTaskUpdate = (updatedTask) => {
    if (selectedTask && selectedTask._id === updatedTask._id) {
      setSelectedTask(updatedTask);
    }
  };

  return (
    <div className="app-container">
      <NavBar />
      <Inbox
        onTaskSelect={setSelectedTask}
        onTaskUpdate={handleTaskUpdate}
      />
      <MemoSection
        selectedTask={selectedTask}
        onTaskUpdate={handleTaskUpdate}
        onTaskSelect={setSelectedTask}
      />
    </div>
  )
}

function TrashPage() {
  return (
    <div className="app-container">
      <NavBar />
      <Trash />
      <div className="memo-section-placeholder"></div>
    </div>
  )
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route
          path="/inbox"
          element={
            <ProtectedRoute>
              <InboxPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/projects"
          element={
            <ProtectedRoute>
              <ProjectsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/projects/:id"
          element={
            <ProtectedRoute>
              <ProjectViewPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/trash"
          element={
            <ProtectedRoute>
              <TrashPage />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/signin" />} />
      </Routes>
    </Router>
  )
}

export default App
