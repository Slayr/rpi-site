import React from 'react';
import { useNavigate } from 'react-router-dom';
import Orb from '../components/Orb'; // Import Orb component
import './LandingPage.css';

function LandingPage() {
  const navigate = useNavigate();

  const handleOrbClick = (path) => {
    navigate(path);
  };

  return (
    <div className="landing-page">
      <h1 className="landing-title">Welcome to My Digital Space</h1>
      <p className="landing-subtitle">Explore my work, thoughts, and creations.</p>
      <div className="orb-links-container">
        <div className="orb-wrapper" onClick={() => handleOrbClick('/blog')}> 
          <Orb hue={200} hoverIntensity={0.5} rotateOnHover={true} />
          <span className="orb-text">Read My Blog</span>
        </div>
        <div className="orb-wrapper" onClick={() => handleOrbClick('/photography')}> 
          <Orb hue={300} hoverIntensity={0.5} rotateOnHover={true} />
          <span className="orb-text">View My Photography</span>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
