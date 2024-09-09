import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home";
import Profile from "./pages/profile";
import axios from "axios";
import './App.css'; 
import HomeLogin from "./pages/HomeLogin";
import Events from "./pages/Events";
import Footer from "./components/Footer/Footer";
import CreateEvent from "./pages/CreateEvent";
import EventChanges from "./pages/EventChanges";


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false); 
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const location = useLocation();


  useEffect(() => {
    console.log("Verificando autenticación..."); 
    const token = localStorage.getItem("token");
    if (token) {
      console.log("Token encontrado, verificando con el servidor..."); 
      axios
        .get("/api/v1/check-auth", {
          headers: { Authorization: `Token ${token}` },
        })
        .then((response) => {
          console.log("Autenticación exitosa. Usuario:", response.data); 
          setIsAuthenticated(true);
          setUser(response.data);
          setUsername(response.data.username || "");
        })
        .catch((error) => {
          console.error("Error al verificar la autenticación:", error);
          setIsAuthenticated(false);
          setUser(null);
        })
        .finally(() => {
          setAuthChecked(true); 
          console.log("Autenticación verificada."); 
        });
    } else {
      console.log("No se encontró token, usuario no autenticado."); 
      setAuthChecked(true); 
    }
  }, []);


  const handleLoginSuccess = (user, token) => {
    console.log("Login exitoso. Usuario:", user, "Token:", token); 
    localStorage.setItem("token", token); 
    setIsAuthenticated(true);
    setUsername(user.username);
    navigate("/HomeLogin"); 
  };

  const handleSignUpSuccess = () => {
    console.log("Registro exitoso, redirigiendo a la página de login"); 
    navigate("/login"); 
  };

  const handleLogout = () => {
    console.log("Cerrando sesión...");
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setUsername("");
    navigate("/"); 
  };

 

  return (
    <div className="app-background">
      {location.pathname !== "/" && (
        <Navbar
          isAuthenticated={isAuthenticated}
          username={username}
          onLogout={handleLogout}
        />
      )}
      <main className="content">
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
              <Route
                path="/profile"
                element={isAuthenticated ? <Profile onLogout={handleLogout} /> : <Home />} 
              />
              <Route
                path="/HomeLogin"
                element={<HomeLogin username={username} />} 
              />
              <Route
                path="/events"
                element={isAuthenticated ? <Events /> : <Home />} 
              />
              <Route path="/create-event" element={<CreateEvent />} /> 
              <Route path="/event-changes" element={<EventChanges />} />
            </Routes>
        </main>
      <Footer />
    </div>
  );
}

export default App;
