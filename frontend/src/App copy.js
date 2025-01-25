import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './index.css';
import Avatar from './Avatar';
import Game from './game';
import ThoughtBubble from './ThoughtBubble';
import { SpeechProvider, useSpeechState } from './Avatar';
import syllabusData from './syllabus/swar.json';

function HomePage() {
  const { setIsTeaching, setIsClapping, setBowing, isTeaching } = useSpeechState();
  const [highlightedWord, setHighlightedWord] = useState('');

  const lessons = useMemo(() => syllabusData, []);

  const [currentLesson, setCurrentLesson] = useState(0);
  const [lessonText, setLessonText] = useState('');
  const [englishText, setEnglishText] = useState('');
  const [recognition, setRecognition] = useState(null);
  const [speechResult, setSpeechResult] = useState('');

  useEffect(() => {
    if (lessons.length > 0) {
      setLessonText(lessons[0].text);
      setEnglishText(lessons[0].english);
    }
  }, [lessons]);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.lang = "hi-IN";
      setRecognition(recognitionInstance);
    }
  }, []);

  const playAudio = useCallback((text, callback) => {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "hi-IN";
    speech.rate = 0.9;
    speech.pitch = 1.1;
    speech.volume = 1.0;

    setIsTeaching(true);

    if (text === lessons[0].text) {
      setBowing(true);
      setTimeout(() => setBowing(false), 2000);
    }

    const targetWord = text.split('।')[0].split('से ')[1]?.split(' ')[0];
    if (targetWord) {
      setHighlightedWord(targetWord);
    }

    speech.onstart = () => {
      setIsTeaching(true);
    };

    speech.onend = () => {
      setIsTeaching(false);
      if (callback) {
        setTimeout(() => {
          setHighlightedWord('');
          callback();
        }, 500);
      } else {
        setHighlightedWord('');
      }
    };

    speech.onerror = () => {
      setIsTeaching(false);
      setHighlightedWord('');
    };

    speechSynthesis.speak(speech);
  }, [setIsTeaching, setBowing, lessons]);

  const startSpeechRecognition = useCallback((expectedText) => {
    if (!recognition) return;

    recognition.start();
    recognition.onresult = function (event) {
      const speechResultText = event.results[0][0].transcript.trim();
      setSpeechResult(speechResultText);

      if (speechResultText === expectedText) {
        setIsClapping(true);
        
        playAudio("बहुत बढ़िया! चलिए आगे बढ़ते हैं।", () => {
          setIsClapping(false);
          const nextLessonIndex = currentLesson + 1;
          if (nextLessonIndex < lessons.length) {
            setCurrentLesson(nextLessonIndex);
            setLessonText(lessons[nextLessonIndex].text);
            setEnglishText(lessons[nextLessonIndex].english);
          }
        });
      } else {
        playAudio("फिर से कोशिश कीजिए।");
      }
    };

    recognition.onerror = function () {
      playAudio("फिर से कोशिश कीजिए।");
    };
  }, [recognition, playAudio, currentLesson, lessons, setIsClapping]);

  const teachLesson = useCallback(() => {
    if (currentLesson < lessons.length) {
      const lesson = lessons[currentLesson];
      
      if (currentLesson === 0) {
        playAudio(lesson.text, () => {
          const nextLessonIndex = currentLesson + 1;
          if (nextLessonIndex < lessons.length) {
            setCurrentLesson(nextLessonIndex);
            setLessonText(lessons[nextLessonIndex].text);
            setEnglishText(lessons[nextLessonIndex].english);
          }
        });
      } else {
        playAudio(lesson.text, () => {
          playAudio("मेरे बाद दोहराएँ।", () => {
            startSpeechRecognition(lesson.expected);
          });
        });
      }
    }
  }, [currentLesson, lessons, playAudio, startSpeechRecognition]);

  useEffect(() => {
    if (currentLesson < lessons.length) {
      setLessonText(lessons[currentLesson].text);
      setEnglishText(lessons[currentLesson].english);
      teachLesson();
    } else {
      setLessonText("शानदार! आपने सभी पाठ पूरे कर लिए।");
      setEnglishText("Excellent! You have completed all lessons.");
      setIsClapping(true);
      playAudio("शानदार! आपने सभी पाठ पूरे कर लिए।", () => {
        setIsClapping(false);
      });
    }
  }, [currentLesson, lessons, playAudio, teachLesson, setIsClapping]);

  const renderHighlightedText = (text) => {
    if (!highlightedWord) return text;
    
    const parts = text.split(highlightedWord);
    return (
      <>
        {parts.map((part, index) => (
          <React.Fragment key={index}>
            {part}
            {index < parts.length - 1 && <span className="highlighted-text">{highlightedWord}</span>}
          </React.Fragment>
        ))}
      </>
    );
  };

  return (
    <div className="container">
      <div className="viewport-container">
        <div className="avatar-wrapper">
          <div id="avatarContainer">
            <Avatar
              cameraPosition={[0, -1, 8]}
              targetPosition={[0, 0, 0]}
              fov={45}
              enableZoom={false}
              minZoom={2}
              maxZoom={10}
              initialScale={4.5}
            />
          </div>
  {isTeaching && (
    <ThoughtBubble 
      currentLesson={currentLesson}
      lessons={lessons}
    />
  )}
</div>
      </div>
      <div id="lessonContainer">
        <div className="p-button-wrapper">
          <button onClick={teachLesson}>▶️</button>
          <button
            onClick={() => {
              if (currentLesson < lessons.length) {
                startSpeechRecognition(lessons[currentLesson].expected);
              }
            }}
          >
            🔁
          </button>
        </div>
        <div className="hindi-text-box">
          <p className="hindi-text">{renderHighlightedText(lessonText)}</p>
          <p className="english-text">{englishText}</p>
        </div>
        <Link to="/game">
          <button className="game-button">Play Matching Game</button>
        </Link>
        <p id="speechResult">{speechResult}</p>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <SpeechProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/game" element={<Game />} />
        </Routes>
      </SpeechProvider>
    </Router>
  );
}

export default App;
