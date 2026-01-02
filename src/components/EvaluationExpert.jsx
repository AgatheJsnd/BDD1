import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';

const EvaluationExpert = ({ onBack, onComplete }) => {
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
      question: 'Quel domaine t\'attire le plus pour ton futur métier ?',
      options: [
        { label: 'A', value: 'Fintech & Crypto' },
        { label: 'B', value: 'Luxe & Mode' },
        { label: 'C', value: 'Santé & Sport' },
        { label: 'D', value: 'Jeux Vidéo & Divertissement' },
        { label: 'E', value: 'Environnement & Impact' },
        { label: 'F', value: 'Automobile & Espace' },
        { label: 'G', value: 'Politique & Société' }
      ]
    },
    {
      id: 2,
      type: 'text',
      question: 'Raconte-nous quelque chose dont tu es fier(e) (Projet perso, sport, asso, réussite scolaire...) :',
      placeholder: 'Tapez votre réponse ici...'
    },
    {
      id: 3,
      type: 'text',
      question: 'Qu\'est-ce que tu fais de ton temps libre quand tu n\'as plus de batterie sur ton tel ? (Passions/Hobby)',
      placeholder: 'Tapez votre réponse ici...'
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
    onComplete(); // Ouvrir la nouvelle page après validation
  };

  const currentQ = questions[currentQuestion];
  const isLastQuestion = currentQuestion === questions.length - 1;

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-[#F3E29D] to-[#FBF6E6] flex items-center justify-center p-6">
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
            <h1 className="text-4xl font-bold text-[#6B1E2D] mb-2">
              Qu'est ce qui te hype ?
            </h1>
          </div>
        )}

        {/* Question actuelle */}
        <div className="border-l-8 border-[#6B1E2D] pl-6 mb-8">
          <p className="text-[#6B1E2D] font-bold mb-2 uppercase tracking-wider">
            QUESTION {currentQ.id} SUR {questions.length}
          </p>
          <h2 className="text-2xl font-bold text-black mb-6">
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
                      ${isSelected ? 'bg-[#6B1E2D] text-white border-[#6B1E2D]' : 'bg-gray-50 border-gray-200 hover:border-[#6B1E2D] hover:bg-[#6B1E2D]/5'}
                    `}
                  >
                    <span className={`
                      flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold
                      ${isSelected ? 'bg-white text-[#6B1E2D]' : 'bg-gray-300 text-gray-700'}
                    `}>
                      {option.label}
                    </span>
                    <span className={isSelected ? 'text-white' : 'text-gray-700'}>{option.value}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Si c'est un champ texte */}
          {currentQ.type === 'text' && (
            <div className="w-full">
              <textarea
                value={answers[`q${currentQ.id}`] || ''}
                onChange={(e) => handleAnswerChange(currentQ.id, e.target.value)}
                placeholder={currentQ.placeholder}
                className="w-full min-h-[160px] p-4 border-2 border-gray-200 rounded-xl focus:border-[#6B1E2D] focus:ring-2 focus:ring-[#6B1E2D]/20 focus:outline-none resize-y bg-white text-gray-900 text-base"
                autoComplete="off"
                spellCheck="true"
                rows={6}
              />
              <p className="text-sm text-gray-500 mt-2">
                {answers[`q${currentQ.id}`]?.length || 0} caractères
              </p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-end mt-8">
          {!isLastQuestion ? (
            <button
              onClick={handleNext}
              className="px-8 py-3 bg-[#6B1E2D] hover:bg-[#7A2234] text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-xl active:scale-95"
            >
              Suivant →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="w-full px-8 py-4 bg-[#6B1E2D] hover:bg-[#7A2234] text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-xl active:scale-95 text-lg"
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

