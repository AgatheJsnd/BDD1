import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { updatePersonaScore } from '../lib/userService';

const PageBleue = ({ onBack, onComplete, userEmail, initialAnswers = {}, onSaveAnswers }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState(initialAnswers);

  const brandColor = '#2a366b'; // Bleu un peu plus clair
  const hoverColor = '#3a4a8a';

  // ... (rest of the component)

  // Vérification silencieuse de l'email (logs uniquement en cas d'erreur)
  useEffect(() => {
    if (!userEmail) {
      console.warn('⚠️ PageBleue - Aucun email utilisateur fourni');
    }
  }, [userEmail]);

  // Mapping des réponses vers les personas
  const personaMapping = {
    'A': 'Finance shark',
    'B': 'Growth Hacker',
    'C': 'Data Detective',
    'D': 'Tech builder',
    'E': 'Visionnary Founder',
    'F': 'Creative Alchemist'
  };

  const questions = [
    {
      id: 1,
      question: "Travail de groupe au lycée, c'est la crise.\nQuel rôle prends-tu naturellement ?",
      options: [
        { label: "A", text: "Je recadre tout le monde sur l'objectif : avoir la meilleure note possible." },
        { label: "B", text: "Je motive l'équipe et je m'occupe de la présentation orale pour vendre le truc." },
        { label: "C", text: "Je vérifie toutes les sources et je structure le plan pour que ce soit logique." },
        { label: "D", text: "Je fais le gros du travail technique/rédactionnel, je mets les mains dans le cambouis." },
        { label: "E", text: "Je propose une idée complètement folle pour se démarquer des autres groupes." },
        { label: "F", text: "Je m'occupe des slides et du visuel pour que ce soit \"Wow\"." }
      ]
    },
    {
      id: 2,
      question: "On te donne 1 million d'euros pour lancer un projet. Tu fais quoi ?",
      options: [
        { label: "A", text: "J'investis en bourse et crypto pour en faire 10 millions." },
        { label: "B", text: "Je lance une marque e-commerce et j'inonde les réseaux sociaux de pubs." },
        { label: "C", text: "Je crée une agence d'analyse pour prédire les tendances futures." },
        { label: "D", text: "Je finance un labo de recherche pour développer une nouvelle technologie." },
        { label: "E", text: "Je monte une startup type \"SpaceX\" pour résoudre un problème mondial." },
        { label: "F", text: "Je produis un film ou un jeu vidéo ultra immersif nouvelle génération." }
      ]
    },
    {
      id: 3,
      question: "Ce qui t'énerve le plus dans le monde actuel ?",
      options: [
        { label: "A", text: "Les gens qui perdent de l'argent bêtement." },
        { label: "B", text: "Les produits nuls qui se vendent juste parce qu'ils ont du bon marketing." },
        { label: "C", text: "Les fake news et les gens qui parlent sans vérifier les chiffres." },
        { label: "D", text: "Les sites web qui buggent et les technos mal conçues." },
        { label: "E", text: "Le manque d'ambition et le \"c'était mieux avant\"." },
        { label: "F", text: "La laideur des villes et le manque de créativité." }
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
    console.log('🔵 ===== DÉBUT SAUVEGARDE POST-IT BLEU =====');
    console.log('📧 Email utilisateur:', userEmail);
    console.log('📋 Réponses sélectionnées:', selectedAnswers);

    if (!userEmail) {
      console.error('❌ Email utilisateur non disponible');
      return;
    }

    // Collecter tous les personas des réponses sélectionnées
    const personas = [];
    questions.forEach((question) => {
      const answerLabel = selectedAnswers[question.id];
      console.log(`  Question ${question.id}: Réponse sélectionnée = "${answerLabel}"`);
      if (answerLabel) {
        const persona = personaMapping[answerLabel];
        if (persona) {
          personas.push(persona);
          console.log(`    → Persona mappé: "${persona}"`);
        } else {
          console.warn(`    ⚠️ Aucun persona trouvé pour "${answerLabel}"`);
        }
      } else {
        console.warn(`    ⚠️ Aucune réponse pour la question ${question.id}`);
      }
    });

    console.log('🎭 Personas finaux à sauvegarder:', personas);

    if (personas.length === 0) {
      console.error('❌ Aucune réponse à sauvegarder - ABANDON');
      return;
    }

    try {
      console.log('💾 Appel de updatePersonaScore...');
      const result = await updatePersonaScore(userEmail, personas, true);
      console.log('📥 Résultat reçu:', result);
      
      if (result.success) {
        console.log('✅ SUCCÈS: Personas enregistrés dans Supabase:', personas);
        console.log('✅ Données retournées:', result.data);
      } else {
        console.error('❌ ÉCHEC: Erreur lors de l\'enregistrement:', result.error);
      }
      console.log('🔵 ===== FIN SAUVEGARDE =====');
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
      console.log('🔄 Fin du quiz - Début de la sauvegarde...');
      await saveAllAnswersToDatabase();
      console.log('🔄 Sauvegarde terminée - Retour au bureau');
      // Attendre un peu pour s'assurer que la sauvegarde est bien terminée
      setTimeout(() => {
        onComplete();
      }, 500);
    }
  };

  const currentQ = questions[currentQuestion];

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-[#8EC6EA] to-[#F2F8FD] flex items-center justify-center p-4 sm:p-6">
      {/* Bouton Retour */}
      <button 
        onClick={onBack}
        className="absolute top-8 left-8 flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-white"
      >
        <ArrowLeft size={20} />
        Retour
      </button>

      {/* Carte du Quiz Bleu */}
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full p-6 sm:p-10 relative">
        {/* Titre */}
        {currentQuestion === 0 && (
          <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8 text-[#2a366b]">
            Test de personnalité
          </h1>
        )}

        {/* Bordure bleue à gauche */}
        <div className="border-l-8 border-[#2a366b] pl-6 mb-8">
          <p className="text-[#2a366b] font-semibold mb-2 uppercase tracking-wider">
            QUESTION {currentQ.id} SUR {questions.length}
          </p>
          <h2 className="text-2xl font-bold text-black mb-6">
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
                    ${isSelected && isCorrect ? 'bg-[#2a366b] text-white border-[#2a366b]' : ''}
                    ${isSelected && !isCorrect ? 'bg-gray-200 border-gray-400' : ''}
                    ${!isSelected ? 'bg-gray-50 border-gray-200 hover:border-[#2a366b] hover:bg-[#2a366b]/5' : ''}
                  `}
                >
                  <span className={`
                    flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold
                    ${isSelected && isCorrect ? 'bg-white text-[#2a366b]' : ''}
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
            className="px-8 py-3 bg-[#2a366b] hover:bg-[#3a4a8a] text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-xl active:scale-95"
          >
            {currentQuestion === questions.length - 1 ? 'Étape suivante →' : 'Suivant →'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PageBleue;
