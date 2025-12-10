import React from 'react';

const PuzzlePiece = ({ color, position, rotation = 0, isDragging = false, onMouseDown }) => {
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
      <svg
        width="120"
        height="120"
        viewBox="0 0 120 120"
        className={`drop-shadow-2xl transition-all duration-200 ${
          isDragging ? 'scale-110 brightness-110' : 'hover:scale-105'
        } ${color}`}
      >
        {/* Pièce de puzzle avec forme réaliste */}
        <path
          d="M 20 20 
             L 50 20 
             Q 55 10, 60 20 
             Q 65 30, 60 40 
             Q 55 50, 50 40 
             L 20 40 
             L 20 70 
             Q 10 75, 20 80 
             Q 30 85, 40 80 
             Q 50 75, 40 70 
             L 40 100 
             L 100 100 
             L 100 70 
             Q 110 75, 100 60 
             Q 90 55, 100 50 
             Q 110 45, 100 40 
             L 100 20 
             L 70 20 
             Q 75 10, 60 20 
             Q 65 30, 70 20 
             Z"
          className="fill-current"
        />
      </svg>
    </div>
  );
};

export default PuzzlePiece;

