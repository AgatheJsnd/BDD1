import React, { useState } from 'react';
import PuzzlePiece from './components/PuzzlePiece';
import Window from './components/Window';

function App() {
  // État pour gérer les pièces de puzzle
  const [puzzlePieces, setPuzzlePieces] = useState([
    { 
      id: 1,
      color: 'bg-blue-500',
      title: 'Projets Bleus',
      content: 'Voici la liste de vos projets en cours...',
      hasActionButton: true, // Seule la bleue aura le bouton
      position: { x: window.innerWidth * 0.35, y: window.innerHeight * 0.5 },
      rotation: 0,
      isDragging: false
    },
    { 
      id: 2,
      color: 'bg-green-500',
      title: 'Statut Vert',
      content: 'Tous les systèmes sont opérationnels.',
      hasActionButton: true, // Ajout du bouton
      position: { x: window.innerWidth * 0.5, y: window.innerHeight * 0.5 },
      rotation: 0,
      isDragging: false
    },
    { 
      id: 3,
      color: 'bg-red-500',
      title: 'Alertes Rouges',
      content: 'Attention : 3 notifications importantes !',
      hasActionButton: true, // Ajout du bouton
      position: { x: window.innerWidth * 0.65, y: window.innerHeight * 0.5 },
      rotation: 0,
      isDragging: false
    },
  ]);

  const [draggedPiece, setDraggedPiece] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [startClickPos, setStartClickPos] = useState({ x: 0, y: 0 });
  
  // Fenêtre ouverte (null si aucune)
  const [activeWindow, setActiveWindow] = useState(null);

  // Fonction pour commencer à déplacer une pièce
  const handleMouseDown = (e, pieceId) => {
    e.preventDefault();
    const piece = puzzlePieces.find(p => p.id === pieceId);
    if (piece) {
      setDraggedPiece(pieceId);
      setStartClickPos({ x: e.clientX, y: e.clientY }); // On stocke la position de départ
      setDragOffset({
        x: e.clientX - piece.position.x,
        y: e.clientY - piece.position.y
      });
      
      setPuzzlePieces(pieces => 
        pieces.map(p => 
          p.id === pieceId ? { ...p, isDragging: true } : p
        )
      );
    }
  };

  // Fonction pour déplacer la pièce
  const handleMouseMove = (e) => {
    if (draggedPiece !== null) {
      setPuzzlePieces(pieces =>
        pieces.map(piece =>
          piece.id === draggedPiece
            ? {
                ...piece,
                position: {
                  x: e.clientX - dragOffset.x,
                  y: e.clientY - dragOffset.y
                }
              }
            : piece
        )
      );
    }
  };

  // Fonction pour arrêter le déplacement (et gérer le clic)
  const handleMouseUp = (e) => {
    if (draggedPiece !== null) {
      // Calcul de la distance parcourue depuis le clic
      const distance = Math.hypot(e.clientX - startClickPos.x, e.clientY - startClickPos.y);
      
      // Si on a bougé de moins de 10 pixels, c'est un CLIC -> Ouvrir la fenêtre
      if (distance < 10) {
        const piece = puzzlePieces.find(p => p.id === draggedPiece);
        setActiveWindow(piece);
      }

      setPuzzlePieces(pieces =>
        pieces.map(p =>
          p.id === draggedPiece ? { ...p, isDragging: false } : p
        )
      );
      setDraggedPiece(null);
    }
  };

  return (
    <div 
      className="relative h-screen w-screen overflow-hidden select-none"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Fond d'écran */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80)',
        }}
      >
        <div className="absolute inset-0 bg-black/20"></div>
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
            isDragging={piece.isDragging}
            onMouseDown={(e) => handleMouseDown(e, piece.id)}
          />
        ))}

        {/* Fenêtre active (Onglet) */}
        {activeWindow && (
          <Window 
            title={activeWindow.title}
            content={activeWindow.content}
            color={activeWindow.color}
            hasActionButton={activeWindow.hasActionButton} // On passe l'info au composant Window
            onClose={() => setActiveWindow(null)}
          />
        )}
      </div>
    </div>
  );
}

export default App;
