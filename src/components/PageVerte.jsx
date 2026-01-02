import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';

const PageVerte = ({ onBack, onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});

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

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Fin du quiz, aller à l'étape suivante
      onComplete();
    }
  };

  const currentQ = questions[currentQuestion];

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-[#97CBB6] to-[#F2F8FD] flex items-center justify-center p-6">
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
          <h1 className="text-4xl font-bold text-center mb-8 text-[#3d614a]">
            Quiz Vert
          </h1>
        )}

        {/* Bordure verte à gauche */}
        <div className="border-l-8 border-[#3d614a] pl-6 mb-8">
          <p className="text-[#3d614a] font-semibold mb-2">
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
                    ${isSelected && isCorrect ? 'bg-[#3d614a] text-white border-[#3d614a]' : ''}
                    ${isSelected && !isCorrect ? 'bg-gray-200 border-gray-400 text-gray-900' : ''}
                    ${!isSelected ? 'bg-gray-50 border-gray-200 hover:border-[#3d614a] hover:bg-[#3d614a]/5 text-gray-900' : ''}
                  `}
                >
                  <span className={`
                    flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold
                    ${isSelected && isCorrect ? 'bg-white text-[#3d614a]' : ''}
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
            className="px-8 py-3 bg-[#3d614a] hover:bg-[#4d7a5a] text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-xl active:scale-95"
          >
            {currentQuestion === questions.length - 1 ? 'Étape suivante →' : 'Suivant →'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PageVerte;

