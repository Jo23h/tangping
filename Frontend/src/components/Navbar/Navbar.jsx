import { useNavigate } from 'react-router-dom'
import './Navbar.css'
import ProjectWindow from './ProjectWindow/ProjectWindow'
import { signOut, getCurrentUser } from '../../services/authService'

function NavBar() {
  const navigate = useNavigate()
  const user = getCurrentUser()

  const handleSignOut = () => {
    signOut()
    navigate('/signin')
  }

  return (
    <div className="navbar">
      <div className="navbar-icons">
        <button className="navbar-icon" title="View All Tasks">
          📋
        </button>

        {/* <ProjectWindow /> */}

      </div>

      <div className="navbar-user">
        {user && <span className="navbar-username">{user.name}</span>}
        <button className="navbar-signout" onClick={handleSignOut} title="Sign Out">
          🚪
        </button>
      </div>
    </div>
  )
}

export default NavBar
