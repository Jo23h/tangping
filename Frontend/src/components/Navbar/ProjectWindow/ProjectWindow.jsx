import { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import './ProjectWindow.css';

function ProjectWindow() {
  const [isOpen, setIsOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const menuRef = useRef(null);

  const onCreateProject = (projectName) => {
    const newProject = {
      id: uuidv4(),
      name: projectName || 'New Project',
    };
    setProjects([...projects, newProject]);
    setSelectedProject(newProject);
  };

  const onSelectProject = (project) => {
    setSelectedProject(project);
  };

  const onDeleteProject = (projectId) => {
    const updatedProjects = projects.filter(p => p.id !== projectId);
    setProjects(updatedProjects);
    if (selectedProject?.id === projectId) {
      setSelectedProject(null);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="project-window-wrapper" ref={menuRef}>
      <button
        className={`navbar-icon ${selectedProject ? 'active' : ''}`}
        title="Projects"
        onClick={() => setIsOpen(!isOpen)}
      >
        📂
      </button>

      {isOpen && (
        <div className='projects-menu' onClick={(e) => e.stopPropagation()}>
          <div className='projects-menu-header'>
            <span>Projects</span>
            <button
              className='projects-add-btn'
              onClick={() => {
                const name = prompt('Project name:');
                if (name?.trim()) {
                  onCreateProject(name.trim());
                }
              }}
            >
              +
            </button>
          </div>
          <div className='projects-menu-list'>
            {projects.map((project) => (
              <div
                key={project.id}
                className={`projects-menu-item ${selectedProject?.id === project.id ? 'active' : ''}`}
                onClick={() => {
                  onSelectProject(project);
                  setIsOpen(false);
                }}
              >
                <span className='project-name'>{project.name}</span>
                <button
                  className='project-delete-btn'
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteProject(project.id);
                  }}
                >
                  ×
                </button>
              </div>
            ))}
            {projects.length === 0 && (
              <div className='projects-menu-empty'>No projects yet</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProjectWindow;
