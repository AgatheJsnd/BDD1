import React from 'react';

const PuzzlePiece = ({ color, position, rotation = 0, isDragging = false, onMouseDown }) => {
  return (
    <div 
      className={`absolute transition-none ${isDragging ? 'z-50' : 'z-10'}`}
      style={{
        top: `${position.y}px`,
        left: `${position.x}px`,
        transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
        // Curseur pointer pour indiquer que c'est cliquable
        cursor: isDragging ? 'grabbing' : 'pointer', 
      }}
      onMouseDown={onMouseDown}
    >
      {/* Bloc simple (carré) avec effet de clic (active) */}
      <div 
        className={`w-40 h-40 shadow-2xl rounded-xl transition-all duration-75 
          ${isDragging ? 'scale-110 brightness-110' : 'hover:scale-105 active:scale-95 active:brightness-125'} 
          ${color}`}
      >
        {/* Effet de bordure/lumière interne pour le style */}
        <div className="w-full h-full rounded-xl border-4 border-white/20 shadow-inner pointer-events-none"></div>
      </div>
    </div>
  );
};

export default PuzzlePiece;
