import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ReactComponent as NextIcon } from '../assets/next.svg';

const Landing = () => {
  const navigate = useNavigate();

  // Function to handle navigation
  const handleNavigate = () => {
    navigate('/home');
  };

  return (
    <div className="landing-container">
     
      <h1 className="landing-title">INDIC</h1>
      <NextIcon className="next" onClick={handleNavigate} style={{ cursor: 'pointer' }} />
    </div>
  );
};

export default Landing;