import { useState, useEffect } from 'react'
import { Flag, X } from '@phosphor-icons/react'
import './CreateProject.css'

function CreateProject({ isOpen, onClose, onCreateProject, onUpdateProject, editingProject }) {
  const [projectName, setProjectName] = useState('')
  const [priority, setPriority] = useState('none')
  const [isPriorityOpen, setIsPriorityOpen] = useState(false)

  // Set form values when editing
  useEffect(() => {
    if (editingProject) {
      setProjectName(editingProject.name)
      setPriority(editingProject.priority || 'none')
    } else {
      setProjectName('')
      setPriority('none')
    }
  }, [editingProject, isOpen])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (projectName.trim()) {
      if (editingProject) {
        await onUpdateProject(editingProject._id, { name: projectName.trim(), priority })
      } else {
        await onCreateProject({ name: projectName.trim(), priority })
      }
      setProjectName('')
      setPriority('none')
      onClose()
    }
  }

  const handleCancel = () => {
    setProjectName('')
    setPriority('none')
    onClose()
  }

  const getPriorityColor = (priorityLevel) => {
    switch (priorityLevel) {
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

  const getPriorityLabel = (priorityLevel) => {
    switch (priorityLevel) {
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

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={handleCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{editingProject ? 'Edit project' : 'Create project'}</h2>
          <button className="modal-close-btn" onClick={handleCancel}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-field">
            <label>Name</label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Project name"
              maxLength={120}
              autoFocus
            />
            <span className="char-count">{projectName.length}/120</span>
          </div>

          <div className="modal-field">
            <label>Priority</label>
            <div className="priority-select" onClick={() => setIsPriorityOpen(!isPriorityOpen)}>
              <div className="priority-display">
                <Flag weight="light" size={20} color={getPriorityColor(priority)} />
                <span>{getPriorityLabel(priority)}</span>
              </div>
              {isPriorityOpen && (
                <div className="priority-dropdown-modal" onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    className={`priority-option-modal ${priority === 'high' ? 'selected' : ''}`}
                    onClick={() => { setPriority('high'); setIsPriorityOpen(false); }}
                  >
                    <Flag weight="light" size={20} color="#d32f2f" />
                    <span>High</span>
                  </button>
                  <button
                    type="button"
                    className={`priority-option-modal ${priority === 'medium' ? 'selected' : ''}`}
                    onClick={() => { setPriority('medium'); setIsPriorityOpen(false); }}
                  >
                    <Flag weight="light" size={20} color="#f57c00" />
                    <span>Medium</span>
                  </button>
                  <button
                    type="button"
                    className={`priority-option-modal ${priority === 'low' ? 'selected' : ''}`}
                    onClick={() => { setPriority('low'); setIsPriorityOpen(false); }}
                  >
                    <Flag weight="light" size={20} color="#1976d2" />
                    <span>Low</span>
                  </button>
                  <button
                    type="button"
                    className={`priority-option-modal ${priority === 'none' ? 'selected' : ''}`}
                    onClick={() => { setPriority('none'); setIsPriorityOpen(false); }}
                  >
                    <Flag weight="light" size={20} color="#9e9e9e" />
                    <span>None</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={handleCancel}>
              Cancel
            </button>
            <button type="submit" className="btn-add" disabled={!projectName.trim()}>
              {editingProject ? 'Save' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateProject
