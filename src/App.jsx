import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PuzzlePiece from './components/PuzzlePiece';
import LoginModal from './components/LoginModal';
import { saveUserData, getAllUsers } from './lib/userService';
import Quiz from './components/Quiz';
import EvaluationExpert from './components/EvaluationExpert';
import PageBleue from './components/PageBleue';
import PageVerte from './components/PageVerte';
import PageRouge from './components/PageRouge';

function App() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [completedSteps, setCompletedSteps] = useState([]); // [1, 2, 3]

  // Ouvrir la modale après 1 seconde
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoginModalOpen(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = async (userData) => {
    setUser(userData);
    setIsLoginModalOpen(false);
    await saveUserData(userData);
  };

  // État pour savoir quelle page est active (null = bureau principal)
  const [activePage, setActivePage] = useState(null);

  // Étape courante (premier non complété)
  const currentStep = [1, 2, 3].find(step => !completedSteps.includes(step)) || 4;

  const puzzlePieces = [
    { 
      id: 1,
      color: 'bg-gradient-to-br from-[#8EC6EA] to-[#F2F8FD]',
      blobRadius: '50%',
      label: 1,
      labelFill: '#eaf7ff',
      labelGlowRgb: '142,198,234',
      position: { x: window.innerWidth * 0.25, y: window.innerHeight * 0.5 },
      rotation: 0,
      isHeartbeat: currentStep === 1,
      isLocked: false,
    },
    { 
      id: 2,
      color: 'bg-gradient-to-br from-[#97CBB6] to-[#F2F8FD]',
      blobRadius: '50%',
      label: 2,
      labelFill: '#f0ffe6',
      labelGlowRgb: '151,203,182',
      position: { x: window.innerWidth * 0.5, y: window.innerHeight * 0.5 },
      rotation: 0,
      isHeartbeat: currentStep === 2,
      isLocked: !completedSteps.includes(1),
    },
    { 
      id: 3,
      color: 'bg-gradient-to-br from-[#F3E29D] to-[#FBF6E6]',
      blobRadius: '50%',
      label: 3,
      labelFill: '#fff0f0',
      labelGlowRgb: '243,226,157',
      position: { x: window.innerWidth * 0.75, y: window.innerHeight * 0.5 },
      rotation: 0,
      isHeartbeat: currentStep === 3,
      isLocked: !completedSteps.includes(2),
    },
  ];

  const handlePieceClick = (pieceId) => {
    const piece = puzzlePieces.find(p => p.id === pieceId);
    if (piece && !piece.isLocked) {
      setActivePage(pieceId);
    }
  };

  const handleStepComplete = (stepId) => {
    if (!completedSteps.includes(stepId)) {
      setCompletedSteps([...completedSteps, stepId]);
    }
    setActivePage(null);
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden select-none">
      <div className="absolute inset-0 bg-[#d3d3d3]"></div>

      <AnimatePresence mode="wait">
        {activePage === null ? (
          <motion.div
            key="desktop"
            initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
            transition={{ 
              duration: 0.8, 
              ease: [0.4, 0, 0.2, 1] 
            }}
            className="relative h-full w-full"
          >
            <h1 
              className="absolute text-5xl font-medium text-gray-800 tracking-wide drop-shadow-md text-center w-full"
              style={{ 
                top: '15%',
                left: '50%', 
                transform: 'translate(-50%, -50%)',
                fontFamily: "'Montserrat', sans-serif"
              }}
            >
              Quelle est ton école ?
            </h1>

            {puzzlePieces.map((piece) => (
              <div 
                key={piece.id} 
                style={{ 
                  opacity: piece.isLocked ? 0.4 : 1,
                  filter: piece.isLocked ? 'grayscale(1) opacity(0.7)' : 'none',
                  transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                <PuzzlePiece
                  color={piece.color}
                  blobRadius={piece.blobRadius}
                  label={piece.label}
                  labelFill={piece.labelFill}
                  labelGlowRgb={piece.labelGlowRgb}
                  position={piece.position}
                  rotation={piece.rotation}
                  onClick={() => handlePieceClick(piece.id)}
                  isClickable={!piece.isLocked}
                  isHeartbeat={piece.isHeartbeat}
                />
              </div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="page"
            initial={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
            transition={{ 
              duration: 0.8, 
              ease: [0.4, 0, 0.2, 1] 
            }}
            className="relative z-50 h-full w-full"
          >
            {activePage === 1 && (
              <PageBleue 
                onBack={() => setActivePage(null)} 
                onComplete={() => handleStepComplete(1)}
                userEmail={user?.email} 
              />
            )}
            {activePage === 2 && (
              <PageVerte 
                onBack={() => setActivePage(null)} 
                onComplete={() => handleStepComplete(2)}
              />
            )}
            {activePage === 3 && (
              <EvaluationExpert 
                onBack={() => setActivePage(null)} 
                onComplete={() => handleStepComplete(3)}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
      
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
        onLogin={handleLogin}
      />
    </div>
  );
}

export default App;
