import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ResumeNotification = ({ isOpen, onReturnHome, onContinue }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="bg-white/95 backdrop-blur-md w-full max-w-md rounded-2xl shadow-2xl p-8 m-4 relative"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 25,
              duration: 0.4
            }}
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
              Reprendre votre quiz ?
            </h2>
            <p className="text-gray-600 mb-6 text-center">
              Vous avez déjà commencé un quiz. Voulez-vous continuer où vous vous êtes arrêté ou retourner à l'accueil ?
            </p>
            
            <div className="flex flex-col gap-3">
              <button
                onClick={onContinue}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-200 font-bold text-sm shadow-md hover:shadow-lg transform active:scale-98"
              >
                Continuez
              </button>
              <button
                onClick={onReturnHome}
                className="w-full bg-gray-300 text-gray-800 py-3 px-6 rounded-lg hover:bg-gray-400 transition duration-200 font-bold text-sm shadow-md hover:shadow-lg transform active:scale-98"
              >
                Accueil
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ResumeNotification;

