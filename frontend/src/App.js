import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Blog from './pages/Blog';
import Photography from './pages/Photography';
import Admin from './pages/Admin';
import Navbar from './components/Navbar';
import Aurora from './components/Aurora';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Aurora />
        <Navbar />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/photography" element={<Photography />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
