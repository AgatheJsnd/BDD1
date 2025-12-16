import React from 'react';

const PuzzlePiece = ({ color, position, rotation = 0 }) => {
  return (
    <div 
      className="absolute z-10"
      style={{
        top: `${position.y}px`,
        left: `${position.x}px`,
        transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
      }}
    >
      {/* Bloc simple (carré) sans interaction */}
      <div 
        className={`w-40 h-40 shadow-2xl rounded-xl ${color}`}
      >
        {/* Effet de bordure/lumière interne pour le style */}
        <div className="w-full h-full rounded-xl border-4 border-white/20 shadow-inner pointer-events-none"></div>
      </div>
    </div>
  );
};

export default PuzzlePiece;
