import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus } from '@phosphor-icons/react'
import './Projects.css'
import CreateProject from './CreateProject'
import ProjectContextMenu from './ProjectContextMenu'
import * as projectService from '../../services/projectService'
import * as taskService from '../../services/taskService'

function Projects() {
  const [projects, setProjects] = useState([])
  const [archivedProjects, setArchivedProjects] = useState([])
  const [tasks, setTasks] = useState([])
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [contextMenu, setContextMenu] = useState(null)
  const [editingProject, setEditingProject] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const [projectsData, tasksData] = await Promise.all([
        projectService.getAllProjects(),
        taskService.getAllTasks()
      ])

      // Filter out inbox and separate active from archived
      const nonInboxProjects = projectsData.filter(project => !project.isInbox)
      const activeProjects = nonInboxProjects.filter(project => !project.isArchived && !project.isDeleted)
      const archived = nonInboxProjects.filter(project => project.isArchived)

      // Sort active projects by priority, then by days since change
      const sorted = sortProjects(activeProjects)

      setProjects(sorted)
      setArchivedProjects(archived)
      setTasks(tasksData)
      console.log('Fetched projects:', sorted, 'Archived:', archived)
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const sortProjects = (projectsList) => {
    const priorityOrder = { high: 1, medium: 2, low: 3 }
    const now = new Date()

    return projectsList.sort((a, b) => {
      // First, sort by priority
      const priorityA = priorityOrder[a.priority] || 4
      const priorityB = priorityOrder[b.priority] || 4

      if (priorityA !== priorityB) {
        return priorityA - priorityB
      }

      // If same priority, sort by days since change (descending - higher days first)
      const lastModifiedA = a.lastModified || a.updatedAt || a.createdAt
      const lastModifiedB = b.lastModified || b.updatedAt || b.createdAt
      const daysSinceA = Math.floor((now - new Date(lastModifiedA)) / (1000 * 60 * 60 * 24))
      const daysSinceB = Math.floor((now - new Date(lastModifiedB)) / (1000 * 60 * 60 * 24))

      return daysSinceB - daysSinceA // Higher days first
    })
  }

  const handleCreateProject = async (projectData) => {
    try {
      console.log('Creating project with data:', projectData)
      const newProject = await projectService.createProject(projectData)
      console.log('Created project:', newProject)
      setProjects([newProject, ...projects])
    } catch (error) {
      console.error('Error creating project:', error)
      alert('Failed to create project: ' + error.message)
    }
  }

  const handleUpdateProject = async (projectId, projectData) => {
    try {
      const updatedProject = await projectService.updateProject(projectId, projectData)
      setProjects(projects.map(p => p._id === projectId ? updatedProject : p))
      setEditingProject(null)
      setIsCreateModalOpen(false)
    } catch (error) {
      console.error('Error updating project:', error)
      alert('Failed to update project: ' + error.message)
    }
  }

  const handleDeleteProject = async (projectId) => {
    try {
      await projectService.deleteProject(projectId)
      setProjects(projects.filter(p => p._id !== projectId))
      setArchivedProjects(archivedProjects.filter(p => p._id !== projectId))
    } catch (error) {
      console.error('Error deleting project:', error)
      alert('Failed to delete project: ' + error.message)
    }
  }

  const handleArchiveProject = async (projectId) => {
    try {
      await projectService.archiveProject(projectId)
      const project = projects.find(p => p._id === projectId)
      if (project) {
        setProjects(projects.filter(p => p._id !== projectId))
        setArchivedProjects([{ ...project, isArchived: true }, ...archivedProjects])
      }
    } catch (error) {
      console.error('Error archiving project:', error)
      alert('Failed to archive project: ' + error.message)
    }
  }

  const handleContextMenu = (event, project) => {
    event.preventDefault()
    event.stopPropagation()
    setContextMenu({
      x: event.clientX,
      y: event.clientY,
      project
    })
  }

  const handleEdit = () => {
    if (contextMenu) {
      setEditingProject(contextMenu.project)
      setIsCreateModalOpen(true)
    }
  }

  const handleDelete = () => {
    if (contextMenu) {
      handleDeleteProject(contextMenu.project._id)
    }
  }

  const handleArchive = () => {
    if (contextMenu) {
      handleArchiveProject(contextMenu.project._id)
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return '#ff6b6b'
      case 'medium':
        return '#4dabf7'
      case 'low':
        return null // No color for low priority
      default:
        return null
    }
  }

  const getPriorityText = (priority) => {
    switch (priority) {
      case 'high':
        return 'High'
      case 'medium':
        return 'Medium'
      case 'low':
        return 'Low'
      default:
        return 'None'
    }
  }

  if (isLoading) {
    return (
      <div className="projects-container">
        <div className="projects-content">
          <p>Loading projects...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="projects-container">
      <div className="projects-header">
        <h1>Projects</h1>
        <button className="create-project-btn" onClick={() => setIsCreateModalOpen(true)}>
          <Plus size={20} weight="bold" />
          <span>Create Project</span>
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="projects-empty">
          <p>No projects yet. Create your first project to get started!</p>
        </div>
      ) : (
        <>
          <h2 className="projects-section-title">Current Projects</h2>
          <table className="projects-table">
            <thead>
              <tr>
                <th>Project</th>
                <th>Priority</th>
                <th>Tasks (Due Soon / Upcoming / Total)</th>
                <th>Days Since Change</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => {
                const projectTasks = tasks.filter(t => t.projectId === project._id && !t.isDeleted && !t.completed);

                const now = new Date();
                const threeDays = 3 * 24 * 60 * 60 * 1000;
                const sevenDays = 7 * 24 * 60 * 60 * 1000;

                const dueSoon = projectTasks.filter(t => {
                  if (!t.dueDate) return false;
                  const dueDate = new Date(t.dueDate);
                  const timeUntilDue = dueDate - now;
                  return timeUntilDue >= 0 && timeUntilDue <= threeDays;
                }).length;

                const upcoming = projectTasks.filter(t => {
                  if (!t.dueDate) return false;
                  const dueDate = new Date(t.dueDate);
                  const timeUntilDue = dueDate - now;
                  return timeUntilDue > threeDays && timeUntilDue <= sevenDays;
                }).length;

                // Calculate days since last change
                const lastModified = project.lastModified || project.updatedAt || project.createdAt;
                const daysSinceChange = Math.floor((now - new Date(lastModified)) / (1000 * 60 * 60 * 24));

                return (
                  <tr
                    key={project._id}
                    className="project-row"
                    onClick={() => navigate(`/projects/${project._id}`)}
                    onContextMenu={(e) => handleContextMenu(e, project)}
                  >
                    <td className="project-name-cell">{project.name}</td>
                    <td className="project-priority-cell">
                      {getPriorityColor(project.priority) && (
                        <span
                          className="priority-badge"
                          style={{ backgroundColor: getPriorityColor(project.priority) }}
                        >
                          {getPriorityText(project.priority)}
                        </span>
                      )}
                    </td>
                    <td className="task-count-cell">
                      {dueSoon} / {upcoming} / {projectTasks.length}
                    </td>
                    <td className="days-since-change-cell">
                      {daysSinceChange === 0 ? 'Today' : `${daysSinceChange} day${daysSinceChange === 1 ? '' : 's'}`}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </>
      )}

      {archivedProjects.length > 0 && (
        <>
          <h2 className="projects-section-title">Archived Projects</h2>
          <table className="projects-table">
            <thead>
              <tr>
                <th>Project</th>
                <th>Priority</th>
                <th>Tasks (Due Soon / Upcoming / Total)</th>
                <th>Days Since Change</th>
              </tr>
            </thead>
            <tbody>
              {archivedProjects.map((project) => {
                const projectTasks = tasks.filter(t => t.projectId === project._id && !t.isDeleted && !t.completed);

                const now = new Date();
                const threeDays = 3 * 24 * 60 * 60 * 1000;
                const sevenDays = 7 * 24 * 60 * 60 * 1000;

                const dueSoon = projectTasks.filter(t => {
                  if (!t.dueDate) return false;
                  const dueDate = new Date(t.dueDate);
                  const timeUntilDue = dueDate - now;
                  return timeUntilDue >= 0 && timeUntilDue <= threeDays;
                }).length;

                const upcoming = projectTasks.filter(t => {
                  if (!t.dueDate) return false;
                  const dueDate = new Date(t.dueDate);
                  const timeUntilDue = dueDate - now;
                  return timeUntilDue > threeDays && timeUntilDue <= sevenDays;
                }).length;

                // Calculate days since last change
                const lastModified = project.lastModified || project.updatedAt || project.createdAt;
                const daysSinceChange = Math.floor((now - new Date(lastModified)) / (1000 * 60 * 60 * 24));

                return (
                  <tr
                    key={project._id}
                    className="project-row archived"
                    onClick={() => navigate(`/projects/${project._id}`)}
                    onContextMenu={(e) => handleContextMenu(e, project)}
                  >
                    <td className="project-name-cell">{project.name}</td>
                    <td className="project-priority-cell">
                      {getPriorityColor(project.priority) && (
                        <span
                          className="priority-badge"
                          style={{ backgroundColor: getPriorityColor(project.priority) }}
                        >
                          {getPriorityText(project.priority)}
                        </span>
                      )}
                    </td>
                    <td className="task-count-cell">
                      {dueSoon} / {upcoming} / {projectTasks.length}
                    </td>
                    <td className="days-since-change-cell">
                      {daysSinceChange === 0 ? 'Today' : `${daysSinceChange} day${daysSinceChange === 1 ? '' : 's'}`}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </>
      )}

      <CreateProject
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false)
          setEditingProject(null)
        }}
        onCreateProject={handleCreateProject}
        onUpdateProject={handleUpdateProject}
        editingProject={editingProject}
      />

      {contextMenu && (
        <ProjectContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu(null)}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onArchive={handleArchive}
        />
      )}
    </div>
  )
}

export default Projects
