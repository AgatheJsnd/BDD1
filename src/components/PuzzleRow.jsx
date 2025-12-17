import React from 'react';

const PuzzleRow = () => {
  return (
    <div className="flex justify-center items-center h-full">
      <div className="flex gap-[10px]">
        {/* Pièce 1 */}
        <div 
          className="w-[100px] h-[100px] bg-[#d9d9d9] rounded-lg relative cursor-grab rounded-l-2xl"
          style={{
            clipPath: "path('M 0,0 L 100,0 L 100,50 A 15,15 0 0 1 85,65 L 85,100 L 0,100 Z')"
          }}
          draggable="true"
        >
          {/* Pseudo-élément ::before simulé pour le creux/bosse */}
          <div className="absolute w-[30px] h-[30px] bg-[#f5f5f5] rounded-full left-1/2 -top-[15px] -translate-x-1/2"></div>
        </div>

        {/* Pièce 2 */}
        <div 
          className="w-[100px] h-[100px] bg-[#d9d9d9] rounded-lg relative cursor-grab"
          draggable="true"
        >
          {/* ::before */}
          <div className="absolute w-[30px] h-[30px] bg-[#f5f5f5] rounded-full -left-[15px] top-1/2 -translate-y-1/2"></div>
          {/* ::after */}
          <div className="absolute w-[30px] h-[30px] bg-[#f5f5f5] rounded-full -right-[15px] top-1/2 -translate-y-1/2"></div>
        </div>

        {/* Pièce 3 */}
        <div 
          className="w-[100px] h-[100px] bg-[#d9d9d9] rounded-lg relative cursor-grab rounded-r-2xl"
          style={{
            clipPath: "path('M 15,0 L 100,0 L 100,100 L 0,100 L 0,50 A 15,15 0 0 1 15,35 Z')"
          }}
          draggable="true"
        >
          {/* ::before */}
          <div className="absolute w-[30px] h-[30px] bg-[#f5f5f5] rounded-full left-1/2 top-full -translate-x-1/2"></div>
        </div>
      </div>
    </div>
  );
};

export default PuzzleRow;
