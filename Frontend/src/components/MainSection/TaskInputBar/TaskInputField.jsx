import DatePicker from "./DatePicker"
import PrioritySelection from "./PrioritySelection"

function TaskInputField({
  inputValue,
  selectedDate,
  selectedPriority,
  onInputChange,
  onDateChange,
  onPriorityChange,
  onAddTask,
  onKeyDown
}) {
  return (
    <div className="task-input-container">
      <button className="task-plus-button" onClick={onAddTask}>
        +
      </button>
      <input
        type="text"
        className="task-input"
        placeholder="Add a task"
        value={inputValue}
        onChange={onInputChange}
        onKeyDown={onKeyDown}
      />
      <DatePicker
        selectedDate={selectedDate}
        onDateChange={onDateChange}
      />
      <PrioritySelection
        selectedPriority={selectedPriority}
        onPriorityChange={onPriorityChange}
      />
    </div>
  )
}

export default TaskInputField
