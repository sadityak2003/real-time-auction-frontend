import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './styles/Register.css';

const Register = ({ onClose }) => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await register(formData.username, formData.email, formData.password);
    
    if (result.success) {
      onClose();
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <div className="register-overlay">
      <div className="register-container">
        <div className="register-header">
          <h2 className="register-title">Register</h2>
          <button onClick={onClose} className="register-close">×</button>
        </div>

        <form onSubmit={handleSubmit} className="register-form">
          <div>
            <label className="register-label">Username</label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="register-input"
              required
            />
          </div>

          <div>
            <label className="register-label">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="register-input"
              required
            />
          </div>

          <div>
            <label className="register-label">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="register-input"
              required
            />
          </div>

          {error && <div className="register-error">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="register-button"
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
