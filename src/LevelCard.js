import React from 'react';

const LevelCard = ({ level, onSelect }) => {
  return (
    <div 
      className="level-card"
      onClick={() => onSelect(level)}
    >
      <div className="level-number">Lesson {level.id}</div>
      <h3 className="level-name">{level.name}</h3>
    </div>
  );
};

export default LevelCard;