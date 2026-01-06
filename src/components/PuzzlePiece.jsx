import React, { useId, useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

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
  const pieceRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // Déterminer la couleur de glow selon le labelGlowRgb
  const getGlowColor = () => {
    const [r, g, b] = labelGlowRgb.split(',').map(n => parseInt(n.trim()));
    return `rgba(${r}, ${g}, ${b}, 0.6)`;
  };

  const isAbsolute = position.x !== 0 || position.y !== 0;
  const baseTransform = isAbsolute 
    ? `translate(-50%, -50%) rotate(${rotation}deg)` 
    : `rotate(${rotation}deg)`;

  // Effet tilt 3D uniquement (pas de mouvement magnétique)
  useEffect(() => {
    if (!isClickable) {
      setTilt({ x: 0, y: 0 });
      return;
    }

    const handleMouseMove = (e) => {
      if (!pieceRef.current || !isHovered) return;

      const rect = pieceRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const mouseX = e.clientX - centerX;
      const mouseY = e.clientY - centerY;

      // Effet tilt 3D uniquement
      const maxTilt = 12;
      const tiltX = (mouseY / (rect.height / 2)) * maxTilt;
      const tiltY = (mouseX / (rect.width / 2)) * -maxTilt;
      setTilt({ x: tiltX, y: tiltY });
    };

    const handleMouseEnter = () => {
      setIsHovered(true);
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
      setTilt({ x: 0, y: 0 });
    };

    if (isHovered) {
      window.addEventListener('mousemove', handleMouseMove);
    }
    
    if (pieceRef.current) {
      pieceRef.current.addEventListener('mouseenter', handleMouseEnter);
      pieceRef.current.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (pieceRef.current) {
        pieceRef.current.removeEventListener('mouseenter', handleMouseEnter);
        pieceRef.current.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [isClickable, isHovered]);

  // Tilt 3D uniquement, sans scale ni translateZ pour éviter tout mouvement
  const tiltTransform = isHovered 
    ? `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`
    : '';

  // Transform final - baseTransform reste fixe, seul le tilt s'applique
  const finalTransform = tiltTransform 
    ? `${baseTransform} ${tiltTransform}`.trim()
    : baseTransform;

  return (
    <div 
      ref={pieceRef}
      className={`relative z-10 puzzle-piece ${isClickable ? 'puzzle-piece-hover' : ''} ${isAbsolute ? 'puzzle-piece-absolute' : ''}`}
      style={{
        position: isAbsolute ? 'absolute' : 'relative',
        top: isAbsolute ? `${position.y}px` : 'auto',
        left: isAbsolute ? `${position.x}px` : 'auto',
        transform: finalTransform,
        '--glow-color': getGlowColor(),
        transformStyle: 'preserve-3d',
        transition: isHovered ? 'none' : 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
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

      {/* Tache (blob) avec effet glassmorphism */}
      <div
        className={`relative puzzle-piece__blob ${sizeClass} ${color} ${isHeartbeat ? 'animate-impulse' : ''}`}
        style={{
          borderRadius: blobRadius,
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 18px 28px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255, 255, 255, 0.5)',
          opacity: 0.85,
          overflow: 'hidden',
        }}
      >
      </div>

      {/* Reflet doux (donne un rendu “illustration”) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          borderRadius: blobRadius,
          background:
            'linear-gradient(135deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.18) 35%, rgba(255,255,255,0) 70%)',
        }}
      />

      {/* Numéro centré avec changement de couleur au hover */}
      {label != null && (
        <motion.div 
          className={`absolute inset-0 flex items-center justify-center pointer-events-none ${isHeartbeat ? 'animate-impulse' : ''}`}
          style={{ zIndex: 2 }}
        >
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

            <motion.text
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
            </motion.text>
          </svg>
        </motion.div>
      )}

    </div>
  );
};

export default PuzzlePiece;
