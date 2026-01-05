import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { House, Tray, ListBullets, Folder, Trash, Gear, ChartLineUp } from '@phosphor-icons/react'
import './Navbar.css'
import Settings from '../Settings/Settings'
// import { signOut, getCurrentUser } from '../../services/authService'

function NavBar() {
  const navigate = useNavigate()
  const location = useLocation()
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  // const user = getCurrentUser()

  // const handleSignOut = () => {
  //   signOut()
  //   navigate('/signin')
  // }

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
          <House size={18} weight="regular" />
        </button>
        <button
          className={`navbar-icon view-icon ${isActive('/inbox') ? 'active' : ''}`}
          title="Inbox"
          onClick={() => navigate('/inbox')}
        >
          <Tray size={18} weight="regular" />
        </button>
        <button
          className={`navbar-icon view-icon ${isActive('/dashboard') ? 'active' : ''}`}
          title="View All Tasks"
          onClick={() => navigate('/dashboard')}
        >
          <ListBullets size={18} weight="regular" />
        </button>
        <button
          className={`navbar-icon view-icon ${isActive('/projects') ? 'active' : ''}`}
          title="Projects"
          onClick={() => navigate('/projects')}
        >
          <Folder size={18} weight="regular" />
        </button>
        <button
          className={`navbar-icon view-icon ${isActive('/activity') ? 'active' : ''}`}
          title="Activity"
          onClick={() => navigate('/activity')}
        >
          <ChartLineUp size={18} weight="regular" />
        </button>
        <button
          className={`navbar-icon view-icon ${isActive('/trash') ? 'active' : ''}`}
          title="Trash"
          onClick={() => navigate('/trash')}
        >
          <Trash size={18} weight="regular" />
        </button>
      </div>

      <div className="navbar-bottom">
        <button
          className="navbar-icon settings-icon"
          title="Settings"
          onClick={() => setIsSettingsOpen(true)}
        >
          <Gear size={18} weight="regular" />
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
          <span style={{ fontSize: '18px' }}>👋</span>
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
