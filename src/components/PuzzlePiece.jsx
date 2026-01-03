import React, { useId } from 'react';

const PuzzlePiece = ({
  color,
  blobRadius = '50%',
  label,
  labelFill = '#ffd9df',
  labelGlowRgb = '255,92,92',
  position,
  rotation = 0,
  onClick,
  isClickable = false,
  isHeartbeat = false,
  sizeClass = 'w-56 h-56', // responsive sizing
}) => {
  const uid = useId().replace(/:/g, '');
  const glowFilterId = `numGlow-${uid}`;

  return (
    <div 
      className={`relative z-10 puzzle-piece ${isClickable ? 'cursor-pointer transition-transform duration-200 hover:scale-110 active:scale-95' : ''}`}
      style={{
        position: position.x === 0 && position.y === 0 ? 'relative' : 'absolute',
        top: position.y !== 0 ? `${position.y}px` : 'auto',
        left: position.x !== 0 ? `${position.x}px` : 'auto',
        transform: position.x !== 0 || position.y !== 0 ? `translate(-50%, -50%) rotate(${rotation}deg)` : `rotate(${rotation}deg)`,
      }}
      onClick={onClick}
    >
      {/* Ondes discrètes derrière (battement) - déplacées AVANT le blob pour être derrière */}
      {isHeartbeat && (
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: -1 }}>
          <div
            className="absolute inset-0 animate-ripple"
            style={{
              borderRadius: blobRadius,
              border: '2px solid rgba(0,0,0,0.12)',
            }}
          />
          <div
            className="absolute inset-0 animate-ripple"
            style={{
              animationDelay: '0.55s',
              borderRadius: blobRadius,
              border: '2px solid rgba(0,0,0,0.08)',
            }}
          />
        </div>
      )}

      {/* Tache (blob) remplie avec les couleurs à l'intérieur */}
      <div
        className={`relative puzzle-piece__blob ${sizeClass} ${color} ${isHeartbeat ? 'animate-impulse' : ''}`}
        style={{
          borderRadius: blobRadius,
          boxShadow: '0 18px 28px rgba(0,0,0,0.18)',
        }}
      />

      {/* Reflet doux (donne un rendu “illustration”) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          borderRadius: blobRadius,
          background:
            'linear-gradient(135deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.18) 35%, rgba(255,255,255,0) 70%)',
        }}
      />

      {/* Numéro centré */}
      {label != null && (
        <div className={`absolute inset-0 flex items-center justify-center pointer-events-none ${isHeartbeat ? 'animate-impulse' : ''}`}>
          <svg
            className="w-full h-full p-[15%]"
            viewBox="0 0 160 160"
            style={{ overflow: 'visible' }}
            aria-hidden="true"
          >
            <defs>
              {/* Glow rose comme la capture */}
              <filter id={glowFilterId} x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow
                  dx="0"
                  dy="0"
                  stdDeviation="3.5"
                  floodColor={`rgb(${labelGlowRgb})`}
                  floodOpacity="0.55"
                />
                <feDropShadow
                  dx="0"
                  dy="0"
                  stdDeviation="10"
                  floodColor={`rgb(${labelGlowRgb})`}
                  floodOpacity="0.25"
                />
                <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="rgb(0,0,0)" floodOpacity="0.12" />
              </filter>
            </defs>

            <text
              x="50%"
              y="50%"
              textAnchor="middle"
              dominantBaseline="central"
              fill={labelFill}
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 700,
                fontSize: 100,
              }}
              filter={`url(#${glowFilterId})`}
            >
              {label}
            </text>
          </svg>
        </div>
      )}
    </div>
  );
};

export default PuzzlePiece;
