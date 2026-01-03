import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { updateTechApetite } from '../lib/userService';

const PageVerte = ({ onBack, onComplete, userEmail, initialAnswers = {}, onSaveAnswers }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState(initialAnswers);

  // Mapping des réponses vers les tech_apetites selon la question
  const techApetiteMappings = {
    1: { // Question 1
      'A': 'Profil Data/Maths',
      'B': 'Profil Appliqué/Ingé',
      'C': 'Profil Littéraire/Créa',
      'D': 'Profil Smart/Resourceful'
    },
    2: { // Question 2
      'A': 'Curiosité Technique',
      'B': 'Curiosité Business',
      'C': 'Curiosité Créative',
      'D': 'Détentes'
    },
    3: { // Question 3
      'A': 'Dev',
      'B': 'Analyst',
      'C': 'Creator',
      'D': 'Marketer'
    }
  };

  const questions = [
    {
      id: 1,
      question: "Quand tu dois résoudre un problème de maths complexe :",
      options: [
        { label: "A", text: "J'adore, c'est comme un puzzle logique." },
        { label: "B", text: "Je le fais, mais je préfère quand on voit à quoi ça sert concrètement (physique/éco)." },
        { label: "C", text: "Je galère, je préfère rédiger une dissert ou apprendre une langue." },
        { label: "D", text: "Je cherche une calculatrice ou une IA pour le faire à ma place." }
      ]
    },
    {
      id: 2,
      question: "Ton feed TikTok/Insta/YouTube, c'est surtout :",
      options: [
        { label: "A", text: "Des tutos, de la science, des \"How it's made\"." },
        { label: "B", text: "Des entrepreneurs, de la motivation, de l'actu éco." },
        { label: "C", text: "De l'art, du design, des concepts visuels, du montage." },
        { label: "D", text: "Du divertissement pur, du gaming, des memes." }
      ]
    },
    {
      id: 3,
      question: "Si tu devais apprendre un \"super-pouvoir\" informatique demain :",
      options: [
        { label: "A", text: "Parler couramment Python pour contrôler les machines." },
        { label: "B", text: "Maîtriser Excel pour analyser n'importe quelle situation en 2 secondes." },
        { label: "C", text: "Maîtriser Photoshop/Blender pour créer tout ce que j'imagine." },
        { label: "D", text: "Savoir hacker les algorithmes des réseaux sociaux pour devenir viral." }
      ]
    }
  ];

  const handleAnswerClick = (questionId, optionLabel) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionLabel
    }));
  };

  // Sync answers with parent
  useEffect(() => {
    if (onSaveAnswers) {
      onSaveAnswers(selectedAnswers);
    }
  }, [selectedAnswers, onSaveAnswers]);

  // Fonction pour sauvegarder toutes les réponses dans Supabase
  const saveAllAnswersToDatabase = async () => {
    console.log('🟢 ===== DÉBUT SAUVEGARDE POST-IT VERT =====');
    console.log('📧 Email utilisateur:', userEmail);
    console.log('📋 Réponses sélectionnées:', selectedAnswers);

    if (!userEmail) {
      console.error('❌ Email utilisateur non disponible');
      return;
    }

    // Collecter tous les tech_apetites des réponses sélectionnées selon le mapping de chaque question
    const techApetites = [];
    questions.forEach((question) => {
      const answerLabel = selectedAnswers[question.id];
      console.log(`  Question ${question.id}: Réponse sélectionnée = "${answerLabel}"`);
      if (answerLabel) {
        // Utiliser le mapping spécifique à cette question
        const questionMapping = techApetiteMappings[question.id];
        if (questionMapping) {
          const techApetite = questionMapping[answerLabel];
          if (techApetite) {
            techApetites.push(techApetite);
            console.log(`    → Tech_apetite mappé: "${techApetite}"`);
          } else {
            console.warn(`    ⚠️ Aucun tech_apetite trouvé pour "${answerLabel}" dans le mapping de la question ${question.id}`);
          }
        } else {
          console.warn(`    ⚠️ Aucun mapping trouvé pour la question ${question.id}`);
        }
      } else {
        console.warn(`    ⚠️ Aucune réponse pour la question ${question.id}`);
      }
    });

    console.log('💻 Tech_apetites finaux à sauvegarder:', techApetites);

    if (techApetites.length === 0) {
      console.error('❌ Aucune réponse à sauvegarder - ABANDON');
      return;
    }

    try {
      console.log('💾 Appel de updateTechApetite...');
      const result = await updateTechApetite(userEmail, techApetites);
      console.log('📥 Résultat reçu:', result);
      
      if (result.success) {
        console.log('✅ SUCCÈS: Tech_apetite enregistré dans Supabase:', techApetites);
        console.log('✅ Données retournées:', result.data);
      } else {
        console.error('❌ ÉCHEC: Erreur lors de l\'enregistrement:', result.error);
      }
      console.log('🟢 ===== FIN SAUVEGARDE =====');
    } catch (error) {
      console.error('❌ EXCEPTION lors de la sauvegarde:', error);
      console.error('❌ Stack trace:', error.stack);
    }
  };

  const handleNext = async () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      console.log('🔄 Fin du quiz vert - Début de la sauvegarde...');
      await saveAllAnswersToDatabase();
      console.log('🔄 Sauvegarde terminée - Passage à l\'étape suivante');
      // Attendre un peu pour s'assurer que la sauvegarde est bien terminée
      setTimeout(() => {
        if (onComplete) {
          onComplete();
        } else {
          onBack();
        }
      }, 500);
    }
  };

  const currentQ = questions[currentQuestion];

  return (
    <div className="question-page-wrapper bg-gradient-to-br from-[#97CBB6] to-[#F2F8FD]">
      {/* Bouton Retour */}
      <button 
        onClick={onBack}
        className="absolute top-4 left-4 z-50 flex items-center gap-2 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-white text-sm sm:text-base sm:top-8 sm:left-8 sm:px-4 sm:py-2"
      >
        <ArrowLeft size={18} />
        Retour
      </button>

      {/* Carte du Quiz Vert */}
      <div className="question-card max-w-4xl">
        <div className="question-card-content">
          {/* Titre */}
          {currentQuestion === 0 && (
            <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8 text-[#3d614a]">
              Appétences Techniques
            </h1>
          )}

          {/* Bordure verte à gauche */}
          <div className="border-l-4 sm:border-l-8 border-[#3d614a] pl-4 sm:pl-6 mb-8">
            <p className="text-[#3d614a] font-semibold mb-2 uppercase tracking-wider text-xs sm:text-base">
              QUESTION {currentQ.id} SUR {questions.length}
            </p>
            <h2 className="text-xl sm:text-2xl font-bold text-black mb-6">
              {currentQ.question}
            </h2>

            {/* Options de réponse */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentQ.options.map((option) => {
                const isSelected = selectedAnswers[currentQ.id] === option.label;
                const isCorrect = option.isCorrect && isSelected;
                
                return (
                  <button
                    key={option.label}
                    onClick={() => handleAnswerClick(currentQ.id, option.label)}
                    className={`
                      flex items-start gap-3 p-3 sm:p-4 rounded-xl border-2 transition-all text-left
                      ${isSelected && isCorrect ? 'bg-[#3d614a] text-white border-[#3d614a]' : ''}
                      ${isSelected && !isCorrect ? 'bg-gray-200 border-gray-400 text-gray-900' : ''}
                      ${!isSelected ? 'bg-gray-50 border-gray-200 hover:border-[#3d614a] hover:bg-[#3d614a]/5 text-gray-900' : ''}
                    `}
                  >
                    <span className={`
                      flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-sm sm:text-base
                      ${isSelected && isCorrect ? 'bg-white text-[#3d614a]' : ''}
                      ${isSelected && !isCorrect ? 'bg-gray-400 text-white' : ''}
                      ${!isSelected ? 'bg-gray-300 text-gray-700' : ''}
                    `}>
                      {option.label}
                    </span>
                    <span className="flex-1 text-sm sm:text-base">{option.text}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Navigation - Fixée en bas de la carte */}
        <div className="question-card-footer p-4 sm:p-6 border-t border-gray-100 bg-gray-50/50 flex justify-end items-center">
          <button 
            onClick={handleNext}
            className="px-6 py-2.5 sm:px-8 sm:py-3 bg-[#3d614a] hover:bg-[#4d7a5a] text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-xl active:scale-95 text-sm sm:text-base"
          >
            {currentQuestion === questions.length - 1 ? 'Étape suivante →' : 'Suivant →'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PageVerte;

