import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { updateTechApetite } from '../lib/userService';

const PageVerte = ({ onBack, onNext, userEmail }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});

  // Mapping des réponses vers les tech_apetites
  const techApetiteMapping = {
    'A': 'Dev',
    'B': 'Analyst',
    'C': 'Creator',
    'D': 'Marketer'
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
    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: optionLabel
    });
  };

  // Fonction pour sauvegarder toutes les réponses dans Supabase
  const saveAllAnswersToDatabase = async () => {
    console.log('🟢 ===== DÉBUT SAUVEGARDE POST-IT VERT =====');
    console.log('📧 Email utilisateur:', userEmail);
    console.log('📋 Réponses sélectionnées:', selectedAnswers);

    if (!userEmail) {
      console.error('❌ Email utilisateur non disponible');
      return;
    }

    // Collecter tous les tech_apetites des réponses sélectionnées
    const techApetites = [];
    questions.forEach((question) => {
      const answerLabel = selectedAnswers[question.id];
      console.log(`  Question ${question.id}: Réponse sélectionnée = "${answerLabel}"`);
      if (answerLabel) {
        const techApetite = techApetiteMapping[answerLabel];
        if (techApetite) {
          techApetites.push(techApetite);
          console.log(`    → Tech_apetite mappé: "${techApetite}"`);
        } else {
          console.warn(`    ⚠️ Aucun tech_apetite trouvé pour "${answerLabel}"`);
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
      // Fin du quiz : sauvegarder toutes les réponses dans Supabase
      console.log('🔄 Fin du quiz vert - Début de la sauvegarde...');
      await saveAllAnswersToDatabase();
      console.log('🔄 Sauvegarde terminée - Passage à l\'étape suivante');
      // Attendre un peu pour s'assurer que la sauvegarde est bien terminée
      setTimeout(() => {
        if (onNext) {
          onNext();
        } else {
          onBack();
        }
      }, 500);
    }
  };

  const currentQ = questions[currentQuestion];

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-green-600 via-green-500 to-emerald-400 flex items-center justify-center p-6 animate-in fade-in duration-300">
      {/* Bouton Retour */}
      <button 
        onClick={onBack}
        className="absolute top-8 left-8 flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-white"
      >
        <ArrowLeft size={20} />
        Retour
      </button>

      {/* Carte du Quiz Vert */}
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full p-10 relative">
        {/* Titre */}
        {currentQuestion === 0 && (
          <h1 className="text-4xl font-bold text-center mb-8 text-green-900">
            Quiz Vert
          </h1>
        )}

        {/* Bordure verte à gauche */}
        <div className="border-l-8 border-green-500 pl-6 mb-8">
          <p className="text-green-600 font-semibold mb-2">
            QUESTION {currentQ.id} SUR {questions.length}
          </p>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
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
                    flex items-start gap-3 p-4 rounded-xl border-2 transition-all text-left
                    ${isSelected && isCorrect ? 'bg-green-800 text-gray-900 border-green-900' : ''}
                    ${isSelected && !isCorrect ? 'bg-gray-200 border-gray-400 text-gray-900' : ''}
                    ${!isSelected ? 'bg-gray-50 border-gray-200 hover:border-green-500 hover:bg-green-50 text-gray-900' : ''}
                  `}
                >
                  <span className={`
                    flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold
                    ${isSelected && isCorrect ? 'bg-white text-green-800' : ''}
                    ${isSelected && !isCorrect ? 'bg-gray-400 text-white' : ''}
                    ${!isSelected ? 'bg-gray-300 text-gray-700' : ''}
                  `}>
                    {option.label}
                  </span>
                  <span className="flex-1">{option.text}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-end items-center mt-8">
          <button 
            onClick={handleNext}
            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors shadow-md hover:shadow-lg"
          >
            {currentQuestion === questions.length - 1 ? 'Étape suivante →' : 'Suivant →'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PageVerte;

