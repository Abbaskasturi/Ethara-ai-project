import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import './index.css';

const AllEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch('https://ethara-ai-project.onrender.com/auth/getallemp', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${Cookies.get('jwt')}`,
          'Content-Type': 'application/json'
        }
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch employees');
      }
      
      // Handle different potential response structures
      if (result.employees) {
        setEmployees(result.employees);
      } else if (result.data) {
        setEmployees(result.data);
      } else if (Array.isArray(result)) {
        setEmployees(result);
      } else {
        setEmployees([]);
      }
      
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error fetching employees');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="employees-container">
      <h3>All Employees</h3>
      
      {loading ? (
        <p className="loading-text">Loading employees...</p>
      ) : error ? (
        <p className="error-text">{error}</p>
      ) : employees.length === 0 ? (
        <p className="no-data-text">No employees found.</p>
      ) : (
        <div className="employees-grid">
          {employees.map((emp, index) => (
            <div key={index} className="employee-card">
              <div className="employee-header">
                <h4>{emp.name}</h4>
                <span className="employee-role">{emp.role}</span>
              </div>
              <div className="employee-details">
                <p><strong>Emp ID:</strong> {emp.empid}</p>
                <p><strong>Contact:</strong> {emp.contact}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllEmployees;
