import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import './Navbar.css'
import Settings from '../Settings/Settings'

function NavBar() {
  const navigate = useNavigate()
  const location = useLocation()
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  const isActive = (path) => {
    return location.pathname === path
  }

  return (
    <div className="navbar">
      <div className="navbar-icons">
        <button
          className={`navbar-icon view-icon ${isActive('/home') ? 'active' : ''}`}
          title="Home"
          onClick={() => navigate('/home')}
        >
          <span style={{ fontSize: '20px' }}>🏠</span>
        </button>
        <button
          className={`navbar-icon view-icon ${isActive('/inbox') ? 'active' : ''}`}
          title="Inbox"
          onClick={() => navigate('/inbox')}
        >
          <span style={{ fontSize: '20px' }}>📥</span>
        </button>
        <button
          className={`navbar-icon view-icon ${isActive('/dashboard') ? 'active' : ''}`}
          title="View All Tasks"
          onClick={() => navigate('/dashboard')}
        >
          <span style={{ fontSize: '20px' }}>✅</span>
        </button>
        <button
          className={`navbar-icon view-icon ${isActive('/projects') ? 'active' : ''}`}
          title="Projects"
          onClick={() => navigate('/projects')}
        >
          <span style={{ fontSize: '20px' }}>📁</span>
        </button>
        <button
          className={`navbar-icon view-icon ${isActive('/activity') ? 'active' : ''}`}
          title="Activity"
          onClick={() => navigate('/activity')}
        >
          <span style={{ fontSize: '20px' }}>📊</span>
        </button>
        <button
          className={`navbar-icon view-icon ${isActive('/trash') ? 'active' : ''}`}
          title="Trash"
          onClick={() => navigate('/trash')}
        >
          <span style={{ fontSize: '20px' }}>🗑️</span>
        </button>
      </div>

      <div className="navbar-bottom">
        <button
          className="navbar-icon settings-icon"
          title="Settings"
          onClick={() => setIsSettingsOpen(true)}
        >
          <span style={{ fontSize: '20px' }}>⚙️</span>
        </button>
        <button
          className="navbar-icon signout-icon"
          title="Sign Out"
          onClick={() => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/signin');
          }}
        >
          <span style={{ fontSize: '20px' }}>👋</span>
        </button>
      </div>

      <Settings
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  )
}

export default NavBar
