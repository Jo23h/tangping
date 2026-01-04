import { useNavigate, useLocation } from 'react-router-dom'
import { CheckSquareOffset, Tray, Trash, Folders } from '@phosphor-icons/react'
import './Navbar.css'
import { signOut, getCurrentUser } from '../../services/authService'

function NavBar() {
  const navigate = useNavigate()
  const location = useLocation()
  const user = getCurrentUser()

  const handleSignOut = () => {
    signOut()
    navigate('/signin')
  }

  const isActive = (path) => {
    return location.pathname === path
  }

  return (
    <div className="navbar">
      <div className="navbar-icons">
        <button
          className={`navbar-icon ${isActive('/inbox') ? 'active' : ''}`}
          title="Inbox"
          onClick={() => navigate('/inbox')}
        >
          <Tray weight="regular" size={36} />
        </button>
        <button
          className={`navbar-icon ${isActive('/dashboard') ? 'active' : ''}`}
          title="All Tasks"
          onClick={() => navigate('/dashboard')}
        >
          <CheckSquareOffset weight="regular" size={36} />
        </button>
        <button
          className={`navbar-icon ${isActive('/projects') ? 'active' : ''}`}
          title="Projects"
          onClick={() => navigate('/projects')}
        >
          <Folders weight="regular" size={36} />
        </button>
        <button
          className={`navbar-icon ${isActive('/trash') ? 'active' : ''}`}
          title="Trash"
          onClick={() => navigate('/trash')}
        >
          <Trash weight="regular" size={36} />
        </button>
        <button
          className="navbar-icon navbar-profile"
          title={user?.name || 'Profile'}
          onClick={handleSignOut}
        >
          {user && user.profilePicture ? (
            <img
              src={user.profilePicture}
              alt={user.name}
              className="navbar-profile-pic"
            />
          ) : (
            user && <span className="navbar-username-initial">{user.name?.charAt(0) || 'U'}</span>
          )}
        </button>
      </div>
    </div>
  )
}

export default NavBar
