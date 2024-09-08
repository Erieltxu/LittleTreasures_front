import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css'; // Usamos los mismos estilos de Home

function HomeLogin() {
  const navigate = useNavigate();

  return (
    <main className="main">
      {/* Logo encima del título */}
      <img src="/img/logo.jfif" alt="Logo" className="home-logo" />
      <h2>LITTLE<br /> TREASURES</h2>
      <div className="home-buttons"> 
      <button 
          className="home-button"  
          onClick={() => navigate('/events')}
        >
          Eventos
        </button>
        <button 
          className="home-button"  
          onClick={() => navigate('/profile')}
        >
          Área Cliente
        </button>
      </div>
    </main>
  );
}

export default HomeLogin;
