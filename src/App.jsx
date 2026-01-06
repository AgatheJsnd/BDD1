import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PuzzlePiece from './components/PuzzlePiece';
import LoginModal from './components/LoginModal';
import ResumeNotification from './components/ResumeNotification';
import { saveUserData, getAllUsers } from './lib/userService';
import Quiz from './components/Quiz';
import EvaluationExpert from './components/EvaluationExpert';
import PageBleue from './components/PageBleue';
import PageVerte from './components/PageVerte';
import PageRouge from './components/PageRouge';
import ResultsPage from './components/ResultsPage';
import ResultLoader from './components/ResultLoader';

function App() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [completedSteps, setCompletedSteps] = useState([]); // [1, 2, 3]
  const [showResults, setShowResults] = useState(false);
  const [isLoadingResults, setIsLoadingResults] = useState(false);
  const [showResumeNotification, setShowResumeNotification] = useState(false);
  // Réponses persistées (pour retrouver les choix en revenant en arrière)
  const [blueAnswers, setBlueAnswers] = useState({});
  const [greenAnswers, setGreenAnswers] = useState({});
  const [redAnswers, setRedAnswers] = useState({ q1: '', q2: '', q3: '' });

  // Charger les données sauvegardées au démarrage
  useEffect(() => {
    const savedUser = localStorage.getItem('quiz_user');
    const savedCompletedSteps = localStorage.getItem('quiz_completedSteps');
    const savedBlueAnswers = localStorage.getItem('quiz_blueAnswers');
    const savedGreenAnswers = localStorage.getItem('quiz_greenAnswers');
    const savedRedAnswers = localStorage.getItem('quiz_redAnswers');
    const savedActivePage = localStorage.getItem('quiz_activePage');

    // Vérifier si l'utilisateur a commencé un quiz (a des réponses ou une page active)
    const hasStartedQuiz = (savedBlueAnswers && savedBlueAnswers !== '{}') || 
                          (savedGreenAnswers && savedGreenAnswers !== '{}') || 
                          (savedRedAnswers && savedRedAnswers !== '{"q1":"","q2":"","q3":""}') || 
                          savedActivePage;

    if (savedUser && hasStartedQuiz) {
      // Restaurer l'utilisateur et les données pour afficher l'interface du quiz
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        
        if (savedCompletedSteps) {
          setCompletedSteps(JSON.parse(savedCompletedSteps));
        }
        if (savedBlueAnswers) {
          setBlueAnswers(JSON.parse(savedBlueAnswers));
        }
        if (savedGreenAnswers) {
          setGreenAnswers(JSON.parse(savedGreenAnswers));
        }
        if (savedRedAnswers) {
          setRedAnswers(JSON.parse(savedRedAnswers));
        }
      } catch (e) {
        console.error('Erreur lors du chargement des données:', e);
      }
      
      // Afficher la notification pour reprendre (par-dessus l'interface du quiz)
      setShowResumeNotification(true);
      // S'assurer que le modal de connexion est fermé
      setIsLoginModalOpen(false);
      setIsInitialLoading(false);
    } else {
      // Ouvrir la modale après 1 seconde seulement si pas de quiz en cours
      const timer = setTimeout(() => {
        setIsLoginModalOpen(true);
        setIsInitialLoading(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  // Sauvegarder les réponses dans localStorage à chaque changement
  useEffect(() => {
    if (user) {
      localStorage.setItem('quiz_user', JSON.stringify(user));
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('quiz_completedSteps', JSON.stringify(completedSteps));
  }, [completedSteps]);

  useEffect(() => {
    localStorage.setItem('quiz_blueAnswers', JSON.stringify(blueAnswers));
  }, [blueAnswers]);

  useEffect(() => {
    localStorage.setItem('quiz_greenAnswers', JSON.stringify(greenAnswers));
  }, [greenAnswers]);

  useEffect(() => {
    localStorage.setItem('quiz_redAnswers', JSON.stringify(redAnswers));
  }, [redAnswers]);

  const handleLogin = async (userData) => {
    setUser(userData);
    setIsLoginModalOpen(false);
    await saveUserData(userData);
    // Sauvegarder dans localStorage
    localStorage.setItem('quiz_user', JSON.stringify(userData));
  };

  // Restaurer les données sauvegardées
  const handleContinue = () => {
    const savedUser = localStorage.getItem('quiz_user');
    const savedCompletedSteps = localStorage.getItem('quiz_completedSteps');
    const savedBlueAnswers = localStorage.getItem('quiz_blueAnswers');
    const savedGreenAnswers = localStorage.getItem('quiz_greenAnswers');
    const savedRedAnswers = localStorage.getItem('quiz_redAnswers');
    const savedActivePage = localStorage.getItem('quiz_activePage');

    // Restaurer l'utilisateur
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
      } catch (e) {
        console.error('Erreur lors du chargement des données utilisateur:', e);
      }
    }

    // Restaurer les étapes complétées
    if (savedCompletedSteps) {
      try {
        const steps = JSON.parse(savedCompletedSteps);
        setCompletedSteps(steps);
      } catch (e) {
        console.error('Erreur lors du chargement des étapes complétées:', e);
      }
    }

    // Restaurer les réponses bleues
    if (savedBlueAnswers) {
      try {
        const answers = JSON.parse(savedBlueAnswers);
        setBlueAnswers(answers);
      } catch (e) {
        console.error('Erreur lors du chargement des réponses bleues:', e);
      }
    }

    // Restaurer les réponses vertes
    if (savedGreenAnswers) {
      try {
        const answers = JSON.parse(savedGreenAnswers);
        setGreenAnswers(answers);
      } catch (e) {
        console.error('Erreur lors du chargement des réponses vertes:', e);
      }
    }

    // Restaurer les réponses rouges
    if (savedRedAnswers) {
      try {
        const answers = JSON.parse(savedRedAnswers);
        setRedAnswers(answers);
      } catch (e) {
        console.error('Erreur lors du chargement des réponses rouges:', e);
      }
    }

    // Restaurer ou déterminer la page active
    let pageToOpen = null;
    
    if (savedActivePage) {
      try {
        const pageId = parseInt(savedActivePage);
        if (pageId >= 1 && pageId <= 3) {
          pageToOpen = pageId;
        }
      } catch (e) {
        console.error('Erreur lors du chargement de la page active:', e);
      }
    }
    
    // Si aucune page active sauvegardée, déterminer quelle page ouvrir selon les réponses
    if (!pageToOpen) {
      try {
        const blueAnswers = savedBlueAnswers ? JSON.parse(savedBlueAnswers) : {};
        const greenAnswers = savedGreenAnswers ? JSON.parse(savedGreenAnswers) : {};
        const redAnswers = savedRedAnswers ? JSON.parse(savedRedAnswers) : {};
        const completedSteps = savedCompletedSteps ? JSON.parse(savedCompletedSteps) : [];

        // Vérifier si le quiz bleu est complété (3 réponses)
        const blueCompleted = blueAnswers[1] && blueAnswers[2] && blueAnswers[3];
        // Vérifier si le quiz vert est complété (3 réponses)
        const greenCompleted = greenAnswers[1] && greenAnswers[2] && greenAnswers[3];
        // Vérifier si le quiz rouge est complété (3 réponses)
        const redCompleted = redAnswers.q1 && redAnswers.q2 && redAnswers.q3;

        // Déterminer quelle page ouvrir
        if (!blueCompleted || !completedSteps.includes(1)) {
          pageToOpen = 1; // Ouvrir le quiz bleu
        } else if (!greenCompleted || !completedSteps.includes(2)) {
          pageToOpen = 2; // Ouvrir le quiz vert
        } else if (!redCompleted || !completedSteps.includes(3)) {
          pageToOpen = 3; // Ouvrir le quiz rouge
        }
        // Si tout est complété, on reste sur le bureau
      } catch (e) {
        console.error('Erreur lors de la détermination de la page:', e);
      }
    }

    // Ouvrir la page déterminée
    if (pageToOpen) {
      setActivePage(pageToOpen);
    }

    // Fermer la notification
    setShowResumeNotification(false);
    // S'assurer que le modal de connexion est fermé
    setIsLoginModalOpen(false);
  };

  // Retourner à l'accueil (fermer la notification et afficher le modal de connexion)
  const handleReturnHome = () => {
    // Vider localStorage
    localStorage.removeItem('quiz_user');
    localStorage.removeItem('quiz_completedSteps');
    localStorage.removeItem('quiz_blueAnswers');
    localStorage.removeItem('quiz_greenAnswers');
    localStorage.removeItem('quiz_redAnswers');
    localStorage.removeItem('quiz_activePage');

    // Réinitialiser les états
    setUser(null);
    setCompletedSteps([]);
    setBlueAnswers({});
    setGreenAnswers({});
    setRedAnswers({ q1: '', q2: '', q3: '' });
    setActivePage(null);
    
    // Fermer la notification
    setShowResumeNotification(false);
    // Afficher le modal de connexion
    setIsLoginModalOpen(true);
  };

  // État pour savoir quelle page est active (null = bureau principal)
  const [activePage, setActivePage] = useState(null);

  // Sauvegarder la page active dans localStorage
  useEffect(() => {
    if (activePage !== null) {
      localStorage.setItem('quiz_activePage', activePage.toString());
    } else {
      localStorage.removeItem('quiz_activePage');
    }
  }, [activePage]);

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
      const newCompletedSteps = [...completedSteps, stepId];
      setCompletedSteps(newCompletedSteps);
      
      // Si tous les 3 steps sont complétés, afficher le loader puis les résultats
      if (newCompletedSteps.length === 3) {
        setIsLoadingResults(true);
        setActivePage(null);
        setTimeout(() => {
          setIsLoadingResults(false);
          setShowResults(true);
        }, 3000);
      } else {
        setActivePage(null);
      }
    } else {
      setActivePage(null);
    }
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden select-none home-root">
      {/* Fond conditionnel : Image pendant le login, le loader ou les résultats, Autre image pour le bureau */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-700" 
        style={{ 
            backgroundImage: ((isLoginModalOpen && !showResumeNotification) || isLoadingResults || showResults || isInitialLoading) 
              ? "url('/background.png')" 
              : "url('/background_n&b.png')",
          backgroundColor: "transparent"
        }}
      ></div>

      <AnimatePresence mode="wait">
        {activePage !== null ? (
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
                initialAnswers={blueAnswers}
                onSaveAnswers={setBlueAnswers}
              />
            )}
            {activePage === 2 && (
              <PageVerte 
                onBack={() => setActivePage(null)} 
                onComplete={() => handleStepComplete(2)}
                userEmail={user?.email}
                initialAnswers={greenAnswers}
                onSaveAnswers={setGreenAnswers}
              />
            )}
            {activePage === 3 && (
              <EvaluationExpert 
                onBack={() => setActivePage(null)} 
                onComplete={() => handleStepComplete(3)}
                userEmail={user?.email}
                initialAnswers={redAnswers}
                onSaveAnswers={setRedAnswers}
              />
            )}
          </motion.div>
        ) : ((!isLoginModalOpen || showResumeNotification) && !showResults && !isLoadingResults && !isInitialLoading) ? (
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
              className="absolute text-5xl font-medium text-white tracking-wide drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] text-center w-full home-title"
              style={{ 
                top: '15%',
                left: '50%', 
                transform: 'translate(-50%, -50%)',
                fontFamily: "'Montserrat', sans-serif"
              }}
            >
              <span className="home-title-line">Tu es quel genre </span>
              <span className="home-title-line">de profil ?</span>
            </h1>

            <div className="home-pieces">
              {puzzlePieces.map((piece) => (
                <div 
                  key={piece.id}
                  className="home-piece"
                  style={{ 
                    opacity: piece.isLocked ? 0.4 : 1,
                    filter: piece.isLocked ? 'grayscale(1) opacity(0.7)' : 'none',
                    transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  <PuzzlePiece
                    color={piece.color}
                    blobRadius={piece.blobRadius}
                    sizeClass="w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56"
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

              {/* Bouton Voir mes résultats (centré par rapport aux ronds) */}
              {completedSteps.length === 3 && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="home-results-container"
                >
                  <button
                    onClick={() => {
                      setIsLoadingResults(true);
                      setTimeout(() => {
                        setIsLoadingResults(false);
                        setShowResults(true);
                      }, 3000);
                    }}
                    className="px-6 py-3.5 bg-gray-900/80 backdrop-blur-md text-white rounded-2xl font-bold shadow-2xl hover:bg-black transition-all hover:scale-105 active:scale-95 border border-white/10"
                  >
                    Voir mes résultats
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
      
      <ResultsPage 
        isOpen={showResults}
        userEmail={user?.email} 
        onBack={() => {
          setShowResults(false);
          setActivePage(null);
        }}
      />

      <AnimatePresence>
        {isLoadingResults && <ResultLoader />}
      </AnimatePresence>

      <LoginModal 
        isOpen={isLoginModalOpen && !showResumeNotification} 
        onClose={() => setIsLoginModalOpen(false)} 
        onLogin={handleLogin}
      />

      <ResumeNotification
        isOpen={showResumeNotification}
        onReturnHome={handleReturnHome}
        onContinue={handleContinue}
      />
    </div>
  );
}

export default App;
