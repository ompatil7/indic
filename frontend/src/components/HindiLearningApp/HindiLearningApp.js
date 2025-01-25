import React, { useState, useEffect } from 'react';
import './HindiLearningApp.css';

const HindiLearningApp = () => {
  const [sentences] = useState([
    {
      hindi: "यह एक किताब है।",
      english: "This is a book."
    },
    {
      hindi: "मैं स्कूल जा रहा हूँ।",
      english: "I am going to school."
    },
    {
      hindi: "सूरज आसमान में है।",
      english: "The sun is in the sky."
    },
    {
      hindi: "मुझे दूध पीना है।",
      english: "I want to drink milk."
    }
  ]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [showEnglish, setShowEnglish] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.lang = 'hi-IN';
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      setRecognition(recognitionInstance);
    }
  }, []);

  useEffect(() => {
    speakHindi();
  }, [currentIndex]);

  const speakHindi = () => {
    setShowEnglish(false);
    setFeedback('');
    const utterance = new SpeechSynthesisUtterance(sentences[currentIndex].hindi);
    utterance.lang = 'hi-IN';
    utterance.rate = 0.8;
    speechSynthesis.speak(utterance);
  };

  const startListening = () => {
    if (!recognition) return;

    setIsListening(true);
    setFeedback('Listening...');
    recognition.start();

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      const expectedText = sentences[currentIndex].hindi;
      
      if (transcript.toLowerCase() === expectedText.toLowerCase()) {
        setFeedback('Correct! ✨');
        setShowEnglish(true);
      } else {
        setFeedback('Try again');
      }
      setIsListening(false);
    };

    recognition.onerror = () => {
      setFeedback('Error occurred. Please try again.');
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };
  };

  const handleNext = () => {
    if (currentIndex < sentences.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowEnglish(false);
      setFeedback('');
    } else {
      setFeedback('All sentences completed!');
    }
  };

  return (
    <div className="app-container">
      <div className="content-container">
        <div className="sentence-container">
          <h2 className="hindi-text">{sentences[currentIndex].hindi}</h2>
          {showEnglish && (
            <p className="english-text">{sentences[currentIndex].english}</p>
          )}
        </div>

        <div className="button-container">
          <button onClick={speakHindi} className="action-button listen-button">
            🔊 Listen Again
          </button>

          <button 
            onClick={startListening}
            disabled={isListening}
            className={`action-button speak-button ${isListening ? 'disabled' : ''}`}
          >
            🎤 {isListening ? 'Listening...' : 'Speak Now'}
          </button>

          {feedback && (
            <div className={`feedback ${feedback.includes('Correct') ? 'success' : 'error'}`}>
              {feedback}
            </div>
          )}

          {showEnglish && (
            <button onClick={handleNext} className="action-button next-button">
              Continue
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default HindiLearningApp;