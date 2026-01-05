import { useState, useEffect } from 'react'
import './Inbox.css'
import ViewTasks from '../MainSection/ViewTasks/ViewTasks'

function Inbox({ onTaskSelect, onTaskUpdate, onCreateMemo }) {
  return (
    <div className="inbox-container">
      <ViewTasks
        onTaskSelect={onTaskSelect}
        onTaskUpdate={onTaskUpdate}
        onCreateMemo={onCreateMemo}
        filterMode="inbox"
      />
    </div>
  )
}

export default Inbox
