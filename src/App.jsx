import React, { useState } from 'react';
import PuzzlePiece from './components/PuzzlePiece';
import Quiz from './components/Quiz';
import EvaluationExpert from './components/EvaluationExpert';

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

  // État pour savoir quelle page est active (null = bureau principal)
  const [activePage, setActivePage] = useState(null);

  // Fonction pour ouvrir une page au clic sur un carré
  const handlePieceClick = (pieceId) => {
    // Le carré vert (id: 2) ouvre Quiz, le carré rouge (id: 3) ouvre EvaluationExpert
    if (pieceId === 2 || pieceId === 3) {
      setActivePage(pieceId);
    }
  };

  // Fonction pour revenir au bureau
  const handleBack = () => {
    setActivePage(null);
  };

  // Si le carré vert est cliqué, on affiche le Quiz
  if (activePage === 2) {
    return <Quiz onBack={handleBack} />;
  }

  // Si le carré rouge est cliqué, on affiche l'Évaluation Expert
  if (activePage === 3) {
    return <EvaluationExpert onBack={handleBack} />;
  }

  // Sinon, on affiche le bureau avec les carrés
  return (
    <div className="relative h-screen w-screen overflow-hidden select-none">
      {/* Fond d'écran noir */}
      <div className="absolute inset-0 bg-black">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black"></div>
      </div>

      {/* Contenu du bureau */}
      <div className="relative h-full w-full">
        {/* Pièces de puzzle */}
        {puzzlePieces.map((piece) => (
          <PuzzlePiece
            key={piece.id}
            color={piece.color}
            position={piece.position}
            rotation={piece.rotation}
            onClick={piece.id === 2 || piece.id === 3 ? () => handlePieceClick(piece.id) : undefined}
            isClickable={piece.id === 2 || piece.id === 3}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
