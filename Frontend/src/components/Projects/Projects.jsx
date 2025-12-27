import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus } from '@phosphor-icons/react'
import './Projects.css'
import CreateProject from './CreateProject'
import ProjectContextMenu from './ProjectContextMenu'
import * as projectService from '../../services/projectService'

function Projects() {
  const [projects, setProjects] = useState([])
  const [archivedProjects, setArchivedProjects] = useState([])
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
      const data = await projectService.getAllProjects()
      // Filter out inbox and separate active from archived
      const nonInboxProjects = data.filter(project => !project.isInbox)
      const activeProjects = nonInboxProjects.filter(project => !project.isArchived)
      const archived = nonInboxProjects.filter(project => project.isArchived)
      setProjects(activeProjects)
      setArchivedProjects(archived)
      console.log('Fetched projects:', activeProjects, 'Archived:', archived)
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setIsLoading(false)
    }
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
        return '#d32f2f'
      case 'medium':
        return '#f57c00'
      case 'low':
        return '#1976d2'
      default:
        return '#9e9e9e'
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
                <th>Name</th>
                <th>Priority</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr
                  key={project._id}
                  className="project-row"
                  onClick={() => navigate(`/projects/${project._id}`)}
                  onContextMenu={(e) => handleContextMenu(e, project)}
                >
                  <td className="project-name-cell">{project.name}</td>
                  <td
                    className="project-priority-cell"
                    style={{ color: getPriorityColor(project.priority) }}
                  >
                    {getPriorityText(project.priority)}
                  </td>
                </tr>
              ))}
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
                <th>Name</th>
                <th>Priority</th>
              </tr>
            </thead>
            <tbody>
              {archivedProjects.map((project) => (
                <tr
                  key={project._id}
                  className="project-row archived"
                  onClick={() => navigate(`/projects/${project._id}`)}
                  onContextMenu={(e) => handleContextMenu(e, project)}
                >
                  <td className="project-name-cell">{project.name}</td>
                  <td
                    className="project-priority-cell"
                    style={{ color: getPriorityColor(project.priority) }}
                  >
                    {getPriorityText(project.priority)}
                  </td>
                </tr>
              ))}
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
