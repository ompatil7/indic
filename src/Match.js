// Game.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Match.css';  // Make sure this import is correct

// First update the imports to use relative paths from your new location
import grapesImage from './assets/grapes.png';
import bananaImage from './assets/banana.png';
import mangoImage from './assets/mango.png';
import watermelonImage from './assets/watermelon.png';
import orangeImage from './assets/orange.png';

const preMatchedData = [
  { fruit: <img src={grapesImage} alt="Grapes" className="fruit-image" />, fruitHindi: "अंगूर" },
  { fruit: <img src={bananaImage} alt="Banana" className="fruit-image" />, fruitHindi: "केला" },
  { fruit: <img src={mangoImage} alt="Mango" className="fruit-image" />, fruitHindi: "आम" },
  { fruit: <img src={watermelonImage} alt="Watermelon" className="fruit-image" />, fruitHindi: "तरबूज" },
  { fruit: <img src={orangeImage} alt="Orange" className="fruit-image" />, fruitHindi: "संतरा" },
];

const shuffledArray = (matchingData) => {
  return matchingData.slice().sort(() => Math.random() - 0.5);
};

export default function Game() {
  const [shuffledMatchedData, setShuffledMatchedData] = useState([]);
  const [pairedData, setPairedData] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);

  useEffect(() => {
    setShuffledMatchedData(shuffledArray(preMatchedData));
  }, []);

  const handleCapitalClick = (match) => {
    if (selectedMatch && match.fruitHindi === selectedMatch.fruitHindi) {
      const newPairedMatch = [...pairedData, { fruit: selectedMatch.fruit, fruitHindi: match.fruitHindi }];
      setPairedData(newPairedMatch);
    }
    setSelectedMatch(null);
  };

  const isMatched = (match) => {
    return pairedData.some((pairedMatch) => pairedMatch.fruitHindi === match.fruitHindi);
  };

  const win = pairedData.length === preMatchedData.length;

  return (
    <div className="game-wrapper">
      <Link to="/" className="back-link">
        <button className="back-button">Back to Lessons</button>
      </Link>
      <div className="game-container">
        {win && (
          <div className="win-message">
            <h2>You Win!</h2>
          </div>
        )}
        <div className="main">
          <div className="flex-column">
            {preMatchedData.map((match, index) => (
              <button
                className={`card ${isMatched(match) ? 'matched' : ''} ${
                  selectedMatch === match ? 'selected' : ''
                }`}
                key={index}
                onClick={() => setSelectedMatch(match)}
              >
                {match.fruit}
              </button>
            ))}
          </div>
          <div className="flex-column">
            {shuffledMatchedData.map((match, index) => (
              <button
                className={`card ${isMatched(match) ? 'matched' : ''} ${
                  selectedMatch === null ? 'disabled' : ''
                }`}
                key={index}
                disabled={selectedMatch === null}
                onClick={() => handleCapitalClick(match)}
              >
                {match.fruitHindi}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}