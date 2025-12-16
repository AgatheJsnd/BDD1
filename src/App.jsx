import React, { useState } from 'react';
import PuzzlePiece from './components/PuzzlePiece';

function App() {
  // État pour gérer les pièces de puzzle
  const puzzlePieces = [
    { 
      id: 1,
      color: 'bg-blue-500',
      position: { x: window.innerWidth * 0.25, y: window.innerHeight * 0.5 },
      rotation: 0,
    },
    { 
      id: 2,
      color: 'bg-green-500',
      position: { x: window.innerWidth * 0.5, y: window.innerHeight * 0.5 },
      rotation: 0,
    },
    { 
      id: 3,
      color: 'bg-red-500',
      position: { x: window.innerWidth * 0.75, y: window.innerHeight * 0.5 },
      rotation: 0,
    },
  ];

  return (
    <div className="relative h-screen w-screen overflow-hidden select-none">
      {/* Fond d'écran noir */}
      <div className="absolute inset-0 bg-black">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black"></div>
      </div>

      {/* Contenu du bureau */}
      <div className="relative h-full w-full">
        {/* Pièces de puzzle fixes (non cliquables) */}
        {puzzlePieces.map((piece) => (
          <PuzzlePiece
            key={piece.id}
            color={piece.color}
            position={piece.position}
            rotation={piece.rotation}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
