import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import './index.css';

const EmployeeDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const employeeName = localStorage.getItem('employeeName') || 'Employee';
  const employeeId = localStorage.getItem('employeeId') || '';

  useEffect(() => {
    // Redirect if no token or id
    const token = Cookies.get('jwt');
    if (!token || !employeeId) {
      navigate('/login');
      return;
    }
    
    fetchTasks();
  }, [navigate, employeeId]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError('');
      // Assuming a GET request, but might require auth headers
      // If the backend filters by empid, we might pass it via query string
      const response = await fetch('https://ethara-ai-project.onrender.com/api/fetchtasks', {
        headers: {
          'Authorization': `Bearer ${Cookies.get('jwt')}`,
          'Content-Type': 'application/json'
        }
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch tasks');
      }
      
      // The user provided structure: { message: "...", data: [...] }
      if (result.data) {
        // Optionally filter by empid locally if backend returns all tasks
        const myTasks = result.data.filter(task => task.empid === employeeId);
        // If the backend already filters, this is just a safe-guard
        setTasks(result.data.length > 0 && result.data[0].empid ? myTasks : result.data);
      }
      
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error fetching tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (projectName, newStatus) => {
    try {
      // Optimistic UI update
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.projectName === projectName ? { ...task, status: newStatus } : task
        )
      );

      const response = await fetch('https://ethara-ai-project.onrender.com/api/taskstatus', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${Cookies.get('jwt')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          projectName: projectName,
          empid: employeeId,
          status: newStatus
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to update status');
      }
      
      // Show popup on successful change
      alert(`Successfully changed status to ${newStatus}`);
      
      // Optionally re-fetch tasks to ensure sync
      // fetchTasks();
      
    } catch (err) {
      console.error(err);
      alert(err.message || 'Failed to update status. Please try again.');
      // Revert UI on failure by re-fetching
      fetchTasks();
    }
  };

  const handleLogout = () => {
    Cookies.remove('jwt');
    localStorage.removeItem('employeeName');
    localStorage.removeItem('employeeId');
    navigate('/login');
  };

  // Format date utility
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className="dashboard-wrapper">
      <header className="dashboard-header">
        <div className="header-left">
          <span className="person-icon">👤</span>
          <h2 className="employee-name">{employeeName}</h2>
        </div>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </header>

      <main className="dashboard-main">
        <div className="tabs">
          <button className="tab active">Your Tasks</button>
        </div>

        <div className="tasks-container">
          {loading ? (
            <p className="loading-text">Loading tasks...</p>
          ) : error ? (
            <p className="error-text">{error}</p>
          ) : tasks.length === 0 ? (
            <p className="no-tasks-text">You have no tasks assigned.</p>
          ) : (
            <div className="tasks-grid">
              {tasks.map((task, index) => (
                <div key={index} className="task-card">
                  <h3 className="task-project-name">{task.projectName}</h3>
                  <div className="task-details">
                    <p><strong>Task:</strong> {task.task}</p>
                    <p><strong>Role:</strong> {task.role}</p>
                    <p><strong>Deadline:</strong> {task.deadline}</p>
                    <p><strong>Assigned:</strong> {formatDate(task.createdAt)}</p>
                  </div>
                  
                  <div className="task-action">
                    <label htmlFor={`status-${index}`}>Status:</label>
                    <select 
                      id={`status-${index}`}
                      value={task.status} 
                      onChange={(e) => handleStatusChange(task.projectName, e.target.value)}
                      className="status-dropdown"
                    >
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default EmployeeDashboard;
