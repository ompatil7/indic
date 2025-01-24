import React from 'react';
import { Link } from 'react-router-dom';

const GamePage = () => {
  const gameRoutes = [
    { path: "/match", name: "Match Game", color: 'lightblue' },
    { path: "/sentence", name: "Sentence Game", color: 'lightgreen' },
    { path: "/flippedcard", name: "Flipped Card", color: 'lightcoral' },
    { path: "/fillintheblanks", name: "Fill in Blanks", color: 'lightyellow' },
    { path: "/hindilearningapp", name: "Hindi Learning", color: 'lightpink' },
    { path: "/frog", name: "Frog Game", color: 'lightgray' }
  ];

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '20px',
      gap: '10px',
      width:'100%'
    }}>
      {gameRoutes.map((route) => (
        <Link 
          key={route.path} 
          to={route.path} 
          style={{ 
            padding: '10px', 
            backgroundColor: route.color, 
            textDecoration: 'none',
            width: '200px',
            textAlign: 'center',
            borderRadius: '5px'
          }}
        >
          {route.name}
        </Link>
      ))}
    </div>
  );
};

export default GamePage;