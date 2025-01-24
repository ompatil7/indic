import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import './Frog.css'
export default function Frog() {
  const hindi_vowels = useMemo(() => [
    'अ', 'आ', 'इ', 'ई', 'उ', 'ऊ', 'ऋ', 
    'ए', 'ऐ', 'ओ', 'औ', 'अं', 'अः'
  ], []);

  const [currentTarget, setCurrentTarget] = useState('');
  const [score, setScore] = useState(0);
  const [canJump, setCanJump] = useState(true);
  
  const characterRef = useRef(null);
  const platformsContainerRef = useRef(null);
  
  const soundsRef = useRef({
    correct: new Audio('data:audio/mpeg;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4LjIwLjEwMAAAAAAAAAAAAAAA//tUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAAFWgDMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzM//////////////////////////////////////////////////////////////////8AAAAATGF2YzU4LjM1AAAAAAAAAAAAAAAAJAAAAAAAAAAAAQVa+I2kXwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//sUZAAP8AAAaQAAAAgAAA0gAAABAAABpAAAACAAADSAAAAETEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVU='),
    wrong: new Audio('data:audio/mpeg;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4LjIwLjEwMAAAAAAAAAAAAAAA//tUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAAFWgDMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzM//////////////////////////////////////////////////////////////////8AAAAATGF2YzU4LjM1AAAAAAAAAAAAAAAAJAAAAAAAAAAAAQVa+I2kXwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//sUZAAP8AAAaQAAAAgAAA0gAAABAAABpAAAACAAADSAAAAETEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVU=')
  });

  // Modified to only set target if it's empty
  const setNewTarget = useCallback(() => {
    setCurrentTarget(prevTarget => {
      if (!prevTarget) {
        return hindi_vowels[Math.floor(Math.random() * hindi_vowels.length)];
      }
      return prevTarget;
    });
  }, [hindi_vowels]);

  const jumpToPlatform = useCallback((platform) => {
    setCanJump(false);
    const character = characterRef.current;
    const platformsContainer = platformsContainerRef.current;
    
    const targetRect = platform.getBoundingClientRect();
    const containerRect = platformsContainer.getBoundingClientRect();

    const targetX = targetRect.left - containerRect.left + targetRect.width / 2 - character.offsetWidth / 2;
    const targetY = containerRect.bottom - targetRect.bottom + 50;

    const startX = parseFloat(character.style.left || '0');
    const startY = parseFloat(character.style.bottom || '50');

    const jumpDuration = 600;
    const startTime = performance.now();
    character.querySelector('.frog').style.transform = 'rotate(180deg)';

    const animateJump = (currentTime) => {
      const elapsed = currentTime - startTime;
      const t = Math.min(elapsed / jumpDuration, 1);

      const x = startX + t * (targetX - startX);
      const y = startY + t * (targetY - startY) - (4 * t * (1 - t)) * 150;

      character.style.left = `${x}px`;
      character.style.bottom = `${y}px`;

      if (t < 1) {
        requestAnimationFrame(animateJump);
      } else {
        soundsRef.current.correct.play();
        character.querySelector('.frog').style.transform = 'rotate(0deg)';
        setScore(prev => prev + 1);
        // Only set a new target after a short delay
        setTimeout(() => {
          setCurrentTarget(hindi_vowels[Math.floor(Math.random() * hindi_vowels.length)]);
          setCanJump(true);
        }, 500);
      }
    };

    requestAnimationFrame(animateJump);
  }, [hindi_vowels]);

  const handleJump = useCallback((platform) => {
    if (!canJump) return;
    
    const vowel = platform.dataset.vowel;
    
    if (vowel === currentTarget) {
      jumpToPlatform(platform);
    } else {
      soundsRef.current.wrong.play();
      platform.style.animation = 'shake 0.5s';
      setTimeout(() => platform.style.animation = '', 500);
    }
  }, [canJump, currentTarget, jumpToPlatform]);

  const handleKeyDown = useCallback((e) => {
    const index = '1234567890qwe'.indexOf(e.key);
    if (index >= 0 && index < hindi_vowels.length) {
      const platform = platformsContainerRef.current?.children[index];
      if (platform) handleJump(platform);
    }
  }, [hindi_vowels, handleJump]);

  useEffect(() => {
    setNewTarget();
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [setNewTarget, handleKeyDown]);

  const platformsGrid = useMemo(() => (
    hindi_vowels.map((vowel, index) => (
      <div
        key={index}
        className="platform"
        data-vowel={vowel}
        onClick={(e) => handleJump(e.currentTarget)}
      >
        <div className="lotus">{vowel}</div>
      </div>
    ))
  ), [hindi_vowels, handleJump]);

  return (
    <div className="game-wrapper">
      <div className="score-box">Score: <span>{score}</span></div>
      <div className="target-letter">Jump to: <span>{currentTarget}</span></div>
      
      <div className="game-container">
        <div className="character" ref={characterRef}>
          <div className="frog"></div>
        </div>
        <div className="platforms-grid" ref={platformsContainerRef}>
          {platformsGrid}
        </div>
      </div>
    </div>
  );
}

// export default App;