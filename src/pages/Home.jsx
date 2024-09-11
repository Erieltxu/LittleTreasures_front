import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomeLogin'; 

function Home() {
  const navigate = useNavigate();

  return (
    <main className="main">
      <img src="assets/img/logo.jfif" alt="Logo" className="home-logo" />
      <h1>LITTLE<br /> TREASURES</h1>
      <div className="home-buttons">
        <button 
          className="home-button" 
          onClick={() => navigate('/login')}
        >
          ACCEDER
        </button>
        <button 
          className="home-button" 
          onClick={() => navigate('/signup')}
        >
          REGISTRARSE
        </button>
      </div>
    </main>
  );
}

export default Home;
