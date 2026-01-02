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
        
        {/* Icône utilisateur centrée */}
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-blue-100 rounded-full border-2 border-blue-200 shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        </div>

        {/* Titre */}
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-2">
          Bienvenue
        </h1>
        <p className="text-center text-gray-600 mb-4 text-sm">
          Veuillez remplir vos informations pour commencer
        </p>
        
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
            Commencer
          </button>
        </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoginModal;

