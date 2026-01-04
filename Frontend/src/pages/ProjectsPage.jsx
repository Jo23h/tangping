import NavBar from '../components/Navbar/Navbar';
import Projects from '../components/Projects/Projects';

function ProjectsPage() {
  return (
    <div className="app-container">
      <NavBar />
      <Projects />
      <div className="memo-section-placeholder"></div>
    </div>
  );
}

export default ProjectsPage;
