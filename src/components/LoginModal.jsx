import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LoginModal = ({ isOpen, onClose, onLogin }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [classe, setClasse] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (firstName && lastName && email && classe) {
      onLogin({ firstName, lastName, email, classe });
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
        
        {/* Deux logos design Favicon côte à côte avec les couleurs originales */}
        <div className="flex justify-center items-center gap-8 mb-4">
          {/* Logo Gauche (Design Favicon avec couleurs Jaune et Rouge) */}
          <svg width="80" height="80" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-20 w-20">
            {/* Grand cercle */}
            <circle cx="17.5" cy="16" r="13.5" fill="#D4AF37"/>
            {/* Petit cercle : plus petit (r=4) et plus à gauche (cx=5.5) */}
            <circle cx="5.5" cy="16" r="4" fill="#8B0000" stroke="#5a0000" stroke-width="0.5"/>
          </svg>

          {/* Croix de collaboration (feat) */}
          <div className="text-gray-600 font-light text-4xl flex items-center justify-center pb-1">
            ×
          </div>

          {/* Logo Droite (Design Favicon avec couleurs Bleu Clair et Bleu Foncé) */}
          <svg width="80" height="80" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-20 w-20">
            {/* Grand cercle */}
            <circle cx="17.5" cy="16" r="13.5" fill="#87CEEB"/>
            {/* Petit cercle : plus petit (r=4) et plus à gauche (cx=5.5) */}
            <circle cx="5.5" cy="16" r="4" fill="#1E3A8A" stroke="#0e1d45" stroke-width="0.5"/>
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
          
          <div className="space-y-1.5">
            <label htmlFor="classe" className="block text-xs font-semibold text-gray-700 uppercase tracking-wide">Votre classe</label>
            <div className="relative">
              <select
                id="classe"
                value={classe}
                onChange={(e) => setClasse(e.target.value)}
                required
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm bg-gray-50 appearance-none"
              >
                <option value="">Votre classe</option>
                <option value="Seconde">Seconde</option>
                <option value="Première">Première</option>
                <option value="Terminal Général">Terminal Général</option>
                <option value="Terminal STMG">Terminal STMG</option>
                <option value="Terminal Pro">Terminal Pro</option>
                <option value="BTS">BTS</option>
                <option value="Bac+3">Bac+3</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
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

