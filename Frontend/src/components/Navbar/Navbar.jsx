import { useNavigate, useLocation } from 'react-router-dom'
import { SignOut } from '@phosphor-icons/react'
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
          className={`navbar-icon view-icon ${isActive('/inbox') ? 'active' : ''}`}
          title="Inbox"
          onClick={() => navigate('/inbox')}
        >
          <span className="chinese-char">收</span>
        </button>
        <button
          className={`navbar-icon view-icon ${isActive('/dashboard') ? 'active' : ''}`}
          title="View All Tasks"
          onClick={() => navigate('/dashboard')}
        >
          <span className="chinese-char">任</span>
        </button>
        <button
          className={`navbar-icon view-icon ${isActive('/projects') ? 'active' : ''}`}
          title="Projects"
          onClick={() => navigate('/projects')}
        >
          <span className="chinese-char">项</span>
        </button>
        <button
          className={`navbar-icon view-icon ${isActive('/trash') ? 'active' : ''}`}
          title="Trash"
          onClick={() => navigate('/trash')}
        >
          <span className="chinese-char">删</span>
        </button>
      </div>

      <div className="navbar-user">
        {user && user.profilePicture ? (
          <img
            src={user.profilePicture}
            alt={user.name}
            className="navbar-profile-pic"
            title={user.name}
          />
        ) : (
          user && <span className="navbar-username-initial">{user.name?.charAt(0) || 'U'}</span>
        )}
        <button className="navbar-signout" onClick={handleSignOut} title="Sign Out">
          <SignOut weight="light" size={24} color="#666" />
        </button>
      </div>
    </div>
  )
}

export default NavBar
