import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import Login from "./components/login/Login";
import SignUp from "./components/Signup/SignUp";
import Home from "./pages/Home";
import Profile from "./components/profile/profile";
import axios from "axios";
import './App.css'; // Archivo de estilo para fondo y demás estilos
import HomeLogin from "./pages/HomeLogin";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const location = useLocation(); // Para obtener la ruta actual

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("/api/v1/check-auth", {
          headers: { Authorization: `Token ${token}` },
        })
        .then((response) => {
          setIsAuthenticated(true);
          setUser(response.data);
          setUsername(response.data.username || "");
        })
        .catch((error) => {
          console.error("Auth Check Error:", error);
          setIsAuthenticated(false);
          setUser(null);
        });
    }
  }, []);

  // Redirige a la página de inicio si no estás en la página de perfil
  useEffect(() => {
    if (isAuthenticated && window.location.pathname !== "/profile") {
      navigate("/HomeLogin"); // Redirige a la página de inicio solo si estás autenticado
    }
  }, [isAuthenticated, navigate]);

  const handleLoginSuccess = (user) => {
    setIsAuthenticated(true);
    setUsername(user.username);
    navigate("/HomeLogin"); // Redirige a la página de perfil después de iniciar sesión
  };

  const handleSignUpSuccess = () => {
    navigate("/login"); // Redirige a la página de login después de un registro exitoso
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setUsername("");
    navigate("/"); // Redirige a la página de inicio después de cerrar sesión
  };

  return (
    <div className="app-background">
      {/* Muestra el Navbar solo si no estás en la página de inicio */}
      {location.pathname !== "/" && (
        <Navbar
          isAuthenticated={isAuthenticated}
          username={username}
          onLogout={handleLogout}
        />
      )}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={<Login onLoginSuccess={handleLoginSuccess} />}
        />
        <Route
          path="/signup"
          element={<SignUp onSignUpSuccess={handleSignUpSuccess} />}
        />
        <Route path="/profile" element={<Profile onLogout={handleLogout} />} />
        <Route
          path="/HomeLogin"
          element={<HomeLogin username={username} />} // 
        />
        <Route path="/" />
      </Routes>
    </div>
  );
}

export default App;
