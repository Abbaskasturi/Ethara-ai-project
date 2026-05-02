import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import './index.css';

const AdminLogin = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email.trim() || !formData.password.trim()) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('https://ethara-ai-project.onrender.com/auth/adminlogin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      const body = await response.json();
      
      if (!response.ok) {
        throw new Error(body.message || body.error || 'Login failed. Please check your credentials.');
      }
      
      // The backend returns the JWT token directly in the `message` field
      let token = body.token || body.jwt || body.accessToken;
      
      if (!token && body.message && typeof body.message === 'string' && body.message.startsWith('ey')) {
        token = body.message;
      } else if (!token && typeof body.data === 'string') {
        token = body.data;
      }
      
      if (!token) {
        console.error("Unrecognized token format in response:", body);
        token = body.message || JSON.stringify(body);
      }
      
      Cookies.set('jwt', token, { expires: 1, secure: true, sameSite: 'strict' });
      localStorage.setItem('adminEmail', formData.email);
      setSuccess('Admin login successful! Redirecting...');
      
      setTimeout(() => {
        // Assume there will be an admin dashboard
        navigate('/admin-dashboard');
      }, 1500);
    } catch (err) {
      setError(err.message || 'An unexpected error occurred during login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <div className="login-header">
          <h2>Admin Login</h2>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="alert error-alert">{error}</div>}
          {success && <div className="alert success-alert">{success}</div>}

          <div className="input-group">
            <label htmlFor="email" className="input-label">Admin Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="input-field"
              disabled={loading}
            />
          </div>

          <div className="input-group">
            <label htmlFor="password" className="input-label">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="input-field"
              disabled={loading}
            />
          </div>

          <button 
            type="submit" 
            className="login-btn"
            disabled={loading}
          >
            {loading ? 'Authenticating...' : 'Login as Admin'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
