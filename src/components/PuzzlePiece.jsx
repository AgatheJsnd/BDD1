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
      className={`absolute z-10 ${isClickable ? 'cursor-pointer transition-transform duration-200 hover:scale-110 active:scale-95' : ''}`}
      style={{
        top: `${position.y}px`,
        left: `${position.x}px`,
        transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
      }}
      onClick={onClick}
    >
      {/* Ondes discrètes derrière (battement) */}
      {isHeartbeat && (
        <>
          <div
            className="absolute inset-0 animate-ripple pointer-events-none"
            style={{
              borderRadius: blobRadius,
              border: '2px solid rgba(0,0,0,0.12)',
            }}
          />
          <div
            className="absolute inset-0 animate-ripple pointer-events-none"
            style={{
              animationDelay: '0.55s',
              borderRadius: blobRadius,
              border: '2px solid rgba(0,0,0,0.08)',
            }}
          />
        </>
      )}

      {/* Tache (blob) remplie avec les couleurs à l'intérieur */}
      <div
        className={`relative ${sizeClass} ${color} ${isHeartbeat ? 'animate-impulse' : ''}`}
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
            width="160"
            height="160"
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
              y="58%"
              textAnchor="middle"
              dominantBaseline="middle"
              fill={labelFill}
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 700,
                fontSize: 110,
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
