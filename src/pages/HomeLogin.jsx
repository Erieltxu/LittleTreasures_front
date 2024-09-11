import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css'; 

function HomeLogin() {
  const navigate = useNavigate();

  return (
    <main className="main">
      <img src="assets/img/logo.jfif" alt="Logo" className="home-logo" />
      <h2>LITTLE<br /> TREASURES</h2>
      <div className="home-buttons"> 
      <button 
          className="home-button"  
          onClick={() => navigate('/events')}
        >
          Eventos
        </button>
        
      </div>
    </main>
  );
}

export default HomeLogin;
