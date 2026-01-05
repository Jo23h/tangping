import ViewTasks from './ViewTasks/ViewTasks'

function MainSection({ onTaskSelect, onTaskUpdate, onCreateMemo }) {
  return (
    <div className="main-section">
      <ViewTasks
        onTaskSelect={onTaskSelect}
        onTaskUpdate={onTaskUpdate}
        onCreateMemo={onCreateMemo}
      />
    </div>
  )
}

export default MainSection
