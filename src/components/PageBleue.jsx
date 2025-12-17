import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';

const PageBleue = ({ onBack, onNext }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});

  const questions = [
    {
      id: 1,
      question: "Travail de groupe au lycée, c'est la crise. Quel rôle prends-tu naturellement ?",
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
    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: optionLabel
    });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Fin du quiz, aller au quiz vert
      if (onNext) {
        onNext();
      } else {
        onBack();
      }
    }
  };

  const currentQ = questions[currentQuestion];

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-400 flex items-center justify-center p-6 animate-in fade-in duration-300">
      {/* Bouton Retour */}
      <button 
        onClick={onBack}
        className="absolute top-8 left-8 flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-white"
      >
        <ArrowLeft size={20} />
        Retour
      </button>

      {/* Carte du Quiz Bleu */}
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full p-10 relative">
        {/* Titre */}
        {currentQuestion === 0 && (
          <h1 className="text-4xl font-bold text-center mb-8 text-blue-900">
            Connaissez-vous le Bleu ?
          </h1>
        )}

        {/* Bordure bleue à gauche */}
        <div className="border-l-8 border-blue-500 pl-6 mb-8">
          <p className="text-blue-600 font-semibold mb-2">
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
                    ${isSelected && isCorrect ? 'bg-blue-800 text-gray-900 border-blue-900' : ''}
                    ${isSelected && !isCorrect ? 'bg-gray-200 border-gray-400 text-gray-900' : ''}
                    ${!isSelected ? 'bg-gray-50 border-gray-200 hover:border-blue-500 hover:bg-blue-50 text-gray-900' : ''}
                  `}
                >
                  <span className={`
                    flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold
                    ${isSelected && isCorrect ? 'bg-white text-blue-800' : ''}
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
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors shadow-md hover:shadow-lg"
          >
            {currentQuestion === questions.length - 1 ? 'Étape suivante →' : 'Suivant →'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PageBleue;
