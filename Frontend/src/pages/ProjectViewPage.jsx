import { useState, useEffect, useRef } from 'react';
import NavBar from '../components/Navbar/Navbar';
import ProjectView from '../components/Projects/ProjectView';
import GoogleDocViewer from '../components/GoogleDocViewer/GoogleDocViewer';
import { createOrGetGoogleDoc } from '../services/googleDocsService';
import * as taskService from '../services/taskService';

function ProjectViewPage() {
  const [selectedTask, setSelectedTask] = useState(null);
  const [middleWidth, setMiddleWidth] = useState(60);
  const [isResizing, setIsResizing] = useState(false);
  const containerRef = useRef(null);

  const handleTaskUpdate = (updatedTask) => {
    if (selectedTask && selectedTask._id === updatedTask._id) {
      setSelectedTask(updatedTask);
    }
  };

  const handleCreateMemo = async (taskId) => {
    try {
      const task = await taskService.getTaskById(taskId);
      if (task.googleDocUrl) {
        setSelectedTask(task);
      } else {
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
    const navbarWidth = 48;
    const newWidth = ((e.clientX - navbarWidth) / (containerRect.width - navbarWidth)) * 100;
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
        <ProjectView
          onTaskSelect={setSelectedTask}
          onTaskUpdate={handleTaskUpdate}
          onCreateMemo={handleCreateMemo}
        />
      </div>
      <div className="resize-handle" onMouseDown={handleMouseDown} />
      <div className="google-doc-section" style={{ width: `${100 - middleWidth}%` }}>
        <GoogleDocViewer
          googleDocUrl={selectedTask?.googleDocUrl}
          taskText={selectedTask?.text}
        />
      </div>
    </div>
  );
}

export default ProjectViewPage;
