import { useState, useEffect, useRef } from 'react';
import NavBar from '../components/NavBar/Navbar';
import MainSection from '../components/MainSection/MainSection';
import GoogleDocViewer from '../components/GoogleDocViewer/GoogleDocViewer';
import { createOrGetGoogleDoc } from '../services/googleDocsService';
import * as taskService from '../services/taskService';

function DashboardPage() {
  const [selectedTask, setSelectedTask] = useState(null);
  const [middleWidth, setMiddleWidth] = useState(60); // percentage
  const [isResizing, setIsResizing] = useState(false);
  const containerRef = useRef(null);

  const handleTaskUpdate = (updatedTask) => {
    // Update the selected task if it's the one being edited
    if (selectedTask && selectedTask._id === updatedTask._id) {
      setSelectedTask(updatedTask);
    }
  };

  const handleCreateMemo = async (taskId) => {
    try {
      const task = await taskService.getTaskById(taskId);

      if (task.googleDocUrl) {
        // If memo already exists, just select the task
        setSelectedTask(task);
      } else {
        // Create new Google Doc
        const docUrl = await createOrGetGoogleDoc(taskId, task.text);
        const updatedTask = { ...task, googleDocUrl: docUrl };
        setSelectedTask(updatedTask);
        handleTaskUpdate(updatedTask);
      }
    } catch (error) {
      alert(error.message || 'Failed to create memo');
    }
  };

  const handleMouseDown = (e) => {
    setIsResizing(true);
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (!isResizing || !containerRef.current) return;

    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();
    const navbarWidth = 48; // navbar width
    const newWidth = ((e.clientX - navbarWidth) / (containerRect.width - navbarWidth)) * 100;

    // Constrain between 30% and 80%
    if (newWidth >= 30 && newWidth <= 80) {
      setMiddleWidth(newWidth);
    }
  };

  const handleMouseUp = () => {
    setIsResizing(false);
  };

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isResizing]);

  return (
    <div className="app-container" ref={containerRef}>
      <NavBar />
      <div className="main-section-resizable" style={{ width: `${middleWidth}%` }}>
        <MainSection
          onTaskSelect={setSelectedTask}
          onTaskUpdate={handleTaskUpdate}
          onCreateMemo={handleCreateMemo}
        />
      </div>
      <div
        className="resize-handle"
        onMouseDown={handleMouseDown}
      />
      <div className="google-doc-section" style={{ width: `${100 - middleWidth}%` }}>
        <GoogleDocViewer
          googleDocUrl={selectedTask?.googleDocUrl}
          taskText={selectedTask?.text}
        />
      </div>
    </div>
  );
}

export default DashboardPage;
