import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
import './hygine.css';

const HygieneAnimation = () => {
  const [scene, setScene] = useState(1);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (isPlaying) {
      const timer = setTimeout(() => {
        setScene((prev) => (prev < 2 ? prev + 1 : 1));
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [scene, isPlaying]);

  return (
    <div className="card">
      <div className="animation-container">
        {/* Sky and Sun */}
        <div className="sky">
          <div className="sun"></div>
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="star"
              style={{
                top: `${Math.random() * 30}%`,
                left: `${Math.random() * 90}%`,
                animationDelay: `${Math.random() * 2}s`
              }}
            ></div>
          ))}
        </div>

        {/* Bedroom Scene */}
        <div className={`scene ${scene === 1 ? 'visible' : ''}`}>
          <div className="bubbles-side">
            <div className="bubbles"></div>
          </div>
          <div className="grumbles-side">
            <div className="grumbles">
              <div className="snore-bubble"></div>
            </div>
          </div>
        </div>

        {/* Bathroom Scene */}
        <div className={`scene ${scene === 2 ? 'visible' : ''}`}>
          <div className="sink">
            <div className="tap">
              <div className="drip"></div>
            </div>
          </div>
          <div className="bubbles-brushing">
            <div className="bubbles"></div>
            <div className="toothbrush"></div>
          </div>
          <div className="grumbles">
            <div className="bad-breath"></div>
          </div>
        </div>

        {/* Scene Text */}
        <div className="scene-text">
          <h2>{scene === 1 ? 'Good Morning!' : 'Brushing Time!'}</h2>
          <p>
            {scene === 1
              ? 'Meet Bubbles and Grumbles! One loves being clean, the other... not so much!'
              : 'Bubbles knows brushing keeps teeth healthy and breath fresh!'}
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="controls">
        <button onClick={() => setScene(1)} className={scene === 1 ? 'active' : ''}>
          Bedroom
        </button>
        <button onClick={() => setScene(2)} className={scene === 2 ? 'active' : ''}>
          Bathroom
        </button>
        <button onClick={() => setIsPlaying(!isPlaying)}>
          {isPlaying ? 'Pause' : 'Play'} Animation
        </button>
      </div>
    </div>
  );
};

export default HygieneAnimation;
