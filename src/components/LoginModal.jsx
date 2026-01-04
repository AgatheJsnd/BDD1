import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LoginModal = ({ isOpen, onClose, onLogin }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (firstName && lastName && email) {
      onLogin({ firstName, lastName, email });
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div 
            className="bg-white/90 backdrop-blur-md w-full max-w-md rounded-2xl shadow-2xl p-8 m-4 relative"
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
        
        {/* Icônes deux cercles qui se chevauchent */}
        <div className="flex justify-center items-center gap-4 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20" viewBox="0 0 100 100">
            {/* Grand cercle jaune moutarde */}
            <circle cx="60" cy="50" r="35" fill="#D4AF37" />
            {/* Petit cercle rouge foncé qui chevauche */}
            <circle cx="30" cy="50" r="20" fill="#8B0000" />
          </svg>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20" viewBox="0 0 100 100">
            {/* Grand cercle jaune moutarde */}
            <circle cx="60" cy="50" r="35" fill="#D4AF37" />
            {/* Petit cercle rouge foncé qui chevauche */}
            <circle cx="30" cy="50" r="20" fill="#8B0000" />
          </svg>
        </div>

        {/* Titre */}
        <h1 className="text-sm text-center text-gray-800 mb-4">
          Bienvenue sur le test qui va t'aider à choisir ton école
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-4">
            <div className="space-y-1.5 flex-1">
              <label htmlFor="firstName" className="block text-xs font-semibold text-gray-700 uppercase tracking-wide">Prénom</label>
              <input
                type="text"
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Prénom"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm bg-gray-50"
              />
            </div>

            <div className="space-y-1.5 flex-1">
              <label htmlFor="lastName" className="block text-xs font-semibold text-gray-700 uppercase tracking-wide">Nom</label>
              <input
                type="text"
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Nom"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm bg-gray-50"
              />
            </div>
          </div>
          
          <div className="space-y-1.5">
            <label htmlFor="email" className="block text-xs font-semibold text-gray-700 uppercase tracking-wide">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm bg-gray-50"
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-200 font-bold text-sm shadow-md hover:shadow-lg transform active:scale-98 mt-6"
          >
            Je me lance
          </button>
        </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoginModal;

