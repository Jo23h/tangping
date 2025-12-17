import './Navbar.css'
import ProjectWindow from './ProjectWindow/ProjectWindow'


function NavBar() {
  return (
    <div className="navbar">
      <div className="navbar-icons">
        <button className="navbar-icon" title="View All Tasks">
          📋
        </button>

        {/* <ProjectWindow /> */}

      </div>
    </div>
  )
}

export default NavBar
