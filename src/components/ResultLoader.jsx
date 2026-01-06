import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AlbertLogo = ({ size = "scale-75" }) => (
  <div className={`flex items-center gap-2 ${size}`}>
    <div className="relative">
      <div className="w-10 h-10 rounded-full bg-[#68A3E0]" />
      <div className="absolute left-[-3px] top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-black border-2 border-white" />
    </div>
    <div className="flex items-baseline">
      <span className="text-2xl font-bold tracking-tighter text-black uppercase" style={{ fontFamily: 'Arial, sans-serif' }}>Albert</span>
      <span className="text-2xl font-light tracking-tighter text-black uppercase ml-1" style={{ fontFamily: 'Arial, sans-serif' }}>School</span>
    </div>
  </div>
);

const EugeniaLogo = ({ size = "scale-75" }) => (
  <div className={`flex items-center gap-2 ${size}`}>
    <div className="relative">
      <div className="w-10 h-10 rounded-full bg-[#D4AF37]" />
      <div className="absolute left-[-4px] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#731024]" />
    </div>
    <div className="flex items-baseline">
      <span className="text-2xl font-bold tracking-tighter text-[#731024] uppercase" style={{ fontFamily: 'Arial, sans-serif' }}>Eugenia</span>
      <span className="text-2xl font-normal tracking-tighter text-[#731024] uppercase ml-1" style={{ fontFamily: 'Arial, sans-serif' }}>School</span>
    </div>
  </div>
);

const ResultLoader = () => {
  const [index, setIndex] = useState(0);
  const logos = [
    { type: 'albert', key: 'albert-1' },
    { type: 'eugenia', key: 'eugenia-1' }
  ];

  useEffect(() => {
    // 3 secondes total / 2 logos = 1.5s par logo
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % logos.length);
    }, 1500);
    return () => clearInterval(interval);
  }, [logos.length]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-gray-50/98 backdrop-blur-xl"
    >
      <div className="w-full max-w-lg flex flex-col items-center space-y-4">
        {/* Carousel Container */}
        <div className="relative h-20 w-full flex items-center justify-center overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={logos[index].key}
              initial={{ x: 60, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -60, opacity: 0 }}
              transition={{ 
                duration: 0.5, 
                ease: [0.4, 0, 0.2, 1] 
              }}
              className="absolute"
            >
              {logos[index].type === 'albert' ? <AlbertLogo /> : <EugeniaLogo />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Loading Bar */}
        <div className="flex flex-col items-center w-full max-w-xs px-6">
          <div className="w-full h-[2px] bg-gray-200/60 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gray-800"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 3, ease: "linear" }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ResultLoader;

