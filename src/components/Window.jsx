import React from 'react';
import { X } from 'lucide-react';

const Window = ({ title, content, onClose, color, hasActionButton }) => {
  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 bg-white rounded-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 z-50">
      {/* Barre de titre */}
      <div className={`h-10 ${color} flex items-center justify-between px-4`}>
        <span className="text-white font-medium">{title}</span>
        <button 
          onClick={(e) => {
            e.stopPropagation(); // Empêche le clic de traverser
            onClose();
          }}
          className="text-white/80 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>
      </div>
      
      {/* Contenu */}
      <div className="p-6 text-gray-700 flex flex-col gap-4">
        <div>{content}</div>
        
        {/* Bouton d'action optionnel */}
        {hasActionButton && (
          <div className="flex justify-end pt-2">
            <button 
              className={`px-4 py-2 rounded text-white font-medium shadow-md transition-transform hover:scale-105 active:scale-95 ${color}`}
              onClick={() => alert("Action déclenchée !")} // Action par défaut pour l'exemple
            >
              Suivant →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Window;
