import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { updateInterestSector, updateProudProject, updateHobbies } from '../lib/userService';

const EvaluationExpert = ({ onBack, onNext, onComplete, userEmail, initialAnswers = { q1: '', q2: '', q3: '' }, onSaveAnswers }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState(initialAnswers);

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
      question: 'Parle-nous d’un projet ou d’un succès personnel.',
      placeholder: 'Tapez votre réponse ici...'
    },
    {
      id: 3,
      type: 'text',
      question: 'Quelles sont tes passions ou hobbies ?',
      placeholder: 'Tapez votre réponse ici...'
    }
  ];

  const handleAnswerChange = (questionId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [`q${questionId}`]: value
    }));
  };

  // Sync answers with parent
  useEffect(() => {
    if (onSaveAnswers) {
      onSaveAnswers(answers);
    }
  }, [answers, onSaveAnswers]);

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handleSubmit = async () => {
    console.log('🔴 ===== VALIDATION POST-IT ROUGE =====');
    console.log('📧 Email utilisateur:', userEmail);
    console.log('📋 Réponses:', answers);

    if (!userEmail) {
      console.warn('⚠️ Email utilisateur non disponible');
      // Continuer quand même pour ne pas bloquer l'utilisateur
    }

    // Sauvegarder la réponse de la question 1 (interest_sector)
    if (answers.q1 && userEmail) {
      console.log('💼 Sauvegarde de interest_sector:', answers.q1);
      try {
        const result = await updateInterestSector(userEmail, answers.q1);
        if (result.success) {
          console.log('✅ SUCCÈS: Interest sector enregistré:', answers.q1);
        } else {
          console.error('❌ ÉCHEC: Erreur lors de l\'enregistrement:', result.error);
        }
      } catch (error) {
        console.error('❌ EXCEPTION lors de la sauvegarde:', error);
      }
    } else if (!answers.q1) {
      console.warn('⚠️ Aucune réponse pour la question 1 (interest_sector)');
    }

    // Sauvegarder la réponse de la question 2 (proud_project)
    if (answers.q2 && userEmail) {
      console.log('📝 Sauvegarde de proud_project:', answers.q2);
      try {
        const result = await updateProudProject(userEmail, answers.q2);
        if (result.success) {
          console.log('✅ SUCCÈS: Proud project enregistré');
        } else {
          console.error('❌ ÉCHEC: Erreur lors de l\'enregistrement:', result.error);
        }
      } catch (error) {
        console.error('❌ EXCEPTION lors de la sauvegarde:', error);
      }
    } else if (!answers.q2) {
      console.warn('⚠️ Aucune réponse pour la question 2 (proud_project)');
    }

    // Sauvegarder la réponse de la question 3 (hobbies)
    if (answers.q3 && userEmail) {
      console.log('🎨 Sauvegarde de hobbies:', answers.q3);
      try {
        const result = await updateHobbies(userEmail, answers.q3);
        if (result.success) {
          console.log('✅ SUCCÈS: Hobbies enregistré');
        } else {
          console.error('❌ ÉCHEC: Erreur lors de l\'enregistrement:', result.error);
        }
      } catch (error) {
        console.error('❌ EXCEPTION lors de la sauvegarde:', error);
      }
    } else if (!answers.q3) {
      console.warn('⚠️ Aucune réponse pour la question 3 (hobbies)');
    }

    console.log('🔴 ===== FIN VALIDATION =====');

    // Attendre un peu pour s'assurer que la sauvegarde est terminée
    const done = onComplete || onNext || onBack;
    setTimeout(() => {
      if (done) done(); // Priorité à onComplete si fourni (App), sinon onNext, sinon onBack
    }, 500);
  };

  const currentQ = questions[currentQuestion];
  const isLastQuestion = currentQuestion === questions.length - 1;

  return (
    <div className="question-page-wrapper bg-gradient-to-br from-[#F3E29D] to-[#FBF6E6]">
      {/* Bouton Retour */}
      <button 
        onClick={onBack}
        className="absolute top-4 left-4 z-50 flex items-center gap-2 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-white text-sm sm:text-base sm:top-8 sm:left-8 sm:px-4 sm:py-2"
      >
        <ArrowLeft size={18} />
        Retour
      </button>

      {/* Carte de l'évaluation */}
      <div className="question-card max-w-4xl">
        <div className="question-card-content">
          {/* Titre - Visible uniquement sur la première question */}
          {currentQuestion === 0 && (
            <div className="text-center mb-8">
              <h1 className="text-3xl sm:text-4xl font-bold text-[#d6b364] mb-2">
                Qu'est ce qui te hype ?
              </h1>
            </div>
          )}

          {/* Question actuelle */}
          <div className="border-l-4 sm:border-l-8 border-[#d6b364] pl-4 sm:pl-6 mb-8">
            <p className="text-[#d6b364] font-bold mb-2 uppercase tracking-wider text-xs sm:text-base">
              QUESTION {currentQ.id} SUR {questions.length}
            </p>
            <h2 className="text-xl sm:text-2xl font-bold text-black mb-6">
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
                        flex items-center gap-3 p-3 sm:p-4 rounded-xl border-2 transition-all text-left
                        ${isSelected ? 'bg-[#d6b364] text-white border-[#d6b364]' : 'bg-gray-50 border-gray-200 hover:border-[#d6b364] hover:bg-[#d6b364]/5'}
                      `}
                    >
                      <span className={`
                        flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-sm sm:text-base
                        ${isSelected ? 'bg-white text-[#d6b364]' : 'bg-gray-300 text-gray-700'}
                      `}>
                        {option.label}
                      </span>
                      <span className={`text-sm sm:text-base ${isSelected ? 'text-white' : 'text-gray-700'}`}>{option.value}</span>
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
                  className="w-full min-h-[120px] sm:min-h-[160px] p-3 sm:p-4 border-2 border-gray-200 rounded-xl focus:border-[#d6b364] focus:ring-2 focus:ring-[#d6b364]/20 focus:outline-none resize-y bg-white text-gray-900 text-sm sm:text-base"
                  autoComplete="off"
                  spellCheck="true"
                  rows={4}
                />
                <p className="text-xs sm:text-sm text-gray-500 mt-2">
                  {answers[`q${currentQ.id}`]?.length || 0} caractères
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation - Fixée en bas de la carte */}
        <div className="question-card-footer p-4 sm:p-6 border-t border-gray-100 bg-gray-50/50 flex justify-end items-center">
          {!isLastQuestion ? (
            <button
              onClick={handleNext}
              className="px-6 py-2.5 sm:px-8 sm:py-3 bg-[#d6b364] hover:bg-[#c6a85c] text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-xl active:scale-95 text-sm sm:text-base"
            >
              Suivant →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="w-full px-6 py-3 sm:px-8 sm:py-4 bg-[#d6b364] hover:bg-[#c6a85c] text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-xl active:scale-95 text-base sm:text-lg"
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

