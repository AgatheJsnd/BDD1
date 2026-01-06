import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { getUserByEmail, updateTestResult } from '../lib/userService';

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
      console.log('🧪 Début du calcul pour:', userEmail);
      
      const result = await getUserByEmail(userEmail);
      console.log('🧪 Résultat Supabase:', result);
      
      if (!result.success || !result.data) {
        console.warn('⚠️ Données non trouvées ou Supabase non configuré, utilisation des scores par défaut');
        // Fallback pour le test
        setAlbertPercent(75);
        setEugeniaPercent(25);
        setLoading(false);
        return;
      }

      const data = result.data;
      console.log('🧪 Données candidat:', data);
      setCandidatData(data);
      let albertScore = 0;
      let eugeniaScore = 0;

      // Post-it bleu : Questions 1, 2, 3 - Chacune vaut 15%
      if (data.persona_score && Array.isArray(data.persona_score)) {
        data.persona_score.forEach((persona) => {
          const answer = personaToAnswer[persona];
          if (answer) {
            // A, B, C → 15% pour Albert
            if (['A', 'B', 'C'].includes(answer)) {
              albertScore += 15;
            }
            // D, E, F → 15% pour Eugenia
            else if (['D', 'E', 'F'].includes(answer)) {
              eugeniaScore += 15;
            }
          }
        });
      }

      // Post-it vert : Question 1 - 27,5%
      if (data.tech_apetite) {
        const techApetites = data.tech_apetite.split(',').map(t => t.trim());
        if (techApetites.length > 0) {
          const q1TechApetite = techApetites[0];
          const answer = techApetiteQ1ToAnswer[q1TechApetite];
          if (answer) {
            // A, B → 27,5% pour Albert
            if (['A', 'B'].includes(answer)) {
              albertScore += 27.5;
            }
            // C, D → 27,5% pour Eugenia
            else if (['C', 'D'].includes(answer)) {
              eugeniaScore += 27.5;
            }
          }
        }
      }

      // Post-it vert : Question 3 - Logique spéciale basée sur english_level
      if (data.english_level) {
        const englishLevel = data.english_level.trim();
        
        // Mapping des réponses de la question 3
        // A) Bilingue (Niveau natif)
        // B) Avancé (Très à l'aise)
        // C) Intermédiaire (Je me débrouille)
        // D) Débutant (Niveau insuffisant)
        
        if (englishLevel === 'Bilingue (Niveau natif)' || englishLevel === 'Avancé (Très à l\'aise)') {
          // A ou B → 13,75% pour Albert ET 13,75% pour Eugenia
          albertScore += 13.75;
          eugeniaScore += 13.75;
        } else if (englishLevel === 'Intermédiaire (Je me débrouille)' || englishLevel === 'Débutant (Niveau insuffisant)') {
          // C ou D → 27,5% pour Eugenia ET 0% pour Albert
          eugeniaScore += 27.5;
        }
      }

      const finalAlbertPercent = Math.round(albertScore * 100) / 100;
      const finalEugeniaPercent = Math.round(eugeniaScore * 100) / 100;
      
      setAlbertPercent(finalAlbertPercent);
      setEugeniaPercent(finalEugeniaPercent);
      
      // Déterminer l'école dominante et l'enregistrer dans la base de données
      let dominantSchool = null;
      if (finalAlbertPercent > finalEugeniaPercent) {
        dominantSchool = 'Albert School';
      } else if (finalEugeniaPercent > finalAlbertPercent) {
        dominantSchool = 'Eugenia School';
      } else {
        dominantSchool = 'Égalité';
      }
      
      // Enregistrer le résultat dans la base de données
      if (userEmail && dominantSchool) {
        try {
          await updateTestResult(userEmail, dominantSchool);
          console.log('✅ Résultat du test enregistré:', dominantSchool);
        } catch (error) {
          console.error('❌ Erreur lors de l\'enregistrement du résultat:', error);
        }
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Erreur lors du calcul des résultats:', error);
      setLoading(false);
    }
  };

  const winner = albertPercent > eugeniaPercent ? 'Albert School' : 
                 eugeniaPercent > albertPercent ? 'Eugenia School' : 
                 'Égalité';

  // Logo Albert School (bleu) - Version complète pour l'animation
  const AlbertLogo = () => (
    <div className="flex items-center justify-center w-full h-full">
      <svg width="800" height="600" viewBox="0 0 800 600" className="w-full h-full max-w-full max-h-full" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="albertGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#87CEEB" />
            <stop offset="100%" stopColor="#E8F4FD" />
          </linearGradient>
        </defs>
        {/* Grand cercle bleu clair (cercle plein sur le côté droit) */}
        <circle cx="550" cy="300" r="200" fill="url(#albertGradient)" />
        {/* Petit cercle bleu foncé (attaché au côté gauche du grand cercle, sans espace) */}
        {/* Le petit cercle est positionné de sorte que son bord droit touche le bord gauche du grand cercle */}
        {/* Position: cx du grand cercle (550) - rayon du grand cercle (200) = 350, puis on soustrait le rayon du petit (80) pour centrer le petit cercle */}
        <circle cx="270" cy="300" r="80" fill="#1E3A8A" stroke="#0e1d45" strokeWidth="2" />
      </svg>
    </div>
  );

  // Logo Eugenia School (jaune moutarde et bordeaux) - Version complète pour l'animation
  const EugeniaLogo = () => (
    <div className="flex items-center justify-center w-full h-full">
      <svg width="800" height="600" viewBox="0 0 800 600" className="w-full h-full max-w-full max-h-full" preserveAspectRatio="xMidYMid meet">
        {/* Grand cercle jaune moutarde (cercle plein sur le côté droit) */}
        <circle cx="550" cy="300" r="200" fill="#E3AB36" />
        {/* Petit cercle bordeaux (attaché au côté gauche du grand cercle, sans espace) */}
        {/* Le petit cercle est positionné de sorte que son bord droit touche le bord gauche du grand cercle */}
        <circle cx="270" cy="300" r="80" fill="#5E1A26" stroke="#3a0f18" strokeWidth="2" />
      </svg>
    </div>
  );

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
            className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden relative"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            {/* Bouton Retour (positionné comme sur les autres pages) */}
            <button 
              onClick={onBack}
              className="absolute top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 bg-gray-100/80 hover:bg-gray-200/80 backdrop-blur-sm rounded-xl transition-colors text-gray-700 font-semibold shadow-sm"
            >
              <ArrowLeft size={20} />
              Retour
            </button>

            <div className="overflow-y-auto p-8 sm:p-10 pt-20 flex-1">
              {!loading && (
                <div className="space-y-8">
                  <h1 
                    className="text-3xl sm:text-4xl font-medium text-gray-800 tracking-wide drop-shadow-md text-center mb-8"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                  >
                    ✨ Tes résultats ✨
                  </h1>

                  <div className="space-y-6">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Compatibilité</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Albert School */}
                      <div className="bg-blue-50/70 backdrop-blur-sm rounded-2xl p-5 border border-blue-100 shadow-sm flex flex-col justify-center">
                        <div className="flex justify-between items-center mb-3">
                          <span className="font-bold text-blue-900 text-lg">Albert School</span>
                          <span className="text-[#68A3E0] font-black text-xl">{albertPercent}%</span>
                        </div>
                        <div className="w-full bg-blue-100 rounded-full h-3">
                          <motion.div 
                            className="bg-[#68A3E0] h-3 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${albertPercent}%` }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                          />
                        </div>
                      </div>

                      {/* Eugenia School */}
                      <div className="bg-amber-50/70 backdrop-blur-sm rounded-2xl p-5 border border-amber-100 shadow-sm flex flex-col justify-center">
                        <div className="flex justify-between items-center mb-3">
                          <span className="font-bold text-amber-900 text-lg">Eugenia School</span>
                          <span className="text-[#D4AF37] font-black text-xl">{eugeniaPercent}%</span>
                        </div>
                        <div className="w-full bg-amber-100 rounded-full h-3">
                          <motion.div 
                            className="bg-[#D4AF37] h-3 rounded-full"
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
                    
                    <div className="w-full max-w-lg bg-gray-100/80 border border-gray-200 rounded-[2.5rem] p-8 flex flex-col items-center gap-6 shadow-sm backdrop-blur-sm relative overflow-hidden">
                      {winner === 'Albert School' ? (
                        <>
                          <div className="flex items-center gap-3">
                            {/* Logo Albert School (Taille réduite) */}
                            <div className="relative">
                              {/* Cercle bleu */}
                              <div className="w-10 h-10 rounded-full bg-[#68A3E0]" />
                              {/* Petit point noir à gauche */}
                              <div className="absolute left-[-3px] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-black border-2 border-white" />
                            </div>
                            <div className="flex items-baseline ml-1">
                              <span className="text-2xl font-bold tracking-tighter text-black uppercase" style={{ fontFamily: 'Arial, sans-serif' }}>Albert</span>
                              <span className="text-2xl font-light tracking-tighter text-black uppercase ml-0.5" style={{ fontFamily: 'Arial, sans-serif' }}>School</span>
                            </div>
                          </div>
                          
                          <div className="text-center space-y-4 max-w-md pb-12">
                            <p className="text-gray-700 text-sm leading-relaxed">
                              Ton profil correspond très fortement à Albert School : ton appétence pour la data, la logique et la résolution de problèmes y trouvera un cadre idéal.
                            </p>
                            <p className="text-gray-900 font-semibold text-sm leading-relaxed">
                              C’est l’école la plus alignée avec ton potentiel et ton projet d’avenir.
                            </p>
                          </div>

                          {/* Bouton centré en bas de la recommandation */}
                          <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
                            <a 
                              href="https://albertschool.com" 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 px-6 py-2.5 bg-[#68A3E0] text-white rounded-xl text-sm font-bold hover:brightness-95 transition-all hover:scale-105 shadow-md whitespace-nowrap"
                            >
                              Participer à une JPO
                            </a>
                          </div>
                        </>
                      ) : winner === 'Eugenia School' ? (
                        <>
                          <div className="flex items-center gap-2">
                            {/* Logo Eugenia School */}
                            <div className="relative">
                              {/* Grand cercle dégradé jaune/blanc */}
                              <div className="w-10 h-10 rounded-full bg-[#D4AF37]" />
                              {/* Petit point bordeaux à gauche */}
                              <div className="absolute left-[-4px] top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-[#731024]" />
                            </div>
                            <div className="ml-1">
                              <span className="text-2xl font-bold tracking-tighter text-[#731024] uppercase" style={{ fontFamily: 'Arial, sans-serif' }}>Eugenia</span>
                              <span className="text-2xl font-normal tracking-tighter text-[#731024] uppercase ml-0.5" style={{ fontFamily: 'Arial, sans-serif' }}>School</span>
                            </div>
                          </div>
                          
                          <div className="text-center space-y-4 max-w-md pb-12">
                            <p className="text-gray-700 text-sm leading-relaxed">
                              Ton profil correspond davantage à Eugenia School : ton intérêt pour le business, l’innovation et les projets concrets y sera pleinement valorisé.
                            </p>
                            <p className="text-gray-900 font-semibold text-sm leading-relaxed">
                              C’est une école en phase avec ton envie d’entreprendre et de construire des solutions réelles.
                            </p>
                          </div>

                          {/* Bouton centré en bas de la recommandation */}
                          <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
                            <a 
                              href="https://eugeniaschool.com" 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 px-6 py-2.5 bg-[#D4AF37] text-white rounded-xl text-sm font-bold hover:brightness-95 transition-all hover:scale-105 shadow-md whitespace-nowrap"
                            >
                              Participer à une JPO
                            </a>
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
