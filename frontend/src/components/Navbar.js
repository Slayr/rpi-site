import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Close menu on route change
  useEffect(() => {
    closeMenu();
  }, [location]);

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <NavLink to="/" className="navbar-logo">
          Rishi
        </NavLink>

        <div className="menu-icon" onClick={toggleMenu}>
          <div className={`hamburger ${isMenuOpen ? 'open' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>

        <ul className={isMenuOpen ? 'nav-menu active' : 'nav-menu'}>
          <li className="nav-item">
            <NavLink to="/" className={({ isActive }) => "nav-links" + (isActive ? " active" : "")}>
              Home
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/blog" className={({ isActive }) => "nav-links" + (isActive ? " active" : "")}>
              Blog
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/photography" className={({ isActive }) => "nav-links" + (isActive ? " active" : "")}>
              Photography
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/admin" className={({ isActive }) => "nav-links" + (isActive ? " active" : "")}>
              Admin
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
