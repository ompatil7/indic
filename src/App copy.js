import React, { useState, useEffect, useMemo, useCallback } from 'react';
import './index.css';
import Avatar from './Avatar';
import { SpeechProvider, useSpeechState } from './Avatar';

function AppContent() {
  const { setIsTeaching } = useSpeechState();

  const lessons = useMemo(() => [
    { text: "अ – अ से अनार। यह अनार है, यह लाल और रस भरा फल है।", expected: "अनार" },
    { text: "आ – आ से आम। यह आम है, गर्मी का राजा फल।", expected: "आम" },
    { text: "इ – इ से इमली। यह इमली है, खट्टी-मीठी।", expected: "इमली" },
    { text: "ई – ई से ईख। यह ईख है, जिससे चीनी बनती है।", expected: "ईख" },
  ], []);

  const [currentLesson, setCurrentLesson] = useState(0);
  const [lessonText, setLessonText] = useState(lessons[0].text);
  const [recognition, setRecognition] = useState(null);
  const [speechResult, setSpeechResult] = useState('');

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

    speech.onstart = () => {
      setIsTeaching(true);
    };

    speech.onend = () => {
      setIsTeaching(false);
      if (callback) callback();
    };

    speech.onerror = () => {
      setIsTeaching(false);
    };

    speechSynthesis.speak(speech);
  }, [setIsTeaching]);

  const startSpeechRecognition = useCallback((expectedText) => {
    if (!recognition) return;

    recognition.start();
    recognition.onresult = function (event) {
      const speechResultText = event.results[0][0].transcript.trim();
      setSpeechResult(`You said: ${speechResultText}`);

      if (speechResultText === expectedText) {
        playAudio("बहुत बढ़िया! चलिए आगे बढ़ते हैं।", () => {
          const nextLessonIndex = currentLesson + 1;
          if (nextLessonIndex < lessons.length) {
            setCurrentLesson(nextLessonIndex);
          }
        });
      } else {
        playAudio("फिर से कोशिश कीजिए।");
      }
    };

    recognition.onerror = function () {
      playAudio("फिर से कोशिश कीजिए।");
    };
  }, [recognition, playAudio, currentLesson, lessons.length]);

  const teachLesson = useCallback(() => {
    if (currentLesson < lessons.length) {
      const lesson = lessons[currentLesson];
      playAudio(lesson.text, () => {
        playAudio("मेरे बाद दोहराएँ।", () => {
          startSpeechRecognition(lesson.expected);
        });
      });
    }
  }, [currentLesson, lessons, playAudio, startSpeechRecognition]);

  useEffect(() => {
    if (currentLesson < lessons.length) {
      setLessonText(lessons[currentLesson].text);
      teachLesson();
    } else {
      setLessonText("शानदार! आपने सभी पाठ पूरे कर लिए।");
      playAudio("शानदार! आपने सभी पाठ पूरे कर लिए।");
    }
  }, [currentLesson, lessons, playAudio, teachLesson]);

  return (
    <div className="container">
      <h1>Hindi Language Learning for Kids</h1>
      <div id="avatarContainer" style={{ width: '100%', height: '400px' }}>
        <Avatar />
      </div>
      <div id="lessonContainer">
        <p>{lessonText}</p>
        <button onClick={teachLesson}>Teach</button>
        <button onClick={() => {
          if (currentLesson < lessons.length) {
            startSpeechRecognition(lessons[currentLesson].expected);
          }
        }}>Repeat</button>
        <p id="speechResult">{speechResult}</p>
      </div>
    </div>
  );
}

function App() {
  return (
    <SpeechProvider>
      <AppContent />
    </SpeechProvider>
  );
}

export default App;