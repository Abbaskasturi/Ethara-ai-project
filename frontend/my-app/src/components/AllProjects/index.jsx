import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import './index.css';

const AllProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedProjectId, setExpandedProjectId] = useState(null);
  
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [addingToProject, setAddingToProject] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch('https://ethara-ai-project.onrender.com/auth/getallprojects', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${Cookies.get('jwt')}`,
          'Content-Type': 'application/json'
        }
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch projects');
      }
      
      if (result.projects) {
        setProjects(result.projects);
      } else if (result.data) {
        setProjects(result.data);
      } else if (Array.isArray(result)) {
        setProjects(result);
      } else {
        setProjects([]);
      }
      
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error fetching projects');
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (id) => {
    if (expandedProjectId === id) {
      setExpandedProjectId(null);
      setEditingEmployee(null);
      setAddingToProject(null);
    } else {
      setExpandedProjectId(id);
      setEditingEmployee(null);
      setAddingToProject(null);
    }
  };

  const handleDeleteEmployee = async (projectName, empid) => {
    if (!window.confirm(`Are you sure you want to remove employee ${empid} from ${projectName}?`)) return;
    
    try {
      const response = await fetch('https://ethara-ai-project.onrender.com/auth/deleteemp', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${Cookies.get('jwt')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ projectName, empid })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || `Error ${response.status} ${response.statusText}: Failed to delete employee`);
      alert(data.message || 'Employee removed successfully');
      fetchProjects();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleUpdateEmployee = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://ethara-ai-project.onrender.com/auth/empupdate', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${Cookies.get('jwt')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editingEmployee)
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || `Error ${response.status} ${response.statusText}: Failed to update employee`);
      alert(data.message || 'Employee updated successfully');
      setEditingEmployee(null);
      fetchProjects();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://ethara-ai-project.onrender.com/auth/addemp', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Cookies.get('jwt')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(addingToProject)
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || `Error ${response.status} ${response.statusText}: Failed to add employee`);
      alert(data.message || 'Employee added successfully');
      setAddingToProject(null);
      fetchProjects();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="projects-container">
      {loading ? (
        <p className="loading-text">Loading projects...</p>
      ) : error ? (
        <p className="error-text">{error}</p>
      ) : projects.length === 0 ? (
        <p className="no-data-text">No projects available.</p>
      ) : (
        <div className="projects-list">
          {projects.map((project, index) => {
            const id = project._id || index;
            const isExpanded = expandedProjectId === id;
            const projectName = project.projectName || project.name || `Project ${index + 1}`;
            
            return (
              <div key={id} className="project-list-item">
                <div className="project-header" onClick={() => toggleExpand(id)}>
                  <h3 className="project-name">{projectName}</h3>
                  <button className="view-details-btn">
                    {isExpanded ? '▼' : '👁️ View Details'}
                  </button>
                </div>
                
                {isExpanded && (
                  <div className="project-details">
                    <div className="project-actions-bar">
                      <h4>Assigned Employees</h4>
                      <button 
                        className="add-emp-btn"
                        onClick={() => setAddingToProject({
                          projectName: projectName,
                          name: '',
                          empid: '',
                          role: '',
                          task: '',
                          deadline: '',
                          status: 'pending'
                        })}
                      >
                        ➕ Add Employee
                      </button>
                    </div>

                    {addingToProject && addingToProject.projectName === projectName && (
                      <form onSubmit={handleAddEmployee} className="inline-form add-form">
                        <h5>Add New Employee to {projectName}</h5>
                        <div className="form-grid">
                          <input required placeholder="Name" value={addingToProject.name} onChange={e => setAddingToProject({...addingToProject, name: e.target.value})} />
                          <input required placeholder="Emp ID (e.g. E102)" value={addingToProject.empid} onChange={e => setAddingToProject({...addingToProject, empid: e.target.value})} />
                          <input required placeholder="Role (e.g. AI dev)" value={addingToProject.role} onChange={e => setAddingToProject({...addingToProject, role: e.target.value})} />
                          <input required placeholder="Task" value={addingToProject.task} onChange={e => setAddingToProject({...addingToProject, task: e.target.value})} />
                          <input required type="date" value={addingToProject.deadline} onChange={e => setAddingToProject({...addingToProject, deadline: e.target.value})} />
                          <select required value={addingToProject.status} onChange={e => setAddingToProject({...addingToProject, status: e.target.value})}>
                            <option value="pending">Pending</option>
                            <option value="in-progress">In Progress</option>
                            <option value="completed">Completed</option>
                          </select>
                        </div>
                        <div className="form-actions">
                          <button type="submit" className="save-btn">Save</button>
                          <button type="button" className="cancel-btn" onClick={() => setAddingToProject(null)}>Cancel</button>
                        </div>
                      </form>
                    )}

                    {(() => {
                      const employeesArray = project.employees || project.team || project.users || project.employee ||
                        Object.values(project).find(val => Array.isArray(val) && val.length > 0 && typeof val[0] === 'object') || [];

                      if (employeesArray.length === 0) {
                         return <p className="no-data-text" style={{padding: '10px 0', margin: 0}}>No employees assigned to this project.</p>;
                      }

                      return (
                        <div className="project-employees-grid">
                          {employeesArray.map((emp, i) => {
                            const isEditing = editingEmployee && editingEmployee.empid === emp.empid && editingEmployee.projectName === projectName;

                            if (isEditing) {
                              return (
                                <form key={`edit-${emp.empid || i}`} onSubmit={handleUpdateEmployee} className="project-employee-card edit-card">
                                  <div className="form-grid-small">
                                    <input required placeholder="Role" value={editingEmployee.role} onChange={e => setEditingEmployee({...editingEmployee, role: e.target.value})} />
                                    <input required placeholder="Task" value={editingEmployee.task} onChange={e => setEditingEmployee({...editingEmployee, task: e.target.value})} />
                                    <input required type="date" value={editingEmployee.deadline} onChange={e => setEditingEmployee({...editingEmployee, deadline: e.target.value})} />
                                    <select required value={editingEmployee.status} onChange={e => setEditingEmployee({...editingEmployee, status: e.target.value})}>
                                      <option value="pending">Pending</option>
                                      <option value="in-progress">In Progress</option>
                                      <option value="completed">Completed</option>
                                    </select>
                                  </div>
                                  <div className="form-actions mt-2">
                                    <button type="submit" className="save-btn small">Save</button>
                                    <button type="button" className="cancel-btn small" onClick={() => setEditingEmployee(null)}>Cancel</button>
                                  </div>
                                </form>
                              );
                            }

                            return (
                              <div key={emp._id || emp.empid || i} className="project-employee-card">
                                <div className="emp-header">
                                  <h4>{emp.name || emp.employeeName || 'Unknown'}</h4>
                                  <div className="emp-actions">
                                    <button 
                                      className="icon-btn edit-icon" 
                                      title="Edit Employee"
                                      onClick={() => setEditingEmployee({
                                        projectName: projectName,
                                        empid: emp.empid,
                                        role: emp.role || '',
                                        task: emp.task || '',
                                        deadline: emp.deadline ? new Date(emp.deadline).toISOString().split('T')[0] : '',
                                        status: emp.status || 'pending'
                                      })}
                                    >✏️</button>
                                    <button 
                                      className="icon-btn delete-icon" 
                                      title="Remove Employee"
                                      onClick={() => handleDeleteEmployee(projectName, emp.empid)}
                                    >🗑️</button>
                                  </div>
                                </div>
                                <div className="emp-details">
                                  <p><strong>Role:</strong> <span className="emp-role">{emp.role || emp.designation || 'Staff'}</span></p>
                                  {emp.empid && <p><strong>Emp ID:</strong> {emp.empid}</p>}
                                  {emp.task && <p><strong>Task:</strong> {emp.task}</p>}
                                  {emp.status && <p><strong>Status:</strong> <span className={`status-badge ${emp.status ? emp.status.toLowerCase() : 'pending'}`}>{emp.status || 'pending'}</span></p>}
                                  {emp.deadline && <p><strong>Deadline:</strong> {new Date(emp.deadline).toLocaleDateString()}</p>}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AllProjects;
