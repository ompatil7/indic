import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './HomePage';
import LessonPage from './LessonPage';
import Match from './Match';
import Landing from './Landing';
import HygineAnimation from './HygineAnimation';
import { SpeechProvider } from './Avatar';
import Signup from "./Signup";
import Login from "./Login";
import Sentence from "./Sentence";
import FlippedCard from './FlippedCard';
import FillInTheBlanks from './FillInTheBlanks'
import HindiLearningApp from './HindiLearningApp'
import Frog from "./Frog";
import GamePage from "./GamePage";


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