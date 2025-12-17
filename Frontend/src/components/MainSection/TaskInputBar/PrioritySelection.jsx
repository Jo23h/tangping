import { useState, useRef, useEffect } from 'react'
import { taskPriorities } from './TaskSchema'
import './PrioritySelection.css'

function PrioritySelection({ selectedPriority, onPriorityChange }) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelectPriority = (priority) => {
    onPriorityChange(priority)
    setIsOpen(false)
  }

  const getPriorityIcon = () => {
    switch (selectedPriority) {
      case taskPriorities.HIGH:
        return '🔴'
      case taskPriorities.MEDIUM:
        return '🟠'
      case taskPriorities.LOW:
        return '🟡'
      default:
        return '🏳️'
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case taskPriorities.HIGH:
        return '#dc4c3e'
      case taskPriorities.MEDIUM:
        return '#ff9a14'
      case taskPriorities.LOW:
        return '#246fe0'
      default:
        return '#999'
    }
  }

  return (
    <div className="priority-dropdown" ref={dropdownRef}>
      <button
        className="priority-button"
        onClick={() => setIsOpen(!isOpen)}
        type="button"
        style={{ color: getPriorityColor(selectedPriority) }}
      >
        {getPriorityIcon()}
      </button>

      {isOpen && (
        <div className="priority-menu">
          <div
            className="priority-option"
            onClick={() => handleSelectPriority(taskPriorities.HIGH)}
          >
            <span style={{ color: getPriorityColor(taskPriorities.HIGH) }}>🔴</span>
            <span>High</span>
          </div>
          <div
            className="priority-option"
            onClick={() => handleSelectPriority(taskPriorities.MEDIUM)}
          >
            <span style={{ color: getPriorityColor(taskPriorities.MEDIUM) }}>🟠</span>
            <span>Medium</span>
          </div>
          <div
            className="priority-option"
            onClick={() => handleSelectPriority(taskPriorities.LOW)}
          >
            <span style={{ color: getPriorityColor(taskPriorities.LOW) }}>🟡</span>
            <span>Low</span>
          </div>
          <div
            className="priority-option"
            onClick={() => handleSelectPriority(taskPriorities.NONE)}
          >
            <span style={{ color: getPriorityColor(taskPriorities.NONE) }}>🏳️</span>
            <span>None</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default PrioritySelection
