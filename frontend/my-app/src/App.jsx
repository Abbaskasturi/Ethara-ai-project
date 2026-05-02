import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import EmployeeLogin from './components/EmployeeLogin';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<EmployeeLogin />} />
          <Route path="/dashboard" element={
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', width: '100%' }}>
              <h1>Dashboard - Coming Soon</h1>
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
