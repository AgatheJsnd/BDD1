import React from 'react';
import { ArrowLeft } from 'lucide-react';

const PageVerte = ({ onBack, onNext }) => {
  return (
    <div className="h-screen w-screen bg-green-500 text-white flex flex-col p-10">
      <button 
        onClick={onBack}
        className="self-start flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors mb-10"
      >
        <ArrowLeft size={20} />
        Retour
      </button>

      <div className="flex-1 flex flex-col items-center justify-center gap-6">
        <h1 className="text-6xl font-bold mb-6">Page Verte</h1>
        <p className="text-2xl text-green-100 max-w-2xl text-center mb-8">
          Tous les systèmes sont opérationnels.
        </p>
        
        <button 
          onClick={onNext}
          className="px-6 py-3 bg-white text-green-600 font-semibold rounded-lg shadow-lg hover:scale-105 transition-transform"
        >
          Suivant →
        </button>
      </div>
    </div>
  );
};

export default PageVerte;

