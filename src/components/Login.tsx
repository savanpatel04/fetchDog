// components/Login.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/api";

const Login: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await login(name, email);
      navigate("/search"); 
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <div className="centered-box">
      <h1 style={{ marginBottom: "1rem", color: "#6e8efb" }}>Welcome to Fetch Dogs</h1>
      <input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;
