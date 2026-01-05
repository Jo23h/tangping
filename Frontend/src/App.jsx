import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import HomePage from './pages/HomePage';
import InboxPage from './pages/InboxPage';
import DashboardPage from './pages/DashboardPage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectViewPage from './pages/ProjectViewPage';
import ActivityPage from './pages/ActivityPage';
import TrashPage from './pages/TrashPage';
import SignInPage from './components/SignInPage/SignInPage';
import AuthCallback from './components/AuthCallback/AuthCallback';

// Protected route that checks for authentication
function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/signin" replace />;
  }

  return children;
}

function App() {

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/auth/callback" element={<AuthCallback />} />

        {/* Protected routes */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
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
              <DashboardPage />
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
          path="/activity"
          element={
            <ProtectedRoute>
              <ActivityPage />
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

        {/* Root redirect - check if user is authenticated */}
        <Route
          path="/"
          element={
            localStorage.getItem('token') ? (
              <Navigate to="/home" replace />
            ) : (
              <Navigate to="/signin" replace />
            )
          }
        />

        {/* Catch all - redirect to signin */}
        <Route path="*" element={<Navigate to="/signin" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
