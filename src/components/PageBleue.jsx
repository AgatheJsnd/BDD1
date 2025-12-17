import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';

const PageBleue = ({ onBack }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});

  const questions = [
    {
      id: 1,
      question: "Que symbolise principalement la couleur bleue ?",
      options: [
        { label: "A", text: "La passion et l'énergie" },
        { label: "B", text: "Le calme, la confiance et la sérénité", isCorrect: true },
        { label: "C", text: "La nature et la croissance" },
        { label: "D", text: "Le mystère et le luxe" }
      ]
    },
    {
      id: 2,
      question: "Quelle planète est surnommée la 'Planète Bleue' ?",
      options: [
        { label: "A", text: "Neptune" },
        { label: "B", text: "Uranus" },
        { label: "C", text: "La Terre", isCorrect: true },
        { label: "D", text: "Mars" }
      ]
    },
    {
      id: 3,
      question: "Dans le modèle RGB (écran), le bleu est-il une couleur primaire ?",
      options: [
        { label: "A", text: "Oui, c'est l'une des trois couleurs primaires lumière", isCorrect: true },
        { label: "B", text: "Non, c'est une couleur secondaire" },
        { label: "C", text: "Cela dépend de la luminosité" }
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
                    ${isSelected && isCorrect ? 'bg-blue-800 text-white border-blue-900' : ''}
                    ${isSelected && !isCorrect ? 'bg-gray-200 border-gray-400' : ''}
                    ${!isSelected ? 'bg-gray-50 border-gray-200 hover:border-blue-500 hover:bg-blue-50' : ''}
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
            {currentQuestion === questions.length - 1 ? 'Terminer' : 'Suivant →'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PageBleue;
