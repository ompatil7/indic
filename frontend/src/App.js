import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LessonPage from './pages/LessonPage';
import Match from './components/Match/Match';
import Landing from './pages/Landing';
import HygineAnimation from './components/Hygine/HygineAnimation';
import { SpeechProvider } from './components/Avatar/Avatar';
import Signup from "./components/Auth/Signup";
import Login from "./components/Auth/Login";
import Sentence from "./components/Sentence/Sentence";
import FlippedCard from './components/FlippedCard/FlippedCard';
import FillInTheBlanks from './components/FillIntheTheBlanks/FillInTheBlanks'
import HindiLearningApp from './components/HindiLearningApp/HindiLearningApp'
import Frog from "./components/Frog/Frog";
import GamePage from "./pages/GamePage";


function App() {
  return (
    <Router>
      <SpeechProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/landing" />} />
          <Route path="/landing" element={<Landing />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/signup" element={<Signup/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/hygine" element={<HygineAnimation />} />
          <Route path="/lesson/:levelId" element={<LessonPage />} />
          <Route path="/match" element={<Match />} />
          <Route path="/sentence" element={<Sentence />} />
          <Route path="/flippedcard" element={<FlippedCard />} />
          <Route path="/fillintheblanks" element={<FillInTheBlanks/>}/>
          <Route path="/hindilearningapp" element={<HindiLearningApp/>}/>
          <Route path="/frog" element={<Frog />} />
          <Route path="/gamepage" element={<GamePage />} />
  
        </Routes>
        
      </SpeechProvider>
    </Router>
  );
}

export default App;