import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ReactComponent as UserIcon } from '../assets/Vector.svg'; // Use your SVG file
import { ReactComponent as RewardIcon } from '../assets/reward.svg'; // Use your SVG file
import { ReactComponent as GameIcon } from '../assets/game.svg'; // Use your SVG file
import { ReactComponent as StoryIcon } from '../assets/story.svg'; // Use your SVG file
import { ReactComponent as ARIcon } from '../assets/AR.svg'; // Use your SVG file
import { ReactComponent as LearningIcon } from '../assets/good.svg'; // Use your SVG file


import LevelCard from '../components/LevelCard';
import { levels } from '../constants/levels';

const HomePage = () => {
  const navigate = useNavigate();

  const handleLevelSelect = (level) => {
    navigate(`/lesson/${level.id}`, { state: { levelFile: level.file } });
  };

  const navigateToLandingPage = () => {
    navigate('/landing'); // Replace '/' with your landing page route
  };
  const navigateToHyginePage = () => {
    navigate('/hygine'); // Replace '/' with your landing page route
  };
  const navigateToFlippedCard = () => {
    navigate('/gamepage'); // Replace '/' with your landing page route
  };
  const navigateToSignUpPage = () => {
    navigate('/signup'); // Replace '/' with your landing page route
  };

  return (
    <div className="home-container">
      <header className="header-container">
        {/* Add onClick to navigate to the landing page */}
        <h1 className="home-title" onClick={navigateToLandingPage} style={{ cursor: 'pointer' }}>
          INDIC
        </h1>
        <RewardIcon className="reward-icon" onClick={navigateToSignUpPage} style={{ width: '35px', height: '45px' }} />
        <UserIcon className="profile-icon" onClick={navigateToHyginePage} style={{ width: '35px', height: '35px' }} />
      </header>
      <div className="levels-grid">
        {levels.map((level) => (
          <LevelCard 
            key={level.id} 
            level={level} 
            onSelect={handleLevelSelect} 
          />
        ))}
      </div>
      <div className="bottom-container">
        <div className="icon-button" onClick={navigateToFlippedCard}>
          <GameIcon className="icon" />
          <span className="icon-label">Games</span>
        </div>
        <div className="icon-button" onClick={navigateToHyginePage}>
          <ARIcon className="icon" />
          <span className="icon-label">AR</span>
        </div>
        <div className="icon-button" onClick={navigateToHyginePage}>
          <StoryIcon className="icon" />
          <span className="icon-label">Story</span>
        </div>
        <div className="icon-button" onClick={navigateToLandingPage}>
          <LearningIcon className="icon" />
          <span className="icon-label">Learnings</span>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
