import React, { useState, useEffect } from 'react';
import PuzzlePiece from './components/PuzzlePiece';
import LoginModal from './components/LoginModal';

function App() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [user, setUser] = useState(null);

  // Ouvrir la modale après 1 seconde comme demandé initialement
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoginModalOpen(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setIsLoginModalOpen(false);
    // Vous pouvez utiliser userData.name et userData.email ici
    console.log('Utilisateur connecté:', userData);
    alert(`Bonjour ${userData.name} !`);
  };

  // État pour gérer les pièces de puzzle avec leurs positions
  const [puzzlePieces, setPuzzlePieces] = useState([
    { 
      id: 1,
      color: 'text-blue-500', 
      position: { x: window.innerWidth * 0.65, y: window.innerHeight * 0.15 },
      rotation: 15,
      isDragging: false
    },
    { 
      id: 2,
      color: 'text-red-500', 
      position: { x: window.innerWidth * 0.75, y: window.innerHeight * 0.45 },
      rotation: -20,
      isDragging: false
    },
    { 
      id: 3,
      color: 'text-green-500', 
      position: { x: window.innerWidth * 0.60, y: window.innerHeight * 0.65 },
      rotation: 30,
      isDragging: false
    },
  ]);

  const [draggedPiece, setDraggedPiece] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Fonction pour commencer à déplacer une pièce
  const handleMouseDown = (e, pieceId) => {
    const piece = puzzlePieces.find(p => p.id === pieceId);
    if (piece) {
      setDraggedPiece(pieceId);
      setDragOffset({
        x: e.clientX - piece.position.x,
        y: e.clientY - piece.position.y
      });
      
      // Mettre la pièce en mode "dragging"
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

  // Fonction pour arrêter le déplacement
  const handleMouseUp = () => {
    if (draggedPiece !== null) {
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
      {/* Fond d'écran avec image de haute qualité */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80)',
        }}
      >
        {/* Overlay sombre pour améliorer la lisibilité */}
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      {/* Contenu du bureau */}
      <div className="relative h-full w-full">
        {/* Pièces de puzzle interactives */}
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
      </div>
      
      {/* Pop-up de connexion */}
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
        onLogin={handleLogin}
      />
    </div>
  );
}

export default App;

