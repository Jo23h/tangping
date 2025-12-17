import './Navbar.css'
import ProjectWindow from './ProjectWindow/ProjectWindow'

function NavBar() {
  return (
    <div className="navbar">
      <div className="navbar-icons">
        <button className="navbar-icon" title="View All Tasks">
          📋
        </button>

        <button className="navbar-icon" title="Inbox">
          📧
        </button>

        <ProjectWindow />

        <button className="navbar-icon" title="Principles">
          #️⃣
        </button>
      </div>
    </div>
  )
}

export default NavBar
