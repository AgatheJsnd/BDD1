import React from 'react';

const DesktopIcon = ({ Icon, label }) => {
  return (
    <div className="flex flex-col items-center justify-center w-20 p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-white/10 group">
      <Icon 
        className="w-12 h-12 text-white drop-shadow-lg mb-2 transition-transform group-hover:scale-110" 
        strokeWidth={1.5}
      />
      <span className="text-white text-xs text-center font-medium drop-shadow-lg">
        {label}
      </span>
    </div>
  );
};

export default DesktopIcon;

