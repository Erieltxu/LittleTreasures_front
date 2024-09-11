import React, { useState, useEffect } from 'react';
import useApi from '../services/useApi';
import { useNavigate } from 'react-router-dom';
import { USER_LOGIN } from '../config/urls';
import './login.css';

function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const { data, loading, error: apiError } = useApi({
    apiEndpoint: submitted ? USER_LOGIN : null,
    method: 'POST',
    body: { username, password },
  });

  useEffect(() => {
    if (data) {
      console.log('Login successful:', data);
      localStorage.setItem('token', data.token); 
      console.log('Token set in localStorage:', localStorage.getItem('token'));

      if (onLoginSuccess) {
        onLoginSuccess({ username }, data.token); 
      }

      
      navigate('/HomeLogin');
    }
  }, [data, navigate, onLoginSuccess, username]);

  useEffect(() => {
    if (apiError) {
      setError('Login failed: ' + (apiError.message || 'Please check your credentials.'));
    }
  }, [apiError]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true); 
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="login-form-container">
    <form className="login-form" onSubmit={handleSubmit}>
      <div className="form-header">
        <div className="back-arrow" onClick={handleBackToHome}>
          <img src="/assets/icons/Arrow.svg" alt="Back to Home" className="arrow-icon" />
        </div>
        <h2 className="login-title">Acceder</h2>
      </div>
      <div className="form-group">
        <label htmlFor="username">Nombre de usuario:</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Nombre de usuario"
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="password">Contraseña:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Contraseña"
          required
        />
      </div>
      {error && <p className="error-message">{error}</p>}
      <button type="submit" className="login-button">ENTRAR</button>
    </form>
  </div>

  );
}

export default Login;
