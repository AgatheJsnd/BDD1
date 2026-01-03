import React, { useState, useEffect } from 'react';
import { getUserByEmail } from '../lib/userService';

// Mapping inverse pour retrouver les réponses depuis les personas
const personaToAnswer = {
  'Finance shark': 'A',
  'Growth Hacker': 'B',
  'Data Detective': 'C',
  'Tech builder': 'D',
  'Visionnary Founder': 'E',
  'Creative Alchemist': 'F'
};

// Mapping inverse pour la question 1 du post-it vert
const techApetiteQ1ToAnswer = {
  'Profil Data/Maths': 'A',
  'Profil Appliqué/Ingé': 'B',
  'Profil Littéraire/Créa': 'C',
  'Profil Smart/Resourceful': 'D'
};

const ResultsPage = ({ userEmail, onBack }) => {
  const [loading, setLoading] = useState(true);
  const [albertPercent, setAlbertPercent] = useState(0);
  const [eugeniaPercent, setEugeniaPercent] = useState(0);

  useEffect(() => {
    calculateResults();
  }, [userEmail]);

  const calculateResults = async () => {
    if (!userEmail) {
      console.error('Email non disponible');
      setLoading(false);
      return;
    }

    try {
      // Récupérer les données du candidat depuis Supabase
      const result = await getUserByEmail(userEmail);
      
      if (!result.success || !result.data) {
        console.error('Impossible de récupérer les données');
        setLoading(false);
        return;
      }

      const candidatData = result.data;
      let albertScore = 0;
      let eugeniaScore = 0;

      // Calculer les points du post-it bleu (3 questions)
      if (candidatData.persona_score && Array.isArray(candidatData.persona_score)) {
        candidatData.persona_score.forEach((persona) => {
          const answer = personaToAnswer[persona];
          if (answer) {
            // A, B, C -> 25% Albert
            if (['A', 'B', 'C'].includes(answer)) {
              albertScore += 25;
            }
            // D, E, F -> 25% Eugenia
            else if (['D', 'E', 'F'].includes(answer)) {
              eugeniaScore += 25;
            }
          }
        });
      }

      // Calculer les points du post-it vert (question 1 seulement)
      if (candidatData.tech_apetite) {
        // tech_apetite est une chaîne séparée par des virgules
        const techApetites = candidatData.tech_apetite.split(',').map(t => t.trim());
        
        // Prendre seulement le premier (question 1)
        if (techApetites.length > 0) {
          const q1TechApetite = techApetites[0];
          const answer = techApetiteQ1ToAnswer[q1TechApetite];
          
          if (answer) {
            // A, B -> 25% Albert
            if (['A', 'B'].includes(answer)) {
              albertScore += 25;
            }
            // C, D -> 25% Eugenia
            else if (['C', 'D'].includes(answer)) {
              eugeniaScore += 25;
            }
          }
        }
      }

      setAlbertPercent(albertScore);
      setEugeniaPercent(eugeniaScore);
      setLoading(false);
    } catch (error) {
      console.error('Erreur lors du calcul des résultats:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-screen bg-gradient-to-br from-yellow-400 via-orange-500 to-red-600 flex items-center justify-center">
        <div className="text-white text-2xl">Calcul en cours...</div>
      </div>
    );
  }

  const winner = albertPercent > eugeniaPercent ? 'Albert School' : 
                 eugeniaPercent > albertPercent ? 'Eugenia School' : 
                 'Égalité';

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-yellow-400 via-orange-500 to-red-600 flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full p-10 relative">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          Vos Résultats
        </h1>

        <div className="space-y-8">
          {/* Albert School */}
          <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200">
            <h2 className="text-2xl font-bold text-blue-900 mb-4">Albert School</h2>
            <div className="w-full bg-gray-200 rounded-full h-8 mb-2">
              <div 
                className="bg-blue-600 h-8 rounded-full flex items-center justify-center text-white font-bold transition-all duration-1000"
                style={{ width: `${albertPercent}%` }}
              >
                {albertPercent > 0 && `${albertPercent}%`}
              </div>
            </div>
            <p className="text-gray-600">{albertPercent}% de compatibilité</p>
          </div>

          {/* Eugenia School */}
          <div className="bg-purple-50 rounded-xl p-6 border-2 border-purple-200">
            <h2 className="text-2xl font-bold text-purple-900 mb-4">Eugenia School</h2>
            <div className="w-full bg-gray-200 rounded-full h-8 mb-2">
              <div 
                className="bg-purple-600 h-8 rounded-full flex items-center justify-center text-white font-bold transition-all duration-1000"
                style={{ width: `${eugeniaPercent}%` }}
              >
                {eugeniaPercent > 0 && `${eugeniaPercent}%`}
              </div>
            </div>
            <p className="text-gray-600">{eugeniaPercent}% de compatibilité</p>
          </div>

          {/* Résultat */}
          <div className="text-center mt-8">
            <p className="text-xl text-gray-700 mb-2">École recommandée :</p>
            <p className="text-3xl font-bold text-gray-900">
              {winner}
            </p>
          </div>

          {/* Bouton Retour */}
          <div className="flex justify-center mt-8">
            <button
              onClick={onBack}
              className="px-8 py-3 bg-gray-800 hover:bg-gray-900 text-white rounded-xl font-semibold transition-colors shadow-lg"
            >
              Retour au bureau
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;

