import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; 
import useApi from '../../services/useApi'; 
import { USER_DETAIL } from '../../config/urls';
import './navbar.css'; 

function Navbar({ isAuthenticated, userName, onLogout }) {
  const [username, setUsername] = useState('');

  const { data, loading, error } = useApi({
    apiEndpoint: isAuthenticated ? USER_DETAIL : null,
    method: 'GET',  
    headers: {
      Authorization: `Token ${localStorage.getItem('token') || ''}` // Verifica si el token existe
    }
  });

  useEffect(() => {
    if (data && data.username) {
      setUsername(data.username); 
    }
  }, [data]);

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">
          <img src="assets/img/logo.jfif" alt="Logo" />
        </Link>
        {isAuthenticated && <p className="welcome-message">Hi, {username || userName}</p>}
      </div>
      <ul className="navbar-links">
        {isAuthenticated ? (
          <>
            <li><button onClick={onLogout} className="navbar-button">Cerrar Sesión</button></li>
            <li><Link to="/profile" className="navbar-button">Area Cliente</Link></li>
          </>
        ) : (
          <>
            <li><Link to="/login" className="navbar-button">Acceso</Link></li>
            <li><Link to="/signup" className="navbar-button">Registro</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
