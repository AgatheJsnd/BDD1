import React from 'react';

const PuzzleRow = () => {
  // Définition de la courbe du connecteur pour qu'elle s'emboîte parfaitement
  // On utilise la même courbe pour le "mâle" et le "femelle"
  const connectorCurve = "l 0 -35 c 20 0 35 -15 35 -35 s -15 -35 -35 -35 l 0 -35";
  const connectorCurveInverse = "l 0 35 c 20 0 35 15 35 35 s -15 35 -35 35 l 0 35";

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f0f0f0] p-8">
      <div className="flex relative drop-shadow-xl">
        
        {/* Pièce 1 : Gauche (Kraft) */}
        <div className="relative z-10 w-48 h-48 -mr-8">
          <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-md">
            <defs>
              <filter id="kraftNoise">
                <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
                <feColorMatrix type="saturate" values="0" />
                <feComponentTransfer>
                  <feFuncA type="linear" slope="0.4" />
                </feComponentTransfer>
                <feBlend mode="multiply" in2="SourceGraphic" />
              </filter>
            </defs>
            <path
              d={`M 10 30 L 160 30 ${connectorCurve} L 160 170 L 10 170 Z`}
              fill="#c6a482" // Couleur Kraft
              stroke="#a88b6d"
              strokeWidth="2"
              style={{ filter: "url(#kraftNoise)" }}
            />
          </svg>
        </div>

        {/* Pièce 2 : Milieu (Gris) */}
        <div className="relative z-20 w-48 h-48 -mr-8">
          <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-md">
            <defs>
              <filter id="greyNoise">
                <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="3" stitchTiles="stitch" />
                <feColorMatrix type="saturate" values="0" />
                <feBlend mode="multiply" in2="SourceGraphic" />
              </filter>
            </defs>
            <path
              d={`M 45 30 L 160 30 ${connectorCurve} L 160 170 L 45 170 ${connectorCurve} Z`}
              // Le deuxième connectorCurve dessine le creux à gauche car on revient vers le point de départ
              // Mais attention, il faut inverser la logique pour un creux.
              // Réécriture du path pour être précis :
              // Haut -> Droite (Bosse) -> Bas -> Gauche (Creux) -> Haut
              d={`M 45 30 
                 L 160 30 
                 l 0 35 c 20 0 35 15 35 35 s -15 35 -35 35 l 0 35
                 L 45 170
                 l 0 -35 c 20 0 35 -15 35 -35 s -15 -35 -35 -35 l 0 -35
                 Z`}
              fill="#b0b5b9" // Gris texturé
              stroke="#8e9499"
              strokeWidth="2"
              style={{ filter: "url(#greyNoise)" }}
            />
          </svg>
        </div>

        {/* Pièce 3 : Droite (Blanc cassé) */}
        <div className="relative z-0 w-48 h-48">
          <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-md">
             <defs>
              <filter id="whiteNoise">
                <feTurbulence type="fractalNoise" baseFrequency="0.5" numOctaves="3" />
                <feColorMatrix type="matrix" values="0 0 0 0 0.95  0 0 0 0 0.95  0 0 0 0 0.9   0 0 0 0.2 0" />
                <feBlend mode="multiply" in2="SourceGraphic" />
              </filter>
            </defs>
            <path
              // Haut -> Droite (Droit) -> Bas -> Gauche (Creux) -> Haut
               d={`M 45 30 
                 L 190 30 
                 L 190 170
                 L 45 170
                 l 0 -35 c 20 0 35 -15 35 -35 s -15 -35 -35 -35 l 0 -35
                 Z`}
              fill="#fdfcf5" // Blanc cassé
              stroke="#e0e0d5"
              strokeWidth="2"
              style={{ filter: "url(#whiteNoise)" }}
            />
          </svg>
        </div>

      </div>
    </div>
  );
};

export default PuzzleRow;
