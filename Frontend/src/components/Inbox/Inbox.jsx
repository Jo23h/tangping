import { useState, useEffect } from 'react'
import './Inbox.css'
import ViewTasks from '../MainSection/ViewTasks/ViewTasks'

function Inbox({ onTaskSelect, onTaskUpdate }) {
  return (
    <div className="inbox-container">
      <ViewTasks
        onTaskSelect={onTaskSelect}
        onTaskUpdate={onTaskUpdate}
        filterMode="inbox"
      />
    </div>
  )
}

export default Inbox
