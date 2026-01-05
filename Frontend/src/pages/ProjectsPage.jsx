import NavBar from '../components/Navbar/Navbar';
import Projects from '../components/Projects/Projects';

function ProjectsPage() {
  return (
    <div className="app-container">
      <NavBar />
      <div style={{ flex: 1, overflow: 'auto' }}>
        <Projects />
      </div>
    </div>
  );
}

export default ProjectsPage;
