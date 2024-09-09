import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomeLogin'; // Estilos para la página Home

function Home() {
  const navigate = useNavigate();

  return (
    <main className="main">
      {/* Logo encima del título */}
      <img src="assets/img/logo.jfif" alt="Logo" className="home-logo" />
      <h2>LITTLE<br /> TREASURES</h2>
      <div className="home-buttons">
        <button 
          className="home-button" 
          onClick={() => navigate('/login')}
        >
          Login
        </button>
        <button 
          className="home-button" 
          onClick={() => navigate('/signup')}
        >
          Sign Up
        </button>
      </div>
    </main>
  );
}

export default Home;
