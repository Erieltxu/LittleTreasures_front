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
import Events from "./pages/Events";
import Footer from "./components/Footer/Footer";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false); // Estado para controlar si ya hemos verificado la autenticación
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Verificar si hay un token y comprobar autenticación
  useEffect(() => {
    console.log("Verificando autenticación..."); // Depuración
    const token = localStorage.getItem("token");
    if (token) {
      console.log("Token encontrado, verificando con el servidor..."); // Depuración
      axios
        .get("/api/v1/check-auth", {
          headers: { Authorization: `Token ${token}` },
        })
        .then((response) => {
          console.log("Autenticación exitosa. Usuario:", response.data); // Depuración
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
          setAuthChecked(true); // Autenticación verificada
          console.log("Autenticación verificada."); // Depuración
        });
    } else {
      console.log("No se encontró token, usuario no autenticado."); // Depuración
      setAuthChecked(true); // No hay token, autenticación verificada
    }
  }, []);

  // Redirigir solo después del login exitoso
  const handleLoginSuccess = (user, token) => {
    console.log("Login exitoso. Usuario:", user, "Token:", token); // Depuración
    localStorage.setItem("token", token); // Guardar el token
    setIsAuthenticated(true);
    setUsername(user.username);
    navigate("/HomeLogin"); // Redirigir a HomeLogin tras el login
  };

  const handleSignUpSuccess = () => {
    console.log("Registro exitoso, redirigiendo a la página de login"); // Depuración
    navigate("/login"); // Redirigir a la página de login tras registro exitoso
  };

  const handleLogout = () => {
    console.log("Cerrando sesión..."); // Depuración
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setUsername("");
    navigate("/"); // Redirigir a Home tras cerrar sesión
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
                element={isAuthenticated ? <Profile onLogout={handleLogout} /> : <Home />} // Redirigir a Home si no está autenticado
              />
              <Route
                path="/HomeLogin"
                element={<HomeLogin username={username} />} // Redirigir aquí tras el login
              />
              <Route
                path="/events"
                element={isAuthenticated ? <Events /> : <Home />} // Acceso a eventos solo si está autenticado
              />
            </Routes>
        </main>
      <Footer />
    </div>
  );
}

export default App;
