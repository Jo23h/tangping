import { useState, useRef, useEffect } from 'react'
import './PrioritySelection.css'

function PrioritySelection({ selectedPriority, onPriorityChange }) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

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
      case 'high':
        return '🔴'
      case 'medium':
        return '🟠'
      case 'low':
        return '🟡'
      default:
        return '🏳️'
    }
  }

  return (
    <div className="priority-dropdown" ref={dropdownRef}>
      <button
        className="priority-button"
        onClick={() => setIsOpen(!isOpen)}
        type="button"
      >
        {getPriorityIcon()}
      </button>

      {isOpen && (
        <div className="priority-menu">
          <div
            className="priority-option"
            onClick={() => handleSelectPriority('high')}
          >
            <span>🔴</span>
            <span>High</span>
          </div>
          <div
            className="priority-option"
            onClick={() => handleSelectPriority('medium')}
          >
            <span>🟠</span>
            <span>Medium</span>
          </div>
          <div
            className="priority-option"
            onClick={() => handleSelectPriority('low')}
          >
            <span>🟡</span>
            <span>Low</span>
          </div>
          <div
            className="priority-option"
            onClick={() => handleSelectPriority('none')}
          >
            <span>🏳️</span>
            <span>None</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default PrioritySelection
