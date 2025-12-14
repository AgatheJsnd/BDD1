import React from 'react';

const PieceRed = ({ position, rotation = 0, isDragging = false, onMouseDown }) => {
  return (
    <div 
      className={`absolute transition-none ${isDragging ? 'z-50' : 'z-10'}`}
      style={{
        top: `${position.y}px`,
        left: `${position.x}px`,
        transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
      onMouseDown={onMouseDown}
    >
      <div 
        className={`w-40 h-40 shadow-2xl rounded-xl transition-all duration-200 bg-red-500 ${
          isDragging ? 'scale-110 brightness-110' : 'hover:scale-105'
        }`}
      >
        <div className="w-full h-full rounded-xl border-4 border-white/20 shadow-inner"></div>
      </div>
    </div>
  );
};

export default PieceRed;

