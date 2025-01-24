import React, { useState, useEffect, useCallback } from "react";
import "./Sentence.css";

const sentences = [
  {
    hindi: "आज का मौसम अच्छा है।",
    english: "The weather is nice today.",
    romanized: "Aaj ka mausam accha hai.",
    words: ["The", "weather", "is", "nice", "today"],
    extraWords: ["beautiful", "cold", "was", "will", "morning"]
  },
  {
    hindi: "मुझे यात्रा करना पसंद है।",
    english: "I like to travel.",
    romanized: "Mujhe yatra karna pasand hai.",
    words: ["I", "like", "to", "travel"],
    extraWords: ["want", "love", "hate", "going", "we"]
  },
  {
    hindi: "वह बहुत समझदार है।",
    english: "He/She is very wise.",
    romanized: "Woh bahut samajhdar hai.",
    words: ["He/She", "is", "very", "wise"],
    extraWords: ["they", "are", "was", "smart", "good"]
  },
  {
    hindi: "मेरे पास एक किताब है।",
    english: "I have a book.",
    romanized: "Mere paas ek kitaab hai.",
    words: ["I", "have", "a", "book"],
    extraWords: ["the", "had", "pen", "many", "will"]
  },
  {
    hindi: "हम शाम को पार्क में जाएंगे।",
    english: "We will go to the park in the evening.",
    romanized: "Hum shaam ko park mein jaayenge.",
    words: ["We", "will", "go", "to", "the", "park", "in", "the", "evening"],
    extraWords: ["morning", "today", "tomorrow", "they", "walk"]
  }
];

const Sentence = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedWords, setSelectedWords] = useState([]);
  const [availableWords, setAvailableWords] = useState([]);
  const [showTranslation, setShowTranslation] = useState(false);
  const [isError, setIsError] = useState(false);

  const shuffleArray = useCallback((array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }, []);

  const initializeWords = useCallback(() => {
    const currentSentence = sentences[currentQuestion];
    const allWords = [...currentSentence.words, ...currentSentence.extraWords];
    setAvailableWords(shuffleArray(allWords));
  }, [currentQuestion, shuffleArray]);

  const speakSentence = useCallback(() => {
    const utterance = new SpeechSynthesisUtterance(sentences[currentQuestion].hindi);
    utterance.lang = "hi-IN";
    utterance.rate = 0.8;
    window.speechSynthesis.speak(utterance);
  }, [currentQuestion]);

  useEffect(() => {
    initializeWords();
    speakSentence();
  }, [initializeWords, speakSentence]);

  const handleWordSelect = (word) => {
    if (!selectedWords.includes(word)) {
      setSelectedWords([...selectedWords, word]);
      setAvailableWords(availableWords.filter(w => w !== word));
      setIsError(false);
    }
  };

  const handleWordRemove = (word, index) => {
    const newSelected = [...selectedWords];
    newSelected.splice(index, 1);
    setSelectedWords(newSelected);
    setAvailableWords([...availableWords, word]);
    setIsError(false);
  };

  const checkAnswer = () => {
    const correctSentence = sentences[currentQuestion].words.join(" ");
    const userSentence = selectedWords.join(" ");
    
    if (correctSentence === userSentence) {
      setShowTranslation(true);
      setIsError(false);
      setTimeout(() => {
        if (currentQuestion < sentences.length - 1) {
          setCurrentQuestion(currentQuestion + 1);
          setSelectedWords([]);
          setShowTranslation(false);
        } else {
          alert("आप सभी सवालों को हल कर चुके हैं!");
        }
      }, 2000);
    } else {
      setIsError(true);
      setTimeout(() => {
        const allWords = [...selectedWords, ...availableWords];
        setSelectedWords([]);
        setAvailableWords(shuffleArray(allWords));
        setIsError(false);
      }, 1000);
    }
  };

  return (
    <div className="sentence-app-container">
      <h1 className="sentence-title">Translate this sentence</h1>

      <div className="sentence-container">
        <div className="sentence-speech-bubble">
          <button onClick={speakSentence} className="sentence-audio-button">🔊</button>
          {sentences[currentQuestion].hindi}
        </div>
      </div>

      {showTranslation && (
        <div className="sentence-translation">
          <p className="english">{sentences[currentQuestion].english}</p>
        </div>
      )}

      <div className="sentence-selected-words-container">
        {selectedWords.map((word, index) => (
          <button
            key={index}
            className="sentence-word-button selected"
            onClick={() => handleWordRemove(word, index)}
          >
            {word}
          </button>
        ))}
      </div>

      <div className="sentence-available-words-container">
        {availableWords.map((word, index) => (
          <button
            key={index}
            className="sentence-word-button"
            onClick={() => handleWordSelect(word)}
          >
            {word}
          </button>
        ))}
      </div>

      <button
        className={`sentence-check-button ${selectedWords.length > 0 ? 'active' : ''} ${isError ? 'error' : ''}`}
        onClick={checkAnswer}
        disabled={selectedWords.length === 0}
      >
        CHECK
      </button>
    </div>
  );
};

export default Sentence;