import React from 'react';

const PuzzlePiece = ({ color, position, rotation = 0, onClick }) => {
  return (
    <div 
      className="absolute z-10 transition-transform duration-200 hover:scale-105 active:scale-95 cursor-pointer"
      style={{
        top: `${position.y}px`,
        left: `${position.x}px`,
        transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
      }}
      onClick={onClick}
    >
      {/* Bloc simple (carré) avec effet de clic */}
      <div 
        className={`w-40 h-40 shadow-2xl rounded-xl transition-all duration-75 active:brightness-125 ${color}`}
      >
        {/* Effet de bordure/lumière interne pour le style */}
        <div className="w-full h-full rounded-xl border-4 border-white/20 shadow-inner pointer-events-none"></div>
      </div>
    </div>
  );
};

export default PuzzlePiece;
