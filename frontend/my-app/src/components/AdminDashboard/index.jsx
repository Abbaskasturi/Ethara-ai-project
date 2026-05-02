import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AllEmployees from '../AllEmployees';
import AllProjects from '../AllProjects';
import './index.css';

const AdminDashboard = () => {
  const [showForm, setShowForm] = useState(false);
  const [showEmployees, setShowEmployees] = useState(false);
  const [showProjects, setShowProjects] = useState(true);
  const [showCreateProject, setShowCreateProject] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    empid: '',
    role: ''
  });

  const [projectFormData, setProjectFormData] = useState({
    projectName: '',
    name: '',
    empid: '',
    role: '',
    task: '',
    deadline: ''
  });

  const [loading, setLoading] = useState(false);
  
  
  const [employeeError, setEmployeeError] = useState('');
  const [employeeSuccess, setEmployeeSuccess] = useState('');
  
  const [projectError, setProjectError] = useState('');
  const [projectSuccess, setProjectSuccess] = useState('');

  const navigate = useNavigate();
  const adminEmail = localStorage.getItem('adminEmail') || 'Admin';

  useEffect(() => {
    const token = Cookies.get('jwt');
    if (!token) {
      navigate('/admin-login');
    }
  }, [navigate]);

  const handleLogout = () => {
    Cookies.remove('jwt');
    localStorage.removeItem('adminEmail');
    navigate('/admin-login');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setEmployeeError('');
    setEmployeeSuccess('');
  };

  const handleProjectChange = (e) => {
    const { name, value } = e.target;
    setProjectFormData(prev => ({ ...prev, [name]: value }));
    setProjectError('');
    setProjectSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.contact || !formData.empid || !formData.role) {
      setEmployeeError('All fields are required');
      return;
    }

    setLoading(true);
    setEmployeeError('');
    setEmployeeSuccess('');

    try {
      const response = await fetch('https://ethara-ai-project.onrender.com/auth/addemployees', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Cookies.get('jwt')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to add employee');
      }

      setEmployeeSuccess(data.message || 'Employee added successfully!');
      alert(data.message || 'Employee added successfully!');
      
      
      setFormData({
        name: '',
        contact: '',
        empid: '',
        role: ''
      });
      setShowForm(false);
      
    } catch (err) {
      console.error(err);
      setEmployeeError(err.message || 'An error occurred while adding the employee');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProjectSubmit = async (e) => {
    e.preventDefault();
    
    if (!projectFormData.projectName || !projectFormData.name || !projectFormData.empid || !projectFormData.role || !projectFormData.task || !projectFormData.deadline) {
      setProjectError('All fields are required');
      return;
    }

    setLoading(true);
    setProjectError('');
    setProjectSuccess('');

    try {
      const response = await fetch('https://ethara-ai-project.onrender.com/auth/admintasks', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Cookies.get('jwt')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(projectFormData)
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create project');
      }

      setProjectSuccess(data.message || 'Project created successfully!');
      alert(data.message || 'Project created successfully!');
      
      // Reset form
      setProjectFormData({
        projectName: '',
        name: '',
        empid: '',
        role: '',
        task: '',
        deadline: ''
      });
      setShowCreateProject(false);
      
    } catch (err) {
      console.error(err);
      setProjectError(err.message || 'An error occurred while creating project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-dashboard-wrapper">
      <header className="admin-header">
        <div className="header-left">
          <span className="admin-icon">🛡️</span>
          <h2>Admin Dashboard</h2>
          <span className="admin-email">({adminEmail})</span>
        </div>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </header>

      <main className="admin-main">
        <div className="admin-actions">
          <button 
            className="action-btn view-btn"
            onClick={() => {
              setShowCreateProject(!showCreateProject);
              if (!showCreateProject) {
                setShowForm(false);
                setShowEmployees(false);
                setShowProjects(false);
              }
            }}
          >
            {showCreateProject ? 'Cancel' : 'Create Project'}
          </button>
          <button 
            className="action-btn"
            onClick={() => {
              setShowForm(!showForm);
              if (!showForm) {
                setShowCreateProject(false);
                setShowEmployees(false);
                setShowProjects(false);
              }
            }}
          >
            {showForm ? 'Cancel' : 'Add New Employee'}
          </button>
          <button 
            className="action-btn view-btn"
            onClick={() => {
              setShowEmployees(!showEmployees);
              if (!showEmployees) {
                setShowForm(false);
                setShowCreateProject(false);
                setShowProjects(false);
              }
            }}
          >
            {showEmployees ? 'Hide Employees' : 'View All Employees'}
          </button>
          <button 
            className="action-btn view-btn"
            onClick={() => {
              setShowProjects(!showProjects);
              if (!showProjects) {
                setShowForm(false);
                setShowCreateProject(false);
                setShowEmployees(false);
              }
            }}
          >
            {showProjects ? 'Hide Company Dashboard' : 'Company Dashboard'}
          </button>
        </div>

        {showCreateProject && (
          <div className="form-container">
            <h3>Create New Project</h3>
            
            <form onSubmit={handleCreateProjectSubmit} className="add-employee-form">
              {projectError && <div className="alert error-alert">{projectError}</div>}
              {projectSuccess && <div className="alert success-alert">{projectSuccess}</div>}

              <div className="input-group">
                <label htmlFor="projectName">Project Name</label>
                <input
                  type="text"
                  id="projectName"
                  name="projectName"
                  value={projectFormData.projectName}
                  onChange={handleProjectChange}
                  disabled={loading}
                  placeholder="e.g. e-commerces-web"
                />
              </div>

              <div className="input-group">
                <label htmlFor="proj_name">Employee Name</label>
                <input
                  type="text"
                  id="proj_name"
                  name="name"
                  value={projectFormData.name}
                  onChange={handleProjectChange}
                  disabled={loading}
                  placeholder="e.g. Abbas"
                />
              </div>

              <div className="input-group">
                <label htmlFor="proj_empid">Employee ID</label>
                <input
                  type="text"
                  id="proj_empid"
                  name="empid"
                  value={projectFormData.empid}
                  onChange={handleProjectChange}
                  disabled={loading}
                  placeholder="e.g. E102"
                />
              </div>

              <div className="input-group">
                <label htmlFor="proj_role">Role</label>
                <input
                  type="text"
                  id="proj_role"
                  name="role"
                  value={projectFormData.role}
                  onChange={handleProjectChange}
                  disabled={loading}
                  placeholder="e.g. fullstack dev"
                />
              </div>
              
              <div className="input-group">
                <label htmlFor="proj_task">Task</label>
                <input
                  type="text"
                  id="proj_task"
                  name="task"
                  value={projectFormData.task}
                  onChange={handleProjectChange}
                  disabled={loading}
                  placeholder="e.g. fullstack"
                />
              </div>

              <div className="input-group">
                <label htmlFor="proj_deadline">Deadline</label>
                <input
                  type="date"
                  id="proj_deadline"
                  name="deadline"
                  value={projectFormData.deadline}
                  onChange={handleProjectChange}
                  disabled={loading}
                />
              </div>

              <button 
                type="submit" 
                className="submit-btn"
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Project'}
              </button>
            </form>
          </div>
        )}

        {showForm && (
          <div className="form-container">
            <h3>Add New Employee</h3>
            
            <form onSubmit={handleSubmit} className="add-employee-form">
              {employeeError && <div className="alert error-alert">{employeeError}</div>}
              {employeeSuccess && <div className="alert success-alert">{employeeSuccess}</div>}

              <div className="input-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="e.g. reeyansh"
                />
              </div>

              <div className="input-group">
                <label htmlFor="contact">Contact</label>
                <input
                  type="text"
                  id="contact"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="e.g. 7993281864"
                />
              </div>

              <div className="input-group">
                <label htmlFor="empid">Employee ID</label>
                <input
                  type="text"
                  id="empid"
                  name="empid"
                  value={formData.empid}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="e.g. E102"
                />
              </div>

              <div className="input-group">
                <label htmlFor="role">Role</label>
                <input
                  type="text"
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="e.g. Ai developer"
                />
              </div>

              <button 
                type="submit" 
                className="submit-btn"
                disabled={loading}
              >
                {loading ? 'Adding...' : 'Submit'}
              </button>
            </form>
          </div>
        )}

        {showEmployees && <AllEmployees />}
        {showProjects && <AllProjects />}
      </main>
    </div>
  );
};

export default AdminDashboard;
