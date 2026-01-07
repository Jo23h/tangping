import { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import './ProjectView.css'
import ViewTasks from '../MainSection/ViewTasks/ViewTasks'
import * as projectService from '../../services/projectService'

function ProjectView({ onTaskSelect, onTaskUpdate, onCreateMemo }) {
  const { id } = useParams()
  const [project, setProject] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState('')
  const [showPriorityDropdown, setShowPriorityDropdown] = useState(false)
  const inputRef = useRef(null)
  const priorityDropdownRef = useRef(null)

  useEffect(() => {
    fetchProject()
  }, [id])

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (priorityDropdownRef.current && !priorityDropdownRef.current.contains(event.target)) {
        setShowPriorityDropdown(false)
      }
    }

    if (showPriorityDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showPriorityDropdown])

  const fetchProject = async () => {
    try {
      const data = await projectService.getProject(id)
      setProject(data)
      setEditName(data.name)
    } catch (error) {
      console.error('Error fetching project:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleNameClick = () => {
    setIsEditing(true)
  }

  const handleSave = async () => {
    if (editName.trim() && editName !== project.name) {
      try {
        const updatedProject = await projectService.updateProject(id, {
          name: editName.trim(),
          priority: project.priority
        })
        setProject(updatedProject)
      } catch (error) {
        console.error('Error updating project name:', error)
        setEditName(project.name)
      }
    } else {
      setEditName(project.name)
    }
    setIsEditing(false)
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSave()
    } else if (event.key === 'Escape') {
      setEditName(project.name)
      setIsEditing(false)
    }
  }

  const handleBlur = () => {
    handleSave()
  }

  const handlePriorityChange = async (newPriority) => {
    try {
      const updatedProject = await projectService.updateProject(id, {
        name: project.name,
        priority: newPriority
      })
      setProject(updatedProject)
      setShowPriorityDropdown(false)
    } catch (error) {
      console.error('Error updating project priority:', error)
      alert('Failed to update project priority')
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return '#ff6b6b'
      case 'medium':
        return '#4dabf7'
      case 'low':
        return '#9e9e9e'
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
        return 'Low'
    }
  }

  if (isLoading) {
    return (
      <div className="project-view-container">
        <p>Loading project...</p>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="project-view-container">
        <p>Project not found</p>
      </div>
    )
  }

  return (
    <div className="project-view-container">
      <div className="project-view-header">
        <div className="project-header-content">
          {isEditing ? (
            <input
              ref={inputRef}
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleBlur}
              className="project-name-input"
              maxLength={120}
            />
          ) : (
            <h1 onClick={handleNameClick} className="project-name">
              {project.name}
            </h1>
          )}
          <div className="project-priority-selector" ref={priorityDropdownRef}>
            <button
              className="priority-badge-btn"
              style={{ backgroundColor: getPriorityColor(project.priority || 'low') }}
              onClick={() => setShowPriorityDropdown(!showPriorityDropdown)}
              title="Change priority"
            >
              {getPriorityText(project.priority || 'low')}
            </button>
            {showPriorityDropdown && (
              <div className="priority-dropdown">
                <button
                  className="priority-dropdown-item"
                  onClick={() => handlePriorityChange('high')}
                >
                  <span className="priority-badge" style={{ backgroundColor: '#ff6b6b' }}>High</span>
                </button>
                <button
                  className="priority-dropdown-item"
                  onClick={() => handlePriorityChange('medium')}
                >
                  <span className="priority-badge" style={{ backgroundColor: '#4dabf7' }}>Medium</span>
                </button>
                <button
                  className="priority-dropdown-item"
                  onClick={() => handlePriorityChange('low')}
                >
                  <span className="priority-badge" style={{ backgroundColor: '#9e9e9e' }}>Low</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <ViewTasks
        projectId={id}
        onTaskSelect={onTaskSelect}
        onTaskUpdate={onTaskUpdate}
        onCreateMemo={onCreateMemo}
      />
    </div>
  )
}

export default ProjectView
