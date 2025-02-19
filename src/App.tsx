import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DogSearch from './components/DogSearch';
import Login from './components/Login';

function App() {
  return (
    <Router basename="/fetchDog">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/search" element={<DogSearch />} />
      </Routes>
    </Router>
  );
}

export default App;
