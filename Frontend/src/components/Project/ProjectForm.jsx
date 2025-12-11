import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import './ProjectForm.css';
import Navbar from '../Navbar/Navbar';
import TextSection from '../TextSection/TextSection';
import PrincipleSection from '../PrincipleSection/PrincipleSection';
import TaskInput from './TaskSection/AddTask/TaskInput';
import MemoSection from '../MemoSection/MemoSection';

function ProjectForm() {
  const [projects, setProjects] = useState([]);

  const [selectedProject, setSelectedProject] = useState({
    id: 'new',
    name: 'New Project',
    content: ''
  });

  const [projectTitle, setProjectTitle] = useState('New Project');
  const [selectedItem, setSelectedItem] = useState(null);

  const handleCreateNewProject = () => {
    const newProject = {
      id: uuidv4(),
      name: 'New Project',
      tasks: []
    };
    setProjects([...projects, newProject]);
    setSelectedProject(newProject);
    setProjectTitle('New Project');
  };

  const handleSelectProject = (project) => {
    setSelectedProject(project);
    setProjectTitle(project.name);
  };

  const handleItemClick = (item) => {
    setSelectedItem({ ...item });
  };

  const handleMemoChange = (itemId, memoContent) => {
    // Update the selected item
    setSelectedItem(prev => ({
      ...prev,
      memo: memoContent
    }));
  };

  const handleMemoUpdate = (itemId, memoContent) => {
    // This will be called by TaskInput/TextSection to persist memo changes
    handleMemoChange(itemId, memoContent);
  };

  return (
    <div className='project-form-container'>
      {/* Navbar - left sidebar */}
      <Navbar />

      {/* Main content area */}
      <div className='project-form-main'>
        {/* Content area */}
        <div className='project-form-content'>
          {/* Project title row with menu */}
          <div className='project-form-title-row'>
            <input
              type='text'
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              className='project-form-title-input'
            />
            <span className='project-form-menu-icon'>⋯</span>
          </div>

          {/* Principle section - child component */}
          <PrincipleSection
            title='Principles'
            onItemClick={handleItemClick}
            selectedItem={selectedItem}
          />

          {/* Goal state section - child component */}
          <TextSection
            title='Goal state'
            onItemClick={handleItemClick}
            selectedItem={selectedItem}
          />

          {/* Current state section - child component */}
          <TextSection
            title='Current state'
            onItemClick={handleItemClick}
            selectedItem={selectedItem}
          />

          {/* Key Obstacles section - child component */}
          <TextSection
            title='Key Obstacles'
            onItemClick={handleItemClick}
            selectedItem={selectedItem}
          />

          {/* Task input - child component */}
          <TaskInput
            onItemClick={handleItemClick}
            selectedItem={selectedItem}
          />
        </div>
      </div>

      {/* Memo section - right sidebar */}
      <MemoSection
        selectedItem={selectedItem}
        onMemoChange={handleMemoChange}
      />
    </div>
  );
}

export default ProjectForm;
