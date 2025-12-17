import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';

const Quiz = ({ onBack }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});

  const questions = [
    {
      id: 1,
      question: "Quel est l'élément chimique dont le symbole est 'Au' ?",
      options: [
        { label: "A", text: "L'Argent" },
        { label: "B", text: "L'Or", isCorrect: true },
        { label: "C", text: "Le Cuivre" },
        { label: "D", text: "L'Aluminium" }
      ]
    },
    {
      id: 2,
      question: "Quelle couleur obtenez-vous en mélangeant du bleu et du rouge ?",
      options: [
        { label: "A", text: "Vert" },
        { label: "B", text: "Violet (ou Pourpre)", isCorrect: true },
        { label: "C", text: "Orange" },
        { label: "D", text: "Marron" }
      ]
    },
    {
      id: 3,
      question: 'Parmi les propositions suivantes, laquelle décrit le mieux le style "Art Déco" ?',
      options: [
        { label: "A", text: "Un style caractérisé par des formes organiques, des courbes inspirées de la nature et des motifs floraux complexes." },
        { label: "B", text: "Un mouvement artistique basé sur l'utilisation exclusive de couleurs primaires et de formes géométriques très simples." },
        { label: "C", text: "Un style utilisant des formes géométriques épurées, des lignes droites, des matériaux luxueux et des couleurs riches comme l'or.", isCorrect: true }
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
      // Fin du quiz, retour au bureau
      onBack();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const currentQ = questions[currentQuestion];

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-yellow-600 via-orange-500 to-red-700 flex items-center justify-center p-6 animate-in fade-in duration-300">
      {/* Bouton Retour */}
      <button 
        onClick={onBack}
        className="absolute top-8 left-8 flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-white"
      >
        <ArrowLeft size={20} />
        Retour
      </button>

      {/* Carte du Quiz */}
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full p-10 relative">
        {/* Titre - Visible uniquement sur la première question */}
        {currentQuestion === 0 && (
          <h1 className="text-4xl font-bold text-center mb-8 text-red-900">
            T'es chaud en quoi ?
          </h1>
        )}

        {/* Bordure dorée à gauche */}
        <div className="border-l-8 border-yellow-500 pl-6 mb-8">
          <p className="text-yellow-600 font-semibold mb-2">
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
                    ${isSelected && isCorrect ? 'bg-red-800 text-white border-red-900' : ''}
                    ${isSelected && !isCorrect ? 'bg-gray-200 border-gray-400' : ''}
                    ${!isSelected ? 'bg-gray-50 border-gray-200 hover:border-yellow-500 hover:bg-gray-100' : ''}
                  `}
                >
                  <span className={`
                    flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold
                    ${isSelected && isCorrect ? 'bg-white text-red-800' : ''}
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
            className="px-6 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-semibold transition-colors shadow-md hover:shadow-lg"
          >
            {currentQuestion === questions.length - 1 ? 'Étape suivante →' : 'Suivant →'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Quiz;

