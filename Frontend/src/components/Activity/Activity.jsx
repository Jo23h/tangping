import { useState, useEffect, useRef, useCallback } from 'react';
import './Activity.css';
import * as activityService from '../../services/activityService';
import * as projectService from '../../services/projectService';

function Activity() {
  const [activities, setActivities] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [skip, setSkip] = useState(0);
  const observerTarget = useRef(null);

  const LIMIT = 20;

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    // Reset and fetch when category changes
    setActivities([]);
    setSkip(0);
    setHasMore(true);
    fetchActivities(selectedCategory, 0);
  }, [selectedCategory]);

  const fetchProjects = async () => {
    try {
      const projectsData = await projectService.getAllProjects();
      setProjects(projectsData.filter(p => !p.isInbox && !p.isDeleted && !p.isArchived));
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const fetchActivities = async (category, currentSkip) => {
    try {
      setLoading(true);
      const data = await activityService.getActivities(category, LIMIT, currentSkip);

      if (currentSkip === 0) {
        setActivities(data.activities);
      } else {
        setActivities(prev => [...prev, ...data.activities]);
      }

      setHasMore(data.hasMore);
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      const newSkip = skip + LIMIT;
      setSkip(newSkip);
      fetchActivities(selectedCategory, newSkip);
    }
  }, [loading, hasMore, skip, selectedCategory]);

  // Intersection Observer for infinite scrolling
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [loadMore, hasMore, loading]);

  const getActivityIcon = (type) => {
    switch (type) {
      case 'task_created':
        return '✨';
      case 'task_completed':
        return '✅';
      case 'task_uncompleted':
        return '↩️';
      case 'task_updated':
        return '✏️';
      case 'task_deleted':
        return '🗑️';
      case 'project_created':
        return '📁';
      case 'project_updated':
        return '📝';
      case 'project_archived':
        return '📦';
      default:
        return '📌';
    }
  };

  const getActivityText = (activity) => {
    const projectInfo = activity.projectName ? ` in ${activity.projectName}` : ' in Inbox';

    switch (activity.type) {
      case 'task_created':
        return (
          <>
            Created task <span className="activity-task-name">"{activity.taskText}"</span>{projectInfo}
          </>
        );
      case 'task_completed':
        return (
          <>
            Completed task <span className="activity-task-name">"{activity.taskText}"</span>{projectInfo}
          </>
        );
      case 'task_uncompleted':
        return (
          <>
            Reopened task <span className="activity-task-name">"{activity.taskText}"</span>{projectInfo}
          </>
        );
      case 'task_updated':
        return (
          <>
            Updated task <span className="activity-task-name">"{activity.taskText}"</span>{projectInfo}
          </>
        );
      case 'task_deleted':
        return (
          <>
            Deleted task <span className="activity-task-name">"{activity.taskText}"</span>{projectInfo}
          </>
        );
      case 'project_created':
        return `Created project "${activity.projectName}"`;
      case 'project_updated':
        return `Updated project "${activity.projectName}"`;
      case 'project_archived':
        return `Archived project "${activity.projectName}"`;
      default:
        return 'Unknown activity';
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 8) return `${diffDays}d ago`;

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const groupActivitiesByDay = (activities) => {
    const groups = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    activities.forEach(activity => {
      const activityDate = new Date(activity.createdAt);
      activityDate.setHours(0, 0, 0, 0);

      const diffDays = Math.floor((today - activityDate) / 86400000);

      let label;
      if (diffDays === 0) label = 'Today';
      else if (diffDays === 1) label = 'Yesterday';
      else label = activityDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

      if (!groups[label]) {
        groups[label] = [];
      }
      groups[label].push(activity);
    });

    return groups;
  };

  const groupedActivities = groupActivitiesByDay(activities);

  return (
    <div className="activity-container">
      <div className="activity-header">
        <h1>Activity</h1>
      </div>

      <div className="activity-filters">
        <button
          className={`filter-button ${selectedCategory === 'all' ? 'active' : ''}`}
          onClick={() => setSelectedCategory('all')}
        >
          All
        </button>
        <button
          className={`filter-button ${selectedCategory === 'inbox' ? 'active' : ''}`}
          onClick={() => setSelectedCategory('inbox')}
        >
          Inbox
        </button>
        {projects.map(project => (
          <button
            key={project._id}
            className={`filter-button ${selectedCategory === project._id ? 'active' : ''}`}
            onClick={() => setSelectedCategory(project._id)}
          >
            {project.name}
          </button>
        ))}
      </div>

      <div className="activity-content">
        {loading && activities.length === 0 ? (
          <div className="activity-loading">Loading activities...</div>
        ) : activities.length === 0 ? (
          <div className="activity-empty">
            <p>No activities found</p>
            <p className="activity-empty-hint">Start completing tasks to see your activity here!</p>
          </div>
        ) : (
          <>
            {Object.entries(groupedActivities).map(([day, dayActivities]) => (
              <div key={day} className="activity-day-group">
                <h3 className="activity-day-label">{day}</h3>
                <div className="activity-list">
                  {dayActivities.map((activity, index) => (
                    <div key={`${activity._id}-${index}`} className="activity-item">
                      <span className="activity-icon">{getActivityIcon(activity.type)}</span>
                      <div className="activity-details">
                        <p className="activity-text">{getActivityText(activity)}</p>
                        <span className="activity-time">{formatTime(activity.createdAt)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {hasMore && (
              <div ref={observerTarget} className="activity-loading-more">
                {loading && 'Loading more...'}
              </div>
            )}

            {!hasMore && activities.length > 0 && (
              <div className="activity-end">
                <p>That's all your activity from the last 8 days</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Activity;
