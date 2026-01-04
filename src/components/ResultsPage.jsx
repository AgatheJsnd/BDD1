import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { getUserByEmail } from '../lib/userService';

// Mapping inverse pour retrouver les réponses depuis les personas
const personaToAnswer = {
  'Finance shark': 'A',
  'Growth Hacker': 'B',
  'Data Detective': 'C',
  'Tech builder': 'D',
  'Visionnary Founder': 'E',
  'Creative Alchemist': 'F'
};

// Mapping inverse pour la question 1 du post-it vert
const techApetiteQ1ToAnswer = {
  'Profil Data/Maths': 'A',
  'Profil Appliqué/Ingé': 'B',
  'Profil Littéraire/Créa': 'C',
  'Profil Smart/Resourceful': 'D'
};

const ResultsPage = ({ userEmail, onBack, isOpen }) => {
  const [loading, setLoading] = useState(true);
  const [albertPercent, setAlbertPercent] = useState(0);
  const [eugeniaPercent, setEugeniaPercent] = useState(0);
  const [candidatData, setCandidatData] = useState(null);

  useEffect(() => {
    if (isOpen && userEmail) {
      calculateResults();
    }
  }, [userEmail, isOpen]);

  const calculateResults = async () => {
    try {
      setLoading(true);
      const result = await getUserByEmail(userEmail);
      
      if (!result.success || !result.data) {
        console.error('Impossible de récupérer les données');
        setLoading(false);
        return;
      }

      const data = result.data;
      setCandidatData(data);
      let albertScore = 0;
      let eugeniaScore = 0;

      if (data.persona_score && Array.isArray(data.persona_score)) {
        data.persona_score.forEach((persona) => {
          const answer = personaToAnswer[persona];
          if (answer) {
            if (['A', 'B', 'C'].includes(answer)) albertScore += 25;
            else if (['D', 'E', 'F'].includes(answer)) eugeniaScore += 25;
          }
        });
      }

      if (data.tech_apetite) {
        const techApetites = data.tech_apetite.split(',').map(t => t.trim());
        if (techApetites.length > 0) {
          const q1TechApetite = techApetites[0];
          const answer = techApetiteQ1ToAnswer[q1TechApetite];
          if (answer) {
            if (['A', 'B'].includes(answer)) albertScore += 25;
            else if (['C', 'D'].includes(answer)) eugeniaScore += 25;
          }
        }
      }

      setAlbertPercent(albertScore);
      setEugeniaPercent(eugeniaScore);
      setLoading(false);
    } catch (error) {
      console.error('Erreur lors du calcul des résultats:', error);
      setLoading(false);
    }
  };

  const winner = albertPercent > eugeniaPercent ? 'Albert School' : 
                 eugeniaPercent > albertPercent ? 'Eugenia School' : 
                 'Égalité';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden relative"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            {/* Bouton Retour (positionné comme sur les autres pages) */}
            <button 
              onClick={onBack}
              className="absolute top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors text-gray-700 font-semibold shadow-sm"
            >
              <ArrowLeft size={20} />
              Retour
            </button>

            <div className="overflow-y-auto p-8 sm:p-10 pt-20 flex-1">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="w-12 h-12 border-4 border-gray-900 border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-xl font-medium text-gray-600">Génération de ton profil...</p>
                </div>
              ) : (
                <div className="space-y-8">
                  <h1 
                    className="text-3xl sm:text-4xl font-medium text-gray-800 tracking-wide drop-shadow-md text-center mb-8"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                  >
                    ✨ Tes résultats ✨
                  </h1>

                  <div className="space-y-6">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Compatibilité</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Albert School */}
                      <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100 shadow-sm">
                        <div className="flex justify-between items-center mb-3">
                          <span className="font-bold text-blue-900">Albert School</span>
                          <span className="text-blue-600 font-bold">{albertPercent}%</span>
                        </div>
                        <div className="w-full bg-blue-100 rounded-full h-3">
                          <motion.div 
                            className="bg-blue-600 h-3 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${albertPercent}%` }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                          />
                        </div>
                      </div>

                      {/* Eugenia School */}
                      <div className="bg-purple-50 rounded-2xl p-5 border border-purple-100 shadow-sm">
                        <div className="flex justify-between items-center mb-3">
                          <span className="font-bold text-purple-900">Eugenia School</span>
                          <span className="text-purple-600 font-bold">{eugeniaPercent}%</span>
                        </div>
                        <div className="w-full bg-purple-100 rounded-full h-3">
                          <motion.div 
                            className="bg-purple-600 h-3 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${eugeniaPercent}%` }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Conclusion */}
                  <div className="mt-10 flex flex-col items-center w-full">
                    <p className="text-gray-400 text-sm font-medium mb-4 uppercase tracking-widest italic text-center">Recommandation</p>
                    
                    <div className="w-full max-w-lg bg-gray-100/80 border border-gray-200 rounded-[2.5rem] p-8 flex flex-col items-center gap-6 shadow-sm backdrop-blur-sm">
                      {winner === 'Albert School' ? (
                        <>
                          <div className="flex items-center gap-3">
                            {/* Logo Albert School (Taille réduite) */}
                            <div className="relative">
                              {/* Cercle bleu */}
                              <div className="w-10 h-10 rounded-full bg-[#58AEE0]" />
                              {/* Petit point noir à gauche */}
                              <div className="absolute left-[-3px] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-black border-2 border-white" />
                            </div>
                            <div className="flex items-baseline ml-1">
                              <span className="text-2xl font-bold tracking-tighter text-black uppercase" style={{ fontFamily: 'Arial, sans-serif' }}>Albert</span>
                              <span className="text-2xl font-light tracking-tighter text-black uppercase ml-0.5" style={{ fontFamily: 'Arial, sans-serif' }}>School</span>
                            </div>
                          </div>
                          
                          <div className="text-center space-y-4 max-w-md">
                            <p className="text-gray-700 text-sm leading-relaxed">
                              Ton profil correspond très fortement à Albert School : ton appétence pour la data, la logique et la résolution de problèmes y trouvera un cadre idéal.
                            </p>
                            <p className="text-gray-900 font-semibold text-sm leading-relaxed">
                              C’est l’école la plus alignée avec ton potentiel et ton projet d’avenir.
                            </p>
                          </div>
                        </>
                      ) : winner === 'Eugenia School' ? (
                        <>
                          <div className="flex items-center gap-2">
                            {/* Logo Eugenia School */}
                            <div className="relative">
                              {/* Grand cercle dégradé jaune/blanc */}
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#EBC44F] via-[#F3E29D] to-[#FBF6E6]" />
                              {/* Petit point bordeaux à gauche */}
                              <div className="absolute left-[-4px] top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-[#731024]" />
                            </div>
                            <div className="ml-1">
                              <span className="text-2xl font-bold tracking-tighter text-[#731024] uppercase" style={{ fontFamily: 'Arial, sans-serif' }}>Eugenia</span>
                              <span className="text-2xl font-normal tracking-tighter text-[#731024] uppercase ml-0.5" style={{ fontFamily: 'Arial, sans-serif' }}>School</span>
                            </div>
                          </div>
                          
                          <div className="text-center space-y-4 max-w-md">
                            <p className="text-gray-700 text-sm leading-relaxed">
                              Ton profil correspond davantage à Eugenia School : ton intérêt pour le business, l’innovation et les projets concrets y sera pleinement valorisé.
                            </p>
                            <p className="text-gray-900 font-semibold text-sm leading-relaxed">
                              C’est une école en phase avec ton envie d’entreprendre et de construire des solutions réelles.
                            </p>
                          </div>
                        </>
                      ) : (
                        <p className="text-2xl font-black tracking-tight text-gray-900">{winner}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ResultsPage;
