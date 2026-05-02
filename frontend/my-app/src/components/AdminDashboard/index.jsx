import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import './index.css';

const AdminDashboard = () => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    empid: '',
    role: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.contact || !formData.empid || !formData.role) {
      setError('All fields are required');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

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

      setSuccess(data.message || 'Employee added successfully!');
      alert(data.message || 'Employee added successfully!');
      
      // Reset form
      setFormData({
        name: '',
        contact: '',
        empid: '',
        role: ''
      });
      setShowForm(false);
      
    } catch (err) {
      console.error(err);
      setError(err.message || 'An error occurred while adding the employee');
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
            className="action-btn"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Cancel' : 'Add New Employee'}
          </button>
        </div>

        {showForm && (
          <div className="form-container">
            <h3>Add New Employee</h3>
            
            <form onSubmit={handleSubmit} className="add-employee-form">
              {error && <div className="alert error-alert">{error}</div>}
              {success && <div className="alert success-alert">{success}</div>}

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
      </main>
    </div>
  );
};

export default AdminDashboard;
