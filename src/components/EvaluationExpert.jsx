import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';

const EvaluationExpert = ({ onBack }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({
    q1: '',
    q2: '',
    q3: ''
  });

  const questions = [
    {
      id: 1,
      type: 'qcm',
      question: 'Quel code couleur correspond au fond "Or" de cette page ?',
      options: [
        { label: 'A', value: '#FFD700' },
        { label: 'B', value: '#E1AD01' },
        { label: 'C', value: '#D4AF37' },
        { label: 'D', value: '#C5A000' }
      ]
    },
    {
      id: 2,
      type: 'text',
      question: 'Expliquez pourquoi le contraste des couleurs est important dans une interface.',
      placeholder: 'Tapez votre réponse ici...'
    },
    {
      id: 3,
      type: 'text',
      question: 'Décrivez en quelques mots votre expérience utilisateur sur ce quiz.',
      placeholder: 'Partagez votre avis...'
    }
  ];

  const handleAnswerChange = (questionId, value) => {
    setAnswers({
      ...answers,
      [`q${questionId}`]: value
    });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handleSubmit = () => {
    alert('Vos réponses ont été validées !');
    onBack(); // Retour au bureau après validation
  };

  const currentQ = questions[currentQuestion];
  const isLastQuestion = currentQuestion === questions.length - 1;

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-yellow-600 via-orange-600 to-red-800 flex items-center justify-center p-6">
      {/* Bouton Retour */}
      <button 
        onClick={onBack}
        className="absolute top-8 left-8 flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-white"
      >
        <ArrowLeft size={20} />
        Retour
      </button>

      {/* Carte de l'évaluation */}
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full p-10">
        {/* Titre - Visible uniquement sur la première question */}
        {currentQuestion === 0 && (
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-red-900 mb-2">
              Qu'est ce qui te hype ?
            </h1>
            <div className="w-32 h-1 bg-gradient-to-r from-yellow-500 to-red-700 mx-auto"></div>
          </div>
        )}

        {/* Question actuelle */}
        <div className="border-l-8 border-yellow-500 pl-6 mb-8">
          <p className="text-red-900 font-bold mb-2">
            QUESTION {currentQ.id} / {questions.length}
          </p>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            {currentQ.question}
          </h2>

          {/* Si c'est un QCM */}
          {currentQ.type === 'qcm' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentQ.options.map((option) => {
                const isSelected = answers[`q${currentQ.id}`] === option.value;
                
                return (
                  <button
                    key={option.label}
                    onClick={() => handleAnswerChange(currentQ.id, option.value)}
                    className={`
                      flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left
                      ${isSelected ? 'bg-gray-100 border-yellow-500' : 'bg-gray-50 border-gray-200 hover:border-yellow-400'}
                    `}
                  >
                    <span className={`
                      flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold
                      ${isSelected ? 'bg-yellow-500 text-white' : 'bg-gray-300 text-gray-700'}
                    `}>
                      {option.label}
                    </span>
                    <span className="font-mono text-gray-700">{option.value}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Si c'est un champ texte */}
          {currentQ.type === 'text' && (
            <textarea
              value={answers[`q${currentQ.id}`] || ''}
              onChange={(e) => handleAnswerChange(currentQ.id, e.target.value)}
              placeholder={currentQ.placeholder}
              className="w-full h-32 p-4 border-2 border-gray-200 rounded-xl focus:border-yellow-500 focus:outline-none resize-none"
            />
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-end mt-8">
          {!isLastQuestion ? (
            <button
              onClick={handleNext}
              className="px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-semibold transition-colors"
            >
              Suivant →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="w-full px-6 py-3 bg-red-900 hover:bg-red-950 text-white rounded-lg font-semibold transition-colors text-lg"
            >
              Valider mes réponses
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EvaluationExpert;

