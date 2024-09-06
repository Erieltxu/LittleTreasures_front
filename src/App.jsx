import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import Login from "./components/login/Login";
import SignUp from "./components/Signup/SignUp";
import "./index.css";

import axios from "axios";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

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
          setUsername(response.data.username || '');
        })
        .catch(error => {
        console.error('Auth Check Error:', error); 
          setIsAuthenticated(false);
          setUser(null);
        });
      
    }
  }, []);

  const handleLoginSuccess = (user) => {
    setIsAuthenticated(true);
    setUsername(user.username);
    navigate("/");
  };

  const handleSignUpSuccess = (user) => {
    setIsAuthenticated(true);
    setUsername(user.username); 
    navigate('/'); 

  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setUsername("");
    navigate("/");
  };

  return (
    <div>
      <Navbar
        isAuthenticated={isAuthenticated}
        username={username}
        onLogout={handleLogout}
      />

      <Routes>
     
        <Route
          path="/login"
          element={<Login onLoginSuccess={handleLoginSuccess} />}
        />
        <Route
          path="/signup"
          element={<SignUp onSignUpSuccess={handleSignUpSuccess} />}
        />
        
     
      </Routes>

    </div>
  );
}

export default App;
