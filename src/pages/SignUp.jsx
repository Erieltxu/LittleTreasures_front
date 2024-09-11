import React, { useState, useEffect } from 'react';
import useApi from '../services/useApi';
import { useNavigate } from 'react-router-dom';
import { USER_REGISTER } from '../config/urls';
import './signUp.css';

const Signup = ({ onSignUpSuccess }) => {
  const [first_name, setName] = useState('');
  const [last_name, setLastname] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const navigate = useNavigate();

  const { data, loading, error } = useApi({
    apiEndpoint: submitted ? USER_REGISTER : null,
    method: 'POST',
    body: {
      first_name,
      last_name,
      username,
      email,
      password,
    },
  });

  useEffect(() => {
    if (data) {
      console.log('Signup successful:', data);
      if (onSignUpSuccess) {
        onSignUpSuccess(data); 
      }
      navigate('/login'); 
    }
  }, [data, navigate, onSignUpSuccess]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true); 
  };

  const handleBackToHome = () => {
    navigate('/'); 
  };

  return (
    <div className="signup-form-container">
       {loading }? (
        <p>Cargando...</p> ) : 

      <div className="scrollable-container">
        <form onSubmit={handleSubmit} className="signup-form">
          <div className="form-header">
            <div className="back-arrow" onClick={handleBackToHome}>
              <img src="/assets/icons/Arrow.svg" alt="Back to Home" className="arrow-icon" />
            </div>
            <h2 className="signup-title">Registrarse</h2>
          </div>
          <div className="form-group">
            <label htmlFor="first_name">Nombre</label>
            <input
              type="text"
              id="first_name"
              value={first_name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nombre"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="last_name">Apellido</label>
            <input
              type="text"
              id="last_name"
              value={last_name}
              onChange={(e) => setLastname(e.target.value)}
              placeholder="Apellido"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="username">Nombre de usuario</label>
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
            <label htmlFor="email">Correo electrónico</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Correo electrónico"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              required
            />
          </div>
          <button type="submit" className="signup-button">
            Registrar
          </button>
          {error && <p className="error-message">{error.message || error}</p>}
        </form>
      </div>
    </div>
  );
};

export default Signup;
