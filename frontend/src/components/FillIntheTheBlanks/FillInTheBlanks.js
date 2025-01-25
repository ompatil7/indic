import React, { useState, useEffect } from "react";
import "./FillInTheBlanks.css";

const sentences = [
  { 
    text: "यह बिल्ली है।", 
    english: "This is a cat.",
    missing: "बिल्ली", 
    options: ["कुत्ता", "बिल्ली", "गाय"] 
  },
  { 
    text: "यह घर है।", 
    english: "This is a house.",
    missing: "घर", 
    options: ["गाड़ी", "घर", "पानी"] 
  },
  { 
    text: "यह जल है।", 
    english: "This is water.",
    missing: "जल", 
    options: ["जल", "हवा", "आग"] 
  },
];

const FillInTheBlanks = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showNextButton, setShowNextButton] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);

  const generateSentence = (sentence, missingWord) => {
    return sentence.replace(missingWord, "___");
  };

  const speakSentence = (sentence) => {
    const utterance = new SpeechSynthesisUtterance(sentence);
    utterance.lang = "hi-IN";
    utterance.rate = 0.8;
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    const sentence = sentences[currentQuestion].text;
    speakSentence(sentence);
  }, [currentQuestion]);

  const handleAnswer = (option) => {
    setSelectedAnswer(option);
    if (option === sentences[currentQuestion].missing) {
      setShowNextButton(true);
      setShowTranslation(true);
    }
  };

  const handleNext = () => {
    if (currentQuestion < sentences.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowNextButton(false);
      setShowTranslation(false);
    } else {
      alert("शाबाश! आपने सब सवाल हल कर लिए।");
    }
  };

  return (
    <div className="container">
      <h1 className="app-title">खाली जगह भरो</h1>
      
      <div className="question-section">
        {!showTranslation ? (
          <p className="question-text">
            {generateSentence(
              sentences[currentQuestion].text,
              sentences[currentQuestion].missing
            )}
          </p>
        ) : (
          <div className="translation-container">
            <p className="hindi-text">{sentences[currentQuestion].text}</p>
            <p className="english-text">{sentences[currentQuestion].english}</p>
          </div>
        )}

        <button
          className="speaker-button"
          onClick={() => speakSentence(sentences[currentQuestion].text)}
        >
          🔊
        </button>
      </div>

      <div className="options-container">
        {sentences[currentQuestion].options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswer(option)}
            disabled={showNextButton}
            className={`option-button ${
              selectedAnswer === option && option === sentences[currentQuestion].missing
                ? "selected"
                : ""
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      {showNextButton && (
        <button
          onClick={handleNext}
          className="next-button"
        >
          {currentQuestion < sentences.length - 1 ? "अगला सवाल" : "समाप्त"}
        </button>
      )}
    </div>
  );
};

export default FillInTheBlanks;

