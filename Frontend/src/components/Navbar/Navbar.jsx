import { useState, useEffect, useRef } from 'react';
import './Navbar.css';

function Navbar({ projects, selectedProject, onCreateProject, onSelectProject, onDeleteProject, inboxTaskCount = 0, onViewTaskSelect, selectedView = 'inbox' }) {
  const [selectedItem, setSelectedItem] = useState('inbox');
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');

  const handleAddProject = (e) => {
    e.stopPropagation();
    setIsAddingProject(true);
  };

  const handleProjectNameSubmit = (e) => {
    if (e.key === 'Enter' && newProjectName.trim()) {
      onCreateProject(newProjectName.trim());
      setNewProjectName('');
      setIsAddingProject(false);
    } else if (e.key === 'Escape') {
      setNewProjectName('');
      setIsAddingProject(false);
    }
  };

  const handleProjectNameBlur = () => {
    if (newProjectName.trim()) {
      onCreateProject(newProjectName.trim());
    }
    setNewProjectName('');
    setIsAddingProject(false);
  };

  return (
    <div className='navbar'>
      {/* Main Navigation */}
      <nav className='navbar-main'>
        <div
          className={`navbar-item ${selectedView === 'viewtask' ? 'active' : ''}`}
          onClick={() => {
            setSelectedItem('viewtask');
            onViewTaskSelect();
          }}
        >
          <span className='navbar-icon'>👁️</span>
          <span className='navbar-label'>View Task</span>
        </div>

        <div
          className={`navbar-item ${selectedView === 'inbox' ? 'active' : ''}`}
          onClick={() => {
            setSelectedItem('inbox');
            onSelectProject(null);
          }}
        >
          <span className='navbar-icon'>📥</span>
          <span className='navbar-label'>Inbox</span>
          {inboxTaskCount > 0 && (
            <span className='navbar-count'>{inboxTaskCount}</span>
          )}
        </div>
      </nav>

      {/* Projects Section */}
      <div className='navbar-section'>
        <div className='navbar-section-header'>
          <span>Projects</span>
          <button className='navbar-add-btn' onClick={handleAddProject}>+</button>
        </div>

        {/* Project List */}
        {projects.map((project) => (
          <div
            key={project.id}
            className={`navbar-item ${selectedView === 'project' && selectedProject?.id === project.id ? 'active' : ''}`}
            onClick={() => onSelectProject(project)}
          >
            <span className='navbar-icon'>📋</span>
            <span className='navbar-label'>{project.name}</span>
            <button
              className='navbar-delete-btn'
              onClick={(e) => {
                e.stopPropagation();
                onDeleteProject(project.id);
              }}
            >
              ×
            </button>
          </div>
        ))}

        {/* Add Project Input */}
        {isAddingProject && (
          <div className='navbar-item navbar-input-item'>
            <span className='navbar-icon'>📋</span>
            <input
              type='text'
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              onKeyDown={handleProjectNameSubmit}
              onBlur={handleProjectNameBlur}
              placeholder='Project name'
              className='navbar-project-input'
              autoFocus
            />
          </div>
        )}

        {/* Empty State Placeholder */}
        {projects.length === 0 && !isAddingProject && (
          <div className='navbar-section-description'>
            Use lists to categorize and manage your tasks and notes
          </div>
        )}
      </div>

      {/* Principles Section */}
      <div className='navbar-section'>
        <div className='navbar-section-header'>Principles</div>
      </div>

      {/* Bottom Section */}
      <div className='navbar-bottom'>
        <div className='navbar-item'>
          <span className='navbar-icon'>✓</span>
          <span className='navbar-label'>Completed</span>
        </div>

        <div className='navbar-item'>
          <span className='navbar-icon'>🗑️</span>
          <span className='navbar-label'>Trash</span>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className='navbar-actions'>
        <button className='navbar-action-btn'>
          <span>🔄</span>
        </button>
        <button className='navbar-action-btn'>
          <span>🔔</span>
        </button>
        <button className='navbar-action-btn'>
          <span>?</span>
        </button>
      </div>
    </div>
  );
}

export default Navbar;
