import React, { useState } from 'react';
import PuzzlePiece from './components/PuzzlePiece';
import Window from './components/Window';

function App() {
  // État pour gérer les pièces de puzzle
  // Plus besoin de isDragging ici
  const puzzlePieces = [
    { 
      id: 1,
      color: 'bg-blue-500',
      title: 'Projets Bleus',
      content: 'Voici la liste de vos projets en cours...',
      hasActionButton: true, 
      position: { x: window.innerWidth * 0.25, y: window.innerHeight * 0.5 },
      rotation: 0,
    },
    { 
      id: 2,
      color: 'bg-green-500',
      title: 'Statut Vert',
      content: 'Tous les systèmes sont opérationnels.',
      hasActionButton: true, 
      position: { x: window.innerWidth * 0.5, y: window.innerHeight * 0.5 },
      rotation: 0,
    },
    { 
      id: 3,
      color: 'bg-red-500',
      title: 'Alertes Rouges',
      content: 'Attention : 3 notifications importantes !',
      hasActionButton: true, 
      position: { x: window.innerWidth * 0.75, y: window.innerHeight * 0.5 },
      rotation: 0,
    },
  ];

  // Fenêtre ouverte (null si aucune)
  const [activeWindow, setActiveWindow] = useState(null);

  // Fonction simple pour ouvrir la fenêtre au clic
  const handlePieceClick = (piece) => {
    setActiveWindow(piece);
  };

  // Fonction pour passer à la fenêtre suivante
  const handleNextWindow = () => {
    if (!activeWindow) return;
    
    const currentId = activeWindow.id;
    let nextId = currentId + 1;
    
    if (nextId > 3) {
      setActiveWindow(null); // Fin de la séquence
      return;
    }

    const nextPiece = puzzlePieces.find(p => p.id === nextId);
    if (nextPiece) {
      setActiveWindow(nextPiece);
    }
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden select-none">
      {/* Fond d'écran noir */}
      <div className="absolute inset-0 bg-black">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black"></div>
      </div>

      {/* Contenu du bureau */}
      <div className="relative h-full w-full">
        {/* Pièces de puzzle fixes (boutons) */}
        {puzzlePieces.map((piece) => (
          <PuzzlePiece
            key={piece.id}
            color={piece.color}
            position={piece.position}
            rotation={piece.rotation}
            onClick={() => handlePieceClick(piece)}
          />
        ))}

        {/* Fenêtre active (Onglet) */}
        {activeWindow && (
          <Window 
            title={activeWindow.title}
            content={activeWindow.content}
            color={activeWindow.color}
            hasActionButton={activeWindow.hasActionButton}
            onNext={handleNextWindow}
            onClose={() => setActiveWindow(null)}
          />
        )}
      </div>
    </div>
  );
}

export default App;
