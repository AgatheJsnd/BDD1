import React from 'react';
import { ArrowLeft } from 'lucide-react';

const PageRouge = ({ onBack }) => {
  return (
    <div className="h-screen w-screen bg-red-500 text-white flex flex-col p-10 animate-in slide-in-from-right duration-300">
      <button 
        onClick={onBack}
        className="self-start flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors mb-10"
      >
        <ArrowLeft size={20} />
        Retour
      </button>

      <div className="flex-1 flex flex-col items-center justify-center gap-6">
        <h1 className="text-6xl font-bold mb-6">Page Rouge</h1>
        <p className="text-2xl text-red-100 max-w-2xl text-center">
          Attention : 3 notifications importantes !
        </p>
      </div>
    </div>
  );
};

export default PageRouge;

