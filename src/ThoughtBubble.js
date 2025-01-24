import React, { useEffect } from 'react';

const ThoughtBubble = ({ currentLesson, lessons }) => {
  const currentLessonData = lessons[currentLesson];
  const word = currentLessonData?.expected || '';
  
  // Create a consistent filename from the Hindi word
  const getImageFileName = (hindiWord) => {
    const wordMap = {
      'अनार': 'anaar',
      'आम': 'aam',
      'इमली': 'imli',
      'ईख': 'eekh',
      'उल्लू': 'ullu',
      'ऊन': 'oon',
      'एप्पल': 'apple',
      'ऐनक': 'ainak',
      'ओखली': 'okhli',
      'औरत': 'aurat',
      'अंगूर': 'angoor'
    };
    
    return wordMap[hindiWord] || hindiWord.toLowerCase();
  };

  const imagePath = `/images/${getImageFileName(word)}.png`;

  // Debug logging - moved before conditional return
  useEffect(() => {
    if (currentLesson && currentLesson !== 0) {
      console.log('Current lesson:', currentLesson);
      console.log('Current word:', word);
      console.log('Image path:', imagePath);
    }
  }, [currentLesson, word, imagePath]);

  // Return null after useEffect
  if (!currentLesson || currentLesson === 0) return null;

  return (
    <div className="thought-bubble-container">
      <div className="thought-bubble">
        <div className="bubble-content">
          <img 
            src={imagePath}
            alt={word}
            className="thought-image"
            onError={(e) => {
              console.error(`Failed to load image: ${imagePath}`);
              // Show the Hindi word as fallback
              e.target.style.display = 'none';
              e.target.parentElement.innerHTML = `<div style="font-size: 24px; color: #FF5722;">${word}</div>`;
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ThoughtBubble;