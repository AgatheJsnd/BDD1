import React from 'react';
import { ArrowLeft } from 'lucide-react';

const PageBleue = ({ onBack, onNext }) => {
  return (
    <div className="h-screen w-screen bg-gradient-to-br from-blue-600 via-blue-500 to-blue-700 flex items-center justify-center p-6 animate-in fade-in duration-300">
      {/* Bouton Retour */}
      <button 
        onClick={onBack}
        className="absolute top-8 left-8 flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-white"
      >
        <ArrowLeft size={20} />
        Retour
      </button>

      {/* Carte de la Page Bleue */}
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full p-10 relative">
        {/* Titre */}
        <h1 className="text-4xl font-bold text-center mb-8 text-blue-900">
          Bienvenue sur la Page Bleue
        </h1>

        {/* Bordure bleue à gauche */}
        <div className="border-l-8 border-blue-500 pl-6 mb-8">
          <p className="text-blue-600 font-semibold mb-2">
            CONTENU
          </p>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Ceci est une page entière dédiée au contenu bleu. Vous avez quitté le bureau pour entrer dans cet espace immersif.
          </h2>
        </div>

        {/* Navigation */}
        {onNext && (
          <div className="flex justify-end items-center mt-8">
            <button
              onClick={onNext}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
            >
              Suivant →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PageBleue;
