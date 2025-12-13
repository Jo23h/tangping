import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import './ProjectForm.css';
import Navbar from '../Navbar/Navbar';
import TextSection from '../TextSection/TextSection';
import PrincipleSection from '../PrincipleSection/PrincipleSection';
import TaskInput from './TaskSection/AddTask/TaskInput';
import MemoSection from '../MemoSection/MemoSection';
import InboxPage from '../InboxPage/InboxPage';
import ViewTask from '../ViewTask/ViewTask';
import PrinciplesPage from '../PrinciplesPage/PrinciplesPage';

function ProjectForm() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectTitle, setProjectTitle] = useState('Inbox');
  const [selectedItem, setSelectedItem] = useState(null);
  const [inboxTaskCount, setInboxTaskCount] = useState(0);
  const [selectedView, setSelectedView] = useState('inbox'); // 'inbox', 'viewtask', 'principles', or 'project'

  // Centralized task management
  const [inboxTasks, setInboxTasks] = useState([]);
  const [projectTasks, setProjectTasks] = useState({}); // { projectId: [tasks] }

  // Centralized principle management
  const [projectPrinciples, setProjectPrinciples] = useState({}); // { projectId: [principles] }

  const handleCreateNewProject = (projectName) => {
    const newProject = {
      id: uuidv4(),
      name: projectName || 'New Project',
      tasks: []
    };
    setProjects([...projects, newProject]);
    setSelectedProject(newProject);
    setProjectTitle(newProject.name);
    setSelectedView('project');
    // Initialize empty task and principle arrays for new project
    setProjectTasks(prev => ({ ...prev, [newProject.id]: [] }));
    setProjectPrinciples(prev => ({ ...prev, [newProject.id]: [] }));
  };

  const handleSelectProject = (project) => {
    if (project === null) {
      // Selecting Inbox
      setSelectedProject(null);
      setProjectTitle('Inbox');
      setSelectedView('inbox');
    } else {
      // Selecting a project
      setSelectedProject(project);
      setProjectTitle(project.name);
      setSelectedView('project');
    }
  };

  const handleProjectTitleChange = (newTitle) => {
    setProjectTitle(newTitle);
    if (selectedProject) {
      const updatedProjects = projects.map(p =>
        p.id === selectedProject.id ? { ...p, name: newTitle } : p
      );
      setProjects(updatedProjects);
      setSelectedProject({ ...selectedProject, name: newTitle });
    }
  };

  const handleDeleteProject = (projectId) => {
    const updatedProjects = projects.filter(p => p.id !== projectId);
    setProjects(updatedProjects);
    // Remove project tasks and principles
    const updatedProjectTasks = { ...projectTasks };
    delete updatedProjectTasks[projectId];
    setProjectTasks(updatedProjectTasks);
    const updatedProjectPrinciples = { ...projectPrinciples };
    delete updatedProjectPrinciples[projectId];
    setProjectPrinciples(updatedProjectPrinciples);
    // If the deleted project was selected, clear selection (go to Inbox)
    if (selectedProject?.id === projectId) {
      setSelectedProject(null);
      setProjectTitle('Inbox');
      setSelectedView('inbox');
    }
  };

  const handleItemClick = (item) => {
    setSelectedItem({ ...item });
  };

  const handleMemoChange = (itemId, memoContent) => {
    // Update the selected item with memo and timestamp
    setSelectedItem(prev => ({
      ...prev,
      memo: memoContent,
      memoLastModified: new Date().toISOString()
    }));
  };

  const handleTitleChange = (itemId, newTitle) => {
    // Update the selected item's title (text or tag property)
    setSelectedItem(prev => {
      if (prev.tag) {
        // It's a principle, update the tag
        return { ...prev, tag: newTitle };
      } else {
        // It's a note or task, update the text
        return { ...prev, text: newTitle };
      }
    });
  };

  const handleMemoUpdate = (itemId, memoContent) => {
    // This will be called by TaskInput/TextSection to persist memo changes
    handleMemoChange(itemId, memoContent);
  };

  const handleViewTaskSelect = () => {
    setSelectedView('viewtask');
    setSelectedProject(null);
    setProjectTitle('View Task');
  };

  const handlePrinciplesViewSelect = () => {
    setSelectedView('principles');
    setSelectedProject(null);
    setProjectTitle('Principles');
  };

  // Get all tasks across all projects and inbox
  const getAllTasks = () => {
    const allTasks = [...inboxTasks];
    Object.values(projectTasks).forEach(tasks => {
      allTasks.push(...tasks);
    });
    return allTasks;
  };

  // Get all principles across all projects
  const getAllPrinciples = () => {
    const allPrinciples = [];
    Object.entries(projectPrinciples).forEach(([projectId, principles]) => {
      const principlesWithProject = principles.map(p => ({ ...p, projectId }));
      allPrinciples.push(...principlesWithProject);
    });
    return allPrinciples;
  };

  // Update inbox task count
  const handleInboxTasksChange = (tasks) => {
    setInboxTasks(tasks);
    const activeCount = tasks.filter(task => !task.completed).length;
    setInboxTaskCount(activeCount);
  };

  // Update project tasks
  const handleProjectTasksChange = (projectId, tasks) => {
    setProjectTasks(prev => ({ ...prev, [projectId]: tasks }));
  };

  // Update project principles
  const handleProjectPrinciplesChange = (projectId, principles) => {
    setProjectPrinciples(prev => ({ ...prev, [projectId]: principles }));
  };

  // Handle task changes from ViewTask (update source based on projectId)
  const handleViewTaskChange = (updatedTasks) => {
    // Separate tasks by their projectId
    const inboxTasksUpdated = updatedTasks.filter(task => task.projectId === null);
    const projectTasksMap = {};

    updatedTasks.forEach(task => {
      if (task.projectId !== null) {
        if (!projectTasksMap[task.projectId]) {
          projectTasksMap[task.projectId] = [];
        }
        projectTasksMap[task.projectId].push(task);
      }
    });

    // Update inbox tasks
    setInboxTasks(inboxTasksUpdated);
    const activeCount = inboxTasksUpdated.filter(task => !task.completed).length;
    setInboxTaskCount(activeCount);

    // Update project tasks
    Object.keys(projectTasksMap).forEach(projectId => {
      setProjectTasks(prev => ({ ...prev, [projectId]: projectTasksMap[projectId] }));
    });
  };

  // Handle principle changes from PrinciplesPage (update source based on projectId)
  const handleViewPrinciplesChange = (updatedPrinciples) => {
    // Separate principles by their projectId
    const projectPrinciplesMap = {};

    updatedPrinciples.forEach(principle => {
      if (principle.projectId) {
        if (!projectPrinciplesMap[principle.projectId]) {
          projectPrinciplesMap[principle.projectId] = [];
        }
        // Remove the projectId property before storing
        const { projectId, ...principleData } = principle;
        projectPrinciplesMap[principle.projectId].push(principleData);
      }
    });

    // Update project principles
    Object.keys(projectPrinciplesMap).forEach(projectId => {
      setProjectPrinciples(prev => ({ ...prev, [projectId]: projectPrinciplesMap[projectId] }));
    });
  };

  return (
    <div className='project-form-container'>
      {/* Navbar - left sidebar */}
      <Navbar
        projects={projects}
        selectedProject={selectedProject}
        onCreateProject={handleCreateNewProject}
        onSelectProject={handleSelectProject}
        onDeleteProject={handleDeleteProject}
        inboxTaskCount={inboxTaskCount}
        onViewTaskSelect={handleViewTaskSelect}
        onPrinciplesViewSelect={handlePrinciplesViewSelect}
        selectedView={selectedView}
      />

      {/* Main content area */}
      <div className='project-form-main'>
        {/* Content area */}
        <div className='project-form-content'>
          {/* Project title row with menu */}
          <div className='project-form-title-row'>
            <input
              type='text'
              value={projectTitle}
              onChange={(e) => handleProjectTitleChange(e.target.value)}
              className='project-form-title-input'
              readOnly={!selectedProject}
            />
            <span className='project-form-menu-icon'>⋯</span>
          </div>

          {/* Conditional rendering: ViewTask, Principles, Inbox, or Project page */}
          {selectedView === 'viewtask' ? (
            /* View Task page - all tasks across projects and inbox */
            <ViewTask
              onItemClick={handleItemClick}
              selectedItem={selectedItem}
              tasks={getAllTasks()}
              onTasksChange={handleViewTaskChange}
            />
          ) : selectedView === 'principles' ? (
            /* Principles page - all principles across projects */
            <PrinciplesPage
              onItemClick={handleItemClick}
              selectedItem={selectedItem}
              principles={getAllPrinciples()}
              onPrinciplesChange={handleViewPrinciplesChange}
            />
          ) : selectedView === 'inbox' ? (
            /* Inbox page - only inbox tasks */
            <InboxPage
              onItemClick={handleItemClick}
              selectedItem={selectedItem}
              tasks={inboxTasks}
              onTasksChange={handleInboxTasksChange}
            />
          ) : (
            /* Project page - all sections */
            <>
              {/* Principle section - child component */}
              <PrincipleSection
                title='Principles'
                onItemClick={handleItemClick}
                selectedItem={selectedItem}
                principles={projectPrinciples[selectedProject?.id] || []}
                onPrinciplesChange={(principles) => handleProjectPrinciplesChange(selectedProject?.id, principles)}
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
                tasks={projectTasks[selectedProject?.id] || []}
                onTasksChange={(tasks) => handleProjectTasksChange(selectedProject?.id, tasks)}
                projectId={selectedProject?.id}
              />
            </>
          )}
        </div>
      </div>

      {/* Memo section - right sidebar */}
      <MemoSection
        selectedItem={selectedItem}
        onMemoChange={handleMemoChange}
        onTitleChange={handleTitleChange}
      />
    </div>
  );
}

export default ProjectForm;
