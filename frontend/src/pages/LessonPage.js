import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import Avatar from '../components/Avatar/Avatar';
import ThoughtBubble from '../components/ThoughtBubble';
import { useSpeechState } from '../components/Avatar/Avatar';
import { ReactComponent as BackIcon } from '../assets/left.svg';
import { ReactComponent as PlayIcon } from '../assets/play.svg';
import { ReactComponent as MicIcon } from '../assets/mic.svg';
// import { levels } from './levels';
import "../index.css";

function LessonPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { levelFile } = location.state || { levelFile: 'swar.json' };
  
  const { isTeaching, setIsTeaching, setIsClapping, setBowing } = useSpeechState();
  const [highlightedWord, setHighlightedWord] = useState('');
  const [lessons, setLessons] = useState([]);
  const [currentLesson, setCurrentLesson] = useState(0);
  const [lessonText, setLessonText] = useState('');
  const [englishText, setEnglishText] = useState('');
  const [recognition, setRecognition] = useState(null);
  const [speechResult, setSpeechResult] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    const loadLessons = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/syllabus/${levelFile}`);
        if (!response.ok) {
          throw new Error('Failed to load lesson data');
        }
        const data = await response.json();
        setLessons(data);
        if (data.length > 0) {
          setLessonText(data[0].text);
          setEnglishText(data[0].english);
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading lessons:', error);
        setError(error.message);
        setIsLoading(false);
      }
    };
    loadLessons();
  }, [levelFile]);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.lang = "hi-IN";
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      setRecognition(recognitionInstance);
    }
  }, []);

  useEffect(() => {
    return () => {
      speechSynthesis.cancel();
    };
  }, []);

  const playAudio = useCallback(async (text, callback) => {
    speechSynthesis.cancel();
    
    return new Promise((resolve) => {
      if (isSpeaking) {
        resolve();
        return;
      }

      const speech = new SpeechSynthesisUtterance(text);
      speech.lang = "hi-IN";
      speech.rate = 0.9;
      speech.pitch = 1.1;
      speech.volume = 1.0;

      setIsTeaching(true);
      setIsSpeaking(true);

      if (text === lessons[0]?.text) {
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
        setHighlightedWord('');
        setIsSpeaking(false);
        if (callback) {
          callback();
        }
        resolve();
      };

      speech.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        setIsTeaching(false);
        setHighlightedWord('');
        setIsSpeaking(false);
        resolve();
      };

      speechSynthesis.speak(speech);
    });
  }, [setIsTeaching, setBowing, lessons, isSpeaking]);

  const startSpeechRecognition = useCallback((expectedText) => {
    if (!recognition || isListening || isSpeaking) return;

    setIsListening(true);
    recognition.start();
    
    recognition.onresult = function(event) {
      const speechResultText = event.results[0][0].transcript.trim();
      setSpeechResult(speechResultText);
      setIsListening(false);

      if (speechResultText === expectedText) {
        setIsClapping(true);
        
        playAudio("बहुत बढ़िया! चलिए आगे बढ़ते हैं।").then(() => {
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

    recognition.onerror = function(event) {
      console.error('Speech recognition error:', event);
      setIsListening(false);
      playAudio("फिर से कोशिश कीजिए।");
    };

    recognition.onend = function() {
      setIsListening(false);
    };
  }, [recognition, playAudio, currentLesson, lessons, setIsClapping, isListening, isSpeaking]);

  const teachLesson = useCallback(async () => {
    if (currentLesson < lessons.length && !isSpeaking) {
      const lesson = lessons[currentLesson];
      
      if (currentLesson === 0) {
        await playAudio(lesson.text);
        const nextLessonIndex = currentLesson + 1;
        if (nextLessonIndex < lessons.length) {
          setCurrentLesson(nextLessonIndex);
          setLessonText(lessons[nextLessonIndex].text);
          setEnglishText(lessons[nextLessonIndex].english);
        }
      } else {
        await playAudio(lesson.text);
        await new Promise(resolve => setTimeout(resolve, 500));
        await playAudio("मेरे बाद दोहराएँ");
        setTimeout(() => {
          startSpeechRecognition(lesson.expected);
        }, 500);
      }
    }
  }, [currentLesson, lessons, playAudio, startSpeechRecognition, isSpeaking]);

  useEffect(() => {
    let mounted = true;
    
    if (!isLoading && lessons.length > 0 && currentLesson === 0 && !isSpeaking) {
      const timer = setTimeout(() => {
        if (mounted) {
          teachLesson();
        }
      }, 1000);
      
      return () => {
        mounted = false;
        clearTimeout(timer);
      };
    }
  }, [isLoading, lessons, currentLesson, teachLesson, isSpeaking]);

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

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading lesson...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error Loading Lesson</h2>
        <p>{error}</p>
        <button onClick={() => navigate('/')}>←</button>
      </div>
    );
  }
  const handleNavigate = () => {
    navigate('/home');
  };
  return (
    <div className="container body">
    {/* Back Button */}
    <div className="absolute top-4 left-4">
      <BackIcon
        className="back-button"
        onClick={handleNavigate}
        style={{ cursor: 'pointer' }}
      />
    </div>

    {/* Main Content */}
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
          <ThoughtBubble currentLesson={currentLesson} lessons={lessons} />
        )}
      </div>
    </div>

    <div id="lessonContainer">
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${(currentLesson / lessons.length) * 100}%` }}
        />
        <span className="progress-text">
          {currentLesson}/{lessons.length} Lessons
        </span>
      </div>

      <div className="p-button-wrapper flex items-center">
          <button 
            className="control-button mr-2"
            onClick={teachLesson}
            disabled={isSpeaking}
            aria-label="Play lesson"
          >
            <PlayIcon className="icon" />
          </button>
          <button
            className="control-button mr-2"
            onClick={() => {
              if (currentLesson < lessons.length && !isSpeaking) {
                startSpeechRecognition(lessons[currentLesson].expected);
              }
            }}
            disabled={isSpeaking}
            aria-label="Repeat lesson"
          >
            <MicIcon className="icon mic " />
          </button>
          <Link to="/flippedcard">
          <button className="control-button mr2 ">Game</button>
        </Link>
        </div>

        <div className="hindi-text-box w-[700px]">
          <p className="hindi-text">{renderHighlightedText(lessonText)}</p>
          <p className="english-text">{englishText}</p>
        </div>


        {speechResult && (
          <div id="speechResult">
            <p>You said: {speechResult}</p>
          </div>
        )}

        {currentLesson >= lessons.length && (
          <div className="lesson-complete">
            <h3>शानदार! आपने सभी पाठ पूरे कर लिए।</h3>
            <p>Excellent! You have completed all lessons.</p>
          </div>
        )}

        
      </div>
    </div>
  );
}

export default LessonPage;