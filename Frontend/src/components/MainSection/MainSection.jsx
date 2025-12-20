import ViewTasks from './ViewTasks/ViewTasks'

function MainSection({ onTaskSelect, onTaskUpdate }) {
  return (
    <div className="main-section">
      <ViewTasks
        onTaskSelect={onTaskSelect}
        onTaskUpdate={onTaskUpdate}
      />
    </div>
  )
}

export default MainSection
