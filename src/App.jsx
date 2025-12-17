import React, { useState, useEffect } from 'react';
import PuzzlePiece from './components/PuzzlePiece';
import LoginModal from './components/LoginModal';
import { saveUserData, getAllUsers } from './lib/userService';
import Quiz from './components/Quiz';
import EvaluationExpert from './components/EvaluationExpert';
import PageBleue from './components/PageBleue';

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

  const handleLogin = async (userData) => {
    setUser(userData);
    setIsLoginModalOpen(false);
    
    // Envoyer les données à Supabase (silencieusement)
    console.log('Envoi des données à Supabase:', userData);
    const result = await saveUserData(userData);
    
    if (result.success) {
      console.log('Données enregistrées:', result.data);
    } else {
      console.error('Erreur:', result.error);
    }
  };

  // État pour gérer les pièces de puzzle avec leurs positions
  const [puzzlePieces] = useState([
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
  ]);

  // État pour savoir quelle page est active (null = bureau principal)
  const [activePage, setActivePage] = useState(null);

  // Fonction pour ouvrir une page au clic sur un carré
  const handlePieceClick = (pieceId) => {
    setActivePage(pieceId);
  };

  // Fonction pour revenir au bureau
  const handleBack = () => {
    setActivePage(null);
  };

  // Fonction pour passer à la page suivante
  const handleNext = () => {
    if (activePage === null) return;
    
    const nextId = activePage + 1;
    
    if (nextId > 3) {
      // Fin de la séquence : retour au bureau
      setActivePage(null);
      return;
    }

    setActivePage(nextId);
  };

  // Si le carré bleu (id: 1) est cliqué, on affiche la Page Bleue
  if (activePage === 1) {
    return <PageBleue onBack={handleBack} onNext={() => setActivePage(2)} />;
  }

  // Si le carré vert (id: 2) est cliqué, on affiche le Quiz
  if (activePage === 2) {
    return <Quiz onBack={handleBack} onNext={() => setActivePage(3)} />;
  }

  // Si le carré rouge (id: 3) est cliqué, on affiche l'Évaluation Expert
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
            onClick={() => handlePieceClick(piece.id)}
            isClickable={true}
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
