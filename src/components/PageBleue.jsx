import React from 'react';
import { ArrowLeft } from 'lucide-react';

const PageBleue = ({ onBack, onNext }) => {
  return (
    <div className="h-screen w-screen bg-blue-500 text-white flex flex-col p-10 animate-in slide-in-from-right duration-300">
      <button 
        onClick={onBack}
        className="self-start flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors mb-10"
      >
        <ArrowLeft size={20} />
        Retour
      </button>

      <div className="flex-1 flex flex-col items-center justify-center gap-6">
        <h1 className="text-6xl font-bold mb-6">Bienvenue sur la Page Bleue</h1>
        <p className="text-2xl text-blue-100 max-w-2xl text-center mb-8">
          Ceci est une page entière dédiée au contenu bleu. Vous avez quitté le bureau pour entrer dans cet espace immersif.
        </p>
        
        {/* Bouton Suivant */}
        {onNext && (
          <button 
            onClick={onNext}
            className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg shadow-lg hover:scale-105 transition-transform"
          >
            Suivant →
          </button>
        )}
      </div>
    </div>
  );
};

export default PageBleue;
